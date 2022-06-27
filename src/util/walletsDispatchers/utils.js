import { COINBASE, METAMASK } from "./constants";
import { LOCALLOGINDATA } from "./constants"
import { updateGlobalSelectWalletConf, globalSelectWalletConf } from "./walletsCoreData";
import { toRefs } from "../../composition";


// update global wallet login status
export const modifyLocalLoginInfo = (loginInfo = {}) => {
    localStorage.setItem(LOCALLOGINDATA, JSON.stringify(loginInfo));
}

export const getCurrentLoginInfoFromLocalStorage = () => {
    const loginInfoStr = localStorage.getItem(LOCALLOGINDATA);
    if (loginInfoStr) return JSON.parse(loginInfoStr);
    return loginInfoStr;
}

export const removeCurrentLoginInfoFromLocalStorage = () => {
    modifyLocalLoginInfo();
}

// hof for interrupt wallet
export const withPerformInterruptWallet = (fn) => {
    return (...args) => {
        // 1. clear wallet login information saved in localStorage
        removeCurrentLoginInfoFromLocalStorage();
        // 2. for old code, do extra processing for metamask, will be removed later
        localStorage.setItem('localLogin', false);
        // 3. clear wallet login information saved in global responsive variable 
        updateGlobalSelectWalletConf();
        // 4. if u have any else to process
        return fn(...args);
    }
}

// wallet type & ethereum fit checker
export const ethereumWalletTypeFitChecker = (walletType, ethereum) => {
    if (!walletType || !ethereum) return false;
    if (walletType === METAMASK) return ethereum.isMetaMask;
    if (walletType === COINBASE) return ethereum.isCoinbaseWallet;
    // we nerve care wallet connect 
}

// check if coinbase extension is installed, coinbase extension will affect something!!
export const checkEthereumConflicts = () => {
    if (!window.ethereum) return false;
    if (!window.ethereum.providers) return false;
    const coinbaseProvider = window.ethereum.providers.find(provider => provider.isCoinbaseWallet === true);
    return coinbaseProvider ? true : false;
}

// because coinbase also injects a global variable with the same name "ethereum" into browser
// according to the coinbase official, we can get all the provider by accessing ethereum.providers
export const findMatchWeb3ProviderByWalletType = (walletType) => {
    const walletResolvers = {
        [METAMASK]: (provider) => provider.isMetaMask === true,
        [COINBASE]: (provider) => provider.isCoinbaseWallet === true,
    }
    if (!checkEthereumConflicts()) {
        // if there is no conflict, there's only one "ethereum" instance in window
        // so we should confirm one thing: this "ethereum" object fits our wallet type
        if (ethereumWalletTypeFitChecker(walletType, window.ethereum)) return window.ethereum;
        return null
    }
    const matchResolver = walletResolvers[walletType];
    if (!matchResolver) return null;
    return window.ethereum.providers.find(matchResolver);
}

// login status checker
export const fetchTargetWalletLoginStatus = (walletType) => {
    const { walletType: walletTypeRef, loginSuccess: loginSuccessRef } = toRefs(globalSelectWalletConf);
    return walletTypeRef.value === walletType && loginSuccessRef.value === true;
}