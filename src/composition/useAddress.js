import { web3State } from '../composition/hooks'
import { compatibleGlobalWalletConf } from './walletsResponsiveData'
import tonHelper from '../util/ton/ton_helper'
import fractalHelper from '../util/fractal/fractal_helper'
import aptosHelper from '../util/aptos/aptos_helper'

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
  const solanaAddress = web3State.solana.solanaAddress || ''
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

export async function fuelAddress() {
  const fAddress = web3State.fuel.fuelAddress || ''
  if (fAddress && fAddress.length > 5) {
    const subStr1 = fAddress.slice(0, 4)
    const subStr2 = fAddress.slice(fAddress.length - 4)
    return subStr1 + '...' + subStr2
  }
  return 'not connected'
}
export function fractalAddress() {
  const address =
    web3State.fractal.fractalAddress || fractalHelper.fractalAddress() || ''
  if (address && address.length > 5) {
    const subStr1 = address.slice(0, 4)
    const subStr2 = address.slice(address.length - 4)
    return subStr1 + '...' + subStr2
  }
  return 'not connected'
}

export function aptosAddress() {
  const address = web3State.aptos.aptos || aptosHelper.aptosAddress() || ''
  if (address && address.length > 5) {
    const subStr1 = address.slice(0, 4)
    const subStr2 = address.slice(address.length - 4)

    return subStr1 + '...' + subStr2
  }
  return 'not connected'
}

export function tronChainAddress() {
  const tAddress = web3State?.tron?.tronAddress || ''
  if (tAddress && tAddress.length > 5) {
    const subStr1 = tAddress.slice(0, 4)
    const subStr2 = tAddress.slice(tAddress.length - 4)
    return subStr1 + '...' + subStr2
  }
  return 'not connected'
}
