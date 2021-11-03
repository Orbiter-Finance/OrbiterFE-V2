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
  trasctionList: [],
}
export default state
