<template>
    <div class="bridage-page">
        <template>
            <div
                v-show="!isMobile && status === '1' && !showDetail"
                class="sub-tabs"
            >
                <ToggleBtn @input="toggleTab" />
            </div>
            <div
                v-show="isSenderTab && status === '1' && !showDetail"
                class="sender-box"
            >
                <keep-alive>
                    <Transfer @stateChanged="changeState" />
                </keep-alive>
            </div>
            <div
                v-show="!isSenderTab && status === '1' && !showDetail"
                class="maker-box"
            >
                <div class="new">
                    <img class="img" src="../../assets/new.png" />
                </div>
                <div class="maker-title">Early Access</div>
                <div class="maker-content">
                    <div style="margin-bottom: 30px">
                        <div class="maker-desc">
                            <div class="point">1</div>
                            <div>
                                Become a maker and configure node parameters.
                            </div>
                        </div>
                        <div class="maker-desc">
                            <div class="point">2</div>
                            <div>
                                Run nodes to ensure instant response to users.
                            </div>
                        </div>
                        <div class="maker-desc">
                            <div class="point">3</div>
                            <div>
                                Maintain sufficient liquidity in the node by
                                depositing margin.
                            </div>
                        </div>
                        <div class="maker-desc">
                            <div class="point">4</div>
                            <div>
                                Experience arbitration process when transactions
                                fail.
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="maker-line">
                            <SvgIconThemed
                                icon="docs"
                                class="maker-icon"
                            /><span
                                :class="
                                    isLightMode
                                        ? 'maker-link'
                                        : 'maker-link-dark'
                                "
                                @click="openUrl(1)"
                                >Docs for Market Maker</span
                            >
                        </div>
                        <div class="maker-line">
                            <SvgIconThemed
                                icon="discord"
                                class="maker-icon"
                            /><span
                                :class="
                                    isLightMode
                                        ? 'maker-link'
                                        : 'maker-link-dark'
                                "
                                @click="openUrl(2)"
                                >Get Help in Orbiter Discord</span
                            >
                        </div>
                    </div>

                    <div class="bottom-box">
                        <CommBtn @click="openUrl(99)" class="bottom-btn">
                            Learn More on Testnet
                        </CommBtn>
                    </div>
                </div>
            </div>
        </template>
        <div
            v-show="status !== '1' || showDetail"
            style="width: 100%; height: 100%"
            class="center"
        >
            <Proceed
                v-if="showDetail"
                :detailData="detailData"
                @stateChanged="changeState"
            />
            <template v-else>
                <Confirm v-if="status === '2'" @stateChanged="changeState" />
                <Proceed v-if="status === '3'" @stateChanged="changeState" />
            </template>
        </div>
    </div>
</template>

<script>
import { Transfer, Confirm, Proceed } from './'
import { ToggleBtn, CommBtn, SvgIconThemed } from '../../components'
import {
    isMobile,
    curPageTabState,
    togglePageTab,
    curPageStatus,
    changeCurPageStatus,
    historyPanelState,
} from '../../composition/hooks'

export default {
    name: 'Bridge',
    components: {
        Transfer,
        Confirm,
        Proceed,
        ToggleBtn,
        SvgIconThemed,
        CommBtn,
    },
    computed: {
        isLightMode() {
            return this.$store.state.themeMode === 'light'
        },
        isMobile() {
            return isMobile.value
        },
        isSenderTab() {
            return curPageTabState.value === 'Sender'
        },
        status() {
            return curPageStatus.value
        },
        showDetail() {
            return historyPanelState.isShowHistory
        },
        detailData() {
            // return {
            //   fromChainID: 3,
            //   fromTimeStamp: "06-11 03:49",
            //   fromTxHash: "0x91d15798366f2d48384b1d734862384008142fa547ac9b56300f2a1c4632ba5c",
            //   makerAddress: "0xd7...64fc",
            //   state: 0,
            //   toChainID: 6,
            //   toTimeStamp: "2022-06-11T03:49:08.000Z",
            //   toTxHash: "0x9ba8de5039d794dfeea1a056bf46d0793a8204bb57a6771c0d363ed22eff523a",
            //   tokenName: "USDT",
            //   userAddress: "0x6b...5f66",
            //   userAmount: "4.509006",
            // }
            return historyPanelState.historyInfo
        },
    },
    methods: {
        toggleTab() {
            changeCurPageStatus('1')
            togglePageTab()
        },
        openUrl(type) {
            if (type === 1) {
                window.open(
                    'https://docs.orbiter.finance/makersystem',
                    '_blank'
                )
            } else if (type === 2) {
                window.open('https://discord.com/invite/hJJvXP7C73', '_blank')
            } else if (type === 99) {
                window.open('https://testmaker.orbiter.finance/', '_blank')
            }
        },
        changeState(e) {
            if (e !== '1' && e !== '2' && e !== '3') {
                historyPanelState.isShowHistory = false
            } else {
                if (this.status !== e) {
                    changeCurPageStatus(e)
                }
            }
        },
    },
}
</script>

