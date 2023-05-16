<template>
    <div>
        <div class="history-page">

            <div class="history-content">
                <div
                        class="header-links-box"
                        :style="`flex-direction: ${isMobile ? 'column' : 'row'};`"
                >
                    <template v-for="(nav, idx) in navs">
                        <div
                                :key="nav"
                                @click="changeNav(nav)"
                                :class="[
                    'nav-item',
                    'center',
                    {
                        selected:nav === currentNav,
                        'nav-item-border-bottom':true,
                        'nav-item-border-top':true,
                    },
                ]"
                        >
                            {{ nav }}
                        </div>
                    </template>
                </div>
                <div :hidden="currentNav !== 'History'">
                    <div v-if="!isMobile" class="title">History</div>
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
                                isMobile ? item.fromTimeStampShowShort : item.fromTimeStampShow
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
                <div :hidden="currentNav !== 'Search'" style="margin: 20px">
                    <el-form
                            ref="formRef"
                            label-width="140px"
                    >
                        <div style="text-align: left;justify-content: left;padding-left: 20px;margin-bottom: 30px">
                            Your Transaction Details
                        </div>
                        <el-form-item label="* Tx Hash">
                            <el-input style="width: 70%;height:30px"
                                    type="text"
                                    v-model="txHash"
                                   placeholder="Please enter Tx Hash"
                            />
                        </el-form-item>
                        <el-form-item label="* From Chain">
                            <el-select v-model="selectChainId" style="width: 70%;height:30px" placeholder="Please select From Chain">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div class="search">
                        <CommBtn v-loading="searchLoading"
                                @click="submitTx"
                                :style="`border-radius: 40px;margin-right:40px;width:100%`"
                        >
                          <span style="letter-spacing: 0.15rem">
                            Submit
                          </span>
                        </CommBtn>
                    </div>
                    <div>
                        <div v-if="showError" class="search" style="font-weight: bolder;">
                            No relevant destination Transaction Hash is found. You can submit your source Transaction Hash on the
                            <span class="url" @click="openUrl('http://discord.gg/hJJvXP7C73')">Discord-support</span>
                             channel, we will help you on this. Your assets are safe.
                        </div>
                        <div class="search" style="margin-top: 20px;">
                            <span class="text" style="font-size: 16px;">To confirm that your Transaction Hash was generated from Orbiter, you can:</span><br>
                            <span class="text">1. Make sure that this Transaction Hash was initiated at <span class="bold">Orbiter official website</span>.</span><br>
                            <span class="text">2. The last four digits of your Tx value contain an ID code starts with <span class="bold">90XX</span>.</span><br>
                            <span class="text">3. Your transaction <span class="bold">amount</span> is supported by Orbiter.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BigNumber from 'bignumber.js'
