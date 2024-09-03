import util from '../util'

import { web3State } from '../../composition/useCoinbase'
import { CHAIN_ID } from '../../config'

const TRON_WALLET_NAME = 'TRON_WALLET_NAME'

const readWalletName = () => {
  return sessionStorage.getItem(TRON_WALLET_NAME)
}

const updateWalletName = (str) => {
  sessionStorage.setItem(TRON_WALLET_NAME, str || '')
}

const getWallet = () => {
  const walletName = readWalletName()
  const wallet = window?.[walletName || ''] || window

  return wallet
}

const getTronLink = () => {
  const wallet = getWallet()
  return wallet?.tronLink || wallet
}

const getProvider = () => {
  const wallet = getTronLink()
  const walletName = readWalletName() || 'Tron Wallet'
  if (!wallet?.tronWeb) {
    util.showMessage(
      wallet ? `Login ${walletName}` : `Install ${walletName}`,
      'error'
    )
    updateWalletName('')
  }

  return wallet?.tronWeb
}

const disConnect = async () => {
  web3State.tron.tronAddress = ''
  web3State.tron.tronChain = ''
  web3State.tron.tronIsConnected = false
  web3State.tron.tronWalletIcon = ''
  web3State.tron.walletName = ''
  updateWalletName('')
}

const connect = async (walletName) => {
  updateWalletName(walletName)
  const tronLink = getTronLink()
  const { code, message } = await tronLink?.request({
    method: 'tron_requestAccounts',
  })
  const tronWeb = getProvider()
  if (!tronWeb) return
  const address = tronWeb?.defaultAddress?.base58 || ''
  const ready = !!tronWeb?.ready
  const fullNodeUrl = tronWeb?.fullNode?.host

  if (fullNodeUrl?.includes('api.trongrid.io')) {
    console.log('Mainnet')
    web3State.tron.tronChain = CHAIN_ID.tron
  } else if (fullNodeUrl?.includes('shasta')) {
    console.log('Shasta')
    web3State.tron.tronChain = CHAIN_ID.tron_shasta_test
  } else if (fullNodeUrl?.includes('nile')) {
    console.log('Nile')
    web3State.tron.tronChain = CHAIN_ID.tron_nile_test
  } else {
    console.log('Unknown Network')
  }

  if (code !== 200) {
    util.showMessage(message, 'error')
  }

  web3State.tron.tronAddress = address
  web3State.tron.tronIsConnected = ready
  web3State.tron.tronWalletIcon = walletName

  console.log('code, message', code, message, address, ready, walletName)

  return !!address?.toString()
}

const isConnect = () => {
  return getTronLink()?.ready
}

const tronAddress = () => {
  const address = web3State.tron.tronAddress
  return address?.toString()
}

const getBalance = async ({ tokenAddress, chainId, userAddress }) => {
  const provider = getProvider()
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  const nativeCurrency = chainInfo?.nativeCurrency?.address
  if (nativeCurrency === tokenAddress) {
    const res = await provider.trx.getBalance(userAddress)
    return String(res || 0)
  } else {
    const contract = await provider.contract().at(tokenAddress)
    const balance = await contract.methods.balanceOf(userAddress).call()
    return balance.toString()
  }
}

const metisGas = async ({ chainId, tokenAddress, makerAddress }) => {
  const provider = getProvider()
  const address = tronAddress()
  if (!address) return '0'

  const chainInfo = util.getV3ChainInfoByChainId(chainId)

  const contractList = chainInfo?.contracts || []
  const contractAddress = contractList?.filter(
    (item) =>
      item?.name?.toLocaleLowerCase() === 'OrbiterRouterV3'?.toLocaleLowerCase()
  )[0]?.address

  const tokenTxReceipt =
    await provider.transactionBuilder.triggerConfirmedConstantContract(
      contractAddress,
      'transferToken(address,address,uint256,bytes)',
      {},
      [
        { type: 'address', value: tokenAddress },
        { type: 'address', value: makerAddress },
        { type: 'uint256', value: '1' },
        {
          type: 'bytes',
          value: provider.toHex(`c=0000&t=${address}`),
        },
      ],
      address
    )
  const transactionSize = tokenTxReceipt.transaction.raw_data_hex.length / 2
  const bandwidthUsed = transactionSize
  console.log(
    'TRC-10 token transfer successful:',
    tokenTxReceipt,
    bandwidthUsed,
    tokenTxReceipt.energy_used * bandwidthUsed
  )
}

const transfer = async ({
  from,
  to,
  tokenAddress,
  targetAddress,
  amount,
  safeCode,
  chainId,
}) => {
  const provider = getProvider()

  const chainInfo = util.getV3ChainInfoByChainId(chainId)

  const contractList = chainInfo?.contracts || []

  const contractAddress = contractList?.filter(
    (item) =>
      item?.name?.toLocaleLowerCase() === 'OrbiterRouterV3'?.toLocaleLowerCase()
  )[0]?.address

  const contract = await provider.contract().at(contractAddress)

  const nativeCurrency = chainInfo?.nativeCurrency?.address

  if (nativeCurrency === tokenAddress) {
    const tokenTxReceipt = await contract.methods
      .transfer(to, provider.toHex(`c=${safeCode}&t=${targetAddress}`))
      .send({ callValue: amount })
    return tokenTxReceipt
  } else {
    const tokenContract = await provider.contract().at(tokenAddress)
    const allowance = await tokenContract.methods
      .allowance(from, contractAddress)
      .call()
    if (Number(allowance) <= Number(amount)) {
      await tokenContract.methods['approve(address,uint256)'](
        contractAddress,
        amount
      ).send()
    }
    const tokenTxReceipt = await contract.methods
      .transferToken(
        tokenAddress,
        to,
        amount,
        provider.toHex(`c=${safeCode}&t=${targetAddress}`)
      )
      .send()
    return tokenTxReceipt
  }
}

const checkAddress = (address) => {
  const provider = getProvider()
  let isAddress = false
  try {
    isAddress = provider.isAddress(address)
  } catch (error) {
    console.log('error', error)
  }
  return !!address && isAddress
}

const tronHelper = {
  isConnect,
  tronAddress,
  transfer,
  disConnect,
  connect,
  readWalletName,
  updateWalletName,
  getBalance,
  metisGas,
  checkAddress,
}

export default tronHelper
