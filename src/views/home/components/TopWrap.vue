<template>
  <div class="top-wrap">
    <div class="info-wrap">
      <div
        class="info"
        :style="!isHomePageMobile && { 'background-image': `url(${topWrapBg}` }"
      >
        <div
          class="info-title"
          :style="
            isHomePageMobile && { 'background-image': `url(${topWrapBgMobile}` }
          "
        >
          <span class="info-keynote">ZK-tech Based</span><br />
          Ethereum Acceleration Engine
        </div>
        <div class="desc">
          <span class="desc-keynote"
            >'Everyone is moving to rollups' - Vitalik.</span
          >
          We are now heading to the final stages of this journey, where we have
          proposed a protocol for interchain messaging and developed an
          aggregated middle layer for zk rollups, boosting L2s' Performance and
          decreasing gas consumption.
        </div>
      </div>
    </div>
    <div class="seamless-item-content">
      <vue-seamless-scroll :data="[swiper1]" :class-option="leftOptions">
        <img :src="swiper1" />
      </vue-seamless-scroll>
    </div>
    <div class="seamless-item-content">
      <vue-seamless-scroll :data="[swiper2]" :class-option="rightOptions">
        <img :src="swiper2" />
      </vue-seamless-scroll>
    </div>
  </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
import { isHomePageMobile } from '../../../composition/hooks'

export default {
  components: {
    vueSeamlessScroll,
  },
  props: {
    topWrapBg: {
      type: String,
      default: '',
    },
    topWrapBgMobile: {
      type: String,
      default: '',
    },
    swiper1: {
      type: String,
      default: '',
    },
    swiper2: {
      type: String,
      default: '',
    },
  },
  computed: {
    isHomePageMobile () {
      return isHomePageMobile.value
    },
    leftOptions () {
      return {
        step: 0.5,
        limitMoveNum: 1,
        direction: 2,
        hoverStop: false,
      }
    },
    rightOptions () {
      return {
        step: 0.5,
        limitMoveNum: 1,
        direction: 3,
        hoverStop: false,
      }
    },
  },
}
</script>

<style scoped lang="scss">
.top-wrap {
  padding-bottom: 80px;
  box-sizing: border-box;
}
.info-wrap {
  margin-bottom: 82px;
}

.info {
  margin: 0 auto;
  margin-top: 98px;
  max-width: 1235px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  font-size: 88px;
  font-family: 'Kodchasan-Bold';
  font-weight: bold;
  padding-top: 60px;
  box-sizing: border-box;
  text-align: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: #222222;
  &-keynote {
    color: #ce3b2e;
  }
}

.info-title {
  font-size: 78px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .info-keynote {
    font-size: 88px;
  }
}

.desc {
  padding: 0 54px;
  margin-top: 32px;
  color: #666;
  font-size: 18px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-weight: 400;
  &-keynote {
    font-weight: bold;
    color: #222222;
    font-family: 'Open Sans Regular';
  }
}

.seamless-item-content {
  margin-bottom: 32px;
  width: 100%;
  height: 56px;
  overflow: hidden;
  img {
    width: 2186px;
    height: 100%;
  }
  &:last-of-type {
    margin-bottom: 0;
    img {
      margin-right: 100%;
    }
  }
}
@media (max-width: 1240px) {
  .top-wrap {
    padding-top: 42px;
    height: auto;
    padding-bottom: 40px;
    background: linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%);
    .info-wrap {
      margin-bottom: 40px;
    }
    .info {
      font-size: 42px;
      margin-top: 0;
      padding-top: 0;
      padding: 0 16px;
    }
    .info-title {
      font-size: 34px;
      padding: 22px 0;
      background-size: 360px 100%;
      background-position: center center;
      .info-keynote {
        font-size: 42px;
      }
    }
    .desc {
      margin-top: 24px;
      font-size: 14px;
      padding: 0;
    }
    .seamless-item-content {
      width: 100%;
      height: 40px;
      overflow: hidden;
      margin-bottom: 20px;
      &:last-of-type {
        margin-bottom: 0;
      }
      img {
        width: 1561px;
        height: 100%;
      }
    }
  }
}
</style>
