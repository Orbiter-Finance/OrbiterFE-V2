<template>
  <el-dialog
    custom-class="dapp-detail-dialog"
    :visible.sync="dialogVisible"
    append-to-body
    :show-close="false"
  >
    <div slot="title" class="dapp-detail-dialog-title">
      <dapp-logo :name="dappData.dapp_name" />
      <div class="name">{{ dappData.dapp_name }}</div>
      <span class="close" @click="dialogVisible = false"> </span>
    </div>
    <div class="dapp-detail-dialog-content">
      <div class="info">
        <div class="links">
          <icon-link :href="dappData.dapp_url" />
          <twitter-link :href="dappData.dapp_twitter" />
        </div>
        <div
          class="category"
          v-if="detailData.info && detailData.info.dapp_category"
        >
          {{ detailData.info.dapp_category }}
        </div>
        <div class="supported">Supported L2</div>
        <el-popover
          popper-class="supported-l2-popover"
          :placement="'bottom'"
          width="280"
          trigger="hover"
        >
          <div class="supported-l2-desc">
            Only the chains supported by Orbier-L2 Data are listed.
          </div>
          <span class="supported-l2-help" slot="reference"> </span>
        </el-popover>
        <div class="rollups" v-if="detailData.info">
          <rollup-logo
            :name="item"
            v-for="(item, i) in detailData.info.dapp_supported_l2"
            :key="i"
          />
        </div>
      </div>
      <div class="selectors">
        <rollups
          :customRollups="
            rollups.map((item) => ({
              value: item.toLowerCase(),
              label: item,
            }))
          "
          :onlySelect="true"
          :value="rollup"
          @rollup-change="onRollupChange"
        />
        <selector
          class="selector"
          :data="times"
          :value="currentTime"
          @change="(item) => (currentTime = item.value)"
        />
      </div>
      <div class="content">
        <div id="dapp-detail-chart"></div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import * as echarts from 'echarts'
import DappLogo from './DappLogo.vue'
import RollupLogo from './RollupLogo.vue'
import Selector from './Selector.vue'
import IconLink from './IconLink.vue'
import Rollups from './Rollups'
import TwitterLink from './TwitterLink.vue'
import { getDappDetail } from '../../L2data/dapp'
import dateFormat from '../../util/dateFormat'

const times = [
  {
    label: '1m',
    value: 1,
  },
  {
    label: '3m',
    value: 3,
  },
  {
    label: '6m',
    value: 6,
  },
  {
    label: '1y',
    value: 12,
  },
  {
    value: 'Max',
    label: 'Max',
  },
]
const ONE_MONTH = 60 * 60 * 24 * 30

export default {
  data() {
    return {
      dialogVisible: false,
      times,
      currentTime: times[0].value,
      dappData: {},
      detailData: {},
      rollups: [],
      rollup: '',
    }
  },
  computed: {
    chartData() {
      if (!this.detailData || !this.detailData.chart_data) {
        return undefined
      }
      const chartData = this.detailData.chart_data
      const currentTime = this.currentTime
      const now = new Date().getTime() / 1000
      if (currentTime === 'Max') {
        return chartData
      }
      const selectDataTime = ONE_MONTH * currentTime
      return chartData.filter((item) => item.timestamp > now - selectDataTime)
    },
  },
  watch: {
    chartData() {
      this._chart && this._chart.setOption(this._getChartOptions())
    },
  },
  components: {
    DappLogo,
    RollupLogo,
    Selector,
    IconLink,
    TwitterLink,
    Rollups,
  },
  methods: {
    show(rollup, row) {
      this.dialogVisible = true
      this.rollup = rollup
      this.rollups = [rollup]
      this.$nextTick(async () => {
        this.detailData = {}
        this._initChart()
        this.dappData = row
        this._chart.showLoading()
        const detailData = await getDappDetail(rollup, row.dapp_name)
        if (
          detailData &&
          detailData.info &&
          detailData.info.dapp_supported_l2
        ) {
          this.rollups = detailData.info.dapp_supported_l2
        }
        this.detailData = detailData
        this._chart.hideLoading()
      })
    },
    async onRollupChange(value) {
      this.rollup = value
      this.detailData = {}
      this._chart.showLoading()
      this.detailData = await getDappDetail(value, this.dappData.dapp_name)
      this._chart.hideLoading()
    },
    _initChart() {
      const chartDom = document.getElementById('dapp-detail-chart')
      const chart = echarts.init(chartDom)
      this._chart = chart
    },
    _getChartOptions() {
      const { times, allUser, activeUser, newUser } = this._getData()
      return {
        height: 160,
        title: {
          show: false,
        },
        legend: {
          bottom: 20,
          left: 'center',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: times,
            axisLine: {
              show: false,
              lineStyle: {
                color: 'rgba(51, 51, 51, 0.4)',
              },
            },
          },
        ],
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(51, 51, 51, 0.4)',
            },
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              shadowColor: '0px 4px 20px rgba(0, 0, 0, 0.2)',
            },
            label: {
              backgroundColor: '#fff',
            },
          },
        },
        series: [
          {
            name: 'All User',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 4,
              color: 'rgba(51, 51, 51, 0.8)',
            },
            showSymbol: false,
            emphasis: {
              focus: 'series',
            },
            data: allUser,
          },
          {
            name: 'Active User',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 4,
              color: 'rgba(239, 47, 45, 1)',
            },
            showSymbol: false,
            emphasis: {
              focus: 'series',
            },
            data: activeUser,
          },
          {
            name: 'New User',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 4,
              color: 'rgba(17, 112, 255, 1)',
            },
            showSymbol: false,
            emphasis: {
              focus: 'series',
            },
            data: newUser,
          },
        ],
      }
    },
    _getData() {
      if (!this.chartData) {
        return { times: [], allUser: [], activeUser: [], newUser: [] }
      }
      switch (this.currentTime) {
        case '3m':
          return {
            times: this.chartData.map((item) =>
              dateFormat(item.timestamp * 1000, 'yyyy-MM-dd')
            ),
            allUser: this.chartData.map((item) => item.all_users),
            activeUser: this.chartData.map((item) => item.active_users),
            newUser: this.chartData.map((item) => item.new_users),
          }
        default:
          return {
            times: this.chartData.map((item) =>
              dateFormat(item.timestamp * 1000, 'yyyy-MM-dd')
            ),
            allUser: this.chartData.map((item) => item.all_users),
            activeUser: this.chartData.map((item) => item.active_users),
            newUser: this.chartData.map((item) => item.new_users),
          }
      }
    },
  },
}
</script>

