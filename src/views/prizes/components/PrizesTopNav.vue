<template>
  <div class="prizes-top-nav" id="prizes-top-nav">
    <div
    @click="toHome"
    >
        <svg-icon
          class="logo"
          :style="navIcons.style"
          :icon="navIcons.logo"
          :iconName="navIcons.logo"
        ></svg-icon>
    </div>
    <div v-if="address" class="wallet">
        <svg-icon class="wallet-icon" :iconName="connectWalletIcon"></svg-icon>
        {{ address }}
    </div>
    <div v-else class="connect-wallet" 
    @click="connetcWallet"
    >Connect Wallet</div>
  </div>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon.vue'
import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'
import { showAddress, isMobile, setConnectWalletGroupKey, setSelectWalletDialogVisible } from '../../../composition/hooks'
import SvgIconThemed from '../../../components/SvgIconThemed.vue'
export default {
  components: { SvgIcon, SvgIconThemed },
  name: 'PrizesTopNav',
  computed: {
    globalSelectWalletConf() {
      return compatibleGlobalWalletConf.value
    },
    address() {
      return showAddress()
    },
    connectWalletIcon() {
      return this.globalSelectWalletConf?.walletType?.toLocaleLowerCase() || ''
    },
    isMobile () {
      return isMobile.value
    },
    navIcons () {
      const icons = {
        logo: 'dark-logo-mobile',
        logoStyle: { width: '41px', height: '40px' },
        logo_web: 'dark-logo',
        logo_webStyle: { width: '207px', height: '40px' },
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
    }
  },
  methods: {
    toHome() {
        this.$router.push("/")
    },
    connetcWallet() {
        setConnectWalletGroupKey("EVM")
        setSelectWalletDialogVisible(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.prizes-top-nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  position: relative;
  top: 0;
  left: 0;
  z-index: 2;

  .logo {
    cursor: pointer;
  }

  .wallet {
    padding: 8px 18px;
    font-weight: 700;
    border-radius: 20px;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #FFF;
    color: rgba(51, 51, 51, 0.8);
    .wallet-icon {
        width: 2rem;
        height: 2rem;
        margin-right: 4px;
    }
  }

  .connect-wallet {
    padding: 8px 18px;
    font-weight: 700;
    border-radius: 20px;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #df2e2d;
    color: #FFF;
    box-shadow: inset 0px -6px 0px rgba(0, 0, 0, 0.16);
    font-family: "Inter Bold";
    cursor: pointer;
  }
}
</style>
