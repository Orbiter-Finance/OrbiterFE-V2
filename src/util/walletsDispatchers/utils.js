import { COINBASE, METAMASK } from "./constants";
import { LOCALLOGINDATA } from "./constants"
import { updateGlobalSelectWalletConf } from "./walletsCoreData";


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

// check if coinbase extension is installed, coinbase extension will affect something!!
export const isInstallCoinbaseExtension = () => {
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
    if (!isInstallCoinbaseExtension()) return null;
    const matchResolver = walletResolvers[walletType];
    if (!matchResolver) return;
    return window.ethereum.providers.find(matchResolver);
}