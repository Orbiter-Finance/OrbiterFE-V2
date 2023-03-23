<template>
    <el-dialog custom-class="rollup-detail-dialog" v-if="isShow" :visible.sync="isShow" append-to-body
        :margin-top="isMobile ? '5%' : '15vh'" :show-close="false" :destroy-on-close="true">
        <div slot="title" class="rollup-detail-dialog-title">
            <dapp-logo class="logo" :chains="true" :name="rollupData.rollup_name" />
            <div class="name">{{ rollupData.rollup_name }}</div>
            <span class="close" @click="close"> </span>
        </div>
        <div class="rollup-detail-dialog-content">
            <div class="info" v-if="detailData.info">
                <div class="links">
                    <icon-link :href="detailData.info.rollup_url" />
                    <twitter-link :href="detailData.info.rollup_twitter" />
                </div>
                <div class="category" v-if="detailData.info && detailData.info.rollup_category">
                    {{ detailData.info.rollup_category }}
                    <!-- {{ detailData.info.rollup_name }} -->
                </div>
            </div>
            <div class="selectors">
                <div class="data_soon" v-if="!detailData.info">
                    <span>No detailed data at the moment,coming soon.</span>
                </div>
                <div class="rollup_gas" v-else>
                    <span class="text">Average Transaction Fee</span>
                    <span class="text">{{ detailData.info.rollup_name }}</span>
                    <span class="fee">${{ detailData.info.rollup_avg_fee == 0 ? 0 :
                    Number(detailData.info.rollup_avg_fee).toFixed(2)}} </span>
                    <span class="text">
                        <!-- {{ detailData.info.rollup_category }} -->
                        Ethereum
                    </span>
                    <span class="fee">${{ detailData.info.l1_avg_fee == 0 ? 0 : Number(detailData.info.l1_avg_fee).toFixed(2) }} </span>
                    <!-- <div class="question">
                        <el-popover v-if="!isMobile" popper-class="supported-l2-popover" :placement="'bottom'"
                            width="280" trigger="hover">
                            <div class="supported-l2-desc">
                                Only the chains supported by Orbier-L2 Data are listed.
                            </div>
                            <span class="supported-l2-help" slot="reference"> </span>
                        </el-popover>
                    </div> -->
                </div>
                <div class="time_box">
                    <time-diff class="time" v-if="!isMobile && detailData && detailData.update_time" :timestamp="detailData.update_time" />
                    <selector class="selector" :data="times" :value="currentTime"
                        @change="(item) => (currentTime = item.value)" v-if="detailData.info" />
                </div>
            </div>
            <div class="rollup_charts" v-if="detailData.info">
                <div class="content">
                    <div class="title">
                        User Statistics
                        <el-popover popper-class="supported-l2-popover" :placement="'bottom'" width="280"
                                    trigger="hover">
                            <div class="supported-l2-desc">
                                Active Users & Corresponding percentage of total users. <br />
                                New Users & Corresponding percentage of total users.
                                <a href="https://docs.orbiter.finance/l2data" target="_blank"> Read More </a>
                            </div>
                            <span class="title-help" slot="reference"> </span>
                        </el-popover>
                    </div>
                    <div id="rollup_user_chart" ref="rollup_user_chart"></div>
                    <div class="checker">
                        <div class="item" v-for="(item, i) in allSeries" :key="i" @click="onCheckerClick(1,item)">
                            <div class="checkbox" :class="{ active: checkData.includes(item) }"></div>
                            <div class="line" :style="{ background: color[i] }"></div>
                            <div class="name">{{ item }}</div>
                        </div>
                    </div>
                </div>

                <div :hidden="!chartData.chart_data_bridge" class="content">
                    <div class="title">
                        Interactions Statistics
                        <el-popover popper-class="supported-l2-popover" :placement="'bottom'" width="280"
                            trigger="hover">
                            <div class="supported-l2-desc">
                                Bridge Interactions percentage of total Interactions. <br />
                                Other Interactions percentage of total Interactions.
                                <a href="https://docs.orbiter.finance/l2data" target="_blank"> Read More </a>
                            </div>
                            <span class="title-help" slot="reference"> </span>
                        </el-popover>
                    </div>
                    <div id="rollup_interactions_chart" ref="rollup_interactions_chart"></div>
                    <div class="checker">
                        <div class="item" v-for="(item, i) in allInteractionsSeries" :key="i" @click="onCheckerClick(2,item)">
                            <div class="checkbox" :class="{ active: checkInteractionsData.includes(item) }"></div>
                            <div class="line" :style="{ background: color[i] }"></div>
                            <div class="name">{{ item }}</div>
                        </div>
                    </div>
                </div>
                <div class="row_content">
                    <el-row :gutter="20">
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <div class="content" style="margin-top: 0;">
                                <div class="title">
                                    Transaction Statistics
                                    <el-popover popper-class="supported-l2-popover" :placement="'bottom'" width="280"
                                        trigger="hover">
                                        <div class="supported-l2-desc">
                                            Statistics on the transaction data of the current network.
                                        </div>
                                        <span class="title-help" slot="reference"> </span>
                                    </el-popover>
                                </div>
                                <div id="rollup_tx_chart"></div>
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                            <div class="content" style="margin-top: 0;">
                                <div class="title">
                                    L2 Revenue and L1 Gas Fee Consumption
                                    <el-popover popper-class="supported-l2-popover" :placement="'bottom'" width="280"
                                        trigger="hover">
                                        <div class="supported-l2-desc">
                                            Starknet Received on L2: Total gas received of every successful transaction on Starknet Starknet Spent on L1: Total gas used by Starknet's L1 contracts to settle L2 proof on Ethereum
                                        </div>
                                        <span class="title-help" slot="reference"> </span>
                                    </el-popover>
                                </div>
                                <div id="rollup_fees_chart"></div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="content" style="margin-top: 0;">
                    <div class="title">
                        {{rollupData.rollup_name}} Bridge Deposit Statistics
                        <el-popover popper-class="supported-l2-popover" :placement="'bottom'" width="280"
                            trigger="hover">
                            <div class="supported-l2-desc">
                                Transaction data using the official bridge and shows the amount of gas consumed by deposits in different currencies.
                            </div>
                            <span class="title-help" slot="reference"> </span>
                        </el-popover>
                    </div>
                    <div id="rollup_deposit_chart"></div>
                </div>
                <div class="content" style="margin-top: 0;">
                    <div class="title">
                        {{rollupData.rollup_name}} Bridge Withdraw Statistics
                        <el-popover popper-class="supported-l2-popover" :placement="'bottom'" width="280"
                            trigger="hover">
                            <div class="supported-l2-desc">
                                Transaction data using the official bridge and shows the amount of gas consumed by withdraws in different currencies.
                            </div>
                            <span class="title-help" slot="reference"> </span>
                        </el-popover>
                    </div>
                    <div id="rollup_withdraw_chart"></div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import numeral from 'numeral'
