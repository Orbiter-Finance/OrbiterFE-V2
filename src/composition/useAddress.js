import { web3State } from '../composition/hooks'
import { compatibleGlobalWalletConf } from './walletsResponsiveData'

export function showAddress() {
  const address = compatibleGlobalWalletConf.value.walletPayload.walletAddress
  if (address && address.length > 5) {
    const subStr1 = address.substr(0, 6)
    const subStr2 = address.substr(address.length - 4, 4)
    return subStr1 + '...' + subStr2
  }
  return ''
}
export function starkAddress() {
  const stark = web3State.starkNet.starkNetAddress
  if (stark && stark.length > 5) {
    const subStr1 = stark.substr(0, 6)
    const subStr2 = stark.substr(stark.length - 4, 4)
    return subStr1 + '...' + subStr2
  }
  return 'not connected'
}
