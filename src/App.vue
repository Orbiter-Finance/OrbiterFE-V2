<template>
  <div id="app">
    <TopNav />
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"
                   class="router"
                   id="aliveRouter" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"
                 class="router"
                 id="router" />
    <BottomNav />
  </div>
</template>

<script>
import TopNav from './components/nav/TopNav.vue'
import BottomNav from './components/nav/BottomNav.vue'
import getZkToken from './util/tokenInfo/supportZkTokenInfo'
import getTransactionList from './core/routes/transactionList'

export default {
  name: 'App',
  computed: {
    isLogin() {
      return this.$store.state.web3.isInstallMeta && this.$store.state.web3.isInjected && this.$store.state.web3.localLogin
    },
  },
  components: {
    TopNav,
    BottomNav
  },
  async mounted() {
    this.getHistory()
    getZkToken.getSupportZKTokenList()
    if (localStorage.getItem('localLogin') === 'true') {
      this.$store.dispatch('registerWeb3').then(() => {
        // console.log('==============')
        // if (this.$store.state.web3.isInjected) {
        //   console.log('isInjected')
        // }
      })
    }

  },
  watch: {
    isLogin: function (newValue) {
      if (!newValue) {
        this.$store.commit('updateTransactionList', [])
      } else {
        var that = this
        if (this.isLogin && this.$store.state.transferData.selectMakerInfo) {
          this.$store.commit('updateTransactionList', null)
          var req = {
            address: this.$store.state.web3.coinbase,
            daysAgo: 14,
            state: 1    //maker/user
          }
          getTransactionList.getTransactionList(req).then((response) => {
            if (response.state === 1) {
              that.$store.commit('updateTransactionList', response.list)
            }
          }).catch((error) => {
            console.log('error =', error)
          })
        }
      }
    },
    '$store.state.web3.coinbase': function (newValue, oldValue) {
      if (oldValue && newValue && newValue !== '0x') {
        var that = this
        if (this.isLogin && this.$store.state.transferData.selectMakerInfo) {
          this.$store.commit('updateTransactionList', null)
          var req = {
            address: newValue,
            daysAgo: 14,
            state: 1    //maker/user
          }
          getTransactionList.getTransactionList(req).then((response) => {
            if (response.state === 1) {
              that.$store.commit('updateTransactionList', response.list)
            }
          }).catch((error) => {
            console.log('error =', error)
          })
        }
      }
    },

  },
  methods: {
    getHistory() {
      var that = this
      if (that.isLogin && that.$store.state.transferData.selectMakerInfo) {
        var req = {
          address: that.$store.state.web3.coinbase,
          daysAgo: 14,
          state: 1    //maker/user
        }
        getTransactionList.getTransactionList(req).then((response) => {
          if (response.state === 1) {
            that.$store.commit('updateTransactionList', response.list)
          }
        }).catch((error) => {
          console.log('error =', error)
        })
      }
      setInterval(() => {
        if (that.isLogin && that.$store.state.transferData.selectMakerInfo) {
          var req = {
            address: that.$store.state.web3.coinbase,
            daysAgo: 14,
            state: 1    //maker/user
          }
          getTransactionList.getTransactionList(req).then((response) => {
            if (response.state === 1) {
              that.$store.commit('updateTransactionList', response.list)
            }
          }).catch((error) => {
            console.log('error =', error)
          })
        }
      }, 60 * 1000);
    }
  }
}
</script>

<style>
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
  background-image: url("./assets/bgtop.svg");
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
  height: calc(
    var(--vh, 1vh) * 100 - var(--top-nav-height) - var(--bottom-nav-height)
  );

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
