<template>
  <div
          class="header-ops"
          :style="`flex-direction: ${verical ? 'column' : 'row'};`"
  >
    <CommBtn
            ref="connectBtn"
            v-if="!isLogin && !isMobile && $route.path !== '/home'"
            @click="connectAWallet"
            class="ops-item not-mode"
            style="margin-right: 10px"
    >Connect a Wallet</CommBtn
    >
    <template v-if="isLogin && $route.path !== '/home'">
      <span @mouseover="openAct" @click="openAct" class="ops-item" style="position: relative">
          <img
              :hidden="!isLightMode"
              style="margin: -3px 0 0 0;width: 24px;"
              referrerpolicy="no-referrer"
              :src="require('../../assets/activity/point.png')"
          />
          <img
              :hidden="isLightMode"
              style="margin: -3px 0 0 0;width: 24px;"
              referrerpolicy="no-referrer"
              :src="require('../../assets/activity/point_dark.png')"
          />
          {{ totalPoint }} O-Points
          <div :class="addPointVisible ? 'shake-top' : ''" :style="`display: flex;position: absolute;top: 45px;left:-3px;opacity: ${addPointVisible ? 1 : 0};transition: opacity 0.5s ease-in-out;`">
              <img
                  class="label_2"
                  referrerpolicy="no-referrer"
                  :src="require('../../assets/activity/add_flower.png')"
              />
              <span class="text_2">
                +{{ addPoint }} O-Points
              </span>
              <img
                  class="thumbnail_1"
                  referrerpolicy="no-referrer"
                  :src="require('../../assets/activity/add_flower_2.png')"
              />
          </div>
