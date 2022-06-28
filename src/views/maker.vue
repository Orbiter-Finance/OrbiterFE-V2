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
        5: '0x6ce4D9694c1626862234216bA78874dE70903A71',
        22: '0xF2BE509057855b055f0515CCD0223BEf84D19ad4',
        77: '0xa9D1Ce03414DF86233B5beCa03C14631474EA234',
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
