import standardWalletLoader from "../standardWalletReducer/standardWalletLoader";
import standardMobileAppConf from "./standardMobileAppConf";

// get switch network method, init wallet method, disconnect method, add chain method and more useful methods of 
// every mobile app(imtoken, metamask, tokenpocket, ...etc)
// u can find more implementation in ./standardWalletReducer/standardWalletLoader.js
const {
    standardWalletDispatchersOnInit: mobileAppWebviewDispatchersOnInit,
    standardWalletDispatchersOnDisconnect: mobileAppWebviewDispatchersOnDisconnect,
    standardLoginStatusCheckerOfWallets: loginStatusCheckerOfAppWebview,
    standardWalletDispatchersOnAddChain: mobileAppWebviewDispatchersOnAddChain,
    standardWalletDispatchersOnSwitchChain: mobileAppWebviewDispatchersOnSwitchChain
} = standardWalletLoader(standardMobileAppConf);

console.log("mobileAppWebviewDispatchersOnSwitchChain", mobileAppWebviewDispatchersOnSwitchChain);

export default {
    walletDispatchersOnInit: mobileAppWebviewDispatchersOnInit,
    walletDispatchersOnAddChain: mobileAppWebviewDispatchersOnAddChain,
    walletDispatchersOnSwitchChain: mobileAppWebviewDispatchersOnSwitchChain,
    walletDispatchersOnDisconnect: mobileAppWebviewDispatchersOnDisconnect,
    loginStatusCheckerOfWallets: loginStatusCheckerOfAppWebview,
    walletDispatchersOnSignature: {},
}