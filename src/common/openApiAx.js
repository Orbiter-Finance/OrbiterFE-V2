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
  getBalance: 'orbiter_getBalance',
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

export const requestLotteryCard = requestPointSystem

export async function requestLotteryCardDraw(path, params) {
  const url = process.env.VUE_APP_ISMAINTEST
    ? `/point_system_maintest/${path}`
    : `/points_system/${path}`
  return await openApiAx.post(url, {
    ...params,
  })
}

export async function getNoticeData() {
  const res = await fetch(
    process.env.VUE_APP_OPEN_URL +
      '/cms/network-states?publicationState=live&filters[offline]=true',
    {
      headers: {
        Authorization:
          'bearer 703d24e24d178d6d8b65a1d497e151ab0e9547620036f0690fbc3da8f310092720983eefa8d99e9979a4fad3ebef00b574e0768ca6d56036ba988088e936154a8add754456f1038fd1adb7e04fa572da43d97b788398ed4fcb253016fc80af0de35f718a0e0a7e467944d7297a40fac1b9965d7bf5edf22db262a67507daf5d7',
      },
    }
  )
  const data = await res.json()

  const list = data?.data
    ?.map((item) => {
      const description = item?.attributes?.description
      const offline = !!item?.attributes?.offline
      const line = item?.attributes?.line || ''

      const [chain = '', token = ''] = line?.split('-')
      const [source = '', dest = ''] = chain?.split('/')
      const [sourceToken = '', destToken = ''] = token?.split('/')

      return {
        description: offline ? description : '',
        offline,
        line,
        rule: {
          source: source && source === '*' ? null : Number(source),
          dest: dest && dest === '*' ? null : Number(dest),
          sourceToken: sourceToken && sourceToken === '*' ? null : sourceToken,
          destToken: destToken && destToken === '*' ? null : destToken,
          description,
        },
      }
    })
    .filter((item) => {
      return !!item?.offline
    })

  return list
}

export async function requestClaimLuckyBagReward(address, token) {
  return await openApiAx.get(
    `/points_platform/reward/luckyORBGuyInfo/${address}`,
    {
      headers: {
        'recaptcha-token': token,
      },
    }
  )
}

export async function requestClaimLuckyBagRewardData(address, token) {
  return await openApiAx.get(
    `/points_platform/reward/token-reward/${address}?flag=1`,
    {
      headers: {
        'recaptcha-token': token,
      },
    }
  )
}

export async function drawClaimLuckyBagReward(address, token) {
  return await openApiAx.post(
    `/points_platform/reward/luckyORBGuy`,
    {
      address,
    },
    {
      headers: {
        'recaptcha-token': token,
      },
    }
  )
}

export async function requestClaimPrizesRewardData(address) {
  return await openApiAx.get(
    `/points_platform/reward/token-reward/${address}?flag=2`
  )
}
