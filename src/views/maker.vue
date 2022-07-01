<template>
  <div class="makerContent">
    <unloginMaker v-if="!isLogin" />
    <loginMaker
      :dTokenAddresses="dTokenAddresses"
      :makerInfoList="makerInfoList"
      @stateChanged="changeState"
      v-if="isLogin && status === '1'"
    />

    <AddLiquidity
      :dTokenAddresses="dTokenAddresses"
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
      dTokenAddresses: {
        5: '0x3965B0ef3E00D4cBbba74Ad4ec77ed0a195CD678', // Rinkeby
        22: '0xe5371F7dbBC11475B3e2B30F59a74fC5750c4Ff4', // ARB(Rinkeby)
        77: '0x6F14a1513Bf9EDa2Eb3cF628f5b3e98f388f5Bc9', // OP(Kovan)
      },
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
