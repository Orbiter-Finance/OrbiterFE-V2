<template>
  <el-dialog
    custom-class="dapp-detail-dialog"
    :visible.sync="dialogVisible"
    append-to-body
    :margin-top="isMobile ? '5%' : '15vh'"
    :show-close="false"
  >
    <div slot="title" class="dapp-detail-dialog-title">
      <dapp-logo class="logo" :name="dappData.dapp_name" />
      <div class="name">{{ dappData.dapp_name }}</div>
      <span class="close" @click="close"> </span>
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
        <div class="supported" v-if="!isMobile">Supported L2</div>
        <el-popover
          v-if="!isMobile"
          popper-class="supported-l2-popover"
          :placement="'bottom'"
          width="280"
          trigger="hover"
        >
          <div class="supported-l2-desc">
            Only the chains supported by Orbiter-L2 Data are listed.
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
              value: item.replace(/\s+/g, '').toLowerCase(),
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
        <div class="title">
          User Statistics
          <el-popover
            popper-class="supported-l2-popover"
            :placement="'bottom'"
            width="280"
            trigger="hover"
          >
            <div class="supported-l2-desc">
              Active Users & Corresponding percentage of total users. <br />
              New Users & Corresponding percentage of total users.
              <a href="https://docs.orbiter.finance/l2data" target="_blank"> Read More </a>
            </div>
            <span class="title-help" slot="reference"> </span>
          </el-popover>
        </div>
        <div id="dapp-detail-chart"></div>
        <div class="checker">
          <div
            class="item"
            v-for="(item, i) in allSeries"
            :key="i"
            @click="onCheckerClick(1,item)"
          >
            <div
              class="checkbox"
              :class="{ active: checkData.includes(item) }"
            ></div>
            <div class="line" :style="{ background: color[i] }"></div>
            <div class="name">{{ item }}</div>
          </div>
        </div>
      </div>
      <div :hidden="!interactionsShow" class="content">
        <div class="title">
          Interactions Statistics
          <el-popover
                  popper-class="supported-l2-popover"
                  :placement="'bottom'"
                  width="280"
                  trigger="hover"
          >
            <div class="supported-l2-desc">
              Bridge Interactions percentage of total Interactions. <br />
              Other Interactions percentage of total Interactions.
              <a href="https://docs.orbiter.finance/l2data" target="_blank"> Read More </a>
            </div>
            <span class="title-help" slot="reference"> </span>
          </el-popover>
        </div>
        <div id="dapp-detail-interactions-chart"></div>
        <div class="checker">
          <div
                  class="item"
                  v-for="(item, i) in allInteractionsSeries"
                  :key="i"
                  @click="onCheckerClick(2,item)"
          >
            <div
                    class="checkbox"
                    :class="{ active: checkInteractionsData.includes(item) }"
            ></div>
            <div class="line" :style="{ background: color[i] }"></div>
            <div class="name">{{ item }}</div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import numeral from 'numeral'
import * as echarts from 'echarts'
import DappLogo from './DappLogo.vue'
import RollupLogo from './RollupLogo.vue'
import Selector from './Selector.vue'
import IconLink from './IconLink.vue'
import Rollups from './Rollups'
import TwitterLink from './TwitterLink.vue'
import { getDappDetail } from '../../L2data/dapp'
import dateFormat from '../../util/dateFormat'
import { isMobile } from '../../composition/hooks'

const allSeries = ['All Users', 'Active Users', 'New Users']
const allInteractionsSeries = ['All Interactions', 'Bridge Interactions', 'Other Interactions'];
const color = [
  'rgba(0, 0, 255, 0.8)',
  'rgba(239, 47, 45, 1)',
  'rgba(17, 112, 255, 1)',
]
const colorMap = {
  'All Users': 'rgba(0, 0, 255, 0.8)',
  'Active Users': 'rgba(239, 47, 45, 1)',
  'New Users': 'rgba(17, 112, 255, 1)',
  'All Interactions': 'rgba(0, 0, 255, 0.8)',
  'Bridge Interactions': 'rgba(239, 47, 45, 1)',
  'Other Interactions': 'rgba(17, 112, 255, 1)',
}
const times = [
  { label: '1m', value: 1 },
  { label: '3m', value: 3 },
  { label: '6m', value: 6 },
  { label: '1y', value: 12 },
  { value: 'Max', label: 'Max' },
]
const isMax = (value) => value === 'Max'
const padTimestamp = (timestamp) => timestamp * 1000

