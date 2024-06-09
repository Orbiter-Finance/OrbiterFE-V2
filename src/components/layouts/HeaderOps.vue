<template>
  <div
    class="header-ops"
    :style="`flex-direction: ${verical ? 'column' : 'row'};`"
  >
    <CommBtn
      ref="connectBtn"
      v-if="
        !isLogin &&
        !isMobile &&
        $route.path !== '/home' &&
        $route.path !== '/statistics'
      "
      @click="connectAWallet"
      class="ops-item not-mode"
      style="margin-right: 10px"
      >Connect a Wallet</CommBtn
    >
    <template
      v-if="isLogin && $route.path !== '/home' && $route.path !== '/statistics'"
    >
      <div class="lucky-bag-tab" @click="openLuckyBagModal">
        <div class="lucky-bag-image"></div>
        <div v-if="isTimeOut" class="tiem-out">
          <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="16.000000"
          height="16.000000"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            id="Vector"
            d="M7.99 14.66C4.31 14.66 1.33 11.67 1.33 8C1.33 4.31 4.31 1.33 7.99 1.33C11.67 1.33 14.66 4.31 14.66 8C14.66 11.67 11.67 14.66 7.99 14.66Z"
            stroke="#292D32"
            stroke-opacity="2"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <path
            id="Vector"
            d="M10.47 10.12L8.4 8.88C8.04 8.67 7.75 8.16 7.75 7.74L7.75 5"
            stroke="#292D32"
            stroke-opacity="2"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
          <g opacity="0.000000" />
        </svg>
          <div class="time-group" v-for="item in timeList" :key="item.symbol">
            <div class="time-value">{{ item.value }}</div>
            <div class="time-symbol">{{ item.symbol }}</div>
          </div>
        </div>
        <div v-else class="lucky-bag-info">
          <div class="info-label">Grab {{ maxGrantRatio }}% $ORBGUY</div>
          <div class="info-progress">
            <div
              class="progress"
              :style="{
                width:
                  Number(ratio) >= 100 ? '100%' : decimalNumC(ratio, 3) + '%',
              }"
            >
              <div class="skeleton"></div>
            </div>
          </div>
        </div>
      </div>
      <span @click="openAct" class="ops-item" style="position: relative">
        <img
          :hidden="!isLightMode"
          style="margin: -3px 0 0 0; width: 24px"
          referrerpolicy="no-referrer"
          :src="require('../../assets/activity/point.png')"
        />
        <img
          :hidden="isLightMode"
          style="margin: -3px 0 0 0; width: 24px"
          referrerpolicy="no-referrer"
          :src="require('../../assets/activity/point.png')"
        />
        {{ totalPoint }} O-Points
        <div
          v-if="!isMobile"
          :class="addPointVisible ? 'shake-top' : ''"
          :style="`display: flex;position: absolute;top: 45px;left:-3px;opacity: ${
            addPointVisible ? 1 : 0
          };transition: opacity 0.5s ease-in-out;`"
        >
          <img
            class="label_2"
            referrerpolicy="no-referrer"
            :src="require('../../assets/activity/add_flower.png')"
          />
          <span class="text_2"> {{ addPoint }} O-Points </span>
          <img
            class="thumbnail_1"
            referrerpolicy="no-referrer"
            :src="require('../../assets/activity/add_flower_2.png')"
          />
        </div>
      </span>
      <span @click="showHistory" class="ops-item">History</span>
      <div
        v-if="isSelectedStarkNet || isSelectedSolana || isSelectedTon"
        ref="connectedStarkNetBtn"
        @click="connectStarkNetWallet"
        class="ops-item center"
        style="display: inline-flex"
      >
        <svg-icon
          style="width: 2rem; height: 2rem"
          :iconName="connectWalletIcon"
        ></svg-icon>
        <span class="address">{{ connectAddress }}</span>
      </div>
      <div
        ref="connectedBtn"
        @click="connectAWallet"
        class="ops-item center"
        style="display: inline-flex"
      >
        <svg-icon
          style="width: 2rem; height: 2rem"
          :iconName="connectFirstWalletIcon"
        ></svg-icon>
        <span class="address">{{ connectFirstAddress }}</span>
      </div>
    </template>
    <div @click="toggleThemeMode" class="ops-mode">
      <SvgIconThemed class="mode-icon" icon="mode" />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { CommBtn, SvgIconThemed } from '../'
import {
  actAddPointVisible,
  actAddPoint,
  isMobile,
  setStarkNetDialog,
  setSelectWalletDialogVisible,
  starkAddress,
  solAddress,
  tonAddress,
  showAddress,
  saveSenderPageWorkingState,
  setActDialogVisible,
  setActAddPointVisible,
  setActAddPoint,
  isStarkNetDialog,
  isSolanaDialog,
  actDialogVisible,
  actTotalPoint,
  setActPoint,
  web3State,
  updateActDataList,
  setLotteryCardTotal,
  setLotteryCardProgress,
  transferDataState,
  setConnectWalletGroupKey,
  setSolanaDialog,
  isTonDialog,
  setTonDialog,
  claimCardModalAmountInfo,
  claimCardModalDataInfo,
} from '../../composition/hooks'
import {
  compatibleGlobalWalletConf,
  walletIsLogin,
} from '../../composition/walletsResponsiveData'
import { connectStarkNetWallet } from '../../util/constants/starknet/helper.js'
import { CHAIN_ID } from '../../config'
import { requestPointSystem, requestLotteryCard } from '../../common/openApiAx'
import util from '../../util/util'
import solanaHelper from '../../util/solana/solana_helper'
import tonHelper from '../../util/ton/ton_helper'
import { decimalNum } from '../../util/decimalNum'
import getUTCTime from '../../util/time'
import { ethers } from 'ethers'

let timer1

const addressPointMap = {}
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
    claimCardModalAmountInfoData() {
      return claimCardModalAmountInfo.value
    },
    claimCardModalDataInfoData() {
      return claimCardModalDataInfo.value
    },
    isTimeOut() {
      return !!Number(this?.claimCardModalAmountInfoData?.activityTime)
    },
    ratio() {
      const { ratio } = this.claimCardModalAmountInfoData || {}
      if (!Number(ratio)) return 0

      return ratio
    },
    maxGrantRatio() {
      const { max } =  claimCardModalAmountInfo.value || {}

      return ethers.utils.parseEther(max ? String(max) : "0").mul("100").div(ethers.utils.parseEther("20000000")).toString()
    },
    addPoint() {
      return actAddPoint.value
    },
    totalPoint() {
      return actTotalPoint.value
    },
    addPointVisible() {
      return actAddPointVisible.value && !actDialogVisible.value
    },
    isMobile() {
      return isMobile.value
    },
    selectWalletDialogVisible() {
      return actDialogVisible.value
    },
    isLightMode() {
      return this.$store.state.themeMode === 'light'
    },
    globalSelectWalletConf() {
      return compatibleGlobalWalletConf.value
    },
    isLogin() {
      return (
        walletIsLogin.value ||
        this.isSelectedStarkNet ||
        this.isSelectedSolana ||
        this.isSelectedTon
      )
    },
    isSelectedStarkNet() {
      const { toChainID, fromChainID } = transferDataState
      return (
        fromChainID === CHAIN_ID.starknet ||
        fromChainID === CHAIN_ID.starknet_test ||
        toChainID === CHAIN_ID.starknet ||
        toChainID === CHAIN_ID.starknet_test
      )
    },
    isSelectedSolana() {
      const { fromChainID, toChainID } = transferDataState
      return (
        fromChainID === CHAIN_ID.solana ||
        fromChainID === CHAIN_ID.solana_test ||
        toChainID === CHAIN_ID.solana ||
        toChainID === CHAIN_ID.solana_test
      )
    },
    isSelectedTon() {
      const { fromChainID, toChainID } = transferDataState
      return (
        fromChainID === CHAIN_ID.ton ||
        fromChainID === CHAIN_ID.ton_test ||
        toChainID === CHAIN_ID.ton ||
        toChainID === CHAIN_ID.ton_test
      )
    },
    starkAddress() {
      return starkAddress()
    },
    solanaAddress() {
      return solAddress()
    },
    tAddress() {
      return tonAddress()
    },
    showAddress() {
      return showAddress()
    },
    otherAddress() {
      return [
        {
          address: this.tAddress,
          isSelected: this.isSelectedTon,
          connect: async () => {
            await tonHelper.connect()
          },
          open: () => {
            setSolanaDialog(false)
            setStarkNetDialog(false)
            setTonDialog(true)
          },
          icon: CHAIN_ID.ton,
        },
        {
          address: this.solanaAddress,
          isSelected: this.isSelectedSolana,
          connect: () => {
            setConnectWalletGroupKey('SOLANA')
            setSelectWalletDialogVisible(true)
          },
          open: () => {
            setSolanaDialog(true)
            setStarkNetDialog(false)
            setTonDialog(false)
          },
          icon: solanaHelper.readWalletName() || CHAIN_ID.solana,
        },
        {
          address: this.starkAddress,
          isSelected: this.isSelectedStarkNet,
          connect: () => {
            setConnectWalletGroupKey('STARKNET')
            setSelectWalletDialogVisible(true)
          },
          open: () => {
            setStarkNetDialog(true)
            setSolanaDialog(false)
            setTonDialog(false)
          },
          icon: CHAIN_ID.starknet,
        },
      ]
    },
    connectFirstWalletIcon() {
      const first = this.otherAddress.findIndex((item) => !!item.isSelected) + 1
      const firstGroup = this.otherAddress
        .slice(first)
        .filter((item) => !!item.isSelected)[0]
      return (
        firstGroup?.icon ||
        (this.globalSelectWalletConf.walletType
          ? this.globalSelectWalletConf.walletType.toLowerCase()
          : '')
      )
    },
    connectWalletIcon() {
      return (
        this.otherAddress.filter((item) => !!item.isSelected)[0]?.icon ||
        (this.globalSelectWalletConf.walletType
          ? this.globalSelectWalletConf.walletType.toLowerCase()
          : '')
      )
    },
    connectFirstAddress() {
      const first = this.otherAddress.findIndex((item) => !!item.isSelected) + 1
      const firstGroup = this.otherAddress
        .slice(first)
        .filter((item) => !!item.isSelected)[0]
      return firstGroup?.address || this.showAddress
    },
    connectAddress() {
      const option = this.otherAddress.filter((item) => item.isSelected)[0]
      const address = option?.address || 'Connect Wallet'
      return address
    },
    currentWalletAddress() {
      return [
        compatibleGlobalWalletConf.value.walletPayload.walletAddress?.toLocaleLowerCase(),
        web3State.starkNet.starkNetAddress?.toLocaleLowerCase(),
        solanaHelper.solanaAddress(),
        tonHelper.account(),
        ...[],
      ]
    },
  },
  data() {
    const selectedWallet = JSON.parse(
      localStorage.getItem('selectedWallet') || '{}'
    )
    return {
      selectedWallet,
      recaptchaId: 0,
      timeList: [],
    }
  },
  watch: {
    selectWalletDialogVisible: function (newVisible) {
      if (!!newVisible) {
        // this.getWalletAddressPoint()
      }
    },
  },
  methods: {
    ...mapMutations(['toggleThemeMode']),
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
    async openLuckyBagModal() {
      const { activityTime, ratio } = this.claimCardModalAmountInfoData || {}
      const { data } = this.claimCardModalDataInfoData || {}
      if(!this.claimCardModalAmountInfoData || !this.claimCardModalDataInfoData) return
      if((!Number(activityTime) ||!(Number(ratio) - 100)) && !data?.length) {
        util.showMessage(
        `😭 Oops, sorry! All gone! Catch us earlier next time!`,
        'error'
      )
        return
      }
      if (process.env['VUE_APP_RECAPTCHA']) {
        const recaptchaDiv = document.createElement('div')
        recaptchaDiv.id = 'recaptcha-outside-badge'
        this.$el.insertBefore(recaptchaDiv, this.$el.childNodes[0])
        this.recaptchaId = grecaptcha.render(recaptchaDiv, {
          sitekey: process.env['VUE_APP_RECAPTCHA'],
          theme: 'light',
          callback: (token) => {
            this.$store.commit('getClaimORBGUYRewardData', {
              type: 'LUCKY_BAG',
              token,
            })
            recaptchaDiv.remove()
          },
        })
        recaptchaDiv.onclick = () => {
          recaptchaDiv.remove()
        }
      } else {
        this.$store.commit('getClaimORBGUYRewardData', {
              type: 'LUCKY_BAG',
              token: "",
            })
      }
    },
    openAct() {
      setActDialogVisible(true)
      this.$emit('closeDrawer')
    },
    async connectStarkNetWallet() {
      const option = this.otherAddress.filter((item) => item.isSelected)[0]
      const isConnect =
        option?.address &&
        option?.address !== 'Connect Wallet' &&
        option?.address !== 'not connected'

      if (isConnect) {
        option.open()
        setActDialogVisible(true)
      } else {
        await option.connect()
      }
    },
    async connectAWallet() {
      const evm = {
        address: this.showAddress,
        connect: async () => {
          setConnectWalletGroupKey('EVM')
          setSelectWalletDialogVisible(true)
        },
        open: () => {
          setTonDialog(false)
          setSolanaDialog(false)
          setStarkNetDialog(false)
          setActDialogVisible(true)
        },
      }
      const first = this.otherAddress.findIndex((item) => !!item.isSelected) + 1
      const firstGroup =
        this.otherAddress.slice(first).filter((item) => !!item.isSelected)[0] ||
        evm
      const isConnect =
        firstGroup?.address &&
        firstGroup?.address !== 'Connect Wallet' &&
        firstGroup?.address !== 'not connected'
      if (isConnect) {
        firstGroup.open()
        setActDialogVisible(true)
      } else {
        await firstGroup.connect()
      }
    },
    showHistory() {
      this.$emit('closeDrawer')

      const route = this.$route
      route.path !== '/history' &&
        localStorage.setItem(
          'last_page_before_history',
          JSON.stringify({
            path: route.path,
            params: route.params,
            query: route.query,
          })
        )
      if (route.path === '/') {
        saveSenderPageWorkingState()
      }
      route.path !== '/history' &&
        this.$router.push({
          path: '/history',
        })
    },
    getAddress() {
      let addressGroup = {
        isAddress: false,
        address: '',
      }
      const [web3Address, starkNetAddress] = this.currentWalletAddress
      const solanaAddress = solanaHelper.solanaAddress()
      const tonAddress = tonHelper.account()
      const address =
        !!isTonDialog.value && tonAddress
          ? tonAddress
          : !!isSolanaDialog.value && solanaAddress
          ? solanaAddress
          : !!isStarkNetDialog.value
          ? starkNetAddress
          : web3Address
      const isStarknet = !!isStarkNetDialog.value
      if (
        !address ||
        (!isSolanaDialog.value &&
          util.getAccountAddressError(address || '', isStarknet))
      ) {
        return addressGroup
      }
      return {
        ...addressGroup,
        isAddress: true,
        address,
      }
    },
    async getWalletAddressPoint() {
      const { isAddress, address } = this.getAddress()
      const [_web3Address, starkNetAddress] = this.currentWalletAddress

      const tonAddress = tonHelper.account()
      const solanaAddress = solanaHelper.solanaAddress()

      if (isAddress) {
        const pointRes = await requestPointSystem('v2/user/points', {
          address,
        })
        const point = pointRes.data.total
        setActPoint(pointRes.data)
        if (point) {
          if (tonAddress) {
            setTonDialog(true)
            setActDialogVisible(true)
          } else if (solanaAddress) {
            setSolanaDialog(true)
            setActDialogVisible(true)
          } else if (starkNetAddress) {
            setStarkNetDialog(true)
            setActDialogVisible(true)
          }
          setTimeout(() => {
            setActAddPoint(String(point || ''))
            setActAddPointVisible(true)
            setTimeout(() => {
              setActAddPointVisible(false)
            }, 3000)
          }, 100)
        }
      }
    },
    async getWalletAddressActList() {
      const { isAddress, address } = this.getAddress()

      if (isAddress) {
        const res = await requestPointSystem('v2/activity/list', {
          address,
          pageSize: 10,
          page: 1,
        })
        const list = res.data.list
        // const dataList = []
        // const undoneList = []
        // const doneList = []
        // for (const data of list) {
        //   for (const task of data.taskList) {
        //     if (task.status) {
        //       doneList.push(task)
        //     } else {
        //       undoneList.push(task)
        //     }
        //   }
        // }
        // dataList.push(...undoneList)
        // dataList.push(...doneList)
        updateActDataList(list)
      }
    },

    async getLotteryCardData() {
      const { isAddress, address } = this.getAddress()

      if (isAddress) {
        const {
          data: { cardsCount = 0, progress },
          code,
        } = await requestLotteryCard('user/cards', {
          address: address,
        })

        if (Number(code) === 0) {
          setLotteryCardTotal(cardsCount)
          setLotteryCardProgress({
            lotteryCardCurrentProgress: progress.currentProgress || 0,
            lotteryCardProgressMax: progress.max || 0,
          })
        }
      }
    },
  },
  created() {
    if (process.env['VUE_APP_RECAPTCHA']) {

      if (typeof window === 'undefined') return
      window.vueRecaptchaInit = () => {}
      const recaptchaScript = document.createElement('script')
      const language = this.dataLanguage ? `&hl=${this.dataLanguage}` : ''
      recaptchaScript.setAttribute(
        'src',
        `https://www.google.com/recaptcha/api.js?onload=vueRecaptchaInit&render=explicit${language}`
      )
      recaptchaScript.setAttribute('async', '')
      recaptchaScript.setAttribute('defer', '')
      ;(document.body || document.head).appendChild(recaptchaScript)
    }
  },
  async mounted() {
    const _this = this
    setInterval(async () => {
      if (!this.$store.state.proceeding.makerTransfer.txid) return
      const { address } = this.getAddress()

      if (address && address !== '0x') {
        const pointRes = await requestPointSystem('v2/user/points', {
          address,
        })
        const point = pointRes.data.total
        if (addressPointMap[address.toLowerCase()] === undefined) {
          addressPointMap[address.toLowerCase()] = point
        }
        if (point > addressPointMap[address.toLowerCase()]) {
          setActAddPoint(`+${point - addressPointMap[address.toLowerCase()]}`)
          setActAddPointVisible(true)
          addressPointMap[address.toLowerCase()] = point
          setTimeout(() => {
            _this.getWalletAddressActList()
            setActAddPointVisible(false)
          }, 3000)
        }
        setActPoint(pointRes.data)
        this.getLotteryCardData()
      }
    }, 5000)


    timer1 = setInterval(() => {
      const t = this?.claimCardModalAmountInfoData?.activityTime || 0
      console.log("t", t)
      const timeS = Math.floor(t - getUTCTime() / 1000)
      let time = timeS
      if (timeS <= 0) {
        clearInterval(timer1)
        this.timeList = [
          {
            value: '00',
            symbol: 'D',
          },
          {
            value: '00',
            symbol: 'H',
          },
          {
            value: '00',
            symbol: 'M',
          },
          {
            value: '00',
            symbol: 'S',
          },
        ]
        return
      }
      let d = Math.floor(time / 3600 / 24)
      time -= d * 3600 * 24
      d = d < 0 ? 0 : d
      d = d < 10 ? '0' + d : d
      let h = Math.floor(time / 3600)
      time -= h * 3600
      h = h < 0 ? 0 : h
      h = h < 10 ? '0' + h : h
      let m = Math.floor(time / 60)
      time -= m * 60
      m = m < 0 ? 0 : m
      m = m < 10 ? '0' + m : m
      const s = time < 10 ? '0' + time : time

      this.timeList = [
        {
          value: d,
          symbol: 'D',
        },
        {
          value: h,
          symbol: 'H',
        },
        {
          value: m,
          symbol: 'M',
        },
        {
          value: s,
          symbol: 'S',
        },
      ]
    }, 1000)
    // const walletAddress = await util.getAsyncWalletAddress();
    // this.getWalletAddressPoint()
  },
}
</script>

