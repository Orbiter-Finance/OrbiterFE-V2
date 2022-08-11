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
      style="margin-right: 1rem"
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
    ...mapGetters(['isLogin', 'showAddress', 'getGlobalWalletConf']),
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
  margin-right: 1.6rem;
  display: flex;
  align-items: center;
  .ops-mode {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .mode-icon {
      width: 1.6rem;
      height: 1.6rem;
    }
  }
  .ops-item {
    padding: .8rem 1.8rem;
    border-radius: 2rem;
    font-weight: 700;
    font-size: 1.6rem;
    line-height: 2.4rem;
    margin-right: 1rem;
    cursor: pointer;
    &.OrbiterScan {
      box-shadow: inset 0rem -0.3rem 0rem rgba(51, 51, 51, 0.16);
    }
    .address {
      margin-left: .4rem;
      font-weight: 700;
      font-size: 1.6rem;
      line-height: 2.4rem;
    }
  }
}
.app {
  .header-ops {
    height: 4rem;
  }
}
.app-mobile {
  .header-ops {
    margin-top: 1.9rem;
    .ops-item {
      width: 100%;
      margin-bottom: 3rem;
    }
  }
}
</style>
