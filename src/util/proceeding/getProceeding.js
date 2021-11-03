import Web3 from 'web3'

import { store } from '../../store'
import { localWeb3 } from '../constants/contract/localWeb3.js'
import { Coin_ABI } from '../constants/contract/contract.js'
import orbiterCore from '../../orbiterCore'
import thirdapi from '../../core/actions/thirdapi'
import Bignumber from 'bignumber.js'

async function confirmUserTransaction(
  localChainID,
  makerInfo,
  txHash,
  confirmations = 1,
) {
  store.commit('updateProceedingUserTransferLocalChainID', localChainID)
  store.commit('updateProceedingUserTransferTxid', txHash)
  setTimeout(async () => {
    if (!isCurrentTransaction(txHash)) {
      return
    }
    if (localChainID === 3 || localChainID === 33) {
      var req = {
        txHash: txHash,
        localChainID: localChainID,
      }
      try {
        let zkTransactionData = await thirdapi.getZKTransactionData(req)
        if (
          zkTransactionData.status === 'success' &&
          zkTransactionData.result.tx.failReason === null &&
          zkTransactionData.result.tx.op.type === 'Transfer' &&
          (zkTransactionData.result.tx.status === 'committed' ||
            zkTransactionData.result.tx.status === 'finalized')
        ) {
          let time = zkTransactionData.result.tx.createdAt
          let zk_amount = orbiterCore.getRAmountFromTAmount(
            localChainID,
            zkTransactionData.result.tx.op.amount,
          ).rAmount
          let zk_nonce = zkTransactionData.result.tx.op.nonce.toString()
          let zk_SendRAmount = orbiterCore.getToAmountFromUserAmount(
            new Bignumber(zk_amount).dividedBy(
              new Bignumber(10 ** makerInfo.precision),
            ),
            makerInfo,
            true,
          )
          let zk_makerTransferChainID =
            localChainID === makerInfo.c1ID ? makerInfo.c2ID : makerInfo.c1ID
          var zk_amountToSend = orbiterCore.getTAmountFromRAmount(
            zk_makerTransferChainID,
            zk_SendRAmount,
            zk_nonce,
          ).tAmount
          if (!isCurrentTransaction(txHash)) {
            return
          }
          store.commit('updateProceedingUserTransferTimeStamp', time)
          store.commit('updateProceedState', 3)
          startScanMakerTransfer(
            txHash,
            zk_makerTransferChainID,
            makerInfo,
            zkTransactionData.result.tx.op.to,
            zkTransactionData.result.tx.op.from,
            zk_amountToSend,
          )
          return
        }
      } catch (error) {
        console.log('error =', error)
        throw 'getZKTransactionDataError'
      }
      return confirmUserTransaction(
        localChainID,
        makerInfo,
        txHash,
        confirmations,
      )
    }
    // main & arbitrum
    const trxConfirmations = await getConfirmations(localChainID, txHash)
    if (!trxConfirmations) {
      return confirmUserTransaction(
        localChainID,
        makerInfo,
        txHash,
        confirmations,
      )
    }
    if (!isCurrentTransaction(txHash)) {
      return
    }
    var trx = trxConfirmations.trx
    if (!isCurrentTransaction(txHash)) {
      return
    }
    store.commit(
      'updateProceedingUserTransferTimeStamp',
      trxConfirmations.timestamp,
    )
    console.log(
      'Transaction with hash ' +
        txHash +
        ' has ' +
        trxConfirmations.confirmations +
        ' confirmation(s)',
    )
    var amountHex = '0x' + trx.input.slice(74)
    var amountStr = Web3.utils.hexToNumberString(amountHex)
    var amount = orbiterCore.getRAmountFromTAmount(localChainID, amountStr)
      .rAmount

    if (
      trxConfirmations.confirmations > 0 &&
      trxConfirmations.confirmations < confirmations
    ) {
      if (!isCurrentTransaction(txHash)) {
        return
      }
      store.commit('updateProceedState', 2)
    }
    if (trxConfirmations.confirmations >= confirmations) {
      console.log(
        'Transaction with hash ' + txHash + ' has been successfully confirmed',
      )
      if (!isCurrentTransaction(txHash)) {
        return
      }
      store.commit('updateProceedState', 3)

      var nonce = trx.nonce.toString()
      let sendRAmount = orbiterCore.getToAmountFromUserAmount(
        new Bignumber(amount).dividedBy(
          new Bignumber(10 ** makerInfo.precision),
        ),
        makerInfo,
        true,
      )
      let makerTransferChainID =
        localChainID === makerInfo.c1ID ? makerInfo.c2ID : makerInfo.c1ID
      let amountToSend = orbiterCore.getTAmountFromRAmount(
        makerTransferChainID,
        sendRAmount,
        nonce,
      ).tAmount
      startScanMakerTransfer(
        txHash,
        makerTransferChainID,
        makerInfo,
        '0x' + trx.input.slice(34, 74),
        trx.from,
        amountToSend,
      )
      return
    }
    return confirmUserTransaction(
      localChainID,
      makerInfo,
      txHash,
      confirmations,
    )
  }, 10 * 1000)
}

