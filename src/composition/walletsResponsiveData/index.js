import { computed } from '../index'
import walletDispatchers, {
  globalSelectWalletConf,
  METAMASK,
} from '../../util/walletsDispatchers'
import { findMatchWeb3ProviderByWalletType } from '../../util/walletsDispatchers/utils'
import { web3State } from '../useCoinbase'

const { loginStatusCheckerOfWallets } = walletDispatchers

// if there is a wallet connect with Oribiter
// it will affect the ui changes in each route
export const walletIsLogin = computed(() => {
  // if wallet type of the global hook data is not equals metamask
  // if equals with metamask, continue with previous logic, waiting for subsequent optimization
  if (
    globalSelectWalletConf.walletType &&
    globalSelectWalletConf.walletType !== METAMASK
  ) {
    const matchProcessor =
      loginStatusCheckerOfWallets[globalSelectWalletConf.walletType]
    return matchProcessor ? matchProcessor() : false
  }

  return web3State.isInstallMeta && web3State.isInjected && web3State.localLogin
})

/**
 * It works exactly the same purpose as "globalSelectWalletConf"
 * mainly for compatibility with metamask, it may be deprecated later
 * walletType
 * walletPayload
 * loginSuccess
 */
export const compatibleGlobalWalletConf = computed(() => {
  if (
    globalSelectWalletConf.walletType &&
    globalSelectWalletConf.walletType !== METAMASK
  ) {
    return globalSelectWalletConf
  }
  return {
    walletType: METAMASK,
    walletPayload: {
      walletAddress: web3State.coinbase,
      provider: findMatchWeb3ProviderByWalletType(METAMASK),
      ...web3State,
      networkId:
        globalSelectWalletConf.walletPayload.networkId || web3State.networkId,
    },
    loginSuccess: true,
  }
})
