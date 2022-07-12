/**
 * Author: Echo
 * Date: 2022/06/17
 * Description:
 * this file will export some api to connect wallet
 */

import pcBrowserWalletDispatchers from "./pcBrowser";
import mobileAppWebviewWalletDispatchers from "./mobileAppWebview";
import { 
  PC_BROWSER,
  MOBILE_APP,
  isMobileEnv
} from "../env.js";

export { globalSelectWalletConf } from './walletsCoreData'

export * from './constants'
export {
  modifyLocalLoginInfo,
  getCurrentLoginInfoFromLocalStorage,
} from './utils'

const dispatchersInEachDeviceEnv = {
  [PC_BROWSER]: pcBrowserWalletDispatchers,
  [MOBILE_APP]: mobileAppWebviewWalletDispatchers
}

export default isMobileEnv() ? dispatchersInEachDeviceEnv[MOBILE_APP] : dispatchersInEachDeviceEnv[PC_BROWSER];