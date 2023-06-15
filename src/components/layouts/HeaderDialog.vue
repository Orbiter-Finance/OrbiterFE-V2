<template>
    <div
        class="header-dialog-box"
        :style="{ display: this.selectWalletDialogVisible ? 'block' : 'none' }"
    >
        <div
            ref="navDialog"
            :style="
                !isMobile ? { right: isStarkNetDialog ? '160px' : '20px' } : {}
            "
            class="header-dialog-box-wrapper"
        >
            <div class="toolbox-header">
                <span class="toolbox-title">{{
                    isLogin ? 'Connect information' : 'Connect a Wallet'
                }}</span>
                <SvgIconThemed
                    @click.native="closeSelectWalletDialog"
                    class="toolbox-close"
                    iconName="close"
                />
            </div>
            <template v-if="!isLogin">
                <div
                    v-for="item in loginData"
                    :key="item.title"
                    class="wallet-item"
                >
                    <div class="wallet-item-left">
                        <svg-icon
                            class="wallet-icon"
                            :iconName="item.icon"
                        ></svg-icon>
                        <span class="wallet-title">{{ item.title }}</span>
                    </div>
                    <CommBtn class="wallet-btn" @click="connectWallet(item)"
                        >Connect</CommBtn
                    >
                </div>
            </template>
            <template v-else>
                <div
                    v-for="item in loginInfoData"
                    :key="item.title"
                    :class="['wallet-item', 'item-' + item.icon]"
                    style="font-weight: 400; font-size: 14px; line-height: 20px"
                >
                    <div
                        style="
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        "
                    >
                        <SvgIconThemed
                            style="width: 2.4rem; height: 2.4rem"
                            :iconName="item.icon"
                        />
                        <span
                            class="wallet-item-title"
                            style="margin-left: 1rem"
                            >{{ item.title }}</span
                        >
                    </div>
                    <div style="text-align: right; display: flex">
                        <span>{{ item.value }}</span>
                        <div
                            v-if="item.title === 'Address'"
                            v-clipboard:copy="
                                globalSelectWalletConf.walletPayload
                                    .walletAddress
                            "
                            v-clipboard:success="onCopySuccess"
                            v-clipboard:error="onCopyError"
                            style="
                                width: 1.8rem;
                                height: 1.8rem;
                                display: inline-block;
                                margin-left: 6px;
                                cursor: pointer;
                            "
                        >
                            <SvgIconThemed
                                style="width: 100%; height: 100%"
                                iconName="copy"
                            />
                        </div>
                        <div
                            v-if="item.title === 'StarkNetAddress'"
                            v-clipboard:copy="
                                web3State.starkNet.starkNetAddress
                            "
                            v-clipboard:success="onCopySuccess"
                            v-clipboard:error="onCopyError"
                            style="
                                width: 1.8rem;
                                height: 1.8rem;
                                display: inline-block;
                                margin-left: 6px;
                                cursor: pointer;
                            "
                        >
                            <svg-icon
                                style="width: 100%; height: 100%"
                                iconName="copy"
                            ></svg-icon>
                        </div>
                    </div>
                </div>
                <CommBtn
                    v-if="!isStarkNetDialog"
                    :disabled="checkIsMobileEnv()"
                    class="wallet-btn"
                    @click="disconnect"
                    >Disconnect</CommBtn
                >
            </template>
        </div>
    </div>
</template>

<script>
import { CommBtn, SvgIconThemed } from '../'
import {
    isMobile,
    starkAddress,
    showAddress,
    isStarkNetDialog,
    selectWalletDialogVisible,
    setSelectWalletDialogVisible,
    web3State,
} from '../../composition/hooks'
import {
    compatibleGlobalWalletConf,
    walletIsLogin,
} from '../../composition/walletsResponsiveData'
import Middle from '../../util/middle/middle'
import check from '../../util/check/check.js'
import util from '../../util/util'
import { isBraveBrowser } from '../../util/browserUtils'
import walletDispatchers, { BRAVE, METAMASK } from '../../util/walletsDispatchers';
import { onCopySuccess, onCopyError, isMobileDevice } from '../../util'
import { Notification } from 'element-ui'

