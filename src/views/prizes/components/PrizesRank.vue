<template>
  <div id="prizes-rank" class="prizes-rank">
    <div class="rank-title">
      <div class="rank-tabs">
        <div class="tab1">Rank 1-8 (0 Bridging Fee)</div>
        <div class="tab2">Rank 9-20 (50% Bridging Fee)</div>
      </div>
      <div class="refresh-time">
        update time: {{ calculateRelativeTime(refreshTime) }}
      </div>
    </div>
    <div class="rank-list">
      <div class="rank-list-header rank-list-card-item">
        <div class="ranking">Rank</div>
        <div class="user-address">User</div>
        <div class="cumulative-tx">Total Transaction</div>
        <div class="bridge-fee" v-if="current <= 2">Bridging fee rebate</div>
        <div class="emit-reward">Estimated Earnings</div>
      </div>
      <div
        class="rank-list-item rank-list-card-item"
        v-for="(item, index) in rankData"
        :key="index"
        :style="`background-color:${
          !!(index % 2)
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(255, 255, 255, 0.05)'
        };`"
      >
        <div class="ranking">
          <div :class="'ranking-' + item.rank">{{ item.rank }}</div>
        </div>
        <div class="user-address">
          {{ shortAddress(item.address, isMobile ? 4 : 6) }}
        </div>
        <div class="cumulative-tx">
          {{ decimalNumC(item.txAmount, 0, ',') }} tx

          <!-- <o-tooltip>
            <template v-slot:titleDesc>
              <div style="margin-left: -20px">
                <span
                  >Bridging fee will be rebated when the competition ends.</span
                >
              </div>
            </template>
            <img
              v-if="showBridgeFee(item)"
              class="bridge-fee-image"
              :src="require('../../../assets/prizes/bridge-fee-0.png')"
            />
            <img
              v-if="showBridgeFee50(item)"
              class="bridge-fee-image"
              :src="require('../../../assets/prizes/bridge-fee-50.png')"
            />
          </o-tooltip> -->
        </div>
        <div class="bridge-fee" v-if="current <= 2">{{ bridgingFee(item) }}</div>
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
  prizesRankList,
  prizesUserList,
  prizesUserRank,
  prizesRankRefreshTime,
  prizesTotaltx,
} from '../../../composition/hooks'
import { decimalNum } from '../../../util/decimalNum'
import dayjs from 'dayjs'
let rankA = 8
let rankB = 20
let txBase = 3

export default {
  name: 'PrizesRank',
  data() {
    return {
      current: 1,
      poolList: [
        {
          tx: '0~2,999 Tx',
          reward: '',
          range: [0, 2999],
          bridge50Fee: 0,
          bridge100Fee: 0,
        },
        {
          tx: '3,000~9,999 Tx',
          reward: '$3,500',
          range: [3000, 9999],
          bridge50Fee: 5,
          bridge100Fee: 15,
        },
        {
          tx: '10,000~29,999 Tx',
          reward: '$12,600',
          range: [10000, 29999],
          bridge50Fee: 10,
          bridge100Fee: 30,
        },
        {
          tx: '30,000~54,999 Tx',
          reward: '$35,000',
          range: [30000, 54999],
          bridge50Fee: 20,
          bridge100Fee: 45,
        },
        {
          tx: '55,000~119,999 Tx',
          reward: '$56,000',
          range: [55000, 119999],
          bridge50Fee: 30,
          bridge100Fee: 60,
        },
        {
          tx: '≥120,000 Tx',
          reward: '$70,000',
          range: [120000, 999999],
          bridge50Fee: 50,
          bridge100Fee: 95,
        },
      ],
    }
  },
  computed: {
    currentPool() {
      const list = this.poolList
      const tx = this.totalTx
      if (tx >= list[list.length - 1].range?.[1])
        return list[list.length - 1] || {}
      const group = list.filter((item) => {
        const [first, last] = item.range
        return first <= tx && last >= tx
      })?.[0]
      return group
    },
    totalTx() {
      const tx = Number(prizesTotaltx.value) || 0
      return tx
    },
    refreshTime() {
      return prizesRankRefreshTime.value
    },
    rankList() {
      return prizesRankList.value
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
      return prizesUserList.value
    },
    userRank() {
      return prizesUserRank.value || '--'
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
    calculateRelativeTime(date) {
      if (!date) {
        return '-'
      }
      const diffInMinutes = dayjs().diff(date, 'minute')
      if (diffInMinutes <= 30) {
        return dayjs(date).fromNow()
      } else {
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    showBridgeFee50(group) {
      if (!this.showBridgeFee(group)) {
        const rank = group.rank
        const txAmount = group.txAmount
        return rank <= rankB && txAmount >= txBase
      }
      return false
    },
    showBridgeFee({ rank, txAmount }) {
      return rank <= rankA && txAmount >= txBase
    },
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
    bridgingFee(group) {
      const rank = Number(group?.rank) || 0
      const fee = this.currentPool
      if (rank && rank <= 20) {
        if (rank <= 8) {
          return fee?.bridge100Fee + "%"
        } else {
          return fee?.bridge50Fee + "%"
        }
      }else {
        return ""
      }
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
  margin-top: 56px;

  .rank-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .rank-tabs {
      font-size: 18px;
      font-weight: 500;
      line-height: 20px;
      letter-spacing: 0px;
      font-family: GeneralSans-Medium;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .tab1 {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 248px;
        height: 52px;
        background: linear-gradient(
          -3.03deg,
          rgb(255, 21, 0) 42.396%,
          rgb(255, 238, 185) 156.936%
        );
        clip-path: polygon(
          8px 0,
          0 8px,
          0 calc(100% - 8px),
          8px 100%,
          100% 100%,
          calc(100% - 8px) calc(100% - 8px),
          calc(100% - 8px) 8px,
          100% 0
        );
      }
      .tab2 {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 300px;
        height: 52px;
        margin-left: 8px;
        background: linear-gradient(
          -45deg,
          rgb(21, 67, 84) 37.809%,
          rgb(255, 21, 0) 117.206%
        );
        clip-path: polygon(
          8px 0,
          0 8px,
          0 calc(100% - 8px),
          8px 100%,
          100% 100%,
          calc(100% - 8px) calc(100% - 8px),
          calc(100% - 8px) 8px,
          100% 0
        );
      }
    }
    .refresh-time {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .rank-list {
    width: 100%;
    text-align: left;
    margin-top: 24px;
    position: relative;
    border-radius: 16px;

    background: linear-gradient(
        -3.58deg,
        rgba(15, 34, 37, 0.2) 60.731%,
        rgba(209, 112, 85, 0.2) 102.158%
      ),
      rgb(15, 34, 37);

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
        width: 26%;
      }

      .cumulative-tx {
        width: 26%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .bridge-fee-image {
          margin-left: 4px;
          width: 95px;
          height: 20px;
        }
      }

      .bridge-fee {
        width: 26%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
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
      background: rgba(255, 255, 255, 0.05);
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
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.4);
  margin: 0 4px;
}
::v-deep .rank-pagination .el-pager .number {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.4);
  margin: 0 4px;
}
::v-deep .rank-pagination .el-pager .more {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.4);
  margin: 0 4px;
}
::v-deep .rank-pagination .btn-prev {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.4);
  margin: 0 4px;
}

::v-deep .rank-pagination .el-pager .number.active {
  width: 30px;
  height: 30px;
  padding: 0;
  box-sizing: border-box;
  border: 1px solid rgb(255, 79, 79);
  border-radius: 4px;
  background: rgb(1, 1, 1);
  color: #ff4f4f;
  margin: 0 4px;
}

@media (max-width: 740px) {
  #prizes-rank {
    margin-top: 32px;
    padding: 0;
    .rank-title {
      display: block;
      .rank-tabs {
        .tab1 {
          height: 32px;
          font-size: 12px;
        }
        .tab2 {
          height: 32px;
          font-size: 12px;
        }
      }
      .refresh-time {
        width: 100%;
        margin-top: 8px;
      }
    }

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
      margin-top: 24px;
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
