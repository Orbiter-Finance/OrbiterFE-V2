<template>
  <div id="lucky-task-card-group" class="lucky-task-card-group">
    <div class="task-card-group">
      <div class="task-card-title">
        <svg-icon class="task-icon" :iconName="icon"></svg-icon>
        <div v-html="title"></div>
      </div>
      <div class="task-reward" @click="claimCall">
        <!-- MY Rewards: <svg-icon class="task-icon" iconName="ORBGUY"></svg-icon>
        <span class="reward-amount">{{ reward }} $ORBGUY</span> -->
        <!-- In the statistics... -->
        Claim
      </div>
      <!-- <div class="task-card-item">
        <div class="task-title">
          <div class="task-info">
            <svg-icon class="task-icon" iconName="task-icon"></svg-icon>
            <div class="task-desction-group">
              <span class="task-desction"> Bridge 3Tx daily From </span>
              <o-tooltip>
                <template v-slot:titleDesc>
                  <div style="margin-left: -20px">
                    <span>
                      <span>Specific networks include: </span>
                      <br />
                      Mint、BSC、Optimisim、BOB、Optopia、Fuse、Arbitrum、Polygon、Linea、Zircuit、Alienxchain、Cyber、Blast
                    </span>
                  </div>
                </template>
                <span class="orbiter_global_prizes_tips_underline tip-text"
                  >specific network</span
                >
              </o-tooltip>
              <span>to Scroll</span>
            </div>
          </div>
        </div>
        <div class="task-details">
          <div class="task-amount-group">
            <div
              class="task-orbguy-amount"
              v-for="(item, idx) in taskList"
              :key="idx"
            >
              <svg-icon class="task-icon" iconName="ORBGUY"></svg-icon> +{{
                item.amount
              }}
            </div>
          </div>
          <div class="task-progress-group">
            <div class="task-progress-box">
              <div class="progress-bg" :style="`width: ${ratio};`">
                <div class="skeleton"></div>
              </div>
            </div>
            <div class="task-sign-group">
              <div
                :class="`task-sign${
                  item.isSuccess ? ' task-sign-success' : ''
                }`"
                v-for="(item, idx) in taskList"
                :key="idx"
              >
                <svg
                  class="success-icon"
                  v-if="item.isSuccess"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 25.0831 22.791"
                  fill="none"
                >
                  <defs>
                    <filter
                      id="filter_2093_1362_dd"
                      x="0.000000"
                      y="0.000000"
                      width="25.083107"
                      height="22.791016"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dx="0" dy="0" />
                      <feGaussianBlur stdDeviation="2.66667" />
                      <feComposite
                        in2="hardAlpha"
                        operator="out"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.95294 0 0 0 0 0.72941 0 0 0 0 0.18431 0 0 0 0.6 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect_dropShadow_1"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect_dropShadow_1"
                        result="shape"
                      />
                    </filter>
                  </defs>
                  <g filter="url(#filter_2093_1362_dd)">
                    <path
                      d="M9.16 10.77L11.25 12.86L15.91 8.2C16.18 7.93 16.61 7.93 16.88 8.2C17.15 8.47 17.15 8.89 16.88 9.16L11.25 14.79L8.2 11.73C7.93 11.46 7.93 11.04 8.2 10.77C8.47 10.5 8.89 10.5 9.16 10.77Z"
                      fill="#FFFFFF"
                      fill-opacity="1.000000"
                      fill-rule="evenodd"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div class="task-days-group">
            <div
              :class="`task-day-amount${
                item.isSuccess ? ' task-day-amount-success' : ''
              }`"
              v-for="(item, idx) in taskList"
              :key="idx"
            >
              {{ item.current }}/{{ item.total }}
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { decimalNum } from '../../../util/decimalNum'
import { questsUserInfoList } from '../../../composition/hooks'
import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'

import SvgIcon from '../../SvgIcon/SvgIcon.vue'
import dayjs from 'dayjs'

export default {
  components: {
    SvgIcon,
  },
  props: {
    dataInfo: Object,
  },
  name: 'CheckInTaskCard',
  data() {
    return {
      price: '',
    }
  },
  computed: {
    currentEvmAddress() {
      return compatibleGlobalWalletConf?.value?.walletPayload?.walletAddress
    },
    questsUserList() {
      return questsUserInfoList.value
    },
    currentUserInfo() {
      const list = this.questsUserList || []
      const option = list.filter((item) => this.id === item.projectId)?.[0]
      return option || null
    },
    userRecordsList() {
      const list = this.currentUserInfo?.records || []

      return list.slice(0, list.length - 1)
    },
    title() {
      return this.dataInfo.name
    },
    icon() {
      return this.dataInfo.icon
    },
    taskInfo() {
      const list = this.dataInfo.tasks || []
      return list.slice(0, list.length - 1)
    },
    signDaysAmount() {
      const list = this.userRecordsList || []
      let count = 0
      list.forEach((item) => {
        if (item.task_result >= 3) {
          count += 1
        }
      })
      return count

    },
    reward() {
      const list = this.userRecordsList || []
      let count = 0
      list.forEach((item) => {
        const list = JSON.parse(item.distribute_result || JSON.stringify([]))
        const data = list.filter(
          (option) => option.name.toLocaleLowerCase() === 'orbguy'
        )[0]
        count += Number(data?.amount) || 0
      })

      return count ? count : '--'
    },
    ratio() {
      const amount = this.signDaysAmount
      let ratio = ((amount || 0) / 7) * 100
      ratio = ratio >= 100 ? 100 : ratio
      return decimalNum(ratio, 4) + '%'
    },
    id() {
      return this.dataInfo.id
    },
    taskList() {
      const amount = this.signDaysAmount
      const rewards = this.taskInfo?.[0]?.rewards || []
      const userList = this.userRecordsList || []

      const option = rewards.filter(
        (item) => item?.rule?.name === 'orbguy'
      )?.[0]

      const list = option?.rule?.timesWithRewardList || []

      const taskResultList = userList
        .map((item) => {
          const taskId = item.task_id
          const option =
            this.taskInfo.filter((option) => option?.id === taskId)?.[0] || {}
          const [_, endDate] = option?.rule?.date || []
          const endTime = +dayjs.utc(endDate)
          const now = +dayjs()
          const flag = item.task_result >= 3 || now <= endTime
          return flag ? item.task_result : 0
        })
        .filter((item) => !!Number(item))

      return list
        .map((item, index) => {
          const task = this.taskInfo?.[index] || {}
          return {
            amount: item?.rewardAmount,
            times: item.times,
            id: task.id,
          }
        })
        .map((item, index) => {
          const current = Number(taskResultList[index] || 0)
          return {
            ...item,
            current,
            total: 3,
            isSuccess: item.times <= amount,
          }
        })
    },
    selectWalletDialogVisible() {
      return actDialogVisible.value
    },
  },
  methods: {
    claimCall() {
      const evmAddress = this.currentEvmAddress
      if (!evmAddress || evmAddress === '0x') return
      const name = 'CLAIM_REWARD_AABANK_SIGN_7DAYS'
      const url = 'https://www.aabank.xyz/claim?from=orbiter&user=' + evmAddress
      this.$gtag.event(name, {
        event_category: name,
        event_label: evmAddress,
      })
      window.open(url, '_blank')
      return
    },
  },
}
</script>

<style lang="scss" scoped>
.lucky-task-card-group {
  width: 100%;

  .task-card-group {
    width: 100%;
    padding: 12px;
    margin: 12px 16px;
    width: calc(100% - 32px);
    background: #f5f5f5;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .task-card-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;
      font-family: GeneralSans-Bold;
      white-space: nowrap;
      .task-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        margin-right: 6px;
      }
      .tip-text {
        margin-right: 4px;
      }
    }

    .task-reward {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0px;
      font-family: GeneralSans-SemiBold;
      background-color: #FFC47D;
      color: #222222;
      white-space: nowrap;
      padding: 6px 16px;
      border-radius: 6px;
      cursor: pointer;
      .task-icon {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
      .reward-amount {
        font-size: 12px;
        font-family: GeneralSans-SemiBold;
        line-height: 16px;
        letter-spacing: 0px;
        color: #ab46d6;
      }
    }
    .task-card-item {
      width: 100%;
      border-radius: 8px;
      background-color: #fff;
      margin-top: 8px;
      padding: 12px;
      text-align: left;

      .task-title {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: start;
        .task-info {
          display: flex;
          justify-content: start;
          align-items: start;
          .task-icon {
            width: 20px;
            height: 20px;
            margin-right: 8px;
          }
          .task-desction-group {
            font-size: 14px;
            font-weight: 700;
            line-height: 20px;
            .tip-text {
              margin-right: 4px;
            }
          }
        }
      }

      .task-details {
        width: 100%;
        margin-top: 12px;
        .task-amount-group {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .task-orbguy-amount {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            font-family: GeneralSans-Medium;
            line-height: 16px;
            letter-spacing: 0px;
            text-align: left;
            .task-icon {
              width: 12px;
              height: 12px;
              margin-right: 1px;
            }
          }
        }
        .task-progress-group {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 10px 0;
          position: relative;
          top: 0;
          left: 0;
          .task-progress-box {
            width: 100%;
            background-color: #f5f5f5;
            height: 8px;
            border-radius: 99px;
            overflow: hidden;
            .progress-bg {
              height: 8px;
              border-radius: 99px;
              background: #ff1c09;
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

          .task-sign-group {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            transform: translate(-50%, -50%);
            padding: 0 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .task-sign {
              width: 20px;
              height: 20px;
              border: 1px solid #ffffff;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #f5f5f5;
              .success-icon {
                width: 20px;
                height: 20px;
              }
            }
            .task-sign-success {
              background-color: #ff1c09;
            }
          }
        }
        .task-days-group {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .task-day-amount {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            font-family: GeneralSans-Regular;
            line-height: 16px;
            letter-spacing: 0px;
            text-align: left;
            color: #999999;

            .task-icon {
              width: 12px;
              height: 12px;
              margin-right: 1px;
            }
          }
          .task-day-amount-success {
            color: #222222;
            font-family: GeneralSans-Medium;
          }
        }
      }
    }
  }
}

.dark-theme {
  #lucky-task-card-group {
    .task-card-group {
      background-color: #373951;
      .task-card-item {
        background-color: var(--dark-page-box-bg);

        .task-details {
          .task-progress-group {
            .task-progress-box {
              background-color: #28293d;
            }
            .task-sign {
              border: 1px solid var(--dark-page-box-bg);
              background-color: #28293d;
            }
            .task-sign-success {
              background-color: #ff1c09;
            }
          }
          .task-days-group {
            .task-day-amount-success {
              color: #dddddd;
            }
          }
        }
      }
    }
  }
}
</style>
