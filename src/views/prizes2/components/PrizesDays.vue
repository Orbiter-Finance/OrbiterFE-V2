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
        <div class="orbguy-reward">Your Rewards: +32.59 $ORBGUY!</div>
      </div>
      <div class="orbguy-info">
        <label>
          Lucky 99th, 199th, 299th,399th,499th,599th,699th: Win $100 ORBGUy
          pack!
        </label>
        <div class="orbguy-price">1 ORBGUY ≈ 0.0000806 ETH</div>
      </div>

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

          <div class="orbguy-user-amount" :style="`left:${userLeft};`">
            <img
              :src="require('../../../assets/prizes/v2/user-group.svg')"
              style="margin-right: 2px"
              alt=""
            />
            167
          </div>
        </div>
      </div>

      <div class="tips">
        All rewards for today have been split! Make sure to join early tomorrow!
      </div>
      <div class="prizes-to-bridge">
        <div
          class="prizes-to-bridge-btn"
          :style="`opacity: ${isEnd ? '0.3' : '1'};`"
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
                  class="task-item"
                  v-for="item in item"
                  :key="item.value"
                ></div>
              </div>
              <div class="task-progress">
                <div
                  class="task-time-item"
                  v-for="item in item"
                  :key="item.value"
                >
                  {{ item.value }}
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="opoints-card">
          <div class="opoints-card-title">
            Daily Bridging,earn up to 275 O-Point!
          </div>
          <div class="opoints-group">
            <div
              class="opoints-item"
              v-for="item in opointsList"
              :key="item.days"
            ></div>
          </div>
          <div class="opoints-progress">
            <div
              class="opoints-day-item"
              v-for="item in opointsList"
              :key="item.days"
            >
              {{ item.days }} Days
            </div>
          </div>

          <div class="opoints-reward-title">O-Point Rewards</div>
          <div class="reward-info">
            <svg-icon iconName="O-Points" class="o-points-symbol"></svg-icon>
            56
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';

import { prizesV2TaskList } from '../../../composition/hooks'

import SvgIcon from '../../../components/SvgIcon/SvgIcon.vue'
import { concat } from 'ethers/lib/utils';

const INVITE_NUM = 4

export default {
  components: {
    SvgIcon,
  },
  name: 'PrizesDays',
  data() {
    return {}
  },
  computed: {
    list() {
      return new Array(8).fill(0).map((item, index) => {
        return {
          index,
          show: !!index,
          left: (index / 7.2) * 100 + '%',
        }
      })
    },
    userLeft() {
      return (167 / 750) * 100 + '%'
    },
    isEnd() {
      return true
    },
    opointsList() {
      return [
        {
          days: 3,
        },
        {
          days: 7,
        },
        {
          days: 10,
        },
        {
          days: 14,
        },
      ]
    },
    taskList() {
      return prizesV2TaskList.value
    },
    timeList() {
      const taskList = this.taskList || []
      let list = []
      let stashList = []
      taskList.forEach((item, index)=>{
        const [startDate, endDate] = item?.rule?.date || []
        const option =  {
          startTime: dayjs.utc(startDate).format("MMM.DD"),
          endTime: dayjs.utc(endDate).format("MMM.DD"),
          value: dayjs.utc(startDate).format("MMM.DD"),
          isOpen: false,
          isSuccess: true,
          isCurrent: false
        }
        if(!(index % INVITE_NUM)) {
          if(!!index) {
            list = list.concat([stashList])
          }
          stashList = [option]
        } else if(!(index === taskList.length-1)) {
          stashList = stashList.concat([option])
        } else {
          list = list.concat([stashList])
        }

      })

      return list
    },
  },
}
</script>

<style lang="scss" scoped>
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

        margin-top: 16px;
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
            background-image: url('../../../assets/prizes/v2/day-card.png');
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
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
        }

        .opoints-group {
          width: 100%;
          display: flex;
          justify-content: space-around;
          align-items: center;

          .opoints-item {
            width: 54px;
            height: 48px;
            background-image: url('../../../assets/prizes/v2/opoints43.png');
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
          .opoints-day-item {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            top: 0;
            left: 0;
            width: 50px;
            height: 20px;
            border: 2px solid rgb(1, 1, 1);
            border-radius: 999px;
            background: rgb(44, 35, 9);
            font-size: 12px;
            font-family: GeneralSans-Medium;
            line-height: 20px;
            letter-spacing: 0px;
            color: #f3ba2f;
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

    .title {
      font-size: 24px;
    }
  }
}
</style>
