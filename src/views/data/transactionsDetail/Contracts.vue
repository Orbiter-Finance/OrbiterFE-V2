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
              <scan-link :href="scope.row.scan_url" />
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
              <icon-link :href="scope.row.dapp_url" />
              <twitter-link :href="scope.row.dapp_twitter" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
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
          <template slot="header">
            <div class="user-age-header">Users Age</div>
            <el-popover
              popper-class="user-age-header-popover"
              :placement="'bottom'"
              width="280"
              trigger="hover"
            >
              <div class="user-age-desc">
                Statistics for all users. Users-Age means the cumulative days
                since users started the first transaction in the Ethereum.
                <a href="#" target="_blank"> Read More </a>
              </div>
              <div class="user-age-help" slot="reference">
                <help />
              </div>
            </el-popover>
          </template>
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
import IconLink from '../IconLink.vue'
import TwitterLink from '../TwitterLink.vue'
import ScanLink from '../ScanLink.vue'
import Help from '../Help'
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
    IconLink,
    TwitterLink,
    ScanLink,
    Help,
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
      this.$loader.show()
      const contracts = await getContracts(this.currentRollup)
      this.$loader.hide()
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
      font-size: 14px;
      color: #333333;
      .no {
        width: 20px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        margin-right: 20px;
      }
      .address {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
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
.user-age-header {
  display: inline-block;
}
.user-age-help {
  display: inline-block;
  margin-left: 4px;
  cursor: pointer;
}
.user-age-desc {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(51, 51, 51, 0.8);
  a {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #df2e2d;
  }
}
.user-age-header-popover {
  padding: 20px;
  background: #ffffff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 0;
}
@media (max-width: 820px) {
  .contracts-wrapper {
    .head {
      flex-direction: column;
      height: auto;
      padding-top: 24px;
      padding-bottom: 14px;
    }
    .table {
      padding: 0 30px 50px 30px;
      .pagination {
        justify-content: center;
      }
    }
  }
}
.dark-theme {
  .contracts-wrapper {
    background: #373951;
    .table {
      .new-contract {
        color: #fff;
      }
      .name-column {
        .name {
          color: #fff;
        }
      }
    }
  }
}
.dark-body {
  .user-age-header-popover {
    background: #3f415b;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  }
  .user-age-desc {
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
