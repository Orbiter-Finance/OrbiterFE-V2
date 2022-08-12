<template>
  <div class="history-page">
    <div class="history-content">
      <div class="title">
        <img
          src="../../assets/pizza.png"
          style="
            transform: rotate(90deg);
            margin-right: 1rem;
            width: 2.4rem;
            height: 2.4rem;
          "
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
          style="padding-top: 20rem"
          >No history</NoData
        >
        <template v-else>
          <template v-for="(item, idx) in getAllNetworkLiquidityData">
            <div class="allNetworkPool-body" :key="idx">
              <div class="table-header">
                <span class="col col-1">Network</span>
                <span class="col col-2">Token</span>
                <span class="col col-3">Pizza Pool</span>
                <span class="col col-4">APY</span>
                <span class="col col-5">Add Liquidity</span>
              </div>
              <hr class="hr" />
              <template v-for="(detail, index) in item">
                <div class="allNetworkPool-main" :key="index">
                  <div class="col col-value">
                    <svg-icon
                      :iconName="chainIcon(detail.localID)"
                      style="width: 2.4rem; height: 2.4rem"
                    ></svg-icon>
                    <span class="icon-label">{{
                      chainName(detail.localID)
                    }}</span>
                  </div>
                  <div class="col col-value">
                    <img
                      style="width: 2.4rem; height: 2.4rem"
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
                    @click="
                      detail.addLiquidityLoading
                        ? ''
                        : showAddLiquidityDialog(detail)
                    "
                  >
                    <span>
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
    border-radius: 2rem;
    .history-content {
      min-height: 40rem;
      width: 95rem;
      .table {
        .col-5 {
          margin-right: 0rem !important;
        }
        .contentItem {
          padding: 0.4rem 2rem;
          .col-val {
            margin-right: 2.6rem;
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
      min-width: 33.5rem;
      height: 100%;
      min-height: 30rem;
      // overflow-y: scroll;
      // overflow-x: hidden;
      .table {
        .col-1 {
          min-width: 1.6rem;
          min-height: 1.6rem;
          margin-left: 1.2rem;
          margin-right: 1rem;
        }
        .col-2 {
          min-width: 10rem;
        }
        .col-3 {
          min-width: 12rem;
        }
        .col-4 {
          min-width: 3.3rem;
          margin-right: 0.8rem;
        }
        .col-5 {
          // min-width: 3.2rem;
          min-width: 3.8rem;
        }
        .contentItem {
          min-width: 33.5rem;
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
    padding: 2.5rem 4rem 1rem;
    height: 100%;
    border-radius: 2rem;
    position: relative;
    .title {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 2rem;
      line-height: 2.4rem;

      /* identical to box height, or 120% */
      display: flex;
      align-items: center;
      letter-spacing: -0.01em;
    }
    .tip {
      display: flex;
      margin: 2rem 0;
      .tip-content {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 1.2rem;
        line-height: 2rem;

        /* identical to box height, or 167% */
        display: flex;
        align-items: center;
        letter-spacing: -0.01em;
      }
    }
    .table {
      font-weight: 400;
      font-size: 1.4rem;
      line-height: 2.4rem;
      .allNetworkPool-body {
        width: 87rem;
        // height: 38.5rem;
        border-radius: 2rem;
        padding: 2rem;
        margin-bottom: 3rem;
        .table-header {
          height: 3.2rem;
          display: flex;
          align-items: flex-start;
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 1.6rem;
          line-height: 2.4rem;

          /* identical to box height, or 150% */
          display: flex;
          align-items: center;
          letter-spacing: -0.01em;
        }
        .hr {
          border: 0.1rem solid rgba(0, 0, 0, 0.2);
        }
        .allNetworkPool-main {
          padding: 1rem 0;
          display: flex;
          .col-value {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 700;
            font-size: 1.4rem;
            line-height: 2.4rem;

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
              padding: 0.8rem 2.4rem;
              gap: 1rem;
              height: 4rem;

              background: #0e4c60;
              box-shadow: inset 0rem -0.3rem 0rem rgba(0, 0, 0, 0.16);
              border-radius: 2rem;

              font-family: 'Inter';
              font-style: normal;
              font-weight: 700;
              font-size: 1.6rem;
              line-height: 2.4rem;

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
              margin-left: 0.8rem;
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
      margin-top: 2.4rem;
      text-align: right;
    }
    .close {
      position: absolute;
      top: 2.4rem;
      right: 2.6rem;
      width: 1.2rem;
      height: 1.2rem;
      cursor: pointer;
    }
  }

  .dydx-limit {
    color: #e85e24;
    font-size: 1.4rem;
    padding-top: 0.8rem;
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
      height: 3.2rem;
      line-height: 3.2rem;
      margin-top: 0.8rem;
      margin-bottom: 0.8rem;
      cursor: pointer;
    }
    .contentItem:hover {
      border-radius: 0.8rem;
    }
  }
}
</style>

<style scoped>
/* ------------- override element style --------------- */
.history-page >>> .el-pager .number.active {
  background: #df2e2d;
  border-radius: 0.8rem;
  color: white;
}
.history-page >>> .el-pager li:hover {
  color: rgba(51, 51, 51, 0.8);
  background: #f5f5f5;
  border-radius: 0.8rem;
}
.dark-theme .history-page >>> .el-pager li:hover {
  color: rgba(255, 255, 255, 0.6);
  background: #3f415b;
  border-radius: 0.8rem;
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
  min-width: 3rem !important;
}
</style>
