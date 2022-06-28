<template>
  <div class="BottomNav">
    <div v-if="isWeb" class="bottom">
      <div>
        <svg-icon class="nav-logo" iconName="orbiterLogo"></svg-icon>
      </div>
      <div class="bottomContent">
        <div class="github">
          <a
            href="https://github.com"
            rel="noreferrer noopener"
            target="_blank"
          >
            <svg viewBox="0 0 18 18" focusable="false" class="githunbIcon">
              <path
                d="M9 0C4.0275 0 0 4.13211 0 9.22838C0 13.3065 2.5785 16.7648 6.15375 17.9841C6.60375 18.0709 6.76875 17.7853 6.76875 17.5403C6.76875 17.3212 6.76125 16.7405 6.7575 15.9712C4.254 16.5277 3.726 14.7332 3.726 14.7332C3.3165 13.6681 2.72475 13.3832 2.72475 13.3832C1.9095 12.8111 2.78775 12.8229 2.78775 12.8229C3.6915 12.887 4.16625 13.7737 4.16625 13.7737C4.96875 15.1847 6.273 14.777 6.7875 14.5414C6.8685 13.9443 7.10025 13.5381 7.3575 13.3073C5.35875 13.0764 3.258 12.2829 3.258 8.74709C3.258 7.73988 3.60675 6.91659 4.18425 6.27095C4.083 6.03774 3.77925 5.0994 4.263 3.82846C4.263 3.82846 5.01675 3.58116 6.738 4.77462C7.458 4.56958 8.223 4.46785 8.988 4.46315C9.753 4.46785 10.518 4.56958 11.238 4.77462C12.948 3.58116 13.7017 3.82846 13.7017 3.82846C14.1855 5.0994 13.8818 6.03774 13.7917 6.27095C14.3655 6.91659 14.7142 7.73988 14.7142 8.74709C14.7142 12.2923 12.6105 13.0725 10.608 13.2995C10.923 13.5765 11.2155 14.1423 11.2155 15.0071C11.2155 16.242 11.2043 17.2344 11.2043 17.5341C11.2043 17.7759 11.3617 18.0647 11.823 17.9723C15.4237 16.7609 18 13.3002 18 9.22838C18 4.13211 13.9703 0 9 0Z"
                fill="currentColor"
              ></path>
            </svg>
          </a>
        </div>
        <div class="bottomSep"></div>
        <p style="margin-left: 1rem">Build By Orbiter</p>
      </div>
    </div>
    <div v-if="!isWeb" class="BottomContainer">
      <div class="LoginBox">
        <svg-icon
          v-if="isLogin"
          class="LoginImg"
          :iconName="loginBoxIconName()"
        ></svg-icon>
        <button v-if="isLogin" class="LoginBtn" @click="unlogin">
          {{ showAddress }}
        </button>
        <button v-if="!isLogin" class="unLoginBtn" @click="login">
          Connect a Wallet
        </button>
      </div>
      <div class="LoginRBox">
        <o-button
          v-if="isLogin"
          width="8rem"
          height="3.2rem"
          @click="toHistory"
        >
          <span class="s14">History</span>
        </o-button>
        <div v-if="isLogin" @click="clickHoriz" class="horiz">
          <svg-icon
            style="width: 100%; height: 100%"
            iconName="more_horiz"
          ></svg-icon>
        </div>
        <div v-if="!isLogin" @click="clickHoriz" class="horiz_unlogin">
          <svg-icon
            style="width: 100%; height: 100%"
            iconName="more_horiz"
          ></svg-icon>
        </div>
        <!-- <div @click="clickHoriz"
             class="horiz_unlogin">
          <svg-icon style="width:100%;height:100%"
                    iconName="more_horiz"></svg-icon>
        </div> -->
      </div>
      <div class="canvas"></div>
    </div>
    <CustomPopup v-if="!isWeb" ref="OrbiterInfo">
      <div
        slot="PoperContent"
        @click.stop="stopPenetrate"
        class="LoginInfoPopContentView"
      >
        <div class="topItem">
          <span>Orbiter Information</span>
          <div @click="closerButton('orbiterInfo')">
            <svg-icon
              style="width: 1.5rem; height: 1.5rem"
              iconName="close"
            ></svg-icon>
          </div>
        </div>
        <div
          v-for="item in orbiterInfoData"
          :key="item.title"
          class="contentItem"
        >
          <div style="display: flex">
            <svg-icon
              style="width: 2.4rem; height: 2.4rem"
              :iconName="item.icon"
            ></svg-icon>
            <span
              style="margin-left: 1rem"
              class="MediaName"
              @click="JumpToMedia(item.value)"
              >{{ item.title }}</span
            >
          </div>
          <o-button
            v-if="!item.isConnect"
            class="right"
            width="8.6rem"
            height="2.8rem"
            boxShadow="0 0.1rem 0.3rem 0px #ec201e"
            data-wallet="item.title"
            @click="JumpToMedia(item.value)"
          >
            <span class="s14">Link</span>
          </o-button>
        </div>
        <div class="terms">
          <span @click="openTerms">Terms of Use</span>
        </div>
      </div>
    </CustomPopup>
    <CustomPopup v-if="!isWeb" ref="showLoginInfo">
      <div
        slot="PoperContent"
        @click.stop="stopPenetrate"
        class="LoginInfoPopContentView"
      >
        <div class="topItem">
          <span>Connect Information</span>
          <div @click="closerButton('loginInfo')">
            <svg-icon
              style="width: 1.5rem; height: 1.5rem"
              iconName="close"
            ></svg-icon>
          </div>
        </div>
        <div
          v-for="item in loginInfoData"
          :key="item.title"
          class="contentItem"
        >
          <div style="display: flex">
            <svg-icon
              style="width: 2.4rem; height: 2.4rem"
              :iconName="item.icon"
            ></svg-icon>
            <span style="margin-left: 1rem">{{ item.title }}</span>
          </div>
          <div style="text-align: right; color: #e85e24; display: flex">
            <span>{{ item.value }}</span>
            <div
              v-if="item.title === 'Address'"
              v-clipboard:copy="copyAddress"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              style="width: 1.8rem; height: 1.8rem; display: inline-block"
            >
              <svg-icon
                style="width: 100%; height: 100%"
                iconName="copy"
              ></svg-icon>
            </div>
            <div
              v-if="item.title === 'StarkNetAddress'"
              v-clipboard:copy="copyStarkAddress"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              style="width: 1.8rem; height: 1.8rem; display: inline-block"
            >
              <svg-icon
                style="width: 100%; height: 100%"
                iconName="copy"
              ></svg-icon>
            </div>
          </div>
        </div>

        <o-button
          v-if="this.isLogin"
          style="margin: 2.5rem auto"
          width="29.5rem"
          height="4rem"
          boxShadow="0 0.1rem 0.3rem 0px #ec201e"
          @click="disconnect"
          >Disconnect</o-button
        >
      </div>
    </CustomPopup>
    <CustomPopup v-if="!isWeb" ref="showLogin">
      <div
        @click.stop="stopPenetrate"
        slot="PoperContent"
        class="LoginStatePopContentView"
      >
        <div class="topItem">
          <span>Connect a Wallet</span>
          <div @click="closerButton('login')">
            <svg-icon
              style="width: 1.5rem; height: 1.5rem"
              iconName="close"
            ></svg-icon>
          </div>
        </div>
        <div v-for="item in loginData" :key="item.title" class="contentItem">
          <svg-icon
            v-if="item.isConnect"
            style="
              margin-right: 1rem;
              width: 1.9rem;
              height: 1.9rem;
              color: red;
            "
            iconName="success"
          ></svg-icon>
          <svg-icon
            style="margin-right: 0.8rem; width: 3rem; height: 2.7rem"
            :iconName="item.icon"
          ></svg-icon>
          <span>{{ item.title }}</span>
          <span
            v-if="item.isConnect"
            class="right"
            style="font-size: 1.4rem; color: #e85e24"
            >Connected</span
          >
          <o-button
            v-if="!item.isConnect"
            class="right"
            width="8.6rem"
            height="2.8rem"
            boxShadow="0 0.1rem 0.3rem 0px #ec201e"
            data-wallet="item.title"
            @click="Connect(item.title)"
          >
            <span class="s14">Connect</span>
          </o-button>
        </div>
      </div>
    </CustomPopup>
    <CustomPopup v-if="!isWeb" ref="HistoryPopupRef">
      <div slot="PoperContent" style="padding-bottom: var(--bottom-nav-height)">
        <History
          v-on:getHistoryInfo="getHistoryInfo"
          v-on:closeHistory="closeHistoryPopupClick()"
        />
      </div>
    </CustomPopup>
  </div>
