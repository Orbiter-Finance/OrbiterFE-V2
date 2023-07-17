/**
 * this file exports a set of common wallet apis
 * using these apis, it's very easy to access a compliant wallet without extra code
 */
import Web3 from 'web3'
import {
  findMatchWeb3ProviderByWalletType,
  modifyLocalLoginInfo,
} from '../utils.js'
import {
  updateGlobalSelectWalletConf,
  updateSelectWalletAddress,
  updateSelectWalletConfPayload,
  globalSelectWalletConf,
} from '../walletsCoreData'
import { showMessage } from '../../constants/web3/getWeb3'
import { getNetworkIdByChainId } from '../../chainUtils'
import util from '../../util'
import env from "../../../../env";
import { isBraveWallet } from "../utils";
import { BRAVE, BRAVE_APP } from "../constants";

// install wallet checks if target wallet extension is installed
// if installed, the provider of this wallet will be return
// otherwise it will throw error;
export const installWallet = (walletType, walletIsInstalledInvestigator) => {
  return new Promise((resolve) => {
    if (window.ethereum || typeof window.okxwallet !== 'undefined') {
      try {
        // findMatchWeb3ProviderByWalletType will helps u to check ethereum conflicts
        const matchProvider = findMatchWeb3ProviderByWalletType(
          walletType,
          walletIsInstalledInvestigator
        )
        if (!matchProvider) {
          resolve(null)
          return
        }
        matchProvider.enable().then(() => resolve(matchProvider))
      } catch (error) {
        const errorMsg = 'User denied account access'
        showMessage(errorMsg, 'error')
        resolve(null)
      }
    } else {
      // const errorMsg = `not install ${walletType}`;
      // showMessage(errorMsg, "error");
      resolve(null)
    }
  })
}

// get network id , wallet address , etc ...  by invoke this method
export const performWalletInformation = async (
  walletType,
  walletIsInstalledInvestigator,
  walletConf
) => {
  const matchWalletProvider = await installWallet(
    walletType,
    walletIsInstalledInvestigator
  )
  if (!matchWalletProvider) throw new Error(`not install ${walletType}`)
  if (window.ethereum?.isLoopring) {
    await matchWalletProvider.enable();
  }
  const performResult = {
    walletType,
    isInstalled: true, // matchWalletProvider !== null, web extension definitely be installed
    networkId: null,
    walletAddress: null,
  }
  const matchWalletWeb3Provider = new Web3(matchWalletProvider) // inject web3
  let networkId, walletAddress
  if (matchWalletProvider.request) {
    // provide ethereum standard request method, more compatible, recommend first
    networkId = await matchWalletProvider.request({
      method: 'net_version',
    })
  } else {
    networkId = await matchWalletWeb3Provider.eth.request({
      method: 'net_version ',
    })
  }
  if (!networkId)
    showMessage('get netWorkID failed, refresh and try again', 'error')
  else {
    // in some wallet env, networkId maybe is special, if "chainIdTransferOnInitProcess" was configured, networkId will be transfer in init process
    if (walletConf.chainIdTransferOnInitProcess)
      networkId = walletConf.chainIdTransfer(networkId)
    performResult.networkId = networkId
  }
  if (matchWalletProvider.request) {
    ;[walletAddress] = await matchWalletProvider.request({
      method: 'eth_accounts',
    })
  } else {
    ;[walletAddress] = await matchWalletWeb3Provider.eth.request({
      method: 'eth_accounts',
    })
  }
  if (!walletAddress)
    showMessage(
      `get coinbase failed，please unlock ${walletType} or generate a new address`,
      'error'
    )
  else performResult.walletAddress = walletAddress
  return {
    performResult,
    provider: matchWalletProvider,
  }
}

// this method can init wallet config directly if the wallet type
// passed is a standard compliant wallet
export const universalWalletInitHandler = (walletConf) => {
  const { walletType, walletIsInstalledInvestigator, walletNotInstallReducer } =
    walletConf

  performWalletInformation(
    walletType,
    walletIsInstalledInvestigator,
    walletConf
  )
    .then(({ performResult, provider }) => {
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
        walletPayload: performResult,
      }
      if (isBraveWallet && (walletType === BRAVE || walletType === BRAVE_APP)) {
        try {
          updateGlobalSelectWalletConf(
              legalWalletConfig.walletType,
              {
                ...legalWalletConfig.walletPayload,
                provider,
              },
              true
          );
        } catch (e) {
          updateGlobalSelectWalletConf(
              legalWalletConfig.walletType,
              {
                ...legalWalletConfig.walletPayload,
                provider,
              },
              true
          );
        }
      } else {
        // provider can't be stored in localStorage, but to facilitate global access
        // to this ethereum instance(wallet matched), i put it in the global responsive data
        updateGlobalSelectWalletConf(
            legalWalletConfig.walletType,
            {
              ...legalWalletConfig.walletPayload,
              provider,
            },
            true
        );
      }
      modifyLocalLoginInfo(legalWalletConfig)

      // listen for changes
      walletInfoChangeWatcher(walletConf, provider)
    })
    .catch((err) => {
      console.error(err);
      if (walletNotInstallReducer) {
        walletNotInstallReducer()
        return
      }
      console.errorLog(`${walletType} init err`, err)
      showMessage(err, 'error')
    })
}

