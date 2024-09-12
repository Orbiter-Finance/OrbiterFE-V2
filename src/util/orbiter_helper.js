import { validateAndParseAddress } from 'starknet'
import { CHAIN_ID } from '../config'
import tonHelper from './ton/ton_helper'
import solanaHelper from './solana/solana_helper'
import {
  setConnectWalletGroupKey,
  setSelectWalletDialogVisible,
  web3State,
} from '../composition/hooks'
import { compatibleGlobalWalletConf } from '../composition/walletsResponsiveData/index.js'
import { WALLETCONNECT } from './walletsDispatchers/constants.js'
import { ethereumClient } from './walletsDispatchers/pcBrowser/walletConnectPCBrowserDispatcher.js'
import { store } from '../store/index.js'
import { disConnectStarkNetWallet } from './constants/starknet/helper.js'
import { walletDispatchersOnDisconnect } from './walletsDispatchers'
import tronHelper from './tron/tron_helper.js'

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

const openTronConnectModal = () => {
  setSelectWalletDialogVisible(true)
  setConnectWalletGroupKey('TRON')
}

const tonConnectModal = async () => {
  await tonHelper.connect()
}

const openFractalConnectModal = () => {
  setSelectWalletDialogVisible(true)
  setConnectWalletGroupKey('FRACTAL')
}

const openFuelConnectModal = () => {
  setSelectWalletDialogVisible(true)
  setConnectWalletGroupKey('FUEL')
}

const openAptosConnectModal = () => {
  setSelectWalletDialogVisible(true)
  setConnectWalletGroupKey('APTOS')
}

const evmChain = [
  CHAIN_ID.zksync,
  CHAIN_ID.zksync_test,
  CHAIN_ID.imx,
  CHAIN_ID.imx_test,
  CHAIN_ID.loopring,
  CHAIN_ID.loopring_test,
]

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

const isFractalChain = ({ chainId }) => {
  return chainId === CHAIN_ID.fractal_test
}

const isAptosChain = ({ chainId }) => {
  return chainId === CHAIN_ID.movement_test
}

const isTronChain = ({ chainId }) => {
  return (
    chainId === CHAIN_ID.tron_nile_test ||
    chainId === CHAIN_ID.tron_shasta_test ||
    chainId === CHAIN_ID.tron
  )
}

const isEVMChain = ({ chainId }) => {
  const flag = evmChain.some(
    (item) => item.toLocaleLowerCase() === String(chainId).toLocaleLowerCase()
  )
  return Number(chainId) || flag
}

const isNotEVMChain = ({ chainId }) => {
  return (
    isSolanaChain({ chainId }) ||
    isTonChain({ chainId }) ||
    isStarknetChain({ chainId }) ||
    isFuelChain({ chainId }) ||
    isFractalChain({ chainId }) ||
    isAptosChain({ chainId }) ||
    isTronChain({ chainId })
  )
}

const isMiddleDecimals = ({ decimals }) => {
  const d = Number(decimals)
  return d === 8 || d === 9
}

const currentConnectChainInfo = ({ chainId, isList }) => {
  const evmAddress =
    compatibleGlobalWalletConf.value.walletPayload.walletAddress
  const evmInfo = {
    address: evmAddress,
    open: openEvmConnectModal,
    isConnected: !!evmAddress && evmAddress !== '0x',
    checkAddress: checkEvmAddress,
    walletIcon: compatibleGlobalWalletConf?.walletType?.toLocaleLowerCase(),
    type: 'EVM',
    disconnect: () => {
      localStorage.setItem('selectedWallet', JSON.stringify({}))
      store.commit('updateLocalLogin', false)
      localStorage.setItem('localLogin', false)
      if (compatibleGlobalWalletConf.value.walletType === WALLETCONNECT) {
        ethereumClient.disconnect()
        localStorage.setItem('wc@2:client:0.3//session', null)
      }
      walletDispatchersOnDisconnect[
        compatibleGlobalWalletConf.value.walletType
      ]()
    },
  }

  const starknetInfo = {
    address: web3State.starkNet.starkNetAddress,
    open: openStarknetConnectModal,
    isConnected: !!web3State.starkNet.starkIsConnected,
    checkAddress: checkStarknetAddress,
    walletIcon: CHAIN_ID.starknet,
    type: 'Starknet',
    disconnect: disConnectStarkNetWallet,
  }
  const solanaInfo = {
    address: web3State.solana.solanaAddress,
    open: openSolanaConnectModal,
    isConnected: !!web3State.solana.solanaIsConnected,
    checkAddress: (address) => {
      return solanaHelper.checkAddress(address)
    },
    walletIcon: solanaHelper.readWalletName() || CHAIN_ID.solana,
    type: 'Solana',
    disconnect: async () => {
      await solanaHelper.disConnect()
      setConnectWalletGroupKey('SOLANA')
      store.commit('updateSolanaAddress', '')
      store.commit('updateSolanaWalletName', '')
      store.commit('updateSolanaWalletIcon', '')
      store.commit('updateSolanaIsConnect', false)
    },
  }
  const tonInfo = {
    address: tonHelper.account(),
    open: tonConnectModal,
    isConnected: !!tonHelper.isConnected(),
    checkAddress: (address) => {
      return tonHelper.checkAddress(address)
    },
    walletIcon: CHAIN_ID.ton || CHAIN_ID.ton,
    type: 'Ton',
    disconnect: async () => {
      await tonHelper.disconnect()
    },
  }

  const tronInfo = {
    address: web3State.tron.tronAddress,
    open: openTronConnectModal,
    isConnected: !!web3State.tron.tronIsConnected,
    checkAddress: () => {
      return true
    },
    walletIcon: web3State.tron.tronWalletIcon || CHAIN_ID.tron,
    type: 'Tron',
    disconnect: async () => {
      await tronHelper.disConnect()
      web3State.tron.tronAddress = ''
      web3State.tron.tronIsConnected = false
      web3State.tron.tronWalletName = ''
      web3State.tron.tronChain = ''
      web3State.tron.tronWalletIcon = ''
    },
  }

  if (isList) {
    return [evmInfo, starknetInfo, solanaInfo, tonInfo, tronInfo]
  }

  let current = null

  if (isTonChain({ chainId })) {
    current = tonInfo
  } else if (isSolanaChain({ chainId })) {
    current = solanaInfo
  } else if (isStarknetChain({ chainId })) {
    current = starknetInfo
  } else if (isTronChain({ chainId })) {
    current = tronInfo
  } else if (isEVMChain({ chainId }) && !isNotEVMChain({ chainId })) {
    current = evmInfo
  } else {
    current = null
  }
  return current
    ? {
        ...current,
        chainId,
      }
    : current
}

const checkAddress = ({ address, chainId }) => {
  if (!address || !chainId) return false
  const group = currentConnectChainInfo({ chainId })

  return !!group?.checkAddress(address)
}

const openConnectModal = async ({ chainId }) => {
  if (!chainId) return

  const group = currentConnectChainInfo({ chainId })

  return !!group?.open()
}

const orbiterHelper = {
  isSolanaChain,
  isFractalChain,
  isAptosChain,
  isTonChain,
  isStarknetChain,
  isTronChain,
  isFuelChain,
  isNotEVMChain,
  isEVMChain,
  isMiddleDecimals,
  checkAddress,
  openConnectModal,
  currentConnectChainInfo,
}

export default orbiterHelper
