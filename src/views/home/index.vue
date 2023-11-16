<template>
  <div class="home-page-content">
    <TopWrap
      :swiper1="currentModePic.swiper_banner1"
      :swiper2="currentModePic.swiper_banner2"
      :topWrapBg="currentModePic.top_wrap_bg"
      :topWrapBgMobile="currentModePic.top_wrap_bg_mobile"
    />
    <Stage1
      :titleBg="currentUnders.underRollup"
      :stageTitleImg="currentModePic.stage1_title"
      :stageImage="currentModePic.stage1_image"
    />
    <Data />
    <div class="home-page-info">
      <HowItWorks
        :titleBg="currentUnders.underWorks"
        :processImage="currentModePic.process"
      />
      <Stage2
        :stageTitleImg="currentModePic.stage2_title"
        :stageBg="currentModePic.stage2_bg"
      />
      <Stage2Banner :zkProverBg="currentModePic.zk_prover_bg" />
      <Stage2OurTarget
        :titleBg="currentUnders.underTarget"
        :realTime="currentModePic.target_real_time"
        :lowCost="currentModePic.target_low_cost"
        :scalability="currentModePic.target_scalability"
      />
      <Stage2LatestDevelopment
        :titleBg="currentUnders.underLatest"
        :developmentImg="currentModePic.development"
      />
      <Events
        :titleBg="currentUnders.underEvent"
        :eventImg1="currentModePic.event1"
        :eventImg2="currentModePic.event2"
        :eventImg3="currentModePic.event3"
      />
    </div>
    <Footer :footerIcon="currentModePic.footer_icon"></Footer>
  </div>
</template>

<script>
import TopWrap from './components/TopWrap.vue'
import Stage1 from './components/Stage1.vue'
import Data from './components/Data.vue'
import HowItWorks from './components/HowItWorks.vue'
import Stage2 from './components/Stage2.vue'
import Stage2Banner from './components/Stage2Banner.vue'
import Stage2OurTarget from './components/Stage2OurTarget.vue'
import Stage2LatestDevelopment from './components/Stage2LatestDevelopment.vue'
import Events from './components/Events.vue'
import Footer from './components/Footer.vue'

import getPicMixin from './mixins/getPic'
import jumpToUrl from './mixins/jumpToUrl'
import scrollToDomAnimation from './mixins/scrollToDomAnimation.js'

export default {
  mixins: [getPicMixin, jumpToUrl, scrollToDomAnimation],
  components: {
    TopWrap,
    Stage1,
    Data,
    HowItWorks,
    Stage2,
    Stage2Banner,
    Stage2OurTarget,
    Stage2LatestDevelopment,
    Events,
    Footer,
  },
}
</script>

<style scoped lang="scss">
.home-page-content {
  display: flex;
  flex-direction: column;
}
.home-page-info {
  background: #f5f5f5;
  overflow: hidden;
}

.contain {
  animation-name: CONTENTfadeIN;
  animation-duration: 1.2s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}
@keyframes CONTENTfadeIN {
  0% {
    opacity: 0;
    transform: translate3d(0px, 15px, 0px) scale3d(1, 1, 1) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  }
  100% {
    opacity: 1;
    transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
    transform-style: preserve-3d;
  }
}
</style>
