import { METAMASK } from '../constants'
import { store } from '../../../store'
import { modifyLocalLoginInfo, withPerformInterruptWallet } from '../utils'
import { updateGlobalSelectWalletConf } from '../walletsCoreData'
import { web3State } from '../../../composition/hooks'
import { getWeb3 } from '../../constants/web3/getWeb3'

/**
 *
 * metamask pc browser dispatcher.js is not incorporated into standard processing reducers
 * because the risk is large, if it's plugged in later, this file can be deprecated
 * u can find more information in ./deprecated-coinbaseDispatcher.js
 */

export const loginStatusCheckerOfMetaMask = () => {
  return web3State.isInstallMeta && web3State.isInjected && web3State.localLogin
}

export const metaMaskDispatcherOnDisconnect = withPerformInterruptWallet(() => {
  store.commit('updateLocalLogin', false)
})

export const metaMaskDispatcherOnInit = () => {
  getWeb3()
  updateGlobalSelectWalletConf(METAMASK)
  modifyLocalLoginInfo({
    walletType: METAMASK,
    loginSuccess: true,
    walletPayload: {},
  })
  // universalWalletInitHandler(METAMASK);
}
