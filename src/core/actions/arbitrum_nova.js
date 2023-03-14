import axios from 'axios'
import { cacheMemoryGet, cacheMemorySet } from '../../util/cache/memory'
import Axios from '../utils/Axios'
import config from '../utils/config'

import { GraphQLClient, gql } from 'graphql-request'
Axios.axios()
export default {
  async queryAddressTrxList(graphQLClient, address) {
    const query = gql`
      query ($hash: AddressHash!) {
        address(hash: $hash) {
          transactions(first: 14) {
            edges {
              node {
                nonce
                hash
              }
            }
          }
        }
      }
    `
    const resp = await graphQLClient.request(query, {
      hash: address,
    })
    if (
      resp.address &&
      resp.address.transactions &&
      resp.address.transactions.edges
    ) {
      return resp.address.transactions.edges.map((item) => {
        return {
          hash: item.node.hash,
          nonce: item.node.nonce,
        }
      })
    }
  },
  getTxByHash: async function (hash, chainId) {
    const api =
      chainId == 516
        ? config.arbitrum_nova.Rinkeby
        : config.arbitrum_nova.Mainnet
    const resp = await axios
      .get(api, {
        params: {
          module: 'transaction',
          action: 'gettxinfo',
          txhash: hash,
        },
      })
      .then((result) => result.data)
    return resp.result
  },
  //  isTokentx = true
  getTxList: async function (req, chainId) {
    const endpoint =
      chainId == 516
        ? 'https://goerli-rollup-explorer.arbitrum.io/graphiql'
        : 'https://nova-explorer.arbitrum.io/graphiql'
    const graphQLClient = new GraphQLClient(endpoint, {})
    const result = await this.queryAddressTrxList(graphQLClient, req.maker)
    const trxList = []
    for (const row of result) {
      const trx = await this.getTxByHash(row.hash, chainId)
      if (trx) {
        trxList.push({
          blockNumber: trx.blockNumber,
          timeStamp: Number(trx.timeStamp),
          hash: trx.hash,
          blockHash: trx.blockHash,
          transactionIndex: trx.transactionIndex,
          from: trx.from,
          to: trx.to,
          value: trx.value,
          gas: trx.gas,
          gasPrice: trx.gasPrice,
          nonce: row.nonce,
          isError: '0',
          txreceipt_status: '',
          input: trx.input,
          contractAddress: '',
          cumulativeGasUsed: '',
          gasUsed: trx.gasUsed,
          confirmations: Number(trx.confirmations),
        })
      }
    }
    return trxList
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
      result: txList,
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
        chainId === 516
          ? config.arbitrum_nova.Rinkeby
          : config.arbitrum_nova.Mainnet
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
