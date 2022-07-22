<template>
  <div class="chart-wrapper">
    <div class="chart">
      <div class="title">Layer2 Transactions Chart</div>
      <div class="checke-wrap">
        <selector
          :data="checkerData"
          :value="currentChartTime"
          @change="(item) => (currentChartTime = item.value)"
        />
      </div>
      <div id="l2-data-chart"></div>
    </div>
    <div class="rollups">
      <div class="head">
        <div class="title">
          Rollups by Daily Transactions,
          {{ latestData ? latestData.timestamp_read : '-' }}
        </div>
        <time-diff
          v-if="baseChartData && baseChartData.update_time"
          :timestamp="baseChartData.update_time"
        />
        <div
          class="more"
          @click="
            $router.push({
              path: '/transactionsDetail',
            })
          "
        >
          More
          <img src="../../../assets/data/right.png" width="8" height="12" />
        </div>
      </div>
      <div class="contents">
        <div class="content1">
          <div
            class="item"
            v-for="(item, i) in latestDataRank.slice(0, 5)"
            :key="i"
          >
            <div class="no">
              {{ item.no }}
            </div>
            <chains-logo :name="item.name" />
            <div class="name">
              {{ item.name }}
            </div>
            <div class="num">
              {{ numeral(item.transactions).format('0,0') }}
            </div>
          </div>
        </div>
        <div class="content2">
          <div
            class="item"
            v-for="(item, i) in latestDataRank.slice(5, 10)"
            :key="i"
          >
            <div class="no">
              {{ item.no }}
            </div>
            <chains-logo :name="item.name" />
            <div class="name">
              {{ item.name }}
            </div>
            <div class="num">
              {{ numeral(item.transactions).format('0,0') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import * as echarts from 'echarts'
import { getMainpageRollup } from '../../../L2data/chart.js'
import Selector from '../Selector.vue'
import TimeDiff from '../TimeDiff.vue'
import ChainsLogo from '../ChainsLogo.vue'

export default {
  components: {
    Selector,
    TimeDiff,
    ChainsLogo,
  },
  data() {
    return {
      checkerData: [
        {
          value: '3m',
          label: '3m',
        },
        {
          value: '6m',
          label: '6m',
        },
        {
          value: '1y',
          label: '1y',
        },
        {
          value: 'max',
          label: 'Max',
        },
      ],
      baseChartData: {},
      currentChartTime: '6m',
    }
  },
  computed: {
    filteredChartData() {
      const data = this.baseChartData
      if (!data || !data.tx_data) {
        return []
      }
      let arr
      switch (this.currentChartTime) {
        case '3m':
          arr = Array.from({ length: 90 }, (_, i) => i + 1)
          break
        case '6m':
          arr = Array.from({ length: 180 }, (_, i) => i + 1)
          break
        case '1y':
          arr = Array.from({ length: 365 }, (_, i) => i + 1)
          break
        default:
          arr = data.tx_data ? Object.keys(data.tx_data) : []
      }
      return arr.map((item) => data.tx_data[item])
    },
    latestData() {
      const data = this.baseChartData
      if (!data || !data.tx_data) {
        return undefined
      }
      return data.tx_data[1]
    },
    latestDataRank() {
      if (!this.latestData) {
        return []
      }
      return Object.keys(this.latestData.rollups)
        .map((item) => ({
          name: item,
          transactions: this.latestData.rollups[item],
        }))
        .sort((a, b) => b.transactions - a.transactions)
        .slice(0, 10)
        .map((item, i) => ({ ...item, no: i + 1 }))
    },
  },
  watch: {
    filteredChartData() {
      this._chart && this._chart.setOption(this._getChartOptions())
    },
  },
  async mounted() {
    this._initChart()
    this._chart.showLoading()
    this.baseChartData = await getMainpageRollup()
    this._chart.hideLoading()
  },
  methods: {
    numeral,
    _initChart() {
      const chartDom = document.getElementById('l2-data-chart')
      const chart = echarts.init(chartDom)
      this._chart = chart
    },
    _getChartOptions() {
      const { times, data } = this._getData()

      const options = {
        height: 160,
        title: {
          show: false,
        },
        legend: {
          right: 0,
          lineStyle: {
            color: 'rgba(245, 245, 245, 1)',
            width: 1,
          },
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
            label: {
              backgroundColor: '#6a7985',
            },
          },
          // formatter(ops) {
          //   console.log(ops.marker)
          // },
        },
        series: [
          {
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 4,
              color: '#DF2E2D',
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(232, 94, 36, 0.24)',
                },
                {
                  offset: 1,
                  color: 'rgba(232, 94, 36, 0)',
                },
              ]),
            },
            emphasis: {
              focus: 'series',
            },
            data: data,
          },
        ],
      }

      return options
    },
    _getData() {
      switch (this.currentChartTime) {
        case '3m':
          return {
            times: this.filteredChartData.map((item) => item.timestamp_read),
            data: this.filteredChartData.map((item) => item.all),
          }
        case '6m':
          return {
            times: this.filteredChartData.map((item) => item.timestamp_read),
            data: this.filteredChartData.map((item) => item.all),
          }
        default:
          return {
            times: this.filteredChartData.map((item) => item.timestamp_read),
            data: this.filteredChartData.map((item) => item.all),
          }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.chart-wrapper {
  display: flex;
  height: 300px;
  background: #ffffff;
  border-radius: 20px;
  .chart {
    display: flex;
    align-items: flex-end;
    position: relative;
    height: 100%;
    flex: 1;
    width: 50%;
    padding-left: 30px;
    .title {
      position: absolute;
      top: 28px;
      left: 30px;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      color: #333333;
    }
    .checke-wrap {
      position: absolute;
      top: 28px;
      right: 50px;
      z-index: 1;
    }
    #l2-data-chart {
      width: 100%;
      height: 270px;
    }
  }
  .rollups {
    flex: 1;
    .head {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      padding-top: 28px;
      .title {
        font-weight: 700;
        font-size: 16px;
        color: #333333;
        margin-right: 10px;
      }
      .more {
        font-family: 'Inter';
        font-style: normal;
        display: flex;
        align-items: center;
        position: absolute;
        right: 30px;
        font-weight: 400;
        font-size: 14px;
        color: #df2e2d;
        cursor: pointer;
        img {
          margin-left: 5px;
        }
      }
    }
    .contents {
      display: flex;
      margin-top: 30px;
      .item {
        display: flex;
        align-items: center;
        height: 36px;
        font-size: 14px;
        position: relative;
        .no {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 14px;
          color: #333333;
          margin-right: 13px;
        }
        img {
          margin-right: 8px;
        }
        .name {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 14px;
          color: rgba(51, 51, 51, 0.8);
        }
        .num {
          position: absolute;
          right: 0px;
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          color: rgba(51, 51, 51, 0.4);
        }
      }
      .content1 {
        flex: 1;
        margin-right: 50px;
      }
      .content2 {
        flex: 1;
        margin-right: 30px;
      }
    }
  }
}
</style>
