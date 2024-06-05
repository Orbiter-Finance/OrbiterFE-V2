<template>
  <div class="development-wrap fade-content">
    <div class="info-wrap">
      <div class="title" :style="{ 'background-image': `url(${titleBg}` }">
        Latest<br />Breakthrough
      </div>
      <div class="desc">
        AA represent the future of Ethereum's account system. We are actively
        promoting AA mass adoption while also minimising the expenses associated
        with AA integration for users, resulting in gas savings of up to 30%.
      </div>
      <div class="learn-more" @click="handlerClickJump">
        Learn more about the SDK of zkProver ➝
      </div>
    </div>
    <div class="sdk-image fade-content">
      <img :src="developmentImg" />
    </div>
  </div>
</template>

<script>
export default {
  inject: ['handlerClickJump'],
  props: {
    developmentImg: {
      type: String,
      default: '',
    },
    titleBg: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      targetList: [
        {
          icon: '',
          label: 'Real-time',
          desc: 'inter-chain interoperability',
        },
        {
          icon: '',
          label: 'Low-cost',
          desc: 'Worthless Fees of universal service',
        },
        {
          icon: '',
          label: 'Scalability',
          desc: 'Etheruem + rollups synchronously',
        },
      ],
    }
  },
}
</script>

<style scoped lang="scss">
.development-wrap {
  box-sizing: border-box;
  background: #f5f5f5;
  opacity: 0;
  display: flex;
  text-align: left;
  padding-top: 120px;
  padding-bottom: 100px;
  margin: 0 auto;
  width: min-content;
}
.info-wrap {
  padding-top: 123px;
}
.title {
  width: 430px;
  font-size: 56px;
  font-family: 'Kodchasan-Bold';
  font-weight: bold;
  color: #222222;
  background-repeat: no-repeat;
  background-position-y: bottom;
  background-size: 399px 20px;
}
.desc {
  max-width: 430px;
  margin-top: 26px;
  font-size: 18px;
  margin-top: 30px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-weight: 400;
  color: #666666;
}
.learn-more {
  font-size: 18px;
  margin-top: 120px;
  font-family: GeneralSans-SemiBold, OpenSansRoman;
  font-weight: 600;
  color: #df2e2d;
  cursor: pointer;
}
.sdk-image {
  width: 653px;
  height: 532px;
  margin-left: 120px;
  img {
    width: 100%;
    height: 100%;
  }
}
@media (max-width: 1240px) {
  .development-wrap {
    margin-top: 80px;
    padding: 0;
    flex-direction: column;
    max-width: 350px;
    width: max-content;
    .info-wrap {
      padding-top: 0;
    }
    .title {
      width: 100%;
      font-size: 36px;
      background-size: 241px 10px;
    }
    .desc {
      font-size: 14px;
      margin-top: 20px;
    }
    .learn-more {
      margin-top: 20px;
      font-size: 14px;
    }
    .sdk-image {
      margin-left: 0;
      margin-top: 24px;
      width: 100%;
      height: 256px;
    }
  }
}
</style>
