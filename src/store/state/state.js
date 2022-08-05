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
      starkNetWalletName: '',
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
    transferValue: 0,
    gasFee: 0,
    ethPrice: 0,
    amount: 0,
    destAddress: '',
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
  transactionList: null,
  liquidityData: [
    {
      chainName: 'Arbitrum',
      tokenName: 'ETH',
      amount: 'loading...',
      redeemLoading: false,
    },
    {
      chainName: 'Polygon',
      tokenName: 'USDC',
      amount: 'loading...',
      redeemLoading: false,
    },
    {
      chainName: 'Optimistic',
      tokenName: 'USDT',
      amount: 'loading...',
      redeemLoading: false,
    },
  ],
  poolNetworkOrTokenConfig: {
    dTokenAddresses: {
      5: '0xA78Eb19720C6043B118FfBf48Ee5CCb019983e60', // Rinkeby
      22: '0xF2164c10FA18A5e1795410871374BF7b34Fdc268', // ARB(Rinkeby)
      77: '0x76D7d615fAa7A37fB0123f7C8724534e1D387c42', // OP(Kovan)
    },
    makerInfoList: [],
    NetworkArray: [],
  },
  themeMode: localStorage.getItem('themeMode') || 'light', // light dark
  curPage: {
    Status: '1',
    TabState: 'Sender',
    NetworkliquidityState: '1',
    curNetworkPoolMode: true,
  },
  dialog: {
    selectWalletDialogVisible: false,
    isStarkNetDialog: false,
    addLiquidityDialogVisible: false,
  },
  isMobile: false,
}
export default state
