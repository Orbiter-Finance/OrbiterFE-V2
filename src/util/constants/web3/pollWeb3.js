import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'
import { store } from '../../../store'

const pollWeb3 = function () {
  window.ethereum.autoRefreshOnNetworkChange = false
  compatibleGlobalWalletConf.value.walletPayload.provider.on('chainChanged', (chainId) => {
    console.log('networkChanged = ' + chainId)
    console.log('networkChanged = ' + parseInt(chainId, 16).toString())
    store.commit('updateNetWorkId', parseInt(chainId, 16).toString())
  })
  compatibleGlobalWalletConf.value.walletPayload.provider.on('accountsChanged', (accounts) => {
    console.log('updateCoinbase = ' + accounts)
    if (accounts.length === 0) {
      store.commit('updateCoinbase', '')
    } else {
      store.commit('updateCoinbase', accounts[0])
    }
  })
}
export default pollWeb3
