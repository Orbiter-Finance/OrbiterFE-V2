<template>
  <div id="orbiter-prizes" class="orbiter-prizes">
    <PrizesTopNav></PrizesTopNav>
    <PrizesTopBanner></PrizesTopBanner>
    <div class="prizes-content">
      <div class="content">
        <PrizesPool></PrizesPool>
        <PrizesAllocation></PrizesAllocation>
        <PrizesAchieve></PrizesAchieve>
        <PrizesRank></PrizesRank>
        <PrizesRule></PrizesRule>
      </div>
    </div>
  </div>
</template>

<script>
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'

import PrizesTopNav from './components/PrizesTopNav.vue'
import PrizesTopBanner from './components/PrizesTopBanner.vue'
import PrizesRank from './components/PrizesRank.vue'
import PrizesRule from './components/PrizesRule.vue'
import PrizesPool from './components/PrizesPool.vue'
import PrizesAllocation from './components/PrizesAllocation.vue'
import PrizesAchieve from './components/PrizesAchieve.vue'


export default {
  name: 'Prizes2',
  components: {
    PrizesTopNav,
    PrizesTopBanner,
    PrizesPool,
    PrizesRank,
    PrizesRule,
    PrizesAllocation,
    PrizesAchieve
  },
  computed: {
    evmAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress || ''
    },
  },
  created() {
    this.$store.commit('getPrizesProjectInfo')
    this.$store.commit('getPrizesUserRankTopAchieve')
    this.$store.commit('getPrizesProjectRank')
    this.getUserReward()
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
      if (!this.evmAddress || this.evmAddress === '0x') return
      this.$store.commit(
        'getPrizesUserInfo',
        this.evmAddress.toLocaleLowerCase()
      )
      this.$store.commit("getPrizesUserRank", 
        this.evmAddress.toLocaleLowerCase()
      )
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
  background-color: #010101;

  .prizes-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    .content {
      width: 100%;
      max-width: 1200px;
      height: 100%;
    }
  }
}

@media (max-width: 740px) {
  #orbiter-prizes {
    .content {
      width: 100%;
      padding: 0 16px;
    }
  }
}
</style>
