import axios from 'axios'
import { isDev } from '../util'

const openApiAx = axios.create({
  baseURL: process.env.VUE_APP_OPEN_URL,
  timeout: 30000,
})

openApiAx.interceptors.response.use(
  function (response) {
    return response.data
    // if (respData.code !== 0) {
    //     // util.showMessage(respData.msg, 'error');
    //     return null;
    // }
  },
  function (error) {
    return Promise.reject(error)
  }
)

export const RequestMethod = {
  getTradingPairs: 'orbiter_getTradingPairs',
  getDealerRuleLatest: 'orbiter_getDealerRuleLatest',
  getTransactionByHash: 'orbiter_getTransactionByHash',
  getTransactionByAddress: 'orbiter_getTransactionByAddress',
  offline: 'orbiter_offline',
  collectUserTransaction: 'orbiter_collectUserTransaction',
  chainList: 'orbiter_chainList',
}

export async function requestOpenApi(method, params, isV3 = true) {
  return (
    await openApiAx.post(
      `${isDev() ? '' : '/explore'}/${isV3 ? 'v3' : 'v2'}/${
        process.env.VUE_APP_APIKEY
      }`,
      {
        id: 1,
        jsonrpc: '2.0',
        method,
        params,
      }
    )
  )?.result
}

export async function requestPointSystem(path, params) {
  const url = process.env.VUE_APP_ISMAINTEST
    ? `/point_system_maintest/${path}`
    : `/points_system/${path}`
  return await openApiAx.get(url, {
    params,
  })
}

export async function requestLotteryCard(path, params) {
  return await openApiAx.get(path, {
    params,
  })
}

export async function requestLotteryCardDraw(path, params) {
  return await openApiAx.post(path, {
    ...params,
  })
}
