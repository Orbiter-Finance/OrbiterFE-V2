import Web3 from 'web3'
import env from '../../../../env'

const LocalNetWorks = env.supportLocalNetWorksIDs

function localWeb3(chainID) {
  if (LocalNetWorks.indexOf(chainID.toString()) > -1) {
    const provider = new Web3.providers.HttpProvider(env.localProvider[chainID])
    const localWeb3 = new Web3(provider)
    return localWeb3
  } else {
    return null
  }
}

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
    const localWSWeb3 = new Web3(
      new Web3.providers.WebsocketProvider(
        env.localWSProvider[chainID],
        // socketOptions,
      ),
    )
    return localWSWeb3
  } else {
    return null
  }
}

export { localWeb3, localWSWeb3 }
