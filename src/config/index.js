import chainMain from './chain.json'
import chainTest from './chainTest.json'
import { isProd } from '../util'
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

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
  xlayer: '196',
  blast: '81457',
  mode: '34443',
  merlin: '4200',
  bevm: '11501',

  zksync_test: 'zksync_test',
  starknet_test: 'SN_SEPOLIA',
  solana: 'SOLANA_MAIN',
  solana_test: 'SOLANA_DEV',
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
const maker = {}
const makerFiles = shuffleArray(
  isProd()
    ? [
        'eth-80c-prod.json',
        'eth-e4e-prod.json',
        '1c8-prod.json',
        'btc-prod.json',
        'usdt-prod.json',
        'usdc-prod.json',
      ]
    : ['makerTest-1.json', 'makerTest-2.json']
)
for (const file of makerFiles) {
  const importConfigs = require(`./${file}`)
  for (const key1 in importConfigs) {
    for (const key2 in importConfigs[key1]) {
      if (!maker[key1]) {
        maker[key1] = {}
      }
      maker[key1][key2] = importConfigs[key1][key2]
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
    // if (+fromChainId == 38 || +toChainId == 38) {
    //   if (!(+fromChainId == 38 && +toChainId == 1)) {
    //     continue
    //   }
    // }

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
        tieredFee: makerData?.tieredFee,
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
        originWithholdingFee: makerData.originWithholdingFee,
        crossAddress: {
          recipient: makerData.crossAddress?.makerAddress,
          sender: makerData.crossAddress?.sender,
          tradingFee: makerData.crossAddress?.tradingFee,
          gasFee: makerData.crossAddress?.gasFee,
        },
      }

      // if (
      //   config.toChain.id == 1 &&
      //   (config.toChain.symbol == 'USDC' || config.toChain.symbol == 'USDT')
      // ) {
      //   continue
      // }
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
  chain,
}
