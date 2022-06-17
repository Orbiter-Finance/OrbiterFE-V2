/**
 * Author: Echo
 * Date: 2022/06/17
 * Description: 
 * this file will export some api to connect wallet 
 */
import { connectWalletConnect } from "./walletConnectDispatcher";


const METAMASK = "MetaMask";
const WALLETCONNECT = "WalletConnect";


export const walletsSupportConnectMap = {
    [METAMASK]: (store) => store.dispatch('registerWeb3'), 
    [WALLETCONNECT]: (store) => {
        connectWalletConnect();
    }
}
