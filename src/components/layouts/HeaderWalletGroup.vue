<template>
  <div
    class="header-wallet-group"
    :style="{ display: this.selectWalletDialogVisible ? 'flex' : 'none' }"
  >
    <div class="header-wallet-content">
      <div class="close" @click.stop="closeSelectWalletDialog">
        <img :src="require('../../assets/data/close.png')" />
      </div>
      <div class="title">Connect a Wallet</div>
      <div class="wallet-list">
        <div v-if="connectWalletGroupKey === 'EVM'" class="wallet-group">
          <div class="wallet-group-title">EVM Wallet</div>
          <div class="wallet-group-list">
            <div
              v-for="item in evmWallet"
              :key="item.title"
              class="wallet-item"
              @click="connectEvmWallet(item)"
            >
              <svg-icon class="wallet-icon" :iconName="item.icon"></svg-icon>
              <span class="wallet-title">{{ item.title }}</span>
            </div>
          </div>
        </div>
        <div v-else-if="connectWalletGroupKey === 'STARKNET'" class="wallet-group">
          <div class="wallet-group-title">StarkNet Wallet</div>
          <div class="wallet-group-list">
            <div
              v-for="item in starknetWallet"
              :key="item.key"
              class="wallet-item"
              @click="connectStarkNetWallet(item)"
            >
              <svg-icon class="wallet-icon" :iconName="item.icon"></svg-icon>
              <span class="wallet-title">{{ item.title }}</span>
            </div>
          </div>
        </div>
        <div v-else-if="connectWalletGroupKey === 'SOLANA'" class="wallet-group">
          <div class="wallet-group-title">Solana Wallet</div>
          <div class="wallet-group-list">
            <div
              v-for="item in solanaWallet"
              :key="item.title"
              class="wallet-item"
              @click="connectSolanaWallet(item)"
            >
              <svg-icon class="wallet-icon" :iconName="item.icon"></svg-icon>
              <span class="wallet-title">{{ item.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  isMobile,
  starkAddress,
  showAddress,
  isStarkNetDialog,
  selectWalletDialogVisible,
  setSelectWalletDialogVisible,
  web3State,
  connectWalletGroupKey,
  setConnectWalletGroupKey
} from '../../composition/hooks'

import walletDispatchers, {
  METAMASK,
  TOKEN_POCKET_APP,
  COIN98_APP,
  WALLETCONNECT,
  CURRENT_SUPPORT_WALLET,
} from '../../util/walletsDispatchers'

import util, { isMobileDevice, isBrowserApp } from '../../util'

import { getStarkNetCurrentChainId } from '../../util/constants/starknet/helper'

import { getStarknet, connect } from 'get-starknet'

import { walletIsLogin } from '../../composition/walletsResponsiveData'

import { isBraveBrowser } from '../../util/browserUtils'

import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'

import { walletConnectDispatcherOnInit } from '../../util/walletsDispatchers/pcBrowser/walletConnectPCBrowserDispatcher'

import { store } from '../../store'

const { walletDispatchersOnInit, walletDispatchersOnDisconnect } =
  walletDispatchers

export default {
  name: 'HeaderWalletGroup',
  computed: {
    connectWalletGroupKey() {
      return connectWalletGroupKey.value
    },
    selectWalletDialogVisible() {
      return selectWalletDialogVisible.value
    },
    walletType() {
      if (!isStarkNetDialog.value) {
        const walletName = String(compatibleGlobalWalletConf.value.walletType)
          .toLowerCase()
          .replace('app', '')

        return CURRENT_SUPPORT_WALLET.includes(walletName.toLocaleLowerCase())
          ? walletName
          : METAMASK.toLocaleLowerCase()
      } else {
        return getStarknet && getStarknet()?.id === 'braavos'
          ? 'braavos'
          : 'argent'
      }
    },
    evmWallet() {
      const wallets = [
        {
          isConnect: false,
          icon: 'metamask',
          title: 'MetaMask',
        },
        {
          isConnect: false,
          icon: 'walletconnect',
          title: 'WalletConnect',
        },
        {
          isConnect: false,
          icon: 'coinbase',
          title: 'Coinbase',
        },
        {
          isConnect: false,
          icon: 'bitkeep',
          title: 'BitgetWallet',
        },
        {
          isConnect: false,
          icon: 'okxwallet',
          title: 'OKXWallet',
        },
        {
          isConnect: false,
          icon: 'imtokenapp',
          title: 'imTokenApp',
        },
        {
          isConnect: false,
          icon: 'zerion',
          title: 'Zerion',
        },
        {
          isConnect: false,
          icon: 'tokenpocketapp',
          title: TOKEN_POCKET_APP,
        },
        {
          isConnect: false,
          icon: 'blockwallet',
          title: 'BlockWallet',
        },
        {
          isConnect: false,
          icon: 'brave',
          title: 'Brave',
        },
        {
          isConnect: false,
          icon: 'tallyho',
          title: 'Taho',
        },
        {
          isConnect: false,
          icon: 'coin98',
          title: COIN98_APP,
        },
      ]
      // the brave wallet is exclusive to the brave browser
      // so if in other browsers, we should hide brave wallet connect option to users
      if (!isBraveBrowser()) {
        return wallets.filter((wallet) => wallet.title !== 'Brave')
      }
      return wallets
    },

    starknetWallet() {
      const wallets = [
        {
          isConnect: false,
          icon: 'argent',
          key: 'argentX',
          title: 'Argent X',
        },
        {
          isConnect: false,
          icon: 'braavos',
          key: 'braavos',
          title: 'Braavos',
        },
      ]
      return wallets
    },

    solanaWallet() {
      const wallets = [
        {
          isConnect: false,
          icon: 'okxwallet',
          title: 'OKXWallet',
        },
      ]
      return wallets
    },
    isLogin() {
      return walletIsLogin.value
    },
  },
  methods: {
    closeSelectWalletDialog() {
      setSelectWalletDialogVisible(false)
      setConnectWalletGroupKey("EVM")
    },
    checkIsMobileEnv() {
      return isMobileDevice()
    },
    async connectSolanaWallet(item) {
      const provider = window.solflare

      const status = await provider.connect()

      const fromPublicKey = provider.publicKey || window.solflare.publicKey

      store.commit('updateSolanaAddress', fromPublicKey.toString())
      store.commit('updateSolanaWalletName', item.title.toLocaleLowerCase())
      store.commit('updateSolanaWalletIcon', item.icon)
      store.commit('updateSolanaIsConnect', status)

      if (status) {
        this.closeSelectWalletDialog()
      }

      return
    },
    async connectEvmWallet(walletConf) {
      if (walletConf === WALLETCONNECT && isBrowserApp()) {
        walletConnectDispatcherOnInit(WALLETCONNECT)
        return
      }
      if (
        walletConf.title === METAMASK &&
        window.ethereum?.isOkxWallet &&
        !this.checkIsMobileEnv()
      ) {
        Notification({
          title: 'Error: MetaMask has not been installed.',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          customClass: 'installWalletTips',
          duration: 3000,
          message:
            '<div style="font-family:Inter Regular;text-align: left;">If you already have MetaMask installed, check your browser extension settings to make sure you have it enabled and that you have disabled any other browser extension wallets.</div>',
        })
        return
      }
      walletDispatchersOnInit[walletConf.title]()
      this.closeSelectWalletDialog()
    },

    async connectStarkNetWallet(walletConf) {

      const wallet = await connect({
        order: [walletConf.key],
        include: [walletConf.key],
      })
      if (!wallet) {
        return
      }
      const enabled = await wallet
        .enable({ showModal: false })
        .then((address) => !!address?.length)

      if (enabled) {
        store.commit('updateStarkNetAddress', getStarknet().selectedAddress)
        store.commit('updateStarkNetWalletName', wallet.name)
        store.commit('updateStarkNetWalletIcon', wallet.icon)
        store.commit('updateStarkNetChain', getStarkNetCurrentChainId())
        store.commit('updateStarkNetIsConnect', getStarknet().isConnected)
        this.closeSelectWalletDialog()
        getStarknet().on('accountsChanged', (e) => {
          store.commit('updateStarkNetAddress', getStarknet().selectedAddress)
          store.commit('updateStarkNetChain', getStarkNetCurrentChainId())
          store.commit('updateStarkNetIsConnect', getStarknet().isConnected)
          if (e.length == 0) {
            util.showMessage('disconnect starkNetWallet', 'error')
          }
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.header-wallet-group {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;

  .header-wallet-content {
    width: 90%;
    text-align: left;
    width: 100%;
    height: 100%;
    max-height: 570px;
    max-width: 480px;
    background: #ffffff;
    border-radius: 16px;
    padding: 16px 16px 24px 24px;
    position: relative;
    top: 0;
    left: 0;

    .close {
      position: absolute;
      top: 16px;
      right: 16px;
      cursor: pointer;

      img {
        width: 32px;
        height: 32px;
      }
    }

    .title {
      font-family: Kodchasan, Kodchasan;
      font-weight: bold;
      font-size: 20px;
      color: #222222;
      line-height: 26px;
      text-align: left;
      font-style: normal;
    }

    .wallet-list {
      width: 100%;
      max-height: 500px;

      overflow: auto;

      .wallet-group {
        width: 100%;
        .wallet-group-title {
          font-family: OpenSans, OpenSans;
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          line-height: 19px;
          text-align: left;
          font-style: normal;
          margin-top: 18px;
        }

        .wallet-group-list {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;

          .wallet-item {
            width: calc(50% - 8px);
            padding: 14px;
            display: flex;
            justify-content: start;
            align-items: center;
            border: 1px solid #eeeeee;
            margin-top: 12px;
            border-radius: 8px;
            cursor: pointer;

            .wallet-icon {
              width: 28px;
              height: 28px;
              margin-right: 14px;
            }

            .wallet-title {
              font-family: OpenSansRoman, OpenSansRoman;
              font-weight: 600;
              font-size: 16px;
              color: #222222;
              line-height: 22px;
              text-align: left;
              font-style: normal;
            }
          }
        }
      }
    }
  }
}
</style>