const ONE_MONTH = 60 * 60 * 24 * 30

export default {
  data() {
    return {
      dialogVisible: false,
      times,
      currentTime: times[1].value,
      dappData: {},
      detailData: {},
      rollups: [],
      rollup: '',
      allSeries,
      allInteractionsSeries,
      color,
      checkData: ['New Users', 'Active Users'],
      checkInteractionsData: ['All Interactions', 'Bridge Interactions', 'Other Interactions'],
      interactionsShow: true
    }
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
    chartData() {
      if (!this.detailData) {
        return undefined
      }
      const chart_data = this.detailData?.chart_data || [];
      const chart_data_bridge = this.detailData?.chart_data_bridge || [];
      const currentTime = this.currentTime;
      const now = new Date().getTime() / 1000;
      if (isMax(currentTime)) {
        return {
          chart_data: chart_data.sort((a, b) => a.timestamp - b.timestamp),
          chart_data_bridge: chart_data_bridge.sort((a, b) => a.timestamp - b.timestamp)
        };
      }
      const selectDataTime = ONE_MONTH * currentTime;
      return {
        chart_data: chart_data
                .filter((item) => item.timestamp > now - selectDataTime)
                .sort((a, b) => a.timestamp - b.timestamp),
        chart_data_bridge: chart_data_bridge
                .filter((item) => item.timestamp > now - selectDataTime)
                .sort((a, b) => a.timestamp - b.timestamp)
      };
    },
    isLightMode() {
      return this.$store.state.themeMode === 'light'
    },
  },
  watch: {
    chartData() {
      this._chart && this._chart.setOption(this._getChartOptions())
      this._interactionsChart && this._interactionsChart.setOption(this._getInteractionsChartOptions())
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
  mounted() {
    window.addEventListener('resize', this._onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this._onResize)
  },
  methods: {
    close(){
      this.dialogVisible = false;
      this.$emit('close', false);
    },
    show(rollup, row) {
      this.interactionsShow = true
      this.dialogVisible = true
      this.rollup = rollup
      this.rollups = [rollup]
      this.$nextTick(async () => {
        this.checkData = ['New Users', 'Active Users']
        this.checkInteractionsData = ['All Interactions', 'Bridge Interactions', 'Other Interactions'];
        this.currentTime = times[1].value
        if (this._chart) {
          this._chart.clear()
        }
        if (this._interactionsChart) {
          this._interactionsChart.clear();
        }
        this.detailData = {}
        this._initChart()

        this.dappData = row
        this.$loader.show()
        const detailData = await getDappDetail(rollup, row.dapp_name)
        this.$loader.hide()
        if (
          detailData &&
          detailData.info &&
          detailData.info.dapp_supported_l2
        ) {
          this.rollups = detailData.info.dapp_supported_l2
        }
        this.detailData = detailData
        this._chart.hideLoading()

        if (this.chartData.chart_data_bridge.length) {
          this.interactionsShow = true;
          this._initInteractionsChart();
          this._interactionsChart.hideLoading();
        } else {
          this.interactionsShow = false;
        }
      })
    },
    async onRollupChange(value) {
      if (this.rollup === value) {
        return
      }
      this.rollup = value
      this.detailData = {}
      this.$loader.show()
      this.detailData = await getDappDetail(value, this.dappData.dapp_name)
      this.interactionsShow = !!this.chartData.chart_data_bridge.length;
      this.$loader.hide()
    },
    onCheckerClick(type, item) {
      if (type === 1) {
        if (this.checkData.length === 1 && this.checkData.includes(item)) {
          return;
        }
        if (this.checkData.includes(item)) {
          this.checkData = this.checkData.filter((data) => data !== item);
        } else {
          this.checkData = this.checkData.concat([item]);
        }
        if (this._chart) {
          this._chart.clear();
          const option = this._getChartOptions();
          this._chart.setOption(option);
        }
      } else if (type === 2) {
        if (this.checkInteractionsData.length === 1 && this.checkInteractionsData.includes(item)) {
          return;
        }
        if (this.checkInteractionsData.includes(item)) {
          this.checkInteractionsData = this.checkInteractionsData.filter((data) => data !== item);
        } else {
          this.checkInteractionsData = this.checkInteractionsData.concat([item]);
        }
        if (this._interactionsChart) {
          this._interactionsChart.clear();
          const option = this._getInteractionsChartOptions();
          this._interactionsChart.setOption(option);
        }
      }
    },
    _onResize() {
      this._chart && this._chart.resize()
      this._interactionsChart && this._interactionsChart.resize()
    },
    _initChart() {
      const chartDom = document.getElementById('dapp-detail-chart')
      const chart = echarts.init(chartDom)
      this._chart = chart
    },
    _initInteractionsChart() {
      const chartDom = document.getElementById('dapp-detail-interactions-chart')
      const chart = echarts.init(chartDom)
      this._interactionsChart = chart
    },
    _getChartOptions() {
      const { times, allUser, activeUser, newUser } = this._getData()

      const options = {
        height: 160,
        title: {
          show: false,
        },
        legend: {
          show: false,
        },
        grid: {
          top: 26,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          alignTicks: false,
          data: times,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: this.isLightMode
                ? 'rgba(51, 51, 51, 0.4)'
                : 'rgba(255, 255, 255, 0.4)',
            },
          },
          axisLabel: {
            interval: (index) => {
              return (
                index % Math.ceil(times.length / (this.isMobile ? 3 : 6)) === 0
              )
            },
            formatter: (value) => dateFormat(parseInt(value), 'yyyy-MM-dd'),
          },
          splitLine: {
            lineStyle: {
              color: this.isLightMode
                ? 'rgba(51, 51, 51, 0.2)'
                : 'rgba(255, 255, 255, 0.2)',
            },
          },
        },
        yAxis: {
          splitNumber: 3,
          type: 'value',
          axisPointer: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: this.isLightMode
                ? 'rgba(51, 51, 51, 0.4)'
                : 'rgba(255, 255, 255, 0.4)',
            },
          },
        },
        tooltip: {
          trigger: 'axis',
          padding: 0,
          backgroundColor: 'transparent',
          formatter: this._onFormatter,
          position: this.isMobile
            ? function (pos, params, dom, rect, size) {
                const obj = { top: '10%' }
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
                return obj
              }
            : undefined,
        },
        series: [],
      }

      if (this.checkData.includes('New Users')) {
        options.series.push({
          name: 'New Users',
          type: 'line',
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
        })
      }
      if (this.checkData.includes('Active Users')) {
        options.series.push({
          name: 'Active Users',
          type: 'line',
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
        })
      }
      if (this.checkData.includes('All Users')) {
        options.series.push({
          name: 'All Users',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 4,
            color: 'rgba(0, 0, 255, 0.8)',
          },
          showSymbol: false,
          emphasis: {
            focus: 'series',
          },
          data: allUser,
        })
      }
      return options
    },
    _getInteractionsChartOptions() {
      const { times, daily_tx, bridge_tx, other_tx } = this._getInteractionsData()

      const options = {
        height: 160,
        title: {
          show: false,
        },
        legend: {
          show: false,
        },
        grid: {
          top: 26,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          alignTicks: false,
          data: times,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: this.isLightMode
                      ? 'rgba(51, 51, 51, 0.4)'
                      : 'rgba(255, 255, 255, 0.4)',
            },
          },
          axisLabel: {
            interval: (index) => {
              return (
                      index % Math.ceil(times.length / (this.isMobile ? 3 : 6)) === 0
              )
            },
            formatter: (value) => dateFormat(parseInt(value), 'yyyy-MM-dd'),
          },
          splitLine: {
            lineStyle: {
              color: this.isLightMode
                      ? 'rgba(51, 51, 51, 0.2)'
                      : 'rgba(255, 255, 255, 0.2)',
            },
          },
        },
        yAxis: {
          splitNumber: 3,
          type: 'value',
          axisPointer: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: this.isLightMode
                      ? 'rgba(51, 51, 51, 0.4)'
                      : 'rgba(255, 255, 255, 0.4)',
            },
          },
        },
        tooltip: {
          trigger: 'axis',
          padding: 0,
          backgroundColor: 'transparent',
          formatter: this._onInteractionsFormatter,
          position: this.isMobile
                  ? function (pos, params, dom, rect, size) {
                    const obj = { top: '10%' }
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
                    return obj
                  }
                  : undefined,
        },
        series: [],
      }

      if (this.checkInteractionsData.includes('Other Interactions')) {
        options.series.push({
          name: 'Other Interactions',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 4,
            color: 'rgba(17, 112, 255, 1)',
          },
          showSymbol: false,
          emphasis: {
            focus: 'series',
          },
          data: other_tx,
        })
      }
      if (this.checkInteractionsData.includes('Bridge Interactions')) {
        options.series.push({
          name: 'Bridge Interactions',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 4,
            color: 'rgba(239, 47, 45, 1)',
          },
          showSymbol: false,
          emphasis: {
            focus: 'series',
          },
          data: bridge_tx,
        })
      }
      if (this.checkInteractionsData.includes('All Interactions')) {
        options.series.push({
          name: 'All Interactions',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 4,
            color: 'rgba(0, 0, 255, 0.8)',
          },
          showSymbol: false,
          emphasis: {
            focus: 'series',
          },
          data: daily_tx,
        })
      }
      return options
    },
    _getData() {
      if (!this.chartData?.chart_data) {
        return { times: [], allUser: [], activeUser: [], newUser: [] }
      }

      const chartData = this.chartData.chart_data

      return {
        times: chartData.map((item) => padTimestamp(item.timestamp)),
        allUser: chartData.map((item) => item.all_users),
        activeUser: chartData.map((item) => item.active_users),
        newUser: chartData.map((item) => item.new_users),
      }
    },
    _getInteractionsData() {
      if (!this.chartData?.chart_data_bridge) {
        return { times: [], daily_tx:[], bridge_tx:[], other_tx: [] }
      }

      const chartData = this.chartData.chart_data_bridge

      return {
        times: chartData.map((item) => padTimestamp(item.timestamp)),
        daily_tx: chartData.map((item) => item.daily_tx),
        bridge_tx: chartData.map((item) => item.bridge_tx),
        other_tx: chartData.map((item) => item.other_tx),
      }
    },
    _onFormatter(params) {
      const axisValue = params[0].axisValue
      const all_users = this._getDataByTime(axisValue,'chart_data').all_users
      const title = dateFormat(parseInt(axisValue), 'yyyy-MM-dd')

      return `<div class="dapp-detail-chart-popover-content">
                <div class="dapp-detail-chart-popover-title">${title}</div>
                <div class="dapp-detail-chart-popover-data">
                   ${params
                     .reverse()
                     .map((item) => {
                       return `
                    <div class="dapp-detail-chart-popover-data-item">
                      <div class="dot" style="background:${
                        colorMap[item.seriesName]
                      }"></div>
                      <div class="name">${item.seriesName}</div>
                      <div class="value">${numeral(item.value).format('0,0')}
                      ${
                        item.seriesName !== 'All Users'
                          ? `<span>(${((item.value / all_users) * 100).toFixed(
                              2
                            )}%)</span>`
                          : ''
                      }
                        </div>
                      </div>
                    `
                     })
                     .join('')}
                </div>
              </div>`
    },
    _onInteractionsFormatter(params) {
      const axisValue = params[0].axisValue
      const daily_tx = this._getDataByTime(axisValue,'chart_data_bridge').daily_tx
      const title = dateFormat(parseInt(axisValue), 'yyyy-MM-dd')

      return `<div class="dapp-detail-chart-popover-content">
                <div class="dapp-detail-chart-popover-title">${title}</div>
                <div class="dapp-detail-chart-popover-data">
                   ${params
              .reverse()
              .map((item) => {
                return `
                    <div class="dapp-detail-chart-popover-data-item">
                      <div class="dot" style="background:${
                        colorMap[item.seriesName]
                }"></div>
                      <div class="name">${item.seriesName}</div>
                      <div class="value">${numeral(item.value).format('0,0')}
                      ${
                        item.seriesName !== 'All Users'
                                ? `<span>(${((item.value / daily_tx) * 100).toFixed(
                                2
                                )}%)</span>`
                                : ''
                }
                        </div>
                      </div>
                    `
              })
              .join('')}
                </div>
              </div>`
    },
    _getDataByTime(axisValue, prop) {
      const chartData = this.chartData[prop];
      return chartData.find((item) => {
        return item.timestamp * 1000 === parseInt(axisValue)
      })
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
    padding: 30px;
  }
  .dapp-detail-dialog-title {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .name {
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      color: #333333;
      margin-left: 10px;
    }
    .logo {
      border: 0.2px solid rgba(0, 0, 0, 0.3);
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
    padding-bottom: 100px;
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
        font-style: normal;
        font-weight: 400;
        font-family: 'Inter Regular';
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
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        color: rgba(51, 51, 51, 0.69);
        font-family: 'Inter Regular';
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
      border-radius: 12px;
      padding-bottom: 20px;
      .title {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 20px;
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        color: #333333;
        .title-help {
          display: inline-block;
          width: 12px;
          height: 12px;
          background-image: url('../../assets/data/help.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 12px 12px;
          margin-left: 5px;
        }
      }
      #dapp-detail-chart {
        height: 200px;
      }
      #dapp-detail-interactions-chart {
        height: 200px;
      }
      .checker {
        display: flex;
        align-items: center;
        padding-left: 102px;
        .item {
          display: flex;
          align-items: center;
          margin-right: 20px;
          font-family: 'Inter Regular';
          font-style: normal;
          font-weight: 400;
          font-size: 12px;
          color: rgba(51, 51, 51, 0.8);
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
          .checkbox {
            width: 14px;
            height: 14px;
            background: rgba(51, 51, 51, 0.2);
            border-radius: 4px;
            margin-right: 4px;
            &.active {
              background: url('../../assets/data/checkend.png');
              background-size: 14px 14px;
            }
          }
          .line {
            width: 16px;
            height: 3px;
            border-radius: 2px;
            margin-right: 4px;
          }
        }
      }
    }
  }
}
@media (max-width: 880px) {
  .dapp-detail-dialog {
    width: 100%;
    .dapp-detail-dialog-content {
      .selectors {
        flex-direction: column;
        .selector {
          margin-top: 20px;
        }
      }
      .content {
        .checker {
          padding: 0 20px;
          flex-wrap: wrap;
          justify-content: flex-start;
          .item {
            height: 28px;
          }
        }
      }
    }
  }
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
        .title {
          color: #fff;
          .title-help {
            background-image: url('../../assets/data/help-dark.png');
          }
        }
        .checker {
          .item {
            color: #fff;
            .checkbox {
              background: rgba(255, 255, 255, 0.4);
              &.active {
                background: url('../../assets/data/checkend.png');
                background-size: 14px 14px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
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
.supported-l2-desc {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(51, 51, 51, 0.8);
  font-family: 'Inter Regular';
  word-wrap: break-word;
  word-break: normal;
  text-align: left;
  a {
    display: block;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #df2e2d;
  }
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
<style lang="scss">
.dapp-detail-chart-popover-content {
  width: 280px;
  border-radius: 12px;
  padding: 20px;
  font-style: normal;
  background: rgba(255, 255, 255, 0.96);
  color: #333333;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  .dapp-detail-chart-popover-title {
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .dapp-detail-chart-popover-data {
    .dapp-detail-chart-popover-data-item {
      display: flex;
      align-items: center;
      position: relative;
      font-size: 12px;
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 4px;
        margin-right: 5px;
      }
      .value {
        position: absolute;
        right: 0;
        color: rgba(51, 51, 51, 0.8);
        span {
          color: rgba(51, 51, 51, 0.4);
        }
      }
    }
  }
}

.dark-body {
  .dapp-detail-chart-popover-content {
    color: #fff;
    background: #4d4f6c;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  }
  .dapp-detail-chart-popover-data {
    .dapp-detail-chart-popover-data-item {
      .value {
        color: rgba(255, 255, 255, 0.6);
        span {
          color: rgba(255, 255, 255, 0.4);
        }
      }
    }
  }
}
</style>
