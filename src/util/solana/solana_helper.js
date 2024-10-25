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

import {
  updateSolanaAddress,
  updateSolanaConnectStatus,
  web3State,
} from '../../composition/hooks'
import { Buffer } from 'buffer'

const SOLNA_WALLET_NAME = 'SOLNA_WALLET_NAME'

const readWalletName = () => {
  return sessionStorage.getItem(SOLNA_WALLET_NAME)
}

const updateWalletName = (str) => {
  sessionStorage.setItem(SOLNA_WALLET_NAME, str || '')
}

const getConnection = (chainId) => {
  if (!chainId) return null
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  const rpc = chainInfo?.rpc?.[0]
  return rpc ? new Connection(rpc, 'confirmed') : null
}

const getWallet = () => {
  const walletName = readWalletName()
  const wallet = window?.[walletName || '']
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
  const provider = getProvider()
  const res = await provider?.connect()
  const publicKey = res?.publicKey || provider?.publicKey || res
  const address = publicKey?.toString()
  updateSolanaAddress(address)
  updateSolanaConnectStatus(!!address)
  return address
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
    toPublickey,
    true
  )
}

const isConnect = () => {
  const isConnected = getWallet()?.isConnected
  return isConnected
}

const solanaAddress = () => {
  if (!isConnect) return ''
  return web3State.solana.solanaAddress
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

  let signTransactionTx;
  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1000000,
  });
  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 100,
  });
  const chainInfo = util.getV3ChainInfoByChainId(chainId)
  if (tokenAddress === chainInfo?.nativeCurrency?.address) {
    const recentBlockhash = await connection.getLatestBlockhash('confirmed');
    signTransactionTx = new Transaction({
      recentBlockhash: recentBlockhash.blockhash,
      feePayer: fromPublicKey,
    })
      .add(modifyComputeUnits)
      .add(addPriorityFee)
      .add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: toPublicKey,
          lamports: amount,
        })
      )
      .add(
        new TransactionInstruction({
          keys: [{ pubkey: fromPublicKey, isSigner: true, isWritable: true }],
          data: utils.toUtf8Bytes(
            utils.hexlify(utils.toUtf8Bytes(`c=${ safeCode }&t=${ targetAddress }`))
          ),
          programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        })
      );
  } else {
    const tokenPublicKey = new PublicKey(tokenAddress);
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromPublicKey,
      tokenPublicKey,
      fromPublicKey
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromPublicKey,
      tokenPublicKey,
      toPublicKey
    );
    const recentBlockhash = await connection.getLatestBlockhash('confirmed');

    signTransactionTx = new Transaction({
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
            utils.hexlify(utils.toUtf8Bytes(`c=${ safeCode }&t=${ targetAddress }`))
          ),
          programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        })
      );
  }

  const signedTx = await provider.signTransaction(signTransactionTx)

  const signature = await connection.sendRawTransaction(signedTx.serialize())

  return signature
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
  const group = (chainInfo?.contracts || []).filter(
    (item) => item.name === 'OPool'
  )?.[0]
  const contractAddress = group.address
  const feeToken = group.feeToken
  const connection = getConnection(chainId)
  const tokenPublicKey = getPublicKey(tokenAddress)
  const fromPublicKey = getPublicKey(from)
  const fromTokenAccount = await getAssociatedTokenAddress(
    tokenPublicKey,
    fromPublicKey
  )
  const makerTokenAccount = await getAssociatedTokenAddress(
    tokenPublicKey,
    getPublicKey(toAddress), // maker address
    true
  )

  const tokens = chainInfo?.tokens || []
  const decimals = tokens
    .concat([chainInfo?.nativeCurrency || {}])
    ?.filter((item) => item.address === feeToken)?.[0]?.decimals
  const tokenToReceiver = tokens
    .concat([chainInfo?.nativeCurrency || {}])
    ?.filter((item) => item.address === tokenAddress)?.[0]?.tokenToReceiver
  const provider = getProvider()

  const programId = getPublicKey(contractAddress)
  const program = new Program(SOLANA_OPOOL_ABI, programId, provider)
  const state = group.state
  const feeReceiver = group.feeReceiver

  const memo = Buffer.from(
    utils.hexlify(utils.toUtf8Bytes(`c=${safeCode}&t=${targetAddress}`)),
    'utf-8'
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
      await program.methods
        .inbox(
          new BN(amount),
          new BN(utils.parseUnits(String(withholdingFee), decimals).toString()),
          memo
        )
        .accounts({
          state: getPublicKey(state),
          user: fromPublicKey,
          source: fromTokenAccount,
          destination: makerTokenAccount,
          tokenAddress: tokenPublicKey,
          tokenToReceiver: getPublicKey(tokenToReceiver),
          feeReceiver: getPublicKey(feeReceiver),
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    )

  const signedTx = await provider.signTransaction(tokenTransaction)

  const signature = await connection.sendRawTransaction(signedTx.serialize())

  return signature
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
  bridgeType1transfer,
}

export default solanaHelper
