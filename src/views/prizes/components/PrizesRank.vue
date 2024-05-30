<template>
  <div id="prizes-rank" class="prizes-rank">
    <div class="title">Top 100 Users</div>
    <div class="rank-top">
      <div
        :class="'rank-top-' + item.rank"
        :key="item.rank"
        v-for="item in rankTopData"
      ></div>
      <div class="rank-top-bg">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrizesRank',
  data() {
    return {
      rankTopData: [
        {
          tx: '120',
          address: '0x024a...49ac41',
          reward: '$900 USDC',
          rank: "2"
        },
        {
          tx: '320',
          address: '0x024a...49ac41',
          reward: '$1500 USDC',
          rank: "1"
        },
        {
          tx: '83',
          address: '0x024a...49ac41',
          reward: '$600 USDC',
          rank: "3"
        },
      ],
    }
  },
}
</script>

<style scoped lang="scss">
.prizes-rank {
  width: 100%;
  margin-top: 64px;
  .title {
    width: 100%;
    font-size: 32px;
    font-weight: 600;
    line-height: 44px;
    letter-spacing: 0px;
    text-align: center;
  }

  .rank-top {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    margin-top: 32px;
    position: relative;
    top: 0;
    left: 0;

    .rank-top-1 {
        width: 240px;
        height: 320px;
        background-image: url(../../../assets/prizes/top1.png);
        margin-bottom: 72px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
      }
      .rank-top-2 {
        width: 240px;
        height: 320px;
        background-image: url(../../../assets/prizes/top2.png);
        margin-top: 72px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
      }
      .rank-top-3 {
        width: 240px;
        height: 320px;
        background-image: url(../../../assets/prizes/top3.png);
        margin-top: 72px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
      }

    .rank-top-bg {
        position: absolute;
        width: 130%;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 12%);
        padding: 8% 0;
        background-image: url(../../../assets/prizes/rank-bg.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
    }
  }
  
}
</style>
