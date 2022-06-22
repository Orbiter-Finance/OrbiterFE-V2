/**
 * Author: Echo
 * Date: 2022/06/17
 * Description: 
 * this file will export some api to connect wallet 
 */
import { METAMASK, WALLETCONNECT, COINBASE } from "./constants";

// wallet connect 
import { 
    walletConnectDispatcherOnDisconnect,
    walletConnectDispatcherOnInit,
    walletConnectDispatcherOnSignature,
    walletConnectDispatcherOnAddChain,
    loginStatusCheckerOfWalletConnect
} from "./walletConnectDispatcher";

// metamask
import { 
    loginStatusCheckerOfMetaMask, 
    metaMaskDispatcherOnInit, 
    metaMaskDispatcherOnDisconnect,
} from "./metaMaskDispatcher";

// coinbase
import {
    coinbaseDispatcherOnInit
} from "./coinbaseDispatcher";

export { 
    globalSelectWalletConf,
    walletIsLogin
} from "./walletsCoreData";
export { 
    isMetaMaskLogin // reactive data
} from "./metaMaskDispatcher";
export { WALLETCONNECT, METAMASK, LOCALLOGIN } from "./constants";
export { modifyLocalLoginState, getCurrentLoginInfoFromLocalStorage } from "./utils";

// init method for each supported wallet 
export const walletDispatchersOnInit = {
    [METAMASK]: metaMaskDispatcherOnInit,
    [WALLETCONNECT]: walletConnectDispatcherOnInit,
    [COINBASE]: coinbaseDispatcherOnInit
}
// disconnect method for each supported wallet
export const walletDispatchersOnDisconnect = {
    [METAMASK]: metaMaskDispatcherOnDisconnect,
    [WALLETCONNECT]: walletConnectDispatcherOnDisconnect
}

// check login status method for each supported wallet
export const loginStatusCheckerOfWallets = {
    [METAMASK]: loginStatusCheckerOfMetaMask,
    [WALLETCONNECT]: loginStatusCheckerOfWalletConnect
}

// when users confirm the transaction information is correct
// invoke specified method can sign the wallet to confirm the trade request
export const walletDispatchersOnSignature = {
    [WALLETCONNECT]: walletConnectDispatcherOnSignature
}

export const walletDispatchersOnAddChain = {
    [WALLETCONNECT]: walletConnectDispatcherOnAddChain
}