import standardWalletLoader from "../standardWalletReducer/standardWalletLoader";
import standardMobileAppConf from "./standardMobileAppConf";

const {
    standardWalletDispatchersOnInit: mobileAppWebviewDispatchersOnInit,
    standardWalletDispatchersOnDisconnect: mobileAppWebviewDispatchersOnDisconnect,
    standardLoginStatusCheckerOfWallets: loginStatusCheckerOfAppWebview,
    standardWalletDispatchersOnAddChain: mobileAppWebviewDispatchersOnAddChain,
    standardWalletDispatchersOnSwitchChain: mobileAppWebviewDispatchersOnSwitchChain
} = standardWalletLoader(standardMobileAppConf); 

export default {
    walletDispatchersOnInit: mobileAppWebviewDispatchersOnInit,
    walletDispatchersOnAddChain: mobileAppWebviewDispatchersOnAddChain,
    walletDispatchersOnSwitchChain: mobileAppWebviewDispatchersOnSwitchChain,
    walletDispatchersOnDisconnect: mobileAppWebviewDispatchersOnDisconnect,
    loginStatusCheckerOfWallets: loginStatusCheckerOfAppWebview,
    walletDispatchersOnSignature: {}
}