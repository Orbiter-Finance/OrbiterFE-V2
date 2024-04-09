<template>
  <div class="contnet">
    <div class="title">Orbiter Statistics</div>
    <div class="statistics-info">
      <div class="info-item">
        <div class="item-title">Total Tx</div>
        <div v-if="hideDataLoading" class="item-data">{{ formatTxCount }}</div>
        <CommLoading :hidden="hideDataLoading" width="3rem" height="3rem" />
      </div>
      <div class="info-item">
        <div class="item-title">Total Volume</div>
        <div v-if="hideDataLoading" class="item-data">
          {{ formatTotalUsd }}
        </div>
        <CommLoading :hidden="hideDataLoading" width="3rem" height="3rem" />
      </div>
      <div class="info-item">
        <div class="item-title">Total Users</div>
        <div v-if="hideDataLoading" class="item-data">
          {{ formatAmountCount }}
        </div>
        <CommLoading :hidden="hideDataLoading" width="3rem" height="3rem" />
      </div>
    </div>
    <div v-if="showSource" class="tx-content">
      <div class="tx-head">
        <span class="tx-title">Tx Statistics</span>
        <div v-if="ethStatisticsData" class="tx-select">
          <div
            :class="['tx-select-item', { 'tx-focus-item': showSource }]"
            @click="clickChange()"
          >
            Source chain
          </div>
          <div
            :class="['tx-select-item', { 'tx-focus-item': !showSource }]"
            @click="clickChange()"
          >
            Destination Chain
          </div>
        </div>
        <div class="line"></div>
      </div>
      <CommLoading
        class="chart-loading"
        :hidden="hideTxLoading"
        width="6rem"
        height="6rem"
      />
      <div
        v-if="hideTxLoading"
        class="tx-source-chart"
        id="tx-source-chart"
      ></div>
    </div>
    <div v-else class="tx-content">
      <div class="tx-head">
        <span class="tx-title">Tx Statistics</span>
        <div v-if="ethStatisticsData" class="tx-select">
          <div
            :class="['tx-select-item', { 'tx-focus-item': showSource }]"
            @click="clickChange()"
          >
            Source chain
          </div>
          <div
            :class="['tx-select-item', { 'tx-focus-item': !showSource }]"
            @click="clickChange()"
          >
            Destination Chain
          </div>
        </div>
        <div class="line"></div>
      </div>
      <CommLoading
        class="chart-loading"
        :hidden="hideTxLoading"
        width="6rem"
        height="6rem"
      />
      <div v-if="hideTxLoading" class="tx-dest-chart" id="tx-dest-chart"></div>
    </div>
    <div class="amount-content">
      <div class="tx-head">
        <span class="tx-title">Amount（USD）Statistic</span>
        <div class="line"></div>
      </div>

      <CommLoading
        class="chart-loading"
        :hidden="hideAmountLoading"
        width="6rem"
        height="6rem"
      />
      <div
        v-if="hideAmountLoading"
        class="amount-chart"
        id="amount-chart"
      ></div>
    </div>
    <div class="user-content">
      <div class="tx-head">
        <span class="tx-title">Users Statistics</span>
        <div class="line"></div>
      </div>
      <CommLoading
        class="chart-loading"
        :hidden="hideUserLoading"
        width="6rem"
        height="6rem"
      />
      <div v-if="hideUserLoading" class="user-chart" id="user-chart"></div>
    </div>
  </div>
</template>

<script>
import {
  queryUsersStatisticsData,
  queryUSDAmountStatisticsData,
  queryTxStatisticsData,
} from './services/getStatisticsData'
import * as echarts from 'echarts'
import {
  simpleMonthAbbreviations,
  monthAbbreviations,
  CHART_TOTAL_LABELS,
} from './contants/index'
import { exchangeToCoin } from '../../util/coinbase'
import util, { formatCurrency } from '../../util/util'
import { mapMutations } from 'vuex'
import { BigNumber } from 'bignumber.js'
import { utils } from 'ethers'

let chainList = []
const STATISTICS_VALUE = 1000

