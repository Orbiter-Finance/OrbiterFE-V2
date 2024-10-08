import { TonConnectUI } from '@tonconnect/ui'
import TonWeb from 'tonweb'
import { store } from '../../store'
import { isProd } from '../env'
import { CHAIN_ID } from '../../config'
import util from '../util'
import { web3State } from '../../composition/useCoinbase'
import { formatEther } from 'viem'

let tonConnect

export const checkNull = (a) => {
  if (a === null || a === undefined || a === '' || a === '0x')
    throw new Error('checkNull')
  if (typeof a === 'number' && isNaN(a)) throw new Error('checkNaN')
}

const checkBN = (bn, bigInt) => {
  if (bn.toString(2) !== bigInt.toString(2)) throw new Error('checkBN')
  if (bn.toString(10) !== bigInt.toString(10)) throw new Error('checkBN')
  if (bn.toString(16) !== bigInt.toString(16)) throw new Error('checkBN')
}

const bytesToBase64 = (bytes) => {
  const a = Buffer.from(bytes).toString('base64')
  const b = TonWeb.utils.bytesToBase64(bytes)
  if (a !== b) throw new Error('bytesToBase64')
  return a
}

const readIntFromBitString = (bs, cursor, bits) => {
  let n = BigInt(0)
  for (let i = 0; i < bits; i++) {
    n *= BigInt(2)
    n += BigInt(bs.get(cursor + i))
  }
  return n
}

const parseAddress = (cell) => {
  let n = readIntFromBitString(cell.bits, 3, 8)
  if (n > BigInt(127)) {
    n = n - BigInt(256)
  }
  const hashPart = readIntFromBitString(cell.bits, 3 + 8, 256)
  if (n.toString(10) + ':' + hashPart.toString(16) === '0:0') return null
  const s = n.toString(10) + ':' + hashPart.toString(16).padStart(64, '0')
  return new TonWeb.Address(s)
}

const removeHexPrefix = (hex) => {
  if (hex.startsWith('0x')) {
    hex = hex.substring(2)
  }
  if (hex.indexOf('0x') > -1) throw new Error('removeHexPrefix')
  return hex
}

const hexToBN = (hex) /* BN */ => {
  checkNull(hex)
  hex = removeHexPrefix(hex)

  const bn = new TonWeb.utils.BN(hex, 16)
  const bigInt = BigInt('0x' + hex)
  checkBN(bn, bigInt)
  return bn
}

const getJettonWalletAddress = async ({ tonweb, userAdress, tokenAddress }) => {
  const cell = new TonWeb.boc.Cell()

  cell.bits.writeAddress(userAdress)

  const getWalletAddressResponse = await tonweb.provider.call2(
    tokenAddress,
    'get_wallet_address',
    [['tvm.Slice', bytesToBase64(await cell.toBoc(false))]]
  )
  const jettonWalletAddress = parseAddress(getWalletAddressResponse)
  return jettonWalletAddress
}

const addressToTonwebAddress = (address) => {
  return new TonWeb.Address(address).toString(true, true, false, !isProd())
}

const tonConnectCall = async () => {
  if (tonConnect) {
    return tonConnect
  }
  const url = new URL(window.location.href)
  const tonConnectUI = new TonConnectUI({
    manifestUrl: url.origin + '/tonconnect-manifest.json',
    buttonRootId: 'ton-connect-wallet',
  })

  tonConnect = tonConnectUI
  tonConnect.onStatusChange((wallet) => {
    if (wallet?.account?.address) {
      store.commit(
        'updateTonAddress',
        addressToTonwebAddress(wallet?.account?.address)
      )
    } else {
      store.commit('updateTonAddress', '')
    }
  })
  return tonConnect
}

const connect = async () => {
  await (await tonConnectCall()).openModal()
}

const account = () => {
  let address = web3State.ton.tonAddress
  if (address) {
    return address
  }
  if (tonConnect?.account?.address) {
    address = addressToTonwebAddress(tonConnect?.account?.address)
    return address
  }
  return tonConnect?.account
}

const isConnected = () => {
  return tonConnect?.connected
}

const disconnect = async () => {
  return tonConnect?.disconnect()
}

const chain = async () => {
  return tonConnect?.account?.chain
}

