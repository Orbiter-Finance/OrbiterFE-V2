<template>
  <div
    :style="{ display: isShow ? 'flex' : 'none' }"
    class="lottery-card-group-dialog"
  >
    <div class="lottery-dialog-card-container">
      <div class="lottery-dialog-card-centent">
        <div class="lottery-dialog-card-group">
          <div class="lottery-dialog-card lottery-dialog-card-animation">
            <div class="lottery-dialog-card-face">
              <div class="card-content">
                <div class="card-title">
                  10,000 $USDC Giveaway to Boost Scroll Airdrop
                </div>
                <div class="task-group-title">
                  <label>Quest</label>
                  <div class="reward-progress">
                    <svg-icon class="symbol" iconName="USDC"></svg-icon>
                    <span class="amount">${{ currentReward }}</span
                    >/${{ totalReward }}
                  </div>
                </div>
                <div v-if="!taskList.length">
                  <div
                    v-for="item in laodingList"
                    :key="item"
                    class="loading-card"
                  >
                    <div class="skeleton"></div>
                  </div>
                </div>
                <div
                  v-else
                  v-for="item in taskList"
                  :key="item.taskId"
                  class="task-item"
                >
                  <div class="task-info">
                    <div class="task-details">
                      <svg-icon class="task-icon" iconName="534352"></svg-icon>
                      <div class="info">
                        <div class="label">{{ item.label }}</div>
                      </div>
                    </div>
                    <div class="tag-list">
                      <div class="tag">{{ item.tag }}</div>
                    </div>
                  </div>
                  <div class="reward">
                    <img
                      @click="drawBag(item)"
                      v-if="item.finished && !item.reward && !!item.number"
                      class="bag"
                      :src="
                        require('../../assets/activity/points_task/bag.png')
                      "
                    />
                    <div
                      class="reward-amount"
                      v-else-if="item.finished && !item.number"
                    >
                      +4 txs 0 fee
                    </div>
                    <div class="reward-amount" v-else-if="item.reward">
                      +<span>{{ item.reward }}</span> $USDC
                    </div>
                    <div v-else>({{ item.current }}/{{ item.target }})</div>
                  </div>
                </div>

                <div class="task-group-title">Note:</div>

                <div class="rule">
                  <div class="rule-group">
                    1、Bridge from specific networks to Scroll Chain or bridge
                    from Scroll Chain to specific networks.
                  </div>
                  <div class="rule-item">
                    - Specific Chains include: Ethereum, Arbitrum, zkSync Lite,
                    Linea, Base, Polygon, Optimism, Loopring, zkSyncEra, BNB
                    Chain, Arbitrum Nova, Mantle, opBNB, X Layer, Zora, Manta,
                    Kroma, zkFair, Blast, ZetaChain, Mode, zkLink Nova, Proof of
                    Play Apex, Merlin, BEVM, BOB, Core, Bitlayer, BounceBit,
                    Optopia, Cyber, Mint, AlienxChain, Fraxtal, Zircuit, Fuse
                  </div>
                  <div class="rule-group">2、0 Bridging fee Eligibility</div>
                  <div class="rule-item">
                    - Complete the first task and click on the lucky bag to
                    activate your rebate eligibility. Your next (xx)
                    transactions will qualify for rebates, excluding gas fees.
                    All rebates will be distributed after the event ends.
                  </div>
                  <div class="rule-group">
                    3、After completing each quest, you need to click on the
                    corresponding lucky bag to claim your rewards.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="lottery-bg-1-animation"></div>
        <div class="lottery-bg-2-animation"></div>
        <div class="lottery-bg-3-animation"></div>
      </div>
      <div class="lottery-dialog-close-group">
        <div @click.self="handleHidden" class="lottery-dialog-close"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  isMobile,
  luckyModalShow,
  setLuckyModalShow,
} from '../../composition/hooks'
import { isDev } from '../../util/env'
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'
import { decimalNum } from '../../util/decimalNum'
import SvgIcon from '../SvgIcon/SvgIcon.vue'
import JoinMediaCard from './JoinMediaCard.vue'
import MediaStepCard from './MediaStepCard.vue'

