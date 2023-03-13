import Web3 from 'web3'
import { Coin_ABI } from './contract.js'
import util from '../../util'
import {
  compatibleGlobalWalletConf,
  walletIsLogin,
} from '../../../composition/walletsResponsiveData'
import { web3State } from '../../../composition/hooks'
// Get a token contract on the L2 network
function getLocalCoinContract(localChainID, tokenAddress, state, web3) {
  // 0 : http   1: ws
  // localChainID => rpcurl => web3Provider
  if (web3) {
    const ecourseContractInstance = new web3.eth.Contract(
      Coin_ABI,
      tokenAddress
    )
    if (!ecourseContractInstance) {
      console.warn('getLocalCoinContract_ecourseContractInstance')
      return null
    }
    return ecourseContractInstance
  } else {
    console.warn('getLocalCoinContract_noWeb3')
    return null
  }
}
// To obtain the token contract on the current network, use metamask as a provider to initiate a transaction
function getTransferContract(localChainID, contractAddress) {
  // if localChain = 3 || 33
  if (localChainID === 3 || localChainID === 33) {
    return
  }
  if (localChainID === 4 || localChainID === 44) {
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
        gasLimit = await web3.eth.estimateGas({
          from,
          to: selectMakerConfig.recipient,
          value,
        })
        return gasLimit
      } else {
        const ABI = Coin_ABI
        const ecourseContractInstance = new web3.eth.Contract(ABI, tokenAddress)
        if (!ecourseContractInstance) {
          return gasLimit
        }

        gasLimit = await ecourseContractInstance.methods
          .transfer(to, value)
          .estimateGas({
            from,
          })
        return gasLimit
      }
    } catch (err) {
      console.warn('getTransferGasLimit error: ', err)
    }

    return gasLimit
  }
}

export { getTransferContract, getLocalCoinContract, getTransferGasLimit }
