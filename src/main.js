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
import { ethers, utils, Wallet } from 'ethers'

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
  const abi = [
    {
      inputs: [
        { internalType: 'address payable', name: '_to', type: 'address' },
        { internalType: 'bytes', name: '_ext', type: 'bytes' },
      ],
      name: 'transfer',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address payable', name: '_token', type: 'address' },
        { internalType: 'address', name: '_to', type: 'address' },
        { internalType: 'uint256', name: '_amount', type: 'uint256' },
        { internalType: 'bytes', name: '_ext', type: 'bytes' },
      ],
      name: 'transferERC20',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]
  // const contractAddress = '0xb7661a0865BD56C3Bf25B2B49842D4DdF838BB1b'

  // const provider = new ethers.providers.Web3Provider(window.ethereum)

  // const signer = provider.getSigner()

  // const contract = new ethers.Contract(contractAddress, abi, signer)

  // const resp = await contract.transferERC20(
  //   '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926',
  //   '0x6ce4D9694c1626862234216bA78874dE70903A71',
  //   utils.hexValue(29000000),
  //   '0x12'
  // )

  // console.warn('resp >>> ', resp)

  console.warn('hex >>> ', utils.hexValue(100));

  const dec = utils.defaultAbiCoder.decode(
    ['address', 'uint256'],
    utils.hexDataSlice('0xa9059cbb0000000000000000000000006ce4d9694c1626862234216ba78874de70903a71000000000000000000000000000000000000000000000000000000003b5dc189', 4)
  )
  console.warn(dec);
}
setTimeout(test, 3000)
