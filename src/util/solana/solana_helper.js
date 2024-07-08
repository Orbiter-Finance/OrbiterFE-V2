import {
  Connection,
  Transaction,
  PublicKey,
  TransactionInstruction,
  ComputeBudgetProgram,
} from '@solana/web3.js'

import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token'

import { utils } from 'ethers'
import util from '../util'
import { isProd } from '../env'
import { CHAIN_ID } from '../../config'

const SOLNA_WALLET_NAME = ''

const readWalletName = () => {
  return sessionStorage.getItem(SOLNA_WALLET_NAME)
}

const updateWalletName = (str) => {
  sessionStorage.setItem(SOLNA_WALLET_NAME, str?.toLocaleLowerCase() || '')
}

const getConnection = () => {
  const chainId = isProd() ? CHAIN_ID.solana : CHAIN_ID.solana_test
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  const rpc = chainInfo?.rpc?.[0]
  return new Connection(rpc, 'confirmed')
}

const getWallet = () => {
  const walletName = readWalletName()
  const provider = window?.[walletName?.toLocaleLowerCase() || '']?.solana
  return provider
}

const getProvider = () => {
  const provider = getWallet()
  // const provider = window.solflare

  if (!provider) {
    util.showMessage(
      'Install ' + (readWalletName() || 'Solana Wallet'),
      'error'
    )
    updateWalletName('')
  }

  return provider
}

const disConnect = async () => {
  await getProvider()?.disconnect()
  updateWalletName('')
}

const connect = async (walletName) => {
  updateWalletName(walletName)
  const res = await getProvider()?.connect()
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

const isConnect = () => {
  const isConnected = getWallet()?.isConnected
  return isConnected
}

const solanaAddress = () => {
  const publickey = getWallet()?.publicKey
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

  const connection = getConnection()

  const toPublicKey = new PublicKey(to)

  const tokenPublicKey = new PublicKey(tokenAddress)
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromPublicKey,
    tokenPublicKey,
    fromPublicKey
  )

  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromPublicKey,
    tokenPublicKey,
    toPublicKey
  )

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1000000,
  })

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 100,
  })

  const recentBlockhash = await connection.getLatestBlockhash('confirmed')

  const tokenTransaction = new Transaction({
    recentBlockhash: recentBlockhash.blockhash,
    feePayer: fromPublicKey,
  })
    .add(modifyComputeUnits)
    .add(addPriorityFee)
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

  const res = await tokenTransaction.getEstimatedFee(connection)
  console.log('res', res)

  const signature = await provider.signAndSendTransaction(tokenTransaction)
  console.log('signature', signature)

  return signature.signature
}

const activationTokenAccount = async ({ toChainID, fromCurrency }) => {
  const chainInfo = await util.getV3ChainInfoByChainId(toChainID)

  const tokenAddress = chainInfo?.tokens?.filter(
    (item) =>
      item?.symbol?.toLocaleLowerCase() === fromCurrency?.toLocaleLowerCase()
  )[0]?.address

  const connection = getConnection()

  const provider = getProvider()

  const solAddress = solanaAddress()

  const fromPublicKey = getPublicKey(solAddress)

  const tokenPublicKey = new PublicKey(tokenAddress)

  const account = await connection.getParsedTokenAccountsByOwner(
    fromPublicKey,
    { mint: tokenPublicKey }
  )

  if (account?.value?.length) {
    return 'created'
  }

  util.showMessage('The current Solana account is not activated', 'warning')

  try {
    const associatedTokenPublickey = getAssociatedTokenAddressSync(
      tokenPublicKey,
      fromPublicKey
    )

    const recentBlockhash = await connection.getLatestBlockhash('confirmed')

    const tokenTransaction = new Transaction({
      recentBlockhash: recentBlockhash.blockhash,
      feePayer: fromPublicKey,
    }).add(
      createAssociatedTokenAccountInstruction(
        fromPublicKey,
        associatedTokenPublickey,
        fromPublicKey,
        tokenPublicKey
      )
    )

    const signature = await provider.signAndSendTransaction(tokenTransaction)
    console.log('signature', signature)
  } catch (error) {
    util.showMessage(
      error?.message || error?.data?.message || String(error),
      'error'
    )
  }
  return 'register'
}

const checkAddress = (address) => {
  try {
    const publicKey = new PublicKey(address)
    console.log('Valid Solana address:', publicKey.toString())
    return true
  } catch (error) {
    console.error('Invalid Solana address:', error)
    return false
  }
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
  activationTokenAccount,
  readWalletName,
  updateWalletName,
  checkAddress,
}

export default solanaHelper
