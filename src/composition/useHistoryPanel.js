import { reactive, watchEffect } from '.'
import {
  walletIsLogin,
  compatibleGlobalWalletConf,
} from './walletsResponsiveData'
import { RequestMethod, requestOpenApi } from '../common/openApiAx'
import util from '../util/util'
import { web3State } from './useCoinbase'
import tonHelper from '../util/ton/ton_helper'
// import { getTransactionsHistoryApi } from '../core/routes/transactions'

export const historyPanelState = reactive({
  isLoading: false,
  transactionListInfo: {
    current: 1,
    size: 30,
    total: 0,
    pages: 1,
  },
  transactionList: null,
  historyInfo: null,
  isShowHistory: false,
})

watchEffect(() => {
  !walletIsLogin.value && (historyPanelState.transactionList = [])
  const walletAddress =
    compatibleGlobalWalletConf.value.walletPayload.walletAddress
  if (walletIsLogin.value && walletAddress && walletAddress !== '0x') {
    // getTraddingHistory(true)
  }
})

export function getTraddingHistory(isRefresh = false) {
  if (walletIsLogin.value) {
    if (isRefresh) historyPanelState.transactionList = []
    getTransactionsHistory({ current: 1 })
  }
}
export function setHistoryInfo(info = {}, isShowHistory = true) {
  historyPanelState.isShowHistory = isShowHistory
  // historyPanelState.historyInfo = info
  historyPanelState.historyInfo = {
    fromChainID: info.fromChainId,
    fromTimeStamp: info.fromTimeStampShow,
    fromTxHash: info.fromHash,
    // makerAddress: info.replySender,
    state: 0,
    toChainID: info.toChainId,
    toTimeStamp: info.toTimeStampShow,
    toTxHash: info.toHash,
    tokenName: info.fromSymbol,
    // userAddress: info.replyAccount,
    userAmount: info.fromAmountValue,
  }
}

export async function getTransactionsHistory(params = {}) {
  historyPanelState.isLoading = true
  const evmAddress =
    compatibleGlobalWalletConf.value.walletPayload.walletAddress
  const starknetAddress = web3State.starkNet.starkNetAddress
  const tronAddress = web3State.tron.tronAddress
  const solanaAddress = web3State.solana.solanaAddress
  const tonAddress = web3State.ton.tonAddress || tonHelper.account()

  const walletAddress = [
    tonAddress,
    evmAddress?.toLocaleLowerCase(),
    tronAddress,
    starknetAddress?.toLocaleLowerCase(),
    solanaAddress,
  ]
    .filter((item) => !!item)
    .join(',')

  if (!walletAddress) {
    historyPanelState.isLoading = false
    return
  }
  const cache = util.getCache(`history_${walletAddress}_${params.current || 1}`)
  try {
    let res
    if (cache) {
      res = cache
    } else {
      res = await requestOpenApi(RequestMethod.getTransactionByAddress, [
        walletAddress,
        10,
        params.current || 1,
      ])
      util.setCache(
        `history_${walletAddress}_${params.current || 1}`,
        res,
        10000
      )
    }
    const { list, count } = res
    historyPanelState.transactionList = list.map((row) => {
      const fromDate = new Date(row.fromTimestamp)
      const toDate = new Date(row.toTimestamp)
      row.fromTimeStampShow = util.formatDate(fromDate)
      row.toTimeStampShow = util.formatDate(toDate)
      row.fromTimeStampShowShort = util.formatDate(fromDate, true)
      row.toTimeStampShowShort = util.formatDate(toDate, true)
      row.fromAmountValue = (+row.fromValue).toFixed(8)
      return row
    })
    historyPanelState.transactionListInfo.current = Number(params.current || 1)
    historyPanelState.transactionListInfo.total = count
    historyPanelState.isLoading = false
  } catch (error) {
    console.error(error)
  } finally {
    historyPanelState.isLoading = false
  }
}
