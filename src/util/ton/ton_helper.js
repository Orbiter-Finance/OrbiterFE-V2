import { TonConnectUI } from '@tonconnect/ui'
import TonWeb from 'tonweb'
import { utils } from 'ethers'
import { store } from '../../store'

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

const tonConnectCall = async () => {
  if (tonConnect) {
    return tonConnect
  }
  const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://<YOUR_APP_URL>/tonconnect-manifest.json',
    buttonRootId: 'ton-connect-wallet',
  })

  tonConnect = tonConnectUI
  tonConnect.onStatusChange((wallet) => {
    if (wallet?.account?.address) {
      store.commit(
        'updateTonAddress',
        new TonWeb.Address(wallet?.account?.address).toString(true, true, true)
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
  if (tonConnect?.account?.address) {
    return new TonWeb.Address(tonConnect?.account?.address).toString(
      true,
      true,
      true
    )
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
  return new TonWeb(
    new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {
      apiKey:
        'd843619b379084d133f061606beecbf72ae2bf60e0622e808f2a3f631673599b',
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
}) => {
  const tonweb = tonwebProvider()

  const fromAddress = new TonWeb.Address(tonConnect?.account?.address)
  const toAddress = new TonWeb.Address(to)

  const fromJettonWalletAddress = await getJettonWalletAddress({
    tonweb,
    userAdress: fromAddress,
    tokenAddress,
  })

  const forwardPayload = new TonWeb.boc.Cell()
  forwardPayload.bits.writeUint(0, 64)
  forwardPayload.bits.writeString(
    utils.hexlify(utils.toUtf8Bytes(`c=${safeCode}&t=${targetAddress}`))
  )

  const jettonTransferBody = new TonWeb.boc.Cell()
  jettonTransferBody.bits.writeUint(0xf8a7ea5, 32)
  jettonTransferBody.bits.writeUint(0, 64)
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
  return TonWeb.utils.bytesToHex(hash)
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
}

export default tonHelper
