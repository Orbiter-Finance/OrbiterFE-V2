/**
 * Author: Echo
 * Date: 2022/06/17
 * Description:
 * this file will export some api to connect wallet
 */
import { METAMASK, WALLETCONNECT } from './constants'
import standardWalletLoader from './standardWalletLoader'
import standardWalletConf from './standardWalletConf'

// wallet connect
import {
  walletConnectDispatcherOnDisconnect,
  walletConnectDispatcherOnInit,
  walletConnectDispatcherOnSignature,
  walletConnectDispatcherOnAddChain,
} from './walletConnectDispatcher'

// metamask
import {
  metaMaskDispatcherOnInit,
  metaMaskDispatcherOnDisconnect,
} from './metaMaskDispatcher'

// coinbase
// import {
//     coinbaseDispatcherOnInit,
//     coinbaseDispatcherOnDisconnect
// } from "./coinbaseDispatcher";
import { fetchTargetWalletLoginStatus } from './utils'

export { globalSelectWalletConf } from './walletsCoreData'
// export {
//     isMetaMaskLogin // reactive data
// } from "./metaMaskDispatcher";
export { WALLETCONNECT, METAMASK, LOCALLOGINDATA } from './constants'
export {
  modifyLocalLoginInfo,
  getCurrentLoginInfoFromLocalStorage,
} from './utils'

const {
  standardLoginStatusCheckerOfWallets,
  standardWalletDispatchersOnInit,
  standardWalletDispatchersOnDisconnect,
  standardWalletDispatchersOnAddChain,
  standardWalletDispatchersOnSwitchChain,
} = standardWalletLoader(standardWalletConf) // load standard wallet conf

// init method for each supported wallet
export const walletDispatchersOnInit = {
  [METAMASK]: metaMaskDispatcherOnInit,
  [WALLETCONNECT]: walletConnectDispatcherOnInit,
  ...standardWalletDispatchersOnInit,
}
// disconnect method for each supported wallet
export const walletDispatchersOnDisconnect = {
  [METAMASK]: metaMaskDispatcherOnDisconnect,
  [WALLETCONNECT]: walletConnectDispatcherOnDisconnect,
  ...standardWalletDispatchersOnDisconnect,
}

// check login status method for each supported wallet
export const loginStatusCheckerOfWallets = {
  [METAMASK]: () => fetchTargetWalletLoginStatus({ walletType: METAMASK }),
  [WALLETCONNECT]: () =>
    fetchTargetWalletLoginStatus({ walletType: WALLETCONNECT }),
  ...standardLoginStatusCheckerOfWallets,
}

// when users confirm the transaction information is correct
// invoke specified method can sign the wallet to confirm the trade request
export const walletDispatchersOnSignature = {
  [WALLETCONNECT]: walletConnectDispatcherOnSignature,
}

export const walletDispatchersOnAddChain = {
  [WALLETCONNECT]: walletConnectDispatcherOnAddChain,
  ...standardWalletDispatchersOnAddChain,
}

export const walletDispatchersOnSwitchChain = {
  [WALLETCONNECT]: walletConnectDispatcherOnAddChain,
  ...standardWalletDispatchersOnSwitchChain,
}
