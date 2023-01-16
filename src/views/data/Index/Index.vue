<template>
  <div class="l2data">
    <Chart />
    <div class="dapp-daily-data">
      <div class="head">
        <rollups
          :customRollups="rollups"
          :value="currentRollup"
          @rollup-change="(value) => (currentRollup = value)"
        />
        <div
          class="more"
          @click="
            $router.push({
              path: '/dataDetail',
              query: { nav: 'Dapps' },
            })
          "
        >
          More
          <img src="../../../assets/data/right.png" width="8" height="12" />
        </div>
      </div>
      <div class="title">
        {{ name }} Dapp Daily Data
        {{
          !isMobile && baseDappDailyData && baseDappDailyData.update_time
            ? ',' +
              dateFormat(
                (baseDappDailyData.update_time - 60 * 60 * 24) * 1000,
                'yyyy-MM-dd'
              )
            : isMobile
            ? ''
            : '-'
        }}
        <time-diff
          v-if="!isMobile && baseDappDailyData && baseDappDailyData.update_time"
          :timestamp="baseDappDailyData.update_time"
        />
      </div>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" empty-text="No Items" @sort-change="onSortChange">
          <el-table-column
            fixed
            label="Dapp Name"
            :width="isMobile ? 200 : 300"
          >
            <template slot-scope="scope">
              <div class="name-column">
                <template>
                  <div class="rank" v-if="scope.row.rank !== 0">
                    {{ scope.row.rank }}
                  </div>
                  <div class="new" v-else>
                    <span> NEW </span>
                  </div>
                </template>
                <dapp-logo
                  :name="scope.row.dapp_name"
                  :rollup="currentRollup"
                />
                <div @click="onRowClick(scope.row)" class="name" :title="scope.row.dapp_name">
                  {{ scope.row.dapp_name }}
                </div>
                <div v-if="!isMobile" style="width: 50px;display: flex">
                  <template v-if="scope.row.rank === 0">
                    <scan-link
                            :href="scope.row.dapp_url"
                            :width="13"
                            :height="13"
                    />
                  </template>
                  <template v-else>
                    <icon-link :href="scope.row.dapp_url" />
                    <twitter-link
                            v-if="scope.row.dapp_twitter"
                            :href="scope.row.dapp_twitter"
                    />
                  </template>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="launch_time" label="Launch Date" width="140" align="right"
                           :sortable="'custom'" :sort-orders="['descending', 'ascending', null]">
            <template slot-scope="scope">
              <div class="data">
                {{ dateFormat(scope.row.launch_time, 'yyyy-MM-dd') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="all_users" label="All Users" width="110" align="right"
                           :sortable="'custom'" :sort-orders="['descending', 'ascending', null]">
            <template slot-scope="scope">
              <div class="data">
                {{ numeral(scope.row.all_users).format('0,0') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="24h_active_users" label="24h Active Users" width="180" align="right"
                           :sortable="'custom'" :sort-orders="['descending', 'ascending', null]">
            <template slot-scope="scope">
              <div class="data">
                {{ numeral(scope.row['24h_active_users']).format('0,0') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="24h_new_users" label="24h New Users" width="170" align="right"
                           :sortable="'custom'" :sort-orders="['descending', 'ascending', null]">
            <template slot-scope="scope">
              <div class="data">
                {{ numeral(scope.row['24h_new_users']).format('0,0') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="24h_interactions" label="24h Interactions" width="180" align="right"
                           :sortable="'custom'" :sort-orders="['descending', 'ascending', null]">
            <template slot-scope="scope">
              <div class="data">
                {{ numeral(scope.row['24h_interactions']).format('0,0') }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <dapp-detail ref="dappDetail" />
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import Chart from './Chart'
import Rollups from '../Rollups.vue'
import TimeDiff from '../TimeDiff.vue'
import IconLink from '../IconLink.vue'
import ScanLink from '../ScanLink.vue'
import TwitterLink from '../TwitterLink.vue'
import DappDetail from '../DappDetail'
import DappLogo from '../DappLogo.vue'
import { getDappDailyData } from '../../../L2data/daily'
import dateFormat from '../../../util/dateFormat'
import { isMobile } from '../../../composition/hooks'
import { getTabRollups } from '../../../L2data/rollups'

export default {
  data() {
    return {
      currentRollup: undefined,
      baseDappDailyData: {},
      tableData: [],
      rollups: [],
      currentSort: { prop: '24h_active_users', order: 'descending' }
    }
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
    name() {
      const rollup = this.rollups.find(
        (item) => item.value === this.currentRollup
      )
      return rollup ? rollup.label : ''
    },
  },
  watch: {
    currentRollup() {
      this._getDappDailyData()
    },
  },
  components: {
    Chart,
    Rollups,
    TimeDiff,
    DappLogo,
    IconLink,
    TwitterLink,
    ScanLink,
    DappDetail
  },
  async mounted() {
    this.rollups = await getTabRollups('mainpage')
    this.currentRollup = this.rollups[0].value
  },
  methods: {
    numeral,
    dateFormat,
    async _getDappDailyData() {
      const baseDappDailyData = await getDappDailyData(this.currentRollup)
      this.baseDappDailyData = baseDappDailyData

      const table_data = baseDappDailyData && baseDappDailyData.table_data
      this.tableData = table_data
    },
    onSortChange({ prop, order }) {
      let tableData = JSON.parse(JSON.stringify(this.tableData));
      const isAscending = order === 'ascending';

      this.currentSort = {
        prop, order
      };

      if (!order === null) {
        this.tableData = tableData;
        return;
      }

      if (prop === 'all_users') {
        tableData = tableData.sort((a, b) => {
          const aAll = a.all_users;
          const bAll = b.all_users;
          if (!a.rank) return false;
          if (!b.rank) return true;
          return isAscending ? aAll - bAll : bAll - aAll;
        });
      }

      if (
              ['24h_active_users', '24h_new_users', '24h_interactions'].includes(
                      prop
              )
      ) {
        tableData = tableData.sort((a, b) => {
          const aData = a[prop];
          const bData = b[prop];
          if (!a.rank) return false;
          if (!b.rank) return true;
          return isAscending ? aData - bData : bData - aData;
        });
      }

      if (prop === 'launch_time') {
        tableData = tableData.sort((a, b) => {
          const aTime = new Date(a.launch_time).getTime();
          const bTime = new Date(b.launch_time).getTime();
          if (!a.rank) return false;
          if (!b.rank) return true;
          return isAscending ? aTime - bTime : bTime - aTime;
        });
      }
      const rankList = tableData.filter(item => item.rank);
      const fixList = tableData.filter(item => !item.rank);
      for (let i = 0; i < rankList.length; i++) {
        rankList[i].rank = i + 1;
      }
      this.tableData = [...fixList, ...rankList];
    },
    onRowClick(row){
      this.$refs.dappDetail.show(this.currentRollup, row)
    },
  },
}
</script>

<style lang="scss">
.l2data {
  max-width: 1120px;
  margin: 0 auto;

  .dapp-daily-data {
    max-width: 1120px;
    background: #ffffff;
    border-radius: 20px;
    margin-top: 20px;

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      height: 80px;
      padding: 0 30px;

      .more {
        font-style: normal;
        font-family: 'Inter Regular';
        display: flex;
        align-items: center;
        position: absolute;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        font-weight: 400;
        font-size: 14px;
        color: #df2e2d;
        cursor: pointer;

        img {
          margin-left: 5px;
        }
      }
    }

    .title {
      display: flex;
      align-items: center;
      padding: 0 30px;
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      color: #333333;

      div {
        margin-left: 10px;
      }
    }

    .table {
      margin-top: 10px;
      padding: 0 20px 50px 20px;

      .el-table th.el-table__cell > .cell {
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
        background-color: #ffffff;
      }

      .el-table tbody tr:hover > td {
        background-color: #ffffff;
      }

      .el-table td.el-table__cell,
      .el-table th.el-table__cell {
        padding: 6px 10px;
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

      .el-table .cell {
        padding: 0;
      }

      .el-table__row:nth-child(-n + 3) {
        background: #f5f5f5;
      }

      .el-table__body tr.hover-row:nth-child(-n + 3) > td.el-table__cell {
        background: #f5f5f5;
      }

      .el-table tbody tr:nth-child(-n + 3):hover > td {
        background-color: #ffffff;
      }

      .name-column {
        display: flex;
        align-items: center;
        font-family: 'Inter Regular';
        color: #333333;

        .rank {
          width: 32px;
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          margin-right: 12px;
        }

        .new {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 16px;
          background: #df2e2d;
          border-radius: 4px;
          margin-right: 12px;

          span {
            font-style: normal;
            font-weight: 500;
            color: #ffffff;
            font-size: 12px;
            zoom: 0.83;
          }
        }

        .name {
          width: 150px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
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
        padding-right: 24px;
      }
    }
  }
}

.dark-theme {
  .l2data {
    .dapp-daily-data {
      background: var(--dark-page-bg);

      .title {
        color: #fff;
      }

      .table {
        .el-table,
        .el-table__expanded-cell,
        .el-table th.el-table__cell,
        .el-table tr,
        .el-table__body tr.hover-row > td.el-table__cell,
        .el-table tbody tr:hover > td {
          background-color: #373951;
        }

        .el-table td.el-table__cell {
          color: rgba(255, 255, 255, 0.6);
        }

        .el-table th.el-table__cell {
          color: #fff;
        }

        .data {
          color: rgba(255, 255, 255, 0.6);
        }

        .name-column {
          color: #fff;
        }

        .el-table .sort-caret.ascending {
          border-bottom-color: #fff;
        }
        .el-table .sort-caret.descending {
          border-top-color: #fff;
        }
        .el-table .descending .sort-caret.descending {
          border-top-color: #df2e2d;
        }
        .el-table .ascending .sort-caret.ascending {
          border-bottom-color: #df2e2d;
        }
      }
    }
  }
}

@media (max-width: 820px) {
  .l2data {
    margin-top: 20px;

    .dapp-daily-data {
      .table {
        margin-top: 20px;
        padding: 0 30px 50px 30px;
      }
    }
  }
}
</style>
