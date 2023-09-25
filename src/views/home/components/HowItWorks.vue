<template>
  <div class="works-wrap fade-content">
    <div class="title" :style="{ 'background-image': `url(${titleBg}` }">
      How it works
    </div>
    <div class="desc">
      Be optimism for the obedient majority and take severe arbitration for
      malicious minority.<br />
      All protocols deploys on the main network, fully inheriting the security
      of the main network, so as to ensure efficient and secure communication.
      <br />Define the validity of the cross-rollup communication, that
      zk-SNARKs play an important role in validity proofs.
    </div>
    <div class="learn-more" @click="handlerClickJump">
      Learn more in yellowpaper ➝
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
  margin-top: 25px;
  font-size: 16px;
  font-family: OpenSans-Regular, OpenSans;
  font-weight: 400;
  color: #666666;
}
.learn-more {
  margin-top: 24px;
  font-size: 18px;
  cursor: pointer;
  font-family: OpenSansRoman-SemiBold, OpenSansRoman;
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
      width: 184px;
      height: 37px;
      margin: 0 auto;
      background-size: 86px 9px;
      font-size: 28px;
    }
    .desc {
      font-size: 14px;
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
