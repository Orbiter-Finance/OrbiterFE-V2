<template>
  <div class="dapps-wrapper">
    <div class="head">
      <rollups
        :value="currentRollup"
        @rollup-change="(value) => (currentRollup = value)"
      />
      <div class="right">
        <time-diff
          class="time"
          v-if="dapps && dapps.update_time"
          :timestamp="dapps.update_time"
        />
        <selector
          :data="selectors"
          :value="currentFilter"
          @change="(item) => (currentFilter = item.value)"
        />
      </div>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        empty-text="No Items"
        @sort-change="onSortChange"
      >
        <el-table-column fixed label="Dapp Name" width="280">
          <template slot-scope="scope">
            <div class="name-column">
              <div class="rank">
                {{ scope.row.rank }}
              </div>
              <dapp-logo :name="scope.row.dapp_name" :rollup="currentRollup" />
              <div class="name">
                {{ scope.row.dapp_name }}
              </div>
              <a :href="scope.row.dapp_url" target="_blank">
                <img
                  width="16"
                  height="16"
                  src="../../../assets/data/link.png"
                />
              </a>
              <a :href="scope.row.dapp_twitter" target="_blank">
                <img
                  width="16"
                  height="16"
                  src="../../../assets/data/twitter.png"
                />
              </a>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="launch_time"
          label="Launch Time"
          width="120"
          :sortable="'custom'"
        >
          <template slot-scope="scope">
            <div class="data">
              {{ scope.row.launch_time_str }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="all_users"
          label="All User"
          width="140"
          align="right"
          :sortable="'custom'"
        >
          <template slot-scope="scope">
            <div class="data">
              {{ numeral(scope.row.all_users).format('0,0') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Active Accounts"
          prop="active_accounts"
          width="150"
          align="right"
          :sortable="'custom'"
        >
          <template slot-scope="scope"
            ><div class="data">
              {{
                numeral(scope.row[currentFilter].active_accounts).format('0,0')
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="new_users"
          label="New Users"
          width="120"
          align="right"
          :sortable="'custom'"
        >
          <template slot-scope="scope">
            <div class="data">
              {{ numeral(scope.row[currentFilter].new_users).format('0,0') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="new_users_age"
          label="New Users Age"
          width="140"
          align="right"
          :sortable="'custom'"
        >
          <template slot-scope="scope"
            ><div class="data">
              {{
                numeral(scope.row[currentFilter].new_users_age).format('0,0')
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="interactions"
          label="Interactions"
          width="120"
          align="right"
          :sortable="'custom'"
        >
          <template slot-scope="scope"
            ><div class="data">
              {{ numeral(scope.row[currentFilter].interactions).format('0,0') }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="PAGE_SIZE"
          :total="total"
          :current-page.sync="page"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import Selector from '../Selector.vue'
import TimeDiff from '../TimeDiff.vue'
import DappLogo from '../DappLogo.vue'
import Rollups from '../Rollups.vue'
import { getDapps } from '../../../L2data/dapp'

const PAGE_SIZE = 30

const selectors = [
  { label: '1d', value: '1d' },
  { label: '3d', value: '3d' },
  { label: '7d', value: '7d' },
  { label: '14d', value: '14d' },
  { label: '30d', value: '30d' },
]

export default {
  data() {
    return {
      selectors,
      PAGE_SIZE,
      dapps: {},
      currentRollup: 'arbitrum',
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
  },
  watch: {
    currentRollup() {
      this.dapps = {}
      this.tableData = []
      this.page = 1
      this._getDapps()
    },
    page() {
      this.tableData = this._getTableData()
    },
  },
  computed: {
    total() {
      if (!this.dapps || !this.dapps.table_data) return 0
      return this.dapps.table_data.length
    },
  },
  mounted() {
    this._getDapps()
  },
  methods: {
    numeral,
    async _getDapps() {
      const dapps = await getDapps(this.currentRollup)
      this.dapps = dapps
      this.tableData = this._getTableData()
    },
    onSortChange({ prop, order }) {
      const tableData = this.tableData
      const isAscending = order === 'ascending'

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
        prop === 'active_accounts' ||
        prop === 'new_users' ||
        prop === 'interactions' ||
        prop === 'new_users_age'
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
      const start = (this.page - 1) * PAGE_SIZE
      return allData.slice(start < 1 ? 0 : start, this.page * PAGE_SIZE)
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
      padding: 0 24px 0 5px;
    }
    .name-column {
      display: flex;
      .rank {
        width: 20px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        margin-right: 20px;
      }
      .name {
        width: 70px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: #333333;
        margin: 0 10px;
      }
      a {
        margin-right: 10px;
      }
    }

    .data {
      font-family: 'Inter';
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
</style>
