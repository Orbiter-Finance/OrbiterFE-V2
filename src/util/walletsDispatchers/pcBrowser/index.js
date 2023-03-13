/*
 * @Description:
 * @Author: Eric
 * @Date: 2022-08-09 12:11:47
 * @LastEditors: Eric
 * @LastEditTime: 2022-08-09 14:16:34
 */
import { METAMASK, WALLETCONNECT } from '../constants'
import standardWalletLoader from '../standardWalletReducer/standardWalletLoader'
import standardWalletConf from './standardPCBrowserWalletConf'
import { fetchTargetWalletLoginStatus } from '../utils'

// wallet connect
import {
  walletConnectDispatcherOnDisconnect,
  walletConnectDispatcherOnInit,
  walletConnectDispatcherOnSignature,
  walletConnectSendTransaction,
  walletConnectDispatcherOnAddChain,
  walletConnectSwitchChain,
} from './walletConnectPCBrowserDispatcher'

// metamask
import {
  metaMaskDispatcherOnInit,
  metaMaskDispatcherOnDisconnect,
} from './metaMaskPCBrowserDispatcher'

const {
  standardLoginStatusCheckerOfWallets: standardLoginStatusCheckerOfPCBrowser,
  standardWalletDispatchersOnInit: standardPCBrowserDispatchersOnInit,
  standardWalletDispatchersOnDisconnect:
    standardPCBrowserWalletDispatchersOnDisconnect,
  standardWalletDispatchersOnAddChain:
    standardPCBrowserWalletDispatchersOnAddChain,
  standardWalletDispatchersOnSwitchChain:
    standardPCBrowserWalletDispatchersOnSwitchChain,
} = standardWalletLoader(standardWalletConf) // load standard wallet conf

// init method for each supported wallet
const pcBrowserWalletDispatchersOnInit = {
  [METAMASK]: metaMaskDispatcherOnInit,
  [WALLETCONNECT]: walletConnectDispatcherOnInit,
  ...standardPCBrowserDispatchersOnInit,
}
// disconnect method for each supported wallet
const pcBrowserWalletDispatchersOnDisconnect = {
  [METAMASK]: metaMaskDispatcherOnDisconnect,
  [WALLETCONNECT]: walletConnectDispatcherOnDisconnect,
  ...standardPCBrowserWalletDispatchersOnDisconnect,
}

// check login status method for each supported wallet
const loginStatusCheckerOfPCBrowserWallet = {
  [METAMASK]: () => fetchTargetWalletLoginStatus({ walletType: METAMASK }),
  [WALLETCONNECT]: () =>
    fetchTargetWalletLoginStatus({ walletType: WALLETCONNECT }),
  ...standardLoginStatusCheckerOfPCBrowser,
}

// when users confirm the transaction information is correct
// invoke specified method can sign the wallet to confirm the trade request
const pcBrowserWalletDispatchersOnSignature = {
  [WALLETCONNECT]: walletConnectDispatcherOnSignature,
}

const pcBrowserWalletDispatchersOnAddChain = {
  [WALLETCONNECT]: walletConnectDispatcherOnAddChain,
  ...standardPCBrowserWalletDispatchersOnAddChain,
}

const pcBrowserDispatchersOnSwitchChain = {
  [WALLETCONNECT]: walletConnectDispatcherOnAddChain,
  ...standardPCBrowserWalletDispatchersOnSwitchChain,
}

export default {
  walletDispatchersOnInit: pcBrowserWalletDispatchersOnInit,
  walletDispatchersOnDisconnect: pcBrowserWalletDispatchersOnDisconnect,
  walletDispatchersOnAddChain: pcBrowserWalletDispatchersOnAddChain,
  walletDispatchersOnSignature: pcBrowserWalletDispatchersOnSignature,
  walletDispatchersOnSwitchChain: pcBrowserDispatchersOnSwitchChain,
  loginStatusCheckerOfWallets: loginStatusCheckerOfPCBrowserWallet,
  walletConnectSendTransaction,
  walletConnectSwitchChain,
}
