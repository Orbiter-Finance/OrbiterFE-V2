import { store } from "../store";
import { compatibleGlobalWalletConf } from './walletsResponsiveData'

export function showAddress() {
  var address = compatibleGlobalWalletConf.value.walletPayload.walletAddress
  if (address && address.length > 5) {
    var subStr1 = address.substr(0, 4)
    var subStr2 = address.substr(address.length - 4, 4)
    return subStr1 + '...' + subStr2
  }
  return ''
}
export function starkAddress() {
  var stark = store.state.web3.starkNet.starkNetAddress
  if (stark && stark.length > 5) {
    var subStr1 = stark.substr(0, 4)
    var subStr2 = stark.substr(stark.length - 4, 4)
    return subStr1 + '...' + subStr2
  }
  return 'not connected'
}
