import { computed, reactive } from "../index";
import { store } from "../../store";
import { globalSelectWalletConf, loginStatusCheckerOfWallets, METAMASK } from "../../util/walletsDispatchers";

// if there is a wallet connect with Oribiter
// it will affect the ui changes in each route
export const walletIsLogin = computed(() => {
    // if wallet type of the global hook data is not equals metamask
    // if equals with metamask, continue with previous logic, waiting for subsequent optimization
    if (globalSelectWalletConf.walletType && globalSelectWalletConf.walletType !== METAMASK) {
      const matchProcessor = loginStatusCheckerOfWallets[globalSelectWalletConf.walletType];
      return matchProcessor ? matchProcessor() : false;
    }

    return (
     store.state.web3.isInstallMeta &&
     store.state.web3.isInjected &&
     store.state.web3.localLogin
    )
})

/**
 * It works exactly the same purpose as "globalSelectWalletConf"
 * mainly for compatibility with metamask, it may be deprecated later
 */
export const compatibleGlobalWalletConf = computed(() => {
    if (globalSelectWalletConf.walletType && globalSelectWalletConf.walletType !== METAMASK) {
        return globalSelectWalletConf;
    } 
    return {
        walletType: METAMASK,
        walletPayload: {
            walletAddress: store.state.web3.coinbase,
            chainId: store.state.web3.networkId,
            ...store.state.web3,
        },
        loginSuccess: true
    }
})