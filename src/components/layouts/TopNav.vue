<template>
<div class="top-nav">
  <SvgIconThemed @click.native="toHome" class="logo" icon="logo" />
  <div class="navs">
    <span @click="route2('/')" :class="['nav-item', {selected: $route.path === '/'}]">L2 Bridge</span>
    <span @click="route2('/data')" :class="['nav-item', {selected: $route.path === '/data'}]">L2 Data</span>
    <span class="nav-item">
      More
      <SvgIconThemed />
    </span>
  </div>
  <div class="right-ops">
    <CommBtn ref="connectBtn" v-if="!isLogin" @click="connectAWallet" style="margin-right: 10px;">Connect a Wallet</CommBtn>
    <template v-else>
      <span @click="showHistory" class="ops-item">History</span>
      <div v-if="isSelectedStarkNet" ref="connectedStarkNetBtn" @click="connectStarkNetWallet" class="ops-item" style="display:inline-flex;justify-content:center;align-items:center;">
        <svg-icon style="width:2rem;height:2rem;" iconName="sknlogo"></svg-icon>
        <span style="margin-left:4px;font-weight: 700;font-size: 16px;line-height: 24px;">{{starkAddress}}</span>
      </div>
      <div ref="connectedBtn" @click="connectAWallet" class="ops-item" style="display:inline-flex;justify-content:center;align-items:center;">
        <svg-icon style="width:2rem;height:2rem;" :iconName="selectedWallet.icon"></svg-icon>
        <span style="margin-left:4px;font-weight: 700;font-size: 16px;line-height: 24px;">{{showAddress}}</span>
      </div>
    </template>
    <div @click="toggleThemeMode" class="ops-mode">
      <SvgIconThemed class="mode-icon" icon="mode" />
    </div>
    <div ref="navDialog" :style="{display: selectWalletDialogVisible ? 'block' : 'none', right: isStarkNetDialog ? '160px' : '20px'}" class="ops-toolbox">
      <div class="toolbox-header">
        <span class="toolbox-title">{{ isLogin ? 'Connect information' : 'Connect a Wallet'}}</span>
        <SvgIconThemed @click.native="closeSelectWalletDialog" class="toolbox-close" iconName="close" />
      </div>
      <template v-if="!isLogin">
        <div v-for="item in loginData" :key="item.title" class="wallet-item">
          <div class="wallet-item-left">
            <svg-icon class="wallet-icon" :iconName="item.icon"></svg-icon>
            <span class="wallet-title">{{item.title}}</span>
          </div>
          <CommBtn class="wallet-btn" @click="connectWallet(item)">Connect</CommBtn>
        </div>
      </template>
      <template v-else>
        <div v-for="item in loginInfoData" :key="item.title" class="wallet-item" style="font-weight: 400;font-size: 14px;line-height: 20px;">
          <div style="display: flex;justify-content:center;align-items:center;">
            <svg-icon style="width: 2.4rem; height: 2.4rem" :iconName="item.icon"></svg-icon>
            <span class="wallet-item-title" style="margin-left:1rem">{{ item.title }}</span>
          </div>
          <div style="text-align: right; display: flex">
            <span>{{ item.value }}</span>
            <div
              v-if="item.title === 'Address'"
              v-clipboard:copy="$store.state.web3.coinbase"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              style="width: 1.8rem; height: 1.8rem; display: inline-block"
            >
              <SvgIconThemed style="width: 100%; height: 100%" iconName="copy" />
            </div>
          </div>
        </div>
        <CommBtn v-if="!isStarkNetDialog" class="wallet-btn" @click="disconnect">Disconnect</CommBtn>
      </template>
    </div>
  </div>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
import { CommBtn, SvgIconThemed } from '../'
import check from '../../util/check/check.js'
import util from '../../util/util'

