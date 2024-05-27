<template>
  <div class="ecosystem-info-details">
    <div class="top">
      <div class="logo">
        <img
          class="image"
          :src="require('../../../assets/ecosystem/ecosystem-logo.png')"
        />
        <div class="logo-label">Bullishs</div>
      </div>
      <div class="media">
        <div class="meida-icon" v-for="item in mediaList" :key="item.icon">
          <img :src="require(`../../../assets/ecosystem/${item.icon}.svg`)" />
        </div>
      </div>
    </div>
    <div class="title">500,000 $Bullish Giveaway🔥</div>
    <div class="descrition">
      Solana is a blockchain built for mass adoption. This season of Cryptopedia
      collect...
    </div>
    <div class="tag">
      <div class="amount">🪂 500,000 $BLS</div>
      <div class="time">⏰ Dec. 21 - Jan. 10</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EcosystemInfoDetails',
  data() {
    return {
      mediaList: [
        {
          icon: 'media-network',
        },
        {
          icon: 'media-x',
        },
        {
          icon: 'media-discord',
        },
        {
          icon: 'media-telegram',
        },
      ],
    }
  },
}
</script>

<style scoped lang="scss">
.ecosystem-info-details {
  width: 100%;
  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo {
      display: flex;
      justify-content: start;
      align-items: center;
      .image {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 12px;
      }
      .logo-label {
        color: rgb(34, 34, 34);
        font-size: 20px;
        font-weight: 700;
        line-height: 28px;
        letter-spacing: 0px;
        text-align: left;
      }
    }

    .media {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .meida-icon {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: rgb(238, 238, 238);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 8px;
        cursor: pointer;
      }
    }
  }

  .title {
    margin-top: 16px;
    width: 100%;
    color: rgb(34, 34, 34);
    font-size: 28px;
    font-weight: 700;
    line-height: 38px;
    letter-spacing: 0px;
    text-align: left;
  }

  .descrition {
	margin-top: 4px;
    color: rgb(102, 102, 102);
    font-family: OpenSansRoman-Regular;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
  }

  .tag {
    width: 100%;
    margin-top: 16px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    font-family: OpenSansRoman-Regular;

    .amount {
      padding: 3px 12px;
      border: 1px solid rgb(255, 193, 89);
      border-radius: 12px;
      background: linear-gradient(
        138.33deg,
        rgb(255, 252, 227) 5.444%,
        rgb(255, 167, 60) 94.989%
      );
    }

    .time {
      margin-left: 16px;
      padding: 3px 12px;
      border: 1px solid rgb(182, 182, 182);
      border-radius: 12px;
      background: rgb(238, 238, 238);
    }
  }
}
</style>
