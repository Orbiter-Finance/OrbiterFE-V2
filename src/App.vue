<template>
  <div id="app" :class="$store.state.themeMode + '-theme app-theme'" :style="{
    'background-image': `url(${isLightMode ? lightbg : darkbg})`
  }">
      <!-- background-image: url('./assets/v2/dark-bg.png'); -->
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
import getZksToken from './util/tokenInfo/supportZksTokenInfo'
import getLpToken from './util/tokenInfo/supportLpTokenInfo'
import History from './views/History.vue'
import * as lightbg from './assets/v2/light-bg.png'
import * as darkbg from './assets/v2/dark-bg.png'

export default {
  name: 'App',
  computed: {
    isLogin() {
      const web3 = this.$store.state.web3
      return web3.isInstallMeta && web3.isInjected && web3.localLogin
    },
    isLightMode() {
      return this.$store.state.themeMode === 'light'
    }
  },
  data() {
    return {
      lightbg, darkbg
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
    getZksToken.getSupportZksTokenList()
    getLpToken.getSupportLpTokenList()
    localStorage.getItem('localLogin') === 'true' && this.$store.dispatch('registerWeb3')
  },
  watch: {
    isLogin: function (newValue) {
      !newValue ? this.$store.commit('updateTransactionList', []) : this.getHistory(true)
    },
    '$store.state.web3.coinbase': function (newValue, oldValue) {
      oldValue && newValue && newValue !== '0x' && this.getHistory(true)
    },
    '$store.getters.realSelectMakerInfo': function (newValue) {
      newValue && this.getHistory()
    },
  },
  methods: {
    getHistory(isRefresh = false) {
      if (this.isLogin && this.$store.getters.realSelectMakerInfo) {
        if (isRefresh) this.$store.commit('updateTransactionList', null)
        this.$store.dispatch('getTransactionsHistory', { current: 1, })
      }
    },
  },
}
</script>

<style lang="scss">
// ::-webkit-scrollbar {
//   width: 3px;
//   height: 3px;
//   background-color: transparent;
// }

// ::-webkit-scrollbar-track {
//   border-radius: 3px;
//   background-color: transparent;
// }

// ::-webkit-scrollbar-thumb {
//   border-radius: 3px;
//   background-color: rgba(0, 0, 0, 0.3);
// }

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
  // background-image: url('./assets/v2/light-bg.png');
  background-size: 100% 274px;
  background-color: #F5F5F5;
}
.dark-theme {
  // background-image: url('./assets/v2/dark-bg.png');
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
