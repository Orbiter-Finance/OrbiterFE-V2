// util/ethersca.js
import axios from 'axios'
import { cacheMemoryGet, cacheMemorySet } from '../../util/cache/memory'
import Axios from '../utils/Axios'
import config from '../utils/config'
Axios.axios()

export default {
  getTxByHash:async function (hash, chainId) {
    const api = chainId == 513 ? 'https://blockexplorer.rinkeby.boba.network/api' : 'https://blockexplorer.boba.network/api';
    const resp = await axios.get(api, {
      params: {
        module: 'transaction',
        action: 'gettxinfo',
        txhash: hash
      }
    }).then(result => result.data)
    return resp.result;
  },
   getTxList: async function  (req, chainId, isTokentx = true){
    const trxList = [];
    const apiUrl = chainId == 513 ? 'https://api-watcher.rinkeby.boba.network/get.l2.transactions' : 'https://api-watcher.mainnet.boba.network/get.l2.transactions'
    const list = await axios.post(apiUrl, {"address":req.maker,"fromRange":0,"toRange":1000}).then(res=> res.data)
    for (const row of list) {
      const trx = await this.getTxByHash(row.hash, chainId);
      if (trx) {
        trxList.push({
          blockNumber: trx.blockNumber,
          timeStamp:Number(trx.timeStamp),
          hash: trx.hash,
          blockHash: trx.blockHash,
          transactionIndex: trx.transactionIndex,
          from: trx.from,
          to: trx.to,
          value: trx.value,
          gas: trx.gas,
          gasPrice: trx.gasPrice,
          nonce: trx.nonce,
          isError: '0',
          txreceipt_status: '',
          input: trx.input,
          contractAddress: '',
          cumulativeGasUsed: '',
          gasUsed: row.gasUsed,
          confirmations: trx.confirmations,
        })
      }
      
    }
    return trxList;
  },
  getTransationList: async function (req, chainId) {
    // const tokentxList = await this.getTxList(req, chainId)
    // contact eth txlist
    const txList = await this.getTxList(req, chainId, false)
    for (const item of txList) {
      // fill tokenSymbol、tokenDecimal
      item.tokenSymbol = 'ETH'
      item.tokenDecimal = 18
      // tokentxList.result.push(item)
    }
    return {
      result: txList
    }
  },
  getBlockNumberWithTimeStamp: function (req, chainId) {
    return new Promise((resolve, reject) => {
      const cacheKey = `boba.getBlockNumberWithTimeStamp__${req.closest}`
      const cacheValue = cacheMemoryGet(cacheKey)
      if (cacheValue) {
        resolve(cacheValue)
        return
      }
      const params = {
        module: 'block',
        action: 'getblocknobytime',
        timestamp: req.timestamp,
        closest: req.closest,
        // apikey: config.polygon.key,
      }
      const configNet =
        chainId === 513 ? config.boba.Rinkeby : config.boba.Mainnet
      axios
        .get(configNet, { params })
        .then(function (response) {
          if (response.status === 200) {
            var respData = response.data
            if (respData.status === '1' && respData.message === 'OK') {
              cacheMemorySet(cacheKey, respData, 7200000)
              resolve(respData)
            } else {
              reject(respData)
            }
          } else {
            reject({
              errorCode: 1,
              errorMsg: 'NetWork Error',
            })
          }
        })
        .catch(function (error) {
          reject({
            errorCode: 2,
            errorMsg: error,
          })
        })
    })
  },
}
