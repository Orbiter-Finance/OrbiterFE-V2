<template>
  <div
    class="header-dialog-box"
    :style="{
      display: this.dialog.selectWalletDialogVisible ? 'block' : 'none',
    }"
  >
    <div
      ref="navDialog"
      :style="
        !isMobile ? { right: dialog.isStarkNetDialog ? '16rem' : '2rem' } : {}
      "
      class="header-dialog-box-wrapper"
    >
      <div class="toolbox-header">
        <span class="toolbox-title">{{
          isLogin ? 'Connect information' : 'Connect a Wallet'
        }}</span>
        <SvgIconThemed
          @click.native="closeSelectWalletDialog"
          class="toolbox-close"
          iconName="close"
        />
      </div>
      <template v-if="!isLogin">
        <div v-for="item in loginData" :key="item.title" class="wallet-item">
          <div class="wallet-item-left">
            <svg-icon class="wallet-icon" :iconName="item.icon"></svg-icon>
            <span class="wallet-title">{{ item.title }}</span>
          </div>
          <CommBtn class="wallet-btn" @click="connectWallet(item)"
            >Connect</CommBtn
          >
        </div>
      </template>
      <template v-else>
        <div
          v-for="item in loginInfoData"
          :key="item.title"
          :class="['wallet-item', 'item-' + item.icon]"
          style="font-weight: 400; font-size: 1.4rem; line-height: 2rem"
        >
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <SvgIconThemed
              style="width: 2.4rem; height: 2.4rem"
              :iconName="item.icon"
            />
            <span class="wallet-item-title" style="margin-left: 1rem">{{
              item.title
            }}</span>
          </div>
          <div style="text-align: right; display: flex">
            <span>{{ item.value }}</span>
            <div
              v-if="item.title === 'Address'"
              v-clipboard:copy="getGlobalWalletConf.walletPayload.walletAddress"
              v-clipboard:success="onCopySuccess"
              v-clipboard:error="onCopyError"
              style="
                width: 1.8rem;
                height: 1.8rem;
                display: inline-block;
                margin-left: 0.6rem;
                cursor: pointer;
              "
            >
              <SvgIconThemed
                style="width: 100%; height: 100%"
                iconName="copy"
              />
            </div>
            <div
              v-if="item.title === 'StarkNetAddress'"
              v-clipboard:copy="web3.starkNet.starkNetAddress"
              v-clipboard:success="onCopySuccess"
              v-clipboard:error="onCopyError"
              style="
                width: 1.8rem;
                height: 1.8rem;
                display: inline-block;
                margin-left: 0.6rem;
                cursor: pointer;
              "
            >
              <svg-icon
                style="width: 100%; height: 100%"
                iconName="copy"
              ></svg-icon>
            </div>
          </div>
        </div>
        <CommBtn
          v-if="!dialog.isStarkNetDialog"
          :disabled="checkIsMobileEnv()"
          class="wallet-btn"
          @click="disconnect"
          >Disconnect</CommBtn
        >
      </template>
    </div>
  </div>
</template>