function ScanZKMakerTransfer(
  transactionID,
  localChainID,
  makerInfo,
  from,
  to,
  amount,
) {
  setTimeout(async () => {
    if (!isCurrentTransaction(transactionID)) {
      return
    }
    let req = {
      localChainID: localChainID,
      account: from,
      from: 'latest',
      limit: 30,
      direction: 'older',
    }
    try {
      let zkTransactions = await thirdapi.getZKInfo(req)
      let zkTransactionList
      if (
        zkTransactions.status === 'success' &&
        zkTransactions.result.list.length !== 0
      ) {
        zkTransactionList = zkTransactions.result.list
      }
      for (let index = 0; index < zkTransactionList.length; index++) {
        const zkInfo = zkTransactionList[index]
        if (
          zkInfo.failReason === null &&
          zkInfo.op.from === from &&
          zkInfo.op.to.toLowerCase() === to.toLowerCase() &&
          zkInfo.op.amount === amount
        ) {
          // shifou bijiao daibi
          let zkTokenList =
            localChainID === 3
              ? store.state.zktokenList.mainnet
              : store.state.zktokenList.rinkeby
          let tokenAddress =
            localChainID === makerInfo.c1ID
              ? makerInfo.t1Address
              : makerInfo.t2Address
          var tokenList = zkTokenList.filter(
            (item) => item.address === tokenAddress,
          )
          let resultToken = tokenList.length > 0 ? tokenList[0] : null
          if (!resultToken) {
            break
          }
          if (zkInfo.op.token !== resultToken.id) {
            break
          }
          if (!isCurrentTransaction(transactionID)) {
            return
          }
          store.commit('updateProceedingMakerTransferTxid', zkInfo.txHash)
          store.commit('updateProceedState', 4)
          if (zkInfo.status === 'committed' || zkInfo.status === 'finalized') {
            store.commit('updateProceedState', 5)
            return
          }
        }
      }
    } catch (error) {
      console.log('error =', error)
      throw 'getZKTransactionListError'
    }
    return ScanZKMakerTransfer(
      transactionID,
      localChainID,
      makerInfo,
      from,
      to,
      amount,
    )
  }, 10 * 1000)
}

function startScanMakerTransfer(
  transactionID,
  localChainID,
  makerInfo,
  from,
  to,
  amount,
) {
  if (!isCurrentTransaction(transactionID)) {
    return
  }
  if (localChainID === 3 || localChainID === 33) {
    return ScanZKMakerTransfer(
      transactionID,
      localChainID,
      makerInfo,
      from,
      to,
      amount,
    )
  }
  const web3 = localWeb3(localChainID)
  var tokenAddress =
    makerInfo.c1ID === localChainID ? makerInfo.t1Address : makerInfo.t2Address
  ScanMakerTransfer(
    transactionID,
    localChainID,
    makerInfo,
    web3,
    tokenAddress,
    from,
    to,
    amount,
  )
}

