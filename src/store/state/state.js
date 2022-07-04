const state = {
  web3: {
    isInstallMeta: false,
    isInjected: false,
    web3Instance: null,
    networkId: null,
    coinbase: null,
    error: null,
    localLogin: true,
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
}
export default state
