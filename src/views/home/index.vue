<template>
  <div class="home-page-content">
    <TopWrap
      :swiper1="currentModePic.swiper_banner1"
      :swiper2="currentModePic.swiper_banner2"
      :topWrapBg="currentModePic.top_wrap_bg"
    />
    <Stage1
      :titleBg="currentModePic.development_adorn"
      :stageTitleImg="currentModePic.stage1_title"
      :stageImage="currentModePic.stage1_image"
    />
    <Data :showData="showData" />
    <div class="home-page-info">
      <HowItWorks
        :titleBg="currentModePic.development_adorn"
        :processImage="currentModePic.process"
      />
      <Stage2
        :stageTitleImg="currentModePic.stage2_title"
        :stageBg="currentModePic.stage2_bg"
      />
      <Stage2Banner :zkProverBg="currentModePic.zk_prover_bg" />
      <Stage2OurTarget
        :titleBg="currentModePic.development_adorn"
        :realTime="currentModePic.target_real_time"
        :lowCost="currentModePic.target_low_cost"
        :scalability="currentModePic.target_scalability"
      />
      <Stage2LatestDevelopment
        :titleBg="currentModePic.development_adorn"
        :developmentImg="currentModePic.development"
      />
      <Events
        :titleBg="currentModePic.development_adorn"
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

import top_wrap_bg_light from '../../assets/orbiter_home_light/top_wrap_bg_light.png'
import development_adorn_light from '../../assets/orbiter_home_light/development_adorn_light.png'
import development_light from '../../assets/orbiter_home_light/development_light.png'
import event1_light from '../../assets/orbiter_home_light/event1_light.png'
import event2_light from '../../assets/orbiter_home_light/event2_light.png'
import event3_light from '../../assets/orbiter_home_light/event3_light.png'
import footer_icon_light from '../../assets/orbiter_home_light/footer_icon_light.png'
import zk_prover_light from '../../assets/orbiter_home_light/zk_prover_light.png'
import process_light from '../../assets/orbiter_home_light/process_light.png'
import stage1_image_light from '../../assets/orbiter_home_light/stage1_image_light.png'
import stage1_title_light from '../../assets/orbiter_home_light/stage1_title_light.png'
import stage2_title_light from '../../assets/orbiter_home_light/stage2_title_light.png'
import stage2_bg_light from '../../assets/orbiter_home_light/stage2_bg_light.png'
import swiper_banner1_light from '../../assets/orbiter_home_light/swiper_banner1_light.png'
import swiper_banner2_light from '../../assets/orbiter_home_light/swiper_banner2_light.png'
import target_low_cost_light from '../../assets/orbiter_home_light/target_low_cost_light.png'
import target_real_time_light from '../../assets/orbiter_home_light/target_real_time_light.png'
import target_scalability_light from '../../assets/orbiter_home_light/target_scalability_light.png'

import development_adorn_dark from '../../assets/orbiter_home_dark/development_adorn_dark.png'
import development_dark from '../../assets/orbiter_home_dark/development_dark.png'
import event1_dark from '../../assets/orbiter_home_dark/event1_dark.png'
import event2_dark from '../../assets/orbiter_home_dark/event2_dark.png'
import event3_dark from '../../assets/orbiter_home_dark/event3_dark.png'
import footer_icon_dark from '../../assets/orbiter_home_dark/footer_icon_dark.png'
import zk_prover_dark from '../../assets/orbiter_home_dark/zk_prover_dark.png'
import process_dark from '../../assets/orbiter_home_dark/process_dark.png'
import stage1_image_dark from '../../assets/orbiter_home_dark/stage1_image_dark.png'
import stage1_title_dark from '../../assets/orbiter_home_dark/stage1_title_dark.png'
import stage2_title_dark from '../../assets/orbiter_home_dark/stage2_title_dark.png'
import stage2_bg_dark from '../../assets/orbiter_home_dark/stage2_bg_dark.png'
import swiper_banner1_dark from '../../assets/orbiter_home_dark/swiper_banner1_dark.png'
import swiper_banner2_dark from '../../assets/orbiter_home_dark/swiper_banner2_dark.png'
import target_low_cost_dark from '../../assets/orbiter_home_dark/target_low_cost_dark.png'
import target_real_time_dark from '../../assets/orbiter_home_dark/target_real_time_dark.png'
import target_scalability_dark from '../../assets/orbiter_home_dark/target_scalability_dark.png'
import top_wrap_bg_dark from '../../assets/orbiter_home_dark/top_wrap_bg_dark.png'