function ScanMakerTransfer(
  transactionID,
  localChainID,
  makerInfo,
  web3,
  tokenAddress,
  from,
  to,
  amount,
) {
  setTimeout(async () => {
    if (!isCurrentTransaction(transactionID)) {
      return
    }
    const tokenContract = new web3.eth.Contract(Coin_ABI, tokenAddress)
    const currentBlock = await web3.eth.getBlockNumber()
    // Generate filter options
    const options = {
      filter: {
        from: from,
        to: to,
      },
      fromBlock: currentBlock - 100,
      toBlock: 'latest',
    }
    tokenContract.getPastEvents('Transfer', options, function(error, events) {
      if (!isCurrentTransaction(transactionID)) {
        return
      }
      if (error) {
        console.log('111Error =', error)
        return ScanMakerTransfer(
          transactionID,
          localChainID,
          makerInfo,
          web3,
          tokenAddress,
          from,
          to,
          amount,
        )
      } else {
        if (events.length !== 0) {
          for (let index = 0; index < events.length; index++) {
            const txinfo = events[index]
            if (
              txinfo.address.toLowerCase() === tokenAddress.toLowerCase() &&
              txinfo.returnValues.from.toLowerCase() === from.toLowerCase() &&
              txinfo.returnValues.to.toLowerCase() === to.toLowerCase() &&
              txinfo.returnValues.amount === amount
            ) {
              if (!isCurrentTransaction(transactionID)) {
                return
              }
              store.commit(
                'updateProceedingMakerTransferTxid',
                txinfo.transactionHash,
              )
              store.commit('updateProceedState', 4)
              confirmMakerTransaction(
                transactionID,
                localChainID,
                makerInfo,
                txinfo.transactionHash,
              )
              return
            }
          }
        }
        return ScanMakerTransfer(
          transactionID,
          localChainID,
          makerInfo,
          web3,
          tokenAddress,
          from,
          to,
          amount,
        )
      }
    })
  }, 10 * 1000)
}

async function confirmMakerTransaction(
  transactionID,
  localChainID,
  makerInfo,
  txHash,
  confirmations = 1,
) {
  // state: 0 / 1      userTransfer / makerTransfer
  setTimeout(async () => {
    if (!isCurrentTransaction(transactionID)) {
      return
    }
    const trxConfirmations = await getConfirmations(localChainID, txHash)
    if (!trxConfirmations) {
      return confirmMakerTransaction(
        transactionID,
        localChainID,
        makerInfo,
        txHash,
        confirmations,
      )
    }
    console.log(
      'Transaction with hash ' +
        txHash +
        ' has ' +
        trxConfirmations.confirmations +
        ' confirmation(s)',
    )
    if (trxConfirmations.confirmations >= confirmations) {
      console.log(
        'Transaction with hash ' + txHash + ' has been successfully confirmed',
      )
      if (!isCurrentTransaction(transactionID)) {
        return
      }
      store.commit('updateProceedState', 5)
      return
    }
    return confirmMakerTransaction(
      transactionID,
      localChainID,
      makerInfo,
      txHash,
      confirmations,
    )
  }, 10 * 1000)
}

// Confirm number of current transaction
async function getConfirmations(localChainID, txHash) {
  try {
    const web3 = localWeb3(localChainID)
    const trx = await web3.eth.getTransaction(txHash)
    const currentBlock = await web3.eth.getBlockNumber()
    if (!trx) {
      return trx
    }
    if (trx.blockNumber !== null) {
      var blockInfo = await web3.eth.getBlock(trx.blockNumber)
      return {
        confirmations: currentBlock - trx.blockNumber,
        trx: trx,
        timestamp: blockInfo.timestamp,
      }
    }
    return { confirmations: 0, trx: trx, timestamp: 0 }
  } catch (error) {
    console.log(error)
  }
}

/*
  Whether the monitoring is the current transaction
  return bool
*/

function isCurrentTransaction(txid) {
  let currentTransaction = store.state.proceedTXID
  if (currentTransaction === txid) {
    return true
  }
  return false
}

export default {
  UserTransferReady(user, maker, amount, localChainID, makerInfo, txHash) {
    store.commit('updateProceedTxID', txHash)
    store.commit('updateProceedingUserTransferFrom', user)
    store.commit('updateProceedingUserTransferTo', maker)
    var realAmount = orbiterCore.getRAmountFromTAmount(localChainID, amount)
    if (realAmount.state) {
      realAmount = realAmount.rAmount
    } else {
      throw realAmount.rAmount.error
    }
    store.commit('updateProceedingUserTransferAmount', realAmount)
    confirmUserTransaction(localChainID, makerInfo, txHash)
  },
}
