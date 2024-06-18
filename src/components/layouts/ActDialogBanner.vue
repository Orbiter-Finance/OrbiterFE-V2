<template>
  <div v-if="!!bannerList.length" class="act-dialog-banner">
    <div class="title">More: Partners' Incentives</div>
    <el-carousel :interval="4000" trigger="click" height="110px">
      <el-carousel-item v-for="(item, index) in bannerList" :key="index">
        <div
          @click="openUrl(item)"
          class="carousel-item-bg-img"
          :style="`background: url(${require('../../assets/activity/banner/' +
            item.img)});background-size: 100% 100%;`"
        ></div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import getUTCTime from '../../util/time'

export default {
  name: 'ActDialogBanner',
  data() {
    return {
      bannerList: [
        {
          url: 'https://t.me/catizenbot?start=we_2205992_4',
          img: 'catizenbot.png',
          name: 'catizenbot',
          timeStamp: '2024/07/01 09:00:00',
        },
        // {
        //   url: 'https://kzco.in/',
        //   img: 'zksync.png',
        //   name: 'Bridge from/to zkSync',
        //   timeStamp: '2024/06/19 18:00:00',
        // },
      ].filter((item) => +new Date(item.timeStamp) >= getUTCTime()),
    }
  },
  methods: {
    openUrl(item) {
      try {
        this.$gtag.event('banner-' + item.name, {
          event_category: item.name,
          event_label: item.url,
        })
      } catch (error) {}
      window.open(item.url, '_blank')
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-carousel__indicators--horizontal {
  /*position: absolute;*/
  /*bottom: 5px;*/
  /*text-align: right;*/

  .el-carousel__indicator--horizontal button {
    width: 6px;
    height: 6px;
    background: #ffffff;
    border-radius: 50%;
    opacity: 0.5;
  }

  .el-carousel__indicator--horizontal.is-active button {
    width: 14px;
    height: 6px;
    background: #ffffff;
    opacity: 1;
    border-radius: 10px;
  }
}

.act-dialog-banner {

  padding: 16px 0;

  .title {
    width: 187px;
    height: 18px;
    overflow-wrap: break-word;
    color: #222222;
    font-size: 14px;
    font-family: Kodchasan-Bold;
    font-weight: 700;
    text-align: left;
    white-space: nowrap;
    line-height: 18px;
    margin-left: 16px;
  }
}

.carousel-item-bg-img {
  cursor: pointer;
  border-radius: 8px;
  width: 388px;
  height: 104px;
  margin-left: 16px;
  margin-top: 8px;
}

@media (max-width: 820px) {
  .carousel-item-bg-img {
    width: 91.5%;
  }
}


.dark-theme {
  .title {
    color: rgba(255, 255, 255, 1);
  }
}
</style>