import config from '../config'
import { NoData,CommBtn } from '../components'
import {
    isMobile,
    historyPanelState,
    getTransactionsHistory,
    recoverSenderPageWorkingState,
    setHistoryInfo,
} from '../composition/hooks';
import { compatibleGlobalWalletConf } from '../composition/walletsResponsiveData'
import openApiAx from "../common/openApiAx";
import util from "../util/util";
let timer = 0
export default {
    name: 'History',
    components: {
        NoData,
        CommBtn
    },
    data() {
        return {
            searchLoading: false,
            txHash: "",
            navs: ['History', "Search"],
            currentNav: 'History',
            options: [],
            selectChainId: '',
            showError: false
        };
    },
    computed: {
        isMobile() {
            return isMobile.value
        },
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
        currentWalletAddress() {
            return compatibleGlobalWalletConf.value.walletPayload.walletAddress;
        },
    },
    watch: {
        currentWalletAddress: function (newValue, oldValue) {
            if (oldValue !== newValue && newValue !== '0x') getTransactionsHistory();
        },
    },
    created() {
        this.options = [];
        const chainConfig = config.chainConfig;
        for (const data of chainConfig) {
            this.options.push({ label: data.name, value: data.internalId });
        }
    },
    mounted() {
        const { query } = this.$route;
        if (query.page === 'History') {
            this.currentNav = "History";
        } else if (query.page === 'Search') {
            this.currentNav = "Search";
        }
        getTransactionsHistory();
    },
    methods: {
        openUrl(url) {
            window.open(url, '_blank');
        },
        changeNav(nav) {
            this.currentNav = nav;
            const { path } = this.$route;
            this.$router.push({
                path,
                query: { page: nav }
            });
        },
        async submitTx() {
            const selectChainId = +this.selectChainId;
            let txHash = this.txHash;
            if (!selectChainId) {
                util.showMessage("Please enter From Chain", "error");
                return;
            }
            if (!txHash) {
                util.showMessage("Hash error", "error");
                return;
            }
            if (selectChainId === 4 || selectChainId === 44) {
                // starknet
                txHash = util.starknetHashFormat(txHash);
            } else if (selectChainId === 8 || selectChainId === 88) {
                if (!Number(txHash)) {
                    util.showMessage("Hash error", "error");
                    return;
                }
            } else if (txHash.length !== 66 || txHash.substring(0, 2) !== '0x') {
                util.showMessage("Hash error", "error");
                return;
            }

            this.searchLoading = true;
            const res = await openApiAx.get(`/status?hash=${ txHash }`);
            this.searchLoading = false;
            if (!res) {
                util.showMessage("Request frequent", "error");
                return;
            }
            const { status, txList } = res;
            if (status === 99) {
                const data = {};
                for (const tx of txList) {
                    let decimal = 18;
                    if (tx.symbol === 'USDC' || tx.symbol === 'USDT') {
                        decimal = 6;
                    }
                    if (tx.side === 0) {
                        const date = new Date(tx.timestamp);
                        data.fromHash = tx.hash;
                        data.fromChain = tx.chainId;
                        data.fromTime = tx.timestamp;
                        data.fromAmount = tx.value;
                        data.fromToken = tx.symbol;
                        data.fromTimeStampShow = util.formatDate(date);
                        data.fromAmountValue = (new BigNumber(tx.value).dividedBy(10 ** decimal)).toFixed(8);
                    }
                    if (tx.side === 1) {
                        const date = new Date(tx.timestamp);
                        data.toHash = tx.hash;
                        data.toChain = tx.chainId;
                        data.toTime = tx.timestamp;
                        data.toAmount = tx.value;
                        data.toToken = tx.symbol;
                        data.toTimeStampShow = util.formatDate(date);
                        data.toAmountValue = (new BigNumber(tx.value).dividedBy(10 ** decimal)).toFixed(8);
                    }
                }
                this.showError = false;
                this.getHistoryInfo(data);
            } else {
                await openApiAx.get(`/collectUserTransactions?fromHash=${ txHash }&fromChain=${ selectChainId }`);
                this.showError = true;
            }
        },
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
        },
        logoName(chainID) {
            return this.$env.chainIcon[+chainID]
        },
    },
}
</script>

<style scoped lang="scss">
    .header-links-box {
        display: flex;
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        .nav-item {
            height: 60px;
            position: relative;
            display: inline-flex;
        }
        .nav-item.selected::after {
            content: '';
            position: absolute;
            width: 40px;
            height: 6px;
            background: #df2e2d;
            bottom: 8px;
            left: calc(50% - 20px);
            border-radius: 11px;
        }
    }
    .search {
        margin-top: 40px;
        font-size: 12px;
        font-family: 'Inter Regular';
        text-align: left;
        .url {
            color: #000000;
            white-space: nowrap;
            cursor: pointer;
            display: inline-block;
            line-height: 25px;
            text-decoration: underline;
        }
        .bold {
            font-weight: bolder;
        }
        .text {
            line-height: 20px;
            height: 20px;
        }
    }
.app {
    .header-links-box {
        height: 40px;
        .nav-item {
            height: 24px;
            margin-right: 39px;
            cursor: pointer;
        }
        .nav-item:last-child {
            margin-right: 0;
        }
        .nav-item.selected::after {
            bottom: -10px;
        }
    }
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
    .nav-item-sub {
        // height: 50px;
        position: relative;
        display: inline-flex;
        font-family: 'Inter Regular';
        line-height: 24px;
        margin-bottom: 12px;
        padding-bottom: 16px;
    }
    .nav-item-sub.selected::after {
        content: '';
        position: absolute;
        width: 40px;
        height: 6px;
        background: #df2e2d;
        bottom: 0px;
        left: calc(50% - 20px);
        border-radius: 11px;
    }
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
