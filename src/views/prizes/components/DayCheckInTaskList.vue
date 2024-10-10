<template>
  <div class="day-checkin-task-card">
    <div class="task-title">
      <div>Daliy Check-in task</div>
      <div class="update-time">Check-in update time: UTC 11:00 AM</div>
    </div>
    <div class="task-list-group">
      <div
        class="task-card-pool-group"
        v-for="item in taskPoolList"
        :key="item.reward"
        @click="openTelegram(item)"
        :class="item.isSuccess ? 'task-opoints-quest-success' : 'task-quest'"
        :style="`opacity:${
          !!item.isSuccess && !!item.isPromotion ? '0.4' : '1'
        };`"
      >
        <div class="task-card-pool">
          <div class="info">
            <svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="24.000000"
              height="24.000000"
              viewBox="0 0 24 24"
              fill="none"
            >
              <defs>
                <clipPath id="clip2425_1183">
                  <rect
                    id="X.10d54851.svg"
                    rx="6.000000"
                    width="24.000000"
                    height="24.000000"
                    fill="white"
                    fill-opacity="0"
                  />
                </clipPath>
              </defs>
              <rect
                id="X.10d54851.svg"
                rx="6.000000"
                width="24.000000"
                height="24.000000"
                fill="#031215"
                fill-opacity="1.000000"
              />
              <g clip-path="url(#clip2425_1183)">
                <path
                  id="Vector"
                  d="M8.66 3.66L8.66 6.16"
                  stroke="#FFFFFF"
                  stroke-opacity="1.000000"
                  stroke-width="1.000000"
                  stroke-linejoin="round"
                  stroke-linecap="square"
                />
                <path
                  id="Vector"
                  d="M15.33 3.66L15.33 6.16"
                  stroke="#FFFFFF"
                  stroke-opacity="1.000000"
                  stroke-width="1.000000"
                  stroke-linejoin="round"
                  stroke-linecap="square"
                />
                <path
                  id="Vector"
                  d="M4.91 9.57L19.08 9.57"
                  stroke="#FFFFFF"
                  stroke-opacity="1.000000"
                  stroke-width="1.000000"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
                <path
                  id="Vector"
                  d="M15.05 18.09C14.94 18.2 14.83 18.42 14.8 18.58L14.64 19.7C14.59 20.11 14.87 20.39 15.28 20.34L16.4 20.18C16.56 20.15 16.79 20.04 16.89 19.93L19.85 16.98C20.35 16.47 20.6 15.88 19.85 15.13C19.1 14.39 18.51 14.63 18 15.14L15.05 18.09Z"
                  stroke="#FFFFFF"
                  stroke-opacity="1.000000"
                  stroke-width="1.000000"
                  stroke-linejoin="round"
                />
                <path
                  id="Vector"
                  d="M17.58 15.56C17.83 16.46 18.53 17.16 19.43 17.41"
                  stroke="#FFFFFF"
                  stroke-opacity="1.000000"
                  stroke-width="1.000000"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
                <path
                  id="Vector"
                  d="M12 20.33L8.66 20.33C5.75 20.33 4.5 18.66 4.5 16.16L4.5 9.08C4.5 6.58 5.75 4.91 8.66 4.91L15.33 4.91C18.25 4.91 19.5 6.58 19.5 9.08L19.5 12"
                  stroke="#FFFFFF"
                  stroke-opacity="1.000000"
                  stroke-width="1.000000"
                  stroke-linejoin="round"
                  stroke-linecap="square"
                />
                <g opacity="0.000000" />
                <path
                  id="Vector"
                  d="M11.58 13L12.41 13"
                  stroke="#FFFFFF"
                  stroke-opacity="1.000000"
                  stroke-width="1.000000"
                  stroke-linejoin="round"
                  stroke-linecap="square"
                />
                <path
                  id="Vector"
                  d="M8.49 13L9.33 13"
                  stroke="#FFFFFF"
                  stroke-opacity="1.000000"
                  stroke-width="1.000000"
                  stroke-linejoin="round"
                  stroke-linecap="square"
                />
                <path
                  id="Vector"
                  d="M8.49 15.5L9.33 15.5"
                  stroke="#FFFFFF"
                  stroke-opacity="1.000000"
                  stroke-width="1.000000"
                  stroke-linejoin="round"
                  stroke-linecap="square"
                />
              </g>
            </svg>

            <div class="content-text-group">
              <span class="content-text" v-html="item.text"></span>
              <span class="content-text" v-html="item.lastText"></span>
            </div>
          </div>
          <div v-if="item.isSuccess" class="earn-nft">
            + {{ item.opoints }}
            <svg-icon class="icon" iconName="O-Points"></svg-icon>
            <div class="text">{{ $t("OPoints") }}</div>
            <svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="24.000000"
              height="24.000000"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g opacity="0.400000">
                <rect
                  rx="12.000000"
                  width="24.000000"
                  height="24.000000"
                  fill="#DDF600"
                  fill-opacity="0"
                />
                <rect
                  x="0.500000"
                  y="0.500000"
                  rx="11.500000"
                  width="23.000000"
                  height="23.000000"
                  stroke="#979797"
                  stroke-opacity="0"
                  stroke-width="1.000000"
                />
                <rect
                  x="2.000000"
                  y="2.000000"
                  rx="10.000000"
                  width="20.000000"
                  height="20.000000"
                  fill="#DDF600"
                  fill-opacity="1.000000"
                />
                <rect
                  x="2.500000"
                  y="2.500000"
                  rx="9.500000"
                  width="19.000000"
                  height="19.000000"
                  stroke="#979797"
                  stroke-opacity="0"
                  stroke-width="1.000000"
                />
                <path
                  d="M7.73 12.81L10.58 15.65L15.94 10.29"
                  stroke="#000000"
                  stroke-opacity="1.000000"
                  stroke-width="1.500000"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
              </g>
            </svg>
          </div>
          <div v-else>
            <div class="prizes-promotion">
              <div class="task-reward-laebl" :style="`color:#FFC47D;`">
                
                <span v-if="item.isU">
                  200 $USDC Extra Bonus
                </span>
                <span v-else>
                  Earn {{ item.opoints }} Opoints
                </span>
                <span class="vice">({{ item.current }}/{{ item.total }})</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="24.000000"
                height="24.000000"
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect
                  width="24.000000"
                  height="24.000000"
                  fill="#D8D8D8"
                  fill-opacity="0"
                />
                <rect
                  x="0.500000"
                  y="0.500000"
                  width="23.000000"
                  height="23.000000"
                  stroke="#979797"
                  stroke-opacity="0"
                  stroke-width="1.000000"
                />
                <path
                  d="M11.18 6.05L11.18 6.08L10.67 6.59L16.31 12.24L10.67 17.88L11.18 18.4L11.18 18.42C10.89 18.72 10.42 18.72 10.12 18.42C9.82 18.13 9.82 17.66 10.12 17.36L10.15 17.36L10.65 17.87L10.65 6.61L10.15 7.11L10.12 7.11C9.82 6.81 9.82 6.35 10.12 6.05C10.42 5.75 10.89 5.75 11.18 6.05Z"
                  fill="#D8D8D8"
                  fill-opacity="0"
                  fill-rule="evenodd"
                />
                <path
                  d="M10.65 17.89L16.31 12.24L10.65 6.58"
                  stroke="#FFFFFF"
                  stroke-opacity="1.000000"
                  stroke-width="1.500000"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isEnd" class="prizes-end-modal">End of event</div>
    </div>
  </div>
