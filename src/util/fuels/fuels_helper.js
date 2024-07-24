import {
  Address,
  Fuel,
  Provider,
  Wallet,
  ScriptTransactionRequest,
} from 'fuels'
import { defaultConnectors } from '@fuels/connectors'
import util from '../util'
import { utils } from 'ethers'

const fuelProvider = () => {
  return new Fuel({
    connectors: defaultConnectors(),
  })
}

const fuelConnector = () => {
  const fuel = fuelProvider()
  return fuel.getConnector('Fuel Wallet')
}

const connect = async () => {
  const fuel = fuelProvider()
  await fuel.selectConnector('Fuel Wallet')
  await fuel.connect()
}

const fuelsAccount = async () => {
  if (!isConnected()) return ''
  const fuel = fuelConnector()
  try {
    const currentAccount = await fuel.currentAccount()

    return new Address(currentAccount).toHexString()
  } catch (error) {
    return ''
  }
}

const isConnected = async () => {
  const fuel = fuelConnector()
  const connected = fuel.connected
  return !!connected
}

const getBalance = async ({ tokenAddress, userAddress, chainId }) => {
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  const rpc = chainInfo?.rpc?.[0]
  const provider = await Provider.create(rpc)
  console.log('provider', provider)
  const p = fuelProvider()
  console.log('p', p)
  const fuel = fuelConnector()
  console.log('fuel', fuel)
  const fromWallet = Wallet.fromAddress(userAddress, provider)
  const res = BigInt(String(await fromWallet.getBalance(tokenAddress)))
  return res
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
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  console.log('chainInfo', chainInfo)
  const rpc = chainInfo?.rpc?.[0]
  const provider = await Provider.create(rpc)
  console.log('provider', provider)
  const fuel = fuelConnector()
  console.log('fuel', fuel)

  const memo = utils.toUtf8Bytes(
    utils.hexlify(utils.toUtf8Bytes(`c=${safeCode}&t=${targetAddress}`))
  )

  const transactionRequest = new ScriptTransactionRequest({
    gasLimit: 2000,
    maxFee: 0,
  })

  transactionRequest.addCoinOutput(from, 1000000, tokenAddress)

  const predicateCoins = await fuel.getResourcesToSpend(
    [{ amount, assetId: to }],
    { message: [memo] }
  )
  transactionRequest.addResources(predicateCoins)
  console.log('transactionRequest', transactionRequest)
  const hash = await fuel.sendTransaction(from, transactionRequest)
  console.log('hash', hash)
}

const fuelsHelper = {
  connect,
  isConnected,
  fuelsAccount,
  getBalance,
  transfer,
}

export default fuelsHelper