// observe chain id and account changes and update global wallet config
// when they r changed
const walletInfoChangeWatcher = (walletConf, walletProvider) => {
  const { chainIdTransfer = (chainId) => chainId } = walletConf
  walletProvider.autoRefreshOnNetworkChange = false
  // why call Object.assign? because "window.ethereum" is frozen in brave browser
  // so we defrosted it to ensure that the emit can be assign again
  if (!isBraveWallet) window.ethereum = Object.assign({}, window.ethereum);
  // rewrite ethereum.emit because when a wallet extension switches networks
  // the window.ethereum.emit method will be called, due to multiple wallets
  // will generate the ethereum injection conflict, so the emit that wallet extension
  // called maybe not pure
  if (typeof window.okxwallet === 'undefined' && !isBraveWallet) window.ethereum.emit = walletProvider.emit;
  console.notifyLog('wallet provider listening....', walletProvider)
  walletProvider.on('chainChanged', (chainId) => {
    console.successLog(
      'chainId updated, convert result',
      chainIdTransfer(chainId)
    )
    updateSelectWalletConfPayload({
      networkId: chainIdTransfer(chainId),
    })
  })

  walletProvider.on('accountsChanged', ([newWalletAddress = '']) => {
    console.successLog('user wallet address updated', newWalletAddress)
    updateSelectWalletAddress(newWalletAddress)
  })
}

// if the current wallet doesn't have the chain selected by the user,
// calling this method can wake up the browser wallet extensions and
// directs the user to append the chain
export const universalWalletSwitchChainHandler = (
  walletConf,
  walletProvider,
  successCallback = () => {},
  failCallback = () => {}
) => {
  const presentNetWorkId = getNetworkIdByChainId()
  const switchParams = {
    chainId: util.toHex(presentNetWorkId),
  }
  walletProvider
    .request({
      method: 'wallet_switchEthereumChain',
      params: [switchParams],
    })
    .then((data) => {
      console.successLog('switch chain success', data)
      updateSelectWalletConfPayload({
        networkId: presentNetWorkId,
      })
      successCallback(data)
    })
    .catch((reason) => {
      const { code, message } = reason
      // in different wallet env(app or browser and even more), chain not exist error is different, we can read the user config to get the correct code
      const currentChainNotAddedErrorCode =
        walletConf.shouldAddChainCode || 4902
      // if switch failed, and the error code was 4902, it shows that
      // the user doesn't have this chain in his browser wallet, we can
      // direct user to add by invoke universalWalletAddChainHandler
      if (code === currentChainNotAddedErrorCode)
        universalWalletAddChainHandler(walletConf, walletProvider)
      else {
        util.showMessage(message, 'error')
        failCallback()
      }
    })
}

// if the chain where current wallet selected is different from the chain
// selected by user, calling this method can wake up the browser wallet
// extensions and directs the user to change the chain
export const universalWalletAddChainHandler = (walletConf, walletProvider) => {
  const presentNetWorkId = getNetworkIdByChainId()
  const matchChainConf = util.getChainInfoByNetworkId(presentNetWorkId)
  const { name, nativeCurrency, chainId, rpc } =
    matchChainConf

  const addParams = {
    chainId: util.toHex(chainId), // A 0x-prefixed hexadecimal string
    chainName: name,
    nativeCurrency: {
      name: nativeCurrency.name,
      symbol: nativeCurrency.symbol, // 2-6 characters long
      decimals: nativeCurrency.decimals,
    },
    rpcUrls: rpc,
    blockExplorerUrls: [env.networkUrl[chainId]],
  }
  walletProvider
    .request({
      method: 'wallet_addEthereumChain',
      params: [addParams, globalSelectWalletConf.walletPayload.walletAddress],
    })
    .catch((reason) => {
      console.errorLog('add chain error', reason)
      const { message } = reason
      util.showMessage(message, 'error')
    })
}