export default {
  components: { SvgIcon },
  name: 'LuckyModal',
  data() {
    return {
      loading: false,
      status: 1,
      list: [],
      total: 0,
      laodingList: [0, 1, 2, 3],
      currentReward: 0,
      totalReward: 10000,
    }
  },
  components: {
    JoinMediaCard,
    MediaStepCard,
    SvgIcon,
  },
  computed: {
    currentEvmAddress() {
      return compatibleGlobalWalletConf?.value?.walletPayload?.walletAddress
    },
    isShow() {
      return luckyModalShow.value
    },
    isMobile() {
      return isMobile.value
    },
    taskList() {
      const list = this.list
      let total = this.total
      return list.map((item) => {
        let current = 0
        if (total >= Number(item.target)) {
          ;(current = Number(item.target) || 0),
            (total -= Number(item.target) || 0)
        } else {
          ;(current = total || 0), (total = 0)
        }

        return {
          ...item,
          label: `Bridge ≥ ${item.target} tx to/from scroll`,
          tag: !item?.number
            ? 'Get 0 Bridging fee Eligibility'
            : '100% get $USDC Reward',
          current,
        }
      })
    },
  },

  watch: {
    currentEvmAddress: function (newAddress) {
      if (!!newAddress) {
        this.getData()
      }
    },
    isShow: function (newStatus) {
      if (!!newStatus) {
        this.getData()
      }
    },
  },
  methods: {
    async drawBag(item) {
      if (!this.currentEvmAddress) return
      try {
        const response = await fetch(
          `${process.env.VUE_APP_OPEN_URL}${
            isDev() ? '/activity' : '/active-platform'
          }/competition/lotteryTaskReward?taskId=${item.taskId}&address=${
            this.currentEvmAddress
          }`
        )
        const res = await response.json()
        this.getData()
        if (!Number(res?.code)) {
          this.$notify.error({
            title: String(res?.messag),
            duration: 3000,
          })
        }
      } catch (error) {
        this.$notify.error({
            title: String(error?.data?.message || error?.message || error),
            duration: 3000,
        })
      }
    },
    async getData() {
      if (!this.currentEvmAddress) return
      const response = await fetch(
        `${process.env.VUE_APP_OPEN_URL}${
          isDev() ? '/activity' : '/active-platform'
        }/competition/lotteryTaskStatus?address=${this.currentEvmAddress}`
      )
      const res = await response.json()

      this.list = res?.result?.resultList || []
      this.total = Number(res?.result?.txsCount)
      this.currentReward = Number(res?.result?.totalReward)
    },
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
    handleHidden() {
      setLuckyModalShow(false)
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
@keyframes lottery-bg-empty {
  0% {
    display: none;
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 0;
    display: none;
    transform: scale(0);
  }
}

@keyframes card-show {
  0% {
    transform: scale(0);
    opacity: 0;
    display: none;
  }
  14.9% {
    transform: scale(0.2);
    display: none;
  }
  15% {
    display: block;
    transform: scale(0.2);
  }
  50% {
    transform: scale(1.2);
  }
  60% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes lottery-bg-1-animation {
  0% {
    display: none;
  }
  9.99% {
    display: none;
    opacity: 0;
    transform: scale(0.2);
  }
  10% {
    display: block;
    opacity: 1;
    transform: scale(0.2);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  90% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}

@keyframes lottery-bg-2-animation {
  0% {
    transform: scale(0);
    opacity: 1;
    display: none;
  }
  66.6% {
    transform: scale(0);
    display: none;
  }
  66.7% {
    display: block;
    transform: scale(0.2);
  }
  80% {
    transform: scale(1.2);
  }
  90% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes lottery-bg-3-animation {
  0% {
    transform: scale(0) rotate(0);
    opacity: 1;
    display: none;
  }
  66.6% {
    transform: scale(0);
    display: none;
  }
  66.7% {
    display: block;
    transform: rotate(0) scale(0.4);
  }
  95% {
    opacity: 1;
    transform: rotate(40deg) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: rotate(40deg);
  }
}

@keyframes fade-in {
  0%,
  60% {
    opacity: 0;
  }
  75%,
  100% {
    opacity: 1;
  }
}

@keyframes shine {
  to {
    // Move shine from left to right, with offset on the right based on the width of the shine - see background-size
    background-position: right -40px top 0;
  }
}

@keyframes card-rotate {
  0%,
  84%,
  88%,
  92%,
  96%,
  100% {
    transform: rotate(0);
  }
  86%,
  94% {
    transform: rotate(-15deg);
  }
  90%,
  98% {
    transform: rotate(15deg);
  }
}

.lottery-card-group-dialog {
  color: #000000;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  -webkit-transform: translate3d(-50%, -50%, 1px);
  -moz-transform: translate3d(-50%, -50%, 1px);
  -o-transform: translate3d(-50%, -50%, 1px);
  transform: translate3d(-50%, -50%, 1px);

  .lottery-dialog-card-container {
    .lottery-dialog-card-centent {
      width: 468px;
      position: relative;
      top: 0;
      left: 0;

      .lottery-dialog-card-group {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .lottery-dialog-card {
          width: 360px;
          z-index: 4;
          justify-content: center;

          .lottery-dialog-card-face {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            border: 2px solid rgb(0, 0, 0);
            border-radius: 24px;
            background: linear-gradient(
              175.64deg,
              rgb(255, 251, 236) 1.364%,
              rgb(255, 202, 170) 101.708%
            );
            padding: 24px 16px;
            font-family: GeneralSans-Medium;
            text-align: left;
            .card-content {
              height: 360px;
              width: 100%;
              max-height: 420px;
              overflow: auto;
              font-size: 14px;
              .card-title {
                text-align: center;
                font-family: GeneralSans-SemiBold;
                font-size: 18px;
                margin-bottom: -12px;
                color: #df2e2d;
              }

              .task-group-title {
                margin-top: 16px;
                font-size: 18px;
                font-family: GeneralSans-SemiBold;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .reward-progress {
                  font-size: 14px;
                  display: flex;
                  justify-content: flex-end;
                  align-items: center;
                  flex: 1;
                  .amount {
                    color: #706c6c;
                  }
                  .symbol {
                    width: 16px;
                    height: 16px;
                    margin-right: 2px;
                  }
                }
              }

              .loading-card {
                width: 100%;
                height: 24px;
                border-radius: 8px;
                background-color: #f5f5f5;
                margin-top: 8px;
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

              .task-item {
                background-color: rgba(255, 196, 125, 0.5);
                padding: 8px;
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 10px;
                .task-info {
                  .task-details {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    .task-icon {
                      width: 16px;
                      height: 16px;
                      margin-right: 4px;
                    }
                    .label {
                      display: flex;
                      justify-content: flex-start;
                      align-items: center;
                    }
                  }
                  .tag-list {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    margin-top: 2px;
                    .tag {
                      border-radius: 4px;
                      padding: 2px 4px;
                      font-size: 12px;
                      color: #262626;
                      font-family: GeneralSans-Bold;
                      zoom: 0.87;
                      background: #f3ba2f;
                    }
                  }
                }

                .reward {
                  .bag {
                    width: 30px;
                    height: 30px;

                    animation: card-rotate 4s infinite;
                    -webkit-animation: card-rotate 4s infinite;
                  }
                  .reward-amount {
                    color: #df2e2d;
                    font-family: GeneralSans-SemiBold;
                  }
                }
              }

              .rule {
                font-size: 12px;
                color: #706c6c;
                .rule-label {
                  font-size: 16px;
                }
                .rule-group {
                  margin-top: 8px;
                }
                .rule-item {
                  margin-top: 4px;
                }
              }
            }
          }
        }
      }
    }

    .lottery-dialog-close-group {
      width: 100%;
      height: 32px;
      margin-top: 16px;
      display: flex;
      justify-content: center;
      align-content: center;
      position: relative;
      top: 0;
      left: 0;
      z-index: 4;
      .lottery-dialog-close {
        width: 32px;
        height: 100%;
        background-image: url('../../assets/activity/header_lottery_card/close.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        animation: fade-in 4s forwards;
        -webkit-animation: fade-in 4s forwards;
        cursor: pointer;
      }
    }
  }

  .lottery-dialog-card-animation {
    animation: card-show 3s forwards;
    -webkit-animation: card-show 3s forwards;
  }

  .lottery-bg-1-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    background-image: url('../../assets/activity/header_lottery_card/lottery-bg-1.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    animation: lottery-bg-empty 0.525s forwards,
      lottery-bg-1-animation 3s forwards;
    -webkit-animation: lottery-bg-empty 0.525s forwards,
      lottery-bg-1-animation 3s forwards;
  }
  .lottery-bg-2-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-image: url('../../assets/activity/header_lottery_card/lottery-bg-2.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    animation: lottery-bg-empty 0.525s forwards,
      lottery-bg-2-animation 3s forwards;
    -webkit-animation: lottery-bg-empty 0.525s forwards,
      lottery-bg-2-animation 3s forwards;
  }

  .lottery-bg-3-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-image: url('../../assets/activity/header_lottery_card/lottery-bg-3.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    animation: lottery-bg-empty 0.525s forwards,
      lottery-bg-3-animation 3s forwards;
    -webkit-animation: lottery-bg-empty 0.525s forwards,
      lottery-bg-3-animation 3s forwards;
  }

  .thumbnail_1_3 {
    width: 16px;
    height: 16px;
  }
}
</style>
