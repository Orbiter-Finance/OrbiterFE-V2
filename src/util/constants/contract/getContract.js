import Web3 from 'web3'

import { Coin_ABI } from './contract.js'
import { store } from '../../../store'
import { localWeb3, localWSWeb3 } from './localWeb3.js'

// Get a token contract on the L2 network
function getLocalCoinContract(localChainID, tokenAddress, state) {
  // 0 : http   1: ws
  // localChainID => rpcurl => web3Provider
  const web3 = state ? localWSWeb3(localChainID) : localWeb3(localChainID)
  if (web3) {
    const ecourseContractInstance = new web3.eth.Contract(
      Coin_ABI,
      tokenAddress,
    )
    if (!ecourseContractInstance) {
      console.log('getLocalCoinContract_ecourseContractInstance')
      return null
    }
    return ecourseContractInstance
  } else {
    console.log('getLocalCoinContract_noWeb3')
    return null
  }
}
// To obtain the token contract on the current network, use metamask as a provider to initiate a transaction
function getTransferContract(localChainID, makerInfo) {
  // if localChain = 3 || 33 Need special treatment
  if (localChainID === 3 || localChainID === 33) {
    console.log('doZK')
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
    console.log('Address =', Address)
    console.log('web3 =', web3)
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
    try {
      var gasLimit = await ecourseContractInstance.methods
        .transfer(to, value)
        .estimateGas({
          from: from,
        })
      // console.log('gasLimit =',gasLimit)
      return gasLimit
    } catch (err) {
      // default
      return 55000
    }
  }
}

export { getTransferContract, getLocalCoinContract, getTransferGasLimit }