</template>

<script>
import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'

import { prizesUserList, prizesTimeEnd, prizesAchieveList } from '../../../composition/hooks'
export default {
  name: 'DayCheckInTaskList',
  computed: {
    evmAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress || ''
    },
    isEnd() {
      return prizesTimeEnd.value
    },
    userList() {
      return prizesUserList.value
    },
    achieveList() {
      return prizesAchieveList.value
    },
    userSignTotal() {
      const userList = this.userList || []
      let count = 0
      userList.forEach((item) => {
        count += !!(Number(item?.task_result) >= 3)
      })
      return count
    },
    userAchieveTotal() {
      const achieveList = this.achieveList || []
      let count = 0
      achieveList.forEach((item) => {
        count += !!(
          item?.result?.some((option)=>{
            return option?.address?.toLocaleLowerCase() === this.evmAddress?.toLocaleLowerCase()
          })
        )
      })
      return count
    },
    taskPoolList() {
      const count = this.userSignTotal
      const achieveTotal = this.userAchieveTotal
      return [
        {
          icon: 'task',
          text: `<span class='orbiter_global_prizes_tx-color'>Bridge ≥3 TX</span> for <span class='orbiter_global_prizes_tx-color'>7 Days</span>`,
          specificChain: false,
          isPromotion: Number(count) >= 7,
          isSuccess: Number(count) >= 7,
          lastText: '',
          opoints: 150,
          total: 7,
          current: Number(count) >= 7 ? 7 : count,
        },
        {
          icon: 'task',
          text: `<span class='orbiter_global_prizes_tx-color'>Bridge ≥3 TX</span> for <span class='orbiter_global_prizes_tx-color'>14 Days</span>`,
          specificChain: false,
          isPromotion: Number(count) >= 14,
          isSuccess: Number(count) >= 14,
          lastText: '',
          opoints: 450,
          total: 14,
          current: count,
        },
        {
          icon: 'task',
          text: `<span class='orbiter_global_prizes_tx-color'>Bridge ≥3000 TX</span> each day to achieve  <span class='orbiter_global_prizes_tx-color'>Top 5</span> fastest trader`,
          specificChain: false,
          isPromotion: false,
          isSuccess:false,
          lastText: '',
          isU: true,
          opoints: 420,
          total: 15,
          current: achieveTotal,
        },
      ]
    },
  },
  methods: {
    openTelegram(option) {
      const address = this.evmAddress
      if (!address || address === '0x' || this.isEnd) return
      const name = 'PRIZES_V7_BANNER_TO_BRIDGE'
      this.$gtag.event(name, {
        event_category: name,
        event_label: 'to home',
      })
      localStorage.setItem(
        'last_page_before_history',
        JSON.stringify({
          params: {},
          path: '/',
          query: { source: 'Ethereum', dest: 'Optimism', token: 'ETH' },
        })
      )

      const url = location.origin + '/?source=Ethereum&dest=Optimism&token=ETH'

      window.open(url, '_self')
    },
  },
}
</script>

