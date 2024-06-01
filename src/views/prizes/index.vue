<template>
  <div id="orbiter-prizes" class="orbiter-prizes">
    <div class="content">
      <!-- <PrizesTopNav></PrizesTopNav> -->
      <PrizesTopBanner></PrizesTopBanner>
      <PrizesPool
        :addressCount="addressCount"
        :totalRewards="totalRewards"
      ></PrizesPool>
      <PrizesAllocation
        :rank="userInfo.rank"
        :tx="userInfo.tx"
        :reward="userInfo.reward"
        :top100Tx="top100Tx"
      ></PrizesAllocation>
      <PrizesRank :rankList="rankList"></PrizesRank>
      <PrizesRule></PrizesRule>
    </div>
    <div class="bg1"></div>
    <div class="bg2"></div>
  </div>
</template>

<script>
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'

// import PrizesTopNav from './components/PrizesTopNav.vue'
import PrizesTopBanner from './components/PrizesTopBanner.vue'
import PrizesPool from './components/PrizesPool.vue'
import PrizesAllocation from './components/PrizesAllocation.vue'
import PrizesRank from './components/PrizesRank.vue'
import PrizesRule from './components/PrizesRule.vue'

export default {
  name: 'Prizes',
  components: {
    // PrizesTopNav,
    PrizesTopBanner,
    PrizesPool,
    PrizesAllocation,
    PrizesRank,
    PrizesRule,
  },
  data() {
    return {
      addressCount: '0',
      totalRewards: '0',
      txCount: '0',

      rankList: [],
      userInfo: {
        rank: 0,
        tx: 0,
        reward: '0',
      },
      top100Tx: 0,
    }
  },
  computed: {
    evmAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress || ''
    },
  },
  created() {
    this.getData()
  },
  watch: {
    evmAddress(item1, item2) {
      if (!!item1 && (item1 !== item2)) {
        this.getData2()
      }
    },
  },
  methods: {
    async getData() {
      const response = await fetch(
        `${process.env.VUE_APP_OPEN_URL}/dashboard-api/stat/competition/info`
      )
      const { result } = await response.json()
      const { addressCount, totalRewards, txCount, list } = result || {}
      this.addressCount = addressCount ? String(addressCount) : '0'
      this.totalRewards = totalRewards ? String(totalRewards) : '0'
      this.txCount = txCount ? String(txCount) : '0'
      this.rankList = list
      this.top100Tx = list[list?.length - 1 || 0]?.count || 0
    },
    async getData2() {
      if (!this.evmAddress) return
      const response = await fetch(
        `${process.env.VUE_APP_OPEN_URL}/dashboard-api/stat/competition/address?address=${this.evmAddress.toLocaleLowerCase()}`
      )
      const { result } = await response.json()
      const { count, rank, reward } = result || {}
      this.userInfo = {
        ...this.userInfo,
        rank: rank || 0,
        tx: count || 0,
        reward: reward || '0',
      }
    },
  },
}
</script>

<style scoped lang="scss">
.orbiter-prizes {
  font-family: OpenSansRoman-Regular;
  color: #fff;
  font-size: 16px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: start;
  position: relative;
  overflow: hidden;
  top: 0;
  left: 0;
  .content {
    width: 100%;
    max-width: 1080px;
    height: 100%;
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
</style>
