import Vue from 'vue'
import Vuex from 'vuex'
import state from './state/state'
import mutations from './mutations/mutations'
import getters from './getters/getters'
import actions from './actions/actions'

Vue.use(Vuex)

// const isDev = process.env.NODE_ENV === 'development'
export const store = new Vuex.Store({
  strict: false,
  state,
  mutations,
  getters,
  actions,
})
