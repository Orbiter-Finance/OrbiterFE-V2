<template>
  <div class="rollups-wrapper">
    <div class="head">
      <time-diff class="time" v-if="!isMobile && rollups && rollups.update_time" :timestamp="rollups.update_time" />
      <selector :data="selectors" :value="currentFilter" @change="(item) => (currentFilter = item.value)" />
    </div>
    <div class="table">
      <el-table :data="indexTableData" style="width: 100%" empty-text="No Items" :default-sort="defaultSort"
        @sort-change="onSortChange">
        <el-table-column fixed label="NO. Name" width="140">
          <template slot-scope="scope">
            <div class="name-column">
              <div class="no">
                {{ scope.row.index }}
              </div>
              <chains-logo :name="scope.row.rollup_name" />
              <div class="name_box" @click="onRowClick(scope.row)"> 
                <div class="name" :title="scope.row.rollup_name">
                  {{ scope.row.rollup_name }}
                </div>
                <div class="icon" v-if="!!scope.row.details">
                  <svg-icon-themed icon="searchChartIcon" size="lg"></svg-icon-themed>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="launch_time" label="Launch Date" width="110" align="right" :sortable="'custom'"
          :sort-orders="['descending', 'ascending', null]">
          <template slot-scope="scope">
            <div class="data">
              {{ dateFormat(scope.row.launch_time, 'yyyy-MM-dd') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="total_tx" label="Total Transactions" width="145" align="right" :sortable="'custom'"
          :sort-orders="['descending', 'ascending', null]">
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
        <el-table-column prop="total_accounts" label="Total Accounts" width="125" align="right" :sortable="'custom'"
          :sort-orders="['descending', 'ascending', null]">
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
        <el-table-column width="175" prop="TVL.all" label="TVL" :sortable="'custom'"
          :sort-orders="['descending', 'ascending', null]">
          <template slot="header">
            <div class="TVL-header">TVL</div>
            <el-popover popper-class="TVL-popover" :placement="'bottom'" width="280" trigger="hover">
              <div class="TVL-desc">
                Total Value Locked in Rollups & Types of cryptocurrencies.
                <a href="https://docs.orbiter.finance/l2data" target="_blank"> Read More </a>
              </div>
              <div class="TVL-help" slot="reference">
                <help />
              </div>
            </el-popover>
          </template>
          <template slot-scope="scope">
            <div class="TVL">
              <div class="all">
                {{ formatUSD(scope.row.TVL.all) }}
              </div>
              <el-popover popper-class="TVL-popover" :placement="isMobile ? 'top' : 'right'" width="300"
                trigger="hover">
                <div class="TVL-detail">
                  <div class="TVL-item">
                    <div class="TVL-token">Stable Coins</div>
                    <div class="TVL-amount">
                      {{ formatUSD(scope.row.TVL.Stable) }}
                    </div>
                    <div class="TVL-percent">
                      {{
                      numeral(
                      scope.row.TVL.Stable / scope.row.TVL.all
                      ).format('0.00%')
                      }}
                    </div>
                  </div>
                  <div class="TVL-item">
                    <div class="TVL-token">ETH/BTC</div>
                    <div class="TVL-amount">
                      {{ formatUSD(scope.row.TVL.BTC + scope.row.TVL.ETH) }}
                    </div>
                    <div class="TVL-percent">
                      {{
                      numeral(
                      (scope.row.TVL.BTC + scope.row.TVL.ETH) /
                      scope.row.TVL.all
                      ).format('0.00%')
                      }}
                    </div>
                  </div>
                  <div class="TVL-item">
                    <div class="TVL-token">Others</div>
                    <div class="TVL-amount">
                      {{ formatUSD(scope.row.TVL.Others) }}
                    </div>
                    <div class="TVL-percent">
                      {{
                      numeral(
                      scope.row.TVL.Others / scope.row.TVL.all
                      ).format('0.00%')
                      }}
                    </div>
                  </div>
                </div>
                <percent class="reference" slot="reference" :data="[
                  scope.row.TVL.BTC + scope.row.TVL.ETH,
                  scope.row.TVL.Others,
                  scope.row.TVL.Stable,
                ]" />
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="txs" label="Transactions" width="115" align="right" :sortable="'custom'"
          :sort-orders="['descending', 'ascending', null]">
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
        <el-table-column label="Active Accounts" prop="active_accounts" width="135" align="right" :sortable="'custom'"
          :sort-orders="['descending', 'ascending', null]">
          <template slot-scope="scope">
            <div class="new-data">
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
        <el-table-column prop="new_accounts" label="New Accounts" width="120" align="right" :sortable="'custom'"
          :sort-orders="['descending', 'ascending', null]">
          <template slot-scope="scope">
            <div class="new-data">
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
    <rollup-detail @close="closeDappDetail" ref="rolluoDetail"></rollup-detail>
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
import dateFormat from '../../../util/dateFormat'
import RollupDetail from '../RollupDetail.vue'
import SvgIconThemed from '../../../components/SvgIconThemed.vue'
import Common from '../Common'

const selectors = [
  { label: '1d', value: '1d' },
  { label: '3d', value: '3d' },
  { label: '7d', value: '7d' },
  { label: '14d', value: '14d' },
  { label: '30d', value: '30d' },
]

const isEmpty = (v) => v === ''

export default {
  mixins: [Common],
  data() {
    return {
      rollups: {},
      defaultSort: { prop: 'total_tx', order: 'descending' },
      selectors,
      currentSort: undefined,
      currentFilter: selectors[0].value,
      tableData: [],
    }
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
    indexTableData() {
      return this.tableData.map((item, i) => ({ index: i + 1, ...item }))
    },
  },
  watch: {
    currentFilter() {
      if (this.currentSort) {
        this.onSortChange(this.currentSort)
      }
    }
  },
  components: {
    TimeDiff,
    Selector,
    Percent,
    ChainsLogo,
    Help,
    RollupDetail,
    SvgIconThemed
},
  async mounted() {
    this.$loader.show()
    const rollups = await getRollups()
    this.$loader.hide()
    this.rollups = rollups
    this.tableData = this._getDefaultTableData()
  },
  methods: {
    numeral,
    dateFormat,
    isEmpty,
    onSortChange({ prop, order }) {
      this.currentSort = {
        prop, order
      }

      const rollups = this.rollups
      const tableData =
        rollups && rollups.table_data
          ? Object.keys(rollups.table_data).map((item) => ({
            rollup_name: item,
            ...rollups.table_data[item],
          }))
          : []

      if (!order === null) {
        this.tableData = this._getDefaultTableData()
        return
      }

      const isAscending = order === 'ascending'

      if (['total_tx', 'total_accounts'].includes(prop)) {
        this.tableData = tableData.sort((a, b) => {
          const nA = isEmpty(a[prop]) ? 0 : a[prop]
          const nB = isEmpty(b[prop]) ? 0 : b[prop]
          return isAscending ? nA - nB : nB - nA
        })
        return
      }
      if (['active_accounts', 'new_accounts', 'txs'].includes(prop)) {
        this.tableData = tableData.sort((a, b) => {
          const nA = Number(a[prop][this.currentFilter])
          const nB = Number(b[prop][this.currentFilter])
          return isAscending ? nA - nB : nB - nA
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
            const nA = Number(a.TVL.all)
            const nB = Number(b.TVL.all)
            return isAscending ? nA - nB : nB - nA
          })
          break
        default:
          this.tableData = this._getDefaultTableData()
          break
      }
    },
    _getDefaultTableData() {
      const rollups = this.rollups
      const tableData =
        rollups && rollups.table_data
          ? Object.keys(rollups.table_data).map((item) => ({
            rollup_name: item,
            ...rollups.table_data[item],
          }))
          : []

      return tableData.sort((a, b) => {
        const nA = isEmpty(a.total_tx) ? 0 : a.total_tx
        const nB = isEmpty(b.total_tx) ? 0 : b.total_tx
        return nB - nA
      })
    },
    formatUSD(num) {
      if (num < 1000000) {
        return `$ ${numeral(num).divide(1000000).format('0.00')} M`
      }
      return numeral(num).format('$ 0.00 a').toUpperCase()
    },
    onRowClick(row) {
      this.handleRoute({ floater: row.rollup_name });
    },
    handleRoute({ floater }) {
      const { path, query } = this.$route;
      const newQuery = JSON.parse(JSON.stringify(query || {}));
      if (floater instanceof Array) {
        floater = floater[0];
      }
      if (floater) {
        if (newQuery?.floater !== floater) {
          newQuery.floater = floater;
          this.$refs.rolluoDetail.show(this.indexTableData.find(item => item.rollup_name === floater), true);
          let suffixArr = [];
          for (const key in newQuery) {
            suffixArr.push(`${ key }=${ newQuery[key] }`);
          }
          const newPath = path + '?' + suffixArr.join('&');
          this.$router.replace({ path: newPath, query: newQuery });
        } else {
          const row = this.indexTableData.find(item => item.rollup_name === floater);
          if (row) {
            this.$refs.rolluoDetail.show(row, true);
          } else {
            this.closeDappDetail();
          }
        }
      }
    }
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

    .el-table th.el-table__cell>.cell {
      display: inline-flex;
      align-items: center;
      justify-content: right;
      flex-wrap: nowrap;

      // .caret-wrapper {
      //   margin-left: auto;
      // }
    }
    .el-table th.el-table__cell:nth-child(1)>.cell {
      justify-content: left;
    }
    .el-table th.el-table__cell:nth-child(5)>.cell {
      justify-content: left;
    }
    .sort-caret {
      left: 6px;
    }
    .name-column {
      font-family: 'Inter Regular';
      display: flex;
      color: #333333;
      font-size: 14px;

      .no {
        min-width: 20px;
        font-style: normal;
        font-weight: 400;
        margin-right: 4px;
      }

      .icon {
        position: absolute;
        right: -17px;
        top: 65%;
        transform: translateY(-50%);
        // color: #df2e2d;
        i, svg {
          width: 18px;
          font-weight: bolder;
        }
      }

      .name_box {
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
      }

      .name {
        cursor: pointer;
        width: 70px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-style: normal;
        font-weight: 500;
        margin-left: 5px;
      }
    }

    .data {
      font-family: 'Inter Regular';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      padding-right: 16px;
      color: rgba(51, 51, 51, 0.8);
    }

    .TVL-header {
      padding-left: 22px;
      display: inline-block;
    }

    .TVL-help {
      display: inline-block;
      position: absolute;
      left: 44%;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }

    .TVL {
      display: flex;
      align-items: center;
      padding-left: 10px;

      .all {
        margin-right: 5px;
        flex: 1;
      }

      :nth-child(2) {
        width: 65px;
      }
    }

    .TVL,
    .new-data {
      font-family: 'Inter Regular';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: #333;
    }
    .new-data {
      padding-right: 16px;
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
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  word-wrap: break-word;
  word-break: normal;
  text-align: left;
  font-family: 'Inter Regular';
  color: rgba(51, 51, 51, 0.8);

  a {
    display: block;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #df2e2d;
  }
}

.TVL-detail {
  font-family: 'Inter Regular';

  .TVL-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .TVL-token {
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      color: #333333;
    }

    .TVL-amount {
      flex: 1;
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      text-align: right;
      color: rgba(51, 51, 51, 0.8);
    }

    .TVL-percent {
      margin-left: 20px;
      flex: 0 0 60px;
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

      .el-table th.el-table__cell>.cell {
        font-size: 12px;
      }
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
