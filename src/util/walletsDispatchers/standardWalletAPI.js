/**
 * Author: echo
 * Date: 2022/06/23
 * 
 * this file exports a set of common wallet apis
 * using these apis, it's very easy to access a compliant wallet without extra code
 * 
 */
import Web3 from "web3";
import { findMatchWeb3ProviderByWalletType, modifyLocalLoginInfo } from "./utils";
import { updateGlobalSelectWalletConf, updateSelectWalletAddress, updateSelectWalletConfPayload } from "./walletsCoreData";
import { showMessage } from "../constants/web3/getWeb3";

// install wallet checks if target wallet extension is installed
// if installed, the provider of this wallet will be return
// otherwise it will throw error;
export const installWallet = (walletType) => {
    return new Promise(async (resolve) => {
        if (window.ethereum) {
            try {
                // findMatchWeb3ProviderByWalletType will helps u to check ethereum conflicts
                const matchProvider = findMatchWeb3ProviderByWalletType(walletType);
                if(!matchProvider) {
                    resolve(null);
                    return;
                };
                await matchProvider.enable();
                resolve(matchProvider);
            } catch(error) {
                const errorMsg = 'User denied account access';
                showMessage(errorMsg, "error");
                resolve(null);
            }
        }  else {
            const errorMsg = `not install ${walletType}`;
            showMessage(errorMsg, "error");
            resolve(null);
        }
    })
} 

// get network id , wallet address , etc ...  by invoke this method
export const performWalletInformation = async (walletType) => {
    const matchWalletProvider = await installWallet(walletType);
    if (!matchWalletProvider) throw new Error("not install coinbase");
    const performResult = {
        walletType,
        isInstalled: true, // matchWalletProvider !== null, web extension definitely be installed
        networkId: null,
        walletAddress: null,
    }
    const matchWalletWeb3Provider = new Web3(matchWalletProvider); // inject web3
    const networkId = await matchWalletWeb3Provider.eth.net.getId();
    if (!networkId) showMessage('get netWorkID failed, refresh and try again', 'error');
    else performResult.networkId = networkId;
    const walletAddress = await matchWalletWeb3Provider.eth.getCoinbase();
    if (!walletAddress) showMessage(`get coinbase failed，please unlock ${walletType} or generate a new address`,'error',);
    else performResult.walletAddress = walletAddress;
    return {
        performResult,
        provider: matchWalletProvider
    };
}

// this method can init wallet config directly if the wallet type
// passed is a standard compliant wallet
export const universalWalletInitHandler = (walletType) => {
    performWalletInformation(walletType).then(({ performResult, provider }) => {
        /**
         * result contains following properties
         * 1. walletAddress
         * 2. isInstalled: indicates match wallet extension is installed ?
         * 3. provider: if window.ethereum conflict, this prop is the ethereum match this wallet
         * 4. networkId
         */
        const legalWalletConfig = {
            walletType,
            loginSuccess: true,
            walletPayload: performResult
        }
        // provider can't be stored in localStorage, but to facilitate global access
        // to this ethereum instance(wallet matched), i put it in the global responsive data 
        updateGlobalSelectWalletConf(legalWalletConfig.walletType, {
            ...legalWalletConfig.walletPayload,
            provider
        }, true);
        modifyLocalLoginInfo(legalWalletConfig);

        // listen for changes
        walletInfoChangeListener(provider);
    }).catch(err => {
        console.log(`%c ${walletType} init err`, "color: #fff; background: red", err);
    });
}

const walletInfoChangeListener = (walletProvider) => {
    walletProvider.autoRefreshOnNetworkChange = false;
    console.log(`%c wallet provider listening....`, "color: #fff; background: blue", walletProvider.on);
    walletProvider.on("chainChanged", chainId => {
        console.log(`%c chainId updated`, "color: #fff; background: green", chainId);
        updateSelectWalletConfPayload({
            networkId: chainId
        });
    })
    walletProvider.on("accountsChanged", ([newWalletAddress = ""]) => {
        console.log(`%c user wallet address updated`, "color: #fff; background: green", chainId);
        updateSelectWalletAddress(newWalletAddress);
    })
}