import { COINBASE, BRAVE } from "./constants";

/**
 * Description: 
 * if u find that the wallet to be added follows the standard ethereum API
 * u can append wallets conf to this configuration directly, standard wallet loader
 * will watch this config and generate the connect, disconnect ...etc methods for it
 * 
 * config props u can set:
 * 
 * - 【 walletType: required 】, new wallet type
 * - 【 icon: optional 】, wallet icon, this property will not be used now, it's primarily to take over UI layer config in the feature
 * - 【 walletIsInstalledInvestigator: required 】, in the wallet init phase, this method will be called to make sure the corresponding wallet extension is installed in the user's browser
 * - 【 initDispatcher: optional 】, by default, wallet loader has its own init process, if u want take over the process
 * u can write this prop, it must be a function, loader will pass the base init processor to ur own initDispatcher, u can invoke it or not according to ur own ideas
 * - 【 disconnectDispatcher: optional 】, the effect is equals with initDispatcher, but it's used for disconnection phase
 * - 【chainIdTransfer: optional】, in some wallets, chainIds can take different forms, like hex or binary? when that happens,  u must config this property in a function
 * to convert them to base 10
 */
export default [
    {
        walletType: COINBASE,
        icon: COINBASE,
        walletIsInstalledInvestigator: provider => provider.isCoinbaseWallet
    },
    {
        walletType: BRAVE,
        icon: BRAVE,
        walletIsInstalledInvestigator: provider => provider.isBraveWallet,
        chainIdTransfer: chainId => parseInt(chainId, 16)
    }
]