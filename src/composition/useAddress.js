import { web3State } from '../composition/hooks'
import { compatibleGlobalWalletConf } from './walletsResponsiveData'
import solanaHelper from '../util/solana/solana_helper'
import tonHelper from '../util/ton/ton_helper'
import tronHelper from '../util/tron/tron_helper'

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
export function solAddress() {
  const solanaAddress =
    web3State.solana.solanaAddress || solanaHelper.solanaAddress() || ''
  if (solanaAddress && solanaAddress.length > 5) {
    const subStr1 = solanaAddress.slice(0, 4)
    const subStr2 = solanaAddress.slice(solanaAddress.length - 4)
    return subStr1 + '...' + subStr2
  }
  return 'not connected'
}

export function tonAddress() {
  const tAddress = web3State?.ton?.tonAddress || tonHelper.account() || ''
  if (tAddress && tAddress.length > 5) {
    const subStr1 = tAddress.slice(0, 4)
    const subStr2 = tAddress.slice(tAddress.length - 4)
    return subStr1 + '...' + subStr2
  }
  return 'not connected'
}

export function tronChainAddress() {
  const tAddress =
    web3State?.tron?.tronAddress || tronHelper.tronAddress() || ''
  if (tAddress && tAddress.length > 5) {
    const subStr1 = tAddress.slice(0, 4)
    const subStr2 = tAddress.slice(tAddress.length - 4)
    return subStr1 + '...' + subStr2
  }
  return 'not connected'
}
