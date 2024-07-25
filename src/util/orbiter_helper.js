import { validateAndParseAddress } from 'starknet'
import { CHAIN_ID } from '../config'
import tonHelper from './ton/ton_helper'
import solanaHelper from './solana/solana_helper'
import {
  setConnectWalletGroupKey,
  setSelectWalletDialogVisible,
} from '../composition/hooks'
import fuelsHelper from './fuels/fuels_helper'

const checkStarknetAddress = (address) => {
  if (address?.length <= 50) {
    return false
  }
  try {
    return validateAndParseAddress(address)
  } catch (error) {
    return false
  }
}

const checkFuelsAddress = (address) => {
  const ETH_ADDRESS = new RegExp('^(0x)?[0-9a-fA-F]{64}$')
  return ETH_ADDRESS.test(address)
}

const checkEvmAddress = (address) => {
  const ETH_ADDRESS = new RegExp('^(0x)?[0-9a-fA-F]{40}$')
  return ETH_ADDRESS.test(address)
}

const checkAddress = ({ address, chainId }) => {
  if (!address || !chainId) return false
  const evmChain = [
    CHAIN_ID.zksync,
    CHAIN_ID.zksync_test,
    CHAIN_ID.imx,
    CHAIN_ID.imx_test,
    CHAIN_ID.loopring,
    CHAIN_ID.loopring_test,
  ]
  const flag = evmChain.some(
    (item) => item.toLocaleLowerCase() === String(chainId).toLocaleLowerCase()
  )
  if (chainId === CHAIN_ID.ton || chainId === CHAIN_ID.ton_test) {
    return tonHelper.checkAddress(address)
  } else if (chainId === CHAIN_ID.fuel || chainId === CHAIN_ID.fuel_test) {
    return checkFuelsAddress(address)
  } else if (chainId === CHAIN_ID.solana || chainId === CHAIN_ID.solana_test) {
    return solanaHelper.checkAddress(address)
  } else if (
    chainId === CHAIN_ID.starknet ||
    chainId === CHAIN_ID.starknet_test
  ) {
    console.log('openConnectModal', address, chainId)
    return checkStarknetAddress(address)
  } else if (Number(chainId) || flag) {
    return checkEvmAddress(address)
  } else {
    return false
  }
}

const openEvmConnectModal = () => {
  setSelectWalletDialogVisible(true)
  setConnectWalletGroupKey('EVM')
}

const openStarknetConnectModal = () => {
  setSelectWalletDialogVisible(true)
  setConnectWalletGroupKey('STARKNET')
}

const openSolanaConnectModal = () => {
  setSelectWalletDialogVisible(true)
  setConnectWalletGroupKey('SOLANA')
}

const tonConnectModal = async () => {
  await tonHelper.connect()
}

const openConnectModal = async ({ chainId }) => {
  if (!chainId) return
  const evmChain = [
    CHAIN_ID.zksync,
    CHAIN_ID.zksync_test,
    CHAIN_ID.imx,
    CHAIN_ID.imx_test,
    CHAIN_ID.loopring,
    CHAIN_ID.loopring_test,
  ]
  const flag = evmChain.some(
    (item) => item.toLocaleLowerCase() === String(chainId).toLocaleLowerCase()
  )
  if (chainId === CHAIN_ID.ton || chainId === CHAIN_ID.ton_test) {
    await tonConnectModal()
  } else if (chainId === CHAIN_ID.fuel || chainId === CHAIN_ID.fuel_test) {
    await fuelsHelper.connect()
  } else if (chainId === CHAIN_ID.solana || chainId === CHAIN_ID.solana_test) {
    openSolanaConnectModal()
  } else if (
    chainId === CHAIN_ID.starknet ||
    chainId === CHAIN_ID.starknet_test
  ) {
    openStarknetConnectModal()
  } else if (Number(chainId) || flag) {
    openEvmConnectModal()
  } else {
    return false
  }
}

const isSolanaChain = ({ chainId }) => {
  return (
    chainId === CHAIN_ID.solana ||
    chainId === CHAIN_ID.solana_test ||
    chainId === CHAIN_ID.eclipse_test ||
    chainId === CHAIN_ID.sonic_test
  )
}

const isTonChain = ({ chainId }) => {
  return chainId === CHAIN_ID.ton || chainId === CHAIN_ID.ton_test
}

const isStarknetChain = ({ chainId }) => {
  return chainId === CHAIN_ID.starknet || chainId === CHAIN_ID.starknet_test
}

const isFuelChain = ({ chainId }) => {
  return chainId === CHAIN_ID.fuel || chainId === CHAIN_ID.fuel_test
}

const isNotEVMChain = ({ chainId }) => {
  return (
    isSolanaChain({ chainId }) ||
    isTonChain({ chainId }) ||
    isStarknetChain({ chainId }) ||
    isFuelChain({ chainId })
  )
}

const orbiterHelper = {
  checkAddress,
  openConnectModal,
  isSolanaChain,
  isTonChain,
  isStarknetChain,
  isFuelChain,
  isNotEVMChain,
}

export default orbiterHelper