<style lang="scss">
.dapp-detail-dialog {
  border-radius: 20px;
  width: 880px;
  .el-dialog__header {
    padding-bottom: 0;
  }
  .el-dialog__body {
    padding: 12px 30px;
  }
  .dapp-detail-dialog-title {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .name {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      color: #333333;
      margin-left: 10px;
    }
    .close {
      position: absolute;
      right: 0;
      width: 24px;
      height: 24px;
      cursor: pointer;
      background-image: url('../../assets/data/close.png');
      background-size: 24px 24px;
    }
  }
  .dapp-detail-dialog-content {
    .info {
      display: flex;
      align-items: center;
      line-height: 24px;
      .links {
        display: flex;
        align-items: center;
        position: relative;
        padding: 0 10px;
        height: 24px;
        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 4px;
          bottom: 4px;
          background: rgba(51, 51, 51, 0.2);
          width: 2px;
        }
        a {
          &:first-child {
            margin-right: 8px;
          }
        }
      }
      .category {
        position: relative;
        padding: 0 10px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        color: rgba(51, 51, 51, 0.69);
        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 4px;
          bottom: 4px;
          background: rgba(51, 51, 51, 0.2);
          width: 2px;
          height: 16px;
        }
      }
      .supported {
        padding: 0 4px 0 10px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        color: rgba(51, 51, 51, 0.69);
      }
      span {
        display: inline-block;
        height: 24px;
      }
    }
    .rollups {
      margin-left: 25px;
      img {
        margin-right: 5px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .selectors {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    .content {
      margin-top: 20px;
      background: #f5f5f5;
      #dapp-detail-chart {
        height: 300px;
      }
    }
  }
}
@media (max-width: 880px) {
  .dapp-detail-dialog {
    width: 100vw;
    .dapp-detail-dialog-content {
      .selectors {
        flex-direction: column;
        .selector {
          margin-top: 20px;
        }
      }
    }
  }
}
.supported-l2-help {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-image: url('../../assets/data/help.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 12px 12px;
  cursor: pointer;
}
.dark-body {
  .dapp-detail-dialog {
    background: #373951;
    box-shadow: 0px 8px 50px rgba(0, 0, 0, 0.5);
    .dapp-detail-dialog-title {
      .name {
        color: #fff;
      }
      .close {
        background-image: url('../../assets/data/close-dark.png');
      }
    }
    .dapp-detail-dialog-content {
      .info {
        .links {
          &::after {
            background: rgba(255, 255, 255, 0.2);
          }
        }
        .category {
          color: rgba(255, 255, 255, 0.6);
          &::after {
            background: rgba(255, 255, 255, 0.2);
          }
        }
        .supported {
          color: rgba(255, 255, 255, 0.6);
        }
      }
      .content {
        background: #3f415b;
      }
    }
  }
}
.new-user-age-desc {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(51, 51, 51, 0.8);
}
.supported-l2-popover {
  padding: 20px;
  background: #ffffff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 0;
}
.dark-body {
  .supported-l2-popover {
    background: #3f415b;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  }
  .supported-l2-desc {
    color: rgba(255, 255, 255, 0.6);
  }
  .supported-l2-help {
    background-image: url('../../assets/data/help-dark.png');
  }
}
</style>
