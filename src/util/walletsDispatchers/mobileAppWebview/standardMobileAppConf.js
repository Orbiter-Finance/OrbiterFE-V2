import {
  TOKEN_POCKET_APP,
  METAMASK_APP,
  IM_TOKEN_APP,
  BIT_KEEP_APP,
  COINBASE_APP, BRAVE_APP,
} from '../constants';
import { isBraveWallet } from "../utils";

// open ./pcBrowser/standardPCBrowserWalletConf to get the meaning of each prop member
// chainIdTransfer maybe can be optimize
const defaultChainIdTransfer = (chainId) => parseInt(chainId, 16)
const standardMobileAppConf = [
  {
    walletType: IM_TOKEN_APP,
    walletIsInstalledInvestigator: (provider) => provider.isImToken,
    chainIdTransfer: defaultChainIdTransfer,
  },
  {
    walletType: METAMASK_APP,
    walletIsInstalledInvestigator: (provider) =>
      provider.isMetaMask && !provider.isTokenPocket,
    shouldAddChainCode: -32603,
    chainIdTransfer: defaultChainIdTransfer,
    chainIdTransferOnInitProcess: true,
  },
  {
    walletType: BRAVE_APP,
    walletIsInstalledInvestigator: (provider) => isBraveWallet,
    chainIdTransfer: defaultChainIdTransfer,
  },
  {
    walletType: TOKEN_POCKET_APP,
    walletIsInstalledInvestigator: (provider) => provider.isTokenPocket,
    chainIdTransfer: defaultChainIdTransfer,
  },
  {
    walletType: BIT_KEEP_APP,
    walletIsInstalledInvestigator: (provider) => 'isBitKeepChrome' in provider,
    chainIdTransfer: defaultChainIdTransfer,
  },
  {
    walletType: COINBASE_APP,
    walletIsInstalledInvestigator: (provider) =>
      provider.isCoinbaseBrowser && provider.isCoinbaseWallet,
    chainIdTransfer: defaultChainIdTransfer,
  },
]

export default standardMobileAppConf
