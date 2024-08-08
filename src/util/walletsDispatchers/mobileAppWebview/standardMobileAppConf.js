import {
  TOKEN_POCKET_APP,
  METAMASK_APP,
  IM_TOKEN_APP,
  BIT_KEEP_APP,
  COINBASE_APP,
  BRAVE_APP,
  LOOPRING_APP,
  ZERION_APP,
  WALLETCONNECT,
  COIN98_APP,
  TRUSTWALLET_APP,
  SAFEPAL,
  BINANCEWALLET,
} from '../constants'
import { isBraveWallet } from '../utils'

// open ./pcBrowser/standardPCBrowserWalletConf to get the meaning of each prop member
// chainIdTransfer maybe can be optimize
const defaultChainIdTransfer = (chainId) => parseInt(chainId, 16)
const standardMobileAppConf = [
  {
    walletType: WALLETCONNECT,
    walletIsInstalledInvestigator: () => true,
    chainIdTransfer: defaultChainIdTransfer,
  },
  {
    walletType: IM_TOKEN_APP,
    walletIsInstalledInvestigator: (provider) => provider.isImToken,
    chainIdTransfer: defaultChainIdTransfer,
  },
  {
    walletType: SAFEPAL,
    walletIsInstalledInvestigator: (provider) => provider.isSafePal,
    chainIdTransfer: defaultChainIdTransfer,
  },
  {
    walletType: BINANCEWALLET,
    walletIsInstalledInvestigator: (provider) => provider.isBinance,
    chainIdTransfer: defaultChainIdTransfer,
  },
  {
    walletType: LOOPRING_APP,
    walletIsInstalledInvestigator: (provider) => provider.isLoopring,
    chainIdTransfer: defaultChainIdTransfer,
  },
  {
    walletType: ZERION_APP,
    walletIsInstalledInvestigator: (provider) => provider.isZerion,
    chainIdTransfer: defaultChainIdTransfer,
  },
  {
    walletType: METAMASK_APP,
    walletIsInstalledInvestigator: (provider) =>
      provider.isMetaMask && !provider?.isTokenPocket,
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
    walletIsInstalledInvestigator: (provider) => provider?.isTokenPocket,
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
  {
    walletType: COIN98_APP,
    walletIsInstalledInvestigator: (provider) => provider.isCoin98,
    chainIdTransfer: (chainId) => Number(chainId),
  },
  {
    walletType: TRUSTWALLET_APP,
    walletIsInstalledInvestigator: (provider) => provider.isTrustWallet,
    chainIdTransfer: (chainId) => Number(chainId),
  },
  // {
  //   walletType: PHANTOMWALLET,
  //   walletIsInstalledInvestigator: (provider) =>
  //     window.phantom.ethereum?.isPhantomt,
  //   chainIdTransfer: (chainId) => Number(chainId),
  // },
]

export default standardMobileAppConf
