<template>
<div class="history-page">
  <div class="history-content">
    <div class="title">History</div>
    <div class="table historyContent">
      <div class="table-header">
        <span class="col col-1"></span>
        <span class="col col-2">Time</span>
        <span class="col col-3">Value</span>
        <span class="col col-4">From</span>
        <span class="col col-5">To</span>
      </div>
      <div class="dydx-limit" v-if="isShowDydxLimit">
        Limited by the dydx mechanism, the history of dYdX cannot be queried
        temporarily
      </div>
      <CommLoading v-if="!historyData" style="margin: auto; margin-top: 5rem" width="4rem" height="4rem" />
      <div
        v-else-if="historyData && historyData.length !== 0"
        v-for="(item, index) in historyData"
        :key="index"
        @click="getHistoryInfo(item)"
        class="contentItem"
      >
        <svg-icon class="logo col-val col-1" color="#df2e2d" :iconName="iconName(item)"></svg-icon>
        <span class="col-val col-2">{{ item.fromTimeStamp }}</span>
        <span class="col-val col-3">{{ item.userAmount + item.tokenName }}</span>
        <div class="col-val col-4" style="display:flex;align-items:center;">
          <svg-icon
            :iconName="logoName(item.fromChainID)"
            style="width: 1.6rem; height: 1.6rem"
          ></svg-icon>
        </div>
        <svg-icon
          class="col-val col-5"
          :iconName="logoName(item.toChainID)"
          style="width: 1.6rem; height: 1.6rem"
        ></svg-icon>
      </div>
    </div>
    <NoData v-if="historyData && historyData.length === 0">No history</NoData>
    <el-pagination v-if="historyData && historyData.length !== 0" @current-change="curChange" class="pagination" layout="prev, pager, next" :total="$store.state.transactionListInfo.total">
    </el-pagination>

    <svg-icon @click.native="closeDialog" class="close" iconName="close"></svg-icon>
  </div>
</div>
</template>

<script>
import { NoData, CommLoading } from '../components'
import Middle from '../util/middle/middle'

export default {
  name: 'History',
  components: {
    CommLoading, NoData
  },
  computed: {
    historyData() {
      const { transactionList } = this.$store.state
      if (!transactionList) {
        return transactionList
      }
      // Hide dydx (from and to)
      const list = []
      for (const item of transactionList) {
        if (
          item.fromChainID == 11 ||
          item.fromChainID == 511 ||
          item.toChainID == 11 ||
          item.toChainID == 511
        ) {
          continue
        }
        list.push(item)
      }
      return list
    },
    isShowDydxLimit() {
      const { transactionList } = this.$store.state
      if (!this.historyData || !transactionList) {
        return false
      }
      if (this.historyData.length < transactionList.length) {
        return true
      }
      return false
    },
  },
  methods: {
    curChange(cur) {
      this.$store.dispatch('getTransactionsHistory', {
        current: cur
      })
    },
    closeDialog() {
      this.$store.commit('toggleHistoryPanelVisible', false)
    },
    getHistoryInfo(e) {
      Middle.$emit('showDetail', e)
      this.closeDialog()
    },
    stopPenetrate(e) {
      e.stopPropagation()
    },
    iconName(item) {
      if (item.state === 0) {
        return 'history_success'
      } else if (item.state === 1) {
        return 'history_waiting'
      } else {
        return 'history_fail'
      }
    },
    logoName(chainID) {
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
  },
}
</script>

<style scoped lang="scss">
.history-page {
  display: flex;
  justify-content: center;
  align-items: center;
  .history-content {
    padding: 18px 20px;
    width: 600px;
    // height: 740px;
    min-height: 600px;
    border-radius: 20px;
    position: relative;
    .title {
      font-weight: 700;
      font-size: 16px;
      line-height: 24px;
    }
    .table {
      margin-top: 26px;
      .table-header {
        height: 32px;
        border-radius: 8px;
        padding: 4px 20px;
        display: flex;
        align-items: center;
      }
      .col {
        margin-right: 26px;
        font-weight: 400;
        font-size: 14px;
        line-height: 24px;
        text-align: left;
      }
      .col-val {
        margin-right: 26px;
        text-align: left;
      }
      .col-1 {
        width: 16px;
      }
      .col-2, .col-3 {
        width: 160px;
      }
      .col-4, .col-5 {
        width: 40px;
      }
      .col:last-child {
        margin-right: 0px;
      }
    }

    .pagination {
      margin-top: 24px;
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
      padding: 4px 20px;
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
  background: #DF2E2D;
  border-radius: 8px;
  color: white;
}
.dark-theme .history-page >>> .el-pagination button:disabled {
  background-color: #373951;
  color: rgba(255, 255, 255, 0.6);
}
.dark-theme .history-page >>> .el-pager li {
  background-color: #373951;
  color: rgba(255, 255, 255, 0.6);
}
.dark-theme .history-page >>> .el-pagination .btn-next, .dark-theme .history-page >>> .el-pagination .btn-prev {
  background: center center no-repeat #373951;
  color: rgba(255, 255, 255, 0.6);
}
</style>
