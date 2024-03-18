<template>
  <div class="header-wallet-group">
    <div class="header-wallet-content">
      <div class="title">Connect a Wallet</div>
    <div class="wallet-list">
      <div class="wallet-group-title">EVM Wallet</div>
      <div class="wallet-group-list">
        <div v-for="item in evmWallet" :key="item.title" class="wallet-item">
          <svg-icon class="wallet-icon" :iconName="item.icon"></svg-icon>
          <span class="wallet-title">{{ item.title }}</span>
        </div>
      </div>
      <div class="wallet-group-title">StarkNet Wallet</div>
      <div class="wallet-group-list">
        <div v-for="item in starknetWallet" :key="item.title" class="wallet-item">
          <svg-icon class="wallet-icon" :iconName="item.icon"></svg-icon>
          <span class="wallet-title">{{ item.title }}</span>
        </div>
      </div>
      <div class="wallet-group-title">Solana Wallet</div>
      <div class="wallet-group-list">
        <div v-for="item in solanaWallet" :key="item.title" class="wallet-item" @click="connectSolanaWallet()">
          <svg-icon class="wallet-icon" :iconName="item.icon"></svg-icon>
          <span class="wallet-title">{{ item.title }}</span>
        </div>
      </div>
    </div>
  </div>

  </div>
</template>

<script>
import walletDispatchers, {
  METAMASK,
  TOKEN_POCKET_APP,
  COIN98_APP,
  WALLETCONNECT,
} from '../../util/walletsDispatchers'

import { walletIsLogin } from '../../composition/walletsResponsiveData'

import { isBraveBrowser } from '../../util/browserUtils'

// import { PublicKey } from "@solana/web3.js"

export default {
  name: 'HeaderWalletGroup',
  computed: {
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
          title: 'Argent X',
        },
        {
          isConnect: false,
          icon: 'braavos',
          title: 'Braavos',
        }
      ]
      return wallets
    },

    solanaWallet() {
      const wallets = [
        {
          isConnect: false,
          icon: 'okxwallet',
          title: 'OKXWallet',
        }
      ]
      return wallets
    },
    isLogin() {
      return walletIsLogin.value
    },
  },
  methods: {
    async connectSolanaWallet(){
      const res = await window.okxwallet.solana.connect()
      console.log("1111", res)

      // const publicKey = new PublicKey(res);
      // console.log("publicKey", publicKey)
    }
  }
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
    width: 100%;
    text-align: left;
    width: 100%;
    height: 100%;
    max-height: 570px;
    max-width: 480px;
    background: #ffffff;
    border-radius: 16px;
    padding: 16px 16px 24px 24px;

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
</style>import { connect } from 'get-starknet';

