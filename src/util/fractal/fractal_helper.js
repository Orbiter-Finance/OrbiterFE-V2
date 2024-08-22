import { Connection } from '@solana/web3.js'

import util from '../util'
import { web3State } from '../../composition/useCoinbase'

const FRACTAL_WALLET_NAME = 'FRACTAL_WALLET_NAME'

const readWalletName = () => {
  return sessionStorage.getItem(FRACTAL_WALLET_NAME)
}

const updateWalletName = (str) => {
  sessionStorage.setItem(FRACTAL_WALLET_NAME, str?.toLocaleLowerCase() || '')
}

const getConnection = (chainId) => {
  if (!chainId) return null
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  const rpc = chainInfo?.rpc?.[0]
  return rpc ? new Connection(rpc, 'confirmed') : null
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

const getProvider = () => {
  const provider = getWallet()

  if (!provider) {
    util.showMessage(
      'Install ' + (readWalletName() || 'Solana Wallet'),
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
  }
  return address
}

const isConnect = () => {
  return !!web3State.fractal.fractalIsConnect
}

const fractalAddress = () => {
  return web3State.fractal.fractalAddress
}

const transfer = async (maekr, value) => {
  const wallet = getProvider()
  console.log('wallet', wallet, maekr, value)
  const res = await wallet.sendBitcoin(maekr, Number(value))
  console.log('res', res)
  return res
}

const fractalHelper = {
  getConnection,
  isConnect,
  disConnect,
  getBalance,
  connect,
  readWalletName,
  updateWalletName,
  fractalAddress,
  transfer,
}

export default fractalHelper
