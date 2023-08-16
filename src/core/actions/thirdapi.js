// util/thirdapi.js
import Axios from '../utils/Axios'
import axios from 'axios'
import config from '../utils/config'
import { CHAIN_ID } from "../../config";

Axios.axios()

export default {
  getZKAccountInfo: function (req) {
    return new Promise((resolve, reject) => {
      if (req.localChainID !== CHAIN_ID.zksync && req.localChainID !== CHAIN_ID.zksync_test) {
        reject({
          errorCode: 1,
          errMsg: 'getZKAccountError_wrongChainID',
        })
      }
      const prefix =
        req.localChainID === CHAIN_ID.zksync_test ? config.zkSync.TestNet : config.zkSync.Mainnet
      axios
        .get(`${prefix}/accounts/${req.account}/${req.stateType}`)
        .then(function (response) {
          if (response.status === 200) {
            const respData = response.data
            if (respData.status === 'success') {
              resolve(respData)
            } else {
              reject(respData)
            }
          } else {
            reject({
              errorCode: 1,
              errMsg: 'NetWorkError',
            })
          }
        })
        .catch(function (error) {
          reject({
            errorCode: 2,
            errMsg: error,
          })
        })
    })
  },
  getZKTokenList: function (req) {
    return new Promise((resolve, reject) => {
      const zkSync = config.zkSync
      const baseUrl = req.localChainID === CHAIN_ID.zksync_test ? zkSync.TestNet : zkSync.Mainnet
      const url = `${baseUrl}/tokens?from=${req.from}&limit=${req.limit}&direction=${req.direction}`

      axios
        .get(url)
        .then(function (response) {
          if (response.status === 200) {
            const respData = response.data
            if (respData.status === 'success') {
              resolve(respData)
            } else {
              reject(respData)
            }
          } else {
            reject({
              errorCode: 1,
              errMsg: 'NetWorkError',
            })
          }
        })
        .catch(function (error) {
          reject({
            errorCode: 2,
            errMsg: error,
          })
        })
    })
  },
}
