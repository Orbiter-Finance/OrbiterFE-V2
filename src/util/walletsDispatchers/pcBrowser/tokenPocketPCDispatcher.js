import { store } from '../../../store'
import { withPerformInterruptWallet } from '../utils'

export const tokenPocketDispatcherOnDisconnect = withPerformInterruptWallet(
  () => {
    store.commit('updateLocalLogin', false)
  }
)