export default {
  data() {
    return {
      addressCount: 0,
      totalUsd: 0,
      txCount: 0,
      showSource: true,
      destChart: undefined,
      ethStatisticsData: undefined,
      usdcStatisticsData: undefined,
      usdtStatisticsData: undefined,
      hideDataLoading: false,
      hideTxLoading: false,
      hideAmountLoading: false,
      hideUserLoading: false
    }
  },
  computed: {
    formatTxCount() {
      return formatCurrency(Number(this.txCount, 0)) || 0
    },
    formatTotalUsd() {
      const fixedTotal = Number(this.totalUsd)
      const oneBillion = 10 ** 9
      return this.totalUsd ? `$${(fixedTotal / oneBillion).toFixed(2)}B` : 0
    },
    formatAmountCount() {
      return formatCurrency(Number(this.addressCount, 0)) || 0
    },
  },
  mounted() {
    this.toggleThemeMode('light')
    this.getChains()
  },
  methods: {
    ...mapMutations(['toggleThemeMode']),
    async getChains() {
      try {
        if (!chainList?.length) {
          const res = await fetch('https://api.orbiter.finance/sdk/chains', {})
          const data = await res.json()

          chainList = data?.result?.map((item) => {
            return item.chainId
          })
        }

        if (chainList?.length) {
          this.init()
        } else {
          this.showError()
        }
      } catch (error) {
        this.showError()
      }
    },
    init() {
      queryUSDAmountStatisticsData().then((USDAmountData) => {
        this.hideDataLoading = true
        if (!USDAmountData) {
          this.showError()
          return
        }
        this.initUSDAmountData(USDAmountData)
      })
      Promise.all([
        queryTxStatisticsData(),
        queryTxStatisticsData('USDC'),
        queryTxStatisticsData('USDT'),
      ]).then((res) => {
        this.hideAmountLoading = true
        this.hideTxLoading = true
        if (!res[0] || !res[1] || !res[2]) {
          this.showError()
          return
        }
        this.$nextTick(() => {
          this.ethStatisticsData = res[0]
          this.usdcStatisticsData = res[1]
          this.usdtStatisticsData = res[2]
          const txChartDom = document.getElementById('tx-source-chart')
          this.initTxStatisticsData(txChartDom, true)
          const amountChartDom = document.getElementById('amount-chart')
          this.initTxStatisticsData(amountChartDom, true, true)
        })
      })
      queryUsersStatisticsData().then((userStatisticsData) => {
        this.hideUserLoading = true
        if (!userStatisticsData) {
          this.showError()
          return
        }
        this.$nextTick(() => {
          this.initUserStatisticsData(userStatisticsData)
        })
      })
    },
    showError() {
      this.$notify.error({
        title: `query data error; please refresh.`,
        duration: 3000,
      })
    },
    initUSDAmountData(USDAmountData) {
      this.addressCount = USDAmountData.addressCount || 0
      this.totalUsd = USDAmountData.totalUsd || 0
      this.txCount = USDAmountData.txCount || 0
    },
    initTxStatisticsData(chartDom, bySource = true, isAmount = false) {
      this.initTxStatisticsChart(chartDom, bySource, isAmount)
    },
    initUserStatisticsData(userStatisticsData) {
      this.initUserStatisticsChart(userStatisticsData)
    },
    initUserStatisticsChart(userStatisticsData) {
      const chartDom = document.getElementById('user-chart')
      const currentChart = echarts.init(chartDom)
      const { dateList = [], seriesData = [] } =
        this.getUserData(userStatisticsData)
      const currentSeriesData = {
        type: 'bar',
        emphasis: {
          focus: 'series',
        },
        data: seriesData,
      }
      this.renderChart(currentChart, dateList, currentSeriesData)
    },
    getUserData(userStatisticsData) {
      const dateList = []
      const seriesData = []
      userStatisticsData.forEach((item) => {
        dateList.unshift(item.source_date)
        seriesData.unshift(item.address_count)
      })
      return {
        dateList,
        seriesData,
      }
    },
    clickChange() {
      this.$loader.show()
      this.showSource = !this.showSource
      this.$nextTick((_) => {
        const chartDom = document.getElementById(
          this.showSource ? 'tx-source-chart' : 'tx-dest-chart'
        )
        setTimeout(() => {
          this.$loader.hide()
        }, 500)
        this.initTxStatisticsData(chartDom, this.showSource)
      })
    },
    async initTxStatisticsChart(chartDom, bySource, isAmount) {
      const currentChart = echarts.init(chartDom)
      const { dateList = [], seriesData: seriesETHData = {} } =
        await this.getChartData(this.ethStatisticsData, bySource, isAmount)
      const { seriesData: seriesUSDCData } = await this.getChartData(
        this.usdcStatisticsData,
        bySource,
        isAmount,
        'USDC'
      )
      const { seriesData: seriesUSDTData } = await this.getChartData(
        this.usdtStatisticsData,
        bySource,
        isAmount,
        'USDT'
      )
      let concatSeriesData = {}
      concatSeriesData = this.concatSeriesData(
        seriesETHData,
        seriesUSDCData,
        seriesUSDTData
      )

      let count = 0

      Object.keys(concatSeriesData).forEach((item) => {
        const len = concatSeriesData[item]?.length || 0
        if (len > count) {
          count = len
        }
      })

      let filterList = []
      Object.keys(concatSeriesData).forEach((item) => {
        filterList.push({
          chain: item,
          value: concatSeriesData[item]?.[count - 2] || 0,
        })
      })

      filterList = filterList
        .sort((a, b) => {
          return b.value - a.value
        })
        .filter((item)=>{
          const value = item.value
          return Number(value || 0) >= STATISTICS_VALUE
        })
      let obj = {}

      Object.keys(concatSeriesData).map((item) => {
        const flag = filterList.some((option) => option.chain === item)
        const others = obj.others || []
        const value = concatSeriesData[item]
        if (flag) {
          obj = {
            ...obj,
            [item]: value,
          }
        } else {
          obj = {
            ...obj,
            others: new Array(count).fill(0).map((option, index) => {
              return utils.formatEther(
                utils
                  .parseEther(value[index] || '0')
                  .add(utils.parseEther(others[index] || '0'))
              )
            }),
          }
        }
      })

      concatSeriesData = obj

      concatSeriesData = Object.keys(concatSeriesData).map((item)=> {
        return ({
          chain: item,
          data: concatSeriesData[item]
        })
      })

      concatSeriesData = filterList.map((item)=>{
        return concatSeriesData.filter((option)=> {
          return option.chain === item.chain
        })[0]

      }).concat(
        concatSeriesData.filter((item)=> {
        return item.chain === "others"
      })
      )

      const currentSeriesData = concatSeriesData.map((item) => {
        const chainInfo = util.getV3ChainInfoByChainId(item.chain)
        return {
          name: chainInfo?.name || 'Other',
          type: 'bar',
          stack: 'Ad',
          emphasis: {
            focus: 'series',
          },
          data: item.data,
        }
      })
      this.renderChart(currentChart, dateList, currentSeriesData)
    },
    concatSeriesData(seriesETHData, seriesUSDCData, seriesUSDTData) {
      let mergedSeriesData = {}
      let keys = Object.keys(seriesETHData)
      keys.forEach((key) => {
        mergedSeriesData[key] = seriesETHData[key].map((num, idx) => {
          return new BigNumber(num)
            .plus(seriesUSDCData?.[key]?.[idx] || 0)
            .plus(seriesUSDTData?.[key]?.[idx] || 0)
            .toString()
        })
      })
      return mergedSeriesData
    },
    async getChartData(
      statisticsData,
      bySource = true,
      isAmount = false,
      sourceCurrency = 'ETH'
    ) {
      let exchangeRes
      if (isAmount) {
        exchangeRes = await exchangeToCoin(1, sourceCurrency, 'USD')
      }
      const dateList = Object.keys(statisticsData).reverse()
      const dataBySourceChain = {}

      dateList.forEach((item) => {
        const dateValue = {}
        statisticsData[item].forEach((v) => {
          const byKey = bySource ? v[0] : v[1]
          const currentKey = byKey
          const byValue = isAmount
            ? exchangeRes.multipliedBy(v[4]).toNumber()
            : Number(v[3])
          if (dateValue?.[currentKey]) {
            dateValue[currentKey] += byValue
          } else {
            dateValue[currentKey] = byValue
          }
        })
        const dateValueKeys = Object.keys(dateValue)
        chainList.forEach((q) => {
          if (dataBySourceChain?.[q]) {
            dataBySourceChain[q].push(dateValue?.[q]?.toFixed(2) || '0')
          } else {
            dataBySourceChain[q] = [dateValue?.[q]?.toFixed(2) || '0']
          }
        })
      })
      return {
        dateList,
        seriesData: dataBySourceChain,
      }
    },
    renderChart(chart, dateList, series, extParams = {}) {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          left: 30,
          right: 24,
          top: 16,
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            color: '#666',
            fontSize: 14,
          },
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
            data: dateList,
            nameTextStyle: {
              color: '#666',
              fontSize: 14,
            },
            axisLabel: {
              formatter: function (value, index) {
                const valueSplit = value.split('-')
                const mouth = valueSplit[1]
                const day = valueSplit[2]
                return day + ' ' + simpleMonthAbbreviations[mouth]
              },
            },
          },
        ],
        yAxis: [
          {
            position: 'right',
            type: 'value',
            nameTextStyle: {
              color: '#666',
              fontSize: 14,
            },
            axisLabel: {
              formatter: function (value, index) {
                return value > 0 ? value / 1000 + 'K' : 0
              },
            },
            splitArea: { show: true },
          },
        ],
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let totalValue = 0
            params.forEach((item) => {
              totalValue += Number(item.value)
            })
            const currentParamsDate = params[0].name
            const splitParamsDate = currentParamsDate.split('-')
            return `<div style="
                      width: 224px;
                      display: flex;
                      text-align: left;
                      flex-direction: column;
                      padding: 16px 12px;
                      color: #666;
                      font-size: 14px;"
                    >
                      <div style="margin-bottom: 12px;">
                        ${
                          splitParamsDate[2] +
                          ' ' +
                          monthAbbreviations[splitParamsDate[1]] +
                          ' ' +
                          splitParamsDate[0]
                        }
                      </div>
                      <div style="
                        display: flex;
                        justify-content: space-between;
                        font-weight: 600;
                        margin-bottom: 8px;
                        font-size: 14px;
                        color: #222222;"
                      >
                        <span>${
                          CHART_TOTAL_LABELS[chart._dom._prevClass]
                        }</span>
                        <span>${formatCurrency(
                          totalValue.toFixed(
                            chart._dom._prevClass === 'amount-chart' ? 2 : 0
                          )
                        )}</span>
                      </div>
                      ${
                        chart._dom._prevClass !== 'user-chart'
                          ? `<div style="margin-bottom:6px">Chains</div>
                      <div style="display:flex;flex-direction:column;">
                        ${params
                          .map((v) => {
                            return `
                              <div style="display:flex;margin-bottom:4px;justify-content:space-between;">
                                <div style="display:flex;align-items: center;">
                                  <div style="width:12px;height:12px;margin-right:8px;background-color:${
                                    v.color
                                  }"></div>
                                  ${v.seriesName}
                                </div>
                                <div style="color: #222222;">${formatCurrency(
                                  Number(v.value).toFixed(
                                    chart._dom._prevClass === 'amount-chart'
                                      ? 2
                                      : 0
                                  )
                                )}</div>
                              </div>
                            `
                          })
                          .join('')}
                      </div>`
                          : ''
                      }
                    </div>`
          },
        },
        series,
        ...extParams,
      }
      if (chart._dom._prevClass === 'tx-dest-chart') {
        this.destChart = chart
      }
      chart && chart.setOption(option)
    },
  },
}
</script>

