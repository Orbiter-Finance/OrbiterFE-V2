import { reactive, computed } from './'

const defaultTransferDateState = {
  selectTokenInfo: '',
  selectMakerInfo: '',
  fromChainID: '',
  toChainID: '',
  transferExt: null, // {type: string, value: string} | null
  transferValue: 0,
  gasFee: 0,
  ethPrice: 0,
}
export const transferDataState = reactive({
  ...defaultTransferDateState
})

export function updateTransferDataState (obj) {
  Object.keys(defaultTransferDateState).map(key => {
    transferDataState[key] = obj[key] || defaultTransferDateState[key]
  })
}

export function updateTransferValue(value) {
  transferDataState.transferValue = value
}
export function updateTransferExt(ext) {
  transferDataState.transferExt = ext
}
export function updateTransferTokenInfo(tokenInfo) {
  transferDataState.selectTokenInfo = tokenInfo
}
export function updateTransferMakerInfo(makerInfo) {
  transferDataState.selectMakerInfo = makerInfo
}
export function updateTransferFromChainID(chainID) {
  transferDataState.fromChainID = chainID
}
export function updateTransferToChainID(chainID) {
  transferDataState.toChainID = chainID
}
export function updateTransferGasFee(gasFee) {
  transferDataState.gasFee = gasFee
}
export function updateETHPrice(price) {
  transferDataState.ethPrice = price
}

export const realSelectMakerInfo = computed(() => {
  let selectMakerInfo = transferDataState.selectMakerInfo
  if (!selectMakerInfo || selectMakerInfo === '') {
    return ''
  }
  let fromChainID = transferDataState.fromChainID
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
})