<script>
import { CommBtn, SvgIconThemed } from '../'
import Middle from '../../util/middle/middle'
import check from '../../util/check/check.js'
import util from '../../util/util'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'HeaderDialog',
  components: { CommBtn, SvgIconThemed },
  computed: {
    ...mapGetters([
      'isLogin',
      'showAddress',
      'starkAddress',
      'getGlobalWalletConf',
    ]),
    ...mapState(['dialog', 'isMobile', 'web3']),
    loginData() {
      const wallets = [
        {
          isConnect: this.isLogin && check.checkIsMetaMask(),
          icon: 'metamask',
          title: 'MetaMask',
        },
        {
          isConnect: false,
          icon: 'walletConnect',
          title: 'WalletConnect',
        },
        {
          isConnect: false,
          icon: 'coinbase',
          title: 'Coinbase',
        },
        {
          isConnect: false,
          icon: 'brave',
          title: 'Brave',
        },
      ]
      // the brave wallet is exclusive to the brave browser
      // so if in other browsers, we should hide brave wallet connect option to users
      // if (!isBraveBrowser())
      //   return wallets.filter((wallet) => wallet.title !== 'Brave')
      return wallets
    },
    loginInfoData() {
      if (this.dialog.isStarkNetDialog) {
        const starkChain = this.web3.starkNet?.starkChain
        let networkName = ''
        if (starkChain) {
          if (starkChain == 4) {
            networkName = 'StarkNet Mainnet'
          } else if (starkChain == 44) {
            networkName = 'Goerli Testnet'
          }
        }

        return [
          {
            icon: 'network',
            title: 'Network',
            value: networkName,
          },
          {
            icon: 'wallet',
            title: 'Wallet',
            value: this.web3.starkNet?.starkNetWalletName,
          },
          {
            icon: 'address',
            title: 'StarkNetAddress',
            value: this.starkAddress,
          },
        ]
      } else {
        return [
          {
            icon: 'network',
            title: 'Network',
            value: util.chainName(
              '0',
              this.getGlobalWalletConf.walletPayload.networkId
            ),
          },
          {
            icon: 'wallet',
            title: 'Wallet',
            value: this.getGlobalWalletConf.walletType,
          },
          {
            icon: 'address',
            title: 'Address',
            value: this.showAddress,
          },
        ]
      }
    },
  },
  methods: {
    ...mapMutations([
      'updateLocalLogin',
      'toggleThemeMode',
      'setDialogVisible',
    ]),
    ...mapActions(['registerWeb3']),
    onCopySuccess() {
      util.onCopySuccess()
    },
    onCopyError() {
      util.onCopyError()
    },
    closeSelectWalletDialog() {
      this.setDialogVisible({ type: 'selectWalletDialogVisible', value: false })
    },
    connectWallet(walletConf) {
      this.closeSelectWalletDialog()
      if (walletConf.title === 'MetaMask') {
        this.registerWeb3()
      }
      // walletDispatchersOnInit[walletConf.title]()
    },
    checkIsMobileEnv() {
      // return isMobileEnv()
      return false
    },
    disconnect() {
      // if (isMobileEnv()) return
      this.closeSelectWalletDialog()
      this.selectedWallet = {}
      this.updateLocalLogin(false)
      localStorage.setItem('selectedWallet', JSON.stringify({}))

      localStorage.setItem('localLogin', false)
    },
    handlerDialogOutsideClick(e) {
      if (this.dialog.selectWalletDialogVisible) {
        const dialog = this.$refs.navDialog
        const btn1 = this.$refs.connectBtn
        const btn2 = this.$refs.connectedBtn
        const btn3 = this.$refs.connectedStarkNetBtn
        const eceptDoms = Array.from(
          document.querySelectorAll('.select-wallet-dialog')
        )
        let cur = e.target
        let hasFind = false
        while (cur && !hasFind) {
          if (
            cur === dialog ||
            cur === btn1?.$el ||
            cur === btn2 ||
            cur === btn3 ||
            eceptDoms.some((v) => v === cur)
          ) {
            hasFind = true
          }
          cur = cur.parentElement
        }
        !hasFind && this.closeSelectWalletDialog()
      }
    },
  },
  mounted() {
    Middle.$on('connectWallet', () => {
      // this.selectWalletDialogVisible = true
      this.setDialogVisible({ type: 'selectWalletDialogVisible', value: false })
    })
    // document.addEventListener('click', this.handlerDialogOutsideClick)
  },
  unmounted() {
    // documentNaNpxoveEventListener('click', this.handlerDialogOutsideClick)
  },
}
</script>

<style lang="scss" scoped>
.app {
  .header-dialog-box {
    width: 100%;
    .header-dialog-box-wrapper {
      position: absolute;
      top: 7.5rem;
      width: 32rem;
    }
  }
}
.app-mobile {
  .header-dialog-box {
    width: 100%;
    height: 100%;
    .header-dialog-box-wrapper {
      position: absolute;
      top: calc(50% - 14rem);
      width: calc(100% - 2.7rem * 2);
      left: 2.7rem;
    }
  }
}
.header-dialog-box {
  font-family: 'Inter Regular';
  position: absolute;
  top: 0;
  left: 0;
  .header-dialog-box-wrapper {
    z-index: 10000;
    height: 28rem;
    box-shadow: 0rem 0.4rem 2rem rgba(0, 0, 0, 0.12);
    border-radius: 2rem;
    .toolbox-header {
      height: 2.4rem;
      margin-top: 1.8rem;
      text-align: center;
      position: relative;
      line-height: 2.4rem;
      margin-bottom: 2.2rem;
      .toolbox-title {
        font-family: 'Inter Bold';
        font-weight: 700;
        font-size: 1.6rem;
        line-height: 2.4rem;
      }
      .toolbox-close {
        width: 1.5rem;
        height: 1.5rem;
        position: absolute;
        top: 0.45rem;
        right: 2.6rem;
        opacity: 0.6;
        cursor: pointer;
      }
    }
    .wallet-item {
      height: 3.6rem;
      padding: 0rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.6rem;
      .wallet-item-left {
        display: flex;
        justify-content: center;
        align-items: center;
        .wallet-icon {
          width: 2.2rem;
          height: 2.2rem;
        }
        .wallet-title {
          font-weight: 400;
          font-size: 1.4rem;
          line-height: 2.4rem;
          margin-left: 0.8rem;
        }
      }
      .wallet-btn {
        height: 3.6rem;
        line-height: 2rem;
      }
    }
  }
}
</style>