<!--          <div :style="`position: absolute;top: 45px;left: 5px;opacity: ${addPointVisible ? 1 : 0};transition: opacity 0.5s ease-in-out;`">-->
<!--              <img-->
<!--                  class="image_1"-->
<!--                  referrerpolicy="no-referrer"-->
<!--                  src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng8af34a7c5a97eec2d0a05016c25c9d0c9b76e03ade2967e2dab489946016f34a"-->
<!--              />-->
<!--              <span class="text_2">-->
<!--                +{{ addPoint }} O-Points-->
<!--              </span>-->
<!--          </div>-->
      </span>
      <span @click="showHistory" class="ops-item">History</span>
      <div
              v-if="isSelectedStarkNet"
              ref="connectedStarkNetBtn"
              @click="connectStarkNetWallet"
              class="ops-item center"
              style="display: inline-flex"
      >
        <svg-icon
                style="width: 2rem; height: 2rem"
                iconName="sknlogo"
        ></svg-icon>
        <span class="address">{{
                    starkAddress === 'not connected'
                        ? 'connect starknet'
                        : starkAddress
                }}</span>
      </div>
      <div
              ref="connectedBtn"
              @click="connectAWallet"
              class="ops-item center"
              style="display: inline-flex"
      >
        <svg-icon
                style="width: 2rem; height: 2rem"
                :iconName="
                        globalSelectWalletConf.walletType &&
                        globalSelectWalletConf.walletType.toLowerCase()
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
  import { mapMutations } from 'vuex'
  import { CommBtn, SvgIconThemed } from '../'
  import {
    transferDataState,
    isMobile,
    setStarkNetDialog,
    setSelectWalletDialogVisible,
    starkAddress,
    showAddress,
    saveSenderPageWorkingState, setActDialogVisible, updateActDataList,
  } from '../../composition/hooks';
  import {
    compatibleGlobalWalletConf,
    walletIsLogin,
  } from '../../composition/walletsResponsiveData'
  import { connectStarkNetWallet } from '../../util/constants/starknet/helper.js'
  import { CHAIN_ID } from "../../config";
  import { requestPointSystem } from "../../common/openApiAx";
  import util from "../../util/util";
  const addressPointMap = {};
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
      currentWalletAddress() {
        return compatibleGlobalWalletConf.value.walletPayload.walletAddress;
      },
      isMobile() {
        return isMobile.value
      },
      isLightMode () {
        return this.$store.state.themeMode === 'light'
      },
      globalSelectWalletConf() {
        return compatibleGlobalWalletConf.value
      },
      isLogin() {
        return walletIsLogin.value
      },
      isSelectedStarkNet() {
        return (
                transferDataState.fromChainID === CHAIN_ID.starknet ||
                transferDataState.fromChainID === CHAIN_ID.starknet_test ||
                transferDataState.toChainID === CHAIN_ID.starknet ||
                transferDataState.toChainID === CHAIN_ID.starknet_test
        )
      },
      starkAddress() {
        return starkAddress()
      },
      showAddress() {
        return showAddress()
      },
    },
    data() {
      const selectedWallet = JSON.parse(
              localStorage.getItem('selectedWallet') || '{}'
      )
      return {
        addPoint: 0,
        addPointVisible: false,
        totalPoint: 0,
        selectedWallet,
      }
    },
    methods: {
      ...mapMutations(['toggleThemeMode']),
      openAct() {
        setActDialogVisible(true)
        this.$emit('closeDrawer')
      },
      async connectStarkNetWallet() {
        if (this.starkAddress === 'not connected') {
          await connectStarkNetWallet()
          return
        }
        setStarkNetDialog(true)
        setSelectWalletDialogVisible(true)
      },
      connectAWallet() {
        setStarkNetDialog(false)
        setSelectWalletDialogVisible(true)
        this.$emit('closeDrawer')
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
      async getWalletAddressPoint(address, callback) {
        if (util.getAccountAddressError(address)) {
          return;
        }
        const pointRes = await requestPointSystem('user/points', {
          address
        });
        this.totalPoint = pointRes.data.points;
        callback(pointRes.data.points);
      },
      async getWalletAddressActList(address) {
        if (util.getAccountAddressError(address)) {
          return;
        }
        const res = await requestPointSystem('activity/list', {
          address,
          pageSize: 10,
          page: 1
        });
        const list = res.data.list;
        const dataList = [];
        for (const data of list) {
          dataList.push(...data.taskList);
        }
        updateActDataList(dataList);
      }
    },
    watch: {
      currentWalletAddress: function (newValue, oldValue) {
        if (oldValue !== newValue && newValue !== '0x') {
          const _this = this;
          this.getWalletAddressPoint(newValue, function (point) {
            if (point) {
              _this.addPointVisible = true;
              _this.addPoint = point;
              setTimeout(() => {
                _this.addPointVisible = false;
              }, 3000);
            }
          });
          this.getWalletAddressActList(newValue);
        }
      },
    },
    async mounted() {
      const _this = this;
      this.getWalletAddressPoint(compatibleGlobalWalletConf.value.walletPayload.walletAddress);
      if (!isMobile.value) {
        setInterval(async () => {
          const address = compatibleGlobalWalletConf.value.walletPayload.walletAddress;
          if (address && address !== '0x') {
            const pointRes = await requestPointSystem('user/points', {
              address
            });
            const point = pointRes.data.points;
            addressPointMap[address.toLowerCase()] = addressPointMap[address.toLowerCase()] || point;
            if (point > addressPointMap[address.toLowerCase()]) {
              _this.addPoint = `+${point - addressPointMap[address.toLowerCase()]}`;
              _this.getWalletAddressActList(compatibleGlobalWalletConf.value.walletPayload.walletAddress);
              _this.addPointVisible = true;
              addressPointMap[address.toLowerCase()] = point;
              setTimeout(() => {
                _this.addPointVisible = false;
              }, 3000);
            }
            this.totalPoint = point;
          }
        }, 5000);
      }
    }
  }
</script>

<style scoped lang="scss">
    .shake-top {
        -webkit-animation: shake-top 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
        animation: shake-top 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
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
        font-family: OpenSansRoman-ExtraBold;
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
