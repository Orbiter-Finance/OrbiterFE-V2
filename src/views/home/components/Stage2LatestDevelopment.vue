<template>
  <div class="development-wrap fade-content">
    <div class="info-wrap">
      <div class="title" :style="{ 'background-image': `url(${titleBg}` }">
        Latest<br />
        development .
      </div>
      <div class="desc">
        AA accounts are Ethereum’s future account . We Accelerate AA Mass
        Adoption and Reduced users’ cost for AA adoption.
      </div>
      <div class="learn-more" @click="handlerClickJump">
        Learn more about AA zkprover SDK ➝
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
  background-size: 367px;
}
.desc {
  max-width: 430px;
  margin-top: 26px;
  font-size: 18px;
  margin-top: 30px;
  font-family: OpenSans-Regular, OpenSans;
  font-weight: 400;
  color: #666666;
}
.learn-more {
  font-size: 18px;
  margin-top: 120px;
  font-family: OpenSansRoman-SemiBold, OpenSansRoman;
  font-weight: 600;
  color: #df2e2d;
  cursor: pointer;
}
.sdk-image {
  width: 653px;
  height: 532px;
  margin-left: 149px;
  img {
    width: 100%;
    height: 100%;
  }
}
@media (max-width: 1240px) {
  .development-wrap {
    margin-top: 80px;
    padding: 0 16px 0 16px;
    flex-direction: column;
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
      width: 358px;
      height: 256px;
    }
  }
}
</style>
