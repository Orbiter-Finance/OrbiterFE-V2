<template>
  <div id="orbiter-prizes" class="orbiter-prizes">
    <PrizesTopNav></PrizesTopNav>
    <div class="prizes-content">
      <div class="content">
        <PrizesTopBanner></PrizesTopBanner>
        <PrizesPool></PrizesPool>
        <PrizesAllocation></PrizesAllocation>
        <PrizesRank ></PrizesRank>
        <PrizesRule></PrizesRule>
      </div>
    </div>
    <div class="bg1"></div>
    <div class="bg2"></div>
  </div>
</template>

<script>
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'

import PrizesTopNav from './components/PrizesTopNav.vue'
import PrizesTopBanner from './components/PrizesTopBanner.vue'
import PrizesPool from './components/PrizesPool.vue'
import PrizesAllocation from './components/PrizesAllocation.vue'
import PrizesRank from './components/PrizesRank.vue'
import PrizesRule from './components/PrizesRule.vue'

export default {
  name: 'Prizes',
  components: {
    PrizesTopNav,
    PrizesTopBanner,
    PrizesPool,
    PrizesAllocation,
    PrizesRank,
    PrizesRule,
  },
  computed: {
    evmAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress || ''
    },
  },
  created() {
    this.$store.commit("getPrizesData")
  },
  watch: {
    evmAddress(item1, item2) {
      if (!!item1 && item1 !== item2) {
        this.getUserReward()
      }
    },
  },
  methods: {
    async getUserReward() {
      console.log("11111111")
      if (!this.evmAddress || this.evmAddress === "0x") return
      this.$store.commit("getPrizesuserInfo", this.evmAddress.toLocaleLowerCase())
    },
  },
}
</script>

<style scoped lang="scss">
.orbiter-prizes {
  font-family: GeneralSans-Regular;
  color: #fff;
  font-size: 16px;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  top: 0;
  left: 0;
  padding: 0 0 32px;
  z-index: 1;

  .prizes-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    .content {
      width: 100%;
      max-width: 1080px;
      height: 100%;
    }
  }

  .bg1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 432px;
    height: 298px;
    transform: translate(-35%, -20%);
    filter: blur(400px);
    background-color: rgb(255, 187, 90);
  }

  .bg2 {
    position: absolute;
    top: 200px;
    right: 0;
    width: 432px;
    height: 298px;
    transform: translateX(35%);
    filter: blur(400px);
    background-color: #c20000;
  }
}

@media (max-width: 740px) {
  #orbiter-prizes {
    .bg2 {
      display: none;
    }
  }
}
</style>
