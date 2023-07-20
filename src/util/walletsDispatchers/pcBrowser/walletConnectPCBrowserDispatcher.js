import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import {
  configureChains,
  createConfig,
  sendTransaction,
  switchNetwork as switchChain,
} from '@wagmi/core'
import * as chainsModule from '@wagmi/core/chains'
import { userDeniedMessage, showMessage } from '../../constants/web3/getWeb3'
import {
  globalSelectWalletConf,
  updateSelectWalletConfPayload,
  updateGlobalSelectWalletConf,
} from '../walletsCoreData'
import { modifyLocalLoginInfo, withPerformInterruptWallet } from '../utils'
import util from '../../util'
import { updateCoinbase } from '../../../composition/useCoinbase'
import { transferDataState } from '../../../composition/useTransferData'
import config from '../../../config'

let connector = null // when walletconnect connect success, connector will be assigned connector instance
// this hof helps the following functions to throw errors
// avoid duplicate code
let ethereumClient = null
let ethProvider = null
export function switchNetwork(chainId) {
  return switchChain({ chainId })
}

const deHex = (hex) => {
  return parseInt(hex.slice(2), 16)
}
const provider = {
  request: async (request) => {
    let result = null
    switch (request.method) {
      case 'wallet_switchEthereumChain':
      case 'wallet_addEthereumChain':
        result = await walletConnectSwitchChain(request.params)
        break
      default:
        result = await ethProvider.request(request)
        break
    }
    return result
  },
  sendAsync: async (params, callback) => {
    ethProvider
      .sendAsync(params)
      .then((result) => {
        callback(null, { result })
      })
      .catch((error) => {
        callback(error)
      })
  },
}
// transfer data after connect success into a valid data structure
// there r different processing between the initial connect and the repeated connect
const performWalletConnectAccountInfo = (payload = {}, connected = false) => {
  if (connected) {
    const { address } = payload.getAccount()
    const { chain = {} } = payload.getNetwork()
    if (!ethProvider) {
      connector.getProvider({ chainId: chain.id }).then((provider) => {
        ethProvider = provider
      })
    }
    return {
      provider,
      // connector,
      walletAddress: address || '',
      networkId: chain.id,
      peerId: '',
      peerMeta: '',
    }
  }
  const { params = [] } = payload
  const [payloadObj = {}] = params
  const { accounts = [], chainId = '', peerId = '', peerMeta = {} } = payloadObj
  const [walletAddress = ''] = accounts
  return {
    provider,
    // connector,
    walletAddress,
    networkId: chainId,
    peerId,
    peerMeta,
  }
}

const onConnectSuccessCallback = (walletConnector, walletType) => {
  // this console is necessary
  connector = walletConnector
  console.successLog('WalletConnect connect success', ethereumClient, true)
  const walletInfo = performWalletConnectAccountInfo(ethereumClient, true)
  updateCoinbase(walletInfo.walletAddress)
  updateGlobalSelectWalletConf(walletType, walletInfo, true)
  // if connect successful, set the local login info
  modifyLocalLoginInfo({
    walletType,
    loginSuccess: true,
    walletPayload: walletInfo,
  })
}

const onDisconnectCallback = (payload) => {
  console.errorLog('WalletConnect disconnected', payload)
  if (!connector) {
    userDeniedMessage() // first in
  } else {
    connector = null
    // this only happens when the user disconnects on the phone manually
    walletConnectDispatcherOnDisconnect(false)
  }
}

const onSessionUpdateCallback = (payload) => {
  console.warnLog('WalletConnect session updated', payload)
  if (!payload.chain) return
  const { address } = ethereumClient.getAccount()
  const { chain = {} } = ethereumClient.getNetwork()
  const { id } = chain
  if (id !== globalSelectWalletConf.walletPayload.networkId) {
    updateSelectWalletConfPayload({ networkId: id }) // UPDATE chainId
  }
  if (address !== globalSelectWalletConf.walletPayload.walletAddress) {
    updateSelectWalletConfPayload({ walletAddress: address }) // UPDATE address
  }
}

