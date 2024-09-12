<template>
  <div id="prizes-allocation" class="prizes-allocation">
    <div class="prizes-allocation-title">
      Overall prize pool
      <br class="title-br" />
      composition and allocation
    </div>
    <div class="prizes-ratio-group">
      <div class="prizes-ratio-item" v-for="item in ratioList" :key="item.text">
        <div class="prizes-ratio-item-group">
          <img :src="require(`../../../assets/prizes/${item.img}`)" alt="" />
        </div>
        <div class="prizes-ratio-item-group">
          <div :style="item.color" class="text orbiter-linear-text">{{ item.reward }}</div>
        </div>
        <div class="prizes-ratio-item-group">
          <div class="des">{{ item.condition }}</div>
          <div v-if="item.isComment">Up to 98% bridging fee rebate</div>
        </div>
      </div>
    </div>
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
              };background-color:${item.isSuccess ? '#3B7FFF' : '#0A1618'};`"
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
      <div class="task-title">Quest</div>

      <div class="task-list-group">
        <div
          class="task-card-pool-group"
          v-for="item in taskPoolList"
          :key="item.reward"
          @click="openTelegram(item)"
          :class="
            !item.isSuccess || !!item.isPromotion
              ? ''
              : 'task-card-options-group-success'
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
              <svg
                v-else
                class="icon"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="24.000000"
                height="24.000000"
                viewBox="0 0 24 24"
                fill="none"
              >
                <defs>
                  <clipPath id="clip2248_786">
                    <rect
                      id="svg"
                      width="20.000000"
                      height="12.444445"
                      transform="translate(2.000000 6.000000)"
                      fill="white"
                      fill-opacity="0"
                    />
                  </clipPath>
                  <clipPath id="clip2248_597">
                    <rect
                      id="X.10d54851.svg"
                      width="24.000000"
                      height="24.000000"
                      fill="white"
                      fill-opacity="0"
                    />
                  </clipPath>
                </defs>
                <g clip-path="url(#clip2248_597)">
                  <g clip-path="url(#clip2248_786)">
                    <path
                      id="path"
                      d="M21.47 7.6C21.34 7.34 21.12 7.15 20.85 7.06C20.58 6.97 20.29 6.99 20.03 7.12L2 18.42L20.99 9.03C21.24 8.9 21.43 8.68 21.52 8.41C21.61 8.14 21.59 7.85 21.47 7.6Z"
                      fill="#FFFFFF"
                      fill-opacity="1.000000"
                      fill-rule="nonzero"
                    />
                    <path
                      id="path"
                      d="M16.13 7.55C16.52 7.37 16.69 6.91 16.52 6.52C16.34 6.12 15.87 5.95 15.48 6.13L3.77 14.45L16.13 7.55Z"
                      fill="#FFFFFF"
                      fill-opacity="1.000000"
                      fill-rule="nonzero"
                    />
                    <path
                      id="path"
                      d="M16.81 14.45C17.12 14.29 17.25 13.91 17.09 13.6C16.93 13.28 16.55 13.15 16.23 13.31L8.7 17.7L16.81 14.45Z"
                      fill="#FFFFFF"
                      fill-opacity="1.000000"
                      fill-rule="nonzero"
                    />
                  </g>
                </g>
              </svg>

              <div class="content-text-group">
                <span class="content-text" v-html="item.text"></span>
                <o-tooltip v-if="item.specificChain">
                  <template v-slot:titleDesc>
                    <span style="margin-left: -20px">
                      <span>
                        <span>Specific networks include: </span>
                        <br />
                        Ethereum, Arbitrum, zkSync Lite, Linea, Scroll, Polygon,
                        Optimism, Loopring, zkSyncEra, BNB Chain, Arbitrum Nova,
                        Polygon zkEVM, Mantle, opBNB, X Layer, Zora, Manta,
                        Kroma, zkFair, Blast, ZetaChain, B² Network, Mode,
                        zkLink Nova, Proof of Play Apex, Merlin, BEVM, BOB,
                        Core, Bitlayer, BounceBit, Optopia, Cyber, Mint,
                        AlienxChain, Fraxtal, Zircuit, Fuse
                      </span>
                    </span>
                  </template>
                  <span class="orbiter_global_prizes_tips_underline tip-text">
                    Specific networks
                  </span>
                </o-tooltip>
                <span v-if="item.specificChain">from/to Base</span>
                <span class="content-text" v-html="item.lastText"></span>
              </div>
            </div>
            <div v-if="item.icon === 'bridge'">
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
            <div v-else>
              <div @click.stop="toGalxeBtn" class="earn-nft">
                Get Base × Orbiter NFT
              </div>
            </div>
          </div>
        </div>

        <div v-if="isEnd" class="prizes-end-modal">End of event</div>
      </div>
    </div>
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
export default {
  name: 'PrizesAllocation',
  components: {
    PrizesTaskSuccessIcon,
    SvgIcon,
  },
  data() {
    return {}
  },
  computed: {
    isEnd() {
      return prizesTimeEnd.value
    },
    userList() {
      return prizesUserList.value
    },
    rankList() {
      return prizesRankList.value
    },
    top20() {
      const list = this.rankList
      return list[19]?.txAmount || 20
    },
    top100() {
      const list = this.rankList
      return list[99]?.txAmount || 20
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
      const top100 =this.top100
      const top20 =this.top20
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
          img: 'nft.png',
          condition: 'Bridge ≥1 tx on Galxe',
          position: 1,
          reward: 'NFT',
          label: '1Tx',
          disabled: true,
          value: 1,
          isSuccess: Number(tx) >= 1,
          color: "background-image: linear-gradient(180.00deg, rgb(202, 209, 255),rgb(59, 127, 255));"
        },
        {
          img: 'ratio3.png',
          reward: '3%',
          position: 3,
          condition: 'Bridge ≥3 tx',
          label: '3Tx',
          value: 3,
          isSuccess: Number(tx) >= 3,
          color: "background-image: linear-gradient(180.00deg, rgb(225, 222, 217),rgb(100, 81, 81));"
        },
        {
          img: 'ratio5.png',
          reward: '5%',
          position: 6,
          condition: 'Bridge ≥8 tx',
          label: '8Tx',
          value: 8,
          isSuccess: Number(tx) >= 8,
          color: "background-image: linear-gradient(180.00deg, rgb(221, 218, 194),rgb(188, 109, 106));"
        },
        {
          img: 'ratio10.png',
          reward: '10%',
          position: 9,
          condition: 'Bridge ≥15 tx',
          label: '15Tx',
          value: 15,
          isSuccess: Number(tx) >= 15,
          color: "background-image: linear-gradient(180.00deg, rgb(222, 244, 255),rgb(108, 151, 155));"
        },
        {
          img: 'ratio22.png',
          reward: '22%',
          position: 15,
          condition: 'Top 100',
          label: 'Top 100',
          value: top100,
          isSuccess: Number(tx) >= 20 && Number(rank) && Number(rank) <= 100,
          color: "background-image: linear-gradient(180.00deg, rgb(217, 236, 235),rgb(168, 226, 239));"
        },
        {
          img: 'bridge95.png',
          reward: '60%',
          position: 20,
          condition: 'Top 1-20',
          label: 'Top 1-20',
          isComment: true,
          value: top20,
          isSuccess: Number(tx) >= 20 && Number(rank) && Number(rank) <= 20,
          color: "background-image: linear-gradient(180.00deg, rgb(249, 250, 228),rgb(236, 192, 49));"
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
      return [
        {
          icon: 'task',
          text: `Complete tasks on Galxe`,
          specificChain: false,
          isPromotion: false,
          isSuccess: false,
          lastText: '',
        },
        {
          icon: 'bridge',
          color: '#F6FFA8',
          reward: '3% Prize Pool',
          text: `Bridge <span class='orbiter_global_prizes_tx-color'>3 TX</span>`,
          specificChain: true,
          isPromotion: tx >= 8,
          isSuccess: tx >= 3,
          lastText: '',
        },
        {
          icon: 'bridge',
          color: '#FF85EA',
          reward: '5% Prize Pool',
          text: `Bridge <span class='orbiter_global_prizes_tx-color'>8 TX</span>`,
          specificChain: true,
          isPromotion: tx >= 15,
          isSuccess: tx >= 8,
          lastText: '',
        },
        {
          icon: 'bridge',
          color: '#FFE0CA',
          reward: '10% Prize Pool',
          text: `Bridge <span class='orbiter_global_prizes_tx-color'>15 TX</span>`,
          specificChain: true,
          isPromotion: tx >= 20 && rank <= 100,
          isSuccess: tx >= 15,
          lastText: '',
        },
        {
          icon: 'bridge',
          color: '#DCF6FB',
          reward: '22% Prize Pool',
          text: `Bridge`,
          specificChain: true,
          isPromotion: tx >= 20 && rank <= 20,
          isSuccess: tx >= 20 && rank <= 100,
          lastText:
            "to achieve <span class='orbiter_global_prizes_tx-color'>Top 21-100</span>",
        },
        {
          icon: 'bridge',
          color: '#F6E08E',
          reward: '60% Prize Pool',
          text: `Bridge`,
          specificChain: true,
          isPromotion: false,
          isSuccess: tx >= 20 && rank <= 20,
          lastText:
            "to achieve <span class='orbiter_global_prizes_tx-color'>Top 1-20 </span>",
        },
      ]
    },
  },
  methods: {
    decimalNumC(num, decimal, delimiter, symbol) {
      return decimalNum(num, decimal, delimiter, symbol)
    },
    toGalxeBtn() {
      console.log('toGalxeBtn')
      this.$gtag.event('PRIZES_V5_ERAN_NFT', {
        event_category: 'PRIZES_V5_ERAN_NFT',
        event_label: 'to galxe',
      })
      const link = process.env.VUE_APP_PRIZES_V5_GLAXE_LINK
      if (link) {
        window.open(link, "_blank")
      } else {
        this.$notify.warning({
          title: 'Comming Soon...',
          duration: 3000,
        })
      }
    },
    openTelegram(option) {
      const address = this.evmAddress
      if (!address || address === '0x' || this.isEnd || option.icon === "task") return
      const name = 'PRIZES_V5_BANNER_TO_BRIDGE'
      this.$gtag.event(name, {
        event_category: name,
        event_label: 'to home',
      })
      localStorage.setItem(
        'last_page_before_history',
        JSON.stringify({
          params: {},
          path: '/',
          query: { source: 'Ethereum', dest: 'Base', token: 'ETH' },
        })
      )

      const url = location.origin + '/?source=Ethereum&dest=Base&token=ETH'

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
  .prizes-ratio-group {
    margin-top: 16px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: start;
    .prizes-ratio-item {
      margin-top: 16px;
      width: 20%;
      max-width: 180px;
      .prizes-ratio-item-group {
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;
        & > img {
          width: 120px;
          height: 120px;
        }
        .text {
          margin-top: 12px;
          font-size: 24px;
          font-family: GeneralSans-SemiBold;
          color: #3b7fff;
        }
        .des {
          white-space: nowrap;
          font-size: 14px;
        }
      }
    }
  }
  .prizes-allocation-card {
    width: 100%;
    padding: 24px;
    margin-top: 32px;
    border-radius: 16px;
    background: linear-gradient(
        -3.58deg,
        rgba(15, 34, 37, 0.2) 60.508%,
        rgba(209, 112, 85, 0.2) 98.796%
      ),
      rgb(15, 34, 37);
    .title {
      width: 100%;
      font-size: 20px;
      font-family: GeneralSans-SemiBold;
      text-align: left;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .top800-orbguy {
        width: 266px;
        height: 32px;
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
          color: #3b7fff;
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
          background: #0a1618;
          position: relative;
          top: 0;
          left: 0;
          .progress-bar {
            height: 100%;
            border-radius: 16px;
            background: #3b7fff;
          }
          .progress-stage {
            position: absolute;
            top: 50%;
            width: 24px;
            height: 24px;
            border: 2px solid rgb(15, 34, 37);
            background: rgb(10, 22, 24);
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
      .task-card-pool-group.task-card-options-group-success {
        border: 1px solid rgb(59, 127, 255);
        border-radius: 12px;
        backdrop-filter: blur(12px);
        background: rgba(59, 127, 255, 0.15);
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
            }
            svg {
              width: 24px;
              height: 24px;
            }
          }

          .earn-nft {
            padding: 0 12px;
            height: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            font-family: GeneralSans-SemiBold;
            border-radius: 4px;
            box-shadow: 0px 0px 24px 0px rgba(255, 21, 0, 0.4);
            backdrop-filter: blur(156px);
            background: linear-gradient(
                186.6deg,
                rgb(234, 242, 255) -10.933%,
                rgb(255, 79, 79) 57.286%
              ),
              rgb(255, 79, 79);
            cursor: pointer;
            clip-path: polygon(
              0 6px,
              6px 0,
              100% 0,
              100% calc(100% - 6px),
              calc(100% - 6px) 100%,
              0 100%
            );
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
    .prizes-ratio-group {
      flex-wrap: wrap;
      .prizes-ratio-item {
        width: calc(50% - 24px);
      }
    }
    .task-title {
      font-size: 16px;
      padding: 16px 0 4px;
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
