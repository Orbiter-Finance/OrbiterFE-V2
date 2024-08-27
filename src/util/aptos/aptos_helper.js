import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk'

import { web3State } from '../../composition/useCoinbase'
import util from '../util'

const FRACTAL_WALLET_NAME = 'FRACTAL_WALLET_NAME'

const readWalletName = () => {
  return sessionStorage.getItem(FRACTAL_WALLET_NAME)
}

const updateWalletName = (str) => {
  sessionStorage.setItem(FRACTAL_WALLET_NAME, str?.toLocaleLowerCase() || '')
}

const getWallet = () => {
  const walletName = readWalletName()
  const walletGroup = window?.[walletName?.toLocaleLowerCase() || '']
  const wallet = walletGroup?.aptos || walletGroup

  return wallet
}

const getChainInfo = (chainId) => {
  if (!chainId) return null
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  return chainInfo
}

const getBalance = async (userAddress, tokenAddress, localChainID) => {
  const provider = getProvider(localChainID)
  const chainInfo = getChainInfo(localChainID)
  const nativeAddress = chainInfo?.nativeCurrency?.address
  try {
    if (nativeAddress === tokenAddress) {
      const aptRes = await provider.getAccountResource({
        accountAddress: userAddress,
        resourceType: '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>',
      })
      return aptRes?.coin?.value || '0'
    }
    const res = await provider.getAccountResource({
      accountAddress: userAddress,
      resourceType: `0x1::coin::CoinStore<${tokenAddress}>`,
    })

    console.log('res', res)
    return res?.coin?.value || '0'
  } catch (error) {
    console.log('error', error)
  }

  return '0'
}

const getProvider = (chainId) => {
  const wallet = getWallet()
  if (!wallet) {
    util.showMessage('Install ' + (readWalletName() || ' Wallet'), 'error')
    updateWalletName('')
  }
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  console.log('chainInfo', chainInfo)
  const rpc = chainInfo?.rpc?.[0]
  //   wallet?.networkInfo?.url
  //   const config = new AptosConfig({ network: Network.LOCAL }) // default network is devnet
  const config = new AptosConfig({
    network: Network.CUSTOM,
    fullnode: rpc,
  }) // default network is devnet
  const aptos = new Aptos(config)

  return aptos
}

const disConnect = async () => {
  await getWallet()?.disconnect()
  updateWalletName('')
}

const connect = async (walletName) => {
  updateWalletName(walletName)
  const res = await getWallet()?.connect()
  const address = res?.address
  if (address) {
    web3State.aptos.aptosAddress = address
    web3State.aptos.aptosIsConnect = !!address
    web3State.aptos.aptosWalletIcon = walletName
  }
  return address
}

const isConnect = () => {
  return !!web3State.aptos.aptosIsConnect
}

const aptosAddress = () => {
  return web3State.aptos.aptosAddress
}

const transfer = async (
  maker,
  value,
  tokenAddress,
  safeCode,
  targetAddress,
  chainId
) => {
  const aptos = getProvider(chainId)
  const wallet = getWallet()
  console.log('wallet', wallet, maker, value)

  const address = aptosAddress()

  const chainInfo = getChainInfo(chainId)
  console.log('chainInfo', chainInfo)

  const contractList = chainInfo?.contracts || []

  const contractAddress = contractList?.filter(
    (item) =>
      item?.name?.toLocaleLowerCase() ===
        'OrbiterRouterV3'?.toLocaleLowerCase() ||
      item?.key?.toLocaleLowerCase() === 'OrbiterRouterV3'?.toLocaleLowerCase()
  )[0]?.address
  console.log('contractAddress', contractAddress)

  const txn = await aptos.transaction.build.simple({
    sender: address,
    data: {
      function: `${contractAddress}::message::transfer_token`,
      typeArguments: [tokenAddress],
      functionArguments: [maker, value, `c=${safeCode}&t=${targetAddress}`],
    },
  })

  console.log('\n=== Transfer transaction ===\n', txn)
  const res = await wallet.signAndSubmitTransaction(txn)
  console.log('res', res)
  return res?.hash
}

const aptosHelper = {
  isConnect,
  disConnect,
  getBalance,
  connect,
  readWalletName,
  updateWalletName,
  aptosAddress,
  transfer,
}

export default aptosHelper
