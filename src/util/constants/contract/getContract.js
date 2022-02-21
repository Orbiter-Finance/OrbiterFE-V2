import Web3 from 'web3'

import { Coin_ABI, sourceABI } from './contract.js'
import { store } from '../../../store'
import { localWeb3, localWSWeb3 } from './localWeb3.js'
import util from '../../util'

const sourceAddress = {
  5: '0xb5dA1C896E395a0CfE8c74F2C0A1fEe3E0349D4D',
  22: '0x6AADB6017A5467A22aF28bfE98046361434d3A0F',
  77: '0xB816fF9374364C5fCAb21d6667005b52A773651E',
}

// const destAddress = {
//   5: '0x7f10D206278153E731cAA14f06C847daC5374E5E',
//   22: '0x62AF804978daC24830857bd0Ad9257083D60802F',
//   77: '0x9C2789D3AD6858A44E8617920335B8668578668b',
// }

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
  // if localChain = 3 || 33
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

function getSourceContract(chainID) {
  if (store.state.web3.isInstallMeta) {
    const web3 = new Web3(window.ethereum)
    var ABI = sourceABI
    var Address = sourceAddress[chainID]
    const ecourseContractInstance = new web3.eth.Contract(ABI, Address)
    if (!ecourseContractInstance) {
      return null
    }
    return ecourseContractInstance
  } else {
    return null
  }
}

export {
  getTransferContract,
  getLocalCoinContract,
  getTransferGasLimit,
  getSourceContract,
}