export default {
  name: 'TopNav',
  components: { CommBtn, SvgIconThemed },
  data() {
    const selectedWallet = JSON.parse(localStorage.getItem('selectedWallet') || '{}')
    return {
      selectWalletDialogVisible: false,
      selectedWallet,
      isStarkNetDialog: false,
    }
  },
  computed: {
    isLogin() {
      return (
        this.$store.state.web3.isInstallMeta &&
        this.$store.state.web3.isInjected &&
        this.$store.state.web3.localLogin
      )
    },
    loginData() {
      return [
        {
          isConnect: this.isLogin && check.checkIsMetaMask(),
          icon: 'metamask',
          title: 'MetaMask',
        },
      ]
    },
    isSelectedStarkNet() {
      const transferData = this.$store.state.transferData
      return transferData.fromChainID == 4 || transferData.fromChainID == 44 || transferData.toChainID == 4 || transferData.toChainID == 44
    },
    loginInfoData() {
      if (this.isStarkNetDialog) {
        return [
          {
            icon: 'network',
            title: 'Network',
            value: util.chainName('0', this.$store.state.web3.networkId),
          },
          {
            icon: 'wallet',
            title: 'Wallet',
            value: 'MetaMask',
          },
          {
            icon: 'address',
            title: 'Address',
            value: this.showAddress,
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
            value: util.chainName('0', this.$store.state.web3.networkId),
          },
          {
            icon: 'wallet',
            title: 'Wallet',
            value: 'MetaMask',
          },
          {
            icon: 'address',
            title: 'Address',
            value: this.showAddress,
          },
        ]
      }
    },
    showAddress() {
      var address = this.$store.state.web3.coinbase
      if (address && address.length > 5) {
        var subStr1 = address.substr(0, 4)
        var subStr2 = address.substr(address.length - 4, 4)
        return subStr1 + '...' + subStr2
      }
      return ''
    },
    starkAddress() {
      var stark = this.$store.state.web3.starkNet.starkNetAddress
      if (stark && stark.length > 5) {
        var subStr1 = stark.substr(0, 4)
        var subStr2 = stark.substr(stark.length - 4, 4)
        return subStr1 + '...' + subStr2
      }
      return 'not connected'
    },
  },
  methods: {
    ...mapMutations(['toggleThemeMode']),
    toHome() {
      this.$route.path !== '/' && this.$router.push({
        path: '/'
      })
    },
    route2(tar) {
      this.$router.push({
        path: tar || '/'
      })
    },
    connectStarkNetWallet() {
      this.isStarkNetDialog = true
      this.selectWalletDialogVisible = true
    },
    connectAWallet() {
      this.isStarkNetDialog = false
      this.selectWalletDialogVisible = true
    },
    closeSelectWalletDialog() {
      this.selectWalletDialogVisible = false
    },
    connectWallet(item) {
      this.closeSelectWalletDialog()
      this.selectedWallet = item
      localStorage.setItem('selectedWallet', JSON.stringify(item))
      if (item.title === 'MetaMask') {
        this.$store.dispatch('registerWeb3')
      }
    },
    disconnect() {
      this.closeSelectWalletDialog()
      this.selectedWallet = {}
      localStorage.setItem('selectedWallet', JSON.stringify({}))
      this.$store.commit('updateLocalLogin', false)
      localStorage.setItem('localLogin', false)
    },
    showHistory() {
      this.$store.commit('toggleHistoryPanelVisible', true)
    },
    //copy success
    onCopy() {
      this.$notify({ title: 'copy success', type: 'success', duration: 2000, })
    },
    //copy error
    onError() {
      this.$notify.error({ title: 'copy faild', duration: 2000, })
    },
    handlerDialogOutsideClick(e) {
      if (this.selectWalletDialogVisible) {
        const dialog = this.$refs.navDialog
        const btn1 = this.$refs.connectBtn
        const btn2 = this.$refs.connectedBtn
        const btn3 = this.$refs.connectedStarkNetBtn
        let cur = e.target
        let hasFind = false
        while(cur && !hasFind) {
          if (cur === dialog || cur === btn1?.$el || cur === btn2 || cur === btn3) {
            hasFind = true
          }
          cur = cur.parentElement
        }
        !hasFind && this.closeSelectWalletDialog()
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handlerDialogOutsideClick)
  },
  unmounted() {
    document.removeEventListener('click', this.handlerDialogOutsideClick)
  },
}
</script>

<style scoped lang="scss">
$logoWidth: 153px;
$navsWidth: 272px;

.top-nav {
  height: 72px;
  // overflow: hidden;
  display: flex;
  justify-content: space-between;
  .logo {
    width: $logoWidth;
    height:40px;
    margin-top:16px;
    margin-left:21px;
    // float: left;
    cursor: pointer;
  }
  .navs {
    margin-top: 24px;
    height:40px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    // float: left;
    // margin-left: calc(50% - $navsWidth / 2 - $logoWidth);
    .nav-item {
      height:24px;
      margin-right: 39px;
      cursor: pointer;
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }
    .nav-item:last-child {
      margin-right: 0;
    }
    .nav-item.selected::after {
      content: '';
      position: absolute;
      width: 40px;
      height: 6px;
      background: #DF2E2D;
      bottom: -10px;
      left: calc(50% - 20px);
      border-radius: 11px;
    }
  }
  .right-ops {
    float: right;
    margin-top: 19px;
    margin-right: 16px;
    height: 40px;
    display: flex;
    .ops-mode {
      width: 40px;
      height: 40px;
      background: white;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .mode-icon {
        width:16px;
        height:16px;
      }
    }
    .ops-item {
      padding: 8px 24px;
      background: #FFFFFF;
      border-radius: 20px;
      font-weight: 700;
      font-size: 16px;
      line-height: 24px;
      margin-right: 10px;
      cursor: pointer;
    }
    .ops-toolbox {
      z-index: 10000;
      position: absolute;
      top: 75px;
      // right: 20px;
      width: 320px;
      height: 280px;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.12);
      border-radius: 20px;
      .toolbox-header {
        height:24px;margin-top:18px;text-align:center;position:relative;line-height:24px;margin-bottom:22px;
        .toolbox-title {
          font-weight: 700;font-size: 16px;line-height: 24px;
        }
        .toolbox-close {
          width:1.5rem; height:1.5rem;position:absolute;top:4.5px;right:26px;opacity:0.6;
          cursor: pointer;
        }
      }
      .wallet-item {
        height:36px;padding: 0px 20px;display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;
        cursor: pointer;
        .wallet-item-left {
          display:flex;justify-content:center;align-items:center;
          .wallet-icon {
            width: 2.2rem;height: 2.2rem;
          }
          .wallet-title {
            font-weight: 400;font-size: 14px;line-height: 24px;margin-left:8px;
          }
        }
        .wallet-btn {
          height:36px;
          line-height:20px;
        }
      }
    }
  }
}
</style>
