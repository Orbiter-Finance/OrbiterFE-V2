<template>
    <div class="history-page">
        <div class="history-content">
            <div class="title">History</div>
<!--            <div class="title" style="margin-bottom: 100px;">History</div>-->
<!--            <span style="line-height: 25px;width:400px;font-size:18px;font-family: 'Inter Regular';color:#81807C">-->
<!--                Our Hisory is temporarily offline for essential maintenance.<br>-->
<!--                 Apologies for any inconvenience.-->
<!--            </span>-->
            <div class="table historyContent">
                <div class="table-header">
                    <span class="col col-1">&nbsp;</span>
                    <span class="col col-2">Time</span>
                    <span class="col col-3">Value</span>
                    <span class="col col-4" style="text-align: center"
                        >From</span
                    >
                    <span class="col col-5" style="text-align: center">To</span>
                </div>
                <div class="dydx-limit" v-if="isShowDydxLimit">
                    Limited by the dydx mechanism, the history of dYdX cannot be
                    queried temporarily
                </div>
                <CommLoading
                    v-if="isApiLoading"
                    style="margin: auto; margin-top: 5rem"
                    width="4rem"
                    height="4rem"
                />
                <div
                    v-else-if="historyData && historyData.length !== 0"
                    v-for="(item, index) in historyData"
                    :key="index"
                    @click="getHistoryInfo(item)"
                    class="contentItem"
                >

                    <svg-icon
                        class="logo col-val col-1"
                        color="#df2e2d"
                        :iconName="iconName(item)"
                    ></svg-icon>
                    <span class="col-val col-2">{{
                        item.fromTimeStampShow
                    }}</span>
                    <span class="col-val col-3">{{
                        item.fromAmountValue + item.fromToken
                    }}</span>
                    <div
                        class="col-val col-4"
                        style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        "
                    >
                        <svg-icon
                            :iconName="logoName(item.fromChain)"
                            style="width: 1.6rem; height: 1.6rem"
                        ></svg-icon>
                    </div>
                    <div
                        class="col-val col-5"
                        style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        "
                    >
                        <svg-icon
                            :iconName="logoName(item.toChain)"
                            style="width: 1.6rem; height: 1.6rem"
                        ></svg-icon>
                    </div>
                </div>
            </div>
            <NoData
                v-if="!isApiLoading && historyData && historyData.length === 0"
                style="padding-top: 200px"
                >No history</NoData
            >
            <el-pagination
                v-if="!isApiLoading && historyData && historyData.length !== 0"
                @current-change="curChange"
                class="pagination"
                layout="prev, pager, next"
                :current-page="currentPage"
                :total="transactionListInfo.total"
            >
            </el-pagination>

            <svg-icon
                @click.native="closeDialog"
                class="close"
                iconName="close"
            ></svg-icon>
          
        </div>
    </div>
</template>

<script>
import { NoData } from '../components'
import {
    historyPanelState,
    getTransactionsHistory,
    recoverSenderPageWorkingState,
    setHistoryInfo,
} from '../composition/hooks'
import { compatibleGlobalWalletConf } from '../composition/walletsResponsiveData'
let timer = 0
export default {
    name: 'History',
    components: {
        NoData,
    },
    computed: {
        currentPage() {
            return this.transactionListInfo.current
        },
        historyData() {
            const { transactionList } = historyPanelState
            if (!transactionList) {
                return transactionList
            }
            // Hide dydx (from and to)
            const list = []
            for (const item of transactionList) {
                if (
                    item.fromChainID == 11 ||
                    item.fromChainID == 511 ||
                    item.toChainID == 11 ||
                    item.toChainID == 511
                ) {
                    continue
                }
                list.push(item)
            }
            return list
        },
        isShowDydxLimit() {
            const { transactionList } = historyPanelState
            if (!this.historyData || !transactionList) {
                return false
            }
            if (this.historyData.length < transactionList.length) {
                return true
            }
            return false
        },
        isApiLoading() {
            return historyPanelState.isLoading
        },
        transactionListInfo() {
            return historyPanelState.transactionListInfo
        },
    },
    deactivated() {
        clearInterval(timer)
    },
    created() {
        timer = setInterval(() => {
            if (compatibleGlobalWalletConf.value.walletPayload.walletAddress) {
                clearInterval(timer)
                getTransactionsHistory()
            }
        }, 500)
    },
    beforeRouteEnter(to, from, next) {
      next(() => {
        getTransactionsHistory()
      })
    },
    methods: {
        curChange(cur) {
            getTransactionsHistory({ current: cur })
        },
        closeDialog() {
            const last = JSON.parse(
                localStorage.getItem('last_page_before_history') || '{}'
            )
            try {
                if (last.path) {
                    last.path !== this.$route.path && this.$router.push(last)
                    recoverSenderPageWorkingState()
                } else {
                    this.$router.push({ path: '/' })
                }
            } catch (err) {
                console.error(err)
            }
        },
        getHistoryInfo(e) {
            setHistoryInfo(e)
            this.closeDialog()
        },
        stopPenetrate(e) {
            e.stopPropagation()
        },
        iconName(item) {
            if (item.fromHash && item.toHash) {
                return 'history_success'
            }
            //  else if (item.state === 1) {
            //     return 'history_waiting'
            // } else {
            //     return 'history_fail'
            // }
        },
        logoName(chainID) {
            return this.$env.chainIcon[+chainID]
            // if (chainID == '2' || chainID == '22') {
            //     return 'arblogo'
            // } else if (chainID == '3' || chainID == '33') {
            //     return 'zklogo'
            // } else if (chainID == '4' || chainID == '44') {
            //     return 'sknlogo'
            // } else if (chainID == '6' || chainID == '66') {
            //     return 'pglogo'
            // } else if (chainID == '7' || chainID == '77') {
            //     return 'oplogo'
            // } else if (chainID == '8' || chainID == '88') {
            //     return 'imxlogo'
            // } else if (chainID == '9' || chainID == '99') {
            //     return 'loopringlogo'
            // } else if (chainID == '10' || chainID == '510') {
            //     return 'metislogo'
            // } else if (chainID == '11' || chainID == '511') {
            //     return 'dydxlogo'
            // } else if (chainID == '12' || chainID == '512') {
            //     return 'zkspacelogo'
            // } else if (chainID == '13' || chainID == '513') {
            //     return 'bobalogo'
            // } else if (chainID == '15' || chainID == '515') {
            //     return 'bsclogo'
            // } else if (chainID == '16' || chainID == '516') {
            //     return 'arnavologo'
            // } else if (chainID == '518' || chainID == '519') {
            //     return 'scrolllogo'
            // } else if (chainID == '520' || chainID == '520') {
            //     return 'taiko'
            // } else {
            //     return 'ethlogo'
            // }
        },
    },
}
</script>

