/*
 * @Description:
 * @Author: Eric
 * @Date: 2023-03-20 12:09:23
 * @LastEditors: Eric
 * @LastEditTime: 2023-03-21 08:40:34
 */
/**
 * Warning!!!!!!!!!!!!!!!!!!
 * this file will be deprecated
 * please head over to the standardWalletLoader.js to get more information
 */
import { COINBASE } from '../constants'
import { universalWalletInitHandler } from './standardWalletAPI'
import { withPerformInterruptWallet } from '../utils'

/**
 * @deprecated
 */
export const coinbaseDispatcherOnInit = () => {
  // because of coinbase supports mobile env (app?),
  // so i am going to differentiate the env,
  // convenient for the feature maintenance
  return coinbaseDispatcherOnBrowserInit()
}

// coinbase init in browser
/**
 * @deprecated
 */
const coinbaseDispatcherOnBrowserInit = () => {
  universalWalletInitHandler(COINBASE)
  // ---------------- deprecated ----------------------------
  // const coinbaseProvider = findMatchWeb3ProviderByWalletType(COINBASE);
  // // request coinbase extension
  // coinbaseProvider.request({ method: "eth_requestAccounts" }).then(result => {
  //     // init global stats
  //     const legalWalletConfig = {
  //         walletType: COINBASE,
  //         loginSuccess: true,
  //         walletPayload: {
  //             walletAddress: result[0]
  //         }
  //     }
  //     updateGlobalSelectWalletConf(legalWalletConfig.walletType, legalWalletConfig.walletPayload, true);
  //     modifyLocalLoginInfo(legalWalletConfig);
  // }).catch(err => {
  //     console.log("err", err);
  // })
}
/**
 * @deprecated
 */
export const coinbaseDispatcherOnDisconnect = withPerformInterruptWallet(
  () => {}
)
