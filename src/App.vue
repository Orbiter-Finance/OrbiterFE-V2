<template>
  <div id="app">
    <TopNav />
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" class="router" id="aliveRouter" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" class="router" id="router" />
    <BottomNav />

    <!-- Load tooltip.png ahead of time -->
    <img style="display: none" src="./assets/tooltip.png" />
  </div>
</template>

<script>
import TopNav from './components/nav/TopNav.vue'
import BottomNav from './components/nav/BottomNav.vue'
import getZkToken from './util/tokenInfo/supportZkTokenInfo'
import getZksToken from './util/tokenInfo/supportZksTokenInfo'
import getLpToken from './util/tokenInfo/supportLpTokenInfo'
import getTransactionList from './core/routes/transactionList'
import { getTransactionsHistory } from './core/routes/transactions'

export default {
  name: 'App',
  computed: {
    isLogin() {
      const web3 = this.$store.state.web3
      return web3.isInstallMeta && web3.isInjected && web3.localLogin
    },
  },
  components: {
    TopNav,
    BottomNav,
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
        if (isRefresh) {
          this.$store.commit('updateTransactionList', null)
        }
        this.$store.dispatch('getTransactionsHistory', {
          current: 1,
        })
      }
    },
  },
}
</script>

<style>
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
  height: 100%;
  height: calc(var(--vh, 1vh) * 100);
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  background-image: url('./assets/bgtop.svg');
  background-size: 100% 40%;
  background-repeat: no-repeat;
}

body {
  background-color: #fff;
}

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
  padding-bottom: var(--bottom-nav-height);
  height: calc(100% - var(--top-nav-height) - var(--bottom-nav-height));
  height: calc(var(--vh, 1vh) * 100 - var(--top-nav-height) - var(--bottom-nav-height));

  width: 100%;
}

@media screen and (min-width: 5000px) {
  .router {
    padding: 0;
    height: calc(100% - var(--top-nav-height));
    width: 100%;
  }
}
</style>
