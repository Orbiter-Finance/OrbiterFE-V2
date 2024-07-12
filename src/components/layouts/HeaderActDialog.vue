<template>
  <div
    class="act header-dialog-box"
    id="act-header-dialog-box"
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
        <img class="img" :src="require('../../assets/activity/right.png')" />
      </div>
    </div>
    <div @mouseover="mouseoverDialog" ref="block_1" class="block_1">
      <div ref="block_top_wallet_group">
        <div class="user-info">
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
            <div
              v-clipboard:copy="currentWalletAddress"
              v-clipboard:success="onCopySuccess"
              class="label_17"
            >
              <svg
                class="label_17"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                version="1.1"
              >
                <title>Copy Address</title>
  
                <g
                  id="page-1"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g id="ic/copy">
                    <rect
                      id="rectangles"
                      fill-rule="nonzero"
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                    />
                    <path
                      d="M14.6666667,12.6 L14.6666667,15.4 C14.6666667,17.7333333 13.7333333,18.6666667 11.4,18.6666667 L8.6,18.6666667 C6.26666667,18.6666667 5.33333333,17.7333333 5.33333333,15.4 L5.33333333,12.6 C5.33333333,10.2666667 6.26666667,9.33333333 8.6,9.33333333 L11.4,9.33333333 C13.7333333,9.33333333 14.6666667,10.2666667 14.6666667,12.6 Z"
                      id="trails"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M18.6666667,8.6 L18.6666667,11.4 C18.6666667,13.7333333 17.7333333,14.6666667 15.4,14.6666667 L14.6666667,14.6666667 L14.6666667,12.6 C14.6666667,10.2666667 13.7333333,9.33333333 11.4,9.33333333 L9.33333333,9.33333333 L9.33333333,8.6 C9.33333333,6.26666667 10.2666667,5.33333333 12.6,5.33333333 L15.4,5.33333333 C17.7333333,5.33333333 18.6666667,6.26666667 18.6666667,8.6 Z"
                      id="trails"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                </g>
              </svg>
            </div>
  
            <div style="flex: 1; display: flex; justify-content: flex-end">
              <div @click="goToHistory" class="label_19">
                <img class="tools-icon" :src="require('../../assets/activity/history.svg')" alt="">
              </div>
              <div @click="toggleThemeMode" class="label_19">
                <img class="tools-icon" :src="require(`../../assets/activity/${$store.state.themeMode}-theme.svg`)" alt="">
              </div>
              <div @click="disconnect" class="label_19" v-if="!isMobile">
                <img
                  class="img"
                  :src="require('../../assets/activity/disconnect.svg')"
                />
              </div>
            </div>
          </div>
          <div>
            <div class="text-wrapper_45">
              <div class="text_98"
              @click="openUserInfoDetailsCardModal"
              >
                Total O-Points
                <img :src="require('../../assets/activity/extends.svg')" alt="">
              </div>
              <div class="text_99">
                <div class="left">
                <span @click="openUserInfoDetailsCardModal">{{ totalPoint }}</span>
                <HeaderLotteryCard />
                </div>

                <div class="right">
                  <div 
                  @click="openOPointsRankingCardModal"
                  class="ranking"
                  >
                    <img :src="require('../../assets/activity/ranking-icon.svg')" alt="">
                  <span v-if="!!pointRank">{{ decimalNumC(pointRank, 0, ",") }}</span>
                  </div>
                  <div
                  @click="openClaimRewardModal"
                  class="reward">
                    <svg-icon iconName="ORBGUY"></svg-icon>
                    Reward
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        ref="block_mobile_scroll_group"
        :style="
          isMobile
            ? `height:${taskMobileHeight}px;overflow-y: scroll; overflow-x: hidden;`
            : ''
        "
      >
        <div ref="block_top_group">
        </div>
        <div style="width: 100%; display: flex;">
          <span class="text_21">🛸 Quests </span>
        </div>
        <div class="ativity-list" 
        :style="isMobile ? 'overflow:none;' : `height:${taskHeight}px;`"
        @scroll="itemScroll"
        >
        <!-- <PrizesCard></PrizesCard> -->
         <LuckyTaskBagBanner></LuckyTaskBagBanner>
        <div 
        >
          <div v-if="!actDataList.length">
            <LuckyTaskCard></LuckyTaskCard>
          </div>
          <div v-else :key="index" v-for="(item, index) in actDataList">
            <div v-if="Number(item.label.isTop) ===1">
              <LuckyTaskCard></LuckyTaskCard>
            </div>

            <div v-else class="activity-card">
              <div class="activity-card-title">
                <div class="activity-card-title-left">
                  <svg-icon
                    v-if="item.label.icon"
                    class="icon"
                    :iconName="item.label.icon"
                  ></svg-icon>
                  <div class="text">{{ item.name }}</div>
                </div>
                <o-tooltip>
                  <template v-slot:titleDesc>
                    <div class="task-tips-time" style="margin-left: -20px">
                      {{ formatTime3(item.startTime) }} -
                    {{ formatTime3(item.endTime) }}
                    </div>
                  </template>
                  <div class="text_5" >
                    {{ formatTime2(item.startTime) }} -
                    {{ formatTime2(item.endTime) }}
                  </div>
                </o-tooltip>
                
              </div>
              <div>
              <template v-for="option in item.taskList">
                <div class="task-card" 
                :style="`opacity:${option.status === 0 ? '1' : '0.4'};`"
                >
                  <div class="title">
                    <div class="task-info">
                    <svg-icon class="task-icon" iconName="task-icon"></svg-icon>
                    <div class="description" v-html="option.description"></div>
                    </div>
                  </div>
                  <div class="group">
                    <div
                    v-for="tag in option.tags"
                    >
                      <div v-if="tag.style === 'token'"
                      class="token-tag"
                      >
                        <img v-if="tag.icon" :src="tag.icon" alt="" class="tag-token-icon">
                        <span class="tag-token-text">{{ tag.description }}</span>
                      </div>
                      <div
                          class="text-wrapper_17 flex-col"
                          :key="tag.description"
                          v-else
                        >
                        <span class="text_27">{{ tag.description }}</span>
                      </div>

                    </div>
                    
                    <!-- <div v-else class="text-wrapper_4 flex-col">
                      <span class="text_9">Done</span>
                    </div> -->

                    <div class="group-reward">
                      <svg-icon iconName="O-Points"></svg-icon>
                      + {{ option.points }} OPoints
                    </div>
                    

                    <div class="text-wrapper_18">
                      <span class="text_28" v-if="!!option.progress">{{
                        option.progress
                          ? `${option.progress.current}/${option.progress.total}`
                          : '0/0'
                      }}</span>
                      <span v-else class="text_28">Undone</span>
                    </div>
                    
                  </div>
                </div>
              </template>
            </div>
            </div>
          </div>
        </div>
        </div>
        <div ref="act_dialog_bottom_group_ref" style="box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.11);">

          <!-- <ActDialogBanner ></ActDialogBanner> -->
            <EcosystemDappPro
            ></EcosystemDappPro>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SvgIconThemed } from '../../components'
