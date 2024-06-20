<template>
  <div
    id="app"
    :class="[
      'ob-scrollbar',
      `${$store.state.themeMode}-theme`,
      `app${isMobile ? '-mobile' : ''}`,
    ]"
    :style="styles"
  >
    <div class="app-content">
      <keep-alive>
        <TopNav v-if="isTopNav" />
      </keep-alive>
      <div
        class="main"
        :style="`padding-top: ${!isTopNav ? '0px' : '24px'}`"
      >
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" class="router" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" class="router" />
      </div>
      <keep-alive>
        <BottomNav
          v-if="isBottomNav"
        />
      </keep-alive>
    </div>
    <!-- <HeaderDialog /> -->
    <HeaderActDialog
      v-if="
        isHeaderActDialog
      "
      style="z-index: 999"
    />
    <HeaderWalletGroup />
    <!-- HeaderActDialog  HeaderLotteryCard dialog -->
    <HeaderLotteryCardDialog v-if="isTopNav" />
    <ClaimRewardModal v-if="isTopNav"></ClaimRewardModal>
    <div id="ton-connect-wallet"></div>
    <GlobalTgCard v-if="isTopNav"></GlobalTgCard>
    <UserInfoDetailsCardModal v-if="isTopNav"></UserInfoDetailsCardModal>
    <OPointsRankingCard v-if="isTopNav"></OPointsRankingCard>
  </div>
</template>

<script>
import 'solana-wallets-vue-2/styles.css'
import TopNav from './components/layouts/TopNav.vue'
import BottomNav from './components/layouts/BottomNav.vue'
import GlobalTgCard from './components/GlobalTgCard.vue'
import getZkToken from './util/tokenInfo/supportZkTokenInfo'
import walletDispatchers, {
  BRAVE_APP,
  getCurrentLoginInfoFromLocalStorage,
  LOOPRING_APP,
  METAMASK,
  ZERION_APP,
} from './util/walletsDispatchers'
import { requestPointSystem } from './common/openApiAx'

import {
  actDialogVisible,
  isMobile,
  setActDialogVisible,
  setStarkNetDialog,
  setSolanaDialog,
  web3State,
  isStarkNetDialog,
  isSolanaDialog,
  setActAddPoint,
  setActAddPointVisible,
  setActPoint,
  setActNftList,
  updateActDataList,
  setSelectWalletDialogVisible,
  setConnectWalletGroupKey,
  isTonDialog,
  setTonDialog,
  setClaimCardModalShow,
  setActPointFetchStatus
} from './composition/hooks'
import {
  walletIsLogin,
  compatibleGlobalWalletConf,
} from './composition/walletsResponsiveData'
import getZksToken from './util/tokenInfo/supportZksTokenInfo'
import getLpToken from './util/tokenInfo/supportLpTokenInfo'
import * as lightbg from './assets/v2/light-bg.png'
import * as darkbg from './assets/v2/dark-bg.png'
import * as topbg from './assets/v2/light-top-bg.jpg'
import HeaderDialog from './components/layouts/HeaderDialog.vue'
import HeaderActDialog from './components/layouts/HeaderActDialog.vue'
import HeaderLotteryCardDialog from './components/layouts/HeaderLotteryCardDialog.vue'
import HeaderWalletGroup from './components/layouts/HeaderWalletGroup.vue'
import UserInfoDetailsCardModal from './components/layouts/UserInfoDetailsCardModal.vue'
import ClaimRewardModal from './components/layouts/ClaimRewardModal.vue'
import OPointsRankingCard from './components/layouts/OPointsRankingCard.vue'

import {
  setIsBraveWallet,
  performInitMobileAppWallet,
  isBraveWallet,
} from './util/walletsDispatchers/utils'
import { isMobileDevice, isBrowserApp } from './util'
import util from './util/util'
import { isBraveBrowser } from './util/browserUtils'
import { getWeb3 } from './util/constants/web3/getWeb3'
import { connectStarkNetWallet } from './util/constants/starknet/helper'
import solanaHelper from './util/solana/solana_helper'
import tonHelper from './util/ton/ton_helper'
import {
  requestClaimLuckyBagReward,
  requestClaimLuckyBagRewardData,
} from './common/openApiAx'
import { ethers } from 'ethers'

