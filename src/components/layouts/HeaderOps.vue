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
      <span @click="openAct" class="ops-item" style="position: relative">
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
              :src="require('../../assets/activity/point.png')"
          />
          {{ totalPoint }} O-Points
          <div v-if="!isMobile" :class="addPointVisible ? 'shake-top' : ''" :style="`display: flex;position: absolute;top: 45px;left:-3px;opacity: ${addPointVisible ? 1 : 0};transition: opacity 0.5s ease-in-out;`">
              <img
                  class="label_2"
                  referrerpolicy="no-referrer"
                  :src="require('../../assets/activity/add_flower.png')"
              />
              <span class="text_2">
                {{ addPoint }} O-Points
              </span>
              <img
                  class="thumbnail_1"
                  referrerpolicy="no-referrer"
                  :src="require('../../assets/activity/add_flower_2.png')"
              />
          </div>
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
    actAddPointVisible,
    actAddPoint,
    transferDataState,
    isMobile,
    setStarkNetDialog,
    setSelectWalletDialogVisible,
    starkAddress,
    showAddress,
    saveSenderPageWorkingState,
    setActDialogVisible,
    setActAddPointVisible,
    setActAddPoint,
    updateActDataList,
    actDialogVisible,
    actTotalPoint,
    setActPoint,
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
        // setSelectWalletDialogVisible(true)
        setActDialogVisible(true);
      },
      connectAWallet() {
        setStarkNetDialog(false)
        if (this.isLogin) {
          setActDialogVisible(true);
        } else {
          setSelectWalletDialogVisible(true);
        }
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
      async getWalletAddressPoint(address) {
        if (util.getAccountAddressError(address)) {
          return;
        }
        const pointRes = await requestPointSystem('v2/user/points', {
          address
        });
        const point = pointRes.data.total;
        setActPoint(pointRes.data);
        if (point) {
          setActAddPoint(String(point));
          setActAddPointVisible(true);
          setTimeout(() => {
            setActAddPointVisible(false);
          }, 3000);
        }
      },
      async getWalletAddressActList(address) {
        if (util.getAccountAddressError(address)) {
          return;
        }
        const res = await requestPointSystem('v2/activity/list', {
          address,
          pageSize: 10,
          page: 1
        });
        const list = res.data.list;
        const dataList = [];
        const undoneList = [];
        const doneList = [];
        for (const data of list) {
          for (const task of data.taskList) {
            if (task.status) {
              doneList.push(task);
            } else {
              undoneList.push(task);
            }
          }
        }
        dataList.push(...undoneList);
        dataList.push(...doneList);
        updateActDataList(dataList);
        return dataList;
      }
    },
    async mounted() {
      const _this = this;
      setInterval(async () => {
        if (!this.$store.state.proceeding.makerTransfer.txid) return;
        const address = compatibleGlobalWalletConf.value.walletPayload.walletAddress;
        if (address && address !== '0x') {
          const pointRes = await requestPointSystem('v2/user/points', {
            address
          });
          const point = pointRes.data.total;
          if (addressPointMap[address.toLowerCase()] === undefined) {
            addressPointMap[address.toLowerCase()] = point;
          }
          if (point > addressPointMap[address.toLowerCase()]) {
            setActAddPoint(`+${point - addressPointMap[address.toLowerCase()]}`);
            setActAddPointVisible(true);
            addressPointMap[address.toLowerCase()] = point;
            setTimeout(() => {
              _this.getWalletAddressActList(address);
              setActAddPointVisible(false);
            }, 3000);
          }
          setActPoint(pointRes.data);
        }
      }, 5000);

      const walletAddress = await util.getAsyncWalletAddress();
      this.getWalletAddressPoint(walletAddress);
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
