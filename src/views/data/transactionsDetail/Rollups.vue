<template>
  <div class="rollups-wrapper">
    <div class="head">
      <time-diff
        class="time"
        v-if="!isMobile && rollups && rollups.update_time"
        :timestamp="rollups.update_time"
      />
      <selector
        :data="selectors"
        :value="currentFilter"
        @change="(item) => (currentFilter = item.value)"
      />
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        empty-text="No Items"
        @sort-change="onSortChange"
      >
        <el-table-column fixed label="Name" width="150">
          <template slot-scope="scope">
            <div class="name-column">
              <div class="no">
                {{ scope.$index + 1 }}
              </div>
              <chains-logo :name="scope.row.rollup_name" />
              <div class="name" :title="scope.row.rollup_name">
                {{ scope.row.rollup_name }}
              </div>
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
              {{ scope.row.launch_time }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="total_tx"
          label="Total Transactions"
          width="150"
          :sortable="'custom'"
        >
          <template slot-scope="scope">
            <div class="data">
              {{
                isEmpty(scope.row.total_tx)
                  ? '-'
                  : numeral(scope.row.total_tx).format('0,0')
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="total_accounts"
          label="Total Accounts"
          width="130"
          :sortable="'custom'"
        >
          <template slot-scope="scope">
            <div class="data">
              {{
                isEmpty(scope.row.total_accounts)
                  ? '-'
                  : numeral(scope.row.total_accounts).format('0,0')
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="160"
          prop="TVL.all"
          label="TVL"
          :sortable="'custom'"
        >
          <template slot="header">
            <div class="TVL-header">TVL</div>
            <el-popover
              popper-class="TVL-popover"
              :placement="'bottom'"
              width="280"
              trigger="hover"
            >
              <div class="TVL-desc">
                Total Value Locked in Rollups & Composition of the Currency.
                <a href="#" target="_blank"> Read More </a>
              </div>
              <div class="TVL-help" slot="reference">
                <help />
              </div>
            </el-popover>
          </template>
          <template slot-scope="scope">
            <div class="TVL">
              <div class="all">
                {{ numeral(scope.row.TVL.all).format('$ 0.00 a') }}
              </div>
              <el-popover
                popper-class="TVL-popover"
                :placement="isMobile ? 'top' : 'right'"
                width="280"
                trigger="hover"
              >
                <div class="TVL-detail">
                  <div
                    class="TVL-item"
                    v-for="(item, i) in scope.row.TVL.list"
                    :key="i"
                  >
                    <div class="TVL-token">{{ item.name }}</div>
                    <div class="TVL-amount">
                      {{ numeral(item.value_usd).format('$ 0.00 a') }}
                    </div>
                    <div class="TVL-percent">
                      {{
                        numeral(item.value_usd / scope.row.TVL.all).format(
                          '0.00%'
                        )
                      }}
                    </div>
                  </div>
                </div>
                <percent
                  class="reference"
                  slot="reference"
                  :data="scope.row.TVL.list.map((item) => item.value_usd)"
                />
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="txs"
          label="Transactions"
          width="115"
          align="right"
          :sortable="'custom'"
        >
          <template slot-scope="scope">
            <div class="new-data">
              {{
                isEmpty(scope.row.txs[currentFilter])
                  ? '-'
                  : numeral(scope.row.txs[currentFilter]).format('0,0')
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Active Accounts"
          prop="active_accounts"
          width="140"
          align="right"
          :sortable="'custom'"
        >
          <template slot-scope="scope"
            ><div class="new-data">
              {{
                isEmpty(scope.row.active_accounts[currentFilter])
                  ? '-'
                  : numeral(scope.row.active_accounts[currentFilter]).format(
                      '0,0'
                    )
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="new_accounts"
          label="New Accounts"
          width="120"
          align="right"
          :sortable="'custom'"
        >
          <template slot-scope="scope"
            ><div class="new-data">
              {{
                isEmpty(scope.row.new_accounts[currentFilter])
                  ? '-'
                  : numeral(scope.row.new_accounts[currentFilter]).format('0,0')
              }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import TimeDiff from '../TimeDiff.vue'
import Selector from '../Selector.vue'
import Percent from '../Percent.vue'
import ChainsLogo from '../ChainsLogo.vue'
import Help from '../Help'
import { getRollups } from '../../../L2data/rollups'
import { isMobile } from '../../../composition/hooks'

const selectors = [
  { label: '1d', value: '1d' },
  { label: '3d', value: '3d' },
  { label: '7d', value: '7d' },
  { label: '14d', value: '14d' },
  { label: '30d', value: '30d' },
]

const isEmpty = (v) => v === ''

export default {
  data() {
    return {
      rollups: {},
      selectors,
      currentFilter: selectors[0].value,
      tableData: [],
    }
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
  },
  components: {
    TimeDiff,
    Selector,
    Percent,
    ChainsLogo,
    Help,
  },
  async mounted() {
    this.$loader.show()
    const rollups = await getRollups()
    this.$loader.hide()
    this.rollups = rollups
    this.tableData = rollups && rollups.table_data ? rollups.table_data : []
  },
  methods: {
    numeral,
    isEmpty,
    onSortChange({ prop, order }) {
      const rollups = this.rollups
      const tableData = rollups && rollups.table_data ? rollups.table_data : []

      if (!order === null) {
        this.tableData = tableData
        return
      }

      const isAscending = order === 'ascending'

      if (['total_tx', 'total_accounts'].includes(prop)) {
        this.tableData = tableData.sort((a, b) => {
          return isAscending
            ? Number(a[prop]) - Number(b[prop])
            : Number(b[prop]) - Number(a[prop])
        })
        return
      }
      if (['active_accounts', 'new_accounts', 'txs'].includes(prop)) {
        this.tableData = tableData.sort((a, b) => {
          return isAscending
            ? Number(a[prop][this.currentFilter]) -
                Number(b[prop][this.currentFilter])
            : Number(b[prop][this.currentFilter]) -
                Number(a[prop][this.currentFilter])
        })
        return
      }

      switch (prop) {
        case 'launch_time':
          this.tableData = tableData.sort((a, b) => {
            const aTime = new Date(a.launch_time).getTime()
            const bTime = new Date(b.launch_time).getTime()
            return isAscending ? aTime - bTime : bTime - aTime
          })
          break
        case 'TVL.all':
          this.tableData = tableData.sort((a, b) => {
            return isAscending
              ? Number(a.TVL.all) - Number(b.TVL.all)
              : Number(b.TVL.all) - Number(a.TVL.all)
          })
          break
        default:
          this.tableData = tableData
          break
      }
    },
  },
}
</script>

<style lang="scss">
.rollups-wrapper {
  background: #ffffff;
  border-radius: 20px;
  margin-top: 24px;
  overflow: hidden;
  .head {
    display: flex;
    justify-content: flex-end;
    height: 80px;
    padding-right: 30px;
    .time {
      margin-right: 40px;
    }
  }
  .table {
    padding: 0 20px 50px 20px;
    .name-column {
      display: flex;
      color: #333333;
      font-size: 14px;
      .no {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
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
        margin-left: 10px;
      }
    }
    .data {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: rgba(51, 51, 51, 0.8);
    }
    .TVL-header {
      display: inline-block;
    }
    .TVL-help {
      display: inline-block;
      position: absolute;
      left: 33%;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }
    .TVL {
      display: flex;
      align-items: center;
      .all {
        margin-right: 8px;
        flex: 1;
      }
      :nth-child(2) {
        width: 72px;
      }
    }
    .TVL,
    .new-data {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: #333;
    }
  }
}
.TVL-popover {
  padding: 20px;
  background: #ffffff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 0;
}
.TVL-desc {
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
.TVL-detail {
  .TVL-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .TVL-token {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      color: #333333;
    }
    .TVL-amount {
      flex: 1;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      text-align: right;
      color: rgba(51, 51, 51, 0.8);
    }
    .TVL-percent {
      margin-left: 20px;
      flex: 0 0 50px;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 24px;
      text-align: right;
      color: rgba(51, 51, 51, 0.4);
    }
  }
}

@media (max-width: 820px) {
  .rollups-wrapper {
    .head {
      justify-content: flex-start;
      padding-left: 30px;
    }
    .table {
      padding: 0 30px 50px 30px;
    }
  }
}

.dark-theme {
  .rollups-wrapper {
    background: #373951;
    .table {
      .name-column {
        color: #ffffff;
      }
      .data,
      .TVL,
      .new-data {
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}
.dark-body {
  .TVL-popover {
    background: #3f415b;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  }
  .TVL-detail {
    .TVL-token {
      color: #ffffff;
    }
    .TVL-amount {
      color: rgba(255, 255, 255, 0.6);
    }
    .TVL-percent {
      color: rgba(255, 255, 255, 0.4);
    }
  }
  .TVL-desc {
    color: rgba(255, 255, 255, 0.6);
  }
  .el-popper[x-placement^='left'] .popper__arrow::after {
    border-left-color: #3f415b;
  }
  .el-popper[x-placement^='right'] .popper__arrow::after {
    border-right-color: #3f415b;
  }
  .el-popper[x-placement^='bottom'] .popper__arrow::after {
    border-bottom-color: #3f415b;
  }
  .el-popper[x-placement^='top'] .popper__arrow::after {
    border-top-color: #3f415b;
  }
  .el-popper .popper__arrow {
    border: 0;
  }
}
</style>
