export default {
  updatelpAccountInfo(state, accountInfo) {
    state.lpAccountInfo = accountInfo
  },
  updatelpApiKey(state, accountInfo) {
    state.lpApiKey = accountInfo
  },
  updateZKTokenList(state, obj) {
    if (obj.chainID === 3) {
      state.zktokenList.mainnet = obj.tokenList
    }
    if (obj.chainID === 33) {
      state.zktokenList.rinkeby = obj.tokenList
    }
  },
  updateProceedTxID(state, txid) {
    state.proceedTXID = txid
    state.proceedState = 1
    state.proceeding.userTransfer.localChainID = null
    state.proceeding.userTransfer.from = null
    state.proceeding.userTransfer.to = null
    state.proceeding.userTransfer.amount = null
    state.proceeding.userTransfer.txid = null
    state.proceeding.userTransfer.isConfirmed = null
    state.proceeding.userTransfer.nonce = null
    state.proceeding.userTransfer.timeStamp = null
    state.proceeding.makerTransfer.localChainID = null
    state.proceeding.makerTransfer.from = null
    state.proceeding.makerTransfer.to = null
    state.proceeding.makerTransfer.amount = null
    state.proceeding.makerTransfer.txid = null
    state.proceeding.makerTransfer.isConfirmed = null
    state.proceeding.makerTransfer.nonce = null
    state.proceeding.makerTransfer.timeStamp = null
  },
  updateProceedingUserTransferLocalChainID(state, obj) {
    state.proceeding.userTransfer.localChainID = obj
  },
  updateProceedingUserTransferFrom(state, obj) {
    state.proceeding.userTransfer.from = obj
  },
  updateProceedingUserTransferTo(state, obj) {
    state.proceeding.userTransfer.to = obj
  },
  updateProceedingUserTransferAmount(state, obj) {
    state.proceeding.userTransfer.amount = obj
  },
  updateProceedingUserTransferTxid(state, obj) {
    state.proceeding.userTransfer.txid = obj
  },
  updateProceedingUserTransferTimeStamp(state, obj) {
    state.proceeding.userTransfer.timeStamp = obj
  },
  updateProceedingMakerTransferLocalChainID(state, obj) {
    state.proceeding.makerTransfer.localChainID = obj
  },
  updateProceedingMakerTransferFrom(state, obj) {
    state.proceeding.makerTransfer.from = obj
  },
  updateProceedingMakerTransferTo(state, obj) {
    state.proceeding.makerTransfer.to = obj
  },
  updateProceedingMakerTransferAmount(state, obj) {
    state.proceeding.makerTransfer.amount = obj
  },
  updateProceedingMakerTransferTxid(state, obj) {
    state.proceeding.makerTransfer.txid = obj
  },
  updateProceedingMakerTransferTimeStamp(state, obj) {
    state.proceeding.makerTransfer.timeStamp = obj
  },
  updateProceedState(state, proceedState) {
    state.proceedState = proceedState
  },
  updateConfirmRouteDescInfo(state, routeDescInfo) {
    state.confirmData.routeDescInfo = routeDescInfo
  },
  updateTransferValue(state, value) {
    state.transferData.transferValue = value
  },
  updateTransferExt(state, ext) {
    state.transferData.transferExt = ext
  },
  updateTransferTokenInfo(state, tokenInfo) {
    state.transferData.selectTokenInfo = tokenInfo
  },
  updateTransferMakerInfo(state, makerInfo) {
    state.transferData.selectMakerInfo = makerInfo
  },
  updateTransferFromChainID(state, chainID) {
    state.transferData.fromChainID = chainID
  },
  updateTransferToChainID(state, chainID) {
    state.transferData.toChainID = chainID
  },
  updateTransferGasFee(state, gasFee) {
    state.transferData.gasFee = gasFee
  },
  updateETHPrice(state, price) {
    state.transferData.ethPrice = price
  },
  updateTransactionList(state, transactionList) {
    state.transactionList = transactionList
  },
  updateIsInstallMeta(state, isInstallMeta) {
    state.web3.isInstallMeta = isInstallMeta
  },
  updateIsInjected(state, isInjected) {
    state.web3.isInjected = isInjected
  },
  updateWeb3Instance(state, web3Instance) {
    state.web3.web3Instance = web3Instance
  },
  updateCoinbase(state, coinbase) {
    if (!coinbase || coinbase.length === 0) {
      state.web3.isInjected = false
      coinbase = '0x'
    } else {
      state.web3.isInjected = true
      state.web3.localLogin = true
      localStorage.setItem('localLogin', true)
    }
    state.lpAccountInfo = null
    state.lpApiKey = null
    state.web3.coinbase = coinbase
  },
  updateStarkNetAddress(state, starkNetAddress) {
    if (!starkNetAddress || starkNetAddress.length === 0) {
      starkNetAddress = ''
      state.web3.starkNet.starkIsConnected = false
      state.web3.starkNet.starkWalletName = ''
      state.web3.starkNet.starkWalletIcon = ''
      state.web3.starkNet.starkChain = ''
    } else {
      state.web3.starkNet.starkIsConnected = true
    }
    state.web3.starkNet.starkNetAddress = starkNetAddress
  },

  updateStarkNetIsConnect(state, starkNetIsConnect) {
    if (!starkNetIsConnect) {
      state.web3.starkNet.starkWalletName = ''
      state.web3.starkNet.starkWalletIcon = ''
      state.web3.starkNet.starkChain = ''
      state.web3.starkNet.starkNetAddress = ''
    }
    state.web3.starkNet.starkNetIsConnect = starkNetIsConnect
  },
  updateStarkNetWalletName(state, starkNetWalletName) {
    if (!starkNetWalletName || starkNetWalletName.length === 0) {
      starkNetWalletName = ''
    }
    state.web3.starkNet.starkNetWalletName = starkNetWalletName
  },
  updateStarkNetWalletIcon(state, starkNetWalletIcon) {
    if (!starkNetWalletIcon || starkNetWalletIcon.length === 0) {
      starkNetWalletIcon = ''
    }
    state.web3.starkNet.starkNetWalletIcon = starkNetWalletIcon
  },
  updateStarkNetChain(state, starkChain) {
    if (!starkChain || starkChain.length === 0) {
      starkChain = ''
    }
    state.web3.starkNet.starkChain = starkChain
  },
  updateNetWorkId(state, netWorkId) {
    state.web3.networkId = netWorkId
    state.lpAccountInfo = null
    state.lpApiKey = null
  },
  updateLocalLogin(state, localLogin) {
    state.web3.localLogin = localLogin
    state.lpAccountInfo = null
    state.lpApiKey = null
  },
  setInnerWH(state, { innerWidth, innerHeight }) {
    state.innerWH.innerWidth = innerWidth
    state.innerWH.innerHeight = innerHeight
  },
}
