import {
    TOKEN_POCKET_APP,
    METAMASK_APP,
    IM_TOKEN_APP,
    BIT_KEEP_APP,
    COINBASE_APP
} from "../constants";

// open ./pcBrowser/standardPCBrowserWalletConf to get the meaning of each prop member
// chainIdTransfer maybe can be optimize
const standardMobileAppConf = [
    {
        walletType: IM_TOKEN_APP,
        walletIsInstalledInvestigator: provider => provider.isImToken,
        chainIdTransfer: chainId => parseInt(chainId, 16)
    },
    {
        walletType: METAMASK_APP,
        walletIsInstalledInvestigator: provider => provider.isMetaMask && !provider.isTokenPocket
    },
    {
        walletType: TOKEN_POCKET_APP,
        walletIsInstalledInvestigator: provider => provider.isTokenPocket,
        chainIdTransfer: chainId => parseInt(chainId, 16)
    },
    {
        walletType: BIT_KEEP_APP,
        walletIsInstalledInvestigator: provider => "isBitKeepChrome" in provider,
        chainIdTransfer: chainId => parseInt(chainId, 16)
    },
    {
        walletType: COINBASE_APP,
        walletIsInstalledInvestigator: provider => provider.isCoinbaseBrowser && provider.isCoinbaseWallet,
        chainIdTransfer: chainId => parseInt(chainId, 16)
    }
]

export default standardMobileAppConf;