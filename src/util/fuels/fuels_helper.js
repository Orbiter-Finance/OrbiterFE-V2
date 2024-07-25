import { Address, Fuel, Provider, Wallet, toBech32 } from 'fuels'
import { defaultConnectors } from '@fuels/connectors'
import util from '../util'
import { utils } from 'ethers'

let address = ''

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
  if (!fuel.installed) {
    util.showMessage(`Please install fuel wallet`, 'warning')
    return
  }

  await fuel.selectConnector('Fuel Wallet')
  await fuel.connect()
  const fuelC = fuelConnector()
  const currentAccount = await fuelC.currentAccount()
  address = new Address(currentAccount).toHexString()
}

const fuelsAccount = async () => {
  const connetd = await isConnected()
  if (!connetd) return ''
  const fuel = fuelConnector()
  try {
    if (address) {
      return address
    } else {
      const currentAccount = await fuel.currentAccount()
      address = new Address(currentAccount).toHexString()
      return address
    }
  } catch (error) {
    return ''
  }
}

const isConnected = async () => {
  try {
    const fuel = fuelConnector()
    if (!fuel) return false
    const connected = await fuel.isConnected()
    return !!connected
  } catch (error) {
    return false
  }
}

const getBalance = async ({ tokenAddress, userAddress, chainId }) => {
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  const rpc = chainInfo?.rpc?.[0]
  const provider = await Provider.create(rpc)
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
}) => {
  const fromBech32 = toBech32(from)
  const fromAddress = new Address(fromBech32)

  const fuel = fuelConnector()
  const wallet = await fuelProvider().getWallet(fromAddress)

  const memo = utils.hexlify(
    utils.toUtf8Bytes(`c=${safeCode}&t=${targetAddress}`)
  )

  const request = await wallet.createTransfer(
    to,
    Number(amount),
    tokenAddress,
    {
      scriptData: memo,
    }
  )
  const hash = await fuel.sendTransaction(fromBech32, request)
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
