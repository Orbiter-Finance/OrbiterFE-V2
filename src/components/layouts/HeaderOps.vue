<template>
<div class="header-ops" :style="`flex-direction: ${verical ? 'column' : 'row'};`">
  <CommBtn ref="connectBtn" v-if="!isLogin && !isMobile" @click="connectAWallet" class="ops-item not-mode" style="margin-right: 10px">Connect a Wallet</CommBtn>
  <template v-if="isLogin">
    <span @click="showHistory" class="ops-item">History</span>
    <div v-if="isSelectedStarkNet" ref="connectedStarkNetBtn" @click="connectStarkNetWallet" class="ops-item center" style="display: inline-flex;">
      <svg-icon style="width: 2rem; height: 2rem" iconName="sknlogo"></svg-icon>
      <span class="address">{{ starkAddress }}</span>
    </div>
    <div ref="connectedBtn" @click="connectAWallet" class="ops-item center" style="display: inline-flex;">
      <svg-icon style="width: 2rem; height: 2rem"
        :iconName="globalSelectWalletConf.walletType && globalSelectWalletConf.walletType.toLowerCase()"
      ></svg-icon>
      <span class="address">{{ showAddress }}</span>
    </div>
  </template>
  <div @click="toggleThemeMode" class="ops-mode">
    <SvgIconThemed class="mode-icon" icon="mode" />
  </div>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
import { CommBtn, SvgIconThemed, ToggleBtn } from '../'
import { historyPanelState, isMobile } from '../../composition/hooks'
import {
  compatibleGlobalWalletConf,
  walletIsLogin,
} from '../../composition/walletsResponsiveData'
import { setStarkNetDialog, setSelectWalletDialogVisible } from '../../composition/hooks'

import { starkAddress, showAddress } from '../../composition/hooks'

export default {
  name: 'HeaderOps',
  components: { CommBtn, SvgIconThemed, ToggleBtn },
  props: {
    verical: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
    globalSelectWalletConf() {
      return compatibleGlobalWalletConf.value
    },
    isLogin() {
      return walletIsLogin.value
    },
    isSelectedStarkNet() {
      const transferData = this.$store.state.transferData
      return (
        transferData.fromChainID == 4 ||
        transferData.fromChainID == 44 ||
        transferData.toChainID == 4 ||
        transferData.toChainID == 44
      )
    },
    starkAddress() { return starkAddress() },
    showAddress() { return showAddress() }
  },
  data() {
    const selectedWallet = JSON.parse(
      localStorage.getItem('selectedWallet') || '{}'
    )
    return {
      selectedWallet,
    }
  },
  methods: {
    ...mapMutations(['toggleThemeMode']),
    connectStarkNetWallet() {
      setStarkNetDialog(true)
      setSelectWalletDialogVisible(true)
    },
    connectAWallet() {
      setStarkNetDialog(false)
      setSelectWalletDialogVisible(true)
      this.$emit('closeDrawer')
    },
    showHistory() {
      this.$emit('closeDrawer')

      const route = this.$route
      localStorage.setItem('last_page_before_history', JSON.stringify({
        path: route.path,
        params: route.params,
        query: route.query,
      }))
      this.$router.push({
        path: '/history'
      })
    },
  },
}
</script>

<style scoped lang="scss">
.header-ops {
  margin-top: 19px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  .ops-mode {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .mode-icon {
      width: 16px;
      height: 16px;
    }
  }
  .ops-item {
    padding: 8px 18px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    margin-right: 10px;
    cursor: pointer;
    .address {
      margin-left: 4px;
      font-weight: 700;
      font-size: 16px;
      line-height: 24px;
    }
  }
}
.app {
  .header-ops {
    height: 40px;
  }
}
.app-mobile {
  .header-ops {
    .ops-item {
      width: 100%;
      margin-bottom: 30px;
    }
  }
}
</style>
