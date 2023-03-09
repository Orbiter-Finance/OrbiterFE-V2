import { reactive } from './'
import util from '../util/util'

const defaultTransferDateState = {
  fromChainID: '',
  toChainID: '',
  transferValue: 0,
  gasFee: 0,
  ethPrice: 0,
}
export const transferDataState = reactive({
  ...defaultTransferDateState,
})
export function updateTransferDataState(obj) {
  Object.keys(defaultTransferDateState).map((key) => {
    transferDataState[key] = obj[key] || defaultTransferDateState[key]
  })
}
export function updateTransferValue(value) {
  transferDataState.transferValue = value
}
export function updateTransferMakerConfig(makerConfig) {
  util.log('selectMakerConfig', makerConfig)
  transferDataState.selectMakerConfig = makerConfig
}
export function updateTransferFromChainID(chainID) {
  if (transferDataState.fromChainID === chainID) return
  transferDataState.fromChainID = chainID
}
export function updateTransferToChainID(chainID) {
  if (transferDataState.toChainID === chainID) return
  transferDataState.toChainID = chainID
}
export function updateTransferGasFee(gasFee) {
  transferDataState.gasFee = gasFee
}
export function updateETHPrice(price) {
  transferDataState.ethPrice = price
}
export function updateTransferFromCurrency(fromCurrency) {
  if (transferDataState.fromCurrency === fromCurrency) return
  transferDataState.fromCurrency = fromCurrency
}
export function updateTransferToCurrency(toCurrency) {
  if (transferDataState.toCurrency === toCurrency) return
  transferDataState.toCurrency = toCurrency
}
export function updateIsCrossAddress(isCrossAddress) {
  transferDataState.isCrossAddress = isCrossAddress
}
export function updateCrossAddressReceipt(crossAddressReceipt) {
  transferDataState.crossAddressReceipt = crossAddressReceipt
}
export function updateTransferExt(transferExt) {
  transferDataState.transferExt = transferExt
}
