import * as bitcoin from 'bitcoinjs-lib'
import { bech32 } from 'bech32'

import util from '../util'
import { web3State } from '../../composition/useCoinbase'

const FRACTAL_WALLET_NAME = 'FRACTAL_WALLET_NAME'

const readWalletName = () => {
  return sessionStorage.getItem(FRACTAL_WALLET_NAME)
}

const updateWalletName = (str) => {
  sessionStorage.setItem(FRACTAL_WALLET_NAME, str?.toLocaleLowerCase() || '')
}

const getWallet = () => {
  const walletName = readWalletName()
  const wallet = window?.[walletName?.toLocaleLowerCase() || '']
  // const provider = wallet?.solana || wallet
  // const provider = window.solflare

  return wallet
}

const getBalance = async (userAddress, tokenAddress, localChainID) => {
  const wallet = getProvider()
  console.log('1111', wallet, userAddress, tokenAddress, localChainID)
  const b = await wallet.getBalance()
  console.log('getBalance', b)
  return String(b.total)
}

const getChainInfo = (chainId) => {
  if (!chainId) return null
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  return chainInfo
}

const checkAddress = (address) => {
  try {
    if (address.startsWith('bc1')) {
      const { prefix } = bech32.decode(address)
      if (prefix === 'bc') {
        return true
      }
    } else {
      bitcoin.address.toOutputScript(address)
      return true
    }
  } catch (e) {
    return false
  }
  return false
}

const getProvider = () => {
  const provider = getWallet()

  if (!provider) {
    util.showMessage(
      'Install ' + (readWalletName() || 'Fractal Wallet'),
      'error'
    )
    updateWalletName('')
  }

  return provider
}

const disConnect = async () => {
  await getProvider()?.disconnect()
  updateWalletName('')
}

const connect = async (walletName) => {
  updateWalletName(walletName)
  const addRessList = await getProvider()?.requestAccounts()
  const address = addRessList?.[0]
  if (address) {
    web3State.fractal.fractalAddress = address
    web3State.fractal.fractalIsConnect = !!address
    web3State.fractal.fractalWalletIcon = walletName
  }
  return address
}

const isConnect = () => {
  return !!web3State.fractal.fractalIsConnect
}

const fractalAddress = () => {
  return web3State.fractal.fractalAddress
}

const transfer = async (
  maker,
  value,
  tokenAddress,
  safeCode,
  targetAddress,
  chainId
) => {
  const wallet = getWallet()

  const res = await wallet.sendBitcoin(maker, Number(value), {
    memo: `c=${safeCode}&t=${targetAddress}`,
  })
  console.log('res', res)
  return res
}

const fractalHelper = {
  isConnect,
  disConnect,
  getBalance,
  connect,
  readWalletName,
  updateWalletName,
  fractalAddress,
  transfer,
  checkAddress,
}

export default fractalHelper