import * as echarts from 'echarts'
import { isMobile } from '../../composition/hooks'
import { getRollupDetail } from '../../L2data/rollup';
import DappLogo from './DappLogo.vue'
import TwitterLink from './TwitterLink.vue';
import IconLink from './IconLink.vue';
import Selector from './Selector.vue';
import dateFormat from '../../util/dateFormat'
import TimeDiff from './TimeDiff.vue';

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
    'Transactions': 'rgba(17, 112, 255, 1)',
    'L2 Total Fee': 'rgba(239, 47, 45, 1)',
    'L1 Total Fee': 'rgba(17, 112, 255, 1)',
    'Deposit': 'rgba(239, 47, 45, 1)',
    "Withdraw": 'rgba(17, 112, 255, 1)',
}

const times = [
    { label: '1m', value: 1 },
    { label: '3m', value: 3 },
    { label: '6m', value: 6 },
    { label: '1y', value: 12 },
    { value: 'Max', label: 'Max' },
]
const isMax = (value) => value === 'Max'
const ONE_MONTH = 60 * 60 * 24 * 30

const padTimestamp = (timestamp) => timestamp * 1000

export default {
    name: "RollupDetail",
    data() {
        return {
            isShow: false,
            rollupData: {},
            detailData: {},
            times,
            currentTime: times[1].value,
            allSeries,
            allInteractionsSeries,
            color,
            checkData: ['New Users', 'Active Users'],
            checkInteractionsData: ['All Interactions', 'Bridge Interactions', 'Other Interactions'],
        };
    },
    watch: {
        chartData() {
            if (this.detailData.info) {
                this._chartUser && this._chartUser.setOption(this._getUsetChartOptions())
                this._chartInteractions && this._chartInteractions.setOption(this._getInteractionsChartOptions())
                this._chartTransaction && this._chartTransaction.setOption(this._getTransactionChartOptions())
                this._chartFees && this._chartFees.setOption(this._getFeesChartOptions())
                this._chartDeposit && this._chartDeposit.setOption(this._getDepositChartOptions())
                this._chartWithdraw && this._chartWithdraw.setOption(this._getWithdrawChartOptions())
            }
        },
    },
    computed: {
        isMobile() {
            return isMobile.value;
        },
        chartData() {
            if (!this.detailData || !this.detailData.info) {
                return undefined
            }
            const chartData = this.detailData
            const currentTime = this.currentTime
            const now = new Date().getTime() / 1000
            if (isMax(currentTime)) {
                for (const key in chartData) {
                    if (!["info", "update_time"].includes(key)) {
                        chartData[key].sort((a, b) => a.timestamp - b.timestamp)
                    }
                }
                const data = this.chartDateFormatter(chartData)
                return data
            }
            const selectDataTime = ONE_MONTH * currentTime
            const filterChartData = {}
            for (const key in chartData) {
                if (!["info", "update_time"].includes(key)) {
                    chartData[key].forEach(v => {
                        if (v.timestamp > now - selectDataTime) {
                            if (!filterChartData[key]) {
                                filterChartData[key] = []
                                filterChartData[key].push(v)
                            } else {
                                filterChartData[key].push(v)
                            }
                        }
                    })
                    filterChartData[key].sort((a, b) => a.timestamp - b.timestamp)
                } else {
                    filterChartData[key] = chartData[key]
                }
            }
            const data = this.chartDateFormatter(filterChartData)
            // console.log("chartData ==>", data)
            return data
        },
        isLightMode() {
            return this.$store.state.themeMode === 'light'
        },
    },
    mounted() {
        window.addEventListener('resize', this._onResize)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this._onResize)
    },
    methods: {
        close() {
            this.isShow = false;
            this.$emit('close', false);
        },
        async show(row, show) {
            this.rollupData = row;
            this.$loader.show()
            let res = await this._getData(row.rollup_name)
            this.$loader.hide()
            this.isShow = show;
            if (res.info) {
                this._initUserChart()
                this._initInteractionsChart();
                this._initTransactionChart()
                this._initFeesChart()
                this._initDepositChart()
                this._initWithdrawChart()
            }
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
                if (this._chartUser) {
                    this._chartUser.clear();
                    const option = this._getUsetChartOptions();
                    this._chartUser.setOption(option);
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
                if (this._chartInteractions) {
                    this._chartInteractions.clear();
                    const option = this._getInteractionsChartOptions();
                    this._chartInteractions.setOption(option);
                }
            }
        },
        chartDateFormatter(chartData) {
            let data = {}
            for (const key in chartData) {
                if (!["info", "update_time"].includes(key)) {
                    data[key] = {}
                    chartData[key].map(item => {
                        for (const v in item) {
                            if (!data[key][v]) {
                                data[key][v] = []
                                data[key][v].push(v == "timestamp" ? padTimestamp(item[v]) : item[v])
                            } else {
                                data[key][v].push(v == "timestamp" ? padTimestamp(item[v]) : item[v])
                            }
                        }
                    })
                } else {
                    data[key] = chartData[key]
                }
            }
            return data
        },
        async _getData(name) {
            const res = await getRollupDetail(name)
            const chartData = res
            this.detailData = res
            if (res.info) {
                const data = this.chartDateFormatter(chartData)
                return data
            } else {
                return {}
            }
        },
        _onResize() {
            this._chartUser && this._chartUser.resize()
            this._chartInteractions && this._chartInteractions.resize()
            this._chartTransaction && this._chartTransaction.resize()
            this._chartFees && this._chartFees.resize()
            this._chartDeposit && this._chartDeposit.resize()
            this._chartWithdraw && this._chartWithdraw.resize()
        },
        _initUserChart() {
            this.$nextTick(() => {
                const chartUserDom = document.getElementById('rollup_user_chart')
                const chartUser = echarts.init(chartUserDom)
                this._chartUser = chartUser
                const option = this._getUsetChartOptions()
                this._chartUser.setOption(option)
            })
        },
        _initInteractionsChart() {
            this.$nextTick(() => {
                const chartInteractionsDom = document.getElementById('rollup_interactions_chart')
                const chartInteractions = echarts.init(chartInteractionsDom)
                this._chartInteractions = chartInteractions
                const option = this._getInteractionsChartOptions()
                this._chartInteractions.setOption(option)
            })
        },
        _initTransactionChart() {
            this.$nextTick(() => {
                const chartTransactionDom = document.getElementById('rollup_tx_chart')
                const chartTransaction = echarts.init(chartTransactionDom)
                this._chartTransaction = chartTransaction
                const option = this._getTransactionChartOptions()
                this._chartTransaction.setOption(option)
            })
        },
        _initFeesChart() {
            this.$nextTick(() => {
                const chartFeesDom = document.getElementById('rollup_fees_chart')
                const chartFees = echarts.init(chartFeesDom)
                this._chartFees = chartFees
                const option = this._getFeesChartOptions()
                this._chartFees.setOption(option)
            })
        },
        _initDepositChart() {
            this.$nextTick(() => {
                const chartDepositDom = document.getElementById('rollup_deposit_chart')
                const chartDeposit = echarts.init(chartDepositDom)
                this._chartDeposit = chartDeposit
                const option = this._getDepositChartOptions()
                this._chartDeposit.setOption(option)
            })
        },
        _initWithdrawChart() {
            this.$nextTick(() => {
                const chartWithdrawDom = document.getElementById('rollup_withdraw_chart')
                const chartWithdraw = echarts.init(chartWithdrawDom)
                this._chartWithdraw = chartWithdraw
                const option = this._getWithdrawChartOptions()
                this._chartWithdraw.setOption(option)
            })
        },
        _getUsetChartOptions() {
            const chart_data = this.chartData
            const chart_data_user = chart_data.chart_data_user
            // console.log("chart_data_user ==>", chart_data_user)
            if (chart_data_user) {
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
                        data: chart_data_user.timestamp,
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
                                    index % Math.ceil(chart_data_user.timestamp.length / (this.isMobile ? 3 : 6)) === 0
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
                            color: colorMap['New Users'],
                        },
                        showSymbol: false,
                        emphasis: {
                            focus: 'series',
                            itemStyle: {
                                borderColor: colorMap['New Users'],
                            }
                        },
                        data: chart_data_user.new_users,
                    })
                }
                if (this.checkData.includes('Active Users')) {
                    options.series.push({
                        name: 'Active Users',
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            width: 4,
                            color: colorMap['Active Users'],
                        },
                        showSymbol: false,
                        emphasis: {
                            focus: 'series',
                            itemStyle: {
                                borderColor: colorMap['Active Users'],
                            }
                        },
                        data: chart_data_user.active_users,
                    })
                }
                if (this.checkData.includes('All Users')) {
                    options.series.push({
                        name: 'All Users',
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            width: 4,
                            color: colorMap['All Users'],
                        },
                        showSymbol: false,
                        emphasis: {
                            focus: 'series',
                            itemStyle: {
                                borderColor: colorMap['All Users'],
                            }
                        },
                        data: chart_data_user.all_users,
                    })
                }
                return options
            } else {
                return {}
            }
        },
        _getInteractionsChartOptions() {
            const chart_data = this.chartData
            const chart_data_bridge = chart_data.chart_data_bridge
            if (chart_data_bridge) {
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
                        data: chart_data_bridge.timestamp,
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
                                    index % Math.ceil(chart_data_bridge.timestamp.length / (this.isMobile ? 3 : 6)) === 0
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
                if (this.checkInteractionsData.includes('Other Interactions')) {
                    options.series.push({
                        name: 'Other Interactions',
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            width: 4,
                            color: colorMap['Other Interactions'],
                        },
                        showSymbol: false,
                        emphasis: {
                            focus: 'series',
                            itemStyle: {
                                borderColor: colorMap['Other Interactions'],
                            }
                        },
                        data: chart_data_bridge.other_tx,
                    })
                }
                if (this.checkInteractionsData.includes('Bridge Interactions')) {
                    options.series.push({
                        name: 'Bridge Interactions',
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            width: 4,
                            color: colorMap['Bridge Interactions'],
                        },
                        showSymbol: false,
                        emphasis: {
                            focus: 'series',
                            itemStyle: {
                                borderColor: colorMap['Bridge Interactions'],
                            }
                        },
                        data: chart_data_bridge.bridge_tx,
                    })
                }
                if (this.checkInteractionsData.includes('All Interactions')) {
                    options.series.push({
                        name: 'All Interactions',
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            width: 4,
                            color: colorMap['All Interactions'],
                        },
                        showSymbol: false,
                        emphasis: {
                            focus: 'series',
                            itemStyle: {
                                borderColor: colorMap['All Interactions'],
                            }
                        },
                        data: chart_data_bridge.daily_tx,
                    })
                }
                return options
            } else {
                return {}
            }
        },
        _getTransactionChartOptions() {
            const chart_data = this.chartData
            const chart_data_transaction = chart_data.chart_data_transaction
            // console.log("chart_data_transaction ==>", chart_data_transaction)
            if (chart_data_transaction) {
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
                        // min: chart_data_transaction.timestamp[0],
                        // max: chart_data_transaction.timestamp[chart_data_transaction.timestamp.length - 1],
                        data: chart_data_transaction.timestamp,
                        axisTick: {
                            show: false,
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: this.isLightMode
                                    ? 'rgba(51, 51, 51, 0.4)'
                                    : 'rgba(255, 255, 255, 0.4)',
                            },
                        },
                        axisLabel: {
                            // rotate: '45',
                            interval: (index) => {
                                return (
                                    index % Math.ceil(chart_data_transaction.timestamp.length / (this.isMobile ? 3 : 4)) === 0
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
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: true,
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
                    series: [{
                        name: 'Transactions',
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            width: 2,
                            color: colorMap['Transactions'],
                        },
                        showSymbol: false,
                        emphasis: {
                            focus: 'series',
                            itemStyle: {
                                borderColor: colorMap['Transactions']
                            }
                        },
                        data: chart_data_transaction.tx_count,
                    }],
                }
                return options
            } else {
                return {}
            }
        },
        _getFeesChartOptions() {
            const chart_data = this.chartData
            const chart_data_fee = chart_data.chart_data_fee
            // console.log("chart_data_fee ==>", chart_data_fee)
            if (chart_data_fee) {
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
                        right: '9%',
                        bottom: '3%',
                        containLabel: true,
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        alignTicks: false,
                        // min: chart_data_transaction.timestamp[0],
                        // max: chart_data_transaction.timestamp[chart_data_transaction.timestamp.length - 1],
                        data: chart_data_fee.timestamp,
                        axisTick: {
                            show: false,
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: this.isLightMode
                                    ? 'rgba(51, 51, 51, 0.4)'
                                    : 'rgba(255, 255, 255, 0.4)',
                            },
                        },
                        axisLabel: {
                            // rotate: '45',
                            interval: (index) => {
                                return (
                                    index % Math.ceil(chart_data_fee.timestamp.length / (this.isMobile ? 3 : 4)) === 0
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
                        axisLabel: {
                            formatter:'{value} ETH'
                        },
                        axisTick: {
                            show: false,
                        },
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: true,
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
                    series: [{
                        name: 'L2 Total Fee',
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            width: 2,
                            color: colorMap['L2 Total Fee'],
                        },
                        showSymbol: false,
                        emphasis: {
                            focus: 'series',
                        },
                        data: chart_data_fee.l2_total_fee,
                    },
                    {
                        name: 'L1 Total Fee',
                        type: 'line',
                        smooth: true,
                        lineStyle: {
                            width: 2,
                            color: colorMap['L1 Total Fee'],
                        },
                        showSymbol: false,
                        emphasis: {
                            focus: 'series',
                        },
                        data: chart_data_fee.l1_total_fee,
                    }],
                }
                return options
            } else {
                return {}
            }
        },
        _getDepositChartOptions() {
            const chart_data = this.chartData
            const chart_data_deposit = chart_data.chart_data_deposit
            // console.log("chart_data_deposit ==>", chart_data_deposit)
            if (chart_data_deposit) {
                const options = {
                    color: colorMap['Deposit'],
                    tooltip: {
                        trigger: 'axis',
                        padding: 0,
                        axisPointer: {
                            type: 'line',
                            lineStyle: {
                                type: 'solid',
                                width: 1
                            }
                        },
                        backgroundColor: 'transparent',
                        formatter: this._onFormatterCategory,
                        position: this.isMobile
                            ? function (pos, params, dom, rect, size) {
                                const obj = { top: '10%' }
                                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
                                return obj
                            }
                            : undefined,
                    },
                    grid: {
                        top: 26,
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: chart_data_deposit.timestamp,
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    show: true,
                                    color: this.isLightMode
                                        ? 'rgba(51, 51, 51, 0.4)'
                                        : 'rgba(255, 255, 255, 0.4)',
                                }
                            },
                            axisLabel: {
                                interval: (index) => {
                                    return (
                                        index % Math.ceil(chart_data_deposit.timestamp.length / (this.isMobile ? 3 : 6)) === 0
                                    )
                                },
                                formatter: (value) => dateFormat(parseInt(value), 'yyyy-MM-dd'),
                            },


                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            splitLine: false,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    show: true,
                                    color: this.isLightMode
                                        ? 'rgba(51, 51, 51, 0.4)'
                                        : 'rgba(255, 255, 255, 0.4)',
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: 'Deposit',
                            type: 'bar',
                            barWidth: '60%',
                            emphasis: {
                                focus: 'series',
                                itemStyle: {
                                    borderColor: colorMap['Deposit'],
                                }
                            },
                            data: chart_data_deposit.total_tx
                        }
                    ]
                }

                return options
            } else {
                return {}
            }
        },
        _getWithdrawChartOptions() {
            const chart_data = this.chartData
            const chart_data_withdraw = chart_data.chart_data_withdraw
            // console.log("chart_data_withdraw ==>", chart_data_withdraw)
            if (chart_data_withdraw) {
                const options = {
                    color: colorMap['Withdraw'],
                    tooltip: {
                        trigger: 'axis',
                        padding: 0,
                        axisPointer: {
                            type: 'line',
                            lineStyle: {
                                type: 'solid',
                                width: 1
                            }
                        },
                        backgroundColor: 'transparent',
                        formatter: this._onFormatterCategory,
                        position: this.isMobile
                            ? function (pos, params, dom, rect, size) {
                                const obj = { top: '10%' }
                                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
                                return obj
                            }
                            : undefined,
                    },
                    grid: {
                        top: 26,
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: chart_data_withdraw.timestamp,
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    show: true,
                                    color: this.isLightMode
                                        ? 'rgba(51, 51, 51, 0.4)'
                                        : 'rgba(255, 255, 255, 0.4)',
                                }

                            },
                            axisLabel: {
                                interval: (index) => {
                                    return (
                                        index % Math.ceil(chart_data_withdraw.timestamp.length / (this.isMobile ? 3 : 6)) === 0
                                    )
                                },
                                formatter: (value) => dateFormat(parseInt(value), 'yyyy-MM-dd'),
                            },


                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            splitLine: false,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    show: true,
                                    color: this.isLightMode
                                        ? 'rgba(51, 51, 51, 0.4)'
                                        : 'rgba(255, 255, 255, 0.4)',
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: 'Withdraw',
                            type: 'bar',
                            barWidth: '60%',
                            emphasis: {
                                focus: 'series',
                                itemStyle: {
                                    borderColor: colorMap['Withdraw'],
                                }
                            },
                            data: chart_data_withdraw.total_tx
                        }
                    ]
                }

                return options
            } else {
                return {}
            }
        },
        _onFormatterCategory(params) {
            const axisValue = params[0].axisValue
            const item_data = this._getDepositOrWithdrawDataByTime(axisValue, params[0].seriesName)
            const title = dateFormat(parseInt(axisValue), 'yyyy-MM-dd')

            let listmod = ''
            const keysSorted = Object.keys(item_data.coin_fees).sort((a, b) => item_data.coin_fees[b] - item_data.coin_fees[a])
            let sortObj = {}
            for (let i = 0; i < keysSorted.length; i++) {
                sortObj[keysSorted[i]] = item_data.coin_fees[keysSorted[i]];
            }

            for (const key in sortObj) {
                listmod += `<div class="chart-popover-rollup">
                            <div class="name">${key} Gas</div>
                            <div class="transactions">
                                ${numeral(item_data.coin_fees[key] / item_data.total_fees).format('0.00%')}
                            </div>
                            <div class="percentage" style="margin-left: 5px">
                                (${numeral(item_data.coin_tx[key]).format('0,0')} Tx)
                            </div>
                          </div> `
            }
            // console.log(listmod)

            return `<div class="chart-popover-content">
                ${params[0].seriesName == 'Deposit' ?
                    `<div class="chart-popover-total-transactions">${title}</div>
                <div class="chart-popover-total-transactions">
                    Transactions: <span>${numeral(params[0].data).format(
                        '0,0'
                    )}</span>
                    </div>
                    <div class="chart-popover-total-transactions">
                    Total Fees: <span>${numeral(item_data.total_fees).format(
                        '0,0.0000'
                    )} ETH</span>
                    </div>
                    <div class="chart-popover-rollups">
                        ${listmod}
                    </div>
                </div>`
                    :
                    `<div class="chart-popover-total-transactions-withdraw">${title}</div>
                <div class="chart-popover-total-transactions-withdraw">
                    Transactions: <span>${numeral(params[0].data).format(
                        '0,0'
                    )}</span>
                    </div>
                    <div class="chart-popover-total-transactions-withdraw">
                    Total Fees: <span>${numeral(item_data.total_fees).format(
                        '0,0.0000'
                    )} ETH</span>
                    </div>
                    <div class="chart-popover-rollups">
                        ${listmod}
                    </div>
                </div>`}
                `
        },
        _onFormatter(params) {
            const axisValue = params[0].axisValue
            const all_users = ["All Users", "Active Users", "New Users"].includes(params[0].seriesName) ? this._getDataByTime(axisValue).all_users : ''
            const title = dateFormat(parseInt(axisValue), 'yyyy-MM-dd')
            const paramsData = ["L1 Total Fee", "L2 Total Fee"].includes(params[0].seriesName) ? params : params.reverse()
            paramsData.sort((a, b) => b.data - a.data)

            return `<div class="dapp-detail-chart-popover-content">
                <div class="dapp-detail-chart-popover-title">${title}</div>
                <div class="dapp-detail-chart-popover-data">
                   ${paramsData
                    .map((item) => {
                        if (["L1 Total Fee", "L2 Total Fee"].includes(item.seriesName)) {
                            return `
                            <div class="dapp-detail-chart-popover-data-item">
                            <div class="dot" style="background:${colorMap[item.seriesName]
                                }"></div>
                            ${item.seriesName == 'L2 Total Fee' ?
                                    `<div class="name" style="color: ${colorMap[item.seriesName]}">${this.chartData.info.rollup_name} Received on L2</div>`
                                    :
                                    `<div class="name" style="color: ${colorMap[item.seriesName]}">${this.chartData.info.rollup_name} Spent on L1</div>`}                           
                            <div class="value" style="color: ${colorMap[item.seriesName]}">${numeral(item.value).format('0,0.00')} ETH</div>
                            </div>
                            `
                        }
                        return `
                        <div class="dapp-detail-chart-popover-data-item">
                        <div class="dot" style="background:${colorMap[item.seriesName]
                            }"></div>
                        ${item.seriesName == 'Transactions' ? `<div class="name" style="color: ${colorMap[item.seriesName]}">${item.seriesName}</div>` : `<div class="name">${item.seriesName}</div>`}
                        ${item.seriesName == 'Transactions' ? `<div class="value" style="color: ${colorMap[item.seriesName]}">${numeral(item.value).format('0,0')}</div>` :
                                `<div class="value">${numeral(item.value).format('0,0')}
                        ${!['All Users', "Transactions"].includes(item.seriesName)
                                    ? `<span>(${((item.value / all_users) * 100).toFixed(
                                        2
                                    )}%)</span>`
                                    : ''
                                }
                            </div>
                        </div>`
                            }
                        `
                    })
                    .join('')}
                </div>
              </div>`
        },
        _getDataByTime(axisValue) {
            const chartData = this.detailData.chart_data_user
            return chartData.find((item) => {
                return item.timestamp * 1000 === parseInt(axisValue)
            })
        },
        _getDepositOrWithdrawDataByTime(axisValue, name = 'Deposit') {
            const chartData = name == 'Deposit' ? this.detailData.chart_data_deposit : this.detailData.chart_data_withdraw
            return chartData.find((item) => {
                return item.timestamp * 1000 === parseInt(axisValue)
            })
        },
    },
    components: { DappLogo, TwitterLink, IconLink, Selector, TimeDiff }
}
</script>
<style lang="scss">
.rollup-detail-dialog {
    border-radius: 20px;
    width: 880px;

    .el-dialog__header {
        padding-bottom: 0;
    }

    .el-dialog__body {
        padding: 30px;
        padding-top: 20px;
    }

    .chart-popover-title {
        color: #df2e2d;
    }

    .chart-popover-total-transactions {
        font-weight: 700;
        margin-bottom: 10px;

        span {
            color: #333333;
        }
    }

    .chart-popover-total-transactions-withdraw {
        font-weight: 700;
        margin-bottom: 10px;

        span {
            color: rgba(17, 112, 255, 1);
        }
    }

    .rollup-detail-dialog-title {
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

    .rollup-detail-dialog-content {
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
                color: #333333
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

        .selectors {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            .time_box {
                display: flex;
                align-items: center;
                .time {
                    margin-right: 20px;
                }
            }
            .data_soon {
                font-weight: normal;
                font-family: 'Inter Regular';
                font-size: 14px;
            }

            .rollup_gas {
                // display: flex;
                // align-items: center;
                line-height: 32px;

                .text {
                    font-size: 12px;
                    font-weight: normal;
                    font-family: 'Inter Regular';
                    margin: 0 3px;
                }

                .fee {
                    font-weight: bold;
                    color: #333333;
                }

                .question {
                    display: block;
                    margin-left: 10px;
                }
            }

            .selector {
                margin-left: auto;
            }
        }

        .rollup_charts {

            .content {
                margin-top: 20px;
                background: #f5f5f5;
                border-radius: 12px;
                margin-bottom: 30px;
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

                #rollup_user_chart,
                #rollup_interactions_chart,
                #rollup_tx_chart,
                #rollup_fees_chart,
                #rollup_deposit_chart,
                #rollup_withdraw_chart {
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
}

@media (max-width: 880px) {
    .rollup-detail-dialog {
        width: 100%;

        .rollup-detail-dialog-content {
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
    .rollup-detail-dialog {
        background: #373951;
        box-shadow: 0px 8px 50px rgba(0, 0, 0, 0.5);

        .rollup-detail-dialog-title {
            .name {
                color: #fff;
            }

            .close {
                background-image: url('../../assets/data/close-dark.png');
            }
        }

        .chart-popover-total-transactions {
            font-weight: 700;
            margin-bottom: 10px;

            span {
                color: #fff;
            }
        }

        .rollup-detail-dialog-content {
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

            .selectors {
                .rollup_gas {
                    .text {
                        color: rgba(255, 255, 255, 0.6);
                    }

                    .fee {
                        color: #fff;
                    }
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