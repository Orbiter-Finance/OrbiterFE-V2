import { TonConnectUI } from '@tonconnect/ui'
import { toUserFriendlyAddress } from '@tonconnect/sdk'
import TonWeb from 'tonweb'

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

const tonConnectCall = async () => {
  if (tonConnect) {
    return tonConnect
  }
  const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://<YOUR_APP_URL>/tonconnect-manifest.json',
    buttonRootId: 'ton-connect-wallet',
  })

  tonConnect = tonConnectUI
  return tonConnect
}

const connect = async () => {
  await (await tonConnectCall()).openModal()
}

const account = () => {
  console.log('tonConnect', tonConnect)
  console.log('tonConnect?.account', tonConnect?.account)
  if (tonConnect?.account?.address) {
    return toUserFriendlyAddress(tonConnect?.account?.address)
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

const transfer = async ({
  from,
  to,
  tokenAddress,
  targetAddress,
  amount,
  safeCode,
}) => {
  console.log('from', from)
  console.log('to', to)
  console.log('tokenAddress', tokenAddress)
  console.log('targetAddress', targetAddress)
  console.log('amount', amount)
  console.log('safeCode', safeCode)

  const cell = new TonWeb.boc.Cell()
  console.log('cell', cell)

  const myAddress = tonConnect?.account?.address

  const account1 = account()

  const tonweb = new TonWeb(
    new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {
      apiKey:
        'd843619b379084d133f061606beecbf72ae2bf60e0622e808f2a3f631673599b',
    })
  )
  console.log('tonweb', tonweb)
  cell.bits.writeAddress(new TonWeb.Address(myAddress))
  console.log('writeAddress')
  const getWalletAddressResponse = await tonweb.provider.call2(
    tokenAddress,
    'get_wallet_address',
    [['tvm.Slice', bytesToBase64(await cell.toBoc(false))]]
  )
  console.log('getWalletAddressResponse', getWalletAddressResponse)

  const jettonWalletAddress = parseAddress(getWalletAddressResponse)
  console.log(
    'jettonWalletAddress',
    jettonWalletAddress.toString(true, true, true)
  )

  const burnOP = 0xf8a7ea5 // burn op
  const queryId = new TonWeb.utils.BN(0)
  console.log('queryId', queryId)

  console.log('amount', amount, new TonWeb.utils.BN(amount))

  const burnPayload = new TonWeb.boc.Cell()
  const customPayload = new TonWeb.boc.Cell()
  customPayload.bits.writeString(targetAddress)
  customPayload.bits.writeUint(hexToBN(targetAddress), 160)
  burnPayload.bits.writeUint(burnOP, 32)
  burnPayload.bits.writeUint(queryId, 64)
  burnPayload.bits.writeCoins(new TonWeb.utils.BN(amount))
  burnPayload.bits.writeAddress()
  console.log('account1', account1)
  burnPayload.bits.writeBit(1)
  burnPayload.refs.push(customPayload)
  console.log('customPayload', customPayload)
  const payloadBase64 = TonWeb.utils.bytesToBase64(
    await burnPayload.toBoc(false)
  )

  const res = await tonConnect.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 60, // 1 minute
    messages: [
      {
        address: jettonWalletAddress.toString(true, true, true),
        amount: TonWeb.utils.toNano('0').toString(),
        payload: payloadBase64,
      },
    ],
  })

  console.log('res', res)
}

const tonHelper = {
  tonConnectCall,
  connect,
  account,
  isConnected,
  disconnect,
  chain,
  transfer,
}

export default tonHelper
