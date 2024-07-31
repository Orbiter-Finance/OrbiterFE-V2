<template>
  <div class="last-transactions">
    <div class="transaction-title">
      <div class="label">Latest Transactions</div>
    </div>
    <div class="transaction-table">
      <div class="table-header border-b">
        <div class="table-col transaction-box-left">Status</div>
        <div class="table-col transaction-box-left">From/To</div>
        <div class="table-col asset transaction-box-left">Asset</div>
        <div class="table-col amount transaction-box-right">Amount</div>
        <div class="table-col transaction-box-right">Source TX</div>
        <div class="table-col transaction-box-right">Destination TX</div>
        <div class="table-col transaction-box-right">Time</div>
      </div>
      <div v-if="!!loading">
        <div
          v-for="(item, index) in loadingList"
          :key="index"
          class="table-row-loading border-b"
        >
          <div class="table-col transaction-box-left">
            <div class="loading-card">
              <div class="skeleton"></div>
            </div>
          </div>
          <div class="table-col transaction-box-left">
            <div class="loading-card">
              <div class="skeleton"></div>
            </div>
          </div>
          <div class="table-col asset transaction-box-left">
            <div class="loading-card">
              <div class="skeleton"></div>
            </div>
          </div>
          <div class="table-col amount transaction-box-right">
            <div class="loading-card">
              <div class="skeleton"></div>
            </div>
          </div>
          <div class="table-col transaction-box-right">
            <div class="loading-card">
              <div class="skeleton"></div>
            </div>
          </div>
          <div class="table-col transaction-box-right">
            <div class="loading-card">
              <div class="skeleton"></div>
            </div>
          </div>
          <div class="table-col transaction-box-right">
            <div class="loading-card">
              <div class="skeleton"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div
          v-for="item in list"
          :key="item.sourceId"
          class="table-row border-b"
        >
          <div class="table-col transaction-box-left">
            <div>
              <div
                class="pending-card"
                v-if="item.status !== 98 && item.status !== 99"
              >
                <svg
                  class="status-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="16.000000"
                  height="16.000000"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <rect
                    id="vuesax/linear/refresh-2"
                    width="16.000000"
                    height="16.000000"
                    fill="#FFCC2D"
                    fill-opacity="0"
                  />
                  <path
                    id="Vector"
                    d="M14.66 8C14.66 11.67 11.68 14.66 8 14.66C4.32 14.66 2.07 10.96 2.07 10.96M1.33 8C1.33 4.32 4.29 1.33 8 1.33C12.44 1.33 14.66 5.04 14.66 5.04M11.7 5.04L14.66 5.04L14.66 1.7M2.07 14.29L2.07 10.96L5.08 10.96"
                    stroke="#3478F5"
                    stroke-opacity="1.000000"
                    stroke-width="1.000000"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  />
                </svg>
                Pending
              </div>

              <div v-else class="completed-card">
                <svg
                  class="status-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="16.000000"
                  height="16.000000"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle
                    cx="8.000000"
                    cy="8.000000"
                    r="7.500000"
                    stroke="#1EB4AB"
                    stroke-opacity="1.000000"
                    stroke-width="1.000000"
                  />
                  <mask id="mask_2176_1251" fill="white">
                    <path
                      d="M11.1795 5.93555C10.9843 5.74023 10.6677 5.74023 10.4724 5.93555L7.29034 9.11719L5.52106 7.34766C5.32581 7.15234 5.00922 7.15234 4.81396 7.34766C4.61871 7.54297 4.61871 7.85938 4.81396 8.05469L6.9353 10.1758C6.94238 10.1836 6.94965 10.1914 6.95709 10.1973C7.15344 10.373 7.45532 10.3672 7.64398 10.1777L11.1795 6.64258C11.3748 6.44727 11.3748 6.13086 11.1795 5.93555Z"
                      clip-rule="evenodd"
                      fill=""
                      fill-opacity="1.000000"
                      fill-rule="evenodd"
                    />
                  </mask>
                  <path
                    d="M11.1795 5.93555C10.9843 5.74023 10.6677 5.74023 10.4724 5.93555L7.29034 9.11719L5.52106 7.34766C5.32581 7.15234 5.00922 7.15234 4.81396 7.34766C4.61871 7.54297 4.61871 7.85938 4.81396 8.05469L6.9353 10.1758C6.94238 10.1836 6.94965 10.1914 6.95709 10.1973C7.15344 10.373 7.45532 10.3672 7.64398 10.1777L11.1795 6.64258C11.3748 6.44727 11.3748 6.13086 11.1795 5.93555Z"
                    clip-rule="evenodd"
                    fill="#1EB4AB"
                    fill-opacity="1.000000"
                    fill-rule="evenodd"
                    mask="url(#mask_2176_1251)"
                  />
                  <path
                    d=""
                    clip-rule="evenodd"
                    fill="#979797"
                    fill-opacity="0.000000"
                    fill-rule="evenodd"
                  />
                </svg>
                Completed
              </div>
            </div>
          </div>
          <div class="table-col transaction-box-left">
            <svg-icon
              class="token-icon"
              :iconName="item.sourceChain"
            ></svg-icon>
            <svg-icon class="token-icon" iconName="arrow-right"></svg-icon>
            <svg-icon
              class="token-icon"
              :iconName="item.targetChain"
            ></svg-icon>
          </div>
          <div class="table-col asset transaction-box-left">
            <div class="asset-group">
              <svg-icon
                class="token-symbol"
                :iconName="item.sourceSymbol"
              ></svg-icon>
              ETH
            </div>
          </div>
          <div class="table-col amount transaction-box-right">
            <div>
              <div class="">{{ decimalNumC(item.sourceAmount, 8, ',') }}</div>
              <div class="u-price">
                ${{ decimalNumC(item.sourceAmountUSD, 6, ',') }}
              </div>
            </div>
          </div>
          <div
            :class="`${
              item.sourceId ? 'text-underline' : ''
            } table-col tx transaction-box-right`"
            @click="openexplor(item, { isFrom: true })"
          >
            {{ shortAddress(item.sourceId) }}
          </div>
          <div
            :class="`${
              item.targetId ? 'text-underline' : ''
            } table-col tx transaction-box-right`"
            @click="openexplor(item, { isFrom: false })"
          >
            {{ shortAddress(item.targetId) }}
          </div>
          <div class="table-col transaction-box-right">
            {{ calculateRelativeTime(item.sourceTime) }}
          </div>
        </div>
      </div>
      <div class="pagination-group">
        <el-pagination
          @current-change="curChange"
          class="transactions-pagination"
          layout="prev, pager, next"
          :current-page="1"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon/SvgIcon.vue'
import util from '../../util/util'
import { decimalNum } from '../../util/decimalNum'
import dayjs from 'dayjs'
export default {
  components: { SvgIcon },
  name: 'LatestTransactions',
  data() {
    return {
      list: [],
      total: 1,
      loadingList: new Array(10).fill(0),
      loading: false,
      params: {
        current: 1,
        sourceChain: '',
        targetChain: '',
      },
    }
  },
  created() {
    this.getData()
  },
  methods: {
    openexplor(item, { isFrom }) {
      const chainId = isFrom ? item.sourceChain : item.targetChain
      const hash = isFrom ? item.sourceId : item.targetId
      if (!chainId || !hash) return
      const url = util.getTxExploreUrl(chainId) + hash
      window.open(url, '_blank')
    },
    async getData() {
      try {
        this.loading = true
        const { current , sourceChain, targetChain} = this.params
        let paramsGroup = {
            page: current,
            ...(sourceChain ? ({sourceChain}) : {}),
            ...(targetChain ? ({targetChain}) : {}),
        }
        const respone = await fetch(
          `${process.env.VUE_APP_OPEN_URL}/partner-data-openness/transcations/list` + this.objToParams(paramsGroup)
        )
        const res = await respone.json()
        this.list = res?.data?.rows || []
        this.total = res?.data?.count || 0
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    decimalNumC(num, decimal, delimiter, currencySymbol) {
      return decimalNum(num, decimal, delimiter, currencySymbol)
    },
    shortAddress(tx) {
      return tx ? util.shortAddress(tx, 6) : '--'
    },
    curChange(cur) {
      this.params = {
        ...this.params,
        current: cur,
      }
    },
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
    objToParams(obj) {
      const list = []

      Object.keys(obj).forEach((item) => {
        const str = obj[item] ?? ''

        list.push(`${[item]}=${encodeURIComponent(str)}`)
      })

      return list?.length ? '?' + list.join('&') : ''
    },
  },
  watch: {
    params: function (data) {
      console.log('data', data)
      this.getData()
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .transactions-pagination .btn-next {
  color: #a3a3a3;
}
::v-deep .transactions-pagination .el-pager .number {
  background: transparent;
  color: #a3a3a3;
  font-size: 12px;
  font-weight: 400;
  font-family: GeneralSans-Medium;
}
::v-deep .transactions-pagination .el-pager .more {
  color: #a3a3a3;
}
::v-deep .transactions-pagination .btn-prev {
  color: #a3a3a3;
}

::v-deep .transactions-pagination .el-pager .number.active {
  border: 1px solid rgb(230, 230, 230);
  border-radius: 4px;
  color: #1a1a1a;
}

@keyframes shine {
  to {
    // Move shine from left to right, with offset on the right based on the width of the shine - see background-size
    background-position: right -40px top 0;
  }
}

.last-transactions {
  width: 100%;
  margin: 4px 0 20px;
  min-width: 960px;
  .transaction-box-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    white-space: nowrap;
    text-align: left;
  }
  .transaction-box-center {
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    text-align: right;
  }
  .transaction-box-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    white-space: nowrap;
    text-align: right;
  }
  .border-b {
    border-bottom: 1px solid rgb(230, 230, 230);
  }
  .transaction-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .label {
      font-size: 20px;
      font-family: 'Kodchasan-SemiBold';
      line-height: 32px;
      letter-spacing: 0px;
    }
  }
  .transaction-table {
    width: 100%;
    margin-top: 10px;
    border-radius: 12px;
    background: rgb(255, 255, 255);
    .table-header {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0%;
      color: #a3a3a3;
      padding: 12px 16px;
      font-family: GeneralSans-Regular;
      .table-col {
        flex: 1;
      }
      .table-col.transaction-box-center {
        flex: 0.8;
      }
      .table-col.asset,
      .table-col.amount {
        flex: 0.6;
      }
    }

    .table-row-loading {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 18px 16px;
      .table-col {
        flex: 1;
        .loading-card {
          width: 100px;
          height: 24px;
          border-radius: 8px;
          background-color: #f5f5f5;
          .skeleton {
            width: 100%;
            height: 100%;
            background-image: linear-gradient(
              90deg,
              rgba(#fff, 0),
              rgba(#fff, 0.4),
              rgba(#fff, 0)
            );
            background-size: 40px 100%; // width of the shine
            background-repeat: no-repeat; // No need to repeat the shine effect
            background-position: left -40px top 0; // Place shine on the left side, with offset on the left based on the width of the shine - see background-size
            animation: shine 2s ease infinite;
          }
        }
      }
    }

    .table-row {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0%;
      padding: 18px 16px;
      font-family: GeneralSans-Medium;
      color: #1a1a1a;
      .table-col {
        flex: 1;
        .status-icon {
          width: 16px;
          height: 16px;
        }
        .token-icon {
          width: 28px;
          height: 28px;
        }

        .status-icon {
          margin-right: 4px;
        }

        .pending-card {
          width: fit-content;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          color: #3478f5;
          padding: 4px 8px;
          border-radius: 8px;
          background: rgb(235, 242, 254);
        }
        .completed-card {
          width: fit-content;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          color: #1eb4ab;
          padding: 4px 8px;
          border-radius: 8px;
          background: rgb(229, 247, 247);
        }
        .asset-group {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-size: 14px;
          font-family: GeneralSans-Medium;
          line-height: 20px;
          letter-spacing: 0%;
          .token-symbol {
            width: 28px;
            height: 28px;
            margin-right: 4px;
          }
        }
      }
      .amount {
        .u-price {
          font-size: 12px;
          font-family: GeneralSans-Regular;
          line-height: 16px;
          letter-spacing: 0%;
          color: #a3a3a3;
        }
      }
      .tx {
        cursor: pointer;
      }
      .text-underline {
        text-decoration-line: underline;
      }
      .table-col.asset,
      .table-col.amount {
        flex: 0.6;
      }
    }

    .table-row:hover {
      background-color: #f5f5f5;
    }

    .pagination-group {
      padding: 14px 0;
    }
  }
}
</style>
