import { reactive, watchEffect } from '.'
import {
  walletIsLogin,
  compatibleGlobalWalletConf,
} from './walletsResponsiveData'
import { getTransactionsHistoryApi } from '../core/routes/transactions'
import { formatDateShort } from '../util'

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
  historyPanelState.historyInfo = info
}

export async function getTransactionsHistory(params = {}) {
  historyPanelState.isLoading = true
  const walletAddress =
    compatibleGlobalWalletConf.value.walletPayload.walletAddress
  if (!walletAddress) {
    historyPanelState.isLoading = false
    return
  }
  const res = await getTransactionsHistoryApi({
    // next line is just for local test only
    // userAddress: '0x6BB0366423a6f0F6C16715278483Dd9321ED5f66',
    // userAddress: '0x8a700FdB6121A57C59736041D9aa21dfd8820660',
    // users
    // userAddress: '0x2f21191fb455d60018e0415adce926ee0fe3d67c',
    // userAddress: '0x298cc3e53fea7ff5c9e5f943dd71529de16398ba',
    userAddress: walletAddress,
    size: 10,
    ...params,
  })
  historyPanelState.transactionListInfo.current = params?.current || 1
  historyPanelState.isLoading = false

  if (res.data.code === 0) {
    const { data = [], ...resInfo } = res.data
    const list = data.map((v) => {
      /*
        {
          "fromChainID": 33,
          "toChainID": 5,
          "userAddress": "0xbd...2415",
          "makerAddress": "0x00...4719",
          "userAmount": "0.008903",
          "fromTimeStamp": "06-10 11:10",
          "toTimeStamp": "06-10 11:10",
          "tokenName": "ETH",
          "fromTxHash": "0x9f9a408a24312b01006e14ebfc25792185dc3516cde28bf024ef7e09156f5233",
          "toTxHash": "0xd5f57bf6f664ad5617e5f5ba1a7fba6d836ba6ff0c60201fe393a544f9730977",
          "state": 0
        }
      */

      let fromTimeStampShow = v.fromTimeStamp || ''
      if (fromTimeStampShow) {
        // 2022-07-22 09:24:56
        const arr = fromTimeStampShow.split(/\W+/)
        const y = arr[0]
        const m = parseInt(arr[1]) - 1
        const d = arr[2]
        const h = arr[3]
        const M = arr[4]
        const s = arr[5]
        fromTimeStampShow = formatDateShort(Date.UTC(y, m, d, h, M, s))
      }
      return {
        fromChainID: +v.fromChain,
        toChainID: +v.toChain,
        userAddress:
          v.userAddress.slice(0, 4) + '...' + v.userAddress.slice(-4),
        makerAddress:
          v.makerAddress.slice(0, 4) + '...' + v.makerAddress.slice(-4),
        userAmount: v.fromValueFormat,
        fromTimeStamp: v.fromTimeStamp,
        fromTimeStampShow,
        toTimeStamp: v.toTimeStamp,
        tokenName: v.tokenName,
        fromTxHash: v.fromTx,
        toTxHash: v.toTx,
        status: v.status,
        state: (() => {
          if (v.fromTx && v.toTx) {
            return 0
          }
          if (v.status == 0) return 1
          return 2
        })(),
      }
    })
    historyPanelState.transactionListInfo = resInfo
    historyPanelState.transactionList = list
  }
}
