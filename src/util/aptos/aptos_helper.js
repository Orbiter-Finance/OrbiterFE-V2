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
  console.log('1111', provider, userAddress, tokenAddress, localChainID)

  const chainInfo = getChainInfo(localChainID)
  console.log('chainInfo', chainInfo)
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
  }
  return address
}

const isConnect = () => {
  return !!web3State.aptos.aptosIsConnect
}

const aptosAddress = () => {
  return web3State.aptos.aptosAddress
}

const transfer = async (maekr, value) => {
  const aptos = getProvider()
  const wallet = getProvider()
  console.log('wallet', wallet, maekr, value)

  const address = aptosAddress()

  const txn = await aptos.transaction.build.simple({
    sender: address,
    data: {
      function: '0x1::coin::transfer',
      typeArguments: [
        '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::WETH',
      ],
      functionArguments: [
        '0x12fec277a443d9ee4a21013841439508930b227b47a81e2b28fb6ceeea728fbb',
        100,
      ],
    },
  })

  console.log('\n=== Transfer transaction ===\n', txn)
  const res = await wallet.signAndSubmitTransaction(txn)
  console.log('res', res)
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
