import Web3 from 'web3'
import env from '../../../../env'

const LocalNetWorks = env.supportLocalNetWorksIDs

/**
 * @param {number} chainID
 * @returns {Web3 | null}
 */
function localWeb3(chainID) {
  if (LocalNetWorks.indexOf(chainID.toString()) > -1) {
    const provider = env.localProvider[chainID]
    if (!provider) {
      return null
    }
    const localWeb3 = new Web3(provider)
    return localWeb3
  } else {
    return null
  }
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

export { localWeb3, localWSWeb3 }
