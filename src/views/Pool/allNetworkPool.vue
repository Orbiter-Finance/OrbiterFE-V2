<template>
  <div class="history-page">
    <div class="history-content">
      <div class="title">
        <img
          src="../../assets/pizza.png"
          width="24px"
          height="24px"
          style="transform: rotate(90deg); margin-right: 10px"
        />
        Add Liquidity in Pizza Pool
      </div>
      <div class="tip">
        <span class="tip-content"
          >Pizza Lending Pool is basing on order mortgaging. If a maker lends
          liquidity from the Pizza Pool, the maker's order will be filled to the
          Pizza Pool derectly.</span
        >
      </div>
      <div class="table historyContent">
        <CommLoading
          v-if="isLoading"
          style="margin: auto; margin-top: 5rem"
          width="4rem"
          height="4rem"
        />
        <NoData
          v-else-if="
            !isLoading && Object.values(getAllNetworkLiquidityData).length === 0
          "
          style="padding-top: 200px"
          >No history</NoData
        >
        <template v-else>
          <template v-for="(item, idx) in getAllNetworkLiquidityData">
            <div class="allNetworkPool-body" :key="idx">
              <div class="table-header">
                <span class="col col-1">Network</span>
                <span class="col col-2">Token</span>
                <span class="col col-3">Pizza Pool</span>
                <span class="col col-4">APR</span>
                <span class="col col-5">Add Liquidity</span>
              </div>
              <hr class="hr" />
              <template v-for="(detail, index) in item">
                <div class="allNetworkPool-main" :key="index">
                  <div class="col col-value">
                    <svg-icon
                      :iconName="chainIcon(detail.localID)"
                      style="width: 24px; height: 24px"
                    ></svg-icon>
                    <span class="icon-label">{{
                      chainName(detail.localID)
                    }}</span>
                  </div>
                  <div class="col col-value">
                    <img
                      style="width: 24px; height: 24px"
                      :src="detail.tokenSrc"
                    />
                    <span class="icon-label">{{ detail.tokenName }}</span>
                  </div>
                  <div class="col col-value">
                    <span>{{ detail.liquidity + ' ' + detail.tokenName }}</span>
                  </div>
                  <div class="col col-value">
                    <span>{{ detail.apr }}%</span>
                  </div>
                  <div
                    :class="[
                      'col',
                      'col-value',
                      { addLoading: detail.addLiquidityLoading },
                    ]"
                  >
                    <span
                      @click="
                        detail.addLiquidityLoading
                          ? ''
                          : showAddLiquidityDialog(detail)
                      "
                    >
                      <template v-if="!detail.addLiquidityLoading">
                        Add Liquidity
                      </template>
                      <template v-else>
                        <loading
                          style="margin: auto"
                          loadingColor="white"
                          width="2rem"
                          height="2rem"
                        ></loading>
                      </template>
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </template>
      </div>

      <svg-icon
        @click.native="closeAllNetworkPool"
        class="close"
        iconName="close"
      ></svg-icon>
    </div>
  </div>
</template>

<script>
import { NoData, CommLoading } from '../../components'
import { mapMutations, mapGetters, mapState } from 'vuex'
import util from '../../util/util'
export default {
  name: 'allNetworkPool',
  components: {
    NoData,
    CommLoading,
  },
  computed: {
    ...mapState(['curPage']),
    ...mapGetters(['getAllNetworkLiquidityData']),
  },
  data() {
    return {
      isLoading: false,
    }
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next(() => {
      // getTransactionsHistory()
    })
  },
  methods: {
    ...mapMutations(['togglePageTab', 'updatePoolNetworkOrTokenConfig']),
    closeDialog() {
      const last = JSON.parse(
        localStorage.getItem('last_page_before_history') || '{}'
      )
      try {
        if (last.path) {
          last.path !== this.$route.path && this.$router.push(last)
          // recoverSenderPageWorkingState()
        } else {
          this.$router.push({ path: '/' })
        }
      } catch (err) {
        console.error(err)
      }
    },
    stopPenetrate(e) {
      e.stopPropagation()
    },
    chainName(chainID) {
      return util.chainName(chainID, this.$env.localChainID_netChainID[chainID])
    },
    chainIcon(chainID) {
      if (chainID == '2' || chainID == '22') {
        return 'arblogo'
      } else if (chainID == '3' || chainID == '33') {
        return 'zklogo'
      } else if (chainID == '4' || chainID == '44') {
        return 'sknlogo'
      } else if (chainID == '6' || chainID == '66') {
        return 'pglogo'
      } else if (chainID == '7' || chainID == '77') {
        return 'oplogo'
      } else if (chainID == '8' || chainID == '88') {
        return 'imxlogo'
      } else if (chainID == '9' || chainID == '99') {
        return 'loopringlogo'
      } else if (chainID == '10' || chainID == '510') {
        return 'metislogo'
      } else if (chainID == '11' || chainID == '511') {
        return 'dydxlogo'
      } else if (chainID == '12' || chainID == '512') {
        return 'zkspacelogo'
      } else if (chainID == '13' || chainID == '513') {
        return 'bobalogo'
      } else {
        return 'ethlogo'
      }
    },
    updateNetworkConfig(chainID) {
      this.updatePoolNetworkOrTokenConfig({
        type: 'toChainId',
        value: chainID,
      })
    },
    showAddLiquidityDialog(info) {
      this.$emit('deliveryInfo', info)
      this.updateNetworkConfig(info.localID)
    },
    closeAllNetworkPool() {
      this.togglePageTab({ type: 'curNetworkPoolMode', value: true }),
        this.updateNetworkConfig(parseInt(this.curPage.NetworkliquidityState))
    },
  },
}
</script>

