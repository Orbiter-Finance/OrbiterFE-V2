<template>
  <div class="contracts-wrapper">
    <div class="head">
      <rollups
        :value="currentRollup"
        @rollup-change="(value) => (currentRollup = value)"
      />
      <time-diff
        class="time"
        v-if="!isMobile && contracts && contracts.update_time"
        :timestamp="contracts.update_time"
      />
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        empty-text="No Items"
        @sort-change="onSortChange"
      >
        <el-table-column
          fixed
          prop="contract_address"
          label="New Contract"
          width="170"
        >
          <template slot-scope="scope">
            <div class="new-contract">
              <div class="no">
                {{ scope.$index + 1 }}
              </div>
              <div class="address" :title="scope.row.contract_address">
                {{ shortenAddress(scope.row.contract_address, 3) }}
              </div>
              <a :href="scope.row.scan_url" target="_blank">
                <img
                  width="13"
                  height="13"
                  src="../../../assets/data/export.png"
                />
              </a>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Name" width="180">
          <template slot-scope="scope">
            <div class="name-column">
              <dapp-logo :name="scope.row.dapp_name" />
              <div class="name" :title="scope.row.dapp_name">
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
          </template> </el-table-column
        ><el-table-column
          prop="launch_time"
          label="Launch Time"
          width="110"
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
          width="100"
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
          prop="users_age"
          label="Users Age"
          width="100"
          align="right"
        >
          <template slot-scope="scope">
            <div class="data">
              {{ numeral(scope.row.users_age).format('0,0') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="24h_active_users"
          label="24h Active Users"
          width="140"
          align="right"
          :sortable="'custom'"
        >
          <template slot-scope="scope">
            <div class="data">
              {{ numeral(scope.row['24h_active_users']).format('0,0') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="24h_new_users"
          label="24h New Users"
          width="130"
          align="right"
          :sortable="'custom'"
        >
          <template slot-scope="scope">
            <div class="data">
              {{ numeral(scope.row['24h_new_users']).format('0,0') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="24h_interactions"
          label="24h Interactions"
          width="140"
          align="right"
          :sortable="'custom'"
        >
          <template slot-scope="scope">
            <div class="data">
              {{ numeral(scope.row['24h_interactions']).format('0,0') }}
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
import TimeDiff from '../TimeDiff.vue'
import Rollups from '../Rollups.vue'
import DappLogo from '../DappLogo.vue'
import { getContracts } from '../../../L2data/contracts'
import { shortenAddress } from '../../../util/shortenAddress'
import { isMobile } from '../../../composition/hooks'

const PAGE_SIZE = 30

export default {
  data() {
    return {
      PAGE_SIZE,
      currentRollup: 'arbitrum',
      contracts: {},
      tableData: [],
      page: 1,
    }
  },
  components: {
    Rollups,
    TimeDiff,
    DappLogo,
  },
  watch: {
    currentRollup() {
      this.contracts = {}
      this.tableData = []
      this.page = 1
      this._getContracts()
    },
    page() {
      this.tableData = this._getTableData()
    },
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
    total() {
      if (!this.contracts || !this.contracts.table_data) return 0
      return this.contracts.table_data.length
    },
  },
  mounted() {
    this._getContracts()
  },
  methods: {
    numeral,
    shortenAddress,
    async _getContracts() {
      const contracts = await getContracts(this.currentRollup)
      this.contracts = contracts
      this.tableData = this._getTableData()
    },
    _getTableData() {
      const contracts = this.contracts
      const allData =
        contracts && contracts.table_data ? contracts.table_data : []
      if (!allData.length) {
        return []
      }
      const start = (this.page - 1) * PAGE_SIZE
      return allData.slice(start < 1 ? 0 : start, this.page * PAGE_SIZE)
    },
    onSortChange({ prop, order }) {
      const tableData = this.tableData
      const isAscending = order === 'ascending'

      if (!order === null) {
        this.tableData = tableData
        return
      }
      this.tableData = tableData.sort((a, b) => {
        const aData = Number(a[prop])
        const bData = Number(b[prop])
        return isAscending ? aData - bData : bData - aData
      })

      if (prop === 'launch_time') {
        this.tableData = tableData.sort((a, b) => {
          const aTime = new Date(a.launch_time).getTime()
          const bTime = new Date(b.launch_time).getTime()
          return isAscending ? aTime - bTime : bTime - aTime
        })
      }
    },
  },
}
</script>

<style lang="scss">
.contracts-wrapper {
  background: #ffffff;
  border-radius: 20px;
  margin-top: 24px;
  overflow: hidden;
  .head {
    display: flex;
    justify-content: space-between;
    height: 80px;
    padding: 0 30px;
  }
  .table {
    padding: 0 20px 50px 20px;
    .el-table .cell {
      padding: 0 24px 0 5px;
    }
    .new-contract {
      display: flex;
      align-items: center;
      .no {
        width: 20px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        margin-right: 20px;
      }
      .address {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 24px;
        color: #333333;
        margin-right: 10px;
      }
    }
    .name-column {
      display: flex;
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