const { walletDispatchersOnInit } = walletDispatchers

let timerOptions = 0
let timerActivityList = 0
let timeNft = 0
let timeRank = 0

export default {
  name: 'App',
  computed: {
    routerPath() {
      return this.$route.path
    },
    isNotPrizes() {
      return this.routerPath !== '/prizes'
    },
    isTopNav() {
      return this.isInit && this.isNotPrizes
    },
    isBottomNav() {
      return this.isTopNav && this.routerPath !== '/home'
    },
    isHeaderActDialog(){
      return this.isBottomNav && this.routerPath !== '/statistics'
    },
    isMobile() {
      return isMobile.value
    },
    isLogin() {
      return (
        web3State.isInstallMeta && web3State.isInjected && web3State.localLogin
      )
    },
    isLightMode() {
      return this.$store.state.themeMode === 'light'
    },
    currentWalletAddress() {
      const solanaAddress =
        web3State.solana.solanaAddress || solanaHelper.solanaAddress()
      const tonAddress = web3State.ton.tonAddress || tonHelper?.account()
      return [
        compatibleGlobalWalletConf.value.walletPayload.walletAddress,
        web3State.starkNet.starkNetAddress,
        solanaAddress,
        tonAddress,
        ...[],
      ]
    },
    selectWalletDialogVisible() {
      return actDialogVisible.value
    },
    styles() {
      if (this.$route.path === '/prizes') {
        return {
          background: 'rgb(0, 0, 0)',
        }
      }
      if (!this.isMobile) {
        if (this.isLightMode) {
          return {
            'background-position': 'left bottom, left top',
            'background-repeat': 'no-repeat',
            // 'background-size': '100% 36%, 127% 100%',
            'background-size': '100% 36%, 100% 100%',
            'background-image': `url(${lightbg}), url(${topbg})`,
          }
        } else {
          return {
            'background-position': 'left bottom',
            'background-repeat': 'no-repeat',
            'background-size': '100% 50%',
            'background-image': `url(${darkbg})`,
          }
        }
      } else {
        if (this.isLightMode) {
          return {
            'background-position': 'left top',
            'background-repeat': 'no-repeat',
            'background-size': '100%',
            'background-image': `url(${topbg})`,
          }
        }
      }
      return {
        'background-position': 'left bottom, left top',
        'background-repeat': 'no-repeat',
        // 'background-size': '100% 36%, 127% 100%',
        'background-size': '100% 36%, 100% 100%',
        'background-color':
          'linear-gradient(180deg, #373951 0%, #28293D 100%);',
      }
    },
  },
  data() {
    return {
      // lightbg,
      // darkbg,
      // topbg,
      isInit: false
    }
  },
  components: {
    TopNav,
    BottomNav,
    HeaderDialog,
    HeaderActDialog,
    HeaderLotteryCardDialog,
    HeaderWalletGroup,
    GlobalTgCard,
    UserInfoDetailsCardModal,
    ClaimRewardModal,
    OPointsRankingCard
  },
  updated() {
    if(!this.isInit) {
      this.isInit = true
    }
  },
  async mounted() {
    tonHelper.tonConnectCall()
    if (isBrowserApp()) {
      // await connectStarkNetWallet()

      setSelectWalletDialogVisible(true)
      setConnectWalletGroupKey('STARKNET')
    }

    if (isBraveBrowser()) {
      setIsBraveWallet(
        await window.ethereum
          .request({
            method: 'web3_clientVersion',
          })
          .then((clientVersion) => {
            return clientVersion.split('/')[0] === 'BraveWallet'
          })
      )
    }
    getZkToken.getSupportZKTokenList()

    // init wallet info by the localStorage
    this.performInitCurrentLoginWallet()
  },
  watch: {
    isLogin: function (item1, item2) {
      if (item1 !== item2) {
        if (!!item1) {
          if(this.isNotPrizes) {
            setActDialogVisible(true)
          }
        } else {
          setActDialogVisible(false)
        }
      } else {
        setActDialogVisible(!!item1)
      }
    },
    selectWalletDialogVisible: function (newVisible) {
      if (!!newVisible) {
        if(this.isHeaderActDialog) {
          this.getWalletAddressActList()
          this.getWalletAddressPoint()
          this.getNftList()
        }
      }
    },
    currentWalletAddress: function (newAddress, oldAddress) {
      const [web3Address, starkNetAddress] = newAddress
      const [web3OldAddress] = oldAddress || []
      const solanaAddress = solanaHelper.solanaAddress()
      const tonAddress = tonHelper.account()
      if (web3Address && web3Address !== web3OldAddress) {
        setClaimCardModalShow(false, '')
        if(this.isTopNav) {
          this.getClaimRewardModalData()
        }
      }
      if (tonAddress) {
        setTonDialog(true)
        setActDialogVisible(true)
      } else if (solanaAddress) {
        setSolanaDialog(true)
        setActDialogVisible(true)
      } else if (starkNetAddress) {
        setStarkNetDialog(true)
        setActDialogVisible(true)
      }

      if (!!web3Address || !!starkNetAddress) {
        if(this.isTopNav) {
          this.getWalletAddressActList()
          this.getWalletAddressPoint()
          this.getNftList()
        }
      }
    },
  },
  methods: {
    async getClaimRewardModalData() {
      const [web3Address] = this.currentWalletAddress
      if (!web3Address) return
      this.$store.commit("requestLuckyBagDataInfo", {address: web3Address})
    },
    getAddress() {
      let addressGroup = {
        isAddress: false,
        address: '',
      }
      const [web3Address, starkNetAddress] = this.currentWalletAddress
      const solanaAddress = solanaHelper.solanaAddress()
      const tonAddress = tonHelper.account()
      const address =
        !!isTonDialog.value && tonAddress
          ? tonAddress
          : !!isSolanaDialog.value && solanaAddress
          ? solanaAddress
          : !!isStarkNetDialog.value
          ? starkNetAddress
          : web3Address
      const isStarknet = !!isStarkNetDialog.value
      if (
        !address ||
        (!isSolanaDialog.value &&
          util.getAccountAddressError(address || '', isStarknet))
      ) {
        return addressGroup
      }
      return {
        ...addressGroup,
        isAddress: true,
        address,
      }
    },
    async getNftList() {
      const { isAddress, address } = this.getAddress()

      const timerN = +new Date()

      if (Number(timerN - timeNft) < 1000) {
        return
      }
      timeNft = timerN

      if (isAddress) {
        const res = await requestPointSystem('user/nfts', {
          address,
        })
        setActNftList(
          res?.data?.nfts.map((item) => {
            return { img: `${item}.png` }
          })
        )
      }
    },
    async getWalletAddressActList() {
      const { isAddress, address } = this.getAddress()

      const timerN = +new Date()

      if (Number(timerN - timerActivityList) < 1000) {
        return
      }
      timerActivityList = timerN

      if (isAddress) {
        const res = await requestPointSystem('v2/activity/list', {
          address,
          pageSize: 10,
          page: 1,
        })
        const list = res.data.list
        // const undoneList = []
        // const doneList = []
        // console.log("list", list)
        // for (const data of list) {
        //   for (const task of data.taskList) {
        //     if (task.status) {
        //       doneList.push(task)
        //     } else {
        //       undoneList.push(task)
        //     }
        //   }
        // }
        // updateActDataList([...dataList, ...undoneList, ...doneList])
        updateActDataList(list)
      }
    },
    async getWalletAddressPoint() {
      const { isAddress, address } = this.getAddress()

      const timerN = +new Date()

      if (Number(timerN - timerOptions) < 1000) {
        return
      }

      timerOptions = timerN

      if (isAddress) {
        setActPointFetchStatus()
        const pointRes = await requestPointSystem('v2/user/points', {
          address,
        })
        const point = pointRes.data.total || ''
        setActPoint(pointRes.data)
        if (point) {
          setActAddPoint(String(point))
          setActAddPointVisible(true)
          setTimeout(() => {
            setActAddPointVisible(false)
          }, 3000)
        }
      }
    },
    performInitCurrentLoginWallet() {
      performInitMobileAppWallet()

      // TAG:close zkspace
      // getZksToken.getSupportZksTokenList()
      getLpToken.getSupportLpTokenList()

      const isOkxwalletApp = window.ethereum?.isOkxWallet && isMobileDevice()
      if (isOkxwalletApp) {
        const matchInitDispatcher = walletDispatchersOnInit[METAMASK]
        matchInitDispatcher && matchInitDispatcher()
        return
      }
      const isBraveWalletApp = isBraveWallet && isMobileDevice()
      if (isBraveWalletApp) {
        const matchInitDispatcher = walletDispatchersOnInit[BRAVE_APP]
        matchInitDispatcher && matchInitDispatcher()
        return
      }
      const isLoopringWalletApp =
        window.ethereum?.isLoopring && isMobileDevice()
      if (isLoopringWalletApp) {
        const matchInitDispatcher = walletDispatchersOnInit[LOOPRING_APP]
        matchInitDispatcher && matchInitDispatcher()
        return
      }
      const isZerionWalletApp = window.ethereum?.isZerion && isMobileDevice()
      if (isZerionWalletApp) {
        const matchInitDispatcher = walletDispatchersOnInit[ZERION_APP]
        matchInitDispatcher && matchInitDispatcher()
        return
      }

      // When user connects a wallet, the information of this wallet will be added
      // to the localStorage, when user refreshes the page, the localStorage can help
      // us locate last wallet that user connected
      // so localStorage is only used for initialization!!!
      const cacheWalletInfo = getCurrentLoginInfoFromLocalStorage()
      if (!cacheWalletInfo) return // if there is no wallet connected
      const { walletType } = cacheWalletInfo

      // according to different wallet types to do their own initialization
      // but eventually they all update a global responsive data: globalSelectWalletConf
      // and we'r going to stop accessing localStorage and instead access this global responsive data !!!!
      const matchInitDispatcher = walletDispatchersOnInit[walletType]
      matchInitDispatcher && matchInitDispatcher()
      if (!web3State.coinbase) {
        getWeb3(walletType || METAMASK)
      }
    },
  },
}
</script>

