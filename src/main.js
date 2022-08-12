import Vue from 'vue'
import App from './App.vue'
import AsyncComputed from 'vue-async-computed'
import router from './router'
import { store } from './store'
import './config/theme.scss'
import './config/global.css'
// import './util/rem'
import env from '../env'

import './icons'

import ant from './config/Ant'
import element from './config/Element'
import VueClipboard from 'vue-clipboard2'

import '../src/util/resize/onresize'
import Button from './components/btn/orbiterBtn.vue'
import boxcontent from './components/content/boxContent.vue'
import otooltip from './components/tooltip/oTooltip.vue'
import loading from './components/loading/loading.vue'

Vue.component('loading', loading)
Vue.component('o-box-content', boxcontent)
Vue.component('o-button', Button)
Vue.component('o-tooltip', otooltip)
Vue.config.productionTip = false
Vue.use(AsyncComputed)
Vue.use(ant)
Vue.use(element)
Vue.use(VueClipboard)
Vue.prototype.$env = env

const defaultTitle = 'Orbiter'
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : defaultTitle
  next()
})

export default new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
