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
          <router-view
            v-if="$route.meta.keepAlive"
            class="router"
            id="aliveRouter"
          />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" class="router" id="router" />
      </div>
      <keep-alive>
        <BottomNav />
      </keep-alive>
    </div>
    <header-dialog />

    <!-- Load tooltip.png ahead of time -->
    <!-- <img style="display: none" src="./assets/tooltip.png" /> -->
  </div>
</template>

<script>
import * as lightbg from './assets/v2/light-bg.png'
import * as darkbg from './assets/v2/dark-bg.png'
import * as topbg from './assets/v2/light-top-bg.jpg'
import TopNav from './components/nav/TopNav.vue'
import BottomNav from './components/nav/BottomNav.vue'
import HeaderDialog from './components/nav/HeaderDialog.vue'
import getTransactionList from './core/routes/transactionList'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState(['isMobile']),
    ...mapGetters(['isLogin']),
    isLightMode() {
      return this.$store.state.themeMode === 'light'
    },
    // eslint-disable-next-line vue/return-in-computed-property
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
    },
  },
  components: {
    TopNav,
    BottomNav,
    HeaderDialog,
  },
  mounted() {
    // console.log(this.$route.meta.keepAlive)
    if (localStorage.getItem('localLogin') === 'true') {
      this.$store.dispatch('registerWeb3').then(() => {})
    }
  },
  watch: {
    isLogin: function (newValue) {
      if (!newValue) {
        this.$store.commit('updateTransactionList', [])
      } else {
        this.getHistory()
      }
    },

    '$store.state.web3.coinbase': function (newValue, oldValue) {
      if (oldValue && newValue && newValue !== '0x') {
        this.getHistory()
      }
    },

    '$store.getters.realSelectMakerInfo': function (newValue) {
      if (newValue) {
        this.getHistory()
      }
    },
  },
  methods: {
    getHistory() {
      if (this.isLogin && this.$store.getters.realSelectMakerInfo) {
        this.$store.commit('updateTransactionList', null)

        var req = {
          address: this.$store.state.web3.coinbase,
          daysAgo: 14,
          state: 1, //maker/user
        }
        getTransactionList
          .getTransactionList(req)
          .then((response) => {
            if (response.state === 1) {
              this.$store.commit('updateTransactionList', response.list)
            }
          })
          .catch((error) => {
            console.log('error =', error)
          })
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
      padding-top: 2.4rem;
    }
  }
  .global-dialog {
    top: 9.4rem;
    height: calc(100% - 9.6rem - 6.6rem - 7.2rem);
  }
}
.app-mobile {
  .app-content {
    .main {
      height: calc(100% - 8.3rem - 9.6rem);
      border-radius: 2rem;
      display: flex;
    }
  }
  .global-dialog {
    top: 7rem;
    height: calc(100% - 9.6rem - 8.4rem);
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
