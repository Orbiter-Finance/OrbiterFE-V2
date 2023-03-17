import Vue from 'vue'
import $Loader from './Loading.vue'

const CreateMessage = Vue.extend($Loader)

const instance = new CreateMessage({
  el: document.createElement('div'),
})

instance.show = false

const $loader = {
  show() {
    document.body.appendChild(instance.$el)
    instance.show = true
  },
  hide() {
    instance.show = false
  },
}

export default {
  install() {
    if (!Vue.$loader) {
      Vue.$loader = $loader
    }
    Vue.mixin({
      created() {
        this.$loader = Vue.$loader
      },
    })
  },
}
