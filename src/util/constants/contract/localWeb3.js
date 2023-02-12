import Web3 from 'web3'
import env from '../../../../env'
import { extraRpcs } from '../../../config/extraRpcs'
const LocalNetWorks = env.supportLocalNetWorksIDs
import { Coin_ABI } from './contract.js'

/**
 * @param {number} chainID
 * @returns {Web3 | null}
 */
function localWeb3(chainID) {
  if (chainID && LocalNetWorks.indexOf(chainID.toString()) > -1) {
    const provider = env.localProvider[chainID]
    if (!provider || provider.includes('alchemy')) {
      return null
    }

    const localWeb3 = new Web3(provider)
    return localWeb3
  } else {
    return null
  }
}

function requestWeb3(insideId, method, ...args) {
  const chainId = env.localChainID_netChainID[insideId]
  const chain = extraRpcs[chainId]
  return new Promise(async (resolve, reject) => {
    let result
    if (chain && chain.rpcs.length > 0) {
      for (const rpc of chain.rpcs) {
        try {
          const url = rpc.url
          const web3 = new Web3(url)
          result = await web3.eth[method](...args)
          resolve(result)
          break
        } catch (error) {
          console.log(
            'request rpc error:',
            error.message,
            insideId,
            method,
            args
          )
        }
      }
    }

    if (!result) {
      reject(`Reuqest Web3 RPC ERROR：${insideId}-${method}-${args.join(',')}`)
    }
  })
}

  function getWeb3TokenBalance (insideId, userAddress, tokenAddress) {
    
    const chainId = env.localChainID_netChainID[insideId]
    const chain = extraRpcs[chainId]
    return new Promise(async (resolve, reject) => {
      let result
      if (chain && chain.rpcs.length > 0) {
        for (const rpc of chain.rpcs) {
          try {
            const url = rpc.url
            const web3 = new Web3(url)
            // result = await web3.eth[method](...args)
            const tokenContract = new web3.eth.Contract(
              Coin_ABI,
              tokenAddress
            )
            if (!tokenContract) {
              console.warn('getLocalCoinContract_ecourseContractInstance');
              continue;
            }
            const result =  await tokenContract.methods.balanceOf(userAddress).call()
            if (result) {
              resolve(result)
              break
            }
          } catch (error) {
            console.log(
              'Request Web3 token Balance rpc error:',
              error.message,
              insideId,
            )
          }
        }
      }
  
      if (!result) {
        reject(`Request Web3 TokenBalance RPC error${insideId}`)
      }
    })
    }
/**
 * @param {number} chainID
 * @returns {Web3 | null}
 */
function localWSWeb3(chainID) {
  if (LocalNetWorks.indexOf(chainID.toString()) > -1) {
    // var socketOptions = {
    //   clientConfig: {
    //     keepalive: true,
    //     keepaliveInterval: 60000,
    //   },
    //   reconnect: {
    //     auto: true,
    //     delay: 1000,
    //     maxAttempts: Infinity,
    //     onTimeout: false,
    //   },
    // }
    const host = env.localWSProvider[chainID]
    if (!host) {
      return null
    }

    const localWSWeb3 = new Web3(
      new Web3.providers.WebsocketProvider(
        host
        // socketOptions,
      )
    )
    return localWSWeb3
  } else {
    return null
  }
}

export { localWeb3, localWSWeb3, requestWeb3,getWeb3TokenBalance }
