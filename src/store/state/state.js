const state = {
  web3: {
    isInstallMeta: false,
    isInjected: false,
    web3Instance: null,
    networkId: null,
    coinbase: null,
    error: null,
    localLogin: true,
    starkNet: {
      starkNetAddress: '',
      starkWalletName: '',
      starkWalletIcon: '',
      starkIsConnected: false,
      starkChain: '',
    },
  },
  innerWH: {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  },
  confirmData: {
    routeDescInfo: [],
  },
  transferData: {
    selectTokenInfo: '',
    selectMakerInfo: '',
    fromChainID: '',
    toChainID: '',
    transferExt: null, // {type: string, value: string} | null
    transferValue: 0,
    gasFee: 0,
    ethPrice: 0,
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
  zk2tokenList: {
    rinkeby: [],
    mainnet: [],
  },
  transactionList: null,
  transactionListInfo: {
    current: 1,
    size: 30,
    total: 0,
    pages: 1
  },
  lpAccountInfo: null,
  lpApiKey: null,
  themeMode: localStorage.getItem('themeMode') || 'light', // light dark
  historyPanelVisible: false,
}
export default state