<style scoped lang="scss">
.day-checkin-task-card {
  width: 100%;
  .task-title {
    font-size: 20px;
    font-family: GeneralSans-SemiBold;
    letter-spacing: 0px;
    text-align: left;
    padding: 24px 0 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .update-time {
      white-space: nowrap;
      font-size: 12px;
      font-family: GeneralSans-Regular;
    }
  }
  .task-list-group {
    width: 100%;
    position: relative;
    top: 0;
    left: 0;
    .prizes-end-modal {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      border: 2px solid rgb(34, 34, 34);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      background: rgba(26, 26, 26, 0.4);
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: GeneralSans-SemiBold;
      font-family: GeneralSans-SemiBold;
    }
    .task-card-options-group {
      width: 100%;
      background: #0a1618;
      margin-top: 12px;
      border-radius: 12px;
      cursor: pointer;
      border: 1px solid transparent;
      padding: 16px;
      .task-card-options {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .info {
          display: flex;
          justify-content: start;
          align-items: center;
          .icon {
            width: 24px;
            height: 24px;
          }
          .content-text-group {
            display: flex;
            justify-content: start;
            align-items: center;
            flex-wrap: wrap;
            text-align: left;
            span {
              white-space: nowrap;
            }
            .content-text {
              font-size: 16px;
              font-family: GeneralSans-Medium;
              letter-spacing: 0px;
              text-align: left;
              margin: 0 4px;
            }
            .tip-text {
              margin-right: 4px;
            }
          }
        }
        .reward {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          font-size: 16px;
          font-family: GeneralSans-SemiBold;
          letter-spacing: 0px;
          text-align: right;
          .reward-info {
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
          .reward-status {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-left: 6px;
          }
        }
      }
      .reward-info-mobile-group {
        width: 100%;
        display: none;
        justify-content: start;
        align-items: center;
        margin-top: 8px;
        font-size: 12px;
        .reward-info-mobile {
          display: flex;
          justify-content: start;
          align-items: center;
          padding: 4px 8px;
          border-radius: 4px;
          background: rgb(0, 0, 0);
          img {
            width: 16px;
            height: 16px;
          }
        }
      }
    }
    .task-card-pool-group.task-quest {
      background: rgba(255, 196, 125, 0.1);
    }
    .task-card-pool-group.task-opoints-quest-success {
      background: rgb(10, 22, 24);
      backdrop-filter: blur(12px);
    }
    .task-card-pool-group.task-card-options-group-success {
      border: 1px solid rgb(255, 196, 125);
      border-radius: 12px;
      backdrop-filter: blur(12px);
      background: rgb(255, 196, 125, 0.15);
    }
    .task-card-pool-group {
      width: 100%;
      padding: 16px;
      background: rgb(10, 22, 24);
      margin-top: 12px;
      border-radius: 12px;
      cursor: pointer;
      border: 1px solid transparent;
      .task-card-pool {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .info {
          display: flex;
          justify-content: start;
          align-items: center;
          .icon {
            width: 24px;
            height: 24px;
          }
          .content-text-group {
            .content-text {
              font-size: 16px;
              font-family: GeneralSans-Medium;
              letter-spacing: 0px;
              text-align: left;
              margin: 0 4px;
            }
            .tip-text {
              margin-right: 4px;
            }
          }
        }
        .pool-reward {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          font-size: 16px;
          font-family: GeneralSans-SemiBold;
          letter-spacing: 0px;
          text-align: right;
        }
        .prizes-promotion {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          color: #ffff;
          .task-reward-laebl {
            font-size: 16px;
            font-family: GeneralSans-SemiBold;
            .vice {
              color: rgba(255, 255, 255, 0.4);
              font-family: GeneralSans-Medium;
            }
          }
          svg {
            width: 24px;
            height: 24px;
          }
        }

        .earn-nft {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          font-family: GeneralSans-SemiBold;
          border-radius: 4px;
          backdrop-filter: blur(156px);
          .icon {
            width: 24px;
            height: 24px;
            margin-left: 4px;
          }
          .text {
            margin: 0 4px;
          }
        }
      }
    }
    .task-card-pool-group-promotion {
      opacity: 0.6;
    }
  }
}
</style>
