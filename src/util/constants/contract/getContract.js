import Web3 from 'web3'

import { Coin_ABI } from './contract.js'
import { store } from '../../../store'
import { localWeb3, localWSWeb3 } from './localWeb3.js'
import util from '../../util'

// Get a token contract on the L2 network
function getLocalCoinContract(localChainID, tokenAddress, state) {
  // 0 : http   1: ws
  // localChainID => rpcurl => web3Provider
  const web3 = state ? localWSWeb3(localChainID) : localWeb3(localChainID)
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
function getTransferContract(localChainID, makerInfo) {
  // if localChain = 3 || 33
  if (localChainID === 3 || localChainID === 33) {
    return
  }
  if (localChainID === 4 || localChainID === 44) {
    return
  }
  if (store.state.web3.isInstallMeta) {
    const web3 = new Web3(window.ethereum)
    var ABI = Coin_ABI
    var Address = null
    if (makerInfo.c1ID === localChainID) {
      Address = makerInfo.t1Address
    } else {
      Address = makerInfo.t2Address
    }
    const ecourseContractInstance = new web3.eth.Contract(ABI, Address)
    if (!ecourseContractInstance) {
      return null
    }
    return ecourseContractInstance
  } else {
    return null
  }
}

async function getTransferGasLimit(localChainID, makerInfo, from, to, value) {
  if (store.state.web3.isInstallMeta) {
    const web3 = new Web3(window.ethereum)
    let tokenAddress = null
    if (makerInfo.c1ID === localChainID) {
      tokenAddress = makerInfo.t1Address
    } else {
      tokenAddress = makerInfo.t2Address
    }

    let gasLimit = 55000
    try {
      if (util.isEthTokenAddress(tokenAddress)) {
        gasLimit = await web3.eth.estimateGas({
          from,
          to: makerInfo.makerAddress,
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
            from: from,
          })
        // console.log('gasLimit =',gasLimit)
        return gasLimit
      }
    } catch (err) {
      console.warn('getTransferGasLimit error: ', err)
    }

    return gasLimit
  }
}

export { getTransferContract, getLocalCoinContract, getTransferGasLimit }
