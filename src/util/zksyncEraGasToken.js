import { compatibleGlobalWalletConf } from '../composition/walletsResponsiveData'
import { gasTokenInfo } from '../composition/hooks'
import { Web3Provider, Contract } from 'zksync-web3'
import { ethers } from 'ethers'
import { Coin_ABI } from './constants/contract/contract'
import { SignerPaymaster } from '@holdstation/paymaster-helper'

export const PAYMASTER_ADDRESS = '0x4081e092F948Cffd946a75e1F556c13c372304bc'

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

  const chainId = (await provider.getNetwork()).chainId
  const populateContract = {
    from: signer._address,
    to,
    data: '0x',
    value: amount,
    chainId,
    nonce,
  }

  const tx = await SignerPaymaster.paymasterExecute({
    network: 'mainnet',
    paymentToken: gasTokenAddress,
    populateTransaction: populateContract,
    signer,
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
  const chainId = (await provider.getNetwork()).chainId

  const tokenContract = new Contract(tokenAddress, Coin_ABI, provider)

  const { data } = await tokenContract.populateTransaction.transfer(to, amount)

  const populateTransaction = {
    from: account,
    to: tokenAddress,
    data,
    chainId,
    value: TOTAL_SEND,
    nonce,
  }

  const tx = await SignerPaymaster.paymasterExecute({
    network: 'mainnet',
    paymentToken: gasTokenAddress,
    populateTransaction,
    signer,
  })

  const res = await tx.wait()

  onTransferSucceed(account, amount, fromChainID, res.transactionHash)
}
