import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'
import { store } from '../../../store'
import { updateCoinbase } from '../../../composition/hooks'

const pollWeb3 = function () {
  compatibleGlobalWalletConf.value.walletPayload.provider.autoRefreshOnNetworkChange = false
  compatibleGlobalWalletConf.value.walletPayload.provider.on('chainChanged', (chainId) => {
    console.log('networkChanged = ' + chainId)
    console.log('networkChanged = ' + parseInt(chainId, 16).toString())
    store.commit('updateNetWorkId', parseInt(chainId, 16).toString())
  })
  compatibleGlobalWalletConf.value.walletPayload.provider.on('accountsChanged', (accounts) => {
    console.log('updateCoinbase = ' + accounts)
    if (accounts.length === 0) {
      updateCoinbase('')
    } else {
      updateCoinbase(accounts[0])
    }
  })
}
export default pollWeb3
