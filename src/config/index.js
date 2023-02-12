import testnet from './testnet.json'
import mainnet from './mainnet.json'
import { isDev } from "../util";

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
  MATIC: require('../assets/maticlogo.png')
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

const chainConfig = [...isDev() ? testnet : mainnet].map(item => {
  if (process.env[`VUE_APP_CHAIN_API_KEY_${ item.internalId }`]) {
    item.api = item.api || {};
    item.api.key = process.env[`VUE_APP_CHAIN_API_KEY_${ item.internalId }`];
  }
  return item;
});

export default { getTokenIcon, chainConfig };
