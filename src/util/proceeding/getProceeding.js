import orbiterCore from '../../orbiterCore'
import { store } from '../../store'
import openApiAx from '../../common/openApiAx'
import util from '../util'

const storeUpdateProceedState = (state) => {
  store.commit('updateProceedState', state)
}

function confirmUserTransaction(hash) {
  let currentStatus = 1
  const cron = setInterval(async () => {
    try {
      const { status, txList } = await openApiAx.get(`/status?hash=${hash}`)
      util.log('txStatus', status, 'txList', txList)
      switch (status) {
        case 0: {
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
        case 1: {
          storeUpdateProceedState(4)
          break
        }
        case 99: {
          storeUpdateProceedState(5)
          clearInterval(cron)
          break
        }
      }
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
    } catch (e) {
      console.error(e)
    }
  }, 20 * 1000)
  return cron
}

export default {
  UserTransferReady(user, maker, amount, localChainID, txHash) {
    if (localChainID === 4 || localChainID === 44) {
      txHash = util.starknetHashFormat(txHash);
    }
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
    return confirmUserTransaction(txHash)
  },
}
