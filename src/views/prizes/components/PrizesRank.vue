<template>
  <div id="prizes-rank" class="prizes-rank">
    <div class="title">Leaderboard Top 100 Users</div>
    <div class="rank-top">
      <div
        :class="'rank-top-' + item.rank"
        :key="item.rank"
        v-for="item in rankTopData"
        class="rank-top-card"
      >
        <div class="tx-amount">
          <span class="tx-label">Cumulative </span>
          {{ item.tx }} tx
        </div>
        <div class="rank-top-image-group">
          <div class="rank-top-img"></div>
        </div>
        <div class="rank-user-address">{{ item.address }}</div>
        <div class="reward-label">Estimated earnings</div>
        <div
          class="reward-amount reward-amount-default"
          :style="`color: ${item.color};background-image: ${item.bg};`"
        >
          {{ item.reward }}
        </div>
      </div>
      <div class="rank-top-bg"></div>
    </div>
    <div class="rank-top-mobile">
      <div
        class="rank-top-mobile-item"
        v-for="item in rankTopMobileData"
        :key="item.ranl"
        :style="item.style"
      >
        <div class="rank-mobile-left">
          <img
            class="rank-logo"
            :src="`${require('../../../assets/prizes/rank-top-' +
              item.rank +
              '.png')}`"
            alt=""
          />
          <div class="rank-user-info">
            <div class="user-tx">
              Cumulative <span class="user-tx-amount">{{ item.tx }} tx</span>
            </div>
            <div class="user-info-address">{{ item.address }}</div>
          </div>
        </div>
        <div class="rank-user-reward">
          <div class="user-reward-label">Estimated earnings</div>
          <div
            class="user-reward-amount"
            :style="`color: ${item.color};background-image: ${item.bg};`"
          >
            {{ item.reward }}
          </div>
        </div>
      </div>
      <div class="rank-top-mobile-bg"></div>
    </div>
    <div class="rank-list">
      <div class="rank-list-header rank-list-card-item">
        <div class="ranking">Rank</div>
        <div class="user-address">User</div>
        <div class="cumulative-tx">Total Transaction</div>
        <div class="emit-reward">Estimated earnings</div>
      </div>
      <div
        class="rank-list-item rank-list-card-item"
        v-for="(item, index) in rankData"
        :key="index"
      >
        <div class="ranking">{{ item.rank }}</div>
        <div class="user-address">{{ shortAddress(item.address, isMobile ? 4 : 6) }}</div>
        <div class="cumulative-tx">
          {{ decimalNumC(item.count, 0, ',') }} tx
        </div>
        <div class="emit-reward">
          +${{ decimalNumC(item.reward, 2, ',') }} USDC
        </div>
      </div>
      <div class="pagination-group">
        <el-pagination
          @current-change="curChange"
          class="rank-pagination"
          layout="prev, pager, next"
          :current-page="1"
          :total="len"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { isMobile } from '../../../composition/hooks';
import { decimalNum } from '../../../util/decimalNum'

export default {
  name: 'PrizesRank',
  props: {
    rankList: Array,
  },

  data() {
    return {
      current: 1,
    }
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
    rankTopData() {
      const [first, next, last] = this.rankList?.slice(0, 3) || []
      return [
        {
          tx: this.decimalNumC(next?.count, 0, ','),
          address: this.shortAddress(next?.address),
          reward: Number(next?.reward)
            ? `${this.decimalNumC(next?.reward, 2, ',', "$")} USDC`
            : '--',
          rank: '2',
          bg: 'linear-gradient(180.00deg, rgb(211, 253, 255),rgb(157, 211, 211))',
        },
        {
          tx: this.decimalNumC(first?.count, 0, ','),
          address: this.shortAddress(first?.address),
          reward: Number(first?.reward)
            ? `${this.decimalNumC(first?.reward, 2, ',', "$")} USDC`
            : '--',
          rank: '1',
          bg: 'linear-gradient(180.00deg, rgb(255, 212, 151),rgb(255, 166, 41))',
        },
        {
          tx: this.decimalNumC(last?.count, 0, ','),
          address: this.shortAddress(last?.address),
          reward: Number(last?.reward)
            ? `${this.decimalNumC(last?.reward, 2, ',', "$")} USDC`
            : '--',
          rank: '3',
          bg: 'linear-gradient(180.00deg, rgb(255, 207, 168),rgb(197, 133, 81))',
        },
      ]
    },
    rankTopMobileData() {
      const [next, first, last] = this.rankTopData || []
      return [
        {
          ...(first || {}),
          style: `box-shadow: inset 0px 0px 34px 0px rgba(243, 169, 19, 0.4);
                background: linear-gradient(180.00deg, rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0) 105%);`,
        },
        {
          ...(next || {}),
          style: `box-shadow: inset 0px 0px 34px 0px rgba(211, 253, 255, 0.4);
                background: rgba(0, 0, 0, 0.1);`,
        },
        {
          ...(last || {}),
          style: `box-shadow: inset 0px 0px 34px 0px rgba(174, 78, 0, 0.4);
                background: rgba(0, 0, 0, 0.1);`,
        },
      ]
    },
    len() {
      return this.rankList?.length || 0
    },
    rankData() {
      let idx = this.current
      idx = idx > 0 ? idx - 1 : 0
      const len = idx * 10
      return this.rankList.slice(len, len + 10)
    },
  },
  methods: {
    curChange(cur) {
      this.current = cur
    },
    decimalNumC(num, decimal, delimiter, symbol) {
      return decimalNum(num, decimal, delimiter, symbol)
    },
    shortAddress(address, splitN = 6) {
      if (address?.length >= splitN * 2) {
        const first = address.slice(0, splitN)
        const last = address.slice(address?.length - splitN)
        return first + '...' + last
      }
      return ''
    },
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
    z-index: 0;

    .rank-top-card {
      width: 240px;
      height: 320px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      .tx-amount {
        width: 100%;
        margin-top: 20px;
        .tx-label {
          color: rgba(255, 255, 255, 0.6);
        }
      }
      .rank-top-image-group {
        width: 100%;
        margin: 10px 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .rank-user-address {
        width: 100%;
        font-size: 18px;
        font-weight: 500;
        text-align: center;
      }
      .reward-label {
        margin-top: 16px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
      }
      .reward-amount {
        font-size: 28px;
        font-weight: 600;
        line-height: -1px;
        letter-spacing: 0px;
      }

      .reward-amount-default {
        -webkit-text-fill-color: transparent;
        background-position-x: initial;
        background-position-y: initial;
        background-size: initial;
        background-repeat-x: initial;
        background-repeat-y: initial;
        background-attachment: initial;
        background-origin: initial;
        -webkit-background-clip: text;
        background-color: initial;
      }
    }

    .rank-top-1 {
      background-image: url(../../../assets/prizes/top1.png);
      margin-bottom: 72px;

      .rank-top-img {
        width: 80px;
        height: 80px;
        background-image: url(../../../assets/prizes/rank-top-1.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
      }
    }
    .rank-top-2 {
      background-image: url(../../../assets/prizes/top2.png);
      margin-top: 72px;
      .rank-top-img {
        width: 80px;
        height: 80px;
        background-image: url(../../../assets/prizes/rank-top-2.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
      }
    }
    .rank-top-3 {
      background-image: url(../../../assets/prizes/top3.png);
      margin-top: 72px;
      .rank-top-img {
        width: 80px;
        height: 80px;
        background-image: url(../../../assets/prizes/rank-top-3.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
      }
    }

    .rank-top-bg {
      position: absolute;
      width: 130%;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 50%);
      padding: 20% 0;
      background-image: url(../../../assets/prizes/rank-bg.png);
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      z-index: -1;
    }
  }

  .rank-top-mobile {
    width: 100%;
    margin-top: 12px;
    display: none;
    position: relative;
    top: 0;
    left: 0;
    z-index: 0;
    .rank-top-mobile-item {
      width: 100%;
      padding: 12px;
      margin-top: 12px;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .rank-mobile-left {
        display: flex;
        justify-content: start;
        align-items: center;
        .rank-logo {
          width: 64px;
          height: 64px;
          margin-right: 8px;
        }
        .rank-user-info {
          text-align: left;

          .user-tx {
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
            .user-tx-amount {
              color: #ffffff;
              font-weight: 500;
            }
          }

          .user-info-address {
            margin-top: 8px;
            font-size: 18px;
            font-weight: 500;
          }
        }
      }

      .rank-user-reward {
        text-align: right;

        .user-reward-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .user-reward-amount {
          font-size: 18px;
          font-weight: 600;
          margin-top: 8px;
          -webkit-text-fill-color: transparent;
          background-position-x: initial;
          background-position-y: initial;
          background-size: initial;
          background-repeat-x: initial;
          background-repeat-y: initial;
          background-attachment: initial;
          background-origin: initial;
          -webkit-background-clip: text;
          background-color: initial;
        }
      }
    }

    .rank-top-mobile-bg {
      width: 124%;
      padding: 12%;
      position: relative;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 120%);
      background-image: url(../../../assets/prizes/rank-bg.png);
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      z-index: -1;
      margin-top: -36%;
    }
  }

  .rank-list {
    width: 100%;
    padding: 0 32px;
    background-color: #222222;
    text-align: left;
    border-radius: 16px;
    margin-top: 80px;
    position: relative;

    .rank-list-card-item {
      width: 100%;
      padding: 14px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .ranking {
        width: 64px;
      }

      .user-address {
        width: 30%;
      }

      .cumulative-tx {
        width: 30%;
      }

      .emit-reward {
        flex: 1;
        text-align: right;
      }
    }

    .rank-list-header {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }

    .rank-list-item {
      font-weight: 600;
      .emit-reward {
        color: #ddf600;
      }
    }

    .pagination-group {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding: 14px 0;
    }
  }
}

::v-deep .rank-pagination .btn-next {
  background: transparent;
  color: #5f6166;
}
::v-deep .rank-pagination .el-pager .number {
  background: transparent;
  color: #5f6166;
}
::v-deep .rank-pagination .el-pager .more {
  background: transparent;
  color: #5f6166;
}
::v-deep .rank-pagination .btn-prev {
  background: transparent;
  color: #5f6166;
}

::v-deep .rank-pagination .el-pager .number.active {
  box-sizing: border-box;
  border: 1px solid rgb(239, 47, 45);
  border-radius: 4px;
  box-shadow: inset 0px 0px 34px 0px rgba(239, 47, 45, 0.4);
  backdrop-filter: blur(156px);
  background: rgb(0, 0, 0);
}

@media (max-width: 740px) {
  #prizes-rank {
    margin-top: 32px;
    padding: 0 12px;
    .title {
      font-size: 24px;
    }
    .rank-top {
      display: none;
    }

    .rank-top-mobile {
      display: block;
    }

    .rank-list {
      padding: 0 12px;
      .rank-list-header {
        display: none;
      }
      .rank-list-card-item {
        .ranking {
          width: 40px;
        }
        .cumulative-tx {
          width: 20%;
        }
        .emit-reward {
          white-space: nowrap;
        }
        .ranking, .user-address, .cumulative-tx, .emit-reward {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
