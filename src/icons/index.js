// /src/icons/index.js

import Vue from 'vue'
import SvgIcon from '../components/SvgIcon/SvgIcon.vue'
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = (requireContext) => requireContext.keys().map(requireContext)
requireAll(req)

const req2 = require.context('./v2', false, /\.svg$/)
requireAll(req2)

const req3 = require.context('./tokenlogos', false, /\.svg$/)
requireAll(req3)
