<template>
  <div id="prizes-days" class="prizes-days">
    <div class="title">
      <span class="token-symbol">$80,000 </span>
      value of
      <svg-icon class="token" iconName="ORBGUY"></svg-icon>
      $ORBGUY
    </div>
    <div class="prizes-days-card">
      <div class="task-card-title">
        <div class="label">
          Bridge 3tx daily Get $ORBGUY
          <svg-icon class="token" iconName="ORBGUY"></svg-icon>
        </div>
        <div class="value">
          Your have checked in for
          <div class="days">3</div>
          days
        </div>
      </div>
      <div class="utc-time">update time: 0:00(UTC)</div>
      <div class="utc-time">current UTC time: {{ UTCTime }}</div>
      <template v-for="(item, index) in timeList">
        <div :key="index">
          <div class="task-item-group">
            <div
              v-for="(option, idx) in item"
              :class="`task-item ${option.className}`"
              :key="idx"
            ></div>
          </div>
          <div class="task-progress">
            <div
              class="task-time-item"
              v-for="(option, idx) in item"
              :key="idx"
              :style="`opacity: ${option.isCurrent ? '1' : '0.6'};`"
            >
              {{ option.dayAmount }} Day
              <span v-if="option.isProgress">({{ option.txAmount }}/3)</span>
            </div>
          </div>
        </div>
      </template>

      <div v-if="!!isDayEnd" class="tips">
        orbguy for today have been distributed. you can draw tomorrow!
      </div>
      <div
        :class="`prizes-to-bridge ${
          isDayEnd ? 'prizes-day-end' : 'prizes-day-not-end'
        }`"
      >
        <div
          class="prizes-to-bridge-btn"
          :style="`opacity: ${!isEnd ? '1' : '0.3'};`"
          @click="toBridgeCall"
        >
          {{ bridgeLabel }}
        </div>
      </div>

      <div class="task-group">
        <div class="task-card">
          <div class="task-orbguy-info">
            <div class="task-orbguy-info-title">
              <div>My $ORBGUY Rewards</div>
              <div @click="openLikwidSwap" class="orbguy-price">
                1 ORBGUY ≈ {{ price }} ETH
              </div>
            </div>
            <div class="task-orbguy-info-reward">
              <div class="reward">
                <svg-icon class="token-symbol" iconName="ORBGUY"></svg-icon>
                {{ totalOrbguy }}
              </div>
              <div
                :style="`opacity: ${isDraw ? '1' : '0.3'};`"
                :class="`${
                  isDraw ? 'prizes-to-bridge-animation' : ''
                } draw-btn`"
                @click="openORBGUYReward"
              >
                Lucky Draw
              </div>
            </div>
          </div>
          <div class="task-orbguy-days">
            <div class="task-orbguy-days-title">
              <o-tooltip>
                <template v-slot:titleDesc>
                  <div style="margin-left: -20px">
                    <span>
                      $ORBUGY gift boxes are distributed daily on a FCFS basis. 
                      Participants securing the 99th, 199th, 
                      299th, 399th, 499th, 599th, and 699th positions when
                       drawing a gift box each day will receive a surprising $ORBGUY bonus.
                      </span
                    >
                  </div>
                </template>
                <div class="task-orbguy-group">
                  <span>lucky 99th,199th…,win $orguy super box!</span>
                  <div class="fcfs"></div>
                </div>
              </o-tooltip>

              <div class="orbguy-amount">Remaining ORBGUY: {{ remainAmount }}</div>
            </div>
            <div class="orbguy-box-group">
              <div class="orbguy-box">
                <div class="orbguy-progress-amount">
                  <template v-for="item in list">
                    <div
                      class="orbguy-progress-amount-item"
                      v-if="item.show"
                      :key="item.userAmount"
                      :style="`left:${item.left};`"
                    >
                      {{ item.userAmount }}th
                    </div>
                  </template>
                </div>
                <div class="orbguy-progress">
                  <div class="progress-box" :style="`width: ${userLeft}`">
                    <div class="orbiter_global_skeleton"></div>
                  </div>
                  <template v-for="item in list">
                    <div
                      class="orbguy-box-item"
                      v-if="item.show"
                      :key="item.index"
                      :style="`left:${item.left};`"
                    ></div>
                  </template>

                  <div
                    v-if="!!Number(taskAddressCount)"
                    class="orbguy-user-amount"
                    :style="`left:${userLeft};`"
                  >
                    <img
                      :src="require('../../../assets/prizes/v2/user-group.svg')"
                      style="margin-right: 2px"
                      alt=""
                    />
                    {{ taskAddressCount }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="opoints-card">
          <div class="my-opoints">
            <div class="opoints-reward-title">My O-Point Rewards</div>
            <div class="reward-info">
              <svg-icon iconName="O-Points" class="o-points-symbol"></svg-icon>
              {{ totalOpoints }}
            </div>
          </div>
          <div class="opoints-progress-group">
            <div class="opoints-card-title">Earn up to 420 O-Points</div>
            <div class="opoints-group">
              <div
                :class="`${item.days ? 'opoints-item' : 'opoints-item-empty'}`"
                v-for="item in opointsList"
                :key="item.days"
                :style="`background-image: url(${
                  item.days
                    ? require(`../../../assets/prizes/v2/opoints${item.reward}.png`)
                    : ''
                });`"
              ></div>
            </div>
            <div class="opoints-progress">
              <div
                :class="`${
                  item.days ? 'opoints-day-item' : 'opoints-day-item-empty'
                } ${
                  item.days
                    ? item.isSuccess
                      ? ' opoints-day-item-success'
                      : 'opoints-day-item-base'
                    : ''
                }`"
                v-for="item in opointsList"
                :key="item.days"
              >
                <span v-if="item.days">{{ item.days }} Days</span>
              </div>
              <div
                class="opoints-progress-box"
                :style="`width: ${opointsProgressRatio};`"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3'
import dayjs from 'dayjs'
import { decimalNum } from '../../../util/decimalNum'
import { isDev } from '../../../util'
const BigNumber = require('bignumber.js')

import {
  prizesV2TaskList,
  prizesV2ProjectTaskDetailsList,
  prizesV2UserList,
  prizesV2TotalOrbguy,
  prizesV2TimeEnd,
  isMobile,
} from '../../../composition/hooks'
import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'

import SvgIcon from '../../../components/SvgIcon/SvgIcon.vue'
import { SIGN_MESSAGE } from '../../../const'
import OTooltip from '../../../components/tooltip/oTooltip.vue'

export default {
  components: {
    SvgIcon,
  },
  name: 'PrizesDays',
  data() {
    return {
      price: '',
      isDrawLoading: false,
      UTCTime: dayjs.utc().format('MMM.DD YYYY HH:mm:ss'),
    }
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
    INVITE_NUM() {
      return this.isMobile ? 3 : 7
    },
    evmAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress || ''
    },
    projectTaskDetailsList() {
      return prizesV2ProjectTaskDetailsList.value
    },
    isEnd() {
      return prizesV2TimeEnd.value
    },
    totalOrbguy() {
      return this.decimalNumC(prizesV2TotalOrbguy.value || '0', 4, ',')
    },
    list() {
      const count = this.taskAddressCount || 0
      return [0, 99, 199, 299, 399, 499, 599, 699].map((item, index) => {
        return {
          userAmount: item,
          show: !!(count < item),
          left: (index / 7.2) * 100 + '%',
        }
      })
    },
    userLeft() {
      let ratio = ((this.taskAddressCount || 0) / 707) * 100
      ratio = this.isDayEnd ? 100 : ratio > 100 ? 99 : ratio
      return (ratio || 0) + '%'
    },
    signDays() {
      const signDayList = this.signDayList || []
      let count = 0
      let isCurrent = false
      signDayList.forEach((item) => {
        if (item.isCurrent) {
          isCurrent = true
          count += Number(item.isSign)
        } else {
          if (!isCurrent) {
            if (item.isSign) {
              count += 1
            } else {
              count = 0
            }
          }
        }
      })
      return count
    },
    opointsList() {
      const total = this.signDays
      return [
        {
          days: 0,
          reward: 0,
        },
        {
          prev: 0,
          days: 3,
          reward: 32,
        },
        {
          prev: 3,
          days: 7,
          reward: 126,
        },
        {
          prev: 7,
          days: 10,
          reward: 240,
        },
        {
          prev: 10,
          days: 14,
          reward: 420,
        },
      ].map((item) => {
        return {
          ...item,
          isSuccess: total >= item.days,
          isBounce: total < item.days && total >= item.prev,
        }
      })
    },
    taskList() {
      return prizesV2TaskList.value
    },
    userList() {
      return prizesV2UserList.value
    },
    taskId() {
      const taskList = this.taskList || []
      const option = taskList.filter((item) => {
        const [startDate, endDate] = item?.rule?.date || []
        const startTime = +dayjs.utc(startDate)
        const endTime = +dayjs.utc(endDate)
        const now = +dayjs()
        return startTime <= now && endTime >= now
      })?.[0]
      return option?.id
    },
    currentInfoOption() {
      const taskId = this.taskId
      const list = this.taskList
      const option = list.filter((item) => {
        return item.id === taskId
      })?.[0]
      return option
    },
    currentDetailsOption() {
      const taskId = this.taskId
      const list = this.projectTaskDetailsList
      const option = list.filter((item) => {
        return item.taskId === taskId
      })?.[0]
      return option
    },
    currentUserOption() {
      const taskId = this.taskId
      const list = this.userList
      const option = list.filter((item) => {
        return item.task_id === taskId
      })?.[0]
      return option
    },
    orbguyAmount() {
      const currentOption = this.currentUserOption
      const option = JSON.parse(
        currentOption?.distribute_result || JSON.stringify([])
      )?.filter((item) => item.name === 'orbguy')?.[0]
      return option?.amount || '0'
    },
    bridgeLabel() {
      return !Number(this.orbguyAmount)
        ? 'start bridge'
        : 'keep bridge to earn more'
    },
    isDraw() {
      return (
        Number(this.currentTxamount) >= 3 &&
        !Number(this.orbguyAmount) &&
        !this.isDayEnd &&
        !this.isDrawLoading &&
        !this.isEnd
      )
    },
    currentTxamount() {
      const currentOption = this.currentUserOption
      return Number(currentOption?.task_result) || 0
    },
    taskAddressCount() {
      const currentOption = this.currentDetailsOption
      const current = currentOption?.taskRewardInfos?.filter(
        (item) => item?.name === 'orbguy'
      )?.[0]
      return current?.distributedCount
    },
    currentORBGUYAmount() {
      const currentOption = this.currentDetailsOption
      const current = currentOption?.taskRewardInfos?.filter(
        (item) => item?.name === 'orbguy'
      )?.[0]
      return current?.rewardCount
    },
    timeList() {
      const taskList = this.taskList || []
      const userList = this.userList || []
      let list = []
      let stashList = []
      taskList.forEach((item, index) => {
        const group =
          userList?.filter((option) => option.task_id === item.id)?.[0] || {}
        const [startDate, endDate] = item?.rule?.date || []
        const txAmount = Number(group?.task_result) || 0
        const now = +dayjs()
        const endTime = +dayjs.utc(endDate)

        const className =
          txAmount >= 3
            ? 'task-item-success'
            : this.taskId === item.id
            ? 'task-item-current bounce'
            : now > endTime
            ? 'task-item-not'
            : 'task-item-base'

        const option = {
          startTime: dayjs.utc(startDate).format('MMM.DD'),
          endTime: dayjs.utc(endDate).format('MMM.DD'),
          // value: dayjs.utc(startDate).format('MMM.DD'),
          value: dayjs.utc(startDate).format('H:mm'),
          isSuccess: txAmount >= 3,
          isCurrent: this.taskId === item.id,
          isProgress: now >= endTime || this.taskId === item.id,
          txAmount: txAmount,
          className,
          dayAmount: index + 1,
        }
        if (!(index % this.INVITE_NUM)) {
          if (!!index) {
            list = list.concat([stashList])
          }
          stashList = [option]
        } else if (!(index === taskList.length - 1)) {
          stashList = stashList.concat([option])
        } else {
          list = list.concat([stashList])
        }
      })

      return list
    },
    currentTotalORBGUYAmount() {
      const list = this.currentInfoOption?.rewards || []
      const option = list.filter((item) => item?.rule?.name === 'orbguy')?.[0]
      return option?.rule?.limit?.amount || 0
    },
    isDayEnd() {
      const total = Number(this.currentTotalORBGUYAmount) || 0
      const current = Number(this.currentORBGUYAmount) || 0
      return total <= current
    },
    opointsProgressRatio() {
      const total = this.signDays || 0
      const ratio = this.decimalNumC((total / 14) * 100, 2)
      return (ratio >= 100 ? 100 : ratio) + '%'
    },
    signDayList() {
      const userList = this.userList || []
      const list = userList.map((item, index) => {
        const txAmount = Number(item?.task_result) || 0
        return {
          isCurrent: this.taskId === item.task_id,
          isSign: txAmount >= 3,
        }
      })
      return list
    },
    totalOpoints() {
      const signDayList = this.signDayList
      const opointsList = this.opointsList
      let count = 0
      let list = []
      signDayList.forEach((item) => {
        if (item.isSign) {
          count += 1
        } else {
          list = list.concat([count])
          count = 0
        }
      })
      const total = list.reduce((prev, item) => {
        if (Number(item) && Number(item) >= 3) {
          const amount = opointsList.reduce((oPrev, option) => {
            return oPrev + (item >= option.days ? option.reward : 0)
          }, 0)
          return prev + amount
        }
        return prev
      }, 0)
      return total
    },
    remainAmount(){
      const total = Number(this.currentTotalORBGUYAmount) || 0
      const current = Number(this.currentORBGUYAmount) || 0

      const remain = total - current
      return this.decimalNumC(remain >= 0 ? remain : 0, 2, ",")
    }
  },
  methods: {
    toBridgeCall() {
      if (this.isEnd) return
      localStorage.setItem(
        'last_page_before_history',
        JSON.stringify({
          params: {},
          path: '/',
          query: { source: 'Ethereum', dest: 'BNB Chain', token: 'ETH' },
        })
      )
      this.$router.push({
        path: isDev()
          ? '/?source=Sepolia%28G%29&dest=BNB%20Chain'
          : '/?source=Ethereum&dest=BNB%20Chain&token=ETH',
      })
    },
    openLikwidSwap() {
      const evmAddress = this.evmAddress
      if (!evmAddress || evmAddress === '0x') return
      const name = 'PRIZESV2_TO_LIKWID'
      const url = 'https://likwid.meme/swap?from=orbiter&user=' + evmAddress
      this.$gtag.event(name, {
        event_category: name,
        event_label: evmAddress,
      })
      window.open(url, '_blank')
    },
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
    async signCall() {
      try {
        const address = this.evmAddress
        const provider = compatibleGlobalWalletConf.value.walletPayload.provider
        const res = await provider.request({
          method: 'personal_sign',
          params: [SIGN_MESSAGE, address.toLocaleLowerCase()],
        })
        return res
      } catch (error) {
        this.isDrawLoading = false
        return ''
      }
    },
    async drawCardCall(res) {
      this.isDrawLoading = true
      if (!res?.message) return
      if (res?.status === 'Success' && Number(res?.message)) {
        this.$store.commit('getClaimORBGUYRewardData', {
          type: 'LUCKY_BAG_TASK',
          distributeResult: res?.message,
        })
        this.drawCallback()
      } else {
        this.$notify.error({
          title: res.message,
          duration: 3000,
        })
      }
    },
    async openORBGUYReward() {
      const address = this.evmAddress
      if (!address || !this.taskId || address === '0x') {
      } else {
        if (this.isDraw) {
          this.isDrawLoading = true
          const token = await this.signCall()
          if (!token) return
          this.$store.commit('lotteryPrizesV2TaskReward', {
            address,
            taskId: this.taskId,
            token,
            call: (res) => {
              this.drawCardCall(res)
            },
          })
        }
      }
    },
    async getOrbguyPrice() {
      const web3 = new Web3(
        new Web3.providers.HttpProvider('https://rpc.vizing.com')
      )
      const raw = web3.eth.abi.encodeFunctionSignature('getReserves()')
      const res = await web3.eth.call({
        to: '0xFaf184a9d23A4F0377c7b1A4D58aB0d36353190B',
        data: raw,
      })
      const result = web3.eth.abi.decodeParameters(
        ['uint256', 'uint256'],
        res || ''
      )
      this.price = this.decimalNumC(
        new BigNumber(result[0]).div(result[1] + '').toFixed(7) + '',
        7,
        ','
      )
    },
    async getUserReward() {
      if (!this.evmAddress || this.evmAddress === '0x') return
      this.$store.commit(
        'getPrizesV2UserInfo',
        this.evmAddress.toLocaleLowerCase()
      )
    },
    drawCallback() {
      this.getUserReward()
      this.$store.commit('getPrizesV2ProjectDetail')
      this.$store.commit('getPrizesV2ProjectRank')
    },
  },
  created() {
    this.getOrbguyPrice()
  },
}
</script>

<style lang="scss" scoped>
@keyframes heartBeat {
  0% {
    transform: scale(1);
  }

  2.8% {
    transform: scale(1.3);
  }

  4.9% {
    transform: scale(1);
  }

  8.2% {
    transform: scale(1.3);
  }

  14% {
    transform: scale(1);
  }
}

@keyframes bounce {
  from,
  4%,
  11.6%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }

  8%,
  8.6% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -30px, 0) scaleY(1.1);
  }

  14% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -15px, 0) scaleY(1.05);
  }

  16% {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0) scaleY(0.95);
  }

  18% {
    transform: translate3d(0, -4px, 0) scaleY(1.02);
  }
}

.bounce {
  animation: bounce 5s infinite;
  -webkit-animation: bounce 5s infinite;
  transform-origin: center bottom;
}

.prizes-to-bridge-animation {
  animation: heartBeat 6.3s ease-in-out infinite;
  -webkit-animation: heartBeat 6.3s ease-in-out infinite;
}

.task-orbguy-group {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  span {
    white-space: nowrap;
  }
  .fcfs {
    width: 42px;
    height: 16px;
    margin-left: 4px;
    background-image: url('../../../assets/prizes/v2/fcfs.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
  }
}

.prizes-days {
  width: 100%;
  margin-top: 80px;
  .title {
    width: 100%;
    font-family: GeneralSans-SemiBold;
    font-size: 48px;
    line-height: 56px;
    letter-spacing: 0px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    .token-symbol {
      color: rgb(243, 186, 47);
      margin-right: 8px;
    }
    .token {
      width: 56px;
      height: 56px;
      padding: 8px;
    }
  }

  .prizes-days-card {
    width: 100%;
    margin-top: 32px;
    background-image: url('../../../assets/prizes/v2/prizes-days-card-bg.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    padding: 32px;

    .utc-time {
      width: 100%;
      text-align: right;
      font-size: 14px;
    }

    .task-card-title {
      width: 100%;
      font-family: GeneralSans-SemiBold;
      letter-spacing: 0px;
      text-align: left;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .days {
        color: #dea638;
        padding: 4px;
      }

      .label {
        font-size: 24px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .token {
          width: 24px;
          height: 24px;
          margin: 0 4px;
        }
      }

      .value {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 18px;
        white-space: nowrap;
      }
    }

    .task-item-group {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 32px;

      .task-item {
        width: 48px;
        height: 48px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
      }

      .task-item-current {
        background-image: url('../../../assets/prizes/v2/current-day-card.png');
        scale: 1.2;
      }

      .task-item-base {
        background-image: url('../../../assets/prizes/v2/day-card.png');
      }

      .task-item-success {
        background-image: url('../../../assets/prizes/v2/success-card.png');
      }

      .task-item-not {
        background-image: url('../../../assets/prizes/v2/not-card.png');
      }
    }

    .task-progress {
      width: 100%;
      margin-top: 12px;
      border-radius: 999px;
      background: rgb(44, 35, 9);
      height: 20px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .task-time-item {
        font-size: 14px;
        font-family: GeneralSans-Medium;
        line-height: 20px;
        letter-spacing: 0px;
        color: #f3ba2f;
        flex: 1;
      }
    }

    .orbguy-box {
      width: 100%;
      margin-top: 12px;

      .orbguy-progress-amount {
        width: 100%;
        height: 32px;
        position: relative;
        top: 0;
        left: 0;

        .orbguy-progress-amount-item {
          width: 64px;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          text-align: right;
        }
      }

      .orbguy-progress {
        margin-top: 12px;
        width: 100%;
        height: 32px;
        box-sizing: border-box;
        border: 1px solid rgba(243, 223, 47, 0.3);
        background: rgb(1, 1, 1);
        position: relative;
        top: 0;
        left: 0;
        padding: 3px;

        .progress-box {
          height: 24px;
          background: linear-gradient(
            90deg,
            rgb(255, 195, 17),
            rgb(243, 232, 66) 100%
          );
        }

        .orbguy-box-item {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 64px;
          height: 62px;
          background-image: url('../../../assets/prizes/v2/orbguy-reward-box.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100% 100%;
        }

        .orbguy-user-amount {
          position: absolute;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          transform: translate(-50%, 56px);
          padding: 6px 4px 4px;
          width: 64px;
          height: 44px;
          background-image: url('../../../assets/prizes/v2/orbguy-user-amount.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100% 100%;

          color: #ffc311;
          font-size: 20px;
          font-family: GeneralSans-SemiBold;
          line-height: 24px;
          letter-spacing: 0px;
        }
      }
    }

    .tips {
      margin-top: 32px;
      width: 100%;
      font-size: 24px;
      font-family: GeneralSans-SemiBold;
      line-height: 32px;
      letter-spacing: 0px;
      color: #f3ba2f;
    }

    .prizes-day-end {
      margin-top: 16px;
    }

    .prizes-day-not-end {
      margin-top: 80px;
    }

    .prizes-to-bridge {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .prizes-to-bridge-btn {
        width: 248px;
        height: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #010101;

        padding: 12px 0;
        background-image: url('../../../assets/prizes/v2/prizes-btn.png');
        font-size: 16px;
        font-family: GeneralSans-SemiBold;
        line-height: 28px;
        // cursor: pointer;
        background-size: 100% 100%;
        cursor: pointer;

        .draw-card {
          width: 20px;
          height: 30px;
        }
      }
    }

    .task-group {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-top: 40px;

      .task-card {
        width: 60%;
        background-image: url('../../../assets/prizes/v2/day-card-group-bg.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        margin-right: 16px;

        .task-orbguy-info {
          width: 100%;
          padding: 20px 24px;
          border-bottom: 1px solid #4a440f;
          font-size: 16px;
          font-family: GeneralSans-SemiBold;
          .task-orbguy-info-title {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .orbguy-price {
              font-family: GeneralSans-Medium;
              text-decoration: underline;
              color: rgba(255, 255, 255, 0.6);
              font-size: 14px;
              white-space: nowrap;
            }
          }
          .task-orbguy-info-reward {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            .reward {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              font-size: 28px;
              .token-symbol {
                width: 28px;
                height: 28px;
                margin-right: 8px;
              }
            }

            .draw-btn {
              display: flex;
              justify-content: center;
              align-items: center;
              color: #010101;
              width: 106px;
              height: 32px;
              background-image: url('../../../assets/prizes/v2/draw-btn-bg.png');
              background-repeat: no-repeat;
              background-position: center;
              background-size: 100% 100%;
              font-size: 14px;
              cursor: pointer;
            }
          }
        }

        .task-orbguy-days {
          width: 100%;
          padding: 20px 2px;
          .task-orbguy-days-title {
            width: 100%;
            display: flex;
            padding: 0 24px;
            justify-content: space-between;
            align-items: center;
            .orbguy-amount {
              font-family: GeneralSans-Medium;
              color: rgba(255, 255, 255, 0.6);
              font-size: 14px;
              white-space: nowrap;
            }
          }

          .orbguy-box-group {
            width: calc(100% - 24px);
            overflow-x: auto;
            height: 84px;
            .orbguy-box {
              width: 616px;
              min-width: 616px;
              margin: 16px 0 0 24px;
              .orbguy-progress-amount {
                height: 12px;
                .orbguy-progress-amount-item {
                  width: 32px;
                  font-size: 14px;
                }
              }
              .orbguy-progress {
                padding: 1px;
                height: 16px;
                .progress-box {
                  height: 12px;
                }
                .orbguy-box-item {
                  width: 40px;
                  height: 40px;
                }
                .orbguy-user-amount {
                  width: 32px;
                  height: 22px;
                  font-size: 12px;
                  line-height: 16px;
                  transform: translate(-50%, 28px);
                  img {
                    width: 12px;
                    height: 12px;
                  }
                }
              }
            }
          }
        }
      }

      .opoints-card {
        flex: 1;
        background-image: url('../../../assets/prizes/v2/opoints-card-bg.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;

        .my-opoints {
          width: 100%;
          padding: 20px 24px;
          border-bottom: 1px solid #4a440f;
          .opoints-reward-title {
            font-family: GeneralSans-SemiBold;
            line-height: 24px;
            letter-spacing: 0px;
            text-align: left;
          }
          .reward-info {
            margin-top: 8px;
            width: 100%;
            display: flex;
            justify-content: start;
            align-items: center;
            font-size: 32px;
            font-family: GeneralSans-SemiBold;
            line-height: 40px;
            letter-spacing: 0px;
            .o-points-symbol {
              width: 32px;
              height: 32px;
              margin-right: 4px;
            }
          }
        }

        .opoints-progress-group {
          width: 100%;
          padding: 20px 24px;
          .opoints-card-title {
            width: 100%;
            font-family: GeneralSans-SemiBold;
            line-height: 24px;
            letter-spacing: 0px;
            text-align: left;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .svg {
              width: 28px;
              height: 28px;
              margin-left: 8px;
            }
          }

          .opoints-group {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .opoints-item-empty {
              width: 0px;
            }

            .opoints-item {
              width: 54px;
              height: 48px;
              background-repeat: no-repeat;
              background-position: center;
              background-size: 100% 100%;
              margin-top: 16px;
            }
          }

          .opoints-progress {
            width: 100%;
            margin-top: 12px;
            border-radius: 999px;
            height: 10px;
            background: rgb(44, 35, 9);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            top: 0;
            left: 0;

            .opoints-progress-box {
              background: linear-gradient(
                to right,
                rgb(255, 195, 17),
                rgb(243, 232, 66)
              );
              border-radius: 999px;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              height: 12px;
              left: 0;
              z-index: 0;
            }

            .opoints-day-item-empty {
              width: 0px;
            }

            .opoints-day-item {
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              top: 0;
              left: 0;
              z-index: 1;
              width: 50px;
              height: 20px;
              border-radius: 999px;
              font-size: 12px;
              font-family: GeneralSans-Medium;
              line-height: 20px;
              letter-spacing: 0px;
            }

            .opoints-day-item-base {
              color: rgba(243, 186, 47, 0.6);
              background: rgb(44, 35, 9);
              border: 2px solid rgb(1, 1, 1);
            }

            .opoints-day-item-success {
              background: linear-gradient(
                to right,
                rgb(255, 195, 17),
                rgb(243, 232, 66)
              );
              color: rgb(1, 1, 1);
              font-family: GeneralSans-SemiBold;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 740px) {

  .task-orbguy-group {
    align-items: start;
    text-align: left;
  }

  #prizes-days {
    width: 100%;
    margin-top: 32px;

    .title {
      font-size: 24px;
      line-height: 28px;
      .token {
        width: 24px;
        height: 24px;
        padding: 4px;
      }
    }

    .prizes-days-card {
      padding: 12px;
      margin-top: 16px;
      .task-card-title {
        display: block;
        .label {
          font-size: 16px;
        }
        .value {
          font-size: 14px;
          justify-content: flex-start;
        }
      }

      .utc-time {
        text-align: left;
        font-size: 12px;
      }

      .task-item-group {
        margin-top: 16px;
      }

      .tips {
        font-size: 18px;
      }

      .task-group {
        margin-top: 24px;
        display: block;
        .task-card {
          width: 100%;
          margin-right: 0;
          .task-orbguy-info {
            padding: 8px 12px;
            .task-orbguy-info-title {
              text-align: left;
              display: block;
              .orbguy-price {
                margin-top: 4px;
              }
            }
            .task-orbguy-info-reward {
              .reward {
                font-size: 20px;
                .token-symbol {
                  width: 20px;
                  height: 20px;
                }
              }
            }
          }

          .task-orbguy-days {
            padding: 8px 0 24px;
            .task-orbguy-days-title {
              padding: 12px;
              display: block;

              .orbguy-amount {
                text-align: left;
                margin-top: 4px;
              }
            }
            .orbguy-box-group {
              width: calc(100% - 16px);
              .orbguy-box {
                margin-left: 12px;
              }
            }
          }
        }

        .opoints-card {
          margin-top: 16px;
          .my-opoints {
            padding: 8px 12px;
          }
          .opoints-progress-group {
            padding: 8px 12px 16px;
          }
        }
      }
    }
  }
}
</style>