<style scoped lang="scss">
.app {
    .history-page {
        border-radius: 20px;
        .history-content {
            min-height: 630px;
            width: 600px;
            .table {
                .table-header {
                    padding: 4px 20px;
                }
                .col {
                    margin-right: 26px;
                }
                .col-5 {
                    margin-right: 0 !important;
                }
                .contentItem {
                    padding: 4px 20px;
                    .col-val {
                        margin-right: 26px;
                        text-align: left;
                    }
                }
            }
        }
    }
}
.app-mobile {
    .history-page {
        .history-content {
            min-width: 335px;
            height: 100%;
            min-height: 300px;
            // overflow-y: scroll;
            // overflow-x: hidden;
            .table {
                .col-1 {
                    min-width: 16px;
                    min-height: 16px;
                    margin-left: 12px;
                    margin-right: 10px;
                }
                .col-2 {
                    min-width: 100px;
                }
                .col-3 {
                    min-width: 120px;
                }
                .col-4 {
                    min-width: 33px;
                    margin-right: 8px;
                }
                .col-5 {
                    // min-width: 32px;
                    min-width: 38px;
                }
                .contentItem {
                    min-width: 335px;
                    .col-val {
                        text-align: left;
                    }
                }
            }
        }
    }
}
.history-page {
    font-family: 'Inter Regular';
    display: flex;
    justify-content: center;
    align-items: center;
    // overflow: hidden;
    width: 100%;
    height: 100%;
    .history-content {
        padding: 18px 20px;
        height: 100%;
        border-radius: 20px;
        position: relative;
        .title {
            font-weight: 700;
            font-size: 16px;
            line-height: 24px;
            font-family: 'Inter Bold';
        }
        .table {
            margin-top: 26px;
            font-weight: 400;
            font-size: 14px;
            line-height: 24px;
            .table-header {
                height: 32px;
                border-radius: 8px;
                display: flex;
                align-items: center;
            }
            .col {
                text-align: left;
            }
            .col-1 {
                width: 16px;
            }
            .col-2,
            .col-3 {
                width: 150px;
            }
            .col-4,
            .col-5 {
                width: 40px;
            }
            // .col:last-child {
            //   margin-right: 0px;
            // }
        }

        .pagination {
            margin-top: 24px;
            text-align: right;
        }
        .close {
            position: absolute;
            top: 24px;
            right: 26px;
            width: 12px;
            height: 12px;
            cursor: pointer;
        }
    }

    .dydx-limit {
        color: #e85e24;
        font-size: 14px;
        padding-top: 8px;
    }

    .historyContent {
        position: relative;
        .contentItem {
            font-size: 1.4rem;
            font-weight: lighter;
            align-items: center;
            display: flex;
            position: relative;
            text-align: left;
            height: 32px;
            line-height: 32px;
            margin-top: 8px;
            margin-bottom: 8px;
            cursor: pointer;
        }
        .contentItem:hover {
            border-radius: 8px;
        }
    }
}
</style>

<style scoped>
/* ------------- override element style --------------- */
.history-page >>> .el-pager .number.active {
    background: #df2e2d;
    border-radius: 8px;
    color: white;
}
.history-page >>> .el-pager li:hover {
    color: rgba(51, 51, 51, 0.8);
    background: #f5f5f5;
    border-radius: 8px;
}
.dark-theme .history-page >>> .el-pager li:hover {
    color: rgba(255, 255, 255, 0.6);
    background: #3f415b;
    border-radius: 8px;
}
.dark-theme .history-page >>> .el-pagination button:disabled {
    background-color: #373951;
    color: rgba(255, 255, 255, 0.6);
}
.dark-theme .history-page >>> .el-pager li {
    background-color: #373951;
    color: rgba(255, 255, 255, 0.6);
}
.dark-theme .history-page >>> .el-pagination .btn-next,
.dark-theme .history-page >>> .el-pagination .btn-prev {
    background: center center no-repeat #373951;
    color: rgba(255, 255, 255, 0.6);
}
.app-mobile .history-page >>> .el-pager li {
    min-width: 30px !important;
}
</style>
