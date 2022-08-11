export default {
  realSelectMakerInfo(state) {
    let selectMakerInfo = state.transferData.selectMakerInfo
    if (!selectMakerInfo || selectMakerInfo === '') {
      return ''
    }
    let fromChainID = state.transferData.fromChainID
    if (selectMakerInfo.c1ID === fromChainID) {
      return {
        makerAddress: selectMakerInfo.makerAddress,
        c1ID: selectMakerInfo.c1ID,
        c2ID: selectMakerInfo.c2ID,
        c1Name: selectMakerInfo.c1Name,
        c2Name: selectMakerInfo.c2Name,
        t1Address: selectMakerInfo.t1Address,
        t2Address: selectMakerInfo.t2Address,
        tName: selectMakerInfo.tName,
        minPrice: selectMakerInfo.c1MinPrice,
        maxPrice: selectMakerInfo.c1MaxPrice,
        precision: selectMakerInfo.precision,
        avalibleDeposit: selectMakerInfo.c1AvalibleDeposit,
        tradingFee: selectMakerInfo.c1TradingFee,
        gasFee: selectMakerInfo.c1GasFee,
        avalibleTimes: selectMakerInfo.c1AvalibleTimes,
      }
    } else {
      return {
        makerAddress: selectMakerInfo.makerAddress,
        c1ID: selectMakerInfo.c2ID,
        c2ID: selectMakerInfo.c1ID,
        c1Name: selectMakerInfo.c2Name,
        c2Name: selectMakerInfo.c1Name,
        t1Address: selectMakerInfo.t2Address,
        t2Address: selectMakerInfo.t1Address,
        tName: selectMakerInfo.tName,
        minPrice: selectMakerInfo.c2MinPrice,
        maxPrice: selectMakerInfo.c2MaxPrice,
        precision: selectMakerInfo.precision,
        avalibleDeposit: selectMakerInfo.c2AvalibleDeposit,
        tradingFee: selectMakerInfo.c2TradingFee,
        gasFee: selectMakerInfo.c2GasFee,
        avalibleTimes: selectMakerInfo.c2AvalibleTimes,
      }
    }
  },
  isLogin(state) {
    return (
      state.web3.isInstallMeta && state.web3.isInjected && state.web3.localLogin
    )
  },
  showAddress(state) {
    let address = state.web3.coinbase
    if (address && address.length > 5) {
      let subStr1 = address.substr(0, 6)
      let subStr2 = address.substr(address.length - 4, 4)
      return subStr1 + '...' + subStr2
    }
    return ''
  },
  starkAddress(state) {
    let stark = state.web3.starkNet.starkNetAddress
    if (stark && stark.length > 5) {
      let subStr1 = stark.substr(0, 6)
      let subStr2 = stark.substr(stark.length - 4, 4)
      return subStr1 + '...' + subStr2
    }
    return 'not connected'
  },
  getGlobalWalletConf(state) {
    return {
      walletType: 'MetaMask',
      walletPayload: {
        walletAddress: state.web3.coinbase,
        provider: '',
        networkId: state.web3.networkId,
      },
      loginSuccess: state.web3.localLogin,
    }
  },
  getCurNetworkLiquidityData(state) {
    return state.liquidityData.filter((item) => {
      return item.localID === parseInt(state.curPage.NetworkliquidityState)
    })
  },
  getAllNetworkLiquidityData(state) {
    const filed = 'localID'
    let dest = {}
    state.liquidityData.forEach((item) => {
      let array = []
      dest[item[filed]] === undefined ? array : (array = dest[item[filed]])
      array.push(item)
      dest[item[filed]] = array
    })
    return dest
  },
  HasOrNotTrading(state) {
    return (
      state.liquidityData.findIndex(
        (item) =>
          item.addLiquidityLoading === true || item.reduceLoading === true
      ) !== -1
    )
  },
}
