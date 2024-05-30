<template>
  <div id="orbiter-prizes" class="orbiter-prizes">
    <div class="content">
      <PrizesTopNav></PrizesTopNav>
      <PrizesTopBanner></PrizesTopBanner>
      <PrizesPool></PrizesPool>
      <PrizesAllocation></PrizesAllocation>
      <PrizesRank></PrizesRank>
      <PrizesRule></PrizesRule>
    </div>
    <div class="bg1"></div>
  </div>
</template>

<script>
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
}
</style>