const { walletDispatchersOnInit, walletDispatchersOnDisconnect } =
    walletDispatchers

export default {
    name: 'HeaderDialog',
    components: { CommBtn, SvgIconThemed },
    computed: {
        web3State() {
            return web3State
        },
        isStarkNetDialog() {
            return isStarkNetDialog.value
        },
        selectWalletDialogVisible() {
            return selectWalletDialogVisible.value
        },
        isMobile() {
            return isMobile.value
        },
        globalSelectWalletConf() {
            return compatibleGlobalWalletConf.value
        },
        isLogin() {
            return walletIsLogin.value
        },
        loginData() {
            const wallets = [
                {
                    isConnect: walletIsLogin.value && check.checkIsMetaMask(),
                    icon: 'metamask',
                    title: 'MetaMask',
                },
                {
                    isConnect: false,
                    icon: 'tallyho',
                    title: 'Taho',
                },
                {
                    isConnect: false,
                    icon: 'blockwallet',
                    title: 'BlockWallet',
                },
                {
                    isConnect: false,
                    icon: 'okxwallet',
                    title: 'OKXWallet',
                },
                {
                    isConnect: false,
                    icon: 'walletConnect',
                    title: 'WalletConnect',
                },
                {
                    isConnect: false,
                    icon: 'coinbase',
                    title: 'Coinbase',
                },
                {
                    isConnect: false,
                    icon: 'brave',
                    title: 'Brave',
                },
            ]
            // the brave wallet is exclusive to the brave browser
            // so if in other browsers, we should hide brave wallet connect option to users
            if (!isBraveBrowser()) {
                return wallets.filter((wallet) => wallet.title !== 'Brave')
            }
            return wallets
        },
        loginInfoData() {
            if (this.isStarkNetDialog) {
                const starkChain = web3State.starkNet?.starkChain
                let networkName = ''
                if (starkChain) {
                    if (starkChain == 4) {
                        networkName = 'Starknet Mainnet'
                    } else if (starkChain == 44) {
                        networkName = 'Goerli Testnet'
                    }
                }

                return [
                    {
                        icon: 'network',
                        title: 'Network',
                        value: networkName,
                    },
                    {
                        icon: 'wallet',
                        title: 'Wallet',
                        value: web3State.starkNet?.starkNetWalletName,
                    },
                    {
                        icon: 'address',
                        title: 'StarkNetAddress',
                        value: starkAddress(),
                    },
                ]
            } else {
                const isOkxwalletApp = window.ethereum?.isOkxWallet && this.checkIsMobileEnv();
                return [
                    {
                        icon: 'network',
                        title: 'Network',
                        value: util.netWorkName(
                            compatibleGlobalWalletConf.value.walletPayload
                                .networkId
                        ),
                    },
                    {
                        icon: 'wallet',
                        title: 'Wallet',
                        value: isOkxwalletApp ? "okxwalletApp" : compatibleGlobalWalletConf.value.walletType,
                    },
                    {
                        icon: 'address',
                        title: 'Address',
                        value: showAddress(),
                    },
                ]
            }
        },
        // styles() {
        //   if (this.isMobile) {
        //     return {
        //       display: this.selectWalletDialogVisible ? 'block' : 'none',
        //     }
        //   } else {
        //     return {
        //       display: this.selectWalletDialogVisible ? 'block' : 'none',
        //     }
        //   }
        // },
    },
    methods: {
        onCopySuccess,
        onCopyError,
        closeSelectWalletDialog() {
            setSelectWalletDialogVisible(false)
        },
        connectWallet(walletConf) {
            this.closeSelectWalletDialog()
            if (walletConf.title === METAMASK && window.ethereum?.isOkxWallet && !this.checkIsMobileEnv()) {
                Notification({
                    title: 'Error: MetaMask has not been installed.',
                    dangerouslyUseHTMLString: true,
                    type: 'warning',
                    customClass: 'installWalletTips',
                    duration: 3000,
                    message:
                        '<div style="font-family:Inter Regular;text-align: left;">If you already have MetaMask installed, check your browser extension settings to make sure you have it enabled and that you have disabled any other browser extension wallets.</div>',
                });
                return;
            }
            walletDispatchersOnInit[walletConf.title]()
        },
        checkIsMobileEnv() {
            return isMobileDevice();
        },
        disconnect() {
            if (this.checkIsMobileEnv()) return
            this.closeSelectWalletDialog()
            this.selectedWallet = {}
            localStorage.setItem('selectedWallet', JSON.stringify({}))
            this.$store.commit('updateLocalLogin', false)
            localStorage.setItem('localLogin', false)
            walletDispatchersOnDisconnect[
                compatibleGlobalWalletConf.value.walletType
            ]()
        },
        handlerDialogOutsideClick(e) {
            if (this.selectWalletDialogVisible) {
                const dialog = this.$refs.navDialog
                const btn1 = this.$refs.connectBtn
                const btn2 = this.$refs.connectedBtn
                const btn3 = this.$refs.connectedStarkNetBtn
                const eceptDoms = Array.from(
                    document.querySelectorAll('.select-wallet-dialog')
                )
                let cur = e.target
                let hasFind = false
                while (cur && !hasFind) {
                    if (
                        cur === dialog ||
                        cur === btn1?.$el ||
                        cur === btn2 ||
                        cur === btn3 ||
                        eceptDoms.some((v) => v === cur)
                    ) {
                        hasFind = true
                    }
                    cur = cur.parentElement
                }
                !hasFind && this.closeSelectWalletDialog()
            }
        },
    },
    mounted() {
        Middle.$on('connectWallet', () => {
            // this.selectWalletDialogVisible = true
            setSelectWalletDialogVisible(true)
        })
        // document.addEventListener('click', this.handlerDialogOutsideClick)
    },
    unmounted() {
        // document.removeEventListener('click', this.handlerDialogOutsideClick)
    },
}
</script>

