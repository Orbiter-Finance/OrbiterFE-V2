import { showMessage } from '../../constants/web3/getWeb3'
import { COINBASE, BRAVE, BLOCKWALLET, TALLYHO, OKXWALLET } from '../constants';
import { Notification } from 'element-ui'
import { isBraveWallet } from "../utils";

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
 * - 【 chainIdTransfer: optional 】, in some wallets, chainIds can take different forms, like hex or binary? when that happens,  u must config this property in a function
 * to convert them to base 10
 * - 【 walletNotInstallReducer: optional 】, the effect is equals with initDispatcher, but it's used for match wallet was not installed, by default, loader will throw "【wallet】 not installed" error
 * if u want do something else, u can pass this prop
 * - 【 shouldAddChainCode: optional 】, in different wallet browser extension or different wallet app, if the chain user selected never be added to the wallet environment, this wallet environment will throw an error, the error code is different in different env, so we provide this prop, u can catch should add chain error more accurate in any wallet
  - 【 chainIdTransferOnInitProcess: optional 】 by default, loader invoke chainIdTransfer method in switch chain process only, if u want loader invoke it in init process, set this prop with "true"
 */
export default [
  {
    walletType: BLOCKWALLET,
    icon: BLOCKWALLET,
    shouldAddChainCode: -32603,
    walletNotInstallReducer: () => {
      return Notification({
        title: 'Error: BlockWallet has not been installed.',
        dangerouslyUseHTMLString: true,
        type: 'warning',
        customClass: 'installWalletTips',
        duration: 3000,
        message:
          '<div style="font-family:Inter Regular;text-align: left;">If you already have BlockWallet installed, check your browser extension settings to make sure you have it enabled and that you have disabled any other browser extension wallets.</div>',
      })
    },
  },
  {
    walletType: COINBASE,
    icon: COINBASE,
    walletIsInstalledInvestigator: (provider) => provider.isCoinbaseWallet,
  },
  {
    walletType: BRAVE,
    icon: BRAVE,
    walletIsInstalledInvestigator: (provider) => isBraveWallet,
    chainIdTransfer: (chainId) => parseInt(chainId, 16),
    walletNotInstallReducer: () => {
      // because brave is special, his provider maybe overridden by metamask
      // so even if the user is in the brave browser, he may still not have
      // access the provider of brave wallet

      // maybe we can popup a window to prompt the user to disable the metamask wallet
      // extension? (to avoid user confusion);

      showMessage(
        'The Brave Wallet is only available in the brave browser, so make sure u r in the brave browser, and the brave wallet will conflict with the metamask wallet, so u must disable the metamask wallet extension in your browser if u want to access the brave wallet',
        'warning'
      )
    },
  },
  {
    walletType: TALLYHO,
    icon: TALLYHO,
    walletIsInstalledInvestigator: (provider) => provider.isTally,
    walletNotInstallReducer: () => {
      showMessage(
        'Tally Ho wallet not installed or set as default wallet',
        'error'
      )
    },
  },
  {
    walletType: OKXWALLET,
    icon: OKXWALLET,
    shouldAddChainCode: -32603,
    walletNotInstallReducer: () => {
      return Notification({
        title: 'Error: OKXWallet has not been installed.',
        dangerouslyUseHTMLString: true,
        type: 'warning',
        customClass: 'installWalletTips',
        duration: 3000,
        message:
            '<div style="font-family:Inter Regular;text-align: left;">If you already have OKXWallet installed, check your browser extension settings to make sure you have it enabled and that you have disabled any other browser extension wallets.</div>',
      })
    },
  },
]
