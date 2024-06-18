/*
 * @Description:
 * @Author: Eric
 * @Date: 2022-08-09 12:11:47
 * @LastEditors: Eric
 * @LastEditTime: 2022-08-09 14:16:34
 */
import {
  IM_TOKEN_APP,
  METAMASK,
  WALLETCONNECT,
  TOKEN_POCKET_APP,
  FOXWALLET_APP,
  SAFEPAL,
  BINANCEWALLET,
} from '../constants'
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
import { tokenPocketDispatcherOnDisconnect } from './tokenPocketPCDispatcher'
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
  [WALLETCONNECT]: () => walletConnectDispatcherOnInit(WALLETCONNECT),
  [IM_TOKEN_APP]: () => walletConnectDispatcherOnInit(IM_TOKEN_APP),
  [SAFEPAL]: () => walletConnectDispatcherOnInit(SAFEPAL),
  [BINANCEWALLET]: () => walletConnectDispatcherOnInit(BINANCEWALLET),
  [FOXWALLET_APP]: () => walletConnectDispatcherOnInit(FOXWALLET_APP),
  ...standardPCBrowserDispatchersOnInit,
}
// disconnect method for each supported wallet
const pcBrowserWalletDispatchersOnDisconnect = {
  [METAMASK]: metaMaskDispatcherOnDisconnect,
  [WALLETCONNECT]: walletConnectDispatcherOnDisconnect,
  [IM_TOKEN_APP]: walletConnectDispatcherOnDisconnect,
  [SAFEPAL]: walletConnectDispatcherOnDisconnect,
  [BINANCEWALLET]: walletConnectDispatcherOnDisconnect,
  [FOXWALLET_APP]: walletConnectDispatcherOnDisconnect,
  [TOKEN_POCKET_APP]: tokenPocketDispatcherOnDisconnect,
  ...standardPCBrowserWalletDispatchersOnDisconnect,
}

// check login status method for each supported wallet
const loginStatusCheckerOfPCBrowserWallet = {
  [METAMASK]: () => fetchTargetWalletLoginStatus({ walletType: METAMASK }),
  [WALLETCONNECT]: () =>
    fetchTargetWalletLoginStatus({ walletType: WALLETCONNECT }),
  [IM_TOKEN_APP]: () =>
    fetchTargetWalletLoginStatus({ walletType: IM_TOKEN_APP }),
  [SAFEPAL]: () => fetchTargetWalletLoginStatus({ walletType: SAFEPAL }),
  [BINANCEWALLET]: () =>
    fetchTargetWalletLoginStatus({ walletType: BINANCEWALLET }),
  [FOXWALLET_APP]: () =>
    fetchTargetWalletLoginStatus({ walletType: FOXWALLET_APP }),
  ...standardLoginStatusCheckerOfPCBrowser,
}

// when users confirm the transaction information is correct
// invoke specified method can sign the wallet to confirm the trade request
const pcBrowserWalletDispatchersOnSignature = {
  [WALLETCONNECT]: walletConnectDispatcherOnSignature,
  [IM_TOKEN_APP]: walletConnectDispatcherOnSignature,
  [SAFEPAL]: walletConnectDispatcherOnSignature,
  [BINANCEWALLET]: walletConnectDispatcherOnSignature,
  [FOXWALLET_APP]: walletConnectDispatcherOnSignature,
}

const pcBrowserWalletDispatchersOnAddChain = {
  [WALLETCONNECT]: walletConnectDispatcherOnAddChain,
  [IM_TOKEN_APP]: walletConnectDispatcherOnAddChain,
  [SAFEPAL]: walletConnectDispatcherOnAddChain,
  [BINANCEWALLET]: walletConnectDispatcherOnAddChain,
  [FOXWALLET_APP]: walletConnectDispatcherOnAddChain,
  ...standardPCBrowserWalletDispatchersOnAddChain,
}

const pcBrowserDispatchersOnSwitchChain = {
  [WALLETCONNECT]: walletConnectDispatcherOnAddChain,
  [IM_TOKEN_APP]: walletConnectDispatcherOnAddChain,
  [BINANCEWALLET]: walletConnectDispatcherOnAddChain,
  [FOXWALLET_APP]: walletConnectDispatcherOnAddChain,
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
