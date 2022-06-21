import { getWeb3 } from '../../util/constants/web3/getWeb3'
import { getTransactionsHistoryApi } from '../../core/routes/transactions'

export default {
  async registerWeb3() {
    await getWeb3()
  },
  async getTransactionsHistory({ commit, state }, params) {
    const res = await getTransactionsHistoryApi({
      userAddress: state.web3.coinbase,
      size: 30,
      ...params,
    })

    if (res.data.code === 0) {
      const { code, data = [], ...resInfo } = res.data;
      const list = data.map(v => {
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
        return {
          "fromChainID": +v.fromChain,
          "toChainID": +v.toChain,
          "userAddress": v.userAddress.slice(0, 4) + '...' + v.userAddress.slice(-4),
          "makerAddress": v.makerAddress.slice(0, 4) + '...' + v.makerAddress.slice(-4),
          "userAmount": (v.fromValue/Math.pow(10, 18)).toFixed(6),
          "fromTimeStamp": v.fromTimeStamp.replace(/\..*/g, '').replace('T', ' ').slice(5, -3),
          "toTimeStamp": v.toTimeStamp,
          "tokenName": v.tokenName,
          "fromTxHash": v.fromTx,
          "toTxHash": v.toTx,
          "state": v.status == 1 ? 0 : (v.status == 0 ? 1 : 2) // 0 success 1 waiting 2 fail
        }
      })
      commit('updateTransactionListInfo', resInfo)
      commit('updateTransactionList', list)
    }
  }
}
