<template>
    <div
      class="act header-dialog-box"
      :style="{ display: this.selectWalletDialogVisible ? 'block' : 'none' }"
    >
      <div
        v-if="isMobile"
        @click="mobileCloseAct"
        style="width: 100%; height: 100%"
      ></div>
  
      <div v-if="!isMobile" style="position: absolute; width: 100%; height: 100%">
        <div
          @click="closeAct"
          @mouseover="mouseoverCloseDrawer"
          @mouseout="mouseoutCloseDrawer"
          class="close-drawer"
          :style="`opacity: ${closeDrawerOpacity};padding-left: ${closeDrawerPaddingLeft}px`"
        >
          <img class="img" :src="require('../../assets/activity/right.png')"/>
        </div>
      </div>
      <div @mouseover="mouseoverDialog" ref="block_1" class="block_1">
        <div ref="block_top_group">
          <div class="section_54">
            <div
              class="box_114"
              :style="`background-image: url(${require('../../assets/wallet/' +
                walletType +
                '.png')});background-size: 100% auto;`"
            >
              <svg-icon
                class="image-wrapper_74"
                :iconName="networkId"
                style="width: 1.6rem; height: 1.6rem"
              ></svg-icon>
            </div>
            <div class="text-wrapper_63 flex-col justify-between">
              <div class="text_96">{{ showWalletAddress }}</div>
              <div class="text_97">{{ networkName }}</div>
            </div>
            <img
              v-clipboard:copy="walletAddress"
              v-clipboard:success="onCopySuccess"
              class="label_17"
              :src="require('../../assets/activity/copy.png')"
            />
            <div style="flex: 1; display: flex; justify-content: flex-end">
              <div @click="disconnect" class="label_19">
                <img
                  :hidden="!isLightMode"
                  class="img"
                  :src="require('../../assets/activity/exit.png')"
                />
                <img
                  :hidden="isLightMode"
                  class="img"
                  :src="require('../../assets/activity/exit_dark.png')"
                />
              </div>
            </div>
          </div>
  
          <div
            class="card_2"
            :style="showDetail ? 'height: 176px;' : 'height: 120px;'"
          >
            <div class="text-wrapper_45">
              <div class="text_98">O-Points Summary</div>
              <div class="text_99">{{ totalPoint }}</div>
            </div>
            <div
              class="card_bottom"
              :style="
                showDetail
                  ? 'opacity: 1;transition: opacity 0.5s ease;'
                  : 'opacity: 0'
              "
            >
              <div class="line_1"></div>
              <div style="display: flex; justify-content: center; height: 73px">
                <div class="group_1_12">
                  <div class="box_1_48">
                    <span class="text_1_8">Basic points</span>
                    <o-tooltip >
                      <template v-slot:titleDesc>
                        <span>Basic contribution rewards for using Orbiter Finance for bridge transactions.</span>
                      </template>
                      <img
                        class="thumbnail_1_3"
                        :src="require('../../assets/activity/tip_ico.png')"
                      />
                    </o-tooltip>
                  </div>
                  <div class="text-wrapper_1_35">
                    <span class="text_1_9">{{ actBasePoint }}</span>
                  </div>
                </div>
                <div class="group_1_12">
                  <div class="box_1_48">
                    <span class="text_1_8">Activity points</span>
                    <o-tooltip>
                      <template v-slot:titleDesc>
                        <span>Task rewards for participating in Orbiter Finance-related activities.</span>
                      </template>
                      <img
                        class="thumbnail_1_3"
                        :src="require('../../assets/activity/tip_ico.png')"
                      />
                    </o-tooltip>
                  </div>
                  <div class="text-wrapper_1_35">
                    <span class="text_1_9">{{ actTotalActivityPoint }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div @click="expand" class="down">
              <img
                :hidden="showDetail"
                class="img"
                :src="require('../../assets/activity/down.png')"
              />
              <img
                :hidden="!showDetail"
                class="img"
                :src="require('../../assets/activity/up.png')"
              />
            </div>
  
            <div
              v-if="!isMobile"
              :class="addPointVisible ? 'shake-top' : ''"
              :style="`display: flex;position: absolute;bottom: 5px;left:-3px;opacity: ${
                addPointVisible ? 1 : 0
              };transition: opacity 0.5s ease-in-out;`"
            >
              <img
                class="label_2"
                :src="require('../../assets/activity/add_flower.png')"
              />
              <span class="text_1_2"> {{ addPoint }} O-Points </span>
              <img
                class="thumbnail_1_1"
                :src="require('../../assets/activity/add_flower_2.png')"
              />
            </div>
          </div>
  
          <div v-if="!isStarknet" class="card_3">
            <div class="text_14">Held Orbiter NFT</div>
            <div v-if="!nftList.length" class="text-wrapper_38">
              <span class="text_55">No Orbiter Series NFTs were obtained</span>
            </div>
            <div class="nft_box" v-else>
              <div
                class="box_div"
                :style="`transform: translateX(-${left}px);transition: transform .4s ease-in-out;`"
              >
                <div
                  v-for="(item, index) in nftList"
                  :key="index"
                  class="section_70"
                  :style="`background: url(${require('../../assets/activity/nft/' +
                    item.img)});background-size: 100% 100%;`"
                ></div>
              </div>
              <div :hidden="!turnLeft" class="btn">
                <img
                  @click="scrollDiv(1)"
                  class="img"
                  :src="require('../../assets/activity/turn_right.png')"
                />
              </div>
              <div :hidden="!turnRight" class="btn_2">
                <img
                  @click="scrollDiv(0)"
                  class="img_2"
                  :src="require('../../assets/activity/turn_right.png')"
                />
              </div>
              <div class="card_cover"></div>
            </div>
          </div>
  
          <div style="width: 100%; display: flex; height: 45px">
            <span class="text_21">🛸 Quests</span>
          </div>
        </div>
        <div
          class="card"
          :style="isStarknet ? 'height:60%;' : `height:${taskHeight}px;`"
          v-loading="listLoading"
          element-loading-background="rgba(0, 0, 0, 0)"
          @scroll="itemScroll"
        >
          <div
            class="box_1 box_1_top"
            style="margin-top: 0; cursor: pointer"
            @click="
              openUrl('https://galxe.com/OrbiterFinance/campaign/GCbnmUNe9g')
            "
          >
            <div class="box_1_hot">🔥</div>
            <div
              style="
                width: 82px;
                border-radius: 8px;
                margin-top: 12px;
                display: flex;
                justify-content: center;
              "
            >
              <el-carousel
                :interval="4000"
                indicator-position="none"
                type="card"
                height="64px"
                style="width: 72px"
                arrow="never"
              >
                <el-carousel-item v-for="(item, index) in nftSeries" :key="index">
                  <img
                    style="max-width: 100%; height: auto"
                    :src="require('../../assets/activity/nft/' + item.img)"
                  />
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="border-dashed"></div>
            <div
              style="
                font-size: 12px;
                font-family: OpenSansRoman-SemiBold;
                position: absolute;
                left: 100px;
                top: 13px;
              "
            >
              <div class="text_1_3">
                Orbiter's ONLY official Pilot NFT Series
                <SvgIconThemed v-if="true" size="lg" style="rotate: -90deg;"/>
              </div>
              <div class="text_2_3">
                Early Loyalty Identification for TOP Users
              </div>
              <div style="margin-top: 7px; display: flex; flex-direction: row">
                <div class="text-wrapper_1_17">
                  <span class="text_27">Deadline Countdown</span>
                </div>
                <div class="text-wrapper_1_46" style="margin-left: 5px">
                  <span class="text_1_69">{{ countDownDate }}</span>
                </div>
                :
                <div class="text-wrapper_1_46">
                  <span class="text_1_69">{{ countDownHour }}</span>
                </div>
                :
                <div class="text-wrapper_1_46">
                  <span class="text_1_69">{{ countDownMin }}</span>
                </div>
                :
                <div class="text-wrapper_1_46">
                  <span class="text_1_69">{{ countDownSecond }}</span>
                </div>
              </div>
            </div>
            <img
              :hidden="!isLightMode"
              class="thumbnail_1"
              referrerpolicy="no-referrer"
              :src="require('../../assets/activity/curve_up.png')"
            />
            <img
              :hidden="!isLightMode"
              class="thumbnail_2"
              referrerpolicy="no-referrer"
              :src="require('../../assets/activity/curve_down.png')"
            />
            <img
              :hidden="isLightMode"
              class="thumbnail_5"
              referrerpolicy="no-referrer"
              :src="require('../../assets/activity/curve_up_dark.png')"
            />
            <img
              :hidden="isLightMode"
              class="thumbnail_6"
              referrerpolicy="no-referrer"
              :src="require('../../assets/activity/curve_down_dark.png')"
            />
          </div>
          <template v-for="item in actDataList">
            <div
              v-if="item.status === 0"
              class="box_1"
              >
              <div class="text-wrapper_1 flex-row">
                <span class="text_1">{{ item.points }}</span>
                <span class="text_2">O-Points</span>
              </div>
              <div class="border-dashed"></div>
              <div
                style="
                  font-size: 12px;
                  font-family: OpenSansRoman-SemiBold;
                  position: absolute;
                  left: 100px;
                  top: 13px;
                "
              >
                <div class="text_3">
                  {{ item.description }}
                </div>
                <div style="margin-top: 10px; display: flex; flex-direction: row">
                  <div v-for="tag in item.tags" class="text-wrapper_17 flex-col">
                    <span class="text_27">{{ tag.description }}</span>
                  </div>
                  <div class="text-wrapper_18">
                    <span class="text_28" v-if="!!item.progress">{{
                      item.progress
                        ? `${item.progress.current}/${item.progress.total}`
                        : '0/0'
                    }}</span>
                    <span v-else class="text_28">Undone</span>
                  </div>
                  <div class="text_5">
                  {{ formatTime2(item.conditions.startTime) }} - {{ formatTime2(item.conditions.endTime) }}
                  </div>
                </div>
              </div>
              <img
                :hidden="!isLightMode"
                class="thumbnail_1"
                referrerpolicy="no-referrer"
                :src="require('../../assets/activity/curve_up.png')"
              />
              <img
                :hidden="!isLightMode"
                class="thumbnail_2"
                referrerpolicy="no-referrer"
                :src="require('../../assets/activity/curve_down.png')"
              />
              <img
                :hidden="isLightMode"
                class="thumbnail_5"
                referrerpolicy="no-referrer"
                :src="require('../../assets/activity/curve_up_dark.png')"
              />
              <img
                :hidden="isLightMode"
                class="thumbnail_6"
                referrerpolicy="no-referrer"
                :src="require('../../assets/activity/curve_down_dark.png')"
              />
            </div>
            <div v-else class="box_2">
              <div class="text-wrapper_3">
                <span class="text_6">{{ item.points }}</span>
                <span class="text_7">O-Points</span>
              </div>
              <div class="border-dashed_2"></div>
              <div
                style="
                  font-size: 12px;
                  font-family: OpenSansRoman-SemiBold;
                  position: absolute;
                  left: 100px;
                  top: 13px;
                "
              >
                <div class="text_8">
                  {{ item.description }}
                </div>
                <div style="margin-top: 10px; display: flex; flex-direction: row">
                  <div v-for="tag in item.tags" class="text-wrapper_14 flex-col">
                    <span class="text_29">{{ tag.description }}</span>
                  </div>
                  <div class="text-wrapper_4 flex-col">
                    <span class="text_9">Done</span>
                  </div>
                  <div class="text_10">
                    Until&nbsp;{{ formatTime(item.endTime) }}
                  </div>
                </div>
              </div>
              <img
                :hidden="!isLightMode"
                class="thumbnail_3"
                referrerpolicy="no-referrer"
                :src="require('../../assets/activity/curve_up_gray.png')"
              />
              <img
                :hidden="!isLightMode"
                class="thumbnail_4"
                referrerpolicy="no-referrer"
                :src="require('../../assets/activity/curve_down_gray.png')"
              />
              <img
                :hidden="isLightMode"
                class="thumbnail_5"
                referrerpolicy="no-referrer"
                :src="require('../../assets/activity/curve_up_dark_done.png')"
              />
              <img
                :hidden="isLightMode"
                class="thumbnail_6"
                referrerpolicy="no-referrer"
                :src="require('../../assets/activity/curve_down_dark_done.png')"
              />
            </div>
          </template>
          <div style="padding-bottom: 36px">
            <div class="text_48">More: Partners' Incentives</div>
            <el-carousel :interval="4000" trigger="click" height="110px">
              <el-carousel-item v-for="(item, index) in bannerList" :key="index">
                <div
                  @click="openUrl(item.url)"
                  class="box_75"
                  :style="`background: url(${require('../../assets/activity/banner/' +
                    item.img)});background-size: 100% 100%;`"
                ></div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { SvgIconThemed } from "../../components";
  import {
    actDialogVisible,
    isMobile,
    setActDialogVisible,
    setActDialogHover,
    transferDataState,
    updateActDataList,
    showAddress,
    starkAddress,
    setSelectWalletDialogVisible,
    isStarkNetDialog,
    web3State,
    actAddPointVisible,
    actAddPoint,
    actTotalPoint,
    actBasePoint,
    actTotalActivityPoint,
    actNftList, setActNftList
  } from '../../composition/hooks';
  import { requestPointSystem } from '../../common/openApiAx';
  import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData';
  import util from '../../util/util';
  import { onCopySuccess } from '../../util';
  import walletDispatchers, { WALLETCONNECT } from '../../util/walletsDispatchers';
  import { ethereumClient } from '../../util/walletsDispatchers/pcBrowser/walletConnectPCBrowserDispatcher';
  import { disConnectStarkNetWallet } from '../../util/constants/starknet/helper';
  import { getStarknet } from 'get-starknet';
  
  const { walletDispatchersOnDisconnect } = walletDispatchers;
  
  export default {
    name: 'HeaderActDialog',
    components: {
      SvgIconThemed,
    },
    data() {
      return {
        endTime: 1703071800000,
        countDownSecond: '00',
        countDownMin: '00',
        countDownHour: '00',
        countDownDate: '00',
        left: 0,
        nftSeries: [
          { img: '0x4a0E7cf70E2816De8e6c30f67968575d17925A55.png' },
          { img: '0x5B9b40c26f6FBD053840A212A0627C55db8ea28c.png' },
          { img: '0x83Ed3B8a9DCA0A3d40A9be9F7aeE0E58F7918c4C.png' },
          { img: '0xBC2B5d07E8658D74176E3044Fd60B38d08f926A4.png' },
          { img: '0xe20847F3C593296613Df763afE7eA039D8398E78.png' },
        ],
        showDetail: false,
        closeDrawerOpacity: 0.5,
        closeDrawerPaddingLeft: 0,
        page: 1,
        pageSize: 10,
        total: 0,
        scrollLastTime: new Date().valueOf(),
        addItemLoading: false,
        listLoading: false,
        isHover: false,
        taskHeight: 0,
        bannerList: [
          {
            url: 'https://galxe.com/izumi/campaign/GCRKjtUW3A',
            img: '4.png',
          },
          {
            url: 'https://galxe.com/E9KmriypoFic9hBNPghNgB/campaign/GCWagtUGGk',
            img: '1.png',
          },
          {
            url: 'https://www.clique.social/joint-campaign/op-red-wars/op-red-wars-event1',
            img: '2.png',
          },
          {
            url: 'https://galxe.com/OrbiterFinance/campaign/GCYQPtU1R5',
            img: '3.png',
          },
        ],
      };
    },
    computed: {
      nftList() {
        return actNftList.value;
      },
      turnLeft() {
        return (
          Math.floor((this.nftList.length - 1) / 6) -
            Math.floor(this.left / 348) >
          0
        );
      },
      turnRight() {
        return this.left > 0;
      },
      isMobile() {
        return isMobile.value;
      },
      isLightMode() {
        return this.$store.state.themeMode === 'light';
      },
      selectWalletDialogVisible() {
        return actDialogVisible.value;
      },
      addPointVisible() {
        return actAddPointVisible.value && actDialogVisible.value;
      },
      addPoint() {
        return actAddPoint.value;
      },
      totalPoint() {
        return actTotalPoint.value;
      },
      actBasePoint() {
        return actBasePoint.value;
      },
      actTotalActivityPoint() {
        return actTotalActivityPoint.value;
      },
      actDataList() {
        return transferDataState.actDataList;
      },
      isStarknet() {
        return isStarkNetDialog.value;
      },
      showWalletAddress() {
        if (!isStarkNetDialog.value) {
          return showAddress();
        }
        return starkAddress();
      },
      networkId() {
        if (!isStarkNetDialog.value) {
          return compatibleGlobalWalletConf.value.walletPayload.networkId;
        } else {
          return web3State.starkNet?.starkChain;
        }
      },
      networkName() {
        if (!isStarkNetDialog.value) {
          return util.netWorkName(
            compatibleGlobalWalletConf.value.walletPayload.networkId
          );
        } else {
          return util.netWorkName(web3State.starkNet?.starkChain);
        }
      },
      walletAddress() {
        return compatibleGlobalWalletConf.value.walletPayload.walletAddress;
      },
      walletType() {
        if (!isStarkNetDialog.value) {
          return String(compatibleGlobalWalletConf.value.walletType)
            .toLowerCase()
            .replace('app', '');
        } else {
          return getStarknet && getStarknet()?.id === 'braavos'
            ? 'braavos'
            : 'argent';
        }
      },
    },
    watch: {
      selectWalletDialogVisible(item1, item2) {
        if (item1 !== item2) {
          setTimeout(() => {
            this.getTaskHeight()
          }, 200)
        }
      },
    },
    methods: {
      getTaskHeight() {
        let eleHeight = this.$refs.block_top_group?.clientHeight || 0
  
        const total = this.$refs.block_1?.clientHeight || 50
        this.taskHeight = total - eleHeight - 20
      },
      onCopySuccess,
      countDown() {
        const diffSecond = Math.floor(
          (this.endTime - new Date().valueOf()) / 1000
        );
        this.countDownSecond = this.fillDouble(diffSecond % 60);
        this.countDownMin = this.fillDouble(
          Math.floor((diffSecond % (60 * 60)) / 60)
        );
        this.countDownHour = this.fillDouble(
          Math.floor((diffSecond % (60 * 60 * 24)) / (60 * 60))
        );
        this.countDownDate = this.fillDouble(
          Math.floor((diffSecond % (60 * 60 * 24 * 365)) / (60 * 60 * 24))
        );
      },
      fillDouble(num) {
        if (String(num).length === 1) {
          return '0' + String(num);
        }
        return String(num);
      },
      scrollDiv(isRight) {
        if (isRight) {
          this.left = this.left + 348;
        } else {
          this.left = this.left - 348;
        }
      },
      expand() {
        this.showDetail = !this.showDetail;
      },
      mouseoverCloseDrawer() {
        this.closeDrawerOpacity = 1;
        this.closeDrawerPaddingLeft = 1;
      },
      mouseoutCloseDrawer() {
        this.closeDrawerOpacity = 0.5;
        this.closeDrawerPaddingLeft = 0;
      },
      disconnect() {
        try {
          if (!isStarkNetDialog.value) {
            this.selectedWallet = {};
            localStorage.setItem('selectedWallet', JSON.stringify({}));
            this.$store.commit('updateLocalLogin', false);
            localStorage.setItem('localLogin', false);
            if (compatibleGlobalWalletConf.value.walletType === WALLETCONNECT) {
              ethereumClient.disconnect();
              localStorage.setItem('wc@2:client:0.3//session', null);
            }
            walletDispatchersOnDisconnect[
              compatibleGlobalWalletConf.value.walletType
            ]();
          } else {
            disConnectStarkNetWallet();
          }
        } catch (e) {
          console.error(e);
        }
        setActDialogVisible(false);
        setSelectWalletDialogVisible(true);
      },
      itemScroll(e) {
        if (new Date().valueOf() - this.scrollLastTime > 40) {
          const itemH = 88;
          const touchNum = 5;
          this.scrollHei = e.target.scrollTop;
          const scrollNum = this.scrollHei - (this.scrollHei % itemH);
          const len = Math.floor(scrollNum / itemH);
          if (
            len >= transferDataState.actDataList.length - touchNum &&
            transferDataState.actDataList.length < this.total
          ) {
            this.addItem();
          }
          this.scrollLastTime = new Date().valueOf();
        }
      },
      async addItem() {
        if (!this.addItemLoading) {
          this.addItemLoading = true;
          const nextPage = this.page + 1;
          const actDataList = await this.getActDataList(this.pageSize, nextPage);
          const list = [...transferDataState.actDataList, ...actDataList];
          const obj = {};
          const dataList = list.filter((a) => {
            if (!obj[a.id]) {
              obj[a.id] = 1;
              return true;
            } else {
              return false;
            }
          });
          updateActDataList(dataList);
          this.page = Math.floor(dataList.length / this.pageSize);
          this.addItemLoading = false;
        }
      },
      async getActDataList(pageSize, page) {
        const res = await requestPointSystem('v2/activity/list', {
          address: compatibleGlobalWalletConf.value.walletPayload.walletAddress,
          pageSize,
          page,
        });
        this.total = res.data.total;
        const list = res.data.list;
        const dataList = [];
        const undoneList = [];
        const doneList = [];
        for (const data of list) {
          for (const task of data.taskList) {
            if (task.status) {
              doneList.push({ ...task, twitter: data.twitter });
            } else {
              undoneList.push({ ...task, twitter: data.twitter });
            }
          }
        }
        dataList.push(...undoneList);
        dataList.push(...doneList);
        return dataList;
      },
      openUrl(url) {
        window.open(url, '_blank');
      },
      mobileCloseAct() {
        if (isMobile.value) {
          setActDialogVisible(false);
        }
      },
      closeAct() {
        setActDialogHover(false);
        setActDialogVisible(false);
      },
      formatTime(time) {
        const arr = String(new Date(time)).split(' ');
        if (arr.length > 3) {
          if (+arr[3] !== new Date().getFullYear()) {
            return `${ arr[1] } ${ arr[2] }th ${ arr[3] }`;
          }
          return `${ arr[1] } ${ arr[2] }th`;
        }
        return `${ new Date(time).getMonth() } ${ new Date(time).getDate() }th`;
      },
      formatTime2(time) {
        const arr = String(new Date(time)).split(' ');
        if (arr.length > 3) {
          if (+arr[3] !== new Date().getFullYear()) {
            return `${ arr[1] } ${ arr[2] }. ${ arr[3] }`;
          }
          return `${ arr[1] }. ${ arr[2] }`;
        }
        return `${ new Date(time).getMonth() }. ${ new Date(time).getDate() }`;
      },
      mouseoverDialog() {
        setActDialogHover(true);
      },
    },
    async mounted() {
      setInterval(() => {
        this.countDown();
      }, 1000);
    },
  };
  </script>
  
  <style lang="scss" scoped>
  ::v-deep .el-carousel__indicators--horizontal {
    /*position: absolute;*/
    /*bottom: 5px;*/
    /*text-align: right;*/
  
    .el-carousel__indicator--horizontal button {
      width: 6px;
      height: 6px;
      background: #ffffff;
      border-radius: 50%;
      opacity: 0.5;
    }
  
    .el-carousel__indicator--horizontal.is-active button {
      width: 14px;
      height: 6px;
      background: #ffffff;
      opacity: 1;
      border-radius: 10px;
    }
  }
  
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
  
  .act {
    height: 100%;
  
    .label_2 {
      width: 21px;
      height: 24px;
    }
  
    .text_1_2 {
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
  
    .thumbnail_1_1 {
      width: 12px;
      height: 13px;
      margin-left: 11px;
      margin-top: 5px;
    }
  
    .group_1_12 {
      background-color: rgba(0, 0, 0, 1);
      height: 72px;
      width: 194px;
    }
  
    .box_1_48 {
      margin: 12px 0 0 24px;
      text-align: left;
      display: flex;
    }
  
    .text_1_8 {
      height: 17px;
      overflow-wrap: break-word;
      color: rgba(255, 255, 255, 1);
      font-size: 12px;
      font-family: OpenSans-Regular;
      text-align: left;
      white-space: nowrap;
      line-height: 17px;
      margin-right: 4px;
    }
  
    .thumbnail_1_3 {
      width: 16px;
      height: 16px;
      margin-top: 1px;
    }
  
    .text-wrapper_1_35 {
      width: 28px;
      height: 22px;
      margin: 8px 0 20px 24px;
      text-align: left;
    }
  
    .text_1_9 {
      width: 28px;
      height: 22px;
      overflow-wrap: break-word;
      color: rgba(255, 255, 255, 1);
      font-size: 16px;
      font-family: OpenSansRoman-Bold;
      font-weight: 700;
      text-align: left;
      white-space: nowrap;
      line-height: 22px;
    }
  
    .line_1 {
      background-color: rgba(102, 102, 102, 0.8);
      width: 388px;
      height: 1px;
      margin-top: 7px;
    }
  
    .card_2 {
      transition: height 0.28s;
      position: relative;
      border-radius: 12px;
      width: 388px;
      margin: 20px 0 0 20px;
      background-color: #000000;
      height: 190px;
  
      .down {
        width: 100%;
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 3px;
  
        .img {
          cursor: pointer;
          width: 16px;
          height: 16px;
        }
      }
  
      .card_bottom {
        position: absolute;
        bottom: 10px;
      }
    }
  
    .text-wrapper_45 {
      border-radius: 12px;
      background-image: url('../../assets/activity/point_bg.png');
      /*background-repeat: repeat-x;*/
      background-size: 100% auto;
      height: 120px;
      padding-top: 2px;
    }
  
    .text_98 {
      width: 127px;
      height: 19px;
      overflow-wrap: break-word;
      color: rgba(255, 255, 255, 1);
      font-size: 14px;
      font-family: OpenSansRoman-SemiBold;
      text-align: left;
      white-space: nowrap;
      line-height: 19px;
      margin: 16px 0 0 20px;
    }
  
    .text_99 {
      width: 60px;
      height: 46px;
      overflow-wrap: break-word;
      color: rgba(255, 255, 255, 1);
      font-size: 34px;
      font-family: OpenSansRoman-ExtraBold;
      text-align: left;
      white-space: nowrap;
      line-height: 46px;
      margin: 8px 0 10px 20px;
    }
  
    .section_54 {
      display: flex;
      width: 388px;
      height: 45px;
      margin: 20px 0 0 20px;
    }
  
    .box_114 {
      border-radius: 50%;
      height: 44px;
      margin-top: 1px;
      width: 44px;
    }
  
    .image-wrapper_74 {
      background-color: rgba(255, 255, 255, 1);
      border-radius: 50%;
      height: 20px;
      width: 20px;
      margin: 28px 0 0 26px;
      border: 2px solid #FFF;
  }
  
    .text-wrapper_63 {
      width: 109px;
      height: 44px;
      margin: 1px 0 0 12px;
    }
  
    .text_96 {
      width: 109px;
      height: 22px;
      overflow-wrap: break-word;
      color: rgba(34, 34, 34, 1);
      font-size: 16px;
      font-family: OpenSansRoman-Bold;
      font-weight: 700;
      text-align: left;
      white-space: nowrap;
      line-height: 22px;
    }
  
    .text_97 {
      width: 68px;
      height: 19px;
      overflow-wrap: break-word;
      color: rgba(153, 153, 153, 1);
      font-size: 14px;
      font-family: OpenSans-Regular;
      text-align: left;
      white-space: nowrap;
      line-height: 19px;
      margin-top: 3px;
    }
  
    .label_17 {
      cursor: pointer;
      width: 24px;
      height: 24px;
      margin-left: 2px;
    }
  
    .label_19 {
      cursor: pointer;
      width: 36px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      margin: 5px 0 0 0;
      background: #f5f5f5;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
  
      .img {
        margin-left: 3px;
        width: 20px;
        height: 20px;
        line-height: 36px;
      }
    }
  
    .text_48 {
      width: 187px;
      height: 18px;
      overflow-wrap: break-word;
      color: #222222;
      font-size: 14px;
      font-family: Kodchasan-Bold;
      font-weight: 700;
      text-align: left;
      white-space: nowrap;
      line-height: 18px;
      margin: 20px 0 0 16px;
    }
  
    .box_75 {
      cursor: pointer;
      border-radius: 8px;
      width: 388px;
      height: 104px;
      margin-left: 16px;
      margin-top: 8px;
    }
  
    .card {
      overflow-y: scroll;
      overflow-x: hidden;
    }
  
    .card::-webkit-scrollbar {
      width: 4px;
    }
  
    .card::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.2);
    }
  
    .card::-webkit-scrollbar-track {
      border-radius: 0;
      background: #ffffff;
    }
  
    .label_9 {
      cursor: pointer;
      width: 32px;
      height: 32px;
      margin: 8px 8px 0 205px;
    }
  
    .text-wrapper_14 {
      height: 20px;
      background: url('../../assets/activity/fee_light_tag_done.png') 100% no-repeat;
      background-size: 100% 100%;
    }
  
    .text_27 {
      height: 17px;
      overflow-wrap: break-word;
      color: rgba(255, 255, 255, 1);
      font-size: 12px;
      font-family: OpenSansRoman-Bold;
      font-weight: 700;
      text-align: left;
      white-space: nowrap;
      line-height: 17px;
      margin: 1px 8px;
    }
  
    .text_29 {
      width: 76px;
      height: 17px;
      overflow-wrap: break-word;
      color: rgba(134, 136, 150, 1);
      font-size: 12px;
      font-family: OpenSansRoman-Bold;
      font-weight: 700;
      text-align: left;
      white-space: nowrap;
      line-height: 17px;
      margin: 1px 8px;
    }
  
    .text-wrapper_18 {
      padding: 0 8px;
      height: 20px;
      background: url('../../assets/activity/light_tag_undone.png') 100% no-repeat;
      background-size: 100% 100%;
      margin-left: 2px;
      /*width: 35px;*/
    }
  
    .text_28 {
      width: 35px;
      height: 17px;
      overflow-wrap: break-word;
      color: rgba(34, 34, 34, 1);
      font-size: 12px;
      font-family: OpenSansRoman-SemiBold;
      text-align: left;
      white-space: nowrap;
      line-height: 17px;
    }
  
    .text-wrapper_17 {
      height: 20px;
      background: url('../../assets/activity/fee_tag_undone.png') 100% no-repeat;
      background-size: 100% 100%;
    }
  
    .text-wrapper_1_17 {
      height: 20px;
      background: url('../../assets/activity/act_tag.png') 100% no-repeat;
      background-size: 100% 100%;
    }
  
    .text-wrapper_1_46 {
      background-color: rgba(238, 238, 238, 1);
      border-radius: 5px;
      height: 20px;
      margin-left: 1px;
      width: 20px;
    }
  
    .text_1_69 {
      width: 13px;
      height: 15px;
      overflow-wrap: break-word;
      color: rgba(34, 34, 34, 1);
      font-size: 11px;
      font-family: OpenSansRoman-ExtraBold;
      text-align: center;
      white-space: nowrap;
      line-height: 15px;
      font-weight: 800;
    }
  
    .close-drawer {
      cursor: pointer;
      position: absolute;
      left: -460px;
      width: 40px;
      height: 100%;
      z-index: 100;
      background: #f5f5f5;
      border-radius: 16px 0px 0px 16px;
      border: 1px solid #e6e6e6;
  
      .img {
        margin: 16px 8px;
        width: 24px;
        height: 24px;
      }
    }
  
    .block_1 {
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.12);
      right: 0px;
      background-color: #ffffff;
      position: absolute;
      width: 420px;
      height: 100%;
    }
  
    .box_1 {
      display: flex;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 8px;
      position: relative;
      width: 388px;
      height: 88px;
      border: 1px solid rgba(34, 34, 34, 1);
      margin: 16px 0 0 16px;
    }
  
    .box_1_top {
      position: relative;
      top: 0;
      left: 0;
    }
  
    .box_1_top .box_1_hot {
      position: absolute !important;
      top: 50px;
      left: 50px;
      z-index: 10;
    }
  
    .box_1_top .el-carousel__item {
      width: 80%;
      opacity: 0.6;
    }
  
    .box_1_top .el-carousel__item img {
      width: 100%;
      border-radius: 4px;
    }
  
    .box_1_top .is-active {
      opacity: 1;
      transform: translateX(12.5%) scale(1) !important;
    }
  
    .box_1_top .el-carousel__mask {
      background-color: transparent;
    }
  
    .box_1_top .el-carousel__arrow {
      display: none !important;
    }
  
    .text-wrapper_1 {
      position: relative;
      width: 58px;
      height: 64px;
      background: url('../../assets/activity/wrapper_1.png') -2px 0px no-repeat;
      background-size: 60px 66px;
      margin: 12px 0 0 12px;
      padding-top: 5px;
      box-shadow: -2px 2px 0px 0px #000000;
      border-radius: 8px;
      border: 1px solid #222222;
    }
  
    .text_1 {
      width: 14px;
      height: 33px;
      color: #ffffff;
      font-size: 24px;
      font-family: OpenSansRoman-Bold;
      font-weight: 700;
      text-align: center;
      white-space: nowrap;
      line-height: 33px;
    }
  
    .text_2 {
      position: absolute;
      left: 4px;
      top: 36px;
      width: 21px;
      height: 17px;
      overflow-wrap: break-word;
      color: #ffffff;
      font-size: 12px;
      font-family: OpenSansRoman-SemiBold;
      text-align: center;
      white-space: nowrap;
      line-height: 17px;
    }
  
    .border-dashed {
      position: absolute;
      border-top: 1px dashed #000;
      transform: rotate(90deg);
      width: 76px;
      left: 44px;
      top: 44px;
      font-weight: 700;
    }
  
    .border-dashed_2 {
      position: absolute;
      border-top: 1px dashed #eeeeee;
      transform: rotate(90deg);
      width: 76px;
      left: 44px;
      top: 44px;
      font-weight: 700;
    }
  
    .image_1 {
      width: 1px;
      height: 76px;
      /*margin: 6px 0 0 12px;*/
    }
  
    .group_2 {
      width: 272px;
      height: 62px;
      margin: 14px 22px 0 11px;
    }
  
    .text_1_3 {
      display: flex;
      // width: 210px;
      height: 19px;
      font-size: 14px;
      font-family: OpenSansRoman, OpenSansRoman;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
      line-height: 19px;
      white-space: nowrap;
    }
  
    .text_2_3 {
      width: 227px;
      height: 17px;
      overflow-wrap: break-word;
      color: rgba(102, 102, 102, 1);
      font-size: 12px;
      font-family: OpenSans-Regular;
      text-align: left;
      white-space: nowrap;
      line-height: 17px;
      margin-top: 2px;
    }
  
    .text_3 {
      width: 90%;
      height: 34px;
      overflow-wrap: break-word;
      color: rgba(34, 34, 34, 1);
      font-size: 12px;
      font-family: OpenSansRoman-SemiBold;
      /*font-weight: NaN;*/
      text-align: left;
      line-height: 17px;
    }
  
    .group_3 {
      width: 146px;
      height: 20px;
      margin-top: 8px;
    }
  
    .text-wrapper_2 {
      height: 20px;
      background: url('../../assets/activity/wrapper_2.png') 100% no-repeat;
      background-size: 100% 100%;
      width: 55px;
      margin-right: 20px;
    }
  
    .text_4 {
      width: 31px;
      height: 17px;
      overflow-wrap: break-word;
      color: rgba(34, 34, 34, 1);
      font-size: 12px;
      font-family: OpenSansRoman-SemiBold;
      /*font-weight: NaN;*/
      text-align: left;
      white-space: nowrap;
      line-height: 17px;
      margin: 1px 0 0 12px;
    }
  
    .text_5 {
      width: 79px;
      height: 17px;
      overflow-wrap: break-word;
      color: rgba(153, 153, 153, 1);
      font-size: 12px;
      font-family: OpenSans-Regular;
      text-align: left;
      white-space: nowrap;
      line-height: 17px;
      margin: 2px 0 0 4px;
    }
  
    .thumbnail_1 {
      position: absolute;
      left: 76px;
      top: 81px;
      width: 12px;
      height: 6px;
    }
  
    .thumbnail_2 {
      position: absolute;
      left: 76px;
      top: -1px;
      width: 12px;
      height: 6px;
    }
  
    .box_2 {
      background-color: rgba(255, 255, 255, 1);
      border-radius: 8px;
      position: relative;
      width: 388px;
      height: 88px;
      border: 1px solid rgba(238, 238, 238, 1);
      margin: 16px 0 0 16px;
    }
  
    .text-wrapper_3 {
      background: url('../../assets/activity/wrapper_3.png') 100% no-repeat;
      border-radius: 8px;
      position: relative;
      width: 58px;
      height: 64px;
      background-size: 60px 66px;
      margin: 12px 0 0 12px;
      padding-top: 5px;
    }
  
    .text_6 {
      width: 14px;
      height: 33px;
      font-size: 24px;
      font-family: OpenSansRoman-Bold;
      font-weight: 700;
      text-align: center;
      white-space: nowrap;
      line-height: 33px;
      color: rgba(153, 153, 153, 1);
    }
  
    .text_7 {
      position: absolute;
      left: 4px;
      top: 36px;
      width: 21px;
      height: 17px;
      overflow-wrap: break-word;
      font-size: 12px;
      font-family: OpenSansRoman-SemiBold;
      text-align: center;
      white-space: nowrap;
      line-height: 17px;
      color: rgba(153, 153, 153, 1);
    }
  
    .image_2 {
      width: 1px;
      height: 76px;
      margin: 6px 0 0 12px;
    }
  
    .group_4 {
      width: 272px;
      height: 62px;
      margin: 14px 22px 0 11px;
    }
  
    .text_8 {
      width: 90%;
      height: 34px;
      overflow-wrap: break-word;
      color: rgba(153, 153, 153, 1);
      font-size: 12px;
      font-family: OpenSansRoman-SemiBold;
      text-align: left;
      line-height: 17px;
    }
  
    .box_3 {
      width: 146px;
      height: 20px;
      margin-top: 8px;
    }
  
    .text-wrapper_4 {
      height: 20px;
      background: url('../../assets/activity/light_tag_done.png') 100% no-repeat;
      background-size: 100% 100%;
      margin-left: 2px;
      width: 47px;
    }
  
    .text_9 {
      width: 31px;
      height: 17px;
      overflow-wrap: break-word;
      color: rgba(153, 153, 153, 1);
      font-size: 12px;
      font-family: OpenSans-Regular;
      text-align: left;
      white-space: nowrap;
      line-height: 17px;
    }
  
    .text_10 {
      width: 79px;
      height: 17px;
      overflow-wrap: break-word;
      color: rgba(153, 153, 153, 1);
      font-size: 12px;
      font-family: OpenSans-Regular;
      text-align: left;
      white-space: nowrap;
      line-height: 17px;
      margin: 2px 0 0 2px;
    }
  
    .thumbnail_3 {
      position: absolute;
      left: 76px;
      top: 81px;
      width: 12px;
      height: 6px;
    }
  
    .thumbnail_4 {
      position: absolute;
      left: 76px;
      top: -1px;
      width: 12px;
      height: 6px;
    }
  
    .box_4 {
      background-color: rgba(255, 255, 255, 1);
      border-radius: 8px;
      position: relative;
      width: 348px;
      height: 88px;
      border: 1px solid rgba(238, 238, 238, 1);
      margin: 16px 0 0 16px;
    }
  
    .block_2 {
      width: 58px;
      height: 64px;
      background: url('../../assets/activity/block_2.png') 100% no-repeat;
      background-size: 100% 100%;
      margin: 12px 0 0 12px;
    }
  
    .text-group_1 {
      width: 28px;
      height: 47px;
      margin: 6px 0 0 15px;
    }
  
    .text_11 {
      width: 28px;
      height: 33px;
      overflow-wrap: break-word;
      color: rgba(153, 153, 153, 1);
      font-size: 24px;
      font-family: OpenSansRoman-Bold;
      font-weight: 700;
      text-align: right;
      white-space: nowrap;
      line-height: 33px;
    }
  
    .text_12 {
      width: 21px;
      height: 17px;
      overflow-wrap: break-word;
      color: rgba(153, 153, 153, 1);
      font-size: 12px;
      font-family: OpenSansRoman-SemiBold;
      text-align: left;
      white-space: nowrap;
      line-height: 17px;
      margin: -3px 0 0 4px;
    }
  
    .image_3 {
      width: 1px;
      height: 76px;
      margin: 6px 0 0 12px;
    }
  
    .block_3 {
      width: 272px;
      height: 62px;
      margin: 14px 22px 0 11px;
    }
  
    .text_13 {
      width: 272px;
      height: 34px;
      overflow-wrap: break-word;
      color: rgba(153, 153, 153, 1);
      font-size: 12px;
      font-family: OpenSansRoman-SemiBold;
      text-align: left;
      line-height: 17px;
    }
  
    .group_5 {
      width: 146px;
      height: 20px;
      margin-top: 8px;
    }
  
    .text-wrapper_5 {
      height: 20px;
      background: url('../../assets/activity/wrapper_5.png') 100% no-repeat;
      background-size: 100% 100%;
      width: 55px;
    }
  
    .card_3 {
      width: 90%;
      margin-top: 13px;
  
      .nft_box {
        display: flex;
        width: 100%;
        height: 60px;
        margin: 8px 0 0 20px;
        overflow: hidden;
  
        .box_div {
          display: flex;
          width: 100%;
          height: 60px;
        }
  
        .section_70 {
          margin-right: 8px;
          border-radius: 5px;
          min-width: 50px;
          height: 60px;
          border: 2.5px solid rgba(0, 0, 0, 1);
        }
  
        .btn {
          position: absolute;
          right: 20px;
          display: flex;
          align-items: center;
          height: 60px;
          line-height: 60px;
  
          .img {
            opacity: 0.5;
            cursor: pointer;
            height: 24px;
            width: 24px;
          }
  
          .img:hover {
            opacity: 1;
          }
        }
  
        .btn_2 {
          position: absolute;
          left: 20px;
          display: flex;
          align-items: center;
          height: 60px;
          line-height: 60px;
  
          .img_2 {
            transform: rotate(180deg);
            opacity: 0.5;
            cursor: pointer;
            height: 24px;
            width: 24px;
          }
  
          .img_2:hover {
            opacity: 1;
          }
        }
  
        .card_cover {
          background: #ffffff;
          position: absolute;
          right: 0;
          height: 60px;
          width: 20px;
        }
      }
  
      .text-wrapper_38 {
        // background-color: rgba(245, 245, 245, 1);
        // border-radius: 8px;
        // height: 60px;
        width: 100%;
        margin: 8px 0 8px 20px;
        display: flex;
  
      }
  
      .text_55 {
        width: 255px;
        overflow-wrap: break-word;
        color: #999999;
        font-size: 14px;
        font-family: OpenSansRoman;
        text-align: left;
        white-space: nowrap;
        font-weight: 600;
      }
  
      .text_14 {
        width: 100%;
        height: 20px;
        overflow-wrap: break-word;
        color: rgba(34, 34, 34, 1);
        font-size: 16px;
        font-family: Kodchasan-Bold;
        font-weight: 700;
        text-align: left;
        white-space: nowrap;
        line-height: 20px;
        margin: 3px 0 0 20px;
      }
    }
  
    .text_15 {
      width: 79px;
      height: 17px;
      overflow-wrap: break-word;
      color: rgba(153, 153, 153, 1);
      font-size: 12px;
      font-family: OpenSans-Regular;
      text-align: left;
      white-space: nowrap;
      line-height: 17px;
      margin-top: 2px;
    }
  
    .thumbnail_5 {
      position: absolute;
      left: 76px;
      top: 81px;
      width: 12px;
      height: 6px;
    }
  
    .thumbnail_6 {
      position: absolute;
      left: 76px;
      top: -1px;
      width: 12px;
      height: 6px;
    }
  
    .box_5 {
      width: 310px;
      height: 59px;
      margin: 32px 0 41px 42px;
    }
  
    .text-wrapper_6 {
      width: 28px;
      height: 47px;
      margin-top: 2px;
    }
  
    .text_16 {
      width: 28px;
      height: 33px;
      overflow-wrap: break-word;
      color: rgba(34, 34, 34, 1);
      font-size: 24px;
      font-family: OpenSansRoman-Bold;
      font-weight: 700;
      text-align: right;
      white-space: nowrap;
      line-height: 33px;
    }
  
    .text_17 {
      width: 21px;
      height: 17px;
      overflow-wrap: break-word;
      color: rgba(34, 34, 34, 1);
      font-size: 12px;
      font-family: OpenSansRoman-SemiBold;
      text-align: left;
      white-space: nowrap;
      line-height: 17px;
      margin: -3px 0 0 3px;
    }
  
    .box_6 {
      width: 242px;
      height: 59px;
    }
  
    .text_18 {
      width: 272px;
      height: 38px;
      overflow-wrap: break-word;
      color: rgba(34, 34, 34, 1);
      font-size: 14px;
      font-family: OpenSansRoman-SemiBold;
      text-align: left;
      line-height: 19px;
    }
  
    .text-wrapper_7 {
      width: 224px;
      height: 17px;
      margin: 4px 0 0 18px;
    }
  
    .text_19 {
      width: 64px;
      height: 17px;
      overflow-wrap: break-word;
      color: rgba(34, 34, 34, 1);
      font-size: 12px;
      font-family: OpenSans-Regular;
      text-align: left;
      white-space: nowrap;
      line-height: 17px;
    }
  
    .text_20 {
      width: 79px;
      height: 17px;
      overflow-wrap: break-word;
      color: rgba(153, 153, 153, 1);
      font-size: 12px;
      font-family: OpenSans-Regular;
      text-align: left;
      white-space: nowrap;
      line-height: 17px;
    }
  
    .image-wrapper_1 {
      background-color: rgba(255, 255, 255, 1);
      border-radius: 8px;
      height: 34px;
      border: 1px solid rgba(238, 238, 238, 1);
      width: 348px;
      position: absolute;
      left: 16px;
      top: 360px;
    }
  
    .image_4 {
      width: 56px;
      height: 22px;
      margin: 12px 0 0 12px;
    }
  
    .thumbnail_7 {
      position: absolute;
      left: 76px;
      top: -6px;
      width: 12px;
      height: 12px;
    }
  
    .text-wrapper_8 {
      background-color: rgba(255, 255, 255, 1);
      position: absolute;
      left: 0;
      top: 0;
      width: 380px;
      height: 48px;
    }
  
    .text_21 {
      width: 94px;
      height: 23px;
      overflow-wrap: break-word;
      color: rgba(34, 34, 34, 1);
      font-size: 18px;
      font-family: Kodchasan-Bold;
      font-weight: 700;
      text-align: left;
      white-space: nowrap;
      line-height: 23px;
      margin: 12px 0 0 16px;
    }
  
    .text_65 {
      cursor: pointer;
      width: 39px;
      height: 17px;
      overflow-wrap: break-word;
      color: rgba(93, 147, 247, 1);
      font-size: 12px;
      font-family: OpenSans-Regular;
      text-align: center;
      white-space: nowrap;
      line-height: 17px;
      margin: 10px 12px;
    }
  }
  
  .dark-theme {
    .act {
      .card_3 {
        .text_14 {
          color: rgba(255, 255, 255, 1);
        }
  
        .nft_box {
          .card_cover {
            background-color: rgba(64, 65, 91, 1);
          }
        }
      }
  
      .text-wrapper_38 {
        background: #363951;
      }
  
      .text_1_3 {
        color: #ffffff;
      }
  
      .text_2_3 {
        color: rgba(255, 255, 255, 0.6);
      }
  
      .text-wrapper_1_46 {
        background-color: rgba(255, 255, 255, 0.1);
  
        .text_1_69 {
          color: rgba(255, 255, 255, 1);
        }
      }
  
      .label_19 {
        background: #363951;
      }
  
      .close-drawer {
        background: #363951;
        border: 1px solid #363951;
      }
  
      .text_96 {
        color: #ffffff;
      }
  
      .card::-webkit-scrollbar-track {
        background: rgba(64, 65, 91, 1);
      }
  
      .border-dashed {
        border-top: 1px dashed #ffffff;
        opacity: 20%;
      }
  
      .border-dashed_2 {
        border-top: 1px dashed #eeeeee;
        opacity: 10%;
      }
  
      .block_1 {
        background-color: rgba(64, 65, 91, 1);
        color: rgba(255, 255, 255, 1);
  
        .image-wrapper_74 {
          border: 2px solid #40415F;
        }
      }
  
      .text_3 {
        width: 90%;
        height: 34px;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 0.8);
        font-size: 12px;
        font-family: OpenSansRoman-SemiBold;
        /*font-weight: NaN;*/
        text-align: left;
        line-height: 17px;
      }
  
      .text_5 {
        color: rgba(255, 255, 255, 0.8);
      }
  
      .text_10 {
        width: 31px;
        height: 17px;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 0.4);
        font-size: 12px;
        font-family: OpenSans-Regular;
        text-align: left;
        white-space: nowrap;
        line-height: 17px;
      }
  
      .text_21 {
        width: 94px;
        height: 23px;
        overflow-wrap: break-word;
        color: #f5f5f5;
        font-size: 18px;
        font-family: Kodchasan-Bold;
        font-weight: 700;
        text-align: left;
        white-space: nowrap;
        line-height: 23px;
        margin: 12px 0 0 16px;
      }
  
      .box_1 {
        display: flex;
        background-color: rgba(71, 74, 111, 1);
        border-radius: 8px;
        position: relative;
        width: 388px;
        height: 88px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin: 16px 0 0 16px;
      }
  
      .box_2 {
        display: flex;
        background-color: rgba(54, 57, 81, 1);
        border-radius: 8px;
        position: relative;
        width: 388px;
        height: 88px;
        border: 1px solid rgba(238, 238, 238, 0.1);
        margin: 16px 0 0 16px;
      }
  
      .text-wrapper_2 {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        height: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        width: 55px;
      }
  
      .text-wrapper_3 {
        background: rgba(63, 65, 91, 1);
        border-radius: 8px;
        width: 58px;
        height: 64px;
        margin: 12px 0 0 12px;
      }
  
      .text-wrapper_4 {
        height: 20px;
        background: url('../../assets/activity/dark_tag_done.png') 100% no-repeat;
        background-size: 100% 100%;
        margin-left: 2px;
        width: 47px;
      }
  
      .text-wrapper_18 {
        height: 20px;
        background: url('../../assets/activity/dark_tag_undone.png') 100% no-repeat;
        background-size: 100% 100%;
        margin-left: 2px;
      }
  
      .text_28 {
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 0.8);
        font-size: 12px;
        font-family: OpenSansRoman-SemiBold;
        text-align: left;
        white-space: nowrap;
        line-height: 17px;
      }
  
      .text_27 {
        color: rgba(255, 255, 255, 1);
      }
  
      .text-wrapper_14 {
        height: 20px;
        background: url('../../assets/activity/fee_dark_tag_done.png') 100% no-repeat;
        background-size: 100% 100%;
      }
  
      .text_48 {
        color: rgba(255, 255, 255, 1);
      }
    }
  }
  
  @media (max-width: 820px) {
    .act {
      position: absolute;
      width: 100%;
      height: 100%;
  
      .block_1 {
        bottom: 0px;
        right: 0px;
        height: 90vh;
        border-radius: 12px;
        background-color: #ffffff;
        position: absolute;
        width: 100%;
      }
  
      .card_2 {
        width: 90%;
      }
  
      .text_1_3 {
        font-size: 11px;
      }
  
      .text_2_3 {
        font-size: 10px;
      }
  
      .group_1_12 {
        width: 45vw;
      }
  
      .line_1 {
        width: 90vw;
      }
  
      /*.section_54 {*/
      /*    width: 100vw;*/
      /*}*/
  
      .box_75 {
        width: 91.5%;
      }
  
      .box_1 {
        width: 91.5%;
        margin: 16px;
      }
  
      .box_2 {
        width: 91.5%;
        margin: 16px;
      }
  
      .thumbnail_1 {
        top: 82px;
      }
  
      .thumbnail_3 {
        top: 82px;
      }
  
      .thumbnail_5 {
        top: 82px;
      }
    }
  
    .dark-theme {
      .act {
        position: absolute;
        width: 100%;
        height: 100%;
  
        .block_1 {
          bottom: 0px;
          right: 0px;
          border-radius: 12px;
          background-color: rgba(64, 65, 91, 1);
          color: rgba(255, 255, 255, 1);
          position: absolute;
          width: 100%;
        }
  
        .text_3 {
          width: 90%;
          height: 34px;
          overflow-wrap: break-word;
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          font-family: OpenSansRoman-SemiBold;
          /*font-weight: NaN;*/
          text-align: left;
          line-height: 17px;
        }
  
        .text_5 {
          width: 31px;
          height: 17px;
          overflow-wrap: break-word;
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          font-family: OpenSansRoman-SemiBold;
          text-align: left;
          white-space: nowrap;
          line-height: 17px;
          margin: 1px 0 0 12px;
        }
  
        .text_21 {
          width: 94px;
          height: 23px;
          overflow-wrap: break-word;
          color: #f5f5f5;
          font-size: 18px;
          font-family: Kodchasan-Bold;
          font-weight: 700;
          text-align: left;
          white-space: nowrap;
          line-height: 23px;
          margin: 12px 0 0 16px;
        }
  
        .box_1 {
          display: flex;
          background-color: rgba(71, 74, 111, 1);
          border-radius: 8px;
          position: relative;
          height: 88px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: 91.5%;
          margin: 16px;
        }
  
        .box_2 {
          display: flex;
          background-color: rgba(54, 57, 81, 1);
          border-radius: 8px;
          position: relative;
          width: 91.5%;
          height: 88px;
          border: 1px solid rgba(238, 238, 238, 0.1);
          margin: 16px;
        }
  
        .text-wrapper_2 {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          height: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 55px;
        }
  
        .text-wrapper_3 {
          background: rgba(63, 65, 91, 1);
          border-radius: 8px;
          width: 58px;
          height: 64px;
          margin: 12px 0 0 12px;
        }
  
        .text-wrapper_4 {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          height: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 55px;
        }
      }
    }
  }
  
  .header-dialog-box {
    font-family: 'Inter Regular';
    position: absolute;
    top: 0;
    right: 0;
  }
  </style>
