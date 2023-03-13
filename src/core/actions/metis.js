// util/ethersca.js
import axios from 'axios'
import { cacheMemoryGet, cacheMemorySet } from '../../util/cache/memory'
import Axios from '../utils/Axios'
import config from '../utils/config'

Axios.axios()

let configNet = config.metis.Mainnet

export default {
  getTxList: function (req, chainId, isTokentx = true) {
    return new Promise((resolve, reject) => {
      const params = {
        module: 'account',
        action: isTokentx ? 'tokentx' : 'txlist',
        address: req.maker,
        startblock: req.startblock,
        endblock: req.endblock,
        page: 1,
        offset: 500,
        sort: 'asc',
      }
      if (chainId == 510) {
        configNet = config.metis.Rinkeby
      }
      axios
        .get(configNet, { params })
        .then(function (response) {
          if (response.status === 200) {
            const respData = response.data
            if (respData.status === '1' && respData.message === 'OK') {
              resolve(respData)
            } else if (
              respData.status === '0' &&
              respData.message === 'No transactions found'
            ) {
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
  getTransationList: async function (req, chainId) {
    const tokentxList = await this.getTxList(req, chainId)
    // contact eth txlist
    const txList = await this.getTxList(req, chainId, false)
    for (const item of txList.result) {
      // fill tokenSymbol、tokenDecimal
      item.tokenSymbol = 'METIS'
      item.tokenDecimal = 18

      tokentxList.result.push(item)
    }
    return tokentxList
  },
  getBlockNumberWithTimeStamp: function (req, chainId) {
    if (chainId == 510) {
      configNet = config.metis.Rinkeby
    }
    return new Promise((resolve, reject) => {
      const cacheKey = `metis.getBlockNumberWithTimeStamp__${req.closest}`
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
      }
      axios
        .get(configNet, { params })
        .then(function (response) {
          if (response.status === 200) {
            const respData = response.data
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
