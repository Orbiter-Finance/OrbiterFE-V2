import {
  Connection,
  Transaction,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js'

import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
} from '@solana/spl-token'

import { utils } from 'ethers'
import util from '../util'
import { isProd } from '../env'
import { CHAIN_ID } from '../../config'

const getConnection = () => {
  const chainId = isProd() ? CHAIN_ID.solana : CHAIN_ID.solana_test
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  const rpc = chainInfo?.rpc?.[0]
  return new Connection(rpc, 'confirmed')
}

const getProvider = () => {
  const provider = window.okxwallet.solana
  // const provider = window.solflare

  if (!provider) {
    util.showMessage('Install OkxWallet', 'error')
  }

  return provider
}

const disConnect = async () => {
  console.log('getProvider', getProvider())
  await getProvider().disconnect()
}

const connect = async () => {
  const res = await getProvider().connect()
  return !!res?.toString()
}

const getPublicKey = (address) => {
  return new PublicKey(address)
}

const getTokenAccount = async ({
  connection,
  fromPublicKey,
  tokenPublickey,
  toPublickey,
}) => {
  return await getOrCreateAssociatedTokenAccount(
    connection || getConnection(),
    fromPublicKey,
    tokenPublickey,
    toPublickey
  )
}

const isConnect = async () => {
  const isConnected = await getProvider().isConnected
  return isConnected
}

const solanaAddress = async () => {
  const publickey = await getProvider().publicKey
  return publickey?.toString()
}

const transfer = async ({
  from,
  to,
  tokenAddress,
  targetAddress,
  amount,
  safeCode,
}) => {
  const provider = getProvider()

  const fromPublicKey = getPublicKey(from)

  const wallet = getConnection()

  const recentBlockhash = await wallet.getLatestBlockhash()

  const toPublicKey = new PublicKey(to)

  const tokenPublicKey = new PublicKey(tokenAddress)

  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    wallet,
    fromPublicKey,
    tokenPublicKey,
    fromPublicKey
  )
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    wallet,
    fromPublicKey,
    tokenPublicKey,
    toPublicKey
  )

  console.log('toTokenAccount', toTokenAccount)

  const tokenTransaction = new Transaction({
    recentBlockhash: recentBlockhash.blockhash,
    feePayer: fromPublicKey,
  })
    .add(
      createTransferInstruction(
        fromTokenAccount.address,
        toTokenAccount.address,
        fromPublicKey,
        amount,
        [],
        TOKEN_PROGRAM_ID
      )
    )
    .add(
      new TransactionInstruction({
        keys: [{ pubkey: fromPublicKey, isSigner: true, isWritable: true }],
        data: utils.toUtf8Bytes(
          utils.hexlify(utils.toUtf8Bytes(`c=${safeCode}&t=${targetAddress}`))
        ),
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
      })
    )

  const signature = await provider.signAndSendTransaction(tokenTransaction)
  console.log('signature', signature)

  return signature.signature
}

const solanaHelper = {
  getConnection,
  getPublicKey,
  getTokenAccount,
  isConnect,
  solanaAddress,
  transfer,
  disConnect,
  connect,
}

export default solanaHelper
