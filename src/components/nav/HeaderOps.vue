<template>
  <div
    class="header-ops"
    :style="`flex-direction: ${verical ? 'column' : 'row'};`"
  >
    <CommBtn
      ref="connectBtn"
      v-if="!isLogin && !isMobile"
      @click="connectAWallet"
      class="ops-item not-mode"
      style="margin-right: 10px"
      >Connect a Wallet</CommBtn
    >
    <template v-if="isLogin">
      <span @click="showHistory" class="ops-item OrbiterScan">OrbiterScan</span>
      <div
        ref="connectedBtn"
        @click="connectAWallet"
        class="ops-item center"
        style="display: inline-flex"
      >
        <svg-icon
          style="width: 2rem; height: 2rem"
          :iconName="
            getGlobalWalletConf.walletType &&
            getGlobalWalletConf.walletType.toLowerCase()
          "
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
import { mapMutations, mapGetters, mapState } from 'vuex'
import { CommBtn, SvgIconThemed } from '../'

export default {
  name: 'HeaderOps',
  components: { CommBtn, SvgIconThemed },
  props: {
    verical: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['isLogin', 'showAddress','getGlobalWalletConf']),
    ...mapState(['dialog', 'isMobile']),
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
    ...mapMutations(['toggleThemeMode', 'setDialogVisible']),
    connectAWallet() {
      this.setDialogVisible({
        type: 'selectWalletDialogVisible',
        value: true,
      })

      // setStarkNetDialog(false)
      // setSelectWalletDialogVisible(true)
      // this.$emit('closeDrawer')
    },
    showHistory() {
      console.log('showHistory')
    },
  },
}
</script>

<style scoped lang="scss">
.header-ops {
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
    &.OrbiterScan {
      box-shadow: inset 0px -3px 0px rgba(51, 51, 51, 0.16);
    }
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
    margin-top: 19px;
    .ops-item {
      width: 100%;
      margin-bottom: 30px;
    }
  }
}
</style>
