import chainMain from './chain.json'
import chainTest from './chainTest.json'
import { isProd } from '../util'

export const CHAIN_ID = {
  zksync: 'zksync',
  starknet: 'SN_MAIN',
  loopring: 'loopring',
  zkspace: 'ZKSpace',
  dydx: 'dydx',
  imx: 'immutableX',
  mainnet: '1',
  ar: '42161',
  po: '137',
  op: '10',
  zksync2: '324',
  nova: '42170',
  base: '8453',
  zora: '7777777',
  metis: '1088',
  boba: '288',
  linea: '59144',
  pozkevm: '1101',
  bsc: '56',
  opbnb: '204',
  manta: '169',
  scroll: '534352',

  zksync_test: 'zksync_test',
  starknet_test: 'SN_GOERLI',
  loopring_test: 'loopring_test',
  zkspace_test: 'ZKSpace_test',
  dydx_test: 'dydx_test',
  imx_test: 'immutableX_test',
  goerli: '5',
  ar_test: '421613',
  po_test: '80001',
  op_test: '420',
  zksync2_test: '280',
  base_test: '84531',
  zora_test: '999',
  linea_test: '59140',
  pozkevm_test: '1442',
  bsc_test: '97',
  opbnb_test: '5611',
  manta_test: '3441005',
  scroll_test: '534353',
}

const makerNum = parseInt(Math.random() * 2) + 1
const maker = require(`./${
  isProd() ? `maker-${makerNum}.json` : `makerTest-${makerNum}.json`
}`)

const otherNum = parseInt(Math.random() * 3) + 1
if (otherNum > 2) {
  const makerOther = require(`./${
    isProd() ? `maker-${otherNum}.json` : `makerTest-${otherNum}.json`
  }`)
  for (const key1 in maker) {
    for (const key2 in maker[key1]) {
      if (makerOther[key1]?.[key2]) {
        maker[key1][key2] = makerOther[key1][key2]
      }
    }
  }
}

const v1MakerConfigs = []
const chain = isProd() ? chainMain : chainTest
const chainConfig = [...chain].map((item) => {
  if (process.env[`VUE_APP_CHAIN_API_KEY_${item.internalId}`]) {
    item.api = item.api || {}
    item.api.key = process.env[`VUE_APP_CHAIN_API_KEY_${item.internalId}`]
  }
  return item
})

const makerConfigs = convertMakerConfig(maker)

function convertMakerConfig(maker) {
  const makerMap = maker
  const chainList = chainConfig
  const configs = []
  const getChainTokenList = (chain) => {
    return chain.nativeCurrency
      ? [chain.nativeCurrency, ...chain.tokens]
      : [...chain.tokens]
  }
  for (const chainIdPair in makerMap) {
    if (!makerMap.hasOwnProperty(chainIdPair)) continue
    const symbolPairMap = makerMap[chainIdPair]
    const [fromChainId, toChainId] = chainIdPair.split('-')
    // Temporary offline configuration
    const offlineList = [12, 13]
    if (
      offlineList.find((item) => +item === +fromChainId) ||
      offlineList.find((item) => +item === +toChainId)
    ) {
      continue
    }
    const c1Chain = chainList.find((item) => +item.internalId === +fromChainId)
    const c2Chain = chainList.find((item) => +item.internalId === +toChainId)
    if (!c1Chain || !c2Chain) continue
    for (const symbolPair in symbolPairMap) {
      if (!symbolPairMap.hasOwnProperty(symbolPair)) continue
      const makerData = symbolPairMap[symbolPair]
      const [fromChainSymbol, toChainSymbol] = symbolPair.split('-')
      const fromTokenList = getChainTokenList(c1Chain)
      const toTokenList = getChainTokenList(c2Chain)
      const fromToken = fromTokenList.find(
        (item) => item.symbol === fromChainSymbol
      )
      const toToken = toTokenList.find((item) => item.symbol === toChainSymbol)
      if (!fromToken || !toToken) continue
      const config = {
        id: '',
        makerId: '',
        ebcId: '',
        slippage: makerData.slippage || 0,
        recipient: makerData.makerAddress || makerData.sender,
        sender: makerData.sender,
        tradingFee: makerData.tradingFee,
        gasFee: makerData.gasFee,
        fromChain: {
          id: +fromChainId,
          networkId: c1Chain.networkId,
          chainId: c1Chain.chainId,
          name: c1Chain.name,
          tokenAddress: fromToken.address,
          symbol: fromChainSymbol,
          decimals: fromToken.decimals,
          minPrice: makerData.minPrice,
          maxPrice: makerData.maxPrice,
        },
        toChain: {
          id: +toChainId,
          networkId: c2Chain.networkId,
          chainId: c2Chain.chainId,
          name: c2Chain.name,
          tokenAddress: toToken.address,
          symbol: toChainSymbol,
          decimals: toToken.decimals,
        },
        times: [makerData.startTime, makerData.endTime],
        crossAddress: {
          recipient: makerData.crossAddress?.makerAddress,
          sender: makerData.crossAddress?.sender,
          tradingFee: makerData.crossAddress?.tradingFee,
          gasFee: makerData.crossAddress?.gasFee,
        },
      }
      if (
        config.toChain.id == 1 &&
        (config.toChain.symbol == 'USDC' || config.toChain.symbol == 'USDT')
      ) {
        continue
      }
      // handle makerConfigs
      configs.push(config)
      // v1 maker configs
      if (fromChainSymbol === toChainSymbol) {
        v1MakerConfigs.push(config)
      }
    }
  }
  return configs
}

const whiteList = []
let chainsGroup = {}
try {
  chainsGroup = JSON.parse(process.env.VUE_APP_CHAINS_GROUP || '{}')
} catch (err) {}

export default {
  chainConfig,
  makerConfigs,
  v1MakerConfigs,
  whiteList,
  chainsGroup,
}
