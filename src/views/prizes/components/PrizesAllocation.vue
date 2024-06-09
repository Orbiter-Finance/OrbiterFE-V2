<template>
  <div id="prizes-allocation" class="prizes-allocation">
    <div class="prizes-allocation-title">
      $100,000 Bridging
      <br class="title-br" />
      Competition Dashboard
    </div>
    <div class="prizes-ratio-group">
      <div class="prizes-ratio-item" v-for="item in ratioList" :key="item.text">
        <div class="prizes-ratio-item-group">
          <img :src="require('../../../assets/prizes/' + item.img)" />
        </div>
        <div class="prizes-ratio-item-group" :style="`color: ${item.color};`">
          <div class="text">{{ item.ratio }}</div>
        </div>
        <div class="prizes-ratio-item-group">
          <div class="des">{{ item.des }}</div>
        </div>
      </div>
    </div>
    <div class="prizes-allocation-card">
      <div class="title">
        <div>My progress</div>
        <img
          class="top800-orbguy"
          :src="require('../../../assets/prizes/top800-orbguy.png')"
        />
      </div>
      <div class="description">
        <div class="description-text">
          Already in the <span class="remark">{{ tipsLabel }}</span> prize pool.
          Keep bridging to earn more!
        </div>
      </div>

      <div class="user-rank-and-reward">
        <div class="current-rank" v-if="isUserRanking">
          <span>Current rank: </span>
          <span class="current-ranking">{{ userRanking }}</span>
        </div>
        <div v-if="isRewardAmount" class="rank-reward">
          <span>Estimated earnings: </span>
          <span class="reward-amount">{{ rewardAmount }} USDC</span>
        </div>
        <div v-if="isTxAmount" class="rank-tx-amount">
          <span>Accumulated: </span>
          <span class="tx-amount">{{ txAmount }} Tx bridges</span>
        </div>
      </div>

      <div class="progress-group-scroll">
        <div class="pogress-group">
          <div class="progress-ratio-group">
            <div
              class="progress-ratio-group-item"
              v-for="item in progressStage"
              :key="item.position"
              :style="`left: ${(item.position / 20) * 100}%;color:${
                tipsLabel === item.ratio
                  ? '#FFBA56'
                  : 'rgba(255, 255, 255, 0.6)'
              };`"
            >
              {{ item.ratio }}
            </div>
          </div>
          <div class="pogress-box">
            <div class="progress-bar" :style="`width: ${ratio}%;`"></div>
            <div
              class="progress-tx-current-stage"
              :style="`left: ${ratio}%;${isHiddenTips};`"
            >
              <div class="progress-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="8.489258"
                  height="5.242645"
                  viewBox="0 0 8.48926 5.24265"
                  fill="none"
                >
                  <path
                    d="M1 0L7.48 0C8.37 0 8.82 1.07 8.19 1.7L4.95 4.94C4.56 5.34 3.92 5.34 3.53 4.94L0.29 1.7C-0.34 1.07 0.11 0 1 0Z"
                    fill="#FFA629"
                    fill-opacity="1.000000"
                    fill-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="progress-current-tx">{{ tipsLabelTx }}</div>
            </div>
            <div
              class="progress-stage"
              v-for="item in progressStage"
              :key="item.position"
              :style="`left: ${(item.position / 20) * 100}%;visibility:${
                item.position ? 'visable' : 'hidden'
              };background-color:${
                txAmount >= item.value ? '#FFBA56' : '#222222'
              };`"
            ></div>
          </div>
          <div class="progress-tx-group">
            <div
              class="progress-tx-group-item"
              :style="`left: ${(item.position / 20) * 100}%;`"
              v-for="item in progressStage"
              :key="item.position"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
      <div class="inv"></div>
      <div class="task-title">Quest</div>

      <div
        class="task-card-options-group"
        v-for="item in taskOptionsList"
        :key="item.reward"
        :class="item.isSuccess ? 'task-card-options-group-success' : ''"
        @click="openTelegram(item)"
      >
        <div
          class="task-card-options"
          :style="`opacity:${item.isPromotion ? '0.4' : '1'};`"
        >
          <div class="info">
            <div class="icon">
              <img
                :src="require('../../../assets/prizes/' + item.icon + '.svg')"
              />
            </div>
            <div class="content-text-group">
              <div class="content-text" v-html="item.text"></div>
              <o-tooltip v-if="item.specificChain">
                <template v-slot:titleDesc>
                  <div style="margin-left: -20px">
                    <span> 
                    <span>Specific chains include: </span>
                    <br />
                    Blast, Optopia, ZKFair, Mode, zkLink Nova, Zora, Manta, Mantle, Polygon, Scroll, OPBNB, zkSync Lite, Arbitrum Nova, Proof of Play Apex, BSC, BOB, zkSync Era, Taiko, BEVM, Merlin 
                  </span>
                  </div>
                </template>
                <div class="orbiter_global_prizes_tips_underline tip-text">specific chain</div>
              </o-tooltip>
              <span v-if="item.specificChain">to Arbitrum</span>
            </div>
          </div>
          <div class="reward">
            <div class="reward-info">
              {{ item.reward }}
              <img
                style="margin: 0 4px"
                :src="require('../../../assets/prizes/o-points.svg')"
              />
              OPoints
            </div>
            <div class="reward-status">
              <PrizesTaskSuccessIcon
                v-if="item.isSuccess"
                :fillColor="'#DDF600'"
              ></PrizesTaskSuccessIcon>
              <img v-else :src="require('../../../assets/prizes/more.svg')" />
            </div>
          </div>
        </div>
        <div class="reward-info-mobile-group">
          <div class="reward-info-mobile">
            {{ item.reward }}
            <img
              style="margin: 0 4px"
              :src="require('../../../assets/prizes/o-points.svg')"
            />
            OPoints
          </div>
        </div>
      </div>

      <div
        class="task-card-pool-group"
        v-for="item in taskPoolList"
        :key="item.reward"
        :style="
          item.isSuccess && !item.isPromotion
            ? `border: 1px solid ${item.color};backdrop-filter: blur(12px);`
            : ''
        "
        @click="openTelegram(item)"
      >
        <div
          class="task-card-pool"
          :style="`opacity:${item.isPromotion ? '0.4' : '1'};`"
        >
          <div class="info">
            <div class="icon">
              <img
                :src="require('../../../assets/prizes/' + item.icon + '.svg')"
              />
            </div>
            <div class="content-text-group">
              <div class="content-text" v-html="item.text"></div>
              <o-tooltip v-if="item.specificChain">
                <template v-slot:titleDesc>
                  <div style="margin-left: -20px">
                    <span> 
                    <span>Specific chains include: </span>
                    <br />
                    Blast, Optopia, ZKFair, Mode, zkLink Nova, Zora, Manta, Mantle, Polygon, Scroll, OPBNB, zkSync Lite, Arbitrum Nova, Proof of Play Apex, BSC, BOB, zkSync Era, Taiko, BEVM, Merlin 
                  </span>
                  </div>
                </template>
                <div class="orbiter_global_prizes_tips_underline tip-text">specific chain</div>
              </o-tooltip>
              <span v-if="item.specificChain">to Arbitrum</span>
            </div>
          </div>
          <div v-if="item.isPromotion" class="prizes-promotion">
            Already entered in higher stage pools
          </div>
          <div v-else class="pool-reward" :style="`color: ${item.color};`">
            <div class="pool-reward-info">
              {{ item.reward }}
            </div>
            <PrizesTaskSuccessIcon
              v-if="item.isSuccess"
              :fillColor="item.color"
              style="margin-left: 4px"
            ></PrizesTaskSuccessIcon>
            <img v-else :src="require('../../../assets/prizes/more.svg')" />
          </div>
        </div>
        <div class="pool-reward-info-mobile-group">
          <div v-if="item.isPromotion" class="prizes-promotion-mobile">
            Already entered in higher stage pools
          </div>
          <div
            v-else
            class="pool-reward-info-mobile"
            :style="`color: ${item.color};`"
          >
            {{ item.reward }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'

import {
  setConnectWalletGroupKey,
  setSelectWalletDialogVisible,
  prizesUserRank,
  prizesUserTx,
  prizesTop100tx,
  prizesUserReward,
  prizesUserTelegramId,
  prizesUserIsJoinTelegram,
} from '../../../composition/hooks'

import PrizesTaskSuccessIcon from './PrizesTaskSuccess.vue'
import { decimalNum } from '../../../util/decimalNum'
import { isDev } from '../../../util'

const ratio10 = '#DBEF2D'
const ratio15 = '#FF29DA'
const ratio20 = '#A862EA'
const ratio25 = '#00EEEE'
const ratio30 = '#FFA629'
export default {
  name: 'PrizesAllocation',
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
    evmAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress || ''
    },
    progressStage() {
      return [].concat([
        {
          position: 0,
          label: '0Tx',
          ratio: '0',
          value: 0,
        },
        {
          img: 'tx3.png',
          color: ratio10,
          des: 'Bridge TX ≥ 3 tx',
          position: 3,
          label: '3Tx',
          ratio: '10%',
          value: 3,
        },
        {
          img: 'tx5.png',
          color: ratio15,
          des: 'Bridge TX ≥ 5 tx',
          position: 5,
          label: '5Tx',
          ratio: '15%',
          value: 5,
        },
        {
          img: 'tx8.png',
          color: ratio20,
          des: 'Bridge TX ≥ 8 tx',
          position: 8,
          label: '8Tx',
          ratio: '20%',
          value: 8,
        },
        {
          img: 'tx15.png',
          color: ratio25,
          des: 'Bridge TX ≥ 15 tx',
          position: 15,
          label: '15Tx',
          ratio: '25%',
          value: 15,
        },
        {
          img: 'top100.png',
          color: ratio30,
          des: 'Top 100 users',
          position: 20,
          label: 'Top 100',
          ratio: '30%',
          value: this.top100Tx >= 20 ? this.top100Tx : 20,
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
    isHiddenTips() {
      return (
        'display:' +
        (!(
          Number(this.txAmount) <= 3 ||
          this.progressStage.some((item) => item.value === this.txAmount) ||
          this.txAmount >= this.top100Tx
        )
          ? 'block'
          : 'none')
      )
    },
    tipsLabelTx() {
      return this.txAmount + 'Tx'
    },
    tipsLabel() {
      const list =
        this.progressStage.filter((item) => item.value <= this.txAmount) || []
      const option = list[list?.length - 1] || {}
      return option?.ratio || '--'
    },
    ratio() {
      const stage = this.txAmount
      const tx100 = this.top100Tx >= 20 ? this.top100Tx : 20
      let base = 75
      let progressRation = 0
      if (stage >= 15) {
        const rest = Math.floor(((stage - 15) * 25) / (tx100 - 15))
        progressRation = base + rest
      } else {
        progressRation = (stage / 20) * 100
      }
      return progressRation >= 100 ? 100 : progressRation
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
          text: `Bridge ≥20 TX from specific chain to Arbitrum <span class="orbiter_global_prizes_tx-color">Top 100 users </span>`,
          reward: '30% Prize Pool',
          color: ratio30,
          isSuccess: txN >= 20 && Number(rankN) && Number(rankN) <= 100,
        },
      ]
    },
  },
  methods: {
    decimalNumC(num, decimal, delimiter, symbol) {
      return decimalNum(num, decimal, delimiter, symbol)
    },
    async openTelegram(option) {
      const isBuild = !!this.telegramId
      const isTelegram = option.type === 'TG'
      const account = this.evmAddress
      const isSuccess = option.isSuccess

      if (!account || account === '0x') {
        setConnectWalletGroupKey('EVM')
        setSelectWalletDialogVisible(true)
        return
      }

      const localStr = sessionStorage.getItem('TELEGRAM_TOKEN')

      if (isSuccess) {
      } else if (isTelegram) {
        if (!isBuild) {
          if (localStr) {
            const provider =
              compatibleGlobalWalletConf.value.walletPayload.provider
            const telegramInfo = JSON.parse(window.atob(localStr))
            console.log('telegramInfo', telegramInfo)
            const res = await provider.request({
              method: 'personal_sign',
              params: [
                String('TelegramId:' + telegramInfo?.id),
                account.toLocaleLowerCase(),
              ],
            })
            const result = await fetch(
              `${process.env.VUE_APP_OPEN_URL}/points_platform/competition/updateTelegramInfo`,
              {
                headers: {
                  token: res,
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                  accountInfo: {
                    ext: {
                      telegramHash: localStr,
                    },
                  },
                }),
              }
            )
            const data = await result.json('TELEGRAM_TOKEN')
            if (data?.code === 0) {
              sessionStorage.removeItem()
              this.$notify.success(data.message)
              this.$store.commit(
                'getPrizesuserInfo',
                this.evmAddress.toLocaleLowerCase()
              )
            } else {
              this.$notify.warning(data.message)
            }
          } else {
            const url = `https://oauth.telegram.org/auth?bot_id=7218481384&origin=${encodeURIComponent(
              // 'https://test.orbiter.finance/prizes'
              window.location.origin + '/prizes'
            )}&request_access=write`
            window.open(url, '_self')
          }
        } else {
          window.open('https://t.me/orbiterORB', '_blank')
        }
      } else {
        this.$router.push(
          isDev()
            ? '/?source=Sepolia%28G%29&dest=Arbitrum%20Sepolia'
            : '/?source=Ethereum&dest=Arbitrum&token=ETH'
        )
      }
    },
  },
}
</script>

<style scoped lang="scss">
.prizes-allocation {
  width: 100%;
  margin-top: 32px;
  .prizes-allocation-title {
    width: 100%;
    text-align: center;
    font-size: 32px;
    font-weight: 600;
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
      max-width: 160px;
      .prizes-ratio-item-group {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        & > img {
          width: 84px;
          height: 84px;
        }

        .text {
          margin-top: 12px;
          font-size: 24px;
          font-weight: 600;
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
    border: 2px solid rgb(239, 47, 45);
    border-radius: 16px;
    box-shadow: inset 0px 0px 34px 0px rgba(239, 47, 45, 0.4),
      0px 0px 14px 0px rgb(239, 47, 45);
    backdrop-filter: blur(156px);
    background: rgb(0, 0, 0);

    .title {
      width: 100%;
      font-size: 20px;
      font-weight: 600;
      text-align: left;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .top800-orbguy {
        width: 266px;
        height: 32px;
      }
    }

    .description {
      margin-top: 12px;
      font-size: 18px;
      font-weight: 500;

      letter-spacing: 0px;
      text-align: left;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .description-text {
        display: flex;
        justify-content: start;
        align-items: center;
        .remark {
          padding: 0 4px;
          color: #ffba58;
          font-weight: 600;
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
          font-weight: 600;
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
          font-weight: 600;
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
          font-weight: 600;
        }
      }
    }

    .progress-group-scroll {
      width: 100%;
      overflow: auto;
      .pogress-group {
        width: 100%;
        padding: 0 4px;
        min-width: 740px;
        margin: 16px 0 32px;
        font-size: 14px;

        .pogress-box {
          width: 100%;
          height: 8px;
          margin: 20px 0;
          display: flex;
          justify-content: start;
          align-items: center;
          border-radius: 12px;
          background: rgb(26, 26, 26);
          position: relative;
          top: 0;
          left: 0;

          .progress-bar {
            height: 100%;
            border-radius: 16px;
            background: rgb(255, 186, 86);
          }

          .progress-stage {
            position: absolute;
            top: 50%;
            width: 24px;
            height: 24px;
            border: 2px solid rgb(34, 34, 34);
            border-radius: 50%;
            transform: translate(-50%, -50%);
          }

          .progress-stage:first-child {
            transform: translate(0%, -50%);
          }

          .progress-stage:last-child {
            transform: translate(-100%, -50%);
          }

          .progress-tx-current-stage {
            position: absolute;
            bottom: -16px;
            color: #ffa629;
            transform: translate(-50%, 50%);
            width: 52px;

            .progress-icon {
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              transform: rotate(180deg);
              & > svg {
                width: 8px;
                height: 8px;
              }
            }

            .progress-current-tx {
              white-space: nowrap;
              font-weight: 600;
            }
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
      font-weight: 600;

      letter-spacing: 0px;
      text-align: left;
      padding: 24px 0 4px;
    }

    .task-card-options-group {
      width: 100%;
      background: rgb(26, 26, 26);
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
            .content-text {
              font-size: 16px;
              font-weight: 500;
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
          font-weight: 600;
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

    .task-card-options-group-success {
      // opacity: 0.6;
      // border: 1px solid rgb(219, 239, 45);
      border-radius: 12px;
      backdrop-filter: blur(12px);
      // background: rgba(219, 239, 45, 0.15);
    }

    .task-card-pool-group {
      width: 100%;
      padding: 16px;
      background: rgb(26, 26, 26);
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
            display: flex;
            justify-content: start;
            align-items: center;
            .content-text {
              font-size: 16px;
              font-weight: 500;
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
          font-weight: 600;
          letter-spacing: 0px;
          text-align: right;
        }

        .prizes-promotion {
          color: #ffff;
        }
      }

      .pool-reward-info-mobile-group {
        width: 100%;
        display: none;
        justify-content: start;
        align-items: center;
        margin-top: 8px;
        .prizes-promotion-mobile {
          display: flex;
          justify-content: start;
          align-items: center;
          padding: 4px 8px;
          border-radius: 4px;
          background: rgb(0, 0, 0);
          font-size: 12px;
        }
        .pool-reward-info-mobile {
          display: flex;
          justify-content: start;
          align-items: center;
          padding: 4px 8px;
          border-radius: 4px;
          background: rgb(0, 0, 0);
          font-size: 12px;
        }
      }
    }

    .task-card-pool-group-promotion {
      opacity: 0.6;
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

      .description {
        font-size: 14px;
        .description-text {
          flex-wrap: wrap;
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

      .pool-reward-info-mobile-group {
        display: flex;
      }
    }
  }
}
</style>