<style scoped lang="scss">
.app {
    .bridage-page {
        .maker-box {
            width: 480px;
            height: 380px;
            .maker-content {
                .maker-foot-btn {
                    width: 400px;
                }
            }
        }
        .sender-box {
            width: 480px;
            /*height: 540px;*/
            padding: 24px 20px;
        }
    }
}
.app-mobile {
    .bridage-page {
        // height: 100%;
        .maker-box {
            height: 100%;
            width: 100%;
        }
        .sender-box {
            width: 100%;
            height: 100%;
            padding: 24px 20px;
        }
    }
}
.bridage-page {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .sub-tabs {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 24px;
        margin-top: 0px;
        .tab-toggle-btn {
            width: 229px;
            height: 40px;
            border-radius: 40px;
            .tab-btn-item {
                display: inline-block;
                width: 50%;
                text-align: center;
                font-weight: 700;
                font-size: 16px;
                height: 100%;
                line-height: 40px;
                border-radius: 20px;
                cursor: pointer;
            }
            .tab-btn-item.selected {
                background: #df2e2d;
                color: #ffffff;
                box-shadow: inset 0px -6px 0px rgba(0, 0, 0, 0.16);
            }
        }
    }
    .sender-box {
        border-radius: 20px;
    }
    .maker-box {
        position: relative;
        border-radius: 20px;
        padding: 34px 20px;
        text-align: left;

        .new {
            position: absolute;
            right: 10px;
            top: 10px;

            .img {
                width: 70px;
            }
        }
        .maker-title {
            font-weight: 700;
            font-size: 20px;
            line-height: 20px;
        }
        .maker-content {
            font-family: 'Inter Regular';
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            margin-top: 30px;

            .bottom-box {
                width: 100%;
                display: flex;
                justify-content: center;
                margin-top: 30px;

                .bottom-btn {
                    width: 100%;
                    height: 50px;
                    display: inline-block;
                    line-height: 34px;
                    margin-bottom: 20px;
                    background: linear-gradient(
                        90.46deg,
                        #eb382d 4.07%,
                        #bc3035 98.55%
                    );
                    border-radius: 40px;
                }
            }

            .maker-desc {
                margin-bottom: 8px;
                display: flex;
                font-family: 'Inter Regular';

                .point {
                    border-radius: 8px;
                    background-color: #7bc2ba;
                    color: #e9ece2;
                    width: 16px;
                    height: 16px;
                    line-height: 16px;
                    text-align: center;
                    margin-right: 8px;
                    font-size: 13px;
                }
            }

            .maker-line {
                display: flex;
                align-items: center;
                margin-bottom: 8px;

                .maker-icon {
                    margin-right: 8px;
                }
                .maker-link {
                    text-decoration: underline;
                    color: #3d3d3e;
                }
                .maker-link-dark {
                    text-decoration: underline;
                    color: #ffffff;
                }
            }

            .maker-link:hover {
                text-decoration: underline;
                cursor: pointer;
            }
            .maker-foot-btn {
                height: 50px;
                box-shadow: inset 0px -8px 0px rgba(0, 0, 0, 0.16);
                border-radius: 40px;
                font-weight: 700;
                font-size: 20px;
                line-height: 20px;
                color: #fff;
                margin-top: 40px;
                text-align: center;
                line-height: 50px;
                font-family: 'Inter Bold';
            }
        }
    }
}
</style>
