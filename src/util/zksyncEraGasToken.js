import { compatibleGlobalWalletConf } from '../composition/walletsResponsiveData'
import { gasTokenInfo } from '../composition/hooks'
import { Web3Provider, Contract } from 'zksync-web3'
import { ethers } from 'ethers'
import { Coin_ABI, Orbiter_V3_ABI_EVM } from './constants/contract/contract'
import { SignerPaymaster } from '@holdstation/paymaster-helper'
import util from './util'

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

export const zksyncEraGasTokenContract = async ({
  account,
  fromChainID,
  to,
  amount,
  tokenAddress,
  onTransferSucceed,
  toAddress,
}) => {
  const gasTokenAddress = gasTokenInfo.info.address
  if (!gasTokenAddress) {
    return
  }

  let TOTAL_SEND = ethers.utils.parseEther('0')

  const str = `t=${toAddress}`

  const provider = new Web3Provider(
    compatibleGlobalWalletConf.value.walletPayload.provider || window?.ethereum
  )
  const signer = provider.getSigner()

  const chainInfo = util.getV3ChainInfoByChainId(fromChainID)

  const contractList = chainInfo?.contracts || []

  const contractAddress = contractList?.filter(
    (item) =>
      item?.name?.toLocaleLowerCase() === 'OrbiterRouterV3'?.toLocaleLowerCase()
  )[0]?.address

  if (!contractAddress) {
    util.showMessage('contractAddress not found: ' + contractAddress, 'error')

    return
  }

  const tokenContract = new Contract(tokenAddress, Coin_ABI, provider)
  const nonce = await provider.getTransactionCount(account, 'latest')

  let data = '0x'
  let type = '0'

  let toContactAddress = ''

  const transferContract = new Contract(
    contractAddress,
    Orbiter_V3_ABI_EVM,
    provider
  )

  if (util.isEthTokenAddress(fromChainID, tokenAddress)) {
    toContactAddress = contractAddress

    const res = await transferContract.populateTransaction.transfer(
      to,
      ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str)),
      {
        value: amount,
      }
    )
    TOTAL_SEND = amount
    data = res.data
  } else {
    const allowance = await tokenContract.allowance(account, contractAddress)
    if (!allowance.gte(amount.toString())) {
      const approveRes = await tokenContract.populateTransaction.approve(
        contractAddress,
        amount.toString()
      )
      toContactAddress = tokenAddress
      data = approveRes.data
      type = 'approve'
    } else {
      const res = await transferContract.populateTransaction.transferToken(
        tokenAddress,
        to,
        amount,
        ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str))
      )
      toContactAddress = contractAddress
      data = res.data
    }
  }

  const populateTransaction = {
    from: account,
    to: toContactAddress,
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
  })

  const res = await tx.wait()

  if (type !== 'approve') {
    onTransferSucceed(account, amount, fromChainID, res.transactionHash)
  } else {
    util.showMessage('Authorization successful')
  }
}
