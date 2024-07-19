<template>
  <div id="prizes-rank" class="prizes-rank">
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
          +{{ decimalNumC(Number(item.reward) || 0, 4, ',') }}
          {{ item.symbol }}
        </div>
        <div
          class="reward-total-amount"
          :style="`color: ${item.color};background-image: ${item.bg};`"
        >
          ≈ ${{ decimalNumC(item.uAmount, 4, ',') }}
        </div>
      </div>
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
            :src="`${require('../../../assets/prizes/v2/rank-top-' +
              item.rank +
              '.png')}`"
            alt=""
          />
          <div class="rank-user-info">
            <div class="user-tx">
              Cumulative
              <span class="user-tx-amount">{{ item.txAmount }} tx</span>
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
            +{{ decimalNumC(Number(item.reward) || 0, 4, ',') }}
            {{ item.symbol }}
          </div>
        </div>
      </div>
    </div>
    <div class="rank-list">
      <div class="rank-list-header rank-list-card-item">
        <div class="ranking">Rank</div>
        <div class="user-address">User</div>
        <div class="cumulative-tx">
          Total Transaction
        </div>
        <div class="emit-reward">Estimated earnings</div>
      </div>
      <div class="rank-list-item rank-list-card-item rank-user-item">
        <div class="ranking">
          <div>{{ userRank }}</div>
        </div>
        <div class="user-address">My Account</div>
        <div class="cumulative-tx">
          {{ decimalNumC(txTotal, 0, ',') }} tx
          <img
            v-if="Number(userRank) <= 10"
            class="bridge-fee-image"
            :src="require('../../../assets/prizes/v2/bridge-fee.png')"
          />
        </div>
        <div class="emit-reward">
          <div>
            {{ estiReward }}
          </div>
        </div>
      </div>
      <div
        class="rank-list-item rank-list-card-item"
        v-for="(item, index) in rankData"
        :key="index"
        :style="`background-color:${!!(index % 2) ? '#010101' : '#222222'};`"
      >
        <div class="ranking">
          <div :class="'ranking-' + item.rank">{{ item.rank }}</div>
        </div>
        <div class="user-address">
          {{ shortAddress(item.address, isMobile ? 4 : 6) }}
        </div>
        <div class="cumulative-tx">
          {{ decimalNumC(item.txAmount, 0, ',') }} tx

          <o-tooltip>
            <template v-slot:titleDesc>
              <div style="margin-left: -20px">
                <span >Bridging fee will be rebated when the competition ends.</span
                >
              </div>
            </template>
            <img
            v-if="Number(item.rank) <= 10"
            class="bridge-fee-image"
            :src="require('../../../assets/prizes/v2/bridge-fee.png')"
          />
          </o-tooltip>
          
        </div>
        <div class="emit-reward">
          <div>
            +{{ decimalNumC(Number(item.reward.amount) || 0, 4, ',') }}
            {{ item.reward.name }}
          </div>
          <span>≈ ${{ decimalNumC(item.reward.uAmount, 4, ',') }}</span>
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
import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'
import {
  isMobile,
  prizesV2RankList,
  prizesV2UserList,
  prizesV2UserRank,
} from '../../../composition/hooks'
import { decimalNum } from '../../../util/decimalNum'

export default {
  name: 'PrizesRank',
  data() {
    return {
      current: 1,
    }
  },
  computed: {
    rankList() {
      return prizesV2RankList.value
    },
    isMobile() {
      return isMobile.value
    },
    rankTopData() {
      const [first, next, last] = this.rankList?.slice(0, 3) || []
      return [
        {
          tx: this.decimalNumC(next?.txAmount, 0, ','),
          address: this.shortAddress(next?.address, this.isMobile ? 4 : 6),
          reward: next?.reward?.amount || 0,
          uAmount: next?.reward?.uAmount || 0,
          rank: '2',
          bg: 'linear-gradient(180.00deg, rgb(232, 235, 237),rgb(157, 211, 211))',
          color: 'rgba(192, 238, 239, 0.6)',
          symbol: next?.reward?.name || '',
          refund: next?.refund || 0,
        },
        {
          tx: this.decimalNumC(first?.txAmount, 0, ','),
          address: this.shortAddress(first?.address, this.isMobile ? 4 : 6),
          reward: first?.reward?.amount || 0,
          uAmount: first?.reward?.uAmount || 0,
          rank: '1',
          bg: 'linear-gradient(0.00deg, rgb(255, 195, 17),rgb(243, 232, 66))',
          color: 'rgba(255, 209, 102, 0.6)',
          symbol: first?.reward?.name || '',
          refund: first?.refund || 0,
        },
        {
          tx: this.decimalNumC(last?.txAmount, 0, ','),
          address: this.shortAddress(last?.address, this.isMobile ? 4 : 6),
          reward: last?.reward?.amount || 0,
          uAmount: last?.reward?.uAmount || 0,
          rank: '3',
          bg: 'linear-gradient(180.00deg, rgb(255, 207, 168),rgb(197, 133, 81))',
          color: 'rgba(232, 178, 134, 0.6)',
          symbol: last?.reward?.name || '',
          refund: last?.refund || 0,
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
    userList() {
      return prizesV2UserList.value
    },
    userRank() {
      return prizesV2UserRank.value || '--'
    },
    txTotal() {
      const list = this.userList
      const total = list?.reduce((prev, item) => {
        return prev + Number(item?.task_result || 0)
      }, 0)
      return total
    },
    evmAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress || ''
    },
    estiReward() {
      const list = this.rankList
      const option = list.filter(
        (item) =>
          item.address?.toLocaleLowerCase() ===
          this.evmAddress?.toLocaleLowerCase()
      )?.[0]
      const amount = option?.reward?.amount
      const symbol = option?.reward?.name
      return Number(amount)
        ? `${this.decimalNumC(amount, 2, ',')}  ${symbol}`
        : '--'
    },
    userAddress() {
      const address = this.evmAddress
      return address ? shortenAddress(address) : '--'
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
.thumbnail_1_3 {
  width: 16px;
  height: 16px;
  circle {
    fill: rgba(255, 255, 255, 0.6) !important;
  }
}
.prizes-rank {
  width: 100%;
  margin-top: 44px;

  .rank-top {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
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
        margin-top: 44px;
        .tx-label {
          color: rgba(255, 255, 255, 0.6);
        }
      }
      .rank-top-image-group {
        width: 100%;
        margin: 16px 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .rank-user-address {
        width: 100%;
        font-size: 24px;
        font-family: GeneralSans-Medium;
        text-align: center;
      }
      .reward-label {
        margin-top: 8;
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.6);
      }
      .reward-amount {
        font-size: 28px;
        font-family: GeneralSans-SemiBold;
        line-height: -1px;
        letter-spacing: 0px;
      }

      .reward-total-amount {
        font-size: 14px;
        font-family: GeneralSans-Medium;
        line-height: 20px;
        letter-spacing: 0px;
        margin-top: 4px;

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
      width: 320px;
      height: 440px;
      padding-top: 24px;
      background-image: url(../../../assets/prizes/v2/top1.png);
      .rank-top-img {
        width: 120px;
        height: 120px;
        background-image: url(../../../assets/prizes/v2/rank-top-1.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
      }
    }
    .rank-top-2 {
      width: 320px;
      height: 400px;
      background-image: url(../../../assets/prizes/v2/top2.png);
      .rank-top-img {
        width: 96px;
        height: 96px;
        background-image: url(../../../assets/prizes/v2/rank-top-2.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
      }
    }
    .rank-top-3 {
      width: 320px;
      height: 400px;
      background-image: url(../../../assets/prizes/v2/top3.png);
      .rank-top-img {
        width: 96px;
        height: 96px;
        background-image: url(../../../assets/prizes/v2/rank-top-3.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
      }
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
              font-family: GeneralSans-Medium;
            }
          }

          .user-info-address {
            margin-top: 8px;
            font-size: 18px;
            font-family: GeneralSans-Medium;
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
          font-family: GeneralSans-SemiBold;
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
  }

  .rank-list {
    width: 100%;
    text-align: left;
    margin-top: 48px;
    position: relative;
    border: 1px solid rgba(243, 223, 47, 0.3);
    background: rgb(1, 1, 1);

    .rank-user-item {
      background: rgba(248, 217, 46, 0.1);
    }

    .rank-list-card-item {
      width: 100%;
      padding: 14px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .ranking {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 64px;
      }

      .user-address {
        width: 30%;
      }

      .cumulative-tx {
        width: 30%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .bridge-fee-image {
          width: 95px;
          height: 20px;
        }
      }

      .emit-reward {
        flex: 1;
        text-align: right;
      }
    }

    .ranking-1 {
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(
        180deg,
        rgb(255, 222, 155),
        rgb(243, 169, 19) 100%
      );
      border-radius: 50%;
      width: 32px;
      height: 32px;
      color: #000000;
    }

    .ranking-2 {
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(
        180deg,
        rgb(240, 254, 255),
        rgb(190, 190, 190) 100%
      );
      border-radius: 50%;
      width: 32px;
      height: 32px;
      color: #000000;
    }

    .ranking-3 {
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(
        180deg,
        rgb(233, 179, 135),
        rgb(197, 133, 81) 100%
      );
      border-radius: 50%;
      width: 32px;
      height: 32px;
      color: #000000;
    }

    .rank-list-header {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      background-color: #010101;
    }

    .rank-list-item {
      font-family: GeneralSans-SemiBold;
      height: 76px;
      .emit-reward {
        color: #ffd166;
        span {
          font-size: 14px;
          color: rgba(#ffd166, 0.6);
        }
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
  background: #222222;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 4px;
}
::v-deep .rank-pagination .el-pager .number {
  background: #222222;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 4px;
}
::v-deep .rank-pagination .el-pager .more {
  background: #222222;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 4px;
}
::v-deep .rank-pagination .btn-prev {
  background: #222222;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 4px;
}

::v-deep .rank-pagination .el-pager .number.active {
  width: 30px;
  height: 30px;
  padding: 0;
  box-sizing: border-box;
  border: 1px solid rgb(243, 186, 47);
  border-radius: 4px;
  background: rgb(1, 1, 1);
  color: #f3ba2f;
  margin: 0 4px;
}

@media (max-width: 740px) {
  #prizes-rank {
    margin-top: 32px;
    padding: 0;
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
      margin-top: 36px;
      .rank-list-header {
        display: none;
      }
      .rank-list-item {
        height: 54px;
      }
      .rank-list-card-item {
        padding: 6px 12px;
        .ranking {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
        }
        .cumulative-tx {
          width: 30%;
          display: block;
          .bridge-fee-image {
            width: 72px;
            height: 16px;
          }
        }
        .emit-reward {
          white-space: nowrap;
        }
        .ranking,
        .user-address,
        .cumulative-tx,
        .emit-reward {
          font-size: 14px;
          span {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
