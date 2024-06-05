<template>
  <div class="stage1-wrap">
    <div class="left-content">
      <div class="title">
        <img :src="stageTitleImg" />
      </div>
      <div class="info" :style="{ 'background-image': `url(${titleBg}` }">
        Cross-rollup<br />
        Bridge Protocol
      </div>
      <div class="desc">
        Leveraging a decentralised solution, we've constructed a cross-rollup
        protocol that accomplishes safe, cost-effective, and high-speed transfer
        of messages or assets.
      </div>
      <div class="start-bridge" @click="handlerClickJump">
        Start the seamless cross-rollup transaction ➝
      </div>
    </div>
    <div class="img-content">
      <img :src="stageImage" />
    </div>
  </div>
</template>

<script>
import { isHomePageMobile } from '../../../composition/hooks'
export default {
  inject: ['handlerClickJump'],
  props: {
    stageTitleImg: {
      type: String,
      default: '',
    },
    stageImage: {
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
.stage1-wrap {
  width: 100%;
  height: 680px;
  text-align: left;
  background: #f5f5f5;
  padding: 76px 0 120px 0;
  box-sizing: border-box;
  align-items: center;
  display: flex;
  justify-content: center;
}

.left-content {
  display: flex;
  max-width: 480px;
  flex-direction: column;
  margin-right: 132px;
}

.title {
  width: 295px;
  height: 87px;
  font-size: 20px;
  font-family: 'Kodchasan-SemiBold';
  font-weight: 600;
  color: white;
  img {
    width: 100%;
    height: 100%;
  }
}

.info {
  margin-top: 4px;
  width: 531px;
  height: 144px;
  font-size: 56px;
  font-family: 'Kodchasan-Bold';
  font-weight: bold;
  color: #222222;
  background-repeat: no-repeat;
  line-height: 72px;
  background-size: 461px 22px;
  background-position: left bottom;
}

.desc {
  margin-top: 30px;
  color: #666666;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-weight: 400;
  color: #666666;
  line-height: 22px;
}

.start-bridge {
  max-width: 480px;
  height: 24px;
  margin-top: 102px;
  cursor: pointer;
  font-size: 18px;
  font-family: GeneralSans-SemiBold, OpenSansRoman;
  font-weight: 600;
  color: #df2e2d;
  line-height: 24px;
}
.img-content {
  width: 475px;
  height: 461px;
  img {
    width: 100%;
    height: 100%;
  }
}
@media (max-width: 1240px) {
  .stage1-wrap {
    padding: 24px 12px 32px 12px;
    position: relative;
    flex-direction: column;
    .left-content {
      margin-right: 0;
      width: 100%;
    }
    .title {
      width: 100%;
      height: 48px;
      img {
        width: 180px;
        height: 100%;
      }
    }
    .info {
      width: 100%;
      font-size: 36px;
      line-height: 47px;
      height: auto;
      padding: 0 4px;
      box-sizing: border-box;
      background-size: 291px 14px;
    }
    .desc {
      margin-top: 12px;
      margin-bottom: 24px;
      padding: 0 4px;
      box-sizing: border-box;
    }
    .img-content {
      width: 333px;
      height: 322px;
      padding-left: 10px;
      padding-right: 24px;
      box-sizing: border-box;
    }
    .start-bridge {
      width: calc(100% - 24px);
      position: absolute;
      margin: 0 auto;
      text-align: center;
      bottom: 22px;
      font-size: 14px;
    }
  }
}
</style>
