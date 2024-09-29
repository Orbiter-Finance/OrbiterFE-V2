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
        <div
          v-else-if="connectWalletGroupKey === 'STARKNET'"
          class="wallet-group"
        >
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
        <div
          v-else-if="connectWalletGroupKey === 'SOLANA'"
          class="wallet-group"
        >
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
        <div v-else-if="connectWalletGroupKey === 'FUEL'" class="wallet-group">
          <div class="wallet-group-title">FUEL Wallet</div>
          <div class="wallet-group-list">
            <div
              v-for="item in fuelsWallet"
              :key="item.title"
              class="wallet-item"
              @click="connectFuelWallet(item)"
            >
              <svg-icon class="wallet-icon" :iconName="item.icon"></svg-icon>
              <span class="wallet-title">{{ item.title }}</span>
            </div>
          </div>
        </div>
        <div
          v-else-if="connectWalletGroupKey === 'FRACTAL'"
          class="wallet-group"
        >
          <div class="wallet-group-title">Fracta Wallet</div>
          <div class="wallet-group-list">
            <div
              v-for="item in fractalWallet"
              :key="item.title"
              class="wallet-item"
              @click="connectFractaWallet(item)"
            >
              <svg-icon class="wallet-icon" :iconName="item.icon"></svg-icon>
              <span class="wallet-title">{{ item.title }}</span>
            </div>
          </div>
        </div>
        <div v-else-if="connectWalletGroupKey === 'APTOS'" class="wallet-group">
          <div class="wallet-group-title">Aptos Wallet</div>
          <div class="wallet-group-list">
            <div
              v-for="item in aptosWallet"
              :key="item.title"
              class="wallet-item"
              @click="connectAptosWallet(item)"
            >
              <svg-icon class="wallet-icon" :iconName="item.icon"></svg-icon>
              <span class="wallet-title">{{ item.title }}</span>
            </div>
          </div>
        </div>
          <div v-else-if="connectWalletGroupKey === 'TRON'" class="wallet-group" >
            <div class="wallet-group-title">Tron Wallet</div>
            <div class="wallet-group-list">
              <div
                v-for="item in tronWallet"
                :key="item.title"
                class="wallet-item"
                @click="connectTronWallet(item)"
              >
                <svg-icon class="wallet-icon" :iconName="item.icon"></svg-icon>
                <span class="wallet-title">{{ item.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  selectWalletDialogVisible,
  setSelectWalletDialogVisible,
  connectWalletGroupKey,
  setConnectWalletGroupKey,
  web3State,
} from '../../composition/hooks'

import walletDispatchers, {
  METAMASK,
  TOKEN_POCKET_APP,
  COIN98_APP,
  WALLETCONNECT,
  CURRENT_SUPPORT_WALLET,
  FOXWALLET_APP,
  // TRUSTWALLET_APP,
  SAFEPAL,
  BINANCEWALLET,
  PHANTOMWALLET,
  BACKPACKWALLET,
  BYBITWALLET,
  METAMASK_APP,
  COINBASE_APP,
  BIT_KEEP_APP,
  OKXWALLET,
  IM_TOKEN_APP,
  ZERION_APP,
  BLOCKWALLET,
  TALLYHO,
  BRAVE_APP
} from '../../util/walletsDispatchers'

import util, { isMobileDevice, isBrowserApp } from '../../util'

import { getStarkNetCurrentChainId } from '../../util/constants/starknet/helper'

import { getStarknet, connect } from 'get-starknet'

import { walletIsLogin } from '../../composition/walletsResponsiveData'

import { isBraveBrowser } from '../../util/browserUtils'

import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'

import { walletConnectDispatcherOnInit } from '../../util/walletsDispatchers/pcBrowser/walletConnectPCBrowserDispatcher'

import { store } from '../../store'
import solanaHelper from '../../util/solana/solana_helper'
import fuelsHelper from '../../util/fuels/fuels_helper'
import fractalHelper from '../../util/fractal/fractal_helper'
import aptosHelper from '../../util/aptos/aptos_helper'
import tronHelper from '../../util/tron/tron_helper'

let ton

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
    evmWallet() {
      const wallets = [
        {
          isConnect: false,
          icon: 'metamask',
          title: METAMASK_APP,
        },
        {
          isConnect: false,
          icon: 'binance wallet',
          title: BINANCEWALLET,
        },
        // {
        //   isConnect: false,
        //   icon: 'walletconnect',
        //   title: WALLETCONNECT,
        // },
        {
          isConnect: false,
          icon: 'coinbase',
          title: COINBASE_APP,
        },
        {
          isConnect: false,
          icon: 'bitkeep',
          title: BIT_KEEP_APP,
        },
        {
          isConnect: false,
          icon: 'okxwallet',
          title: OKXWALLET,
        },
        {
          isConnect: false,
          icon: BYBITWALLET,
          title: BYBITWALLET,
        },
        {
          isConnect: false,
          icon: 'imtokenapp',
          title: IM_TOKEN_APP,
        },
        {
          isConnect: false,
          icon: 'phantom',
          title: PHANTOMWALLET,
        },
        {
          isConnect: false,
          icon: 'backpack',
          title: BACKPACKWALLET,
        },
        {
          isConnect: false,
          icon: 'zerion',
          title: ZERION_APP,
        },
        {
          isConnect: false,
          icon: 'tokenpocketapp',
          title: TOKEN_POCKET_APP,
        },
        {
          isConnect: false,
          icon: 'blockwallet',
          title: BLOCKWALLET,
        },
        {
          isConnect: false,
          icon: 'brave',
          title: BRAVE_APP,
        },
        {
          isConnect: false,
          icon: 'tallyho',
          title: TALLYHO,
        },
        {
          isConnect: false,
          icon: 'coin98',
          title: COIN98_APP,
        },
        {
          isConnect: false,
          icon: 'foxwallet',
          title: FOXWALLET_APP,
        },
        {
          isConnect: false,
          icon: 'safepal',
          title: SAFEPAL,
        },
        // {
        //   isConnect: false,
        //   icon: 'trustwallet',
        //   title: TRUSTWALLET_APP,
        // }
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
        {
          isConnect: false,
          icon: 'phantom',
          title: 'Phantom',
        },
        {
          isConnect: false,
          icon: 'backpack',
          title: 'Backpack',
        },
        {
          isConnect: false,
          icon: 'nightly',
          title: 'Nightly',
        },
        {
            isConnect: false,
            icon: 'bybitWallet',
            title: "Bybit Wallet",
        }
        // {
        //     isConnect: false,
        //     icon: 'trustwallet',
        //     title: TRUSTWALLET_APP,
        // }
      ]
      return wallets
    },
    fuelsWallet() {
      const wallets = [
        {
          isConnect: false,
          icon: 'FUEL',
          title: 'Fuel Wallet',
        },
        {
          isConnect: false,
          icon: 'fuelet',
          title: 'Fuelet Wallet',
        },
      ]
      return wallets
    },
    tronWallet() {
      const wallets = [
        {
          isConnect: false,
          icon: 'okxwallet',
          title: 'OKXWallet',
        },
        {
          isConnect: false,
          icon: 'tronLink',
          title: 'TronLink',
        },
      ]
      return wallets
    },
    fractalWallet() {
      const wallets = [
        {
          isConnect: false,
          icon: 'unisat',
          title: 'Unisat Wallet',
        },
      ]
      return wallets
    },
    aptosWallet() {
      const wallets = [
        {
          isConnect: false,
          icon: 'nightly',
          title: 'Nightly',
        },
        {
          isConnect: false,
          icon: 'imtokenapp',
          title: 'imTokenApp',
        }
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
      setConnectWalletGroupKey('EVM')
    },
    checkIsMobileEnv() {
      return isMobileDevice()
    },
    async connectFuelWallet(item) {
      console.log('item', item)
      await fuelsHelper.connect(item.title)
      this.closeSelectWalletDialog()
      return
    },
    async connectTronWallet(item) {
      const status = await tronHelper.connect(item.icon)

      this.closeSelectWalletDialog()

      return
    },
    async connectSolanaWallet(item) {
      const status = await solanaHelper.connect(item.icon)
      const fromPublicKey = web3State.solana.solanaAddress

      store.commit('updateSolanaAddress', fromPublicKey)
      store.commit('updateSolanaWalletName', item.icon.toLocaleLowerCase())
      store.commit('updateSolanaWalletIcon', item.icon.toLocaleLowerCase())
      store.commit('updateSolanaIsConnect', status)

      this.closeSelectWalletDialog()

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

    async connectFractaWallet(item) {
      const status = await fractalHelper.connect(item.icon)
      this.closeSelectWalletDialog()

      return
    },
    async connectAptosWallet(item) {
      const status = await aptosHelper.connect(item.icon)
      this.closeSelectWalletDialog()
      return
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

            .wallet-img {
              width: 28px;
              height: 28px;
              border-radius: 4px;
              margin-right: 14px;
            }

            .wallet-icon {
              width: 28px;
              height: 28px;
              margin-right: 14px;
            }

            .wallet-title {
              font-family: GeneralSans, GeneralSans;
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
