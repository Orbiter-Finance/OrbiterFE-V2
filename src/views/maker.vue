<template>
  <div class="makerContent">
    <unloginMaker />
    <!-- <unloginMaker v-if="!isLogin" /> -->
    <!-- <loginMaker v-on:stateChanged="changeState"
                v-if="isLogin && status === '1'" />
    <AddLiquidity v-on:stateChanged="changeState"
                  v-if="isLogin && status === '2'" /> -->
  </div>
</template>

<script>

import unloginMaker from '../components/maker/unloginMaker.vue'
// import loginMaker from '../components/maker/loginMaker.vue'
// import AddLiquidity from '../components/maker/addLiquidity.vue'

export default {
  name: 'Maker',
  props: {
  },
  components: {
    unloginMaker,
    // loginMaker,
    // AddLiquidity
  },
  data() {
    return {
      status: '1',
    }
  },
  watch: {
  },
  mounted() {
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
