import {
  universalWalletInitHandler,
  universalWalletAddChainHandler,
  universalWalletSwitchChainHandler,
} from './standardWalletAPI'
import {
  withPerformInterruptWallet,
  fetchTargetWalletLoginStatus,
} from '../utils'

/**
 *
 * for the most situation, or based on the brave browser,
 * when  many wallet extensions add networks, change networks,
 * and sign transactions, they all accept ethereum wallet standard
 * so we can provide a standard wallet conf, this conf will be load by
 * wallet loaders, and the provide some common capabilities
 */

const standardWalletLoader = (standardWalletConf) => {
  // returns 5 aggregate objects by standardWalletConf
  const walletDispatchersOnInit = {}
  const walletDispatchersOnDisconnect = {}
  const loginStatusCheckerOfWallets = {}
  const walletDispatchersOnAddChain = {}
  const walletDispatchersOnSwitchChain = {}

  // mount configuration
  for (const walletConf of standardWalletConf) {
    const { walletType, initDispatcher, disconnectDispatcher } = walletConf
    walletDispatchersOnInit[walletType] = initDispatcher
      ? () => initDispatcher(walletConf, universalWalletInitHandler)
      : () => universalWalletInitHandler(walletConf)
    walletDispatchersOnDisconnect[walletType] = disconnectDispatcher
      ? () => withPerformInterruptWallet(disconnectDispatcher)
      : withPerformInterruptWallet(() => {})
    loginStatusCheckerOfWallets[walletType] = () =>
      fetchTargetWalletLoginStatus(walletConf)
    walletDispatchersOnAddChain[walletType] = (walletProvider, ...args) =>
      universalWalletAddChainHandler(walletConf, walletProvider, ...args)
    walletDispatchersOnSwitchChain[walletType] = (walletProvider, ...args) =>
      universalWalletSwitchChainHandler(walletConf, walletProvider, ...args)
  }

  return {
    standardWalletDispatchersOnInit: walletDispatchersOnInit,
    standardWalletDispatchersOnDisconnect: walletDispatchersOnDisconnect,
    standardLoginStatusCheckerOfWallets: loginStatusCheckerOfWallets,
    standardWalletDispatchersOnAddChain: walletDispatchersOnAddChain,
    standardWalletDispatchersOnSwitchChain: walletDispatchersOnSwitchChain,
  }
}

export default standardWalletLoader
