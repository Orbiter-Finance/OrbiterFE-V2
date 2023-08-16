import util from '../util'
import axios from 'axios'
import config from '../../core/utils/config'
import { store } from '../../store'
import { CHAIN_ID } from "../../config";

export default {
  async getSupportLpTokenList() {
    try {
      await getAllLpTokenList(CHAIN_ID.loopring)
      await getAllLpTokenList(CHAIN_ID.loopring_test)
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
    localChainID === CHAIN_ID.loopring_test ? config.loopring.Rinkeby : config.loopring.Mainnet
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
