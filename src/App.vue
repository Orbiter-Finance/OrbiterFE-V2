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
        <TopNav />
      </keep-alive>
      <div class="main">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" class="router" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" class="router" />
      </div>
      <keep-alive>
        <BottomNav />
      </keep-alive>
    </div>
    <HeaderDialog />
  </div>
</template>

<script>
import TopNav from './components/layouts/TopNav.vue'
import BottomNav from './components/layouts/BottomNav.vue'
import getZkToken from './util/tokenInfo/supportZkTokenInfo'
import walletDispatchers, {
  getCurrentLoginInfoFromLocalStorage,
} from './util/walletsDispatchers'
import { isMobile } from './composition/hooks'
import getZksToken from './util/tokenInfo/supportZksTokenInfo'
import getLpToken from './util/tokenInfo/supportLpTokenInfo'
import * as lightbg from './assets/v2/light-bg.png'
import * as darkbg from './assets/v2/dark-bg.png'
import * as topbg from './assets/v2/light-top-bg.jpg'
import HeaderDialog from './components/layouts/HeaderDialog.vue'
import { performInitMobileAppWallet } from './util/walletsDispatchers/utils'

const { walletDispatchersOnInit } = walletDispatchers

export default {
  name: 'App',
  computed: {
    isMobile() {
      return isMobile.value
    },
    isLightMode() {
      return this.$store.state.themeMode === 'light'
    },
    styles() {
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
        'background-image': `url(${lightbg}), url(${topbg})`,
      }
    },
  },
  data() {
    return {
      // lightbg,
      // darkbg,
      // topbg,
    }
  },
  components: {
    TopNav,
    BottomNav,
    HeaderDialog,
  },
  async mounted() {
    getZkToken.getSupportZKTokenList()

    // init wallet info by the localStorage
    this.performInitCurrentLoginWallet()
  },
  methods: {
    performInitCurrentLoginWallet() {
      performInitMobileAppWallet()

      getZksToken.getSupportZksTokenList()
      getLpToken.getSupportLpTokenList()
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
</style>
