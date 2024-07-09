<template>
  <div 
  @click="goToPrizes"
  id="task-prizes-card" class="task-prizes-card">
    <div class="card-title">
      <div class="title-info">
        <svg-icon iconName="42161" class="task-icon"></svg-icon>
        <div class="label"><span>$100,000</span> Prize Pool</div>
      </div>
      <!-- <div v-if="isEnd" class="time-end-label">In the statistics...</div> -->
      <div v-if="isEnd" class="time-end-label">Claim</div>
      <div v-else class="time">
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
            stroke="rgba(255,255,255,0.6)"
            stroke-opacity="1.000000"
            stroke-width="1.000000"
            stroke-linejoin="round"
          />
          <path
            id="Vector"
            d="M10.47 10.12L8.4 8.88C8.04 8.67 7.75 8.16 7.75 7.74L7.75 5"
            stroke="rgba(255,255,255,0.6)"
            stroke-opacity="1.000000"
            stroke-width="1.000000"
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
    </div>
    <!-- <div
      class="task-card-options-group"
      v-for="item in taskOptionsList"
      :key="item.reward"
      :class="item.isSuccess ? 'task-card-options-group-success' : ''"
      :style="`opacity:${item.isPromotion ? '0.6' : '1'}`"
    >
      <div class="task-title">
        <div class="task-info">
          <svg
            v-if="item.type === 'TG'"
            class="task-icon"
            data-v-9dcf37f8=""
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="16.000000"
            height="16.000000"
            viewBox="0 0 16 16"
            fill="none"
          >
            <defs data-v-9dcf37f8="">
              <clipPath data-v-9dcf37f8="" id="clip812_520">
                <rect
                  data-v-9dcf37f8=""
                  id="telegram.19a5a5db.svg"
                  rx="4.000000"
                  width="16.000000"
                  height="16.000000"
                  fill="white"
                  fill-opacity="0"
                ></rect>
              </clipPath>
            </defs>
            <rect
              data-v-9dcf37f8=""
              id="telegram.19a5a5db.svg"
              rx="4.000000"
              width="16.000000"
              height="16.000000"
              fill="#279EFF"
              fill-opacity="1.000000"
            ></rect>
            <g data-v-9dcf37f8="" clip-path="url(#clip812_520)">
              <path
                data-v-9dcf37f8=""
                id="Vector"
                d="M12.97 4.75L11.46 11.88C11.34 12.38 11.05 12.5 10.63 12.27L8.33 10.57L7.22 11.63C7.16 11.7 7.09 11.75 7.01 11.79C6.93 11.83 6.84 11.85 6.75 11.85L6.92 9.51L11.18 5.69C11.37 5.52 11.14 5.43 10.89 5.6L5.62 8.9L3.36 8.19C2.86 8.03 2.85 7.7 3.46 7.46L12.33 4.04C12.74 3.89 13.1 4.13 12.97 4.75Z"
                fill="#FFFFFF"
                fill-opacity="1.000000"
                fill-rule="evenodd"
              ></path>
            </g>
          </svg>
          <svg-icon v-else class="task-icon" iconName="task-icon"></svg-icon>
          <div class="task-desction-group">
            <span class="task-desction" v-html="item.text"></span>
            <o-tooltip v-if="item.specificChain">
              <template v-slot:titleDesc>
                <div style="margin-left: -20px">
                  <span>
                    <span>Specific chains include: </span>
                    <br />
                    Blast, Optopia, ZKFair, Mode, zkLink Nova, Zora, Manta,
                    Mantle, Polygon, Scroll, OPBNB, zkSync Lite, Arbitrum Nova,
                    Proof of Play Apex, BSC, BOB, zkSync Era, Taiko, BEVM,
                    Merlin
                  </span>
                </div>
              </template>
              <span class="orbiter_global_prizes_tips_underline tip-text"
                >specific chain</span
              >
            </o-tooltip>
            <span v-if="item.specificChain">to Arbitrum</span>
          </div>
        </div>
        <PrizesTaskSuccessIcon
          class="task-success-icon"
          v-if="!!item.isSuccess"
          :fillColor="'#DDF600'"
        ></PrizesTaskSuccessIcon>
      </div>
      <div class="task-tag">
        <div class="tag-card">
          {{ item.reward }}
          <svg-icon class="options-symbol" iconName="O-Points"></svg-icon>
          OPoints
        </div>
      </div>
    </div>
    <div
      class="task-card-pool-group"
      v-for="item in taskPoolList"
      :key="item.reward"
      :class="item.isSuccess ? 'task-card-options-group-success' : ''"
      :style="`opacity:${item.isPromotion ? '0.6' : '1'};border:${
        item.isSuccess && !item.isPromotion
          ? '1px solid ' + item.color
          : '0 none'
      }`"
    >
      <div class="task-title">
        <div class="task-info">
          <svg-icon class="task-icon" iconName="task-icon"></svg-icon>

          <div class="task-desction-group">
            <span class="task-desction" v-html="item.text"></span>
            <o-tooltip v-if="item.specificChain">
              <template v-slot:titleDesc>
                <div style="margin-left: -20px">
                  <span>
                    <span>Specific chains include: </span>
                    <br />
                    Blast, Optopia, ZKFair, Mode, zkLink Nova, Zora, Manta,
                    Mantle, Polygon, Scroll, OPBNB, zkSync Lite, Arbitrum Nova,
                    Proof of Play Apex, BSC, BOB, zkSync Era, Taiko, BEVM,
                    Merlin
                  </span>
                </div>
              </template>
              <span class="orbiter_global_prizes_tips_underline tip-text"
                >specific chain</span
              >
            </o-tooltip>
            <span v-if="item.specificChain">to Arbitrum</span>
          </div>
        </div>
        <PrizesTaskSuccessIcon
          class="task-success-icon"
          v-if="!!item.isSuccess"
          :fillColor="item.color"
        ></PrizesTaskSuccessIcon>
      </div>
      <div class="task-tag">
        <div v-if="item.isPromotion" class="promotion">
          Already entered in higher stage pools
        </div>
        <div
          v-else
          class="tag-card"
          :style="`background-color: ${item.color};`"
        >
          {{ item.reward }}
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import getUTCTime from '../../util/time'

import { decimalNum } from '../../util/decimalNum'
import PrizesTaskSuccessIcon from '../../views/prizes/components/PrizesTaskSuccess.vue'

import SvgIcon from '../SvgIcon/SvgIcon.vue'

import {
  prizesUserIsJoinTelegram,
  prizesUserTelegramId,
  prizesUserReward,
  prizesTop100tx,
  prizesUserRank,
  prizesUserTx,
} from '../../composition/hooks'
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'

const ratio10 = '#DBEF2D'
const ratio15 = '#FF29DA'
const ratio20 = '#A862EA'
const ratio25 = '#00EEEE'
const ratio30 = '#FFA629'

let timer1

export default {
  components: { SvgIcon },
  name: 'PrizesCard',
  data() {
    return {
      timeStr: '2024-06-20T13:30:00.000Z',
      timeList: [],
      isEnd: false
    }
  },
  components: {
    PrizesTaskSuccessIcon,
  },
  computed: {
    isJoinTelegram() {
      return prizesUserIsJoinTelegram.value
    },
    telegramId() {
      return prizesUserTelegramId.value
    },
    reward() {
      return prizesUserReward.value
    },
    top100Tx() {
      return prizesTop100tx.value
    },
    tx() {
      return prizesUserTx.value
    },
    rank() {
      return prizesUserRank.value
    },
    userRanking() {
      return this.rank
    },
    txAmount() {
      return this.tx
    },
    taskOptionsList() {
      const txN = this.txAmount
      return [
        {
          icon: 'telegram',
          text: `Join Orbiter Telegram`,
          reward: '+3',
          type: 'TG',
          isSuccess: !!this.isJoinTelegram,
          isPromotion: txN >= 1 && !!this.isJoinTelegram,
        },
        {
          icon: 'bridge',
          text: `Bridge <span class="orbiter_global_prizes_tx-color">1 TX</span> `,
          specificChain: true,
          reward: '+5',
          isSuccess: txN >= 1,
          isPromotion: txN >= 2,
        },
        {
          icon: 'bridge',
          text: `Bridge <span class="orbiter_global_prizes_tx-color">2 TX</span>`,
          specificChain: true,
          reward: '+12',
          isSuccess: true,
          isSuccess: txN >= 2,
          isPromotion: txN >= 3,
        },
      ]
    },
    taskPoolList() {
      const txN = this.txAmount
      const rankN = this.rank
      return [
        {
          icon: 'bridge',
          text: `Bridge <span class="orbiter_global_prizes_tx-color">3 TX</span>`,
          specificChain: true,
          reward: '10% Prize Pool',
          color: ratio10,
          isSuccess: txN >= 3,
          isPromotion: txN >= 5,
        },
        {
          icon: 'bridge',
          text: `Bridge <span class="orbiter_global_prizes_tx-color">5 TX</span>`,
          specificChain: true,
          reward: '15% Prize Pool',
          color: ratio15,
          isSuccess: txN >= 5,
          isPromotion: txN >= 8,
        },
        {
          icon: 'bridge',
          text: `Bridge <span class="orbiter_global_prizes_tx-color">8 TX</span>`,
          specificChain: true,
          reward: '20% Prize Pool',
          color: ratio20,
          isSuccess: txN >= 8,
          isPromotion: txN >= 15,
        },
        {
          icon: 'bridge',
          text: `Bridge <span class="orbiter_global_prizes_tx-color">15 TX</span>`,
          specificChain: true,
          reward: '25% Prize Pool',
          color: ratio25,
          isSuccess: txN >= 15,
          isPromotion: txN >= 20 && Number(rankN) && Number(rankN) <= 100,
        },
        {
          icon: 'bridge',
          text: `Bridge ≥20 TX from specific network to Arbitrum <span class="orbiter_global_prizes_tx-color">Top 100 users </span>`,
          reward: '30% Prize Pool',
          color: ratio30,
          isSuccess: txN >= 20 && Number(rankN) && Number(rankN) <= 100,
        },
      ]
    },
    evmAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress || ''
    },
  },
  methods: {
    goToPrizes() {
      this.$gtag.event("OPointsGoToPrizes", {
        event_category: "OPointsGoToPrizes",
        event_label: "o points modal task go to prizes",
      })
      this.$router.push("/prizes")
    },
    async getUserReward() {
      if (!this.evmAddress || this.evmAddress === '0x') return
      this.$store.commit(
        'getPrizesuserInfo',
        this.evmAddress.toLocaleLowerCase()
      )
    },
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
    getUTCTime1(str) {
      let d1 = new Date(str)
      let d2 = new Date(
        d1.getUTCFullYear(),
        d1.getUTCMonth(),
        d1.getUTCDate(),
        d1.getUTCHours(),
        d1.getUTCMinutes(),
        d1.getUTCSeconds()
      )
      return Date.parse(d2)
    },
  },
  mounted() {
    timer1 = setInterval(() => {
      const t = this.getUTCTime1(this.timeStr)
      const timeS = Math.floor((t - getUTCTime()) / 1000)
      let time = timeS
      if (timeS <= 0) {
        clearInterval(timer1)
        this.isEnd =  true
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
  },
  watch: {
    evmAddress(item1, item2) {
      if (!!item1 && item1 !== item2) {
        this.getUserReward()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.task-prizes-card {
  margin: 12px 16px;
  padding: 12px;
  width: calc(100% - 32px);
  // background-color: #f5f5f5;
  border-radius: 12px;
  box-sizing: border-box;
  border: 1px solid rgb(18, 170, 255);
  border-radius: 12px;
  box-shadow: inset 0px 0px 24px 0px rgb(18, 170, 255);
  background: rgb(0, 0, 0);
  color: #FFF;
  cursor: pointer;

  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title-info {
      display: flex;
      justify-content: start;
      align-items: center;

      .task-icon {
        width: 20px;
        height: 20px;
        margin-right: 6px;
      }

      .label {
        font-size: 14px;
        font-weight: 700;
        line-height: 19px;
        letter-spacing: 0px;
        white-space: nowrap;
        span {
          color: #12AAFF;
        }
      }
    }

    .time-end-label {
      font-size: 14px;
      font-weight: 700;
      line-height: 19px;
      letter-spacing: 0px;
      white-space: nowrap;
    }

    .time {
      display: flex;
      justify-content: flex-end;
      align-items: center;

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
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
        }
      }
    }
  }

  .task-card-options-group {
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
          .task-desction {
            margin: 0 4px;
          }
          .tip-text {
            margin-right: 4px;
          }
        }
      }
    }

    .task-tag {
      width: 100%;
      display: flex;
      justify-content: start;
      align-items: center;
      margin-top: 8px;
      .tag-card {
        display: flex;
        justify-content: start;
        align-items: center;
        padding: 2px 4px;
        border-radius: 4px;
        background: rgb(245, 245, 245);
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
        .options-symbol {
          width: 16px;
          height: 16px;
          margin: 0 4px;
        }
      }
    }
  }

  .task-card-pool-group {
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
          .task-desction {
            margin: 0 4px;
          }
          .tip-text {
            margin-right: 4px;
          }
        }
      }
    }
    .task-tag {
      width: 100%;
      display: flex;
      justify-content: start;
      align-items: center;
      margin-top: 8px;
      .tag-card {
        display: flex;
        justify-content: start;
        align-items: center;
        padding: 2px 4px;
        border-radius: 4px;
        background: rgb(245, 245, 245);
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
        .options-symbol {
          width: 16px;
          height: 16px;
          margin: 0 4px;
        }
      }

      .promotion {
        white-space: nowrap;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0px;
      }
    }
  }
}

.dark-theme {
  #task-prizes-card {
    background-color: #373951;
    .task-card-options-group {
      background-color: var(--dark-page-box-bg);
      .tag-card {
        background-color: #222;
      }
    }

    .task-card-pool-group {
      background-color: var(--dark-page-box-bg);
      .tag-card {
        background-color: #222;
      }
    }
  }
}
</style>
