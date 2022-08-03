<template>
  <div class="top-nav">
    <template v-if="!isMobile">
      <div style="height: 100%; position: relative">
        <img
          v-if="false"
          src="../../assets/v2/starknet-logo.png"
          style="width: 190px; height: 80px"
        />
        <SvgIconThemed
          v-else
          @click.native="toHome"
          class="logo"
          :style="navIcons.style"
          :icon="navIcons.logo"
        />
        <HeaderLinks
          style="
            margin-top: 24px;
            position: absolute;
            top: 0;
            left: 241px;
            min-width: 290px;
          "
        />
      </div>
      <HeaderOps />
    </template>
    <template v-else>
      <SvgIconThemed
        @click.native="toHome"
        class="logo"
        :style="navIcons.style"
        :icon="navIcons.logo"
      />
      <div class="center">
        <div
          v-if="!isLogin"
          @click="connectWallet"
          class="wallet-status connect-wallet-btn"
        >
          Connect Wallet
        </div>
        <div
          v-else
          @click="connectAWallet"
          class="wallet-status wallet-address"
        >
          {{ showAddress }}
        </div>
        <div
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
import HeaderOps from './HeaderOps.vue'
import HeaderLinks from './HeaderLinks.vue'
import Middle from '../../util/middle/middle'
import { mapGetters, mapState, mapMutations } from 'vuex'

export default {
  name: 'TopNav',
  components: { SvgIconThemed, HeaderLinks, HeaderOps },
  data() {
    return {
      drawerVisible: false,
    }
  },
  computed: {
    ...mapState(['isMobile']),
    ...mapGetters(['isLogin', 'showAddress']),
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
    navIcons() {
      const icons = {
        logo: 'logo-mobile',
        logoStyle: { width: '41px', height: '40px' },
        logo_web: 'logo',
        logo_webStyle: { width: '153px', height: '40px' },
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
          icons.logo_web = 'argent'
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
  },
  methods: {
    ...mapMutations(['setDialogVisible', 'togglePageTab']),
    toHome() {
      this.togglePageTab({ type: 'TabState', value: 'Sender' })
      this.$route.path !== '/' && this.$router.push({ path: '/' })
    },
    showToggleBtn() {
      return this.$route.path === '/' || this.$route.path === '/history'
    },
    connectWallet() {
      Middle.$emit('connectWallet', true)
    },
    connectAWallet() {
      // setStarkNetDialog(false)
      this.setDialogVisible({ type: 'selectWalletDialogVisible', value: true })
    },
  },
}
</script>

<style scoped lang="scss">
.top-nav {
  height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo {
    cursor: pointer;
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
  .top-nav {
    padding: 16px 20px;
    .wallet-status {
      cursor: pointer;
      margin-right: 15px;
    }
    .wallet-address {
      padding: 8px 24px;
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