<style scoped lang="scss">
.shake-top {
  -webkit-animation: shake-top 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
  animation: shake-top 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
}
@-webkit-keyframes shake-top {
  0%,
  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transform-origin: 50% 0;
    transform-origin: 50% 0;
  }
  10% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
  20%,
  40%,
  60% {
    -webkit-transform: rotate(-4deg);
    transform: rotate(-4deg);
  }
  30%,
  50%,
  70% {
    -webkit-transform: rotate(4deg);
    transform: rotate(4deg);
  }
  80% {
    -webkit-transform: rotate(-2deg);
    transform: rotate(-2deg);
  }
  90% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
}
@keyframes shake-top {
  0%,
  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    -webkit-transform-origin: 50% 0;
    transform-origin: 50% 0;
  }
  10% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
  20%,
  40%,
  60% {
    -webkit-transform: rotate(-4deg);
    transform: rotate(-4deg);
  }
  30%,
  50%,
  70% {
    -webkit-transform: rotate(4deg);
    transform: rotate(4deg);
  }
  80% {
    -webkit-transform: rotate(-2deg);
    transform: rotate(-2deg);
  }
  90% {
    -webkit-transform: rotate(2deg);
    transform: rotate(2deg);
  }
}

.text_2 {
  width: 105px;
  height: 24px;
  overflow-wrap: break-word;
  color: rgba(30, 180, 171, 1);
  font-size: 18px;
  font-family: GeneralSans-Medium;
  text-align: right;
  white-space: nowrap;
  line-height: 24px;
  margin: 5px 0 0 3px;
}

