import Vue from 'vue'
import App from './App.vue'
import AsyncComputed from 'vue-async-computed'
import router from './router'
import { store } from './store'
import './config/global.css'
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
import { ethers, utils } from 'ethers'
import { CrossAddress } from './util/cross_address'

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

const test = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const corssAddress = new CrossAddress(provider, 5)
  // await corssAddress.approveERC20('0xeb8f08a975ab53e34d8a0330e0d34de942c95926')
  // const resp = await corssAddress.transferERC20(
  //   '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
  //   '0xa9D1Ce03414DF86233B5beCa03C14631474EA234',
  //   ethers.BigNumber.from(1000000),
  //   Buffer.from('1234')
  // )
  // console.warn('resp >>> ', resp);

  // const resp1 = await corssAddress.transfer(
  //   '0xa9D1Ce03414DF86233B5beCa03C14631474EA234',
  //   utils.parseEther('0.01'),
  //   {
  //     type: '0x01',
  //     value: ethers.utils.hexValue(
  //       '0x6ce4D9694c1626862234216bA78874dE70903A71'
  //     ),
  //   }
  // )
  // console.warn('resp1 >>> ', resp1)
}
setTimeout(test, 3000)
