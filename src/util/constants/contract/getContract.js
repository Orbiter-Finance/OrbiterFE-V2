import { Coin_ABI } from './contract.js'
import util from '../../util'
import {
  compatibleGlobalWalletConf,
  walletIsLogin,
} from '../../../composition/walletsResponsiveData'
import { web3State } from '../../../composition/hooks'
import { CHAIN_ID } from '../../../config'
import Web3 from 'web3'

// To obtain the token contract on the current network, use metamask as a provider to initiate a transaction
function getTransferContract(localChainID, contractAddress) {
  if (
    localChainID === CHAIN_ID.zksync ||
    localChainID === CHAIN_ID.zksync_test
  ) {
    return
  }
  if (
    localChainID === CHAIN_ID.starknet ||
    localChainID === CHAIN_ID.starknet_test
  ) {
    return
  }
  if (
    localChainID === CHAIN_ID.solana ||
    localChainID === CHAIN_ID.solana_test
  ) {
    return
  }
  if (localChainID === CHAIN_ID.ton || localChainID === CHAIN_ID.ton_test) {
    return
  }
  if (walletIsLogin.value) {
    const web3 = new Web3(
      compatibleGlobalWalletConf.value.walletPayload.provider
    )
    const ecourseContractInstance = new web3.eth.Contract(
      Coin_ABI,
      contractAddress
    )

    if (!ecourseContractInstance) {
      return null
    }
    return ecourseContractInstance
  } else {
    return null
  }
}

async function getTransferGasLimit(
  localChainID,
  selectMakerConfig,
  from,
  to,
  value,
  provider = null
) {
  // !walletIsLogin.value
  if (web3State.isInstallMeta || provider) {
    const web3 = new Web3(provider || window.ethereum)
    const tokenAddress = selectMakerConfig.fromChain.tokenAddress

    let gasLimit = 55000
    try {
      if (util.isEthTokenAddress(localChainID, tokenAddress)) {
        gasLimit = await Promise.any([
          web3.eth.estimateGas({
            from,
            to: selectMakerConfig.recipient,
            value,
          }),
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(0)
            }, 10000)
          }),
        ])
        return gasLimit
      } else {
        const ABI = Coin_ABI
        const ecourseContractInstance = new web3.eth.Contract(ABI, tokenAddress)
        if (!ecourseContractInstance) {
          return gasLimit
        }

        gasLimit = await Promise.any([
          ecourseContractInstance.methods.transfer(to, value).estimateGas({
            from,
          }),
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(0)
            }, 10000)
          }),
        ])
        return gasLimit
      }
    } catch (err) {
      console.warn('getTransferGasLimit error: ', err)
    }

    return gasLimit
  }
}

export { getTransferContract, getTransferGasLimit }
