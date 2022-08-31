import { toggleBodyCls } from '../../util/theme/theme'
import decimal from '../../util/decimal/decimal'
import { getDefaultProvider } from '../../util/constants/web3/provider'
export default {
  changeMobileStatus(state, payload) {
    state.isMobile = payload
  },
  setDialogVisible(state, payload) {
    state.dialog[payload.type] = payload.value
  },
  togglePageTab(state, payload) {
    state.curPage[payload.type] = payload.value
  },
  toggleThemeMode(state, mode) {
    if (typeof mode === 'string' && mode) {
      state.themeMode = mode
    } else {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light'
    }
    localStorage.setItem('themeMode', state.themeMode)
    toggleBodyCls()
  },
  updateLiquidityDataStatus(state, payload) {
    let tmpStatus = state.liquidityData.find(
      (item) =>
        item.localID == payload.localID && item.tokenName == payload.tokenName
    )
    tmpStatus[payload.type] = !tmpStatus[payload.type]
  },
  updateLiquidityData(state, liquidityDataList) {
    for (let i = 0; i < liquidityDataList.length; i++) {
      liquidityDataList[i]['tokenSrc'] =
        state.poolNetworkOrTokenConfig.tokenInfoArray.find(
          (item) => item.token === liquidityDataList[i].tokenName
        ).icon
      liquidityDataList[i]['liquidity'] = decimal.number_format(
        liquidityDataList[i]['amount'],
        liquidityDataList[i].tokenName
      )
      liquidityDataList[i]['totalRevenue'] = decimal.number_format(
        liquidityDataList[i]['totalRevenue'],
        liquidityDataList[i].tokenName,
        liquidityDataList[i]['totalRevenue'] === '0.0' ? undefined : 6
      )
      liquidityDataList[i]['apr'] =
        liquidityDataList[i]['apr'] === 0 ? '1.11' : liquidityDataList[i]['apr'].toFixed(2)
      liquidityDataList[i]['dayRevenueTime'] = new Date().getHours()
      liquidityDataList[i]['dayRevenue'] = decimal.number_format(
        (liquidityDataList[i]['apr'] / 365) * liquidityDataList[i]['amount'],
        liquidityDataList[i].tokenName
      )
      liquidityDataList[i]['filledAmount'] = decimal.number_format(
        liquidityDataList[i]['filledAmount'],
        liquidityDataList[i].tokenName,
        liquidityDataList[i]['filledAmount'] === '0.0' ? undefined : 8
      )
      liquidityDataList[i]['estimatedProfit'] = decimal.number_format(
        liquidityDataList[i]['dayRevenue'] * 7,
        liquidityDataList[i].tokenName
      )
      liquidityDataList[i]['addLiquidityLoading'] = false
      liquidityDataList[i]['reduceLoading'] = false
    }
    state.liquidityData = liquidityDataList
  },
  updatePoolNetworkOrTokenConfig(state, payload) {
    if (payload?.constructor === Object) {
      state.poolNetworkOrTokenConfig[payload.type] = payload.value
    } else if (payload?.constructor === Array) {
      for (let i = 0; i < payload.length; i++) {
        state.poolNetworkOrTokenConfig[payload[i].type] = payload[i].value
      }
    }
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
  updateTransferDestAddress(state, destAddress) {
    state.transferData.destAddress = destAddress
  },
  updateTransferAmount(state, amount) {
    state.transferData.amount = amount
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
    state.web3.coinbase = coinbase
    state.web3.provider = getDefaultProvider()
  },
  updateNetWorkId(state, netWorkId) {
    state.web3.networkId = netWorkId
    state.web3.provider = getDefaultProvider()
  },
  updateLocalLogin(state, localLogin) {
    state.web3.localLogin = localLogin
  },
  setInnerWH(state, { innerWidth, innerHeight }) {
    state.innerWH.innerWidth = innerWidth
    state.innerWH.innerHeight = innerHeight
  },
}
