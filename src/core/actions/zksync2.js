import config from '../utils/config'
import { cacheMemoryGet, cacheMemorySet } from '../../util/cache/memory'
import { axiosPlus } from '../utils/Axios'
let configNet = config.zkSync2.Mainnet

export default {
  getTransationList: async function (req, chainId) {
    const tokentxList = await this.getTxList(req, chainId)
    return tokentxList
  },
  getTxList: async function (req, chainId) {
    const params = {
      module: 'account',
      action: 'tokentx',
      address: req.maker,
      startblock: req.startblock,
      endblock: req.endblock,
      page: 1,
      offset: 500,
      sort: 'asc',
    }
    if (chainId == 514) {
      configNet = config.zkSync2.Rinkeby
    }
    try {
      const respData = await axiosPlus('get', configNet, params)
      if (
        (respData.status === '1' && respData.message === 'OK') ||
        (respData.status === '0' &&
          respData.message === 'No transactions found')
      ) {
        return respData
      } else {
        throw new Error('zk2 get txList error')
      }
    } catch (error) {
      throw new Error('zk2 get txList error')
    }
  },
  getBlockNumberWithTimeStamp: async function (req, chainId) {
    if (chainId == 514) {
      configNet = config.zkSync2.Rinkeby
    }
    const cacheKey = `zksync2.getBlockNumberWithTimeStamp__${req.closest}`
    const cacheValue = cacheMemoryGet(cacheKey)
    if (cacheValue) {
      return cacheValue
    }
    const params = {
      module: 'block',
      action: 'getblocknobytime',
      timestamp: req.timestamp,
      closest: req.closest,
    }
    try {
      const respData = await axiosPlus('get', configNet, params)
      if (respData.status === '1' && respData.message === 'OK') {
        cacheMemorySet(cacheKey, respData, 7200000)
        return respData
      } else {
        throw new Error('zk2 blocknumber by time get nothing')
      }
    } catch (error) {
      throw new Error(`zk2 blocknumber by time network error ${error.message}`)
    }
  },
}