import {
  actDialogVisible,
  isMobile,
  setActDialogVisible,
  setActDialogHover,
  transferDataState,
  showAddress,
  starkAddress,
  setSelectWalletDialogVisible,
  isStarkNetDialog,
  web3State,
  actAddPointVisible,
  actAddPoint,
  actTotalPoint,
  actPointRank,
  actNftList,
  isSolanaDialog,
  solAddress,
  setConnectWalletGroupKey,
  setSolanaDialog,
  updateActDataList,
  isTonDialog,
  tonAddress,
  setUserInfoDetailsCardModalShow,
  setOPointsCardModalShow,
  setActPointRank
} from '../../composition/hooks'
import { requestPointSystem } from '../../common/openApiAx'
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'
import util from '../../util/util'
import getUTCTime from '../../util/time'
import { isProd, onCopySuccess } from '../../util'
import walletDispatchers, {
  WALLETCONNECT,
  CURRENT_SUPPORT_WALLET,
  METAMASK,
} from '../../util/walletsDispatchers'
import { ethereumClient } from '../../util/walletsDispatchers/pcBrowser/walletConnectPCBrowserDispatcher'
import { disConnectStarkNetWallet } from '../../util/constants/starknet/helper'
import { getStarknet } from 'get-starknet'
import { PONITS_EXPAND_COUNT } from '../../const'

import HeaderActGroup from './HeaderActGroup.vue'
import HeaderLotteryCard from "./HeaderLotteryCard.vue"
import EcosystemDapp from './EcosystemDapp.vue'
import EcosystemDappPro from './EcosystemDappPro.vue'
// import ActDialogBanner from './ActDialogBanner.vue'
import solanaHelper from '../../util/solana/solana_helper'
import { CHAIN_ID } from '../../config'
import tonHelper from '../../util/ton/ton_helper'
import SvgIcon from '../SvgIcon/SvgIcon.vue'
// import PrizesCard  from "./PrizesCard.vue"
import LuckyTaskCard  from "./LuckyTaskCard.vue"
import LuckyTaskBagBanner  from "./LuckyTaskBagBanner.vue"
import { mapMutations } from 'vuex'
import { decimalNum } from '../../util/decimalNum'
import dayjs from 'dayjs';

