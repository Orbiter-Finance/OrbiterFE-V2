<template>
  <div class="dapps-wrapper">
    <div class="head">
      <rollups :value="currentRollup" @rollup-change="rollupChange" :customRollups="rollups" />
      <div class="right">
        <time-diff class="time" v-if="!isMobile && dapps && dapps.update_time" :timestamp="dapps.update_time" />
        <selector :data="selectors" :value="currentFilter" @change="(item) => (currentFilter = item.value)" />
      </div>
    </div>
    <div class="table">
      <el-table :data="currentTableData" style="width: 100%" empty-text="No Items" :default-sort="defaultSort"
        @sort-change="onSortChange">
        <el-table-column v-if="!isMobile" fixed label="NO. Dapp Name" :width="280">
          <template slot-scope="scope">
            <div class="name-column">
              <div class="rank">
                {{ scope.row.index }}
              </div>
              <dapp-logo :name="scope.row.dapp_name" />
              <div @click="onRowClick(scope.row)" class="name" :title="scope.row.dapp_name">
                {{ scope.row.dapp_name }}
              </div>
              <icon-link :href="scope.row.dapp_url" />
              <twitter-link :href="scope.row.dapp_twitter" />
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="isMobile" fixed label="NO. Dapp" :width="150">
          <template slot-scope="scope">
            <div class="name-column">
              <div class="rank">
                {{ scope.row.index }}
              </div>
              <dapp-logo :name="scope.row.dapp_name" />
              <div @click="onRowClick(scope.row)" class="name" :title="scope.row.dapp_name">
                {{ scope.row.dapp_name }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="launch_time" label="Launch Date" width="130" :sortable="'custom'"
          :sort-orders="['descending', 'ascending', null]">
          <template slot-scope="scope">
            <div class="data">
              {{ dateFormat(scope.row.launch_time_str, 'yyyy-MM-dd') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="all_users" label="All Users" width="130" align="center"
          :sort-orders="['descending', 'ascending', null]" :sortable="'custom'">
          <template slot-scope="scope">
            <div class="data">
              {{ numeral(scope.row.all_users).format('0,0') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Active Accounts" prop="active_users" :sort-orders="['descending', 'ascending', null]"
          width="150" align="right" :sortable="'custom'">
          <template slot-scope="scope">
            <div class="data">
              {{ numeral(scope.row[currentFilter].active_users).format('0,0') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="new_users" label="New Users" width="120" align="right" :sortable="'custom'"
          :sort-orders="['descending', 'ascending', null]">
          <template slot-scope="scope">
            <div class="data">
              {{ numeral(scope.row[currentFilter].new_users).format('0,0') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="new_users_age" width="140" align="right">
          <template slot="header">
            <div class="new-user-age-header">New Users Age</div>
            <el-popover popper-class="new-user-age-header-popover" :placement="'bottom'" width="300" trigger="hover">
              <div class="new-user-age-desc">
                Statistics of all users. “Users Age” refers to the cumulative days since users started the first
                transaction on the mainnet.
                <a href="https://docs.orbiter.finance/l2data" target="_blank"> Read More </a>
              </div>
              <div class="new-user-age-help" slot="reference">
                <help />
              </div>
            </el-popover>
          </template>
          <template slot-scope="scope">
            <div class="data">
              {{
                  numeral(scope.row[currentFilter].new_users_age).format('0,0')
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="interactions" label="Interactions" width="120" align="right" :sortable="'custom'"
          :sort-orders="['descending', 'ascending', null]">
          <template slot-scope="scope">
            <div class="data">
              {{ numeral(scope.row[currentFilter].interactions).format('0,0') }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :page-size="PAGE_SIZE" :total="total"
          :current-page.sync="page">
        </el-pagination>
      </div>
    </div>
    <dapp-detail @close="closeDappDetail" ref="dappDetail" />
  </div>
</template>

<script>
import numeral from 'numeral'
import Selector from '../Selector.vue'
import TimeDiff from '../TimeDiff.vue'
import DappLogo from '../DappLogo.vue'
import Rollups from '../Rollups.vue'
import DappDetail from '../DappDetail'
import IconLink from '../IconLink.vue'
import Help from '../Help'
import TwitterLink from '../TwitterLink.vue'
import dateFormat from '../../../util/dateFormat'
import { getDapps } from '../../../L2data/dapp'
import { isMobile } from '../../../composition/hooks'
import { getTabRollups } from '../../../L2data/rollups'
import Common from '../Common'

const PAGE_SIZE = 30

const selectors = [
  { label: '1d', value: '1d' },
  { label: '3d', value: '3d' },
  { label: '7d', value: '7d' },
  { label: '14d', value: '14d' },
  { label: '30d', value: '30d' },
]

export default {
  mixins: [Common],
  data() {
    return {
      selectors,
      PAGE_SIZE,
      dapps: {},
      defaultSort: { prop: 'active_users', order: 'descending' },
      currentSort: { prop: 'active_users', order: 'descending' },
      currentRollup: undefined,
      rollups: [],
      currentFilter: selectors[0].value,
      tableData: [],
      page: 1,
    }
  },
  components: {
    Selector,
    DappLogo,
    TimeDiff,
    Rollups,
    DappDetail,
    IconLink,
    TwitterLink,
    Help,
  },
  watch: {
    async currentRollup() {
      this.dapps = {}
      this.tableData = []
      this.page = 1
      await this._getDapps()
      if (this.currentSort) {
        this.onSortChange(this.currentSort)
      }
    },
    currentFilter() {
      if (this.currentSort) {
        this.onSortChange(this.currentSort)
      }
    }
  },
  computed: {
    total() {
      if (!this.dapps || !this.dapps.table_data) return 0
      return this.dapps.table_data.length
    },
    isMobile() {
      return isMobile.value
    },
    currentTableData() {
      if (!this.tableData.length) {
        return []
      }
      const start = (this.page - 1) * PAGE_SIZE
      const allData = this.tableData.map((item, i) => ({
        ...item,
        index: i + 1,
      }))
      return allData.slice(start < 1 ? 0 : start, this.page * PAGE_SIZE)
    },
  },
  async mounted() {
    this.rollups = await getTabRollups('dapps')
    this.allTab = this.rollups.map(item => item.value);
  },
  methods: {
    dateFormat,
    numeral,
    async _getDapps() {
      this.$loader.show()
      const dapps = await getDapps(this.currentRollup)
      this.$loader.hide()
      this.dapps = dapps
      this.tableData = this._getTableData()
    },
    onSortChange({ prop, order }) {
      const tableData = this.tableData
      const isAscending = order === 'ascending'

      this.currentSort = {
        prop, order
      }

      if (!order === null) {
        this.tableData = tableData
        return
      }

      if (prop === 'all_users') {
        this.tableData = tableData.sort((a, b) => {
          const aAll = a.all_users
          const bAll = b.all_users
          return isAscending ? aAll - bAll : bAll - aAll
        })
        return
      }

      if (
        ['active_users', 'new_users', 'interactions', 'new_users_age'].includes(
          prop
        )
      ) {
        this.tableData = tableData.sort((a, b) => {
          const aData = a[this.currentFilter][prop]
          const bData = b[this.currentFilter][prop]
          return isAscending ? aData - bData : bData - aData
        })
        return
      }

      if (prop === 'launch_time') {
        this.tableData = tableData.sort((a, b) => {
          const aTime = new Date(a.launch_time).getTime()
          const bTime = new Date(b.launch_time).getTime()
          return isAscending ? aTime - bTime : bTime - aTime
        })
      }
    },
    _getTableData() {
      const dapps = this.dapps
      const allData = dapps && dapps.table_data ? dapps.table_data : []
      if (!allData.length) {
        return []
      }
      return allData.sort((a, b) => {
        const nA = Number(a[this.currentFilter].active_users)
        const nB = Number(b[this.currentFilter].active_users)
        return nB - nA
      })
    },
  },
}
</script>

<style lang="scss">
.dapps-wrapper {
  background: #ffffff;
  border-radius: 20px;
  margin-top: 24px;
  overflow: hidden;

  .head {
    display: flex;
    justify-content: space-between;
    height: 80px;
    padding: 0 30px;

    .right {
      display: flex;
      align-items: center;

      .time {
        margin-right: 40px;
      }
    }
  }

  .table {
    padding: 0 20px 50px 20px;

    .el-table .cell {
      // padding: 0 5px 0 5px;
      padding-right: 16px;
    }

    .name-column {
      display: flex;
      font-size: 14px;
      color: #333333;
      font-family: 'Inter Regular';

      .rank {
        width: 20px;
        font-style: normal;
        font-weight: 400;
        margin-right: 20px;
      }

      .name {
        width: 70px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-style: normal;
        font-weight: 500;
        margin: 0 10px;
        cursor: pointer;
      }

      a {
        margin-right: 10px;
      }
    }

    .data {
      font-family: 'Inter Regular';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: rgba(51, 51, 51, 0.8);
    }

    .pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;

      .el-pager li:not(.active):hover {
        color: #df2e2d;
      }

      .btn-prev,
      .btn-next {
        background-color: transparent;
        margin: 0;
      }

      .number {
        font-family: 'Inter Regular';
        background-color: transparent;
      }

      li:not(.disabled).active,
      .active {
        background-color: #df2e2d;
        border-radius: 8px;
      }
    }
  }
}

.new-user-age-header {
  display: inline-block;
}

.new-user-age-help {
  display: inline-block;
  margin-left: 4px;
  cursor: pointer;
}

.new-user-age-desc {
  word-wrap: break-word;
  word-break: normal;
  text-align: left;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(51, 51, 51, 0.8);
  font-family: 'Inter Regular';

  a {
    display: block;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #df2e2d;
  }
}

.new-user-age-header-popover {
  padding: 20px;
  background: #ffffff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 0;
}

@media (max-width: 820px) {
  .dapps-wrapper {
    .head {
      flex-direction: column;
      height: auto;
      padding-top: 24px;

      .right {
        align-items: flex-start;
        margin-top: 20px;
        margin-bottom: 5px;
      }
    }

    .table {
      padding: 0 30px 50px 30px;

      .el-table .cell {
        padding: 0 14px 0 5px;
      }

      .name-column {
        .rank {
          width: 32px;
          margin-right: 12px;
        }
      }

      .pagination {
        justify-content: center;
      }
    }
  }
}

.dark-body {
  .new-user-age-header-popover {
    background: #3f415b;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  }

  .new-user-age-desc {
    color: rgba(255, 255, 255, 0.6);
  }
}

.dark-theme {
  .dapps-wrapper {
    background: #373951;
  }

  .name-column {
    display: flex;
    color: #fff;
  }
}
</style>
