<template>
  <div class="works-wrap fade-content">
    <div class="title" :style="{ 'background-image': `url(${titleBg}` }">
      How it works
    </div>
    <div class="desc">
      Foster optimism principle among the compliant majority while enforcing
      strict measures against the malicious minority.​<br />
      All protocols operate on the main network, inheriting its security for
      efficient and secure communication.<br />​ Establish the validity of
      cross-rollup communication, with zk-SNARKs playing a crucial role in
      validation proofs.
    </div>
    <div class="learn-more" @click="handlerClickJump">
      Go to Yellowpaper to learn more ➝
    </div>
    <div class="process">
      <img :src="processImage" />
    </div>
  </div>
</template>

<script>
import { isHomePageMobile } from '../../../composition/hooks'
export default {
  inject: ['handlerClickJump'],
  props: {
    processImage: {
      type: String,
      default: '',
    },
    titleBg: {
      type: String,
      default: '',
    },
  },
  computed: {
    isHomePageMobile () {
      return isHomePageMobile.value
    },
  },
}
</script>

<style scoped lang="scss">
.works-wrap {
  width: 100%;
  box-sizing: border-box;
  padding: 122px 0 120px 0;
  margin: 0 auto;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  opacity: 0;
  justify-content: center;
}
.title {
  font-size: 40px;
  width: max-content;
  margin: 0 auto;
  font-family: 'Kodchasan-Bold';
  font-weight: bold;
  background-repeat: no-repeat;
  background-size: 120px 16px;
  background-position: right bottom;
  color: #222222;
}
.desc {
  font-size: 16px;
  width: 1200px;
  margin: 0 auto;
  margin-top: 25px;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-weight: 400;
  color: #666666;
}
.learn-more {
  margin-top: 24px;
  font-size: 18px;
  cursor: pointer;
  font-family: GeneralSans-SemiBold, OpenSansRoman;
  font-weight: 600;
  color: #df2e2d;
}
.process {
  margin-top: 32px;
  width: 100%;
  height: 692px;
  img {
    width: 100%;
    height: 100%;
  }
}
@media (max-width: 1240px) {
  .works-wrap {
    padding: 32px 16px 36px 16px;
    .title {
      height: 37px;
      margin: 0 auto;
      text-align: center;
      background-size: 86px 9px;
      font-size: 28px;
    }
    .desc {
      font-size: 14px;
      max-width: 350px;
    }
    .learn-more {
      margin-top: 32px;
    }
    .process {
      margin-top: 24px;
      height: auto;
      img {
        width: 100%;
        height: 206px;
      }
    }
  }
}
</style>
