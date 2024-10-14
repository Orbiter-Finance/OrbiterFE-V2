import Vue from 'vue'
import Vuei18n from 'vue-i18n'
import en from './en.json'
import kr from './kr.json'
Vue.use(Vuei18n)

const i18n = new Vuei18n({
  locale: localStorage.getItem('ORBITER_LANG') || 'en',
  messages: {
    en,
    kr,
  },
})
export { i18n }
