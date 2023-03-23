import chainMain from './chain.json'
import chainTest from './chainTest.json'
import { isProd } from '../util'

const tokenIcons = {
  ETH: require('../assets/ethlogo.svg'),
  USDC: require('../assets/usdclogo.png'),
  USDT: require('../assets/usdtlogo.png'),
  TUSD: require('../assets/tusdlogo.png'),
  MCO: require('../assets/mcologo.png'),
  METIS: require('../assets/metislogo.png'),
  ZKS: require('../assets/zkslogo.png'),
  LRC: require('../assets/lrclogo.png'),
  BNB: require('../assets/bnblogo.png'),
  DAI: require('../assets/dailogo.png'),
  MATIC: require('../assets/maticlogo.png'),
}

/**
 *
 * @param {string} token
 * @returns
 */
const getTokenIcon = (token) => {
  if (!token) {
    return ''
  }

  token = token.toUpperCase()

  return tokenIcons[token] || ''
}

const random = [1, 2].sort(function () {
  return 0.5 - Math.random();
})[0];
const chain = isProd() ? chainMain : chainTest;
const maker = require(`./${ isProd() ? `maker-${ random }.json` : `makerTest-${ random }.json` }`);
const v1MakerConfigs = [];

const chainConfig = [...chain].map((item) => {
  if (process.env[`VUE_APP_CHAIN_API_KEY_${item.internalId}`]) {
    item.api = item.api || {}
    item.api.key = process.env[`VUE_APP_CHAIN_API_KEY_${item.internalId}`]
  }
  return item
})

const makerConfigs = convertMakerConfig(maker);

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
        recipient: makerData.makerAddress,
        sender: makerData.sender,
        tradingFee: makerData.tradingFee,
        gasFee: makerData.gasFee,
        fromChain: {
          id: +fromChainId,
          name: c1Chain.name,
          tokenAddress: fromToken.address,
          symbol: fromChainSymbol,
          decimals: fromToken.decimals,
          minPrice: makerData.minPrice,
          maxPrice: makerData.maxPrice,
        },
        toChain: {
          id: +toChainId,
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

// console.log('makerAddress', makerConfigs[0].recipient);

const whiteList = []

export default {
  getTokenIcon,
  chainConfig,
  makerConfigs,
  v1MakerConfigs,
  whiteList
};