export default {
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
  data () {
    return {
      showData: false,
      lightPics: {
        top_wrap_bg: top_wrap_bg_light,
        development_adorn: development_adorn_light,
        development: development_light,
        event1: event1_light,
        event2: event2_light,
        event3: event3_light,
        footer_icon: footer_icon_light,
        process: process_light,
        stage1_image: stage1_image_light,
        stage1_title: stage1_title_light,
        stage2_title: stage2_title_light,
        stage2_bg: stage2_bg_light,
        swiper_banner1: swiper_banner1_light,
        swiper_banner2: swiper_banner2_light,
        target_real_time: target_real_time_light,
        target_low_cost: target_low_cost_light,
        target_scalability: target_scalability_light,
        zk_prover_bg: zk_prover_light,
      },
      darkPics: {
        top_wrap_bg: top_wrap_bg_dark,
        development_adorn: development_adorn_dark,
        development: development_dark,
        event1: event1_dark,
        event2: event2_dark,
        event3: event3_dark,
        footer_icon: footer_icon_dark,
        process: process_dark,
        stage1_image: stage1_image_dark,
        stage1_title: stage1_title_dark,
        stage2_title: stage2_title_dark,
        stage2_bg: stage2_bg_dark,
        swiper_banner1: swiper_banner1_dark,
        swiper_banner2: swiper_banner2_dark,
        target_real_time: target_real_time_dark,
        target_low_cost: target_low_cost_dark,
        target_scalability: target_scalability_dark,
        zk_prover_bg: zk_prover_dark,
      },
    }
  },
  computed: {
    isLightMode () {
      return this.$store.state.themeMode === 'light'
    },
    currentModePic () {
      return this.isLightMode ? this.lightPics : this.darkPics
    },
  },
  mounted () {
    document
      .getElementById('app')
      .addEventListener('scroll', this.handleScroll, false)
  },
  destroyed () {
    document
      .getElementById('app')
      .removeEventListener('scroll', this.handleScroll, false)
  },
  methods: {
    handleScroll (e) {
      const screenHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      const content = document.getElementsByClassName('fade-content')
      Array.from(content).forEach((element, index) => {
        if (
          element?.getBoundingClientRect()?.top < screenHeight - 100 &&
          element?.getBoundingClientRect()?.top > 0
        ) {
          if (index === 0) {
            this.showData = true
          }
          element?.classList.add('contain')
        }
      })
    },
    handlerClickJump (e) {
      const jumpUrlEnum = {
        'Start the fastest bridging experience ➝':
          'https://www.orbiter.finance/',
        'Learn more in yellowpaper ➝':
          'https://github.com/Orbiter-Finance/papers/blob/main/yellowpaper/yellowpaper.pdf',
        'Learn more about AA zkprover SDK ➝':
          'https://github.com/Orbiter-Finance/zkprover-dapp',
        'View More ➝': 'https://orbiter-finance.medium.com/',
        'Orbiter Data': 'https://www.orbiter.finance/data',
        'Orbiter bridge': 'https://www.orbiter.finance/bridge',
        'AAzkprover SDK': 'https://github.com/Orbiter-Finance/zkprover-dapp',
        Twitter: 'https://twitter.com/Orbiter_Finance',
        Discord: 'https://discord.gg/orbiter-finance',
        Medium: 'https://orbiter-finance.medium.com/',
        'User Docs': 'https://docs.orbiter.finance/',
        Yellowpaper:
          'https://github.com/Orbiter-Finance/papers/blob/main/yellowpaper/yellowpaper.pdf',
      }
      const jumpKey = e.target.innerText || ''
      const jumpUrl = jumpUrlEnum[jumpKey] || ''
      if (!jumpUrl) return
      window.open(jumpUrl)
    },
  },
  provide () {
    return {
      handlerClickJump: this.handlerClickJump,
    }
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