.group_6 {
  width: 161px;
  height: 29px;
  margin: 136px 0 0 1403px;
}

.label_2 {
  width: 21px;
  height: 24px;
}

.thumbnail_1 {
  width: 12px;
  height: 13px;
  margin-left: 11px;
  margin-top: 5px;
}

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

  .lucky-bag-tab {
    box-sizing: border-box;
    border: 2px solid rgb(0, 0, 0);
    border-radius: 999px;
    background: linear-gradient(
      170.35deg,
      rgb(255, 250, 236) 28.059%,
      rgb(255, 215, 104) 57.771%
    );
    padding: 4px 18px 4px 58px;
    position: relative;
    top: 0;
    left: 0;
    display: flex;
    justify-content: start;
    align-items: center;
    margin-right: 10px;
    cursor: pointer;

    .lucky-bag-image {
      position: absolute;
      bottom: -4px;
      left: -6px;
      width: 58px;
      height: 50px;
      background-image: url(../../assets/lucky-bag.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    .tiem-out {
      display: flex;
      justify-content: start;
      align-items: center;
      padding: 4px 0;
      .time-group {
        display: flex;
        justify-content: center;
        align-items: center;
        .time-value {
          font-size: 14px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: 0px;
          margin: 0 2px;
        }
        .time-symbol {
          font-family: GeneralSans-Regular;
          color: rgb(153, 153, 153);
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
        }
      }
    }

    .lucky-bag-info {
      .info-label {
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0px;
        white-space: nowrap;
      }

      .info-progress {
        width: 100%;
        height: 6px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 6px;
        margin-top: 2px;
        overflow: hidden;

        .progress {
          height: 6px;
          background: linear-gradient(
            90deg,
            rgb(223, 46, 45) 43.689%,
            rgb(255, 150, 50) 100%
          );
          border-radius: 6px;
        }

        .skeleton {
          width: 100%;
          height: 100%;
          background-image: linear-gradient(
            90deg,
            rgba(#fff, 0),
            rgba(#fff, 0.4),
            rgba(#fff, 0)
          );
          background-size: 40px 100%; // width of the shine
          background-repeat: no-repeat; // No need to repeat the shine effect
          background-position: left -40px top 0; // Place shine on the left side, with offset on the left based on the width of the shine - see background-size
          animation: shine 2s ease infinite;
        }
      }
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
    margin-top: 19px;
    .ops-item {
      width: 100%;
      margin-bottom: 30px;
    }
  }
}
</style>