// wake up the wallet connect modal by invoke this method
export const walletConnectDispatcherOnInit = async (walletType) => {
  const projectId = process.env.VUE_APP_WALLET_CONNECT_PROJECTID
  if (!projectId) throw new Error('Project id missing.')
  const chains = Object.values(chainsModule)
  const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient,
  })
  ethereumClient = new EthereumClient(wagmiConfig, chains)
  const web3Modal = new Web3Modal({ projectId }, ethereumClient)
  const networkId =
    globalSelectWalletConf.walletPayload.networkId ||
    config.chainConfig.find(
      (chain) => +chain.internalId === +transferDataState.fromChainID
    )?.chainId
  const currentChain = chains.find((chain) => +chain.id === +networkId)

  currentChain && web3Modal.setDefaultChain(currentChain)
  ethereumClient.watchAccount((e) => {
    if (e.isDisconnected) {
      onDisconnectCallback(e)
    }

    if (e.isConnected) {
      onConnectSuccessCallback(wagmiConfig.connectors[0], walletType)
    }
  })
  ethereumClient.watchNetwork(onSessionUpdateCallback)
  // web3Modal.subscribeEvents(event => {
  //   console.log(event, 'evnt')
  //   if (event.name === 'ACCOUNT_CONNECTED') {
  //     onConnectSuccessCallback()
  //   }
  //   if (event.name === 'ACCOUNT_DISCONNECTED') {
  //     onDisconnectCallback(event)
  //   }
  // })
  connector = wagmiConfig.connectors[0]
  if (ethereumClient.getAccount().isConnected) {
    // if it's already connected, invoke onConnectSuccessCallback for the data init
    onConnectSuccessCallback(wagmiConfig.connectors[0], walletType)
  } else {
    // if there is no connection, createSession will be invoked for pop up a qrcode scan box
    await web3Modal.openModal()
  }
}

// disconnect the walletconnect manually
export const walletConnectDispatcherOnDisconnect = withPerformInterruptWallet(
  (shouldKill = true) => {
    shouldKill && ethereumClient.disconnect()
  }
)

export const walletConnectDispatcherOnSignature = async (
  from,
  selectMakerConfig,
  value,
  fromChainID,
  onTransferSucceed
) => {
  const gaslimit = await util.requestWeb3(fromChainID, 'estimateGas', {
    from,
    to: selectMakerConfig.recipient,
    value,
  })
  const nonce = await util.requestWeb3(fromChainID, 'getTransactionCount', from)
  return sendTransaction({
    from,
    to: selectMakerConfig.recipient,
    gasLimit: gaslimit,
    value,
    nonce,
  })
    .then((result) => {
      onTransferSucceed(from, value, fromChainID, result.hash)
    })
    .catch((err) => {
      console.log('err', err)
      showMessage(err, 'error')
    })
}

export async function walletConnectSendTransaction(
  chainId,
  from,
  to,
  value,
  data
) {
  const nonce = await util.requestWeb3(chainId, 'getTransactionCount', from)

  return sendTransaction({
    from,
    to,
    value,
    data,
    nonce,
  })
    .then((result) => {
      return result.hash
    })
    .catch((err) => {
      // showMessage(err, 'error')
      throw err
    })
}

export async function walletConnectSwitchChain(params) {
  let { chainId } = params[0] || {}
  if (typeof chainId === 'string') chainId = deHex(chainId)
  return new Promise((resolve, reject) => {
    switchNetwork(chainId)
      .then(() => {
        resolve(null)
      })
      .catch((e) => {
        reject(e)
      })
    // bc Metamask Mobile and Walletconnect appear to have issues with wallet_switchEthereumChain (the above will never finish)
    // the following will time out rejecting the promise
    let timeout = 0
    const timer = setInterval(() => {
      if (
        Number(params[0].chainId) ===
        Number(globalSelectWalletConf.walletPayload.networkId)
      ) {
        clearInterval(timer)
        return resolve(true)
      }
      timeout++
      if (timeout >= 10) {
        clearInterval(timer)
        return reject(false)
      }
    }, 1000)
  })
}

export const walletConnectDispatcherOnAddChain = (...result) => {
  // console.log('walletConnectDispatcherOnAddChain:', result);
  showMessage('You must Change Networks on your wallet app', 'error')
}
