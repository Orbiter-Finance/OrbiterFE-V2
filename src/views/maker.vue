<template>
  <div class="makerContent">
    <unloginMaker />
  </div>
</template>

<script>
import unloginMaker from '../components/maker/unloginMaker.vue'

export default {
  name: 'Maker',
  components: {
    unloginMaker,
  },
  computed: {
    isLogin() {
      return this.$store.state.web3.isInstallMeta && this.$store.state.web3.isInjected && this.$store.state.web3.localLogin
    }
  },
  methods: {
    changeState(e) {
      if (this.status !== e) {
        this.status = e;
      }
    }
  }
}
</script>