<style scoped lang="scss">
.contnet {
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.title {
  margin-bottom: 20px;
  text-align: left;
  font-family: 'Kodchasan-SemiBold';
  font-weight: bold;
  font-size: 24px;
  color: #222222;
}
.statistics-info {
  width: 100%;
  display: flex;
  margin-bottom: 20px;
}
.info-item {
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 28px 39px;
  background: #ffffff;
  border-radius: 16px;
  margin-right: 20px;
  align-items: center;
}
.info-item:last-child {
  margin-right: 0;
}
.item-title {
  margin-bottom: 7px;
  font-family: 'OpenSans, OpenSans';
  font-weight: 400;
  font-size: 18px;
  color: #666666;
}
.item-data {
  font-family: 'Kodchasan-SemiBold';
  font-weight: bold;
  font-size: 44px;
  color: #222222;
}
.tx-content {
  width: 100%;
  background: #ffffff;
  border-radius: 24px;
  height: 670px;
  display: flex;
  flex-direction: column;
}
.tx-head {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  position: relative;
}
.tx-title {
  font-family: 'Kodchasan-SemiBold';
  font-weight: bold;
  font-size: 18px;
  color: #222222;
}
.tx-select {
  display: flex;
  align-items: center;
  font-family: 'OpenSans, OpenSans';
  font-weight: 400;
  font-size: 14px;
  color: #666;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 4px 4px;
}
.tx-select-item {
  font-family: 'PingFangSC, PingFang SC';
  font-size: 14px;
  padding: 6px 8px;
  cursor: pointer;
  margin-right: 4px;
  font-weight: 400;
}
.tx-focus-item {
  background: #ffffff;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  color: #222222;
  border-radius: 4px;
}
.tx-select-item:last-child {
  margin-right: 0;
}
.line {
  position: absolute;
  bottom: 0;
  width: 1120px;
  height: 1px;
  left: 0;
  background-color: #eeeeee;
}
.tx-source-chart {
  height: 610px;
}
.tx-dest-chart {
  height: 610px;
}
.amount-content {
  width: 100%;
  background: #ffffff;
  margin-top: 20px;
  border-radius: 24px;
  height: 670px;
  display: flex;
  flex-direction: column;
}
.amount-head {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  position: relative;
}
.amount-title {
  font-family: 'Kodchasan-SemiBold';
  font-weight: bold;
  font-size: 18px;
  color: #222222;
}
.amount-chart {
  height: 610px;
}
.user-content {
  height: 670px;
  width: 100%;
  background: #ffffff;
  margin-top: 20px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
}
.user-head {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  position: relative;
}
.user-title {
  font-family: 'Kodchasan-SemiBold';
  font-weight: bold;
  font-size: 18px;
  color: #222222;
}
.amount-chart {
  height: 610px;
}
.user-chart {
  height: 610px;
}
.chart-loading {
  margin: 0 auto;
  margin-top: 280px;
}
</style>