<style scoped lang="scss">
.app {
  .history-page {
    border-radius: 20px;
    .history-content {
      min-height: 400px;
      width: 950px;
      .table {
        .table-header {
          // padding: 4px 20px;
        }
        .col {
          // margin-right: 26px;
        }
        .col-5 {
          margin-right: 0 !important;
        }
        .contentItem {
          padding: 4px 20px;
          .col-val {
            margin-right: 26px;
            text-align: left;
          }
        }
      }
    }
  }
}
.app-mobile {
  .history-page {
    .history-content {
      min-width: 335px;
      height: 100%;
      min-height: 300px;
      // overflow-y: scroll;
      // overflow-x: hidden;
      .table {
        .col-1 {
          min-width: 16px;
          min-height: 16px;
          margin-left: 12px;
          margin-right: 10px;
        }
        .col-2 {
          min-width: 100px;
        }
        .col-3 {
          min-width: 120px;
        }
        .col-4 {
          min-width: 33px;
          margin-right: 8px;
        }
        .col-5 {
          // min-width: 32px;
          min-width: 38px;
        }
        .contentItem {
          min-width: 335px;
          .col-val {
            text-align: left;
          }
        }
      }
    }
  }
}
.history-page {
  font-family: 'Inter Regular';
  display: flex;
  justify-content: center;
  align-items: center;
  // overflow: hidden;
  width: 100%;
  height: 100%;

  .history-content {
    padding: 25px 40px 10px;
    height: 100%;
    border-radius: 20px;
    position: relative;
    .title {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 24px;

      /* identical to box height, or 120% */
      display: flex;
      align-items: center;
      letter-spacing: -0.01em;
    }
    .tip {
      display: flex;
      margin: 20px 0;
      .tip-content {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;

        /* identical to box height, or 167% */
        display: flex;
        align-items: center;
        letter-spacing: -0.01em;
      }
    }
    .table {
      font-weight: 400;
      font-size: 14px;
      line-height: 24px;
      .allNetworkPool-body {
        width: 870px;
        // height: 385px;
        border-radius: 20px;
        padding: 20px;
        margin-bottom: 30px;
        .table-header {
          height: 32px;
          display: flex;
          align-items: flex-start;
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 16px;
          line-height: 24px;

          /* identical to box height, or 150% */
          display: flex;
          align-items: center;
          letter-spacing: -0.01em;
        }
        .hr {
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
        .allNetworkPool-main {
          padding: 10px 0;
          display: flex;
          .col-value {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 700;
            font-size: 14px;
            line-height: 24px;

            /* identical to box height, or 171% */
            display: flex;
            align-items: center;
            letter-spacing: -0.01em;

            &:nth-last-child(2) {
              color: #5ec2b7;
            }
            &:last-child {
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              padding: 8px 24px;
              gap: 10px;
              height: 40px;

              background: #0e4c60;
              box-shadow: inset 0px -3px 0px rgba(0, 0, 0, 0.16);
              border-radius: 20px;

              font-family: 'Inter';
              font-style: normal;
              font-weight: 700;
              font-size: 16px;
              line-height: 24px;

              /* identical to box height, or 150% */
              display: flex;
              align-items: center;
              text-align: center;
              letter-spacing: -0.01em;

              color: #ffffff;
              background: #084c61;
              &:not(:disabled):hover {
                background: #053442;
              }
              &.addLoading {
                background: #053442;
              }
            }
            .icon-label {
              margin-left: 8px;
            }
          }
        }
        .col {
          text-align: left;
          width: 20%;
          &:last-child {
            text-align: center;
          }
        }
      }
    }

    .pagination {
      margin-top: 24px;
      text-align: right;
    }
    .close {
      position: absolute;
      top: 24px;
      right: 26px;
      width: 12px;
      height: 12px;
      cursor: pointer;
    }
  }

  .dydx-limit {
    color: #e85e24;
    font-size: 14px;
    padding-top: 8px;
  }

  .historyContent {
    position: relative;
    .contentItem {
      font-size: 1.4rem;
      font-weight: lighter;
      align-items: center;
      display: flex;
      position: relative;
      text-align: left;
      height: 32px;
      line-height: 32px;
      margin-top: 8px;
      margin-bottom: 8px;
      cursor: pointer;
    }
    .contentItem:hover {
      border-radius: 8px;
    }
  }
}
</style>

<style scoped>
/* ------------- override element style --------------- */
.history-page >>> .el-pager .number.active {
  background: #df2e2d;
  border-radius: 8px;
  color: white;
}
.history-page >>> .el-pager li:hover {
  color: rgba(51, 51, 51, 0.8);
  background: #f5f5f5;
  border-radius: 8px;
}
.dark-theme .history-page >>> .el-pager li:hover {
  color: rgba(255, 255, 255, 0.6);
  background: #3f415b;
  border-radius: 8px;
}
.dark-theme .history-page >>> .el-pagination button:disabled {
  background-color: #373951;
  color: rgba(255, 255, 255, 0.6);
}
.dark-theme .history-page >>> .el-pager li {
  background-color: #373951;
  color: rgba(255, 255, 255, 0.6);
}
.dark-theme .history-page >>> .el-pagination .btn-next,
.dark-theme .history-page >>> .el-pagination .btn-prev {
  background: center center no-repeat #373951;
  color: rgba(255, 255, 255, 0.6);
}
.app-mobile .history-page >>> .el-pager li {
  min-width: 30px !important;
}
</style>
