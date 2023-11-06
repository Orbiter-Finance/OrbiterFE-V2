import axios from 'axios'

const openApiAx = axios.create({
  baseURL: process.env.VUE_APP_OPEN_URL,
  timeout: 30000,
})

openApiAx.interceptors.response.use(
  function (response) {
    const respData = response.data
    // if (respData.code !== 0) {
    //     // util.showMessage(respData.msg, 'error');
    //     return null;
    // }
    return respData?.result
  },
  function (error) {
    return Promise.reject(error)
  }
)

export const RequestMethod = {
    getTradingPairs: "orbiter_getTradingPairs",
    getDealerRuleLatest: "orbiter_getDealerRuleLatest",
    getTransactionByHash: "orbiter_getTransactionByHash",
    getTransactionByAddress: "orbiter_getTransactionByAddress",
    offline: "orbiter_offline",
    collectUserTransaction: "orbiter_collectUserTransaction",
    chainList: "orbiter_chainList"
};

export async function requestOpenApi(method, params, isV3 = true) {
    return await openApiAx.post(`/${ isV3 ? 'v3' : 'v2' }/${ process.env.VUE_APP_APIKEY }`, {
        "id": 1,
        "jsonrpc": "2.0",
        method,
        params
    });
}
