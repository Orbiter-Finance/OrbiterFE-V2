import { compatibleGlobalWalletConf } from '../composition/walletsResponsiveData'
import { gasTokenInfo } from '../composition/hooks'
import { Web3Provider, Contract } from 'zksync-web3'
import { ethers } from 'ethers'
import { Coin_ABI } from './constants/contract/contract'
import { SignerPaymaster } from '@holdstation/paymaster-helper'

export const PAYMASTER_ADDRESS = '0x069246dFEcb95A6409180b52C071003537B23c27'

// const DEFAULT_GAS_LIMIT = 2000000

const projectName = 'ORBITER'
const parentCode = ethers.utils.formatBytes32String(projectName)

export const zksyncEraGasTokenETH = async ({
  account,
  fromChainID,
  amount,
  to,
  onTransferSucceed,
}) => {
  const gasTokenAddress = gasTokenInfo.info.address
  if (!gasTokenAddress) {
    return
  }

  const provider = new Web3Provider(
    compatibleGlobalWalletConf.value.walletPayload.provider
  )
  const signer = provider.getSigner()

  const nonce = await provider.getTransactionCount(account, 'latest')

  const populateContract = {
    from: signer._address,
    to,
    data: '0x',
    value: amount,
    nonce,
  }

  const tx = await SignerPaymaster.paymasterExecute({
    network: 'mainnet',
    paymentToken: gasTokenAddress,
    populateTransaction: populateContract,
    signer,
    innerInput: parentCode,
    paymasterAddress: PAYMASTER_ADDRESS,
    // defaultGasLimit: DEFAULT_GAS_LIMIT,
  })

  const receipt = await tx.wait()

  onTransferSucceed(account, amount, fromChainID, receipt.transactionHash)
}

export const zksyncEraGasTokenERC20 = async ({
  account,
  fromChainID,
  to,
  amount,
  tokenAddress,
  onTransferSucceed,
}) => {
  const gasTokenAddress = gasTokenInfo.info.address
  if (!gasTokenAddress) {
    return
  }

  let TOTAL_SEND = ethers.utils.parseEther('0')

  const provider = new Web3Provider(
    compatibleGlobalWalletConf.value.walletPayload.provider
  )
  const signer = provider.getSigner()

  const nonce = await provider.getTransactionCount(account, 'latest')

  const tokenContract = new Contract(tokenAddress, Coin_ABI, provider)

  const { data } = await tokenContract.populateTransaction.transfer(to, amount)

  const populateTransaction = {
    from: account,
    to: tokenAddress,
    data,
    value: TOTAL_SEND,
    nonce,
  }

  const tx = await SignerPaymaster.paymasterExecute({
    network: 'mainnet',
    paymentToken: gasTokenAddress,
    populateTransaction,
    signer,
    innerInput: parentCode,
    paymasterAddress: PAYMASTER_ADDRESS,
    // defaultGasLimit: DEFAULT_GAS_LIMIT,
  })

  const res = await tx.wait()

  onTransferSucceed(account, amount, fromChainID, res.transactionHash)
}
