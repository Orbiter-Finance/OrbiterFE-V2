import util from '../util'
import axios from 'axios'
import config from '../../core/utils/config'
import thegraph from '../../core/actions/thegraph'
import { store } from '../../store'

//unuse  zk2->zkrollup
export default {
  async getSupportZk2TokenList() {
    const makerAddress = await getMakerList()
    if (makerAddress) {
      // await getAllZk2TokenList(makerAddress, 14)
      await getAllZk2TokenList(makerAddress, 514)
      await util.sleep(30 * 1000)
      this.getSupportZk2TokenList()
    }
  },
}

async function getAllZk2TokenList(makerAddress, localChainID) {
  if (localChainID !== 14 && localChainID !== 514) {
    return
  }
  try {
    let zk2TokenAllList = await getZK2TokenList(makerAddress, localChainID)
    let zk2TokenResult = {
      chainID: localChainID,
      tokenList: zk2TokenAllList,
    }
    store.commit('updateZk2TokenList', zk2TokenResult)
  } catch (error) {
    console.log('zk2_TokenListGetError =', error.message)
  }
}
async function getZK2TokenList(makerAddress, localChainID) {
  const url = `${
    localChainID === 514 ? config.zkSync2.Rinkeby : config.zkSync2.Mainnet
  }?module=account&action=tokenlist&address=${makerAddress}`
  try {
    const response = await axios.get(url)
    if (response.status === 200) {
      var respData = response.data
      if (respData.status == '1') {
        return respData.result
      } else {
        throw new Error(`getZK2 resp.result.status no success`)
      }
    } else {
      throw new Error(`getZK2TokenList no 200`)
    }
  } catch (error) {
    console.error('getZK2TokenList error =', error.message)
    throw new Error(`getZK2TokenList error = ${error.message}`)
  }
}

async function getMakerList(count = 5) {
  try {
    let makerList = []
    makerList = await getMakerListOnce()
    if (!makerList.length) {
      count--
      if (count >= 0) {
        await util.sleep(300)
        return await getMakerList(count)
      } else {
        return makerList
      }
    }
    return makerList[0] ? makerList[0].makerAddress : null
  } catch (error) {
    count--
    if (count >= 0) {
      await util.sleep(300)
      return await getMakerList(count)
    } else {
      return null
    }
  }
}

async function getMakerListOnce() {
  const response = await thegraph.getMakerInfo(undefined, true)
  return response.data
}
