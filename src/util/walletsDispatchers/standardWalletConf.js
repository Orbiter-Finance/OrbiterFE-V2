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