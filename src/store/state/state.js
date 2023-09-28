const initThemeMode = () => {
  if (localStorage.getItem('themeMode')) {
    return localStorage.getItem('themeMode')
  } else {
    if (window?.matchMedia) {
      const currentThemeMode = window?.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
        ? 'dark'
        : 'light'
      localStorage.setItem('themeMode', currentThemeMode)
      return currentThemeMode
    } else {
      return 'light'
    }
  }
}

const state = {
  innerWH: {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  },
  confirmData: {
    routeDescInfo: [],
  },
  proceedState: 1,
  proceedTXID: null,
  proceeding: {
    userTransfer: {
      localChainID: null,
      from: null,
      to: null,
      amount: null,
      txid: null,
      isConfirmed: null,
      nonce: null,
      timeStamp: null,
    },
    makerTransfer: {
      localChainID: null,
      from: null,
      to: null,
      amount: null,
      txid: null,
      isConfirmed: null,
      nonce: null,
      timeStamp: null,
    },
  },
  zktokenList: {
    rinkeby: [],
    mainnet: [],
  },
  zksTokenList: {
    rinkeby: [],
    mainnet: [],
  },
  lpTokenList: {
    rinkeby: [],
    mainnet: [],
  },
  themeMode: initThemeMode(), // light dark
}
export default state
