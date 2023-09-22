import orbiterCore from '../../orbiterCore'
import { store } from '../../store'
import { RequestMethod, requestOpenApi } from '../../common/openApiAx';
import util from '../util'
import { CHAIN_ID } from "../../config";

const storeUpdateProceedState = (state) => {
  store.commit('updateProceedState', state)
}

let cron;

function confirmUserTransaction(chainId, userAddress, hash, isV3) {
  let currentStatus = 1;
  if (cron) {
    clearInterval(cron);
  }
   cron = setInterval(async () => {
     if (isV3 && currentStatus === 1) {
       const receipt = await util.requestWeb3(chainId, 'getTransactionReceipt', hash);
       if (receipt?.status) {
         util.log("rpc confirm fromTx ====", receipt);
         currentStatus = 2;
         storeUpdateProceedState(2);
       }
       return;
     }
    try {
      const { status, txList = [] } = await requestOpenApi(RequestMethod.getTransactionByHash, [hash], isV3) || {};
      util.log('txStatus', status, 'txList', txList)
      for (const tx of txList) {
        if (tx.side === 0) {
          store.commit(
              'updateProceedingUserTransferTimeStamp',
              new Date(tx.timestamp).valueOf() / 1000
          )
        }
        if (tx.side === 1) {
          store.commit('updateProceedingMakerTransferTxid', tx.hash)
        }
      }
      switch (status) {
        case 0:
        case 1: {
          if (currentStatus === 2) {
            storeUpdateProceedState(3)
          } else {
            const tx = txList.find((item) => item.side === 0)
            if (tx) {
              currentStatus = 2
              storeUpdateProceedState(2)
            }
          }
          break
        }
        case 98: {
          storeUpdateProceedState(4)
          break
        }
        case 99: {
          completeTx(userAddress);
          break
        }
      }
      if (isV3 && status === 98) {
        const toTx = txList.find(item => item.side === 1);
        if (toTx?.hash) {
          const receipt = await util.requestWeb3(toTx.chainId, 'getTransactionReceipt', toTx.hash);
          if (receipt?.status) {
            util.log("rpc confirm toTx ====", receipt);
            completeTx(userAddress);
          }
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, 10 * 1000);
}

function completeTx(userAddress) {
  util.setCache(`history_${ userAddress.toLowerCase() }_1`, '', -1);
  clearInterval(cron);
  storeUpdateProceedState(5);
}

export default {
  UserTransferReady(user, maker, amount, localChainID, txHash, isV3) {
    util.setCache(`history_${ user.toLowerCase() }_1`, '', -1);
    if (localChainID === CHAIN_ID.starknet || localChainID === CHAIN_ID.starknet_test) {
      txHash = util.starknetHashFormat(txHash);
    }
    if (localChainID === CHAIN_ID.zksync || localChainID === CHAIN_ID.zksync_test) {
      txHash = txHash.replace('sync-tx:', '0x');
    }
    console.log(txHash);
    store.commit('updateProceedTxID', txHash)
    store.commit('updateProceedingUserTransferFrom', user)
    store.commit('updateProceedingUserTransferTo', maker)
    let realAmount = orbiterCore.getRAmountFromTAmount(localChainID, amount)

    if (realAmount.state) {
      realAmount = realAmount.rAmount
    } else {
      throw new Error(`UserTransferReady error: ${realAmount.error}`)
    }
    store.commit('updateProceedingUserTransferAmount', realAmount)
    store.commit('updateProceedingUserTransferLocalChainID', localChainID)
    store.commit('updateProceedingUserTransferTxid', txHash)
    // console.log(txHash)
    confirmUserTransaction(localChainID, user, txHash, isV3);
  },
}
