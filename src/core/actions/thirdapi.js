// util/thirdapi.js
import Axios from '../utils/Axios'
import axios from 'axios'
import config from '../utils/config'

Axios.axios()

const zkConfigNet = config.zkSync.TestNet
// var arConfigNet = config.arbitrum.Ropsten
// var l1ConfigNet = config.L1.Mainnet

export default {
  getZKAccountInfo: function (req) {
    return new Promise((resolve, reject) => {
      if (req.localChainID !== 3 && req.localChainID !== 33) {
        reject({
          errorCode: 1,
          errMsg: 'getZKAccountError_wrongChainID',
        })
      }
      const prefix =
        req.localChainID === 33 ? config.zkSync.TestNet : config.zkSync.Mainnet
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
  // get single zk transaction data
  getZKTransactionData: function (req) {
    return new Promise((resolve, reject) => {
      /* req
        account:address / id
        from:latest
        limit:
      */
      if (req.localChainID !== 3 && req.localChainID !== 33) {
        reject({
          errorCode: 1,
          errMsg: 'getZKTransactionDataError_wrongChainID',
        })
      }
      const url =
        (req.localChainID === 33
          ? config.zkSync.TestNet
          : config.zkSync.Mainnet) +
        '/transactions/' +
        req.txHash +
        '/data'
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
  // get an account transactionList
  /* req
    localChainID: localChainID,
    account: from,
    from: 'latest',
    limit: 30,
    direction: 'older',
  */
  getZKInfo: function (req) {
    return new Promise((resolve, reject) => {
      if (req.localChainID !== 3 && req.localChainID !== 33) {
        reject({
          errorCode: 1,
          errMsg: 'getZKInfoError_wrongChainID',
        })
      }
      const params = {
        from: req.from,
        limit: req.limit,
        direction: req.direction,
      }
      const prefix =
        req.localChainID === 33 ? config.zkSync.TestNet : config.zkSync.Mainnet
      axios
        .get(`${prefix}/accounts/${req.account}/transactions`, {
          params,
        })
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
  getZKTokenInfo: function (req) {
    return new Promise((resolve, reject) => {
      /* req
        token : id / address
      */
      const url = zkConfigNet + '/tokens/' + req.token
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
  getZKTokenList: function (req) {
    return new Promise((resolve, reject) => {
      /* req
        localChainID: localChainID,
        from: 0,
        limit: 100,
        direction: 'newer',
      */
      const zkSync = config.zkSync
      const baseUrl = req.localChainID === 33 ? zkSync.TestNet : zkSync.Mainnet
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
