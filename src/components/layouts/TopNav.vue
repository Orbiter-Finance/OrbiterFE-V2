<template>
  <div class="top-nav">
    <template v-if="!isMobile">
      <div style="height:100%;position:relative;">
        <SvgIconThemed @click.native="toHome" class="logo" :style="navIcons.style" :icon="navIcons.logo" />
        <HeaderLinks style="margin-top: 24px;position:absolute;top:0;left:241px;min-width: 280px;" />
      </div>
      <HeaderOps />
    </template>
    <template v-else>
      <SvgIconThemed @click.native="toHome" class="logo" :style="navIcons.style" :icon="navIcons.logo" />
      <ToggleBtn v-if="$route.path === '/'" @input="toggleTab" />
      <div @click="() => drawerVisible = true" class="center menu-outline" style="width:44px;height:44px;border-radius: 8px;">
        <SvgIconThemed icon="menu" style="width:26px;height:22px;" />
      </div>
      <el-drawer
        :size="280"
        title=""
        :visible.sync="drawerVisible"
        direction="rtl"
        :before-close="() => drawerVisible = false">
        <div class="drawer-body">
          <HeaderLinks @closeDrawer="() => drawerVisible = false" verical />
          <div class="drawer-bottom"><div class="drawer-bottom-wrapper">
            <HeaderOps verical @closeDrawer="() => drawerVisible = false" />
          </div></div>
        </div>
      </el-drawer>
    </template>
  </div>
</template>

<script>
import { CommBtn, SvgIconThemed, ToggleBtn } from '../'
import { isMobile, setPageTab, setPageSenderTab } from '../../composition/hooks'
import HeaderOps from './HeaderOps.vue'
import HeaderLinks from './HeaderLinks.vue'

export default {
  name: 'TopNav',
  components: { CommBtn, SvgIconThemed, ToggleBtn, HeaderLinks, HeaderOps },
  data() {
    return {
      drawerVisible: false,
    }
  },
  computed: {
    isMobile() {
      return isMobile.value
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
    navIcons() {
      const icons = {
        logo: 'logo-mobile',
        logoStyle: { width: '41px', height: '40px' },
        logo_web: 'logo',
        logo_webStyle: { width: '153px', height: '40px' },
      }
      if (this.isRinkeby) {
        icons.logo_web = 'orbiterLogo_web--rinkeby'
      }
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
          // TODO:
      }
      if (this.isMobile) {
        return {
          logo: icons.logo,
          style: icons.logoStyle
        }
      } else {
        return {
          logo: icons.logo_web,
          style: icons.logo_webStyle
        }
      }
    },
  },
  methods: {
    toHome() {
      setPageSenderTab()
      this.$route.path !== '/' && this.$router.push({ path: '/', })
    },
    toggleTab(tab) {
      setPageTab(tab)
    }
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
    background-image: url('../../assets/v2/mobile-header-bg.png');
    background-repeat: no-repeat;
    background-position: right bottom;
    background-origin: content-box;
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
