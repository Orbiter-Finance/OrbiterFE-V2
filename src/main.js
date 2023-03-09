import Vue from 'vue'
import VueGtag from 'vue-gtag'
import App from './App.vue'
import AsyncComputed from 'vue-async-computed'
import router from './router'
import './composition'
import { store } from './store'
import './config/theme.scss'
import './config/global.css'
import env from '../env'

import './icons'

import ant from './config/Ant'
import element from './config/Element'
import VueClipboard from 'vue-clipboard2'

import { init } from '../src/util/resize/onresize'
import { CommTooltip } from './components'
import loading from './components/loading/loading.vue'
import CommLoading from './components/CommLoading.vue'
import Loader from './views/data/Loader'
import { isDev, isLocal } from './util/env'
import { GOOGLE_ANALYTICS_ID_TEST, GOOGLE_ANALYTICS_ID } from './const/index'

// inject more powerful log method on the console object
import './util/enhancedLogger'

// in some cases, we may need do something in webview(like imToken's webview environment)
// local only!!!
if (isLocal()) {
  // eruda.init()
  // eruda.position("center");
}

Vue.use(Loader)
Vue.component('loading', loading)
Vue.component('CommLoading', CommLoading)
Vue.component('o-tooltip', CommTooltip)
Vue.config.productionTip = false
Vue.use(AsyncComputed)
Vue.use(ant)
Vue.use(element)
Vue.use(VueClipboard)
Vue.prototype.$env = env

Vue.use(VueGtag, {
  config: {
    id: isLocal() || isDev() ? GOOGLE_ANALYTICS_ID_TEST : GOOGLE_ANALYTICS_ID,
  },
})

const defaultTitle = 'Orbiter'
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : defaultTitle
  next()
})

export default new Vue({
  router,
  store,
  render: (h) => h(App),
  mounted() {
    init()
  },
}).$mount('#app')
