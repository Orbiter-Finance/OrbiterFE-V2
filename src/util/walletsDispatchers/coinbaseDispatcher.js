import { COINBASE } from "./constants";
import { findMatchWeb3ProviderByWalletType, modifyLocalLoginInfo } from "./utils";
import { updateGlobalSelectWalletConf } from "./walletsCoreData";

export const coinbaseDispatcherOnInit = () => {
    // because of coinbase supports mobile env (app?),
    // so i am going to differentiate the env, 
    // convenient for the feature maintenance
    return coinbaseDispatcherOnBrowserInit();
}

// coinbase init in browser
const coinbaseDispatcherOnBrowserInit = () => {
    const coinbaseProvider = findMatchWeb3ProviderByWalletType(COINBASE);
    // request coinbase extension
    coinbaseProvider.request({ method: "eth_requestAccounts" }).then(result => {
        // init global stats
        updateGlobalSelectWalletConf(COINBASE);
        modifyLocalLoginInfo({
            walletType: COINBASE,
            loginSuccess: true,
            walletPayload: {}
        });
    }).catch(err => {
        console.log("err", err);
    })
}