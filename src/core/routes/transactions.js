import axios from 'axios'

export async function getTransactionsHistory(params = {}) {
  // return axios.get(`http://localhost:3000/api/transactions/history?current=1&size=20&makerAddress=0x0043d60e87c5dd08c86c3123340705a1556c4719`)
  const res = await axios.get(`http://localhost:3000/api/transactions/history`, { params })

  if (res.data.code === 0) {
    // getTransactionsHistory
    const data = res.data.data || []
    const list = data.map(v => {
      return {
        "fromChainID": +v.fromChain,
        "toChainID": +v.toChain,
        "userAddress": v.userAddress.slice(0, 4) + '...' + v.userAddress.slice(-4), //"0xbd...2415",
        "makerAddress": v.makerAddress.slice(0, 4) + '...' + v.makerAddress.slice(-4), //"0x00...4719",
        "userAmount": "0", // ?????"0.008903",
        "fromTimeStamp": v.fromTimeStamp, //"06-10 11:10",
        "toTimeStamp": v.toTimeStamp, //"06-10 11:10",
        "tokenName": v.tokenName, //"ETH",
        "fromTxHash": v.fromTx, //"0x9f9a408a24312b01006e14ebfc25792185dc3516cde28bf024ef7e09156f5233",
        "toTxHash": v.toTx, //"0xd5f57bf6f664ad5617e5f5ba1a7fba6d836ba6ff0c60201fe393a544f9730977",

        // "sortTimeStamp": 1654830658,
        // "state": 0
      }
    })
    return list
  }
  return []
}
