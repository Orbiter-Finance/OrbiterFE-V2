import { reactive, watchEffect } from '.'
import {
  walletIsLogin,
  compatibleGlobalWalletConf,
} from './walletsResponsiveData'
import openApiAx from '../common/openApiAx'
import util from "../util/util";
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
        fromChainID: info.fromChain,
        fromTimeStamp: info.fromTimeStampShow,
        fromTxHash: info.fromHash,
        makerAddress: info.replySender,
        state: 0,
        toChainID: info.toChain,
        toTimeStamp: info.toTimeStampShow,
        toTxHash: info.toHash,
        tokenName:info.toToken,
        userAddress: info.replyAccount,
        userAmount: info.fromAmountValue,
  }
 
}

export async function getTransactionsHistory(params = {}) {
  historyPanelState.isLoading = true
  const walletAddress =
    compatibleGlobalWalletConf.value.walletPayload.walletAddress
  if (!walletAddress) {
    historyPanelState.isLoading = false
    return
  }
  const cache = util.getCache(`history_${walletAddress}_${params.current || 1}`)
  try {
    let res;
    if (cache) {
      res = cache;
    } else {
      res = await openApiAx.get(
          `/userHistory?address=${ walletAddress }&page=${ params.current || 1 }`
      );
      util.setCache(`history_${ walletAddress }_${ params.current || 1 }`, res, 10000);
    }
    const { rows, page, total } = res;
    // const result = await openApiAx.get(`/userHistory?address=${walletAddress}`);
    historyPanelState.transactionList = rows.map((row) => {
      let decimal = 18
      if (row.fromToken === 'USDC' || row.fromToken === 'USDT') {
        decimal = 6
      }
      const fromDate = new Date(row.fromTime);
      const toDate = new Date(row.toTime);
      row.fromTimeStampShow = util.formatDate(fromDate);
      row.toTimeStampShow = util.formatDate(toDate);
      row.fromTimeStampShowShort = util.formatDate(fromDate, true);
      row.toTimeStampShowShort = util.formatDate(toDate, true);
      row.fromAmountValue = (row.fromAmount / 10 ** decimal).toFixed(8);
      return row;
    })
    historyPanelState.transactionListInfo.current = Number(page || 1)
    historyPanelState.transactionListInfo.total = total * 10
    historyPanelState.isLoading = false
  } catch (error) {
    console.error(error)
  } finally {
    historyPanelState.isLoading = false
  }
}
