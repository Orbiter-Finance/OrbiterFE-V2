// util/ethersca.js
import Axios from '../utils/Axios'
import axios from 'axios'
import config from '../utils/config'
Axios.axios()

var configNet = config.arbitrum.Mainnet

export default {
  getTransationList: function(req, next) {
    if (next == 22) {
      configNet = config.arbitrum.Mainnet
    }
    return new Promise((resolve, reject) => {
      var params = {
        module: 'account',
        action: 'tokentx',
        contractaddress: req.tokenAddress,
        address: req.maker,
        startblock: req.startblock,
        endblock: req.endblock,
        page: 1,
        offset: 500,
        sort: 'asc',
      }
      axios
        .get(configNet, {
          params: params,
        })
        .then(function(response) {
          if (response.status === 200) {
            var respData = response.data
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
        .catch(function(error) {
          reject({
            errorCode: 2,
            errorMsg: error,
          })
        })
    })
  },
  getBlockNumberWithTimeStamp: function(req, next) {
    if (next == 22) {
      configNet = config.arbitrum.Mainnet
    }
    return new Promise((resolve, reject) => {
      var params = {
        module: 'block',
        action: 'getblocknobytime',
        timestamp: req.timestamp,
        closest: req.closest,
      }
      axios
        .get(configNet, {
          params: params,
        })
        .then(function(response) {
          if (response.status === 200) {
            var respData = response.data
            if (respData.status === '1' && respData.message === 'OK') {
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
        .catch(function(error) {
          reject({
            errorCode: 2,
            errorMsg: error,
          })
        })
    })
  },
}
