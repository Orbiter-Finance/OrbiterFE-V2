<template>
  <div id="prizes-days" class="prizes-days">
    <div class="title">
      3Tx a Day, <span class="token-symbol">200k ORBGUY</span> Comes your Way!
    </div>
    <div class="prizes-days-card">
      <div class="card-tilte">
        <div class="left">
          <label>Split among the first 700 users each day</label>
          <div class="fcfs"></div>
        </div>
        <div class="orbguy-reward">
          Your Rewards: +{{ totalOrbguy }}
          <svg-icon class="token-symbol-icon" iconName="ORBGUY"></svg-icon>
          $ORBGUY!
        </div>
      </div>
      <div class="orbguy-info-mobile">
        <label>
          Lucky 99th, 199th, 299th,399th,499th,599th,699th: Win $100 ORBGUy
          pack!
        </label>
        <div class="orbguy-reward">
          Your Rewards: +{{ totalOrbguy }}
          <svg-icon class="token-symbol-icon" iconName="ORBGUY"></svg-icon>
          $ORBGUY!
        </div>
      </div>
      <div class="orbguy-info">
        <label>
          Lucky 99th, 199th, 299th,399th,499th,599th,699th: Win $100 ORBGUy
          pack!
        </label>
        <div @click="openLikwidSwap" class="orbguy-price">1 ORBGUY ≈ {{ price }} ETH</div>
      </div>

      <div class="orbguy-box-group">
        <div class="orbguy-box">
          <div class="orbguy-progress-amount">
            <template v-for="item in list">
              <div
                class="orbguy-progress-amount-item"
                v-if="item.show"
                :key="item.index"
                :style="`left:${item.left};`"
              >
                {{ item.index }}00
              </div>
            </template>
          </div>
          <div class="orbguy-progress">
            <div
              class="progress-box"
              :style="`width: calc(${userLeft} - 3px)`"
            ></div>
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

      <div v-if="!!isDayEnd" class="tips">
        All rewards for today have been split! Make sure to join early tomorrow!
      </div>
      <div
        :class="`${
          isDayEnd ? 'prizes-to-bridge' : 'prizes-to-bridge prizes-day-not-end'
        }`"
      >
        <div
          :class="`${isDraw ? 'prizes-to-bridge-animation' :''} prizes-to-bridge-btn`"
          :style="`opacity: ${isDraw ? '1' : '0.3'};`"
          @click="openORBGUYReward"
        >
          <img
            class="draw-card"
            :src="require('../../../assets/prizes/v2/draw-card.png')"
            style="margin-right: 2px"
            alt=""
          />
          Lucky Draw
        </div>
      </div>

      <div class="task-group">
        <div class="task-card">
          <div class="task-card-title">
            Daily Bridging,earn up to 275 O-Point!
          </div>
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
                  {{ option.value }}
                  <span v-if="option.isCurrent && !option.isSuccess"
                    >({{ option.txAmount }}/3)</span
                  >
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="opoints-card">
          <div class="opoints-card-title">
            Your have checked in for
            <span class="days">{{ signDays }}</span> days
          </div>
          <div class="opoints-group">
            <div
              class="opoints-item"
              v-for="item in opointsList"
              :key="item.days"
              :style="`background-image: url(${require(`../../../assets/prizes/v2/opoints${item.reward}.png`)});`"
            ></div>
          </div>
          <div class="opoints-progress">
            <div
              :class="`opoints-day-item ${
                item.isSuccess
                  ? ' opoints-day-item-success'
                  : 'opoints-day-item-base'
              }`"
              v-for="item in opointsList"
              :key="item.days"
            >
              {{ item.days }} Days
            </div>
            <div
              class="opoints-progress-box"
              :style="`width: ${opointsProgressRatio};`"
            ></div>
          </div>

          <div class="opoints-reward-title">O-Point Rewards</div>
          <div class="reward-info">
            <svg-icon iconName="O-Points" class="o-points-symbol"></svg-icon>
            {{ totalOpoints }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3'
import dayjs from 'dayjs'
const BigNumber = require('bignumber.js')
import { decimalNum } from '../../../util/decimalNum'

import {
  prizesV2TaskList,
  prizesV2ProjectTaskDetailsList,
  prizesV2UserList,
  prizesV2TotalOrbguy,
  prizesV2TimeEnd,
} from '../../../composition/hooks'
import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'

import SvgIcon from '../../../components/SvgIcon/SvgIcon.vue'
import { SIGN_MESSAGE } from '../../../const'
import { ethers } from 'ethers'

const INVITE_NUM = 7

export default {
  components: {
    SvgIcon,
  },
  name: 'PrizesDays',
  data() {
    return {
      price: '',
      isDrawLoading: false,
    }
  },
  computed: {
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
      return new Array(8).fill(0).map((item, index) => {
        return {
          index,
          show: !!(count < index * 100),
          left: (index / 7.2) * 100 + '%',
        }
      })
    },
    userLeft() {
      return ((this.taskAddressCount || 0) / 750) * 100 + '%'
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
          days: 3,
          reward: 32,
        },
        {
          days: 7,
          reward: 105,
        },
        {
          days: 10,
          reward: 165,
        },
        {
          days: 14,
          reward: 275,
        },
      ].map((item) => {
        return {
          ...item,
          isSuccess: total >= item.days,
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
      return currentOption?.taskRewardInfos?.[0]?.distributedCount
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
          txAmount: txAmount,
          className,
        }
        if (!(index % INVITE_NUM)) {
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
    isDayEnd() {
      return this.taskAddressCount >= 707
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
  },
  methods: {
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
      this.isDrawLoading = false
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
    .token-symbol {
      color: rgb(243, 186, 47);
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

    .card-tilte {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        label {
          font-size: 24px;
          font-family: GeneralSans-SemiBold;
          line-height: 32px;
          letter-spacing: 0px;
          white-space: nowrap;
          margin-right: 18px;
        }

        .fcfs {
          width: 74px;
          height: 28px;
          background-image: url('../../../assets/prizes/v2/fcfs.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100% 100%;
        }
      }

      .orbguy-reward {
        color: #222222;
        padding: 8px 14px;
        background-image: url('../../../assets/prizes/v2/orbguy-reward-bg.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        font-size: 16px;
        font-family: GeneralSans-SemiBold;
        line-height: 16px;
        letter-spacing: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        .token-symbol-icon {
          width: 20px;
          height: 20px;
          margin: 0 4px;
          border: 1px solid rgb(34, 34, 34);
          border-radius: 50%;
        }
      }
    }

    .orbguy-info {
      margin-top: 14px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: GeneralSans-Medium;

      label {
        color: #f3ba2f;
        font-size: 18px;
        line-height: 32px;
        letter-spacing: 0px;
      }

      .orbguy-price {
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0px;
        text-decoration: underline;
        color: rgba(#ffffff, 0.6);
      }
    }

    .orbguy-info-mobile {
      display: none;
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
          padding-top: 6px;
          width: 64px;
          height: 44px;
          background-image: url('../../../assets/prizes/v2/orbguy-user-amount.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100% 100%;

          color: #010101;
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

      .prizes-to-bridge-animation {
        animation: heartBeat 6.3s  ease-in-out infinite;
        -webkit-animation: heartBeat 6.3s  ease-in-out infinite;
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
        padding: 16px 24px;
        background-image: url('../../../assets/prizes/v2/day-card-group-bg.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        margin-right: 16px;

        .task-card-title {
          width: 100%;
          font-size: 20px;
          font-family: GeneralSans-SemiBold;
          line-height: 28px;
          letter-spacing: 0px;
          text-align: left;
        }

        .task-item-group {
          width: 100%;
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-top: 16px;

          .task-item {
            width: 48px;
            height: 48px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
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
      }

      .opoints-card {
        flex: 1;
        padding: 16px 24px;
        background-image: url('../../../assets/prizes/v2/opoints-card-bg.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        margin-right: 16px;

        .opoints-card-title {
          width: 100%;
          font-size: 20px;
          font-family: GeneralSans-SemiBold;
          line-height: 28px;
          letter-spacing: 0px;
          text-align: left;
          .days {
            color: #dea638;
          }
        }

        .opoints-group {
          width: 100%;
          display: flex;
          justify-content: space-around;
          align-items: center;

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
          justify-content: space-around;
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

        .opoints-reward-title {
          margin-top: 28px;
          font-size: 20px;
          font-family: GeneralSans-SemiBold;
          line-height: 28px;
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
    }
  }
}

@media (max-width: 740px) {
  #prizes-days {
    width: 100%;
    margin-top: 32px;

    .title {
      font-size: 24px;
      line-height: 28px;
    }

    .prizes-days-card {
      margin-top: 16px;
      padding: 12px 0;
      .card-tilte {
        width: 100%;
        display: block;
        padding: 0 12px;
        .left {
          text-align: left;
          justify-content: space-between;
          margin-right: 0;
          label {
            white-space: normal;
            font-size: 16px;
            line-height: 20px;
          }
        }

        .orbguy-reward {
          display: none;
        }
      }

      .orbguy-info-mobile {
        display: block;
        width: 100%;
        padding: 0 12px;
        label {
          color: #f3ba2f;
          font-size: 14px;
          line-height: 1.25;
          letter-spacing: 0px;
        }

        .orbguy-price {
          font-size: 16px;
          line-height: 20px;
          letter-spacing: 0px;
          text-decoration: underline;
          color: rgba(#ffffff, 0.6);
        }

        .orbguy-reward {
          margin-top: 12px;
          color: #222222;
          padding: 8px 14px;
          background-image: url('../../../assets/prizes/v2/orbguy-reward-bg.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100% 100%;
          font-size: 14px;
          font-family: GeneralSans-SemiBold;
          line-height: 16px;
          letter-spacing: 0px;
          display: flex;
          justify-content: center;
          align-items: center;
          .token-symbol-icon {
            width: 20px;
            height: 20px;
            margin: 0 4px;
            border: 1px solid rgb(34, 34, 34);
            border-radius: 50%;
          }
        }
      }

      .orbguy-info {
        display: block;
        padding: 0 12px;
        label {
          font-size: 14px;
          line-height: 1.25;
          display: none;
        }
        .orbguy-price {
          margin-top: 4px;
        }
      }

      .orbguy-box-group {
        width: 100%;
        overflow-x: auto;
        height: 96px;
        .orbguy-box {
          width: 100%;
          min-width: 750px;
          margin: 16px 12px 0;
          .orbguy-progress-amount {
            height: 24px;
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
              width: 48px;
              height: 45px;
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

      .tips {
        margin-top: 8px;
        font-size: 16px;
        line-height: 24px;
      }

      .prizes-day-not-end {
        margin-top: 16px;
      }

      .task-group {
        display: block;
        margin-top: 24px;
        padding: 0 12px;
        .task-card {
          width: 100%;
          margin-right: 0;
          padding: 8px;
          .task-card-title {
            font-size: 16px;
            line-height: 20px;
          }
          .task-item {
            width: 32px;
            height: 32px;
          }

          .task-time-item {
            font-size: 12px;
            zoom: 0.87;
            white-space: nowrap;
          }
        }
        .opoints-card {
          width: 100%;
          margin-right: 0;
          padding: 8px;
          margin-top: 8px;
          .opoints-card-title {
            font-size: 16px;
            line-height: 20px;
          }
          .opoints-reward-title {
            margin-top: 16px;
            font-size: 16px;
            line-height: 20px;
          }
          .reward-info {
            font-size: 24px;
            line-height: 32px;
            .o-points-symbol {
              width: 24px;
              height: 24px;
            }
          }
        }
      }
    }
  }
}
</style>