</template>

<script>
import CustomPopup from '../popup/bottomPop.vue'
import History from '../../components/popup/history/history.vue'
import Middle from '../../util/middle/middle'
import util from '../../util/util'

import check from '../../util/check/check.js'

export default {
  name: 'BottomNav',
  props: {},
  components: {
    CustomPopup,
    History,
  },
  data() {
    return {}
  },
  mounted() {
    var that = this
    Middle.$on('connectWallet', (state) => {
      if (state) {
        that.openLoginPop()
      }
    })
    Middle.$on('showHistory', (state) => {
      if (state) {
        that.toHistory()
      }
    })
  },
  computed: {
    showStarkNet() {
      const { starkNetAddress, starkIsConnected } =
        this.$store.state.web3.starkNet
      if (!starkIsConnected || starkNetAddress.length == 0) {
        return false
      }
      return true
    },
    copyAddress() {
      return this.$store.state.web3.coinbase
    },

    copyStarkAddress() {
      return this.$store.state.web3.starkNet.starkNetAddress
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
    loginInfoData() {
      if (this.showStarkNet) {
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
    orbiterInfoData() {
      return [
        {
          icon: 'book',
          title: 'Docs ',
          value: 'https://docs.orbiter.finance/',
        },
        {
          icon: 'github',
          title: 'Github ',
          value: 'https://github.com/Orbiter-Finance',
        },
        {
          icon: 'twitter',
          title: 'Twitter  ',
          value: 'https://twitter.com/Orbiter_Finance',
        },
        {
          icon: 'medium',
          title: 'Medium',
          value: 'https://orbiter-finance.medium.com/',
        },
      ]
    },
    isLogin() {
      return (
        this.$store.state.web3.isInstallMeta &&
        this.$store.state.web3.isInjected &&
        this.$store.state.web3.localLogin
      )
    },
    isWeb() {
      if (this.$store.state.innerWH.innerWidth > 10000) {
        return true
      }
      return false
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
  watch: {},
  methods: {
    stopPenetrate(e) {
      e.stopPropagation
    },
    unlogin() {
      this.openLoginInfoPop()
    },
    login() {
      this.openLoginPop()
    },
    toHistory() {
      this.showHistoryPopupClick()
    },
    clickHoriz() {
      this.showOrbiterInfoPopupClick()
    },
    Connect(e) {
      this.closeLoginPop()
      if (e === 'MetaMask') {
        this.$store.dispatch('registerWeb3').then(() => {
          // console.log('==============')
          // if (this.$store.state.web3.isInjected) {
          //   console.log('isInjected')
          // }
        })
      }
    },
    openTerms() {
      window.open(
        'https://get.orbiter.finance/Orbiter_Finance_Terms_of_Use.pdf',
        '_blank'
      )
    },
    JumpToMedia(e) {
      window.open(e, '_blank')
    },
    async disconnect() {
      // await window.ethereum.request({
      //   method: "wallet_requestPermissions",
      //   params: [
      //     {
      //       eth_accounts: {}
      //     }
      //   ]
      // });
      this.closeLoginInfoPop()
      this.$store.commit('updateLocalLogin', false)
      localStorage.setItem('localLogin', false)
    },
    getHistoryInfo(e) {
      Middle.$emit('showDetail', e)
    },
    closerButton(state) {
      if (state === 'loginInfo') {
        this.closeLoginInfoPop()
      }
      if (state === 'login') {
        this.closeLoginPop()
      }
      if (state === 'orbiterInfo') {
        this.closeOrbiterInfoPop()
      }
    },
    showOrbiterInfoPopupClick() {
      this.$refs.OrbiterInfo.showCustom()
    },
    closeOrbiterInfoPop() {
      this.$refs.OrbiterInfo.maskClick()
    },
    // open pop
    openLoginInfoPop() {
      this.$refs.showLoginInfo.showCustom()
    },
    // close pop
    closeLoginInfoPop() {
      this.$refs.showLoginInfo.maskClick()
    },
    // open pop
    openLoginPop() {
      this.$refs.showLogin.showCustom()
    },
    // close pop
    closeLoginPop() {
      this.$refs.showLogin.maskClick()
    },
    //open history
    showHistoryPopupClick() {
      this.$refs.HistoryPopupRef.showCustom()
    },
    //close history
    closeHistoryPopupClick() {
      this.$refs.HistoryPopupRef.maskClick()
    },
    //copy success
    onCopy() {
      this.$notify({
        title: 'copy success',
        type: 'success',
        duration: 2000,
      })
    },
    //copy error
    onError() {
      this.$notify.error({
        title: 'copy faild',
        duration: 2000,
      })
    },
    loginBoxIconName() {
      return check.checkIsMetaMask() ? 'metamask' : 'tokenLogo'
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.BottomNav {
  width: 100%;
  height: var(--bottom-nav-height);
  position: fixed;
  bottom: 0;
  z-index: 1;
  display: flex;
  .BottomContainer {
    width: 35.3rem;
    height: var(--bottom-nav-height);
    border-width: 0.3rem 0.3rem 0 0.3rem;
    border-style: solid;
    border-color: black;
    border-top-left-radius: 2.5rem;
    border-top-right-radius: 2.5rem;
    margin: auto;
    position: relative;
    display: flex;
    background: white;
    .canvas {
      width: 35.3rem;
      height: var(--bottom-nav-height);
      background: radial -
        gradient(
          circle at 35.3rem 8rem,
          transparent 15rem,
          black 15.3rem,
          transparent 15rem
        );
      position: absolute;
      pointer-events: none;
    }
    .LoginBox {
      width: 15rem;
      height: 3.2rem;
      border-radius: 1.6rem;
      border: 0.15rem solid black;
      display: flex;
      margin: 1.7rem 0 0 2.6rem;
      .LoginImg {
        width: 2.2rem;
        height: 2.2rem;
        margin: auto 0 auto 0.5rem;
      }
      .LoginBtn {
        width: 11.3rem;
        height: 3.2rem;
        margin-left: 0.5rem;
        border: 0;
        background: transparent;
        color: var(--default-black);
        font-size: 1.4rem;
        line-height: 1.4rem;
        text-align: left;
        font-weight: 400;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-bottom: 0.2rem;
      }
      .unLoginBtn {
        width: 15rem;
        height: 3.2rem;
        border: 0;
        background: transparent;
        color: var(--primary-color);
        font-size: 1.4rem;
        line-height: 1.4rem;
        text-align: center;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        padding-bottom: 0.2rem;
      }
    }
    .LoginRBox {
      margin-left: 5rem;
      margin-top: 1.7rem;
      width: 11.5rem;
      height: 3.5rem;
      display: flex;
      .horiz {
        margin: 0.7rem 0 auto 0.9rem;
        width: 2.2rem;
        height: 1.8rem;
      }
      .horiz_unlogin {
        margin: 0.7rem 4.8rem auto auto;
        width: 2.2rem;
        height: 2.2rem;
      }
    }
  }
  .LoginInfoPopContentView {
    height: 28rem;
    width: 35.1rem;
    margin: 0 auto;
    background: #fff8d4;
    border-top-left-radius: 2.5rem;
    border-top-right-radius: 2.5rem;
    border: var(--default-black) 0.4rem solid;
    border-bottom: 0;
    box-sizing: content-box;
    position: relative;
    text-align: left;
    .topItem {
      width: 29.7rem;
      height: 2.4rem;
      font-size: 2rem;
      font-weight: bold;
      line-height: 2.4rem;
      color: var(--default-black);
      display: flex;
      justify-content: space-between;
      margin: 2.1rem auto 1rem;
    }
    .contentItem {
      width: 29.7rem;
      height: 2.4rem;
      font-size: 1.4rem;
      line-height: 2.4rem;
      color: var(--default-black);
      display: flex;
      justify-content: space-between;
      margin: 2rem auto;
      .MediaName:hover {
        color: #e85e24;
      }
    }
    .terms {
      text-align: center;
      font-size: 1.4rem;
      color: black;
      text-decoration: underline;
    }
  }
  .LoginStatePopContentView {
    height: 30rem;
    width: 35.1rem;
    margin: 0 auto;
    background: #fff8d4;
    border-top-left-radius: 2.5rem;
    border-top-right-radius: 2.5rem;
    border: var(--default-black) 0.4rem solid;
    border-bottom: 0;
    box-sizing: content-box;
    position: relative;
    text-align: left;
    .topItem {
      width: 29.7rem;
      height: 2.4rem;
      font-size: 2rem;
      font-weight: 900;
      line-height: 2.4rem;
      color: var(--default-black);
      display: flex;
      justify-content: space-between;
      margin: 2.1rem auto 1rem;
    }
    .contentItem {
      width: 29.5rem;
      height: 6rem;
      display: flex;
      border-radius: 2rem;
      border: 0.2rem solid var(--default-black);
      padding: 1rem 2rem;
      background-color: #fff;
      color: var(--default-black);
      font-size: 1.8rem;
      font-weight: 500;
      margin: 2rem auto;
      align-items: center;
      position: relative;
      .right {
        position: absolute;
        right: 1rem;
        font-size: 1.4rem;
      }
    }
  }
}
@media screen and (min-width: 5000px) {
  .BottomNav {
    position: relative;
    margin: 0 auto;
    max-width: 128rem;
    margin-bottom: 0;
  }
  .bottom {
    -webkit-box-pack: justify;
    justify-content: space-between;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    position: relative;
    padding-left: 6.7%;
    padding-right: 6.7%;
    width: 100%;
    color: #d4d4d4;
  }

  .bottomLogo {
    width: 26px;
    display: flex;
  }

  .bottomContent {
    float: right;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    flex-direction: row;
  }

  .bottomSep {
    width: 1px;
    height: 1.25rem;
    background: #d4d4d4;
    margin-left: 1rem;
  }

  .github {
    transition: all 0.25s ease 0s;
    padding-bottom: 2px;
  }

  .githunbIcon {
    width: 1em;
    height: 1em;
    display: inline-block;
    line-height: 1em;
    flex-shrink: 0;
    color: gray;
    vertical-align: middle;
  }
}
</style>
