<template>
  <div class="top-nav">
    <template v-if="!isMobile">
      <div class="nav-wrap" style="height: 100%; position: relative">
        <img
          v-if="isStarknet"
          :src="currentStarknetLogo"
          style="
            width: 283px;
            height: 40px;
            margin-top: 16px;
            margin-left: 21px;
          "
        />
        <SvgIconThemed
          v-else
          @click.native="toHome"
          class="logo"
          :style="navIcons.style"
          :icon="!isBRAAVOS && navIcons.logo"
          :iconName="navIcons.logo"
        />
        <HeaderLinks
          v-if="$route.path !== '/prizes'"
          style="margin-top: 24px; margin-left: 66px; min-width: 280px"
        />
      </div>
      <HeaderOps v-if="$route.path !== '/statistics'" />
    </template>
    <template v-else>
      <SvgIconThemed
        @click.native="toHome"
        class="logo"
        :style="navIcons.style"
        :icon="navIcons.logo"
      />
      <!-- <div
      v-if="$route.path !== '/prizes'"
        style="
          flex: 1;
          display: flex;
          justify-content: flex-end;
          margin-right: 12px;
        "
      >
        <div
          @click="openActDialog"
          v-show="!!isLogin"
          class="icon_1"
          :style="`background-color: ${
            isLightMode ? 'rgba(255, 255, 255, 1)' : '#3F415B'
          };`"
        >
          <img
            :hidden="!isLightMode"
            class="label_1"
            referrerpolicy="no-referrer"
            :src="require('../../assets/activity/point.png')"
          />
          <img
            :hidden="isLightMode"
            class="label_1"
            referrerpolicy="no-referrer"
            :src="require('../../assets/activity/point.png')"
          />
        </div>
      </div> -->
      <div
        v-if="isMobile && $route.path !== '/prizes'"
        :class="addPointVisible ? 'shake-top' : ''"
        :style="`z-index:999;width: 200px;display: flex;position: absolute;top: 60px;right:40px;opacity: ${
          addPointVisible ? 1 : 0
        };transition: opacity 0.5s ease-in-out;`"
      >
        <img
          class="label_2"
          referrerpolicy="no-referrer"
          :src="require('../../assets/activity/add_flower.png')"
        />
        <span class="text-group_1">{{ addPoint }} O-Points</span>
        <img
          class="thumbnail_1"
          referrerpolicy="no-referrer"
          :src="require('../../assets/activity/add_flower_2.png')"
        />
      </div>
      <!-- <ToggleBtn v-if="showToggleBtn()" @input="toggleTab" /> -->
      <div class="center">
        <div
          v-if="!isConenct && $route.path !== '/home' && $route.path !== '/statistics'"
          @click="connectWallet"
          class="wallet-status connect-wallet-btn"
        >
          Connect Wallet
        </div>
        <div
          v-else-if="$route.path !== '/home' && $route.path !== '/statistics'"
          @click="connectAWallet"
          class="wallet-status wallet-address"
          :style="`margin-right:${$route.path !== '/prizes' ? '12px' : '0'}`"
        >
          {{ fromGroup.showAddress }}
        </div>
        <div
          v-if="$route.path !== '/prizes'"
          @click="() => (drawerVisible = true)"
          class="center menu-outline"
          style="width: 44px; height: 44px; border-radius: 8px"
        >
          <SvgIconThemed icon="menu" style="width: 26px; height: 22px" />
        </div>
      </div>
      <el-drawer
        :size="280"
        title=""
        :visible.sync="drawerVisible"
        direction="rtl"
        :before-close="() => (drawerVisible = false)"
      >
        <div class="drawer-body">
          <HeaderLinks @closeDrawer="() => (drawerVisible = false)" verical />
          <div class="drawer-bottom">
            <div class="drawer-bottom-wrapper">
              <HeaderOps verical @closeDrawer="() => (drawerVisible = false)" />
            </div>
          </div>
        </div>
      </el-drawer>
    </template>
  </div>
</template>

<script>
import { SvgIconThemed } from '../'
import {
  actAddPoint,
  actAddPointVisible,
  actDialogHover,
  isMobile,
  setPageTab,
  setPageSenderTab,
  showAddress,
  setStarkNetDialog,
  setSelectWalletDialogVisible,
  starkAddress,
  solAddress,
  tonAddress,
  setActDialogVisible,
  setConnectWalletGroupKey,
  setSolanaDialog,
  claimCardModalAmountInfo,
  claimCardModalDataInfo,
  setClaimCardModalShow,
  transferDataState,
  web3State,
  setTonDialog,
  setTronDialog
} from '../../composition/hooks'
import HeaderOps from './HeaderOps.vue'
import HeaderLinks from './HeaderLinks.vue'
import { compatibleGlobalWalletConf, walletIsLogin } from '../../composition/walletsResponsiveData'
import Middle from '../../util/middle/middle'
import starknetLogoDark from '../../assets/v2/starknet-logo-dark.png'
import starknetLogoLight from '../../assets/v2/starknet-logo-light.png'
import { isBrowserApp } from '../../util'
import { walletConnectDispatcherOnInit } from '../../util/walletsDispatchers/pcBrowser/walletConnectPCBrowserDispatcher'
import { WALLETCONNECT } from '../../util/walletsDispatchers'
import getUTCTime from '../../util/time'
import util from '../../util/util'
import { CHAIN_ID } from '../../config';
import tonHelper from '../../util/ton/ton_helper';
import solanaHelper from '../../util/solana/solana_helper';
import orbiterHelper from '../../util/orbiter_helper';


export default {
  name: 'TopNav',
  components: { SvgIconThemed, HeaderLinks, HeaderOps },
  data() {
    return {
      recaptchaId: 0,
      drawerVisible: false,
      fromGroup: null,
      toGroup: null,
    }
  },
  computed: {
    claimCardModalAmountInfoData() {
      return claimCardModalAmountInfo.value
    },
    claimCardModalDataInfoData() {
      return claimCardModalDataInfo.value
    },
    addPoint() {
      return actAddPoint.value
    },
    addPointVisible() {
      return actAddPointVisible.value
    },
    showAddress() {
      if (isBrowserApp()) {
        return starkAddress()
      }
      return showAddress()
    },
    isLightMode() {
      return this.$store.state.themeMode === 'light'
    },
    currentStarknetLogo() {
      return this.isLightMode ? starknetLogoLight : starknetLogoDark
    },
    globalSelectWalletConf() {
      return compatibleGlobalWalletConf.value
    },
    isConenct (){
      return !!this.fromGroup?.isAddress
    },
    isLogin() {
      return walletIsLogin.value
    },
    isSelectedStarkNet() {
      const { toChainID, fromChainID } = transferDataState
      return (
        fromChainID === CHAIN_ID.starknet ||
        fromChainID === CHAIN_ID.starknet_test ||
        toChainID === CHAIN_ID.starknet ||
        toChainID === CHAIN_ID.starknet_test
      )
    },
    isSelectedSolana() {
      const { fromChainID, toChainID } = transferDataState
      return (
        fromChainID === CHAIN_ID.solana ||
        fromChainID === CHAIN_ID.solana_test ||
        toChainID === CHAIN_ID.solana ||
        toChainID === CHAIN_ID.solana_test
      )
    },
    isSelectedTon() {
      const { fromChainID, toChainID } = transferDataState
      return (
        fromChainID === CHAIN_ID.ton ||
        fromChainID === CHAIN_ID.ton_test ||
        toChainID === CHAIN_ID.ton ||
        toChainID === CHAIN_ID.ton_test
      )
    },
    starkAddress() {
      return starkAddress()
    },
    solAddress() {
      return solAddress()
    },
    tAddress() {
      return tonAddress()
    },
    isMobile() {
      return isMobile.value
    },
    web3Address() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress?.toLocaleLowerCase()
    },
    solanaAddress() {
      return web3State.solana.solanaAddress
    },
    tronAddress() {
      return web3State.tr.tronAddress
    },
    starkNetAddress() {
      return web3State.starkNet.starkNetAddress?.toLocaleLowerCase()
    },
    refererUpper() {
      // Don't use [$route.query.referer], because it will delay
      const { href } = window.location
      const match = href.match(/referer=(\w*)/i)
      if (match?.[1]) {
        return match[1].toUpperCase()
      }
      return ''
    },
    isRinkeby() {
      const { href } = window.location
      return /rinkeby\.orbiter/i.test(href)
    },
    isStarknet() {
      return this.refererUpper === 'STARKNET'
    },
    isBRAAVOS() {
      return this.refererUpper === 'BRAAVOS'
    },
    navIcons() {
      const icons = {
        logo: 'logo-mobile',
        logoStyle: { width: '41px', height: '40px' },
        logo_web: 'logo',
        logo_webStyle: { width: '207px', height: '40px' },
      }
      // TODO: when rinkeby logo is add, uncomment blow
      // if (this.isRinkeby) {
      //   icons.logo_web = 'orbiterLogo_web--rinkeby'
      // }
      switch (this.refererUpper) {
        case 'ZKSYNC':
          icons.logo = 'orbiterAsZksyncLogo'
          icons.logoStyle = {
            width: '10.45rem',
            height: '3.7rem',
          }

          icons.logo_web = 'orbiterAsZksyncLogo_web'
          icons.logo_webStyle = {
            width: '17.4rem',
            height: '3.7rem',
          }
          break
        case 'ARGENT':
          // case 'STARKNET':
          // icons.logo_web = 'argent'
          icons.logo_web = 'starknet'
          icons.logo_webStyle = {
            width: '17.4rem',
            height: '3.7rem',
          }
          break
        case 'BRAAVOS':
          icons.logo_web = 'BraavosOrbiter'
          icons.logo_webStyle = {
            width: '17.4rem',
            height: '3.7rem',
          }
          break
      }
      if (this.isMobile) {
        return {
          logo: icons.logo,
          style: icons.logoStyle,
        }
      } else {
        return {
          logo: icons.logo_web,
          style: icons.logo_webStyle,
        }
      }
    },
    fromChainId() {
      const { fromChainID } = transferDataState
      return fromChainID
    },
    toChainId() {
      const { toChainID } = transferDataState
      return toChainID
    },
  },
  created() {
  },
  watch: {
    fromChainId: function (newFromChainId, oldFromChainId) {
      if (newFromChainId && newFromChainId !== oldFromChainId) {
        this.initGetAddressBatch()
      }
    },
    toChainId: function (newToChainId, oldToChainId) {
      if (newToChainId && newToChainId !== oldToChainId) {
        this.initGetAddressBatch()
      }
    },
    solanaAddress: function () {
      this.initGetAddressBatch()
    },
    web3Address: function () {
      this.initGetAddressBatch()
    },
    starkNetAddress: function () {
      this.initGetAddressBatch()
    },
    tronAddress: function() {
      this.initGetAddressBatch()
    }
  },
  methods: {
    openActDialog() {
      if (this.isLogin) {
        setActDialogVisible(true)
      }
    },
    toHome() {
      setPageSenderTab()
      // this.$route.path !== '/home' && this.$router.push({ path: '/home' })
      this.$router.push({ path: '/' })
    },
    toggleTab(tab) {
      setPageTab(tab)
    },
    showToggleBtn() {
      return this.$route.path === '/' || this.$route.path === '/history'
    },
    async initGetAddressBatch() {
      const { fromChainID, toChainID } = transferDataState

      const fromChainId = fromChainID || "1"
      const toChainId = toChainID
      if(!fromChainId && !toChainId) return
      
      const res = await Promise.all([this.getAddress(fromChainId, { isFrom: true }), this.getAddress(toChainId, { isFrom: false }) ])

      const [first, last] = res

      this.fromGroup = first

      if(first && last && first.type !== last.type) {
        this.toGroup = last
      } else {
        this.toGroup = null
      }
    },
    async connectWallet(){
       await this.fromGroup.connect()
    },
    async getAddress(chainID) {
      let addressGroup = {
        isAddress: false,
        address: '',
        icon: '',
        showAddress: '',
      }

      const { fromChainID } = transferDataState

      const chainId = chainID || fromChainID
      if (!chainId) return addressGroup
      const web3Address = this.web3Address
      const starkNetAddress = this.starkNetAddress


      if (chainId === CHAIN_ID.starknet || chainId === CHAIN_ID.starknet_test) {
          addressGroup = {
            isAddress: !!starkNetAddress &&
            !util.getAccountAddressError(starkNetAddress || '', !!starkNetAddress),
            address: starkNetAddress,
            icon: chainId,
            type: "Starknet",
            connect: () => {
              setConnectWalletGroupKey('STARKNET')
              setSelectWalletDialogVisible(true)
            },
            open: () => {
              setStarkNetDialog(true)
              setSolanaDialog(false)
              setTonDialog(false)
              setActDialogVisible(true)
              setTronDialog(false)
            },
          }
      } else if (
        orbiterHelper.isTronChain({chainId})
      ) {
        const trxAddress = web3State.tron.tronAddress
        addressGroup = {
          isAddress: !!trxAddress,
          address: trxAddress,
          icon: web3State.tron.tronWalletIcon,
          type: "Tron",
          connect: () => {
            setConnectWalletGroupKey('TRON')
            setSelectWalletDialogVisible(true)
          },
          open: () => {
            setSolanaDialog(false)
            setStarkNetDialog(false)
            setTonDialog(false)
            setActDialogVisible(true)
            setTronDialog(true)
          },
        }
      } else if (
        chainId === CHAIN_ID.solana || chainId === CHAIN_ID.solana_test
      ) {
        const solanaAddress = web3State.solana.solanaAddress
        addressGroup = {
          isAddress: !!solanaAddress,
          address: solanaAddress,
          icon: solanaHelper.readWalletName() ||chainId,
          type: "Solana",
          connect: () => {
            setConnectWalletGroupKey('SOLANA')
            setSelectWalletDialogVisible(true)
          },
          open: () => {
            setSolanaDialog(true)
            setStarkNetDialog(false)
            setTonDialog(false)
            setActDialogVisible(true)
            setTronDialog(false)
          },
        }
      } else if (
        chainId === CHAIN_ID.ton || chainId === CHAIN_ID.ton_test
      ) {
        const tonAddress = tonHelper.account()
        addressGroup = {
          isAddress: !!tonAddress,
          address: tonAddress,
          icon: chainId,
          type: "Ton",
          connect: async () => {
            await tonHelper.connect()
          },
          open: () => {
            setSolanaDialog(false)
            setStarkNetDialog(false)
            setTonDialog(true)
            setActDialogVisible(true)
            setTronDialog(false)
          },
        }
      } else {
          addressGroup = {
            isAddress: !!web3Address && web3Address !== '0x',
            address: web3Address,
            icon: this.globalSelectWalletConf.walletType
              ? this.globalSelectWalletConf.walletType.toLowerCase()
              : '',
            connect: async () => {
              setConnectWalletGroupKey('EVM')
              setSelectWalletDialogVisible(true)
            },
            type: "EVM",
            open: () => {
              setTonDialog(false)
              setSolanaDialog(false)
              setStarkNetDialog(false)
              setTronDialog(false)
              setActDialogVisible(true)
            },
          }
      }

      const showAddress = util.shortAddress(addressGroup.address)

      addressGroup = {
        ...addressGroup,
        chainId,
        showAddress,
      }
      return addressGroup
    },
    connectAWallet() {
      console.log("11111", this.fromGroup)
      this.fromGroup.open()
    },
  },
}
</script>

<style scoped lang="scss">
.shake-top {
  -webkit-animation: shake-top 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
  animation: shake-top 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
}
@-webkit-keyframes shake-top {
  0%,
  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transform-origin: 50% 0;
    transform-origin: 50% 0;
  }
  10% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
  20%,
  40%,
  60% {
    -webkit-transform: rotate(-4deg);
    transform: rotate(-4deg);
  }
  30%,
  50%,
  70% {
    -webkit-transform: rotate(4deg);
    transform: rotate(4deg);
  }
  80% {
    -webkit-transform: rotate(-2deg);
    transform: rotate(-2deg);
  }
  90% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
}
@keyframes shake-top {
  0%,
  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transform-origin: 50% 0;
    transform-origin: 50% 0;
  }
  10% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
  20%,
  40%,
  60% {
    -webkit-transform: rotate(-4deg);
    transform: rotate(-4deg);
  }
  30%,
  50%,
  70% {
    -webkit-transform: rotate(4deg);
    transform: rotate(4deg);
  }
  80% {
    -webkit-transform: rotate(-2deg);
    transform: rotate(-2deg);
  }
  90% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
}

.top-nav {
  height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo {
    cursor: pointer;
  }

  .lucky-bag-mobile {
    width: 40px;
    height: 40px;
    background-image: url(../../assets/lucky-bag-mobile.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .nav-wrap {
    display: flex;
    align-items: center;
  }
}

.app {
  .top-nav {
    .logo {
      margin-top: 16px;
      margin-left: 21px;
    }
  }
}

.app-mobile {
  .label_2 {
    height: 24px;
    margin-bottom: 5px;
  }

  .text-group_1 {
    overflow-wrap: break-word;
    color: rgba(30, 180, 171, 1);
    font-size: 18px;
    font-family: GeneralSans-Medium;
    text-align: right;
    white-space: nowrap;
    line-height: 24px;
    margin: 0px 10px;
  }

  .thumbnail_1 {
    width: 12px;
    height: 13px;
    margin: 1px 0 10px 0;
  }

  .icon_1 {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 46px;
    width: 46px;
    cursor: pointer;
    border-radius: 23px;
  }

  .label_1 {
    width: 24px;
    height: 24px;
  }

  .top-nav {
    padding: 16px 20px;

    .wallet-status {
      cursor: pointer;
      margin-right: 12px;
    }

    .wallet-address {
      padding: 8px 16px;
      // background: #FFFFFF;
      border-radius: 20px;
      // color: rgba(51, 51, 51, 0.8);
    }

    .connect-wallet-btn {
      width: 148px;
      height: 40px;
      line-height: 40px;
      background: linear-gradient(90.46deg, #eb382d 4.07%, #bc3035 98.55%);
      box-shadow: inset 0px -6px 0px rgba(0, 0, 0, 0.16);
      border-radius: 40px;
      color: #ffffff;
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      text-align: center;
    }

    .drawer-body {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;

      .drawer-bottom {
        width: 100%;
        padding: 0 46px 40px 46px;
        height: 320px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
    }
  }
}

::v-deep .el-drawer__header {
  display: none;
}
</style>
