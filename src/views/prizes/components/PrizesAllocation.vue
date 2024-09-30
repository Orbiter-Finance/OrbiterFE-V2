<template>
  <div id="prizes-allocation" class="prizes-allocation">
    <div class="prizes-allocation-title">
      Overall prize pool
      <br class="title-br" />
      composition and allocation
    </div>
  <PrizesCard>
    <div class="prizes-allocation-card">
      <div class="title">
        <div>My progress</div>
      </div>

      <div class="user-info">
        <div class="info-item">
          <div class="info-label">Current Rank:</div>
          <div class="info-value">{{ rank || '--' }}</div>
        </div>
        <!-- <div class="info-item">
          <div class="info-label">Estimated Earnings: </div>
          <div class="info-value">
            {{ reward }}
          </div>
        </div> -->
        <div class="info-item">
          <div class="info-label">Accumulated:</div>
          <div class="info-value">{{ tx }} Tx</div>
        </div>
      </div>

      <div class="progress-group-scroll">
        <div class="pogress-group">
          <div class="progress-ratio-group">
            <div
              class="progress-ratio-group-item"
              v-for="item in progressStage"
              :key="item.position"
              v-show="!item.disabled"
              :style="`left: ${(item.position / 20) * 100}%;`"
            >
              {{ item.reward }}
            </div>
          </div>
          <div class="pogress-box">
            <div class="progress-bar" :style="`width: ${ratio}%;`"></div>
            <div
              class="progress-stage"
              v-for="item in progressStage"
              v-show="!item.disabled"
              :key="item.position"
              :style="`left: ${(item.position / 20) * 100}%;visibility:${
                item.position ? 'visable' : 'hidden'
              };background-color:${
                item.isSuccess ? '#ffc47d' : 'rgb(40, 20, 13)'
              };`"
            ></div>
          </div>
          <div class="progress-tx-group">
            <div
              class="progress-tx-group-item"
              :style="`left: ${(item.position / 20) * 100}%;`"
              v-for="item in progressStage"
              v-show="!item.disabled"
              :key="item.position"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
      <div class="inv"></div>
      <div class="task-title">
        <div>Transaction quest</div>
        <div class="update-time">Check-in update time: UTC 11:00 AM</div>
      </div>

      <div class="task-list-group">
        <div
          class="task-card-pool-group"
          v-for="item in taskPoolList"
          :key="item.reward"
          @click="openTelegram(item)"
          :class="
            item.icon === 'bridge'
              ? !item.isSuccess || !!item.isPromotion
                ? ''
                : 'task-card-options-group-success'
              : item.isSuccess
              ? 'task-opoints-quest-success'
              : 'task-quest'
          "
          :style="`opacity:${
            !!item.isSuccess && !!item.isPromotion ? '0.4' : '1'
          };`"
        >
          <div class="task-card-pool">
            <div class="info">
              <svg-icon
                v-if="item.icon === 'bridge'"
                class="icon"
                iconName="task-icon"
              ></svg-icon>
              <svg-icon v-else class="icon" iconName="more"></svg-icon>

              <div class="content-text-group">
                <span class="content-text" v-html="item.text"></span>
                <o-tooltip v-if="item.specificChain">
                  <template v-slot:titleDesc>
                    <span style="margin-left: -20px">
                      <span>
                        <span>Specific networks include: </span>
                        <br />
                        Ethereum, Arbitrum, zkSync Lite, Linea, Base, Polygon,
                        Optimism, Loopring, zkSyncEra, BNB Chain, Arbitrum Nova,
                        Mantle, opBNB, X Layer, Zora, Manta, Kroma, zkFair,
                        Blast, ZetaChain, B² Network, Mode, zkLink Nova, Proof
                        of Play Apex, Merlin, BEVM, BOB, Core, Bitlayer,
                        BounceBit, Optopia, Cyber, Mint, AlienxChain, Fraxtal,
                        Zircuit, Fuse
                      </span>
                    </span>
                  </template>
                  <span class="orbiter_global_prizes_tips_underline tip-text">
                    Optimism Superchain
                  </span>
                </o-tooltip>
                <!-- <span v-if="item.specificChain">from/to Scroll</span> -->
                <span class="content-text" v-html="item.lastText"></span>
              </div>
            </div>
              <div v-if="item.isPromotion" class="prizes-promotion">
                Already entered in higher stage pools
              </div>
              <div v-else>
                <div class="prizes-promotion">
                  <div
                    class="task-reward-laebl"
                    :style="`color:${item.color};`"
                  >
                    {{ item.reward }}
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

      <DayCheckInTaskList></DayCheckInTaskList>
      <BridgeChainLinksCard ></BridgeChainLinksCard>
    </div>
  </PrizesCard>
  </div>
</template>

<script>
import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'
import {
  prizesUserRank,
  prizesTimeEnd,
  prizesUserList,
  prizesRankList,
  prizesTotaltx,
} from '../../../composition/hooks'
import PrizesTaskSuccessIcon from './PrizesTaskSuccess.vue'
import { decimalNum } from '../../../util/decimalNum'
import SvgIcon from '../../../components/SvgIcon/SvgIcon.vue'
import BridgeChainLinksCard from "./BridgeChainLinksCard.vue"
import DayCheckInTaskList from "./DayCheckInTaskList.vue"
import PrizesCard from "./PrizesCard.vue"

export default {
  name: 'PrizesAllocation',
  components: {
    PrizesTaskSuccessIcon,
    SvgIcon,
    BridgeChainLinksCard,
    DayCheckInTaskList,
    PrizesCard
  },
  data() {
    return {}
  },
  computed: {
    isEnd() {
      // return prizesTimeEnd.value
      return false
    },
    userList() {
      return prizesUserList.value
    },
    rankList() {
      return prizesRankList.value
    },
    top20() {
      const list = this.rankList
      return list[7]?.txAmount || 20
    },
    top100() {
      const list = this.rankList
      return list[99]?.txAmount || 20
    },
    userSignTotal() {
      const userList = this.userList || []
      let count = 0
      userList.forEach((item) => {
        count += !!Number(item?.finished)
      })
      return count
    },
    tx() {
      let count = 0
      const list = this.userList || []
      list.forEach((item) => {
        const num = Number(item?.task_result) || 0
        count += num
      })
      return count
    },
    rank() {
      const tx = this.tx
      const rank = prizesUserRank.value
      return tx >= 3 && rank ? rank : 0
    },
    evmAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress || ''
    },
    progressStage() {
      const tx = this.tx
      const rank = this.rank
      const top100 = this.top100
      const top20 = this.top20
      return [].concat([
        {
          position: 0,
          label: '0Tx',
          reward: '',
          condition: '',
          value: 0,
          isSuccess: false,
        },
        {
          img: 'ratio5.png',
          condition: 'Bridge ≥3 tx',
          position: 7,
          reward: '40%',
          label: '3Tx',
          value: 3,
          isSuccess: Number(tx) >= 3,
          color:
            'background-image: linear-gradient(180.00deg, rgb(225, 222, 217),rgb(100, 81, 81));',
        },
        {
          img: 'ratio32.png',
          reward: '35%',
          position: 13,
          condition: 'Top 100',
          label: 'Top 100',
          value: top100,
          isSuccess: Number(tx) >= 20 && Number(rank) && Number(rank) <= 100,
          color:
            'background-image: linear-gradient(180.00deg, rgb(217, 236, 235),rgb(168, 226, 239));',
        },
        {
          img: 'ratio35.png',
          reward: '25%',
          position: 20,
          condition: 'Top 8',
          label: 'Top 8',
          isComment: true,
          value: top20,
          isSuccess: Number(tx) >= 20 && Number(rank) && Number(rank) <= 8,
          color:
            'background-image: linear-gradient(180.00deg, rgb(249, 250, 228),rgb(236, 192, 49));',
        },
      ])
    },
    ratioList() {
      return this.progressStage.slice(1)
    },
    isUserRanking() {
      return this.txAmount >= 20
    },
    userRanking() {
      return this.rank
    },
    txAmount() {
      return this.tx
    },
    isRewardAmount() {
      return (
        Number(this.txAmount) >= 20 &&
        Number(this.userRanking) &&
        Number(this.userRanking) <= 100
      )
    },
    rewardAmount() {
      return Number(this.reward) ? this.decimalNumC(this.reward, 2, ',') : 0
    },
    isTxAmount() {
      return Number(this.txAmount) >= 20
    },
    tipsLabelTx() {
      return this.txAmount + 'Tx'
    },
    tipsLabel() {
      const list = this.progressStage.filter((item) => item.isSuccess) || []
      const option = list[list?.length - 1] || {}
      return option?.ratio || '--'
    },
    ratio() {
      const list = this.ratioList
      const len = list.length
      const tx = this.tx
      let count = 0
      let flag = false
      let localTx = 0
      list.forEach((item) => {
        if (item.isSuccess) {
          count = item.position
          localTx = item.value
        } else {
          if (!flag) {
            flag = true
            count += !(item.value - localTx)
              ? 0
              : ((tx - localTx) / (item.value - localTx)) *
                (item.position - count)
          }
        }
      })
      const progressRation = len > 0 ? (count / 20) * 100 : 0
      return progressRation >= 100 ? 100 : progressRation
    },
    taskPoolList() {
      const tx = this.tx
      const rank = this.rank
      const count = this.userSignTotal
      return [
        {
          icon: 'bridge',
          color: '#BC6D6A',
          reward: '40% Prize Pool',
          text: `<span class='orbiter_global_prizes_tx-color'>Bridge >=3 TX</span>`,
          specificChain: true,
          isPromotion: tx >= 8,
          isSuccess: tx >= 3,
          lastText: '',
        },
        {
          icon: 'bridge',
          color: '#A8E2EF',
          reward: '35% prize pool',
          text: `<span class='orbiter_global_prizes_tx-color'>Bridge >=20 TX</span>`,
          specificChain: true,
          isPromotion: tx >= 20 && rank <= 8,
          isSuccess: tx >= 20 && rank <= 100,
          lastText:
            "to achieve <span class='orbiter_global_prizes_tx-color'>Top 9~100</span>",
        },
        {
          icon: 'bridge',
          color: '#ECC031',
          reward: '25% prize pool',
          text: `Bridge to`,
          specificChain: true,
          isPromotion: false,
          isSuccess: tx >= 20 && rank <= 8,
          lastText:
            "to achieve <span class='orbiter_global_prizes_tx-color'>Top 8 </span>",
        },
      ]
    }
  },
  methods: {
    decimalNumC(num, decimal, delimiter, symbol) {
      return decimalNum(num, decimal, delimiter, symbol)
    },
    toGalxeBtn(option) {
      console.log('toGalxeBtn')
      // this.$gtag.event('PRIZES_V6_ERAN_NFT', {
      //   event_category: 'PRIZES_V6_ERAN_NFT',
      //   event_label: 'to galxe',
      // })
      // const link = process.env.VUE_APP_PRIZES_V5_GLAXE_LINK
      // if (link) {
      //   window.open(link, '_blank')
      // } else {
      //   this.$notify.warning({
      //     title: 'Comming Soon...',
      //     duration: 3000,
      //   })
      // }
      this.openTelegram(option)
    },
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
.prizes-allocation {
  width: 100%;
  margin-top: 80px;
  .prizes-allocation-title {
    width: 100%;
    text-align: center;
    font-size: 32px;
    font-family: GeneralSans-SemiBold;
    text-align: center;
    .title-br {
      display: none;
    }
  }
  .prizes-allocation-card {
    width: 100%;
    padding: 24px;
    border: 2px solid rgb(69, 35, 48);
    background: linear-gradient(179.63deg, rgba(239, 47, 45, 0.04) -25.193%,rgba(255, 102, 101, 0.04) 127.356%);
      background-color: #040809;
    .title {
      width: 100%;
      font-size: 20px;
      font-family: GeneralSans-SemiBold;
      text-align: left;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .marks {
        width: 183px;
        height: 32px;
        cursor: pointer;
      }
    }
    .user-info {
      width: 100%;
      display: flex;
      justify-content: start;
      align-items: center;
      font-size: 18px;
      margin-top: 16px;
      .info-item {
        display: flex;
        justify-content: start;
        align-items: center;
        font-family: GeneralSans-SemiBold;
        margin-right: 10%;
        .info-label {
          color: #fff;
          margin-right: 4px;
          white-space: nowrap;
        }
        .info-value {
          color: #ffc47d;
          white-space: nowrap;
        }
      }
    }
    .user-rank-and-reward {
      width: 100%;
      display: flex;
      justify-content: start;
      align-items: center;
      margin-top: 8px;
      flex-wrap: wrap;
      .current-rank {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 18px;
        letter-spacing: 0px;
        text-align: right;
        margin-right: 8px;
        white-space: nowrap;
        .current-ranking {
          padding-left: 4px;
          color: #ffba58;
          font-family: GeneralSans-SemiBold;
        }
      }
      .rank-reward {
        font-size: 18px;
        letter-spacing: 0px;
        text-align: right;
        white-space: nowrap;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: 8px;
        .reward-amount {
          padding-left: 4px;
          color: #ffba56;
          font-family: GeneralSans-SemiBold;
        }
      }
      .rank-tx-amount {
        font-size: 18px;
        letter-spacing: 0px;
        text-align: right;
        white-space: nowrap;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .tx-amount {
          padding-left: 4px;
          color: #ffba56;
          font-family: GeneralSans-SemiBold;
        }
      }
    }
    .progress-group-scroll {
      width: 100%;
      overflow: auto;
      .pogress-group {
        width: 100%;
        padding: 0 4px;
        min-width: 840px;
        margin: 16px 0 32px;
        font-size: 14px;
        .pogress-box {
          width: 100%;
          height: 8px;
          margin: 28px 0;
          display: flex;
          justify-content: start;
          align-items: center;
          border-radius: 12px;
          background: #1e140e;
          position: relative;
          top: 0;
          left: 0;
          .progress-bar {
            height: 100%;
            border-radius: 16px;
            background: #ffc47d;
          }
          .progress-stage {
            position: absolute;
            top: 50%;
            width: 24px;
            height: 24px;
            border: 2px solid rgb(69, 35, 48);
            background: rgb(40, 20, 13);
            border-radius: 50%;
            transform: translate(-50%, -50%);
          }
          .progress-stage:first-child {
            transform: translate(0%, -50%);
          }
          .progress-stage:last-child {
            transform: translate(-100%, -50%);
          }
        }
        .progress-ratio-group {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          top: 0;
          left: 0;
          color: rgba(255, 255, 255, 0.6);
          .progress-ratio-group-item {
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            white-space: nowrap;
          }
          .progress-ratio-group-item:last-child {
            transform: translate(-100%, -50%);
          }
        }
        .progress-tx-group {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          top: 0;
          left: 0;
          color: rgba(255, 255, 255, 0.6);
          .progress-tx-group-item {
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            white-space: nowrap;
          }
          .progress-tx-group-item:first-child {
            transform: translate(0%, -50%);
          }
          .progress-tx-group-item:last-child {
            transform: translate(-100%, -50%);
          }
        }
      }
    }
    .inv {
      width: 100%;
      height: 0;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.4);
    }
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
        background: #1e140e;
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
        background: #1e140e;
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
}
@media (max-width: 740px) {
  #prizes-allocation {
    padding: 0 16px;
    .prizes-allocation-title {
      font-size: 24px;
      .title-br {
        display: block;
      }
    }
    .prizes-allocation-card {
      padding: 16px;
      .title {
        font-size: 16px;
        .top800-orbguy {
          width: 200px;
        }
      }
      .user-info {
        font-size: 14px;
        display: block;
        .info-item {
          margin-top: 4px;
          margin-right: 0;
        }
      }
      .user-rank-and-reward {
        font-size: 14px;
        white-space: nowrap;
        margin-top: 8px;
        .current-rank,
        .rank-reward,
        .rank-tx-amount {
          font-size: 14px;
        }
      }
    }
    .task-title {
      font-size: 16px;
      padding: 16px 0 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .task-card-options-group {
      padding: 12px;
      .task-card-options {
        align-items: start;
        .info {
          align-items: start;
        }
        .reward {
          align-items: start;
          .reward-info {
            display: none;
          }
        }
      }
      .reward-info-mobile-group {
        display: flex;
      }
    }
    .task-card-pool-group {
      padding: 12px;
      .task-card-pool {
        align-items: start;
        .info {
          align-items: start;
        }
        .pool-reward {
          .pool-reward-info {
            display: none;
          }
        }
        .prizes-promotion {
          display: none;
        }
      }
    }
  }
}
</style>
