/**
 * 
 * for the most situation, or based on the brave browser, 
 * when  many wallet extensions add networks, change networks, 
 * and sign transactions, they all accept ethereum wallet standard
 * so we can provide a standard wallet conf, this conf will be load by 
 * wallet loaders, and the provide some common capabilities
 */

import { COINBASE } from "./constants";

// interface WalletConfProps {
//     walletType: string;
//     icon: string;
//      // optional, if this prop exist, wallet loader will pass u the base init dispatcher, u can call it at any time
//     initDispatcher?: (universalInitDispatcher) => void;
//     // optional too
//     disconnectDispatcher?: (universalDisconnectDispatcher) => void;
// }
export default [
    {
        walletType: COINBASE,
        icon: COINBASE
    }
]