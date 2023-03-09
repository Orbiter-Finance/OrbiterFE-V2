import { METAMASK } from './constants'
import { store } from '../../store'
import { modifyLocalLoginInfo, withPerformInterruptWallet } from './utils'
import { updateGlobalSelectWalletConf } from './walletsCoreData'
import { web3State } from '../../composition/hooks'
import { getWeb3 } from '../../util/constants/web3/getWeb3'

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
