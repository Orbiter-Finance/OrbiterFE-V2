import util from '../util'
import axios from 'axios'
import config from '../../core/utils/config'
import { store } from '../../store'

export default {
  async getSupportLpTokenList() {
    try {
      await getAllLpTokenList(9)
      await getAllLpTokenList(99)
      await util.sleep(30 * 1000)
      this.getSupportLpTokenList()
    } catch (err) {
      console.error('getSupportLpTokenList error =', err.message)
    }
  },
}

async function getAllLpTokenList(localChainID, count = 0) {
  try {
    await getLpTokenList(localChainID)
  } catch (error) {
    console.error('getLpTokenList error =', error.message)
    count++
    if (count > 5) {
      throw new Error(`getLpTokenList error = ${error.message}`)
    } else {
      await getAllLpTokenList(localChainID, count)
    }
  }
}
async function getLpTokenList(localChainID) {
  const url = `${
    localChainID === 99 ? config.loopring.Rinkeby : config.loopring.Mainnet
  }/api/v3/exchange/tokens`
  try {
    const response = await axios.get(url)
    if (response.status === 200) {
      const lpTokenResult = {
        chainID: localChainID,
        tokenList: response.data,
      }
      store.commit('updateLpTokenList', lpTokenResult)
    } else {
      throw new Error('getLpTokenList NetWorkError')
    }
  } catch (error) {
    console.error('getLpTokenList error =', error.message)
    throw new Error(`getLpTokenList error = ${error.message}`)
  }
}
