/*
 * @Description:
 * @Author: Eric
 * @Date: 2022-08-09 12:11:47
 * @LastEditors: Eric
 * @LastEditTime: 2022-08-10 18:16:35
 */
import standardWalletLoader from '../standardWalletReducer/standardWalletLoader'
import standardMobileAppConf from './standardMobileAppConf'

// get switch network method, init wallet method, disconnect method, add chain method and more useful methods of
// every mobile app(imtoken, metamask, tokenpocket, ...etc)
// u can find more implementation in ./standardWalletReducer/standardWalletLoader.js
const {
  standardWalletDispatchersOnInit: mobileAppWebviewDispatchersOnInit,
  standardWalletDispatchersOnDisconnect:
    mobileAppWebviewDispatchersOnDisconnect,
  standardLoginStatusCheckerOfWallets: loginStatusCheckerOfAppWebview,
  standardWalletDispatchersOnAddChain: mobileAppWebviewDispatchersOnAddChain,
  standardWalletDispatchersOnSwitchChain:
    mobileAppWebviewDispatchersOnSwitchChain,
} = standardWalletLoader(standardMobileAppConf)

export default {
  walletDispatchersOnInit: mobileAppWebviewDispatchersOnInit,
  walletDispatchersOnAddChain: mobileAppWebviewDispatchersOnAddChain,
  walletDispatchersOnSwitchChain: mobileAppWebviewDispatchersOnSwitchChain,
  walletDispatchersOnDisconnect: mobileAppWebviewDispatchersOnDisconnect,
  loginStatusCheckerOfWallets: loginStatusCheckerOfAppWebview,
  walletDispatchersOnSignature: {},
}