const { walletDispatchersOnDisconnect } = walletDispatchers
let time2 = 0

export default {
  name: 'HeaderActDialog',
  components: {
    SvgIconThemed,
    HeaderActGroup,
    HeaderLotteryCard,
    EcosystemDapp,
    EcosystemDappPro,
    // ActDialogBanner,
    SvgIcon,
    // PrizesCard,
    LuckyTaskCard,
    LuckyTaskBagBanner
  },
  data() {
    return {
      endTime: 1703071800000,
      countDownSecond: '00',
      countDownMin: '00',
      countDownHour: '00',
      countDownDate: '00',
      left: 0,
      questsShow: false,
      extendsNftList: false,
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
      taskMobileHeight: 0,
      bannerList: [
        {
          url: 'https://app.zklink.io/aggregation-parade',
          img: 'aggregation-parade.png',
          name: "aggregation-parade",
          timeStamp: '2024-05-25 10:00:00',
        },
        {
          url: "https://fusion.gobob.xyz/?refCode=2ae49l",
          img: 'bob.jpg',
          name: "BOB FUSION",
          timeStamp: '2024-05-28 06:00:00',
        }
      ].filter((item) => +new Date(item.timeStamp) >= getUTCTime()),
      showEcosystemDapp: true
    }
  },
  computed: {
    nftList() {
      const dragon = "0x98f2bf4408fae2b6acb7f875efd7c587b593615c".toLocaleLowerCase()
      const list = actNftList.value
      
      return list.map((item)=>({
        ...item,
        img: item.img.toLocaleLowerCase(),
        border: item.img.toLocaleLowerCase().includes(dragon) ? "0 none" : "2.5px solid rgba(0, 0, 0, 1)"
      }))
    },
    turnLeft() {
      return (
        Math.floor((this.nftList.length - 1) / 6) -
          Math.floor(this.left / 348) >
        0
      )
    },
    turnRight() {
      return this.left > 0
    },
    isMobile() {
      return isMobile.value
    },
    isLightMode() {
      return this.$store.state.themeMode === 'light'
    },
    selectWalletDialogVisible() {
      return actDialogVisible.value
    },
    addPointVisible() {
      return actAddPointVisible.value && actDialogVisible.value
    },
    addPoint() {
      return actAddPoint.value
    },
    totalPoint() {
      return actTotalPoint.value
    },
    pointRank() {
      const rank = actPointRank.value 
      return rank ? String(rank) : "0" 
    },
    actDataList() {
      const list = transferDataState.actDataList || []
      return list.map((item)=> ({
        ...item,
        label: {
          icon: "",
          ...(item?.label || {})
        }
      }))
    },
    actOtherDataList() {
      const list = transferDataState.actDataList || []
      return list.filter(
        (item) => item.type !== 1 && +new Date(item.endTime) >= getUTCTime()
      )
    },
    isStarknet() {
      return isStarkNetDialog.value
    },
    isSolana() {
      return isSolanaDialog.value
    },
    showWalletAddress() {
      if(isTonDialog.value) {
        return tonAddress()
      }
      if(isSolanaDialog.value) {
        return solAddress()
      }
      if (!isStarkNetDialog.value) {
        return showAddress()
      }
      return starkAddress()
    },
    currentWalletAddress() {
      if(isTonDialog.value) {
        return tonHelper.account()
      }
      if(isSolanaDialog.value) {
        return solanaHelper.solanaAddress()
      }
      if (!!isStarkNetDialog.value) {
        return web3State.starkNet.starkNetAddress
      }
      const evmAddress = compatibleGlobalWalletConf.value.walletPayload.walletAddress
      return evmAddress?.toLocaleLowerCase();
    },
    networkId() {
      if(isTonDialog.value) {
        return CHAIN_ID.ton
      }
      if(isSolanaDialog.value) {
        return CHAIN_ID.solana
      }
      if (!isStarkNetDialog.value) {
        return compatibleGlobalWalletConf.value.walletPayload.networkId
      } else {
        return web3State.starkNet?.starkChain
      }
    },
    networkName() {
      if(!!isTonDialog.value) {
        return util.netWorkName(
          !!isProd() ? CHAIN_ID.ton : CHAIN_ID.ton_test
        )
      }
      if(!!isSolanaDialog.value) {
        return util.netWorkName(
          CHAIN_ID.solana
        )
      }
      if (!isStarkNetDialog.value) {
        return util.netWorkName(
          +compatibleGlobalWalletConf.value.walletPayload.networkId
        )
      } else {
        return util.netWorkName(web3State.starkNet?.starkChain)
      }
    },
    walletAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress
    },
    walletType() {
      if(isTonDialog.value) {
        return CHAIN_ID.ton
      }
      if(!!isSolanaDialog.value) {       
        return web3State.solana.solanaWalletName || solanaHelper.readWalletName() || "SOLANA_MAIN"
      }
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
  },
  watch: {
    selectWalletDialogVisible(item1, item2) {

      if (item1) {
        this.showPointsCall()
        this.getUserRank()
      } else {
        this.showDetail = false
      }

      if (item1 !== item2) {
        setTimeout(() => {
          this.getTaskHeight()
        }, 200)
      }

      
    },
    currentWalletAddress(item1, item2) {
      if (!!item1 && !!item2) {
        this.showPointsCall()
      }
      if(item1 && (item1 !== item2)) {
        this.getUserRank()
      }
    },
    isMobile(item1, item2) {
      if (item1 !== item2) {
        setTimeout(() => {
          this.getTaskHeight()
        }, 200)
      }
    },
  },
  methods: {
    ...mapMutations(['toggleThemeMode']),
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
    async getUserRank() {
      clearTimeout(time2)
      time2 = setTimeout(async () => {

        const address = this.currentWalletAddress
        if(address) {
          const response = await fetch(
            `${process.env.VUE_APP_OPEN_URL}/points_platform/rank/address/${address}`
          )
          const { result } = await response.json()
          const { rank} = result || []
          setActPointRank(
            Number(rank) > 0 ? rank : 0
          )
        }
      }, 200)
    },
    goToHistory() {
      const route = this.$router
        localStorage.setItem(
          'last_page_before_history',
          JSON.stringify({
            path: route.path,
            params: route.params,
            query: route.query,
          })
        )
      route.path !== '/history' &&
        this.$router.push({
          path: '/history',
        })
      this.closeAct()
    },
    openClaimRewardModal() {
      this.$store.commit("getClaimORBGUYRewardData", {type: 'REWARD'})
    },
    openOPointsRankingCardModal() {
      setOPointsCardModalShow(true)
    },
    openUserInfoDetailsCardModal () {
      setUserInfoDetailsCardModalShow(true)
    },
    toggleNftListStatus() {
      this.extendsNftList = !this.extendsNftList
      setTimeout(() => {
        this.getTaskHeight()
        }, 200)
    },
    showPointsCall() {
      const group = JSON.parse(
        localStorage.getItem(PONITS_EXPAND_COUNT) || JSON.stringify({})
      )
      if (this.currentWalletAddress) {
        let count = group[this.currentWalletAddress.toLocaleLowerCase()]
        count = count ?? 2
        if (count !== undefined && count > 0) {
          this.showDetail = true
          const newGroup = {
            ...group,
            [this.currentWalletAddress.toLocaleLowerCase()]: --count,
          }
          localStorage.setItem(PONITS_EXPAND_COUNT, JSON.stringify(newGroup))
        } else {
          this.showDetail = false
        }
      }
    },
    getTaskHeight() {
      let walletGroupEle = this.$refs.block_top_wallet_group?.clientHeight || 0
      let eleHeight = this.$refs.block_top_group?.clientHeight || 0
      const total = this.$refs.block_1?.clientHeight || 50
      const actDialogBottomGroupRef = this.$refs.act_dialog_bottom_group_ref?.clientHeight || 50 
      this.taskHeight = total - eleHeight - actDialogBottomGroupRef - walletGroupEle - 32
      if (isMobile) {
        this.taskMobileHeight = total - walletGroupEle -20
      }
    },
    onCopySuccess,
    countDown() {
      const diffSecond = Math.floor(
        (this.endTime - new Date().valueOf()) / 1000
      )
      this.countDownSecond = this.fillDouble(diffSecond % 60)
      this.countDownMin = this.fillDouble(
        Math.floor((diffSecond % (60 * 60)) / 60)
      )
      this.countDownHour = this.fillDouble(
        Math.floor((diffSecond % (60 * 60 * 24)) / (60 * 60))
      )
      this.countDownDate = this.fillDouble(
        Math.floor((diffSecond % (60 * 60 * 24 * 365)) / (60 * 60 * 24))
      )
    },
    fillDouble(num) {
      if (String(num).length === 1) {
        return '0' + String(num)
      }
      return String(num)
    },
    scrollDiv(isRight) {
      if (isRight) {
        this.left = this.left + 348
      } else {
        this.left = this.left - 348
      }
    },
    expand() {
      this.showDetail = !this.showDetail
    },
    mouseoverCloseDrawer() {
      this.closeDrawerOpacity = 1
      this.closeDrawerPaddingLeft = 1
    },
    mouseoutCloseDrawer() {
      this.closeDrawerOpacity = 0.5
      this.closeDrawerPaddingLeft = 0
    },
    async disconnect() {
      try {
        if(!!isTonDialog.value) {
          await tonHelper.disconnect()
        }else if(!!isSolanaDialog.value) {
          await solanaHelper.disConnect()
          setConnectWalletGroupKey("SOLANA")
          this.$store.commit('updateSolanaAddress', "")
          this.$store.commit('updateSolanaWalletName', "")
          this.$store.commit('updateSolanaWalletIcon', "")
          this.$store.commit('updateSolanaIsConnect', false)
          setSolanaDialog(false)
        } else if (!isStarkNetDialog.value) {
          this.selectedWallet = {}
          localStorage.setItem('selectedWallet', JSON.stringify({}))
          this.$store.commit('updateLocalLogin', false)
          localStorage.setItem('localLogin', false)
          if (compatibleGlobalWalletConf.value.walletType === WALLETCONNECT) {
            ethereumClient.disconnect()
            localStorage.setItem('wc@2:client:0.3//session', null)
          }
          walletDispatchersOnDisconnect[
            compatibleGlobalWalletConf.value.walletType
          ]()
          setConnectWalletGroupKey("EVM")
        } else  {
          disConnectStarkNetWallet()
          setConnectWalletGroupKey("STARKNET")
        }
      } catch (e) {
        console.error(e)
      }
      setActDialogVisible(false)
      setSelectWalletDialogVisible(true)
    },
    itemScroll(e) {
      if (new Date().valueOf() - this.scrollLastTime > 40) {
        const itemH = 88
        const touchNum = 5
        this.scrollHei = e.target.scrollTop
        const scrollNum = this.scrollHei - (this.scrollHei % itemH)
        const len = Math.floor(scrollNum / itemH)
        if (
          len >= this.actDataList.length - touchNum &&
          this.actDataList.length < this.total
        ) {
          this.addItem()
        }
        this.scrollLastTime = new Date().valueOf()
      }
    },
    async addItem() {
      if (!this.addItemLoading) {
        this.addItemLoading = true
        const nextPage = this.page + 1
        const actDataList = await this.getActDataList(this.pageSize, nextPage)
        const list = [...this.actDataList, ...actDataList]
        const obj = {}
        const dataList = list.filter((a) => {
          if (!obj[a.id]) {
            obj[a.id] = 1
            return true
          } else {
            return false
          }
        })
        updateActDataList(dataList)
        this.page = Math.floor(dataList.length / this.pageSize)
        this.addItemLoading = false
      }
    },
    async getActDataList(pageSize, page) {
      const res = await requestPointSystem('v2/activity/list', {
        address: this.currentWalletAddress,
        pageSize,
        page,
      })
      this.total = res.data.total
      const list = res.data.list
      // const dataList = []
      // const undoneList = []
      // const doneList = []
      // for (const data of list) {
      //   for (const task of data.taskList) {
      //     if (task.status) {
      //       doneList.push({ ...task, twitter: data.twitter })
      //     } else {
      //       undoneList.push({ ...task, twitter: data.twitter })
      //     }
      //   }
      // }
      // dataList.push(...undoneList)
      // dataList.push(...doneList)
      updateActDataList(list)
    },
    mobileCloseAct() {
      if (isMobile.value) {
        setActDialogVisible(false)
      }
    },
    closeAct() {
      setActDialogHover(false)
      setActDialogVisible(false)
    },
    formatTime(time) {
      return dayjs.utc(time).format("MMM.DD")
    },
    formatTime2(time) {

      return dayjs.utc(time).format("MMM.DD")
    },
    formatTime3(time) {
      return dayjs.utc(time).format("MMM.DD HH:mm")
    },
    mouseoverDialog() {
      setActDialogHover(true)
    },
  },
  async mounted() {
    const getTaskHeight = this.getTaskHeight
    let timer = false
    getTaskHeight()
    window.addEventListener('resize', () => {
      if (!timer) {
        timer = true
        setTimeout(() => {
          timer = false
          getTaskHeight()
        }, 200)
      }
    })
    // setInterval(() => {
    //   this.countDown()
    // }, 1000)
  },
}
</script>

