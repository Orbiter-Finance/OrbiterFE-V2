import { Address, Fuel, Provider, Wallet, toBech32 } from 'fuels'
import { defaultConnectors } from '@fuels/connectors'
import util from '../util'
import { utils } from 'ethers'
import {
  updateFuelAddress,
  updateFuelConnectStatus,
  web3State,
} from '../../composition/hooks'

const fuelProvider = () => {
  return new Fuel({
    connectors: defaultConnectors(),
  })
}

const fuelConnector = async () => {
  const fuel = fuelProvider()
  const r = await fuel.connectors()
  let response

  return new Promise((res) => {
    try {
      response = fuel.getConnector('Fuel Wallet')
    } catch (error) {
      response = null
    }

    setTimeout(() => {
      res(response)
    }, 500)
  })
}

const connect = async (name) => {
  const fuelC = await fuelConnector()
  if (!fuelC?.installed) {
    util.showMessage(`Please install ${name}`, 'warning')
    return
  }
  const fuel = fuelProvider()

  await fuel.selectConnector(name)
  await fuel.connect()
  const currentAccount = await fuelC.currentAccount()
  const address = new Address(currentAccount).toHexString()
  updateFuelAddress(address)
  updateFuelConnectStatus(true)
  return address
}

const fuelsAccount = () => {
  const connetd = isConnected()
  if (!connetd) return ''
  let address = web3State.fuel.fuelAddress
  return address
}

const disconnect = async () => {
  const fuelC = await fuelConnector()
  await fuelC.disconnect()
}

const isConnected = () => {
  return web3State.fuel.isConnected
}

const getBalance = async ({ tokenAddress, userAddress, chainId }) => {
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  const rpc = chainInfo?.rpc?.[0]
  const provider = await Provider.create(rpc)
  const fromWallet = Wallet.fromAddress(userAddress, provider)
  const res = BigInt(String(await fromWallet.getBalance(tokenAddress)))
  return res
}

const estimateGas = async ({ makerAddress, token }) => {
  try {
    const userAddress = fuelsAccount()
    const wallet = await fuelProvider().getWallet(userAddress)
    const memo = utils.hexlify(utils.toUtf8Bytes(`c=0000&t=${makerAddress}`))
    const request = await wallet.createTransfer(makerAddress, 1, token, {
      scriptData: memo,
    })
    const cost = await wallet.provider.getTransactionCost(request)
    return cost.maxGas.toString()
  } catch (error) {
    return '0'
  }
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
  const fuel = await fuelConnector()
  const hash = await fuel.sendTransaction(fromBech32, request)
  return hash
}

const fuelsHelper = {
  connect,
  isConnected,
  fuelsAccount,
  getBalance,
  transfer,
  disconnect,
  estimateGas,
}

export default fuelsHelper
