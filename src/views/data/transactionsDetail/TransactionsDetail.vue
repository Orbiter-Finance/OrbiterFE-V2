<template>
  <div class="transactions-detail">
    <div class="head">
      <img
        class="back"
        src="../../../assets/data/back.png"
        @click="$router.back()"
      />
      <div class="tabs">
        <div
          class="tab"
          v-for="(item, i) in tabs"
          :key="i"
          :class="{ active: currentTab === item.value }"
          @click="currentTab = item.value"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <component v-bind:is="currentTab"></component>
  </div>
</template>

<script>
import Rollups from './Rollups'
import Dapps from './Dapps.vue'
import Contracts from './Contracts.vue'

const tabs = [
  {
    name: 'Rollups Data',
    value: 'Rollups',
  },
  {
    name: 'L2 Dapps Data',
    value: 'Dapps',
  },
  {
    name: 'New Contracts',
    value: 'Contracts',
  },
]

export default {
  data() {
    return {
      tabs,
      currentTab: tabs[0].value,
    }
  },
  components: {
    Rollups,
    Dapps,
    Contracts,
  },
}
</script>

<style lang="scss">
.transactions-detail {
  max-width: 1120px;
  margin: 0 auto;
  .head {
    display: flex;
    align-items: center;
    .back {
      height: 40px;
      width: 40px;
      margin-right: 40px;
      cursor: pointer;
    }
    .tabs {
      display: flex;
      align-items: center;
      height: 40px;
      background: #ffffff;
      border-radius: 20px;
      .tab {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        height: 40px;
        border-radius: 20px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        color: rgba(51, 51, 51, 0.8);
        cursor: pointer;
        &.active {
          background: #df2e2d;
          box-shadow: inset 0px -6px 0px rgba(0, 0, 0, 0.16);
          border-radius: 20px;
          color: #ffffff;
        }
      }
    }
  }

  .el-table th.el-table__cell > .cell {
    padding: 0;
  }
  .el-table .cell {
    padding: 0;
  }
  .el-table td.el-table__cell,
  .el-table th.el-table__cell.is-leaf {
    border: 0;
  }
  .el-table__fixed-right::before,
  .el-table__fixed::before {
    width: 0;
  }
  .el-table .descending .sort-caret.descending {
    border-top-color: #df2e2d;
  }
  .el-table .ascending .sort-caret.ascending {
    border-bottom-color: #df2e2d;
  }
  .el-table::before {
    display: none;
  }
  .el-table__body tr.hover-row > td.el-table__cell {
    background-color: #ffffff !important;
  }
  .el-table tbody tr:hover > td {
    background-color: #ffffff !important;
  }
  .el-table td.el-table__cell,
  .el-table th.el-table__cell {
    padding: 6px 0;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    color: #333333;
  }
  .el-table .sort-caret.ascending {
    border-bottom-color: rgba(51, 51, 51, 1);
  }
  .el-table .sort-caret.descending {
    border-top-color: rgba(51, 51, 51, 1);
  }
}
</style>
