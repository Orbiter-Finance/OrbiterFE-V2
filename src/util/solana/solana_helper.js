import {
  Connection,
  Transaction,
  PublicKey,
  TransactionInstruction,
  ComputeBudgetProgram,
  SystemProgram,
} from '@solana/web3.js'

import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  getAssociatedTokenAddress,
} from '@solana/spl-token'

import { utils } from 'ethers'
import util from '../util'
import { BN, Program } from '@project-serum/anchor'
import { SOLANA_OPOOL_ABI } from '../constants/contract/contract'

const SOLNA_WALLET_NAME = ''

const readWalletName = () => {
  return sessionStorage.getItem(SOLNA_WALLET_NAME)
}

const updateWalletName = (str) => {
  sessionStorage.setItem(SOLNA_WALLET_NAME, str?.toLocaleLowerCase() || '')
}

const getConnection = (chainId) => {
  if (!chainId) return null
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  const rpc = chainInfo?.rpc?.[0]
  console.log('rpc', rpc)
  return rpc ? new Connection(rpc, 'confirmed') : null
}

const getWallet = () => {
  const walletName = readWalletName()
  const wallet = window?.[walletName?.toLocaleLowerCase() || '']
  const provider = wallet?.solana || wallet
  // const provider = window.solflare

  return provider
}

const getProvider = () => {
  const provider = getWallet()

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
  chainId,
}) => {
  return await getOrCreateAssociatedTokenAccount(
    connection || getConnection(chainId),
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
  chainId,
}) => {
  const provider = getProvider()

  const fromPublicKey = getPublicKey(from)

  const connection = getConnection(chainId)

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

const bridgeType1transfer = async ({
  from,
  targetAddress,
  tokenAddress,
  toAddress,
  safeCode,
  withholdingFee,
  amount,
  chainId,
}) => {
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  console.log('amount', amount)
  console.log('chainInfo', chainInfo)
  const group = (chainInfo?.contracts || []).filter(
    (item) => item.name === 'OPool'
  )?.[0]
  console.log('gropup', group)
  const contractAddress = group.address
  const connection = getConnection(chainId)
  console.log('connection', connection)
  const tokenPublicKey = getPublicKey(tokenAddress)
  console.log('tokenPublicKey', tokenPublicKey)
  const fromPublicKey = getPublicKey(from)
  console.log('fromPublicKey', fromPublicKey)
  const fromTokenAccount = await getAssociatedTokenAddress(
    tokenPublicKey,
    fromPublicKey
  )
  console.log('fromTokenAccount', fromTokenAccount)
  const makerTokenAccount = await getAssociatedTokenAddress(
    tokenPublicKey,
    getPublicKey(toAddress) // maker address
  )
  console.log('makerTokenAccount', makerTokenAccount)

  const provider = getProvider()

  console.log('provider', provider)

  const programId = getPublicKey(contractAddress)
  console.log('programId', programId)
  const program = new Program(SOLANA_OPOOL_ABI, programId, provider)
  console.log('program', program)
  const state = group.state
  const feeReceiver = group.feeReceiver

  const memo = utils.toUtf8Bytes(
    utils.hexlify(utils.toUtf8Bytes(`c=${safeCode}&t=${targetAddress}`))
  )
  console.log('memo', memo, memo.toString())
  // const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
  //   units: 1000000,
  // })
  // console.log('modifyComputeUnits', modifyComputeUnits)

  // const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
  //   microLamports: 100,
  // })
  // console.log('addPriorityFee', addPriorityFee)

  const recentBlockhash = await connection.getLatestBlockhash('confirmed')

  memo._isBuffer = true

  console.log(
    'parmas',
    state,
    fromPublicKey,
    fromTokenAccount,
    makerTokenAccount,
    feeReceiver,
    memo
  )

  const tokenTransaction = new Transaction({
    recentBlockhash: recentBlockhash.blockhash,
    feePayer: fromPublicKey,
  })
    // .add(modifyComputeUnits)
    // .add(addPriorityFee)
    .add(
      await program.methods
        .inbox(new BN(Number(amount)), memo)
        .accounts({
          state: getPublicKey(state),
          user: fromPublicKey,
          source: fromTokenAccount,
          destination: makerTokenAccount,
          feeReceiver: getPublicKey(feeReceiver),
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    )
  // .add(
  //   new TransactionInstruction({
  //     keys: [{ pubkey: fromPublicKey, isSigner: true, isWritable: true }],
  //     data: memo,
  //     programId: getPublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
  //   })
  // )
  console.log('tokenTransaction', tokenTransaction)

  const signature = await provider.signAndSendTransaction(tokenTransaction)
  console.log('signature', signature)

  return signature.signature
}
const activationTokenAccount = async ({ toChainID, fromCurrency, chainId }) => {
  const chainInfo = await util.getV3ChainInfoByChainId(toChainID)

  const tokenAddress = chainInfo?.tokens?.filter(
    (item) =>
      item?.symbol?.toLocaleLowerCase() === fromCurrency?.toLocaleLowerCase()
  )[0]?.address

  const connection = getConnection(chainId)

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
  bridgeType1transfer,
}

export default solanaHelper