<style lang="scss">
// fix 在ios设备中，el-select组件下拉框，点击次才能选中问题。
.el-scrollbar .el-scrollbar__bar {
  opacity: 1 !important;
}
.app {
  .app-content {
    .main {
      width: 100%;
      height: 100%;
      padding-top: 24px;
    }
  }
  .global-dialog {
    top: 94px;
    height: calc(100% - 96px - 66px - 72px);
  }
}
.app-mobile {
  .app-content {
    .main {
      height: calc(100% - 83px - 96px);
      border-radius: 20px;
      display: flex;
    }
  }
  .global-dialog {
    top: 70px;
    height: calc(100% - 96px - 84px);
  }
}
#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--default-black);
  font-size: 2rem;
  height: 100%;
  // width: 100%;
  overflow-y: scroll;
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  .app-content {
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    .main {
      flex-grow: 1;
    }
  }
}
.installWalletTips {
  width: 360px;
  .el-notification__title {
    word-break: break-word;
  }
}
.watermark {
  background-image: url('./assets/watermark.png') !important;
  /*background: rebeccapurple !important;*/
  /*background-size:100% 100%;*/
  z-index: 999;

  /*.el-table {*/
  /*  display: block;*/
  /*  width: 500px;*/
  /*  height: 385px;*/
  /*  padding-top: 300px;*/
  /*  !*background: rebeccapurple !important;*!*/
  /*  !*background:url('./assets/watermark.png') no-repeat;*!*/
  /*  color: #909399;*/
  /*  box-sizing: border-box;*/
  /*  z-index: 999;*/
  /*}*/
}

#ton-connect-wallet {
  width: 0;
  height: 0;
  overflow: hidden;
}
#recaptcha-outside-badge {
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  z-index: 99999;

  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  display: flex;
  align-items: center;
}
</style>
