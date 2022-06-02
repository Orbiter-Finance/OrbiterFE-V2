const tokenIcons = {
  ETH: require('../assets/ethlogo.svg'),
  USDC: require('../assets/usdclogo.png'),
  USDT: require('../assets/usdtlogo.png'),
  TUSD: require('../assets/tusdlogo.png'),
  MCO: require('../assets/mcologo.png'),
  DAI: require('../assets/dailogo.svg'),
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

export default { getTokenIcon }
