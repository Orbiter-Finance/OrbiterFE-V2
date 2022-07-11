<template>
  <div id="app" :class="[`${$store.state.themeMode}-theme`, `app${isMobile ? '-mobile' : ''}`]" :style="!isMobile ? {
    'background-image': `url(${isLightMode ? lightbg : darkbg})`
  } : {}">
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
import { getCurrentLoginInfoFromLocalStorage, walletDispatchersOnInit } from "./util/walletsDispatchers"
import { getTraddingHistory, isMobile } from './composition/hooks'
import getZksToken from './util/tokenInfo/supportZksTokenInfo'
import getLpToken from './util/tokenInfo/supportLpTokenInfo'
import History from './views/History.vue'
import * as lightbg from './assets/v2/light-bg.png'
import * as darkbg from './assets/v2/dark-bg.png'
import HeaderDialog from './components/layouts/HeaderDialog.vue'

export default {
  name: 'App',
  computed: {
    isMobile() {
      return isMobile.value
    },
    isLightMode() {
      return this.$store.state.themeMode === 'light'
    },
  },
  data() {
    return {
      lightbg,
      darkbg,
    }
  },
  components: {
    TopNav, BottomNav, History, HeaderDialog
  },
  async mounted() {
    getZkToken.getSupportZKTokenList()

    // init wallet info by the localStorage
    this.performInitCurrentLoginWallet()
  },
  watch: {
    // TODO: should improve
    '$store.getters.realSelectMakerInfo': function (newValue) {
      newValue && getTraddingHistory()
    },
  },
  methods: {
    performInitCurrentLoginWallet() {
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
  overflow-y: scroll;
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  background-position: left bottom;
  background-repeat: no-repeat;
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
</style>
