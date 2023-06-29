import {
  COINBASE,
  METAMASK,
  BRAVE,
  BLOCKWALLET,
  TALLYHO,
  LOCALLOGINDATA,
  IM_TOKEN_APP,
  METAMASK_APP,
  TOKEN_POCKET_APP,
  BIT_KEEP_APP,
  COINBASE_APP, OKXWALLET, BRAVE_APP, LOOPRING_APP,
} from './constants';
import {
  updateGlobalSelectWalletConf,
  globalSelectWalletConf,
} from './walletsCoreData'
import { toRefs } from '../../composition'
import { isMobileEnv } from '../env'
export let isBraveWallet = false;

export function setIsBraveWallet(status) {
  isBraveWallet = status;
}

// update global wallet login status
export const modifyLocalLoginInfo = (loginInfo = {}) => {
  localStorage.setItem(LOCALLOGINDATA, JSON.stringify(loginInfo))
}

export const getCurrentLoginInfoFromLocalStorage = () => {
  const loginInfoStr = localStorage.getItem(LOCALLOGINDATA)
  if (loginInfoStr) return JSON.parse(loginInfoStr)
  return loginInfoStr
}

export const removeCurrentLoginInfoFromLocalStorage = () => {
  modifyLocalLoginInfo()
}

// hof for interrupt wallet
export const withPerformInterruptWallet = (fn) => {
  return (...args) => {
    // 1. clear wallet login information saved in localStorage
    removeCurrentLoginInfoFromLocalStorage()
    // 2. for old code, do extra processing for metamask, will be removed later
    localStorage.setItem('localLogin', false)
    // 3. clear wallet login information saved in global responsive variable
    updateGlobalSelectWalletConf()
    // 4. if u have any else to process
    return fn(...args)
  }
}

// wallet type & ethereum fit checker
export const ethereumWalletTypeFitChecker = (walletType, ethereum) => {
  if (!walletType || !ethereum) return false
  if (walletType === METAMASK)
    return ethereum.isMetaMask && !isBraveWallet
  if (walletType === TALLYHO) return ethereum.isTally
  if (walletType === COINBASE) return ethereum.isCoinbaseWallet
  if (walletType === BRAVE) return isBraveWallet
  if (walletType === BRAVE_APP) return isBraveWallet
  if (walletType === IM_TOKEN_APP) return ethereum.isImToken
  if (walletType === METAMASK_APP) return ethereum.isMetaMask
  if (walletType === TOKEN_POCKET_APP) return ethereum.isTokenPocket
  if (walletType === BIT_KEEP_APP) return 'isBitKeepChrome' in ethereum
  if (walletType === COINBASE_APP)
    return ethereum.isCoinbaseBrowser && ethereum.isCoinbaseWallet
  if (walletType === BLOCKWALLET) return ethereum.isBlockWallet
  if (walletType === OKXWALLET) return typeof window.okxwallet !== 'undefined'
  if (walletType === LOOPRING_APP) return ethereum.isLoopring;
  // we never care wallet connect, because it's a protocol, not a wallet
  // so it doesn't follow the Ethereum standard api
}

// check if coinbase extension is installed, coinbase extension will affect something!!
export const checkEthereumConflicts = () => {
  if (!window.ethereum) return false
  if (!window.ethereum.providers) return false
  const coinbaseProvider = window.ethereum.providers.find(
    (provider) => provider.isCoinbaseWallet === true
  )
  return !!coinbaseProvider
}

// because coinbase also injects a global variable with the same name "ethereum" into browser
// according to the coinbase official, we can get all the provider by accessing ethereum.providers
export const findMatchWeb3ProviderByWalletType = (
  walletType,
  walletIsInstalledInvestigator
) => {
  if (!checkEthereumConflicts()) {
    // if there is no conflict, there's only one "ethereum" instance in window
    // so we should confirm one thing: this "ethereum" object fits our wallet type

    if (walletType === OKXWALLET && typeof window.okxwallet !== 'undefined') {
      return window.okxwallet;
    }

    if (ethereumWalletTypeFitChecker(walletType, window.ethereum))
      return window.ethereum
    return null
  }

  // because metamask is still based on old code, i haven't had time to plug into the standard API
  // so we can do a special treatment for metamask, for temporary use and will be removed in the feature!
  if (!walletIsInstalledInvestigator && walletType === METAMASK) {
    walletIsInstalledInvestigator = (provider) =>
      provider.isMetaMask && !isBraveWallet
  }

  if (!walletIsInstalledInvestigator) return null
  return window.ethereum.providers.find(walletIsInstalledInvestigator)
}

// login status checker
export const fetchTargetWalletLoginStatus = ({ walletType }) => {
  const { walletType: walletTypeRef, loginSuccess: loginSuccessRef } = toRefs(
    globalSelectWalletConf
  )
  return walletTypeRef.value === walletType && loginSuccessRef.value === true
}

/**
 * mobile app webview only!!!!!!! don't use in other place!!!!
 */
export const getMobileAppTypeByProvider = () => {
  const provider = window.ethereum
  if (provider.isImToken) return IM_TOKEN_APP
  if (provider.isTokenPocket) return TOKEN_POCKET_APP
  if (provider.isMetaMask && !provider.isTokenPocket) return METAMASK_APP
  if ('isBitKeepChrome' in provider) return BIT_KEEP_APP
  if (provider.isCoinbaseWallet && provider.isCoinbaseBrowser)
    return COINBASE_APP
  if (isBraveWallet) return BRAVE_APP;
  if (provider.isLoopring) return LOOPRING_APP;
}

/**
 * if current page is in a webview environment, users will not be allowed to choose
 * their wallets freely, instead, system will initialize the wallet automatically based
 * on the wallet type
 */
export const performInitMobileAppWallet = () => {
  if (!isMobileEnv()) return
  // in the webview, there's only one web3 provider already init completed, because u can't
  // install others wallet on current wallet
  // it was injected by the current wallet, we can get something useful from it
  const matchAppType = getMobileAppTypeByProvider(window.ethereum)
  modifyLocalLoginInfo({
    walletType: matchAppType,
    loginSuccess: true,
    walletPayload: {},
  })
}
