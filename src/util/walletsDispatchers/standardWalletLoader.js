import { universalWalletInitHandler } from "./standardWalletAPI";
import { withPerformInterruptWallet, fetchTargetWalletLoginStatus } from "./utils"; 

const standardWalletLoader = (standardWalletConf) => {
    // returns 3 aggregate objects by standardWalletConf
    const walletDispatchersOnInit = {};
    const walletDispatchersOnDisconnect = {};
    const loginStatusCheckerOfWallets = {};

    // mount configuration
    for (const walletConf of standardWalletConf) {
        const { walletType, initDispatcher, disconnectDispatcher } = walletConf;
        walletDispatchersOnInit[walletType] = initDispatcher ? () => initDispatcher(universalWalletInitHandler) : () => universalWalletInitHandler(walletType);
        walletDispatchersOnDisconnect[walletType] = disconnectDispatcher ? () => withPerformInterruptWallet(disconnectDispatcher) : withPerformInterruptWallet(() => {});
        loginStatusCheckerOfWallets[walletType] = () => fetchTargetWalletLoginStatus(walletType);
    }

    return {
        standardWalletDispatchersOnInit: walletDispatchersOnInit,
        standardWalletDispatchersOnDisconnect: walletDispatchersOnDisconnect,
        standardLoginStatusCheckerOfWallets: loginStatusCheckerOfWallets
    }
}

export default standardWalletLoader