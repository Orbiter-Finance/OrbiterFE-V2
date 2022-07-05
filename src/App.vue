<template>
  <div id="app" :class="$store.state.themeMode + '-theme app-theme'">
    <div class="app-content">
      <keep-alive>
        <TopNav />
      </keep-alive>
      <div class="main">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" class="router" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" class="router" />
        <div v-if="$store.state.historyPanelVisible" class="global-dialog">
          <History></History>
        </div>
      </div>
      <keep-alive>
        <BottomNav />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import TopNav from './components/layouts/TopNav.vue'
import BottomNav from './components/layouts/BottomNav.vue'
import getZkToken from './util/tokenInfo/supportZkTokenInfo'
import getTransactionList from './core/routes/transactionList'
import { getCurrentLoginInfoFromLocalStorage, walletDispatchersOnInit } from "./util/walletsDispatchers"
import { compatibleGlobalWalletConf } from "./composition/walletsResponsiveData";
import { walletIsLogin } from "./composition/walletsResponsiveData"; 
import getZksToken from './util/tokenInfo/supportZksTokenInfo'
import getLpToken from './util/tokenInfo/supportLpTokenInfo'
import History from './views/History.vue'

export default {
  name: 'App',
  computed: {
    walletAddress: () => {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress
    }
  },
  components: {
    TopNav,
    BottomNav,
    History, 
  },
  async mounted() {
    setInterval(this.getHistory, 60 * 1000)
    this.getHistory()
    getZkToken.getSupportZKTokenList()

    // init wallet info by the localStorage
    this.performInitCurrentLoginWallet();

    // if there is nothing wrong with the test, the following code can be removed
    // if (localStorage.getItem('localLogin') === 'true') {
    //   this.$store.dispatch('registerWeb3').then(() => {
    //     // console.log('==============')
    //     // if (this.$store.state.web3.isInjected) {
    //     //   console.log('isInjected')
    //     // }
    //   })
    // }
  },
  watch: {
    walletIsLogin: function (newValue) {
      if (!newValue) {
        this.$store.commit('updateTransactionList', [])
      } else {
        this.getHistory(true)
      }
    },

    walletAddress: function (newValue, oldValue) {
      if (oldValue && newValue && newValue !== '0x') {
        this.getHistory(true)
      }
    },
    '$store.getters.realSelectMakerInfo': function (newValue) {
      newValue && this.getHistory()
    },
  },
  methods: {
    getHistory(isRefresh = false) {
      if (walletIsLogin.value && this.$store.getters.realSelectMakerInfo) {
        if (isRefresh) this.$store.commit('updateTransactionList', null)
        this.$store.dispatch('getTransactionsHistory', { current: 1, })
      }
    },
    performInitCurrentLoginWallet() {
      getZksToken.getSupportZksTokenList()
      getLpToken.getSupportLpTokenList()
      // When user connects a wallet, the information of this wallet will be added
      // to the localStorage, when user refreshes the page, the localStorage can help
      // us locate last wallet that user connected
      // so localStorage is only used for initialization!!! 
      const cacheWalletInfo  = getCurrentLoginInfoFromLocalStorage();
      if (!cacheWalletInfo) return; // if there is no wallet connected
      const { walletType } = cacheWalletInfo;

      // according to different wallet types to do their own initialization
      // but eventually they all update a global responsive data: globalSelectWalletConf
      // and we'r going to stop accessing localStorage and instead access this global responsive data !!!!
      const matchInitDispatcher = walletDispatchersOnInit[walletType];
      matchInitDispatcher && matchInitDispatcher();
    }
  },
}
</script>

<style lang="scss">
::-webkit-scrollbar {
  width: 3px;
  height: 3px;
  background-color: transparent;
}

::-webkit-scrollbar-track {
  border-radius: 3px;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.3);
}

.s-dialog {
  z-index: 9999 !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--default-black);
  font-size: 2rem;
  /* font-family: "Open Sans", sans-serif; */
  // height: calc(var(--vh, 1vh) * 100);
  // height: auto !important;
  height: 100%;
  overflow-y: scroll;
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  // url('./assets/bgtop.svg'), 
  // 100% 650px, 
  // left top, 
  background-position: left bottom;
  background-repeat: no-repeat;
  .app-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .main {
      flex-grow: 1;
      padding-top: 24px;
    }
  }
}
.light-theme {
  background-image: url('./assets/v2/light-bg.png');
  background-size: 100% 274px;
  background-color: #F5F5F5;
}
.dark-theme {
  background-image: url('./assets/v2/dark-bg.png');
  background-size: 100% 360px;
  background-color: #28293D;
}

// body {
//   background-color: #fff;
// }

* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  /*IE10*/
  user-select: none;
}

input {
  -webkit-user-select: auto;
  user-select: auto;
}

textarea {
  -webkit-user-select: auto;
  user-select: auto;
}

p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}

.noScroll {
  overflow-y: hidden;
}

.scroll {
  overflow-y: scroll;
}

.router {
  // padding-bottom: var(--bottom-nav-height);
  // height: calc(100% - var(--top-nav-height) - var(--bottom-nav-height));
  // height: calc(
  //   var(--vh, 1vh) * 100 - var(--top-nav-height) - var(--bottom-nav-height)
  // );

  width: 100%;
}
.global-dialog {
  position: absolute;
  top: 96px;
  z-index: 1001;
  width: 100%;
  // height: 100%;
  height: 740px;
  overflow: hidden;
}

@media screen and (min-width: 5000px) {
  .router {
    padding: 0;
    height: calc(100% - var(--top-nav-height));
    width: 100%;
  }
}
</style>
