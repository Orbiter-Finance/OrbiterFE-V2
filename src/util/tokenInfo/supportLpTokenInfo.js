import util from '../util'
import axios from 'axios'
import config from '../../core/utils/config'
import { store } from '../../store'
import { CHAIN_ID } from '../../config'

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
  const lpTokenResult = {
    chainID: localChainID,
    tokenList: LPTokens,
  }
  store.commit('updateLpTokenList', lpTokenResult)
  // const url = `${
  //   localChainID === CHAIN_ID.loopring_test ? config.loopring.Rinkeby : config.loopring.Mainnet
  // }/api/v3/exchange/tokens`
  // try {
  //   const response = await axios.get(url)
  //   if (response.status === 200) {
  //     const lpTokenResult = {
  //       chainID: localChainID,
  //       tokenList: response.data,
  //     }
  //     store.commit('updateLpTokenList', lpTokenResult)
  //   } else {
  //     throw new Error('getLpTokenList NetWorkError')
  //   }
  // } catch (error) {
  //   console.error('getLpTokenList error =', error.message)
  //   throw new Error(`getLpTokenList error = ${error.message}`)
  // }
}

const LPTokens = [
  {
    type: 'ETH',
    tokenId: 0,
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    precision: 7,
    precisionForOrder: 3,
    orderAmounts: {
      minimum: '1700000000000000',
      maximum: '1000000000000000000000',
      dust: '200000000000000',
    },
    luckyTokenAmounts: {
      minimum: '50000000000000',
      maximum: '1000000000000000000000',
      dust: '50000000000000',
    },
    fastWithdrawLimit: '100000000000000000000',
    gasAmounts: {
      distribution: '85000',
      deposit: '110000',
    },
    enabled: true,
  },
  {
    type: 'ERC20',
    tokenId: 1,
    symbol: 'LRC',
    name: 'Loopring',
    address: '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
    decimals: 18,
    precision: 3,
    precisionForOrder: 3,
    fastWithdrawLimit: '750000000000000000000000',
    enabled: true,
  },
  {
    type: 'ERC20',
    tokenId: 3,
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 6,
    precision: 2,
    precisionForOrder: 3,
    fastWithdrawLimit: '250000000000',
    enabled: true,
  },
  {
    type: 'ERC20',
    tokenId: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
    precision: 2,
    precisionForOrder: 3,
    fastWithdrawLimit: '250000000000',
    enabled: true,
  },
]
