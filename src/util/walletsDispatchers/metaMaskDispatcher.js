import { METAMASK } from "./constants";
import { store } from "../../store";
import { modifyLocalLoginInfo,  withPerformInterruptWallet } from "./utils";
import { updateGlobalSelectWalletConf } from "./walletsCoreData";

export const loginStatusCheckerOfMetaMask = () => {
    return store.state.web3.isInstallMeta && store.state.web3.isInjected && store.state.web3.localLogin
}

export const metaMaskDispatcherOnDisconnect = withPerformInterruptWallet(() => {
    store.commit('updateLocalLogin', false);
})

export const metaMaskDispatcherOnInit = () => {
    store.dispatch('registerWeb3');
    updateGlobalSelectWalletConf(METAMASK);
    modifyLocalLoginInfo({
        walletType: METAMASK,
        loginSuccess: true,
        walletPayload: {}
    });
}