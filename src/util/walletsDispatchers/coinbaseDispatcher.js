import { COINBASE } from "./constants";
import { universalWalletInitHandler } from "./standardWalletAPI";
import { withPerformInterruptWallet } from "./utils";

export const coinbaseDispatcherOnInit = () => {
    // because of coinbase supports mobile env (app?),
    // so i am going to differentiate the env, 
    // convenient for the feature maintenance
    return coinbaseDispatcherOnBrowserInit();
}

// coinbase init in browser
const coinbaseDispatcherOnBrowserInit = () => {
    universalWalletInitHandler(COINBASE);
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

export const coinbaseDispatcherOnDisconnect = withPerformInterruptWallet(() => {});