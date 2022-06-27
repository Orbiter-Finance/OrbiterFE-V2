import { universalWalletInitHandler } from "./standardWalletAPI";
import { withPerformInterruptWallet, fetchTargetWalletLoginStatus } from "./utils"; 

/**
 * 
 * for the most situation, or based on the brave browser, 
 * when  many wallet extensions add networks, change networks, 
 * and sign transactions, they all accept ethereum wallet standard
 * so we can provide a standard wallet conf, this conf will be load by 
 * wallet loaders, and the provide some common capabilities
 */

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