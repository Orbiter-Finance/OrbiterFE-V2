<template>
  <div class="contracts-wrapper">
    <div class="head">
      <rollups :customRollups="rollups" :value="currentRollup"
        @rollup-change="rollupChange" />
      <time-diff class="time" v-if="!isMobile && contracts && contracts.update_time"
        :timestamp="contracts.update_time" />
    </div>
    <div class="table">
      <el-table :data="currentTableData" style="width: 100%" :default-sort="defaultSort" empty-text="No Items"
        @sort-change="onSortChange">
        <el-table-column fixed prop="contract_address" label="New Contract" width="160">
          <template slot-scope="scope">
            <div class="new-contract">
              <div class="no">
                {{ scope.row.index }}
              </div>
              <div class="address" :title="scope.row.contract_address">
                {{ shortenAddress(scope.row.contract_address, 2) }}
              </div>
              <scan-link :href="scope.row.scan_url" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Name" width="165">
          <template slot-scope="scope">
            <div class="name-column">
              <dapp-logo :name="scope.row.dapp_name" />
              <div class="name" :title="scope.row.dapp_name">
                {{ scope.row.dapp_name }}
              </div>
              <icon-link :href="scope.row.dapp_url" v-if="scope.row.dapp_url" />
              <twitter-link :href="scope.row.twitter_url" v-if="scope.row.twitter_url" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="launch_time" label="Launch Date" width="125"
          :sort-orders="['descending', 'ascending', null]" :sortable="'custom'">
          <template slot-scope="scope">
            <div class="data">
              {{ dateFormat(scope.row.launch_time_str, 'yyyy-MM-dd') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="all_users" label="All Users" width="90" align="right"
          :sort-orders="['descending', 'ascending', null]" :sortable="'custom'">
          <template slot-scope="scope">
            <div class="data">
              {{ numeral(scope.row.all_users).format('0,0') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="users_age" label="Users Age" width="95" align="right">
          <template slot="header">
            <div class="user-age-header">Users Age</div>
            <el-popover popper-class="user-age-header-popover" :placement="'bottom'" width="280" trigger="hover">
              <div class="user-age-desc">
                Statistics for all users. " Users Age " refers to the cumulative
                days since users started the first transaction on the mainnet.
                <a href="https://docs.orbiter.finance/l2data" target="_blank"> Read More </a>
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
        <el-table-column prop="24h_active_users" label="24h Active Users" width="155" align="right"
          :sort-orders="['descending', 'ascending', null]" :sortable="'custom'">
          <template slot-scope="scope">
            <div class="data">
              {{ numeral(scope.row['24h_active_users']).format('0,0') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="24h_new_users" label="24h New Users" width="140" align="right"
          :sort-orders="['descending', 'ascending', null]" :sortable="'custom'">
          <template slot-scope="scope">
            <div class="data">
              {{ numeral(scope.row['24h_new_users']).format('0,0') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="24h_interactions" label="24h Interactions" width="150" align="right"
          :sort-orders="['descending', 'ascending', null]" :sortable="'custom'">
          <template slot-scope="scope">
            <div class="data">
              {{ numeral(scope.row['24h_interactions']).format('0,0') }}
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
import dateFormat from '../../../util/dateFormat'
import { getContracts } from '../../../L2data/contracts'
import { shortenAddress } from '../../../util/shortenAddress'
import { isMobile } from '../../../composition/hooks'
import { getTabRollups } from '../../../L2data/rollups'
import Common from '../Common'

const PAGE_SIZE = 30

export default {
  mixins: [Common],
  data() {
    return {
      PAGE_SIZE,
      defaultSort: { prop: 'launch_time', order: 'descending' },
      currentSort: undefined,
      rollups: [],
      currentRollup: undefined,
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
    async currentRollup() {
      this.contracts = {}
      this.tableData = []
      this.page = 1
      await this._getContracts()
      if (this.currentSort) {
        this.onSortChange(this.currentSort)
      }
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
    this.rollups = await getTabRollups('contracts')
    this.allTab = this.rollups.map(item => item.value);
  },
  methods: {
    numeral,
    shortenAddress,
    dateFormat,
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
      return allData.sort((a, b) => {
        const aTime = new Date(a.launch_time).getTime()
        const bTime = new Date(b.launch_time).getTime()
        return bTime - aTime
      })
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
      if (prop === 'launch_time') {
        this.tableData = tableData.sort((a, b) => {
          const aTime = new Date(a.launch_time).getTime()
          const bTime = new Date(b.launch_time).getTime()
          return isAscending ? aTime - bTime : bTime - aTime
        })
      }
      this.tableData = tableData.sort((a, b) => {
        const aData = Number(a[prop])
        const bData = Number(b[prop])
        return isAscending ? aData - bData : bData - aData
      })
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
      // padding: 0 10px 0 5px;
      padding-right: 16px;
    }

    .el-table th.el-table__cell>.cell {
      display: inline-flex;
      align-items: center;
      justify-content: right;
      flex-wrap: nowrap;
    }
    .el-table th.el-table__cell:nth-child(1)>.cell, .el-table th.el-table__cell:nth-child(2)>.cell, .el-table th.el-table__cell:nth-child(3)>.cell {
      justify-content: left;
    }
    .new-contract {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #333333;
      font-family: 'Inter Regular';

      .no {
        width: 20px;
        font-style: normal;
        font-weight: 400;
        margin-right: 20px;
      }

      .address {
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        margin-right: 7px;
        white-space: nowrap;
      }
    }

    .name-column {
      display: flex;
      font-family: 'Inter Regular';

      .name {
        width: 70px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        color: #333333;
        margin: 0 10px;
      }

      a {
        margin-right: 10px;

        &:last-child {
          margin-right: 0;
        }
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

.user-age-header {
  display: inline-block;
}

.user-age-help {
  display: inline-block;
  margin-left: 4px;
  cursor: pointer;
}

.user-age-desc {
  word-wrap: break-word;
  word-break: normal;
  text-align: left;
  font-style: normal;
  font-family: 'Inter Regular';
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(51, 51, 51, 0.8);

  a {
    display: block;
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

      .new-contract {
        .no {
          margin-right: 5px;
        }
      }

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
