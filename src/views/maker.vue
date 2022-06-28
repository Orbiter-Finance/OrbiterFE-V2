<template>
  <div class="makerContent">
    <unloginMaker v-if="!isLogin" />
    <loginMaker
      :makerInfoList="makerInfoList"
      @stateChanged="changeState"
      v-if="isLogin && status === '1'"
    />

    <AddLiquidity
      :makerInfoList="makerInfoList"
      @stateChanged="changeState"
      v-if="isLogin && status === '2'"
    />
  </div>
</template>

<script>
import makerInfo from '../core/routes/makerInfo'
import AddLiquidity from '../components/maker/addLiquidity.vue'
import loginMaker from '../components/maker/loginMaker.vue'
import unloginMaker from '../components/maker/unloginMaker.vue'

export default {
  name: 'Maker',
  props: {},
  components: {
    unloginMaker,
    loginMaker,
    AddLiquidity,
  },
  data() {
    return {
      status: '1',
      makerInfoList: [],
    }
  },
  computed: {
    isLogin() {
      return (
        this.$store.state.web3.isInstallMeta &&
        this.$store.state.web3.isInjected &&
        this.$store.state.web3.localLogin &&
        this.makerInfoList.length > 0
      )
    },
  },
  async mounted() {
    const getMakerInfoFromGraphReq = {
      maker: '0',
    }
    const response = await makerInfo.getMakerInfoFromGraph(
      getMakerInfoFromGraphReq,
      true
    )
    if (response.code === 0) {
      this.makerInfoList = response.data
    }
  },
  methods: {
    changeState(e) {
      if (this.status !== e) {
        this.status = e
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>