<style lang="scss" scoped>
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

.ant-tooltip-inner .tooltip-title {
  padding-left: 0 !important;
}

.task-tips-time {
  letter-spacing: 0;
  font-size: 12px;
}

.tooltip-title .points_more {
  font-size: 12px;
  color: #3478f5;
  text-decoration: underline;
  cursor: pointer;
  font-family: GeneralSans-SemiBold;
  padding: 0 2px;
  line-height: 17px;
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
    font-family: GeneralSans-Medium;
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
  }

  .points_group {
    display: flex;
    justify-content: space-between;
    height: 73px;
    padding: 0 20px;
    width: 100%;
    background: #000000;
  }
  .group_1_12 {
    background-color: rgba(0, 0, 0, 1);
    height: 72px;
  }

  .box_1_48 {
    margin: 12px 0 0 0;
    text-align: left;
    display: flex;
    justify-content: start;
    align-items: center;
  }
  .text_1_8 {
    height: 17px;
    overflow-wrap: break-word;
    color: rgba(255, 255, 255, 1);
    font-size: 12px;
    font-family: GeneralSans-Regular;
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
    margin: 8px 0 20px;
    text-align: left;
  }

  .text_1_9 {
    width: 28px;
    height: 22px;
    overflow-wrap: break-word;
    color: rgba(255, 255, 255, 1);
    font-size: 16px;
    font-family: GeneralSans-Bold;
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
    width: 100%;
    padding-top: 2px;
  }

  .text_98 {
    width: 127px;
    height: 19px;
    overflow-wrap: break-word;
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    font-family: GeneralSans-SemiBold;
    text-align: left;
    white-space: nowrap;
    line-height: 19px;
    margin-top: 8px;
    cursor: pointer;
  }

  .text_99 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    .left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 46px;
      overflow-wrap: break-word;
      color: rgba(255, 255, 255, 1);
      font-size: 34px;
      font-family: GeneralSans-Medium;
      text-align: left;
      white-space: nowrap;
      line-height: 46px;
      cursor: pointer;
    }

    .right {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .ranking {
        font-family: GeneralSans-Medium;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: 1px solid rgb(246, 192, 82);
        border-radius: 8px;
        box-shadow: inset 0px 0px 8px 0px rgb(246, 192, 82);
        backdrop-filter: blur(8px);
        background: rgba(246, 192, 82, 0.1);
        padding: 8px;
        cursor: pointer;
        color: rgb(255, 217, 139);
        font-size: 14px;
        font-weight: 600;
        line-height: 19px;
        letter-spacing: 0px;

        img {
          width: 20px;
          height: 20px;
        }

        span {
          margin-left: 4px;
        }
      }

      .reward {
        font-size: 14px;
        font-weight: 600;
        padding: 8px;
        border: 1px solid rgb(242, 185, 255);
        border-radius: 8px;
        box-shadow: inset 0px 0px 8px 0px rgb(242, 185, 255);
        backdrop-filter: blur(8px);
        background: rgba(242, 185, 255, 0.1);
        color: #F2B9FF;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-left: 8px;
        svg {
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }
      }
    }
  }

  .user-info {
    color: rgba(255, 255, 255, 1);
    width: 100%;
    
  padding: 16px;
  background-image: url('../../assets/headerAccount/top-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-color: #000;
  }

  .section_54 {
    display: flex;
    width: 388px;
    height: 45px;
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
    border: 2px solid #fff;
  }

  .text-wrapper_63 {
    width: 109px;
    height: 44px;
    margin: 1px 0 0 12px;
  }

  .text_96 {
    height: 22px;
    overflow-wrap: break-word;
    font-size: 16px;
    font-family: GeneralSans-Bold;
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
    font-family: GeneralSans-Regular;
    text-align: left;
    white-space: nowrap;
    line-height: 19px;
    margin-top: 3px;
  }

  .label_17 {
    cursor: pointer;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    & path {
      stroke: #b6b6b6;
      -webkit-stroke: #b6b6b6;
    }

    &:hover {
      background-color: #f5f5f5;

      path {
        stroke: #222222;
        -webkit-stroke: #222222;
      }
    }
  } 

  .label_19 {
    cursor: pointer;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    margin: 5px 0 0 0;
    background: #000000;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      border: 1px solid #666666;
      background-color: transparent !important;
    }

    .tools-icon {
      width: 20px;
      height: 20px;
    }

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
    margin: 10px 0 0 16px;
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
    background: url('../../assets/activity/fee_light_tag_done.png') 100%
      no-repeat;
    background-size: 100% 100%;
  }

  .text_27 {
    height: 17px;
    overflow-wrap: break-word;
    font-size: 12px;
    font-family: GeneralSans-Bold;
    text-align: left;
    white-space: nowrap;
    line-height: 17px;
    margin: 0 8px;
  }

  .text_29 {
    width: 76px;
    height: 17px;
    overflow-wrap: break-word;
    color: rgba(134, 136, 150, 1);
    font-size: 12px;
    font-family: GeneralSans-Bold;
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
    width: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text_28 {
    width: 35px;
    height: 17px;
    overflow-wrap: break-word;
    color: rgba(34, 34, 34, 1);
    font-size: 12px;
    font-family: GeneralSans-SemiBold;
    text-align: left;
    white-space: nowrap;
    line-height: 17px;
  }

  .token-tag {
    height: 20px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    color: #FFF;
    background: #000000;
    padding: 2px 4px;

    .tag-token-icon {
      width: 12px;
      height: 12px;
      margin-right: 4px;
    }

    .tag-token-text {
      font-size: 12px;
      font-family: GeneralSans-SemiBold;
    }
  }

  .text-wrapper_17 {
    height: 20px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    color: #FFF;
    background: linear-gradient(139.64deg, rgb(229, 69, 255) 0%,rgb(255, 0, 0) 85.476%);
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
    font-family: GeneralSans-Medium;
    text-align: center;
    white-space: nowrap;
    line-height: 15px;
  }

  .close-drawer {
    cursor: pointer;
    position: absolute;
    left: -468px;
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
    width: 428px;
    height: 100%;
    border-radius: 16px 0px 0px 16px;
  }

  .box_1 {
    display: flex;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 8px;
    position: relative;
    width: 100%;
    height: 88px;
    border: 1px solid rgba(34, 34, 34, 1);
    margin-top: 8px;
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
    font-family: GeneralSans-Bold;
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
    font-family: GeneralSans-SemiBold;
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
    font-family: GeneralSans-Bold;
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
    font-family: GeneralSans-Regular;
    text-align: left;
    white-space: nowrap;
    line-height: 17px;
    margin-top: 2px;
  }

  .text_3 {
    width: 96%;
    height: 34px;
    overflow-wrap: break-word;
    color: rgba(34, 34, 34, 1);
    font-size: 13px;
    font-family: GeneralSans-Bold;
    text-align: left;
    line-height: 18px;
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
    font-family: GeneralSans-SemiBold;
    /*font-weight: NaN;*/
    text-align: left;
    white-space: nowrap;
    line-height: 17px;
    margin: 1px 0 0 12px;
  }

  .text_5 {
    height: 17px;
    overflow-wrap: break-word;
    color: rgba(153, 153, 153, 1);
    font-size: 12px;
    font-family: GeneralSans-Regular;
    text-align: left;
    white-space: nowrap;
    line-height: 17px;
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
    width: 100%;
    height: 88px;
    border: 1px solid rgba(238, 238, 238, 1);
    margin-top: 8px;
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
    font-family: GeneralSans-Bold;
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
    font-family: GeneralSans-SemiBold;
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
    font-family: GeneralSans-SemiBold;
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
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text_9 {
    width: 31px;
    height: 17px;
    overflow-wrap: break-word;
    color: rgba(153, 153, 153, 1);
    font-size: 12px;
    font-family: GeneralSans-Regular;
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
    font-family: GeneralSans-Regular;
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
    font-family: GeneralSans-Bold;
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
    font-family: GeneralSans-SemiBold;
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
    font-family: GeneralSans-SemiBold;
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

    .nft-list-group {
      width: 100%;
      .text-wrapper_38 {
        // background-color: rgba(245, 245, 245, 1);
        // border-radius: 8px;
        // height: 60px;
        width: 100%;
        margin: 8px 0 8px 20px;
        display: flex;
      }
    }

    .text_55 {
      width: 255px;
      overflow-wrap: break-word;
      color: #999999;
      font-size: 14px;
      font-family: GeneralSans-Regular;
      text-align: left;
      white-space: nowrap;
    }

    .text_14 {
      width: 100%;
      overflow-wrap: break-word;
      color: rgba(34, 34, 34, 1);
      font-size: 16px;
      font-family: Kodchasan-Bold;
      font-weight: 700;
      text-align: left;
      white-space: nowrap;
      line-height: 20px;
      margin: 3px 0 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .extends {
        cursor: pointer;
      }
    }
  }

  .text_15 {
    width: 79px;
    height: 17px;
    overflow-wrap: break-word;
    color: rgba(153, 153, 153, 1);
    font-size: 12px;
    font-family: GeneralSans-Regular;
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
    font-family: GeneralSans-Bold;
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
    font-family: GeneralSans-SemiBold;
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
    font-family: GeneralSans-SemiBold;
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
    font-family: GeneralSans-Regular;
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
    font-family: GeneralSans-Regular;
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

  .ativity-list {
    width: 100%;
    overflow-y: auto;
    .activity-card {
      width: calc(100% - 32px);
      border-radius: 12px;
      background-color: #F5F5F5;
      padding: 12px;
      margin: 12px 16px;
      .activity-card-title {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .activity-card-title-left {
          display: flex;
          justify-content: start;
          align-items: center;
          .icon {
            width: 20px;
            height: 20px;
            border-radius: 4px;
            margin-right: 6px;
          }
          .text {
            color: rgb(34, 34, 34);
            font-family: GeneralSans-Bold;
            font-size: 14px;
            font-weight: 700;
            line-height: 19px;
            letter-spacing: 0px;
            text-align: left;
          }
        }
        
      }

      .task-card {
        width: 100%;
        border-radius: 8px;
        background-color: #FFF;
        margin-top: 8px;
        padding: 12px;
        text-align: left;
        .title {
          width: 100%;
          font-size: 14px;
          font-weight: 700;
          line-height: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .task-info {
            display: flex;
            justify-content: start;
            align-items: start;
            .task-icon {
              width: 20px;
              height: 20px;
              margin-right: 8px;
            }
          }
        }

        .group {
          width: 100%;
          display: flex;
          justify-content: start;
          align-items: center;
          margin-top: 8px;

          .group-reward {
            display: flex;
            justify-content: start;
            align-items: center;
            padding: 2px 4px;
            border-radius: 4px;
            background: rgb(245, 245, 245);
            font-size: 12px;
            font-weight: 600;
            line-height: 16px;
            margin: 0 8px;
            svg {
              width: 16px;
              height: 16px;
              margin-right: 4px;
            }
          }
        }
      }
    }
  }
  .text_65 {
    cursor: pointer;
    width: 39px;
    height: 17px;
    overflow-wrap: break-word;
    color: rgba(93, 147, 247, 1);
    font-size: 12px;
    font-family: GeneralSans-Regular;
    text-align: center;
    white-space: nowrap;
    line-height: 17px;
    margin: 10px 12px;
  }
}

.dark-theme {
  #act-header-dialog-box.act {
    .ativity-list {
      .activity-card {
        background: #373951;
        .activity-card-title {
          .text {
            color: #FFF;
          }
        }
      }
    }
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

    .text_55,
    .nft_vice_title {
      color: rgba(255, 255, 255, 0.6);
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
        border: 2px solid #40415f;
      }
    }

    .text_3 {
      width: 90%;
      height: 34px;
      overflow-wrap: break-word;
      color: rgba(255, 255, 255, 0.8);
      font-size: 13px;
      /*font-weight: NaN;*/
      text-align: left;
      line-height: 18px;
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
      font-family: GeneralSans-Regular;
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
      height: 88px;
      width: 100%;
      border: 1px solid rgba(255, 255, 255, 0.2);
      margin-top: 8px;
    }

    .box_2 {
      display: flex;
      background-color: rgba(54, 57, 81, 1);
      border-radius: 8px;
      position: relative;
      width: 100%;
      height: 88px;
      border: 1px solid rgba(238, 238, 238, 0.1);
      margin-top: 8px;
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
      background: url('../../assets/activity/dark_tag_undone.png') 100%
        no-repeat;
      background-size: 100% 100%;
      margin-left: 2px;
    }

    .text_28 {
      overflow-wrap: break-word;
      color: rgba(255, 255, 255, 0.8);
      font-size: 12px;
      font-family: GeneralSans-SemiBold;
      text-align: left;
      white-space: nowrap;
      line-height: 17px;
    }

    .text_27 {
      color: rgba(255, 255, 255, 1);
    }

    .text-wrapper_14 {
      height: 20px;
      background: url('../../assets/activity/fee_dark_tag_done.png') 100%
        no-repeat;
      background-size: 100% 100%;
    }

    .text_48 {
      color: rgba(255, 255, 255, 1);
    }

    .task-card {
      background-color: var(--dark-page-box-bg);

      .group-reward {
        background-color: #222222;
      }
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
      max-height: 520px;
      border-radius: 16px 16px 0 0;

      .user-info {
        border-radius: 16px 16px 0 0;
      }
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

    .points_group {

      .group_1_12 {
        .box_1_48 {
          margin: 12px 0 0 0;
          .text_1_8 {
            zoom: 0.87;
          }
        }
      }

      .thumbnail_1_3 {
        width: 16px;
        height: 16px;
      }
    }

    .line_1 {
      width: 90vw;
    }

    .section_54 {
      width: 100%;
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
        font-size: 13px;
        /*font-weight: NaN;*/
        text-align: left;
        line-height: 18px;
      }

      .text_5 {
        height: 17px;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 0.8);
        font-size: 12px;
        font-family: GeneralSans-SemiBold;
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
        height: 88px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        width: 100%;
        margin-top: 8px;
      }

      .box_2 {
        display: flex;
        background-color: rgba(54, 57, 81, 1);
        border-radius: 8px;
        position: relative;
        width: 100%;
        height: 88px;
        border: 1px solid rgba(238, 238, 238, 0.1);
        margin-top: 8px;
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
