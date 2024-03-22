<template>
  <div
    class="header-wallet-group"
    :style="{ display: this.selectWalletDialogVisible ? 'flex' : 'none' }"
  >
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
          <div
            v-for="item in starknetWallet"
            :key="item.key"
            class="wallet-item"
          >
            <svg-icon class="wallet-icon" :iconName="item.icon"></svg-icon>
            <span class="wallet-title">{{ item.title }}</span>
          </div>
        </div>
        <div class="wallet-group-title">Solana Wallet</div>
        <div class="wallet-group-list">
          <div
            v-for="item in solanaWallet"
            :key="item.title"
            class="wallet-item"
            @click="connectSolanaWallet"
          >
            <svg-icon class="wallet-icon" :iconName="item.icon"></svg-icon>
            <span class="wallet-title">{{ item.title }}</span>
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
} from '../../composition/hooks'

import walletDispatchers, {
  METAMASK,
  TOKEN_POCKET_APP,
  COIN98_APP,
  WALLETCONNECT,
  CURRENT_SUPPORT_WALLET,
} from '../../util/walletsDispatchers'

import util, {
  onCopySuccess,
  onCopyError,
  isMobileDevice,
  isBrowserApp,
} from '../../util'

import { getStarknet, connect, disconnect } from 'get-starknet'

import { walletIsLogin } from '../../composition/walletsResponsiveData'

import { isBraveBrowser } from '../../util/browserUtils'

import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'

import {
  ethereumClient,
  walletConnectDispatcherOnInit,
} from '../../util/walletsDispatchers/pcBrowser/walletConnectPCBrowserDispatcher'

import {
  Connection,
  Transaction,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js'

import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { utils } from 'ethers'

import { store } from '../../store'

const { walletDispatchersOnInit, walletDispatchersOnDisconnect } =
  walletDispatchers

export default {
  name: 'HeaderWalletGroup',
  computed: {
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
    },
    checkIsMobileEnv() {
      return isMobileDevice()
    },
    async connectSolanaWallet() {
      const provider = window.solflare
      const res = await provider.connect()
      const fromPublicKey = provider.publicKey
      console.log('1111', provider, res, fromPublicKey.toString())

      const networks =
        'https://solana-devnet.g.alchemy.com/v2/t9lfb_P_pmAzmcUm0iaJydUhpLrjQx85'

      const wallet = new Connection(networks, 'confirmed')
      console.log('wallet', wallet)

      const block = await wallet.getBlockHeight()
      console.log('block', block)

      const balance = await wallet.getBalance(fromPublicKey)
      console.log('balance', balance)

      const recentBlockhash = await wallet.getLatestBlockhash()
      console.log('recentBlockhash', recentBlockhash)

      const to = 'Exf58y5uLJc84oKVAvjfpwMbbSB59unwLHTagLd2tF9g'

      const toPublicKey = new PublicKey(to)
      console.log('toPublicKey', toPublicKey.toString())

      const tokenStr = 'GSihgzyhuRxf4RveXxXTkaFJnkWiy7mrLdN9rAQ8TYEE'
      const tokenPublicKey = new PublicKey(tokenStr)

      const amount = 1000000

      const keypair = new Keypair()

      console.log('keypair', keypair)

      const transaction = new Transaction({
        recentBlockhash: recentBlockhash.blockhash,
        feePayer: fromPublicKey,
      })

      const token = new Token(wallet, tokenPublicKey, TOKEN_PROGRAM_ID, null)

      console.log('token', token)

      const senderTokenAccount = await token.getOrCreateAssociatedAccountInfo(
        fromPublicKey
      )

      console.log('senderTokenAccount', senderTokenAccount)

      const instruction = Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        senderTokenAccount.address,
        toPublicKey,
        senderTokenAccount.publicKey,
        [],
        1000000
      )

      const solTransaction = transaction.add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: toPublicKey,
          lamports: 0,
        })
      )
      console.log('solTransaction', solTransaction)

      const tokenTransaction = new Transaction()
        .add(
          instruction
        )
        // .add(
        //   new TransactionInstruction({
        //     keys: [{ pubkey: fromPublicKey, isSigner: true, isWritable: true }],
        //     data: [],
        //     programId: new PublicKey(
        //       'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
        //     ),
        //   })
        // )

      console.log('tokenTransaction', tokenTransaction)

      // const signer = await provider.signTransaction(tokenTransaction)
      // console.log('signer', signer)

      // const signatureSol = await provider.signAndSendTransaction(solTransaction)
      // console.log('signatureSol', signatureSol)

      const signature = await provider.signTransaction(tokenTransaction)

      console.log('signature', signature)
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
      console.log('walletConf', walletConf)

      const wallet = await connect({
        order: [walletConf.key],
        include: [walletConf.key],
      })
      console.log('wallet', wallet)
      if (!wallet) {
        return
      }
      const enabled = await wallet
        .enable({ showModal: false })
        .then((address) => !!address?.length)

      console.log('enabled', enabled)

      if (enabled) {
        console.log('starknet address', getStarknet().selectedAddress)
        store.commit('updateStarkNetAddress', getStarknet().selectedAddress)
        store.commit('updateStarkNetWalletName', wallet.name)
        store.commit('updateStarkNetWalletIcon', wallet.icon)
        store.commit('updateStarkNetChain', getStarkNetCurrentChainId())
        store.commit('updateStarkNetIsConnect', getStarknet().isConnected)
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
</style>
, sendAndConfirmTransactionimport { toHex } from '@loopring-web/loopring-sdk';
