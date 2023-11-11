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
import * as Sentry from "@sentry/vue";

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

if (process.env['VUE_APP_SENTRY_DSN']) {
  try {
    Sentry.init({
      Vue,
      dsn: process.env['VUE_APP_SENTRY_DSN'],
      integrations: [
        new Sentry.BrowserTracing({
          // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
          tracePropagationTargets: ["localhost", "https://www.orbiter.finance/", "https://openapi.orbiter.finance/"],
          // tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        }),
        new Sentry.Replay(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of the transactions
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
  }catch(error){
  }
}
