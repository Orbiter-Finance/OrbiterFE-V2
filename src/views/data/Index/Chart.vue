<template>
  <div class="chart-wrapper">
    <div class="chart">
      <div class="head">
        <div class="title">Layer2 Transactions Chart</div>
        <div class="checke-wrap">
          <selector
            :data="checkerData"
            :value="currentChartTime"
            @change="(item) => (currentChartTime = item.value)"
          />
        </div>
      </div>
      <div class="checker">
        <div
          class="item"
          v-for="(item, i) in allSeries"
          :key="i"
          @click="onCheckerClick(item)"
        >
          <div
            class="checkbox"
            :class="{ active: checkData.includes(item) }"
          ></div>
          <div class="line" :style="{ background: color[i] }"></div>
          <div class="name">{{ item }}</div>
        </div>
      </div>
      <div id="l2-data-chart"></div>
    </div>
    <div class="rollups">
      <div class="head">
        <div class="title">
          Rollups by Daily Transactions
          <template v-if="!isMobile">
            ,{{
              latestData
                ? dateFormat(latestData.timestamp_read, 'yyyy-MM-dd')
                : '-'
            }}
          </template>
        </div>
        <time-diff
          v-if="!isMobile && baseChartData && baseChartData.update_time"
          :timestamp="baseChartData.update_time"
        />
        <div
          class="more"
          @click="
            $router.push({
              path: '/dataDetail',
              query: { nav: 'Rollups' },
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
            <div class="name" @click="onRowClick(item.name)">
              {{ item.name }}
            </div>
            <div class="icon" v-if="isShowDetail(item.name)" @click="onRowClick(item.name)">
              <svg-icon-themed icon="searchChartIcon" size="lg"></svg-icon-themed>
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
            <div class="name" @click="onRowClick(item.name)">
              {{ item.name }}
            </div>
            <div class="icon" v-if="isShowDetail(item.name)" @click="onRowClick(item.name)">
              <svg-icon-themed icon="searchChartIcon" size="lg"></svg-icon-themed>
            </div>
            <div class="num">
              {{ numeral(item.transactions).format('0,0') }}
            </div>
          </div>
        </div>
      </div>

      <rollup-detail @close="closeRollupDetail" ref="rolluoDetail"></rollup-detail>
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
import RollupDetail from '../RollupDetail.vue'
import SvgIconThemed from '../../../components/SvgIconThemed.vue'
import { isMobile } from '../../../composition/hooks'
import dateFormat from '../../../util/dateFormat'
import getWeeks from '../../../util/getWeeks'

const ROLLUPS = [
  'Arbitrum',
  'Aztec',
  'Boba',
  'Gluon',
  'Hermez',
  'Immutable X',
  'Loopring',
  'Metis',
  'OMG',
  'Optimism',
  'StarkNet',
  'ZkSpace',
  'ZkSwapV2',
  'ZkSync',
  'dYdX',
  'ScrollL1',
  'ScrollL2'
]
const caches = {}
const allSeries = ['Ethereum Mainnet Transactions']
const color = [
  'rgba(17, 112, 255, 0.8)',
  'rgba(239, 47, 45, 1)',
  'rgba(17, 112, 255, 1)',
]

const padTimestamp = (timestamp) => timestamp * 1000
const unixTime = (timestamp) => timestamp - (timestamp % 86400000)
const showDetailList = ['starknet'];
export default {
  components: {
    Selector,
    TimeDiff,
    ChainsLogo,
    SvgIconThemed,
    RollupDetail
  },
  data() {
    return {
      checkerData: [
        { value: 3, label: '3m' },
        { value: 6, label: '6m' },
        { value: 12, label: '1y' },
        { value: 'Max', label: 'Max' },
      ],
      defaultSort: { prop: 'txs', order: 'descending' },
      baseChartData: {},
      currentChartTime: 6,
      allSeries,
      color,
      checkData: ['Ethereum Mainnet Transactions'],
    }
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
    filteredChartData() {
      const data = this.baseChartData
      if (!data || !data.tx_data) {
        return []
      }
      let arr = []
      if ([3, 6].includes(this.currentChartTime)) {
        arr = Array.from(
          { length: 30 * this.currentChartTime },
          (_, i) => i + 1
        )
      } else if ([12].includes(this.currentChartTime)) {
        arr = Array.from(
          { length: 30 * this.currentChartTime + 4},
          (_, i) => i + 1
        )
      } else {
        arr = data.tx_data ? Object.keys(data.tx_data) : []
        let spliceLen = arr.length % 7
        if (spliceLen != 0) {
          arr.splice(-spliceLen)
        }
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
    isLightMode() {
      return this.$store.state.themeMode === 'light'
    },
  },
  watch: {
    filteredChartData() {
      this._chart && this._chart.setOption(this._getChartOptions())
    },
    isLightMode() {
      this._chart && this._chart.setOption(this._getChartOptions())
    },
  },
  async mounted() {
    this._initChart()
    this.$loader.show()
    this.baseChartData = await getMainpageRollup()
    if(this.baseChartData){
      const { query } = this.$route;
      if (query?.rollup_name) {
        this.handleRoute({
          rollup_name: query?.rollup_name
        });
      }
    }
    this.$loader.hide()
    window.addEventListener('resize', this._onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this._onResize)
  },
  methods: {
    numeral,
    dateFormat,
    _onResize() {
      this._chart && this._chart.resize()
    },
    _initChart() {
      this.$nextTick(() => {
        const chartDom = document.getElementById('l2-data-chart')
        const chart = echarts.init(chartDom)
        this._chart = chart
      })
    },
    isShowDetail(name) {
      return showDetailList.includes(name.toLowerCase());
    },
    onCheckerClick(item) {
      if (this.checkData.includes(item)) {
        this.checkData = this.checkData.filter((data) => data !== item)
      } else {
        this.checkData = this.checkData.concat([item])
      }
      if (this._chart) {
        this._chart.clear()
        const option = this._getChartOptions()
        this._chart.setOption(option)
      }
    },
    _getChartOptions() {
      const { times, data, data_l1 } = this._getData()
      const options = {
        width: '100%',
        title: { show: false },
        grid: {
          top: 10,
          left: '0',
          right: '30',
          bottom: '26',
          containLabel: true,
        },
        legend: {
          right: 0,
          lineStyle: {
            color: 'rgba(245, 245, 245, 1)',
            width: 1,
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
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
          splitLine: {
            lineStyle: {
              color: this.isLightMode
                ? ' rgba(51, 51, 51, 0.2)'
                : 'rgba(255, 255, 255, 0.2)',
            },
          },
          axisLabel: {
            padding: [0, 5, 0, 5],
            formatter: (value) => dateFormat(parseInt(value), 'yyyy-MM-dd'),
          },
        },
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false,
          },
          splitNumber: 3,
          axisLine: {
            show: false,
            lineStyle: {
              color: this.isLightMode
                ? 'rgba(51, 51, 51, 0.4)'
                : 'rgba(255, 255, 255, 0.4)',
            },
          },
          splitLine: {
            lineStyle: {
              color: this.isLightMode
                ? 'rgb(246, 246, 246)'
                : 'rgb(63, 65, 91)',
            },
          },
          axisPointer: { show: false },
        }
        ],
        tooltip: {
          trigger: 'axis',
          pading: 0,
          backgroundColor: 'transparent',
          formatter: this._onFormatter,
          position: function (pos, params, dom, rect, size) {
            const obj = { top: 40 }
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = -30
            return obj
          },
        },
        series: [
          {
            type: 'line',
            smooth: true,
            lineStyle: { width: 4, color: '#DF2E2D' },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(232, 94, 36, 0.24)' },
                { offset: 1, color: 'rgba(232, 94, 36, 0)' },
              ]),
            },
            emphasis: {
              focus: 'series',
            },
            data: data,
          },
        ],
      }
      if (this.isMobile) {
        options.grid = {
          top: 10,
          left: '0',
          right: '0',
          bottom: '20',
          containLabel: true,
        }
      }
      if (this.checkData.includes('Ethereum Mainnet Transactions')) {
        options.series[1] = {
          type: 'line',
          smooth: true,
          lineStyle: { width: 4, color: 'rgb(17, 112, 255)' },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(17, 112, 255, 0.24)' },
              { offset: 1, color: 'rgba(17, 112, 255, 0)' },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: data_l1,
        }
      }
      return options
    },
    _getData() {
      const currentChartTime = this.currentChartTime
      if ([3, 6].includes(currentChartTime)) {
        return {
          times: this.filteredChartData
            .map((item) => padTimestamp(item.timestamp))
            .reverse(),
          data: this.filteredChartData.map((item) => item.all).reverse(),
          data_l1: this.filteredChartData.map((item) => item.all_l1).reverse(),
        }
      }
      if ([12, 'Max'].includes(currentChartTime)) {
        const startTime =
          currentChartTime === 12
            ? unixTime(new Date().getTime()) - 60 * 60 * 24 * 360 * 1000
            : padTimestamp(
                this.filteredChartData[this.filteredChartData.length - 1]
                  .timestamp
              )
        const endTime = padTimestamp(this.filteredChartData[0].timestamp)
        const weeks = getWeeks(startTime, endTime)
        const data = weeks
          .map((time) =>
            this.filteredChartData
              .filter(
                (item) =>
                  padTimestamp(item.timestamp) >= time.start &&
                  padTimestamp(item.timestamp) <= time.end
              )
              .reduce((total, item) => total + item.all, 0)
          )
          .reverse()
        const data_l1 = weeks
          .map((time) =>
            this.filteredChartData
              .filter(
                (item) =>
                  padTimestamp(item.timestamp) >= time.start &&
                  padTimestamp(item.timestamp) <= time.end
              )
              .reduce((total, item) => total + item.all_l1, 0)
          )
          .reverse()
        return {
          times: weeks.map((item) => item.end).reverse(),
          data,
          data_l1
        }
      }
    },
    _onFormatter([params, params2]) {
      let rollups = {}
      if (caches[params.axisValue]) {
        rollups = caches[params.axisValue]
      } else {
        const data = this._getRollupsByTime(params.axisValue)
        rollups = Object.keys(data)
          .map((item) => ({
            name: item,
            value: data[item],
          }))
          .sort((a, b) => b.value - a.value)
        caches[params.axisValue] = rollups
      }

      if (!rollups.length) return undefined
      const date = new Date(parseInt(params.axisValue)).getTime()
      let start = date - 24 * 60 * 60 * 6 * 1000
      const startTime =
        this.currentChartTime === 12
          ? unixTime(new Date().getTime()) - 60 * 60 * 24 * 360 * 1000
          : padTimestamp(
              this.filteredChartData[this.filteredChartData.length - 1].timestamp
            )
      const endTime = padTimestamp(this.filteredChartData[0].timestamp)
      const weeks = getWeeks(startTime, endTime)
      if (start <= weeks[weeks.length - 1].start) {
        start = weeks[weeks.length - 1].start
      }
      const title = [3, 6].includes(this.currentChartTime)
      ? dateFormat(parseInt(params.axisValue), 'yyyy-MM-dd')
      : `From ${dateFormat(start, 'yyyy-MM-dd')} to ${dateFormat(
        date,
        'yyyy-MM-dd'
        )}`
      
      const currentChartTime = this.currentChartTime
      if ([12, 'Max'].includes(currentChartTime)) {
        let data = this.filteredChartData.filter(
          (item) =>
            padTimestamp(item.timestamp) >= start &&
            padTimestamp(item.timestamp) <= date
        ).map((item) => item.rollups)
        let obj = {}, rollupsTotal = []
        data.map(v => {
          for (const key in v) {
            if (obj[key]) {
              obj[key].value = v[key] ? obj[key].value + v[key] : obj[key].value
            } else {
              obj[key] = {name: key, value: v[key] ? v[key] : 0}
            }
          }
        })
        for (const key in obj) {
          rollupsTotal.push(obj[key])
        }
        rollupsTotal.sort((a, b) => b.value-a.value)
        rollups = rollupsTotal
      }
      const firstData = rollups.slice(0, 10)
      const lastData = rollups.slice(10).reduce(
        (mome, item) => ({
          name: 'Others',
          value: mome.value ? mome.value + item.value : item.value,
        }),
        {}
      )
      const domMod = this.checkData.includes('Ethereum Mainnet Transactions') ? `<div class="chart-popover-total-transactions">
                    Ethereum Transactions: <span style='color: rgb(17, 112, 255)'>${numeral(params2.data).format(
                      '0,0'
                    )}</span>
                  </div>` : ''
      return `<div class="chart-popover-content">
                <div class="chart-popover-title">${title}</div>
                    ${domMod}
                    <div class="chart-popover-total-transactions">
                    Layer2 Total Transactions: <span>${numeral(params.data).format(
                      '0,0'
                    )}</span>
                    </div>
                    <div class="chart-popover-rollups">
                    ${firstData
                      .concat([lastData])
                      .map(
                        (rollup) =>
                          `<div class="chart-popover-rollup">
                            <div class="name">${rollup.name}</div>
                            <div class="transactions">
                                ${numeral(rollup.value).format('0,0')}
                            </div>
                            <div class="percentage">
                                ${numeral(rollup.value / params.data).format(
                                  '0.00%'
                                )}
                            </div>
                          </div> `
                      )
                      .join('')}
                </div>
              </div>`
    },
    _getRollupsByTime(axisValue) {
      if ([3, 6].includes(this.currentChartTime)) {
        return this.filteredChartData.find(
          ({ timestamp }) => timestamp * 1000 === parseInt(axisValue)
        ).rollups
      }

      const end = new Date(parseInt(axisValue)).getTime()
      const start = end - 24 * 60 * 60 * 7 * 1000

      const data = this.filteredChartData.filter((item) => {
        return (
          padTimestamp(item.timestamp) > start &&
          padTimestamp(item.timestamp) < end
        )
      })
      return data.reduce((mome, item) => {
        ROLLUPS.forEach((rollup) => {
          const newRollup = item.rollups[rollup]
          mome[rollup] = !mome[rollup] ? newRollup : mome[rollup] + newRollup
        })
        return mome
      }, {})
    },
    closeRollupDetail(){
      const { path, query } = this.$route;
      const newQuery = JSON.parse(JSON.stringify(query || {}));
      delete newQuery.rollup_name;
      const suffixArr = [];
      for (const key in newQuery) {
        suffixArr.push(`${ key }=${ newQuery[key] }`);
      }
      const newPath = path + '?' + suffixArr.join('&');
      this.$router.replace({ path: newPath, query: newQuery });
    },
    onRowClick(rollup_name) {
      this.handleRoute({ rollup_name });
    },
    handleRoute({ rollup_name }) {
      const { path, query } = this.$route;
      const newQuery = JSON.parse(JSON.stringify(query || {}));
      if (rollup_name instanceof Array) {
        rollup_name = rollup_name[0];
      }
      if (rollup_name) {
        if (newQuery?.rollup_name !== rollup_name) {
          newQuery.rollup_name = rollup_name;
          this.$refs.rolluoDetail.show({ rollup_name }, true);
          let suffixArr = [];
          for (const key in newQuery) {
            suffixArr.push(`${ key }=${ newQuery[key] }`);
          }
          const newPath = path + '?' + suffixArr.join('&');
          this.$router.replace({ path: newPath, query: newQuery });
        } else {
          this.$refs.rolluoDetail.show({ rollup_name }, true);
        }
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  .icon {
    margin-left: 3px;
    margin-top: 3px;
    cursor: pointer;
    i, svg {
      width: 18px;
      font-weight: bolder;
    }
  }
.chart-wrapper {
  display: flex;
  background: var(--light-page-bg);
  border-radius: 20px;
  .chart {
    display: flex;
    flex-direction: column;
    position: relative;
    flex: 1;
    width: 50%;
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
      height: 80px;
      .title {
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        color: #333333;
      }
    }
    #l2-data-chart {
      width: 100%;
      height: 220px;
      padding-left: 30px;
      box-sizing: border-box;
    }
    .checker {
        display: flex;
        align-items: center;
        padding-left: 30px;
        padding-bottom: 10px;
        margin-top: -18px;
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
              background: url('../../../assets/data/checkend.png');
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
  .rollups {
    flex: 1;
    .head {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      height: 80px;
      padding: 0 30px;
      .title {
        font-weight: 700;
        font-size: 16px;
        color: #333333;
        margin-right: 10px;
      }
      .more {
        font-style: normal;
        display: flex;
        align-items: center;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 30px;
        font-weight: 400;
        font-size: 14px;
        color: #df2e2d;
        cursor: pointer;
        font-family: 'Inter Regular';
        img {
          margin-left: 5px;
        }
      }
    }
    .contents {
      display: flex;
      height: 210px;
      padding: 0 30px 30px 30px;
      margin-top: 10px;
      .item {
        display: flex;
        align-items: center;
        height: 36px;
        font-size: 14px;
        position: relative;
        .no {
          font-style: normal;
          font-weight: 700;
          font-size: 14px;
          color: #333333;
          margin-right: 8px;
          width: 17px;
        }
        img {
          margin-right: 8px;
        }
        .name {
          font-style: normal;
          font-weight: 700;
          font-size: 14px;
          color: rgba(51, 51, 51, 0.8);
          cursor: pointer;
        }
        .num {
          position: absolute;
          right: 0px;
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          font-family: 'Inter Regular';
          color: rgba(51, 51, 51, 0.4);
        }
      }
      .content1 {
        flex: 1;
        margin-right: 50px;
      }
      .content2 {
        flex: 1;
      }
    }
  }
}
.dark-body {
  .chart-wrapper {
    background: var(--dark-page-bg);
    .chart {
      .head {
        .title {
          color: #fff;
        }
      }
      .checker {
        .item {
          color: #fff;
          .checkbox {
            background: rgba(255, 255, 255, 0.4);
            &.active {
              background: url('../../../assets/data/checkend.png');
              background-size: 14px 14px;
            }
          }
        }
      }
    }
  }
  .rollups {
    .head {
      .title {
        color: #fff;
      }
    }
    .contents {
      .item {
        .no {
          color: #fff;
        }
        .name {
          color: rgba(255, 255, 255, 0.6);
        }
        .num {
          color: rgba(255, 255, 255, 0.4);
        }
      }
    }
  }
}
@media (max-width: 820px) {
  .chart-wrapper {
    flex-direction: column;
    align-items: center;
    .chart {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      height: auto;
      padding: 30px 30px 0 30px;
      .head {
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;
        height: auto;
        padding: 0;
        .title {
          margin-bottom: 28px;
        }
        .checke-wrap {
          margin-bottom: 18px;
        }
      }
      #l2-data-chart {
        height: 184px;
        width: 100%;
      }
    }
    .rollups {
      flex: auto;
      width: 100%;
      padding: 0 30px 30px 30px;
      .head {
        padding: 0;
        .more {
          right: 0;
        }
      }
      .contents {
        flex-direction: column;
        height: auto;
        padding: 0;
        margin-top: 0;
        .content1,
        .content2 {
          margin-right: 0;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.chart-popover-content {
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 20px;
  width: 300px;
  color: #333333;
  background: #fff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  font-style: normal;
  font-size: 14px;
  .chart-popover-title {
    font-weight: 700;
    margin-bottom: 8px;
  }
  .chart-popover-total-transactions {
    font-weight: 700;
    margin-bottom: 10px;
    span {
      color: #df2e2d;
    }
  }
  .chart-popover-rollups {
    .chart-popover-rollup {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 24px;
      font-size: 12px;
      font-family: 'Inter Regular';
      .name {
        font-weight: 500;
      }
      .transactions {
        text-align: right;
        flex: 2;
        color: rgba(51, 51, 51, 0.8);
      }
      .percentage {
        text-align: right;
        flex: 0 0 42px;
        margin-left: 20px;
        color: rgba(51, 51, 51, 0.4);
      }
    }
  }
}
.dark-body {
  .chart-popover-content {
    background: #4d4f6c;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
    color: #ffffff;
    .chart-popover-total-transactions {
      span {
        color: #df2e2d;
      }
    }
    .chart-popover-rollups {
      .chart-popover-rollup {
        .transactions {
          color: rgba(255, 255, 255, 0.8);
        }
        .percentage {
          color: rgba(255, 255, 255, 0.4);
        }
      }
    }
  }
}
</style>
