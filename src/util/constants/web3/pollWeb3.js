import { store } from '../../../store'

const pollWeb3 = function () {
  window.ethereum.autoRefreshOnNetworkChange = false
  window.ethereum.on('chainChanged', (chainId) => {
    store.commit('updateNetWorkId', parseInt(chainId, 16).toString())
  })
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      store.commit('updateCoinbase', '')
    } else {
      store.commit('updateCoinbase', accounts[0])
    }
  })
}
export default pollWeb3
