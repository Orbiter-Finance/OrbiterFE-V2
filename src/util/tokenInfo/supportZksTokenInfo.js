import util from '../util'
import axios from 'axios'
import config from '../../core/utils/config'
import { store } from '../../store'

export default {
  async getSupportZksTokenList() {
    await getAllZksTokenList(12)
    await getAllZksTokenList(512)
    await util.sleep(30 * 1000)
    this.getSupportZksTokenList()
  },
}

async function getAllZksTokenList(localChainID) {
  if (localChainID !== 12 && localChainID !== 512) {
    return
  }
  let isContiue = true
  let startID = 0
  let zksTokenAllList = []
  try {
    while (isContiue) {
      const zksTokenListReq = {
        from: startID,
        limit: 100,
        direction: 'newer',
        localChainID,
      }
      const zksList = await getZKSTokenList(zksTokenListReq)
      if (zksList.length !== 100) {
        isContiue = false
      } else {
        startID = zksList[99].id + 1
      }
      zksTokenAllList = zksTokenAllList.concat(zksList)
    }
    const zksTokenResult = {
      chainID: localChainID,
      tokenList: zksTokenAllList,
    }
    store.commit('updateZksTokenList', zksTokenResult)
  } catch (error) {
    console.error('zk_TokenListGetError =', error)
  }
}
async function getZKSTokenList(req) {
  const url = `${
    req.localChainID === 512 ? config.ZKSpace.Rinkeby : config.ZKSpace.Mainnet
  }/tokens?from=${req.from}&limit=${req.limit}&direction=${req.direction}`
  try {
    const response = await axios.get(url)
    if (response.status === 200) {
      const respData = response.data
      if (respData.success) {
        return respData.data
      } else {
        throw new Error('respData.status not success')
      }
    } else {
      throw new Error('getZKSTokenList NetWorkError')
    }
  } catch (error) {
    console.error('getZKSTokenList error =', error)
    throw new Error(`getZKSTokenList error = ${error.message}`)
  }
}
