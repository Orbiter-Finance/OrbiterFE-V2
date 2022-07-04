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
  }
}