const readWalletName = () => {
  return tonConnect?.wallet?.imageUrl
}

const tonwebProvider = () => {
  const chainId = isProd() ? CHAIN_ID.ton : CHAIN_ID.ton_test
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  const rpc = chainInfo?.api?.url
  return new TonWeb(
    new TonWeb.HttpProvider(rpc, {
      apiKey: process.env.VUE_APP_TON_API_KEY,
    })
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
  const tonweb = tonwebProvider()

  const fromAddress = new TonWeb.Address(tonConnect?.account?.address)
  const toAddress = new TonWeb.Address(to)

  console.log('tokenAddress', from, tokenAddress)

  const forwardPayload = new TonWeb.boc.Cell()
  forwardPayload.bits.writeUint(0, 128)

  forwardPayload.bits.writeString(`c=${safeCode}&t=${targetAddress}`)

  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  console.log('chainInfo', chainInfo, tonweb, tonConnect)
  const nativeCurrency = chainInfo?.nativeCurrency?.address
  const decimals = chainInfo?.nativeCurrency?.decimals

  if (nativeCurrency === tokenAddress) {
    const value = formatEther(amount, decimals)
    console.log('value', value, toAddress)
    const { boc } = await tonConnect.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 60, // 1 minute
      messages: [
        {
          address: to,
          amount: TonWeb.utils.toNano(value).toString(),
          payload: TonWeb.utils.bytesToBase64(
            await forwardPayload.toBoc(false)
          ),
        },
      ],
    })
    const hash = await TonWeb.boc.Cell.oneFromBoc(
      TonWeb.utils.base64ToBytes(boc)
    ).hash()
    const hexHash = TonWeb.utils.bytesToHex(hash)
    console.log('hash', hash, 'hexHash', hexHash)
    return hexHash
  }

  const fromJettonWalletAddress = await getJettonWalletAddress({
    tonweb,
    userAdress: fromAddress,
    tokenAddress,
  })

  const queryId =
    new Date().getHours() * 3600 +
    new Date().getMinutes() * 60 +
    new Date().getSeconds()
  const jettonTransferBody = new TonWeb.boc.Cell()
  jettonTransferBody.bits.writeUint(0xf8a7ea5, 32)
  jettonTransferBody.bits.writeUint(queryId, 64)
  jettonTransferBody.bits.writeCoins(new TonWeb.utils.BN(amount))
  jettonTransferBody.bits.writeAddress(toAddress)
  jettonTransferBody.bits.writeAddress(fromAddress)
  jettonTransferBody.bits.writeBit(false)
  jettonTransferBody.bits.writeCoins(TonWeb.utils.toNano('0'))
  jettonTransferBody.bits.writeBit(true)
  jettonTransferBody.refs.push(forwardPayload)

  const payloadBase64 = TonWeb.utils.bytesToBase64(
    await jettonTransferBody.toBoc(false)
  )

  const { boc } = await tonConnect.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 60, // 1 minute
    messages: [
      {
        address: fromJettonWalletAddress.toString(true, true, true),
        amount: TonWeb.utils.toNano('0.1').toString(),
        payload: payloadBase64,
      },
    ],
  })

  const hash = await TonWeb.boc.Cell.oneFromBoc(
    TonWeb.utils.base64ToBytes(boc)
  ).hash()
  const hexHash = TonWeb.utils.bytesToHex(hash)
  console.log('hash', hash, 'hexHash', hexHash, 'queryId', queryId)
  return hexHash
}

const checkAddress = (address) => {
  const validNetworks = ['0:', '1:']
  const validAddressLength = 66
  const addressLen = 48
  const OX_ADDRESS = new RegExp('^0x[0-9A-Fa-f]+$')
  if (address.length === addressLen && !OX_ADDRESS.test(address)) {
    return true
  }

  if (address.length !== validAddressLength) {
    return false
  }

  const networkIdentifier = address.substring(0, 2)
  if (!validNetworks.includes(networkIdentifier)) {
    return false
  }

  return true
}

const tonHelper = {
  tonConnectCall,
  connect,
  account,
  isConnected,
  disconnect,
  chain,
  transfer,
  readWalletName,
  tonwebProvider,
  bytesToBase64,
  parseAddress,
  addressToTonwebAddress,
  checkAddress,
}

export default tonHelper