<style lang="scss" scoped>
.app {
    .header-dialog-box {
        width: 100%;
        .header-dialog-box-wrapper {
            position: absolute;
            top: 75px;
            width: 320px;
        }
    }
}
.app-mobile {
    .header-dialog-box {
        width: 100%;
        height: 100%;
        .header-dialog-box-wrapper {
            position: absolute;
            top: calc(50% - 140px);
            width: calc(100% - 27px * 2);
            left: 27px;
        }
    }
}
.header-dialog-box {
    font-family: 'Inter Regular';
    position: absolute;
    top: 0;
    left: 0;
    .header-dialog-box-wrapper {
        z-index: 10000;
        padding-bottom: 10px;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.12);
        border-radius: 20px;
        .toolbox-header {
            height: 24px;
            margin-top: 18px;
            text-align: center;
            position: relative;
            line-height: 24px;
            margin-bottom: 22px;
            .toolbox-title {
                font-family: 'Inter Bold';
                font-weight: 700;
                font-size: 16px;
                line-height: 24px;
            }
            .toolbox-close {
                width: 1.5rem;
                height: 1.5rem;
                position: absolute;
                top: 4.5px;
                right: 26px;
                opacity: 0.6;
                cursor: pointer;
            }
        }
        .wallet-item {
            height: 36px;
            padding: 0px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            .wallet-item-left {
                display: flex;
                justify-content: center;
                align-items: center;
                .wallet-icon {
                    width: 2.2rem;
                    height: 2.2rem;
                }
                .wallet-title {
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 24px;
                    margin-left: 8px;
                }
            }
            .wallet-btn {
                height: 36px;
                line-height: 20px;
            }
        }
    }
}
</style>
