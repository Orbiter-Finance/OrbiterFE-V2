import { Address, Fuel, Provider, Wallet, toBech32 } from 'fuels'
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
  try {
    return fuel.getConnector('Fuel Wallet')
  } catch (error) {
    return null
  }
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
    console.log('currentAccount', currentAccount)

    return new Address(currentAccount).toHexString()
  } catch (error) {
    return ''
  }
}

const isConnected = async () => {
  const fuel = fuelConnector()
  const connected = await fuel.isConnected()
  console.log('connected', connected)
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
  console.log(
    'transfer',
    from,
    to,
    tokenAddress,
    targetAddress,
    amount,
    safeCode,
    chainId
  )

  const fromBech32 = toBech32(from)
  const fromAddress = new Address(fromBech32)
  console.log('fromAddress', fromAddress)

  const tokenBech32 = toBech32(tokenAddress)
  const token = new Address(tokenBech32)
  console.log('token', token)

  const toBech = toBech32(to)
  const toAddress = new Address(toBech)
  console.log('toAddress', toAddress)

  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  console.log('chainInfo', chainInfo)
  const rpc = chainInfo?.rpc?.[0]
  const provider = await Provider.create(rpc)
  console.log('provider', provider)
  const fuel = fuelConnector()
  console.log('fuelConnector', fuel)

  const fuel1 = fuelProvider()
  console.log('fuelProvider', fuel1)

  const wallet = await fuelProvider().getWallet(fromAddress)
  console.log('wallet', wallet)

  const memo = utils.hexlify(
    utils.toUtf8Bytes(`c=${safeCode}&t=${targetAddress}`)
  )

  console.log('memo', memo)

  // const transactionRequest = new ScriptTransactionRequest({
  //   gasLimit: 2000,
  //   maxFee: 0,
  // })

  // console.log('gas', transactionRequest)

  // transactionRequest.addCoinOutput(fromAddress, amount, tokenAddress)

  const request = await wallet.createTransfer(
    to,
    Number(amount),
    tokenAddress,
    {
      scriptData: memo,
    }
  )
  console.log('request', request)

  // const estimateFee = await provider.estimateTxGasAndFee({ transactionRequest: request });
  // const txRequest = {
  //   gasLimit: estimateFee.gasLimit,
  //   maxFee: estimateFee.maxFee,
  //   scriptData: memo,
  // }
  // await this.getGasPrice(txRequest);
  // const tx = await this.wallet.transfer(to, Number(amount), token, txRequest)

  // const predicateCoins = await provider.getResourcesToSpend(
  //   [{ amount, assetId: toAddress }],
  //   { message: [memo] }
  // )
  // console.log('predicateCoins', predicateCoins)
  // transactionRequest.addResources(predicateCoins)
  // console.log('transactionRequest', transactionRequest)
  const hash = await fuel.sendTransaction(fromBech32, request)
  console.log('hash', hash)
  return hash
}

const fuelsHelper = {
  connect,
  isConnected,
  fuelsAccount,
  getBalance,
  transfer,
}

export default fuelsHelper
