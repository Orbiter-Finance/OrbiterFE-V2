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
  themeMode: localStorage.getItem('themeMode') || 'light', // light dark
}
export default state
