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
              <div v-if="isClaimed" class="card-title-reward">Claimed</div>
              <div
                v-else-if="claimCardModalType === 'LUCKY_BAG'"
                class="card-title"
              >
                🎉
                <div class="label">Congratulations!</div>
                🎉
              </div>
              <div
                v-else-if="claimCardModalType === 'REWARD'"
                class="card-title-reward"
              >
                Your Rewards
              </div>
              <div v-else class="card-title-card">Your Rewards</div>

              <div class="token-symbol">
                <img
                  :src="require('../../assets/activity/orbguy-modal.png')"
                  alt=""
                  class="symbol"
                />
              </div>

              <div
                class="token-amount"
                :style="`color:${isClaimed ? '#1EB4AB' : '#000'};`"
              >
                +{{ decimalNumC(claimAmount, 0) }} $ORBGUY
              </div>

              <div v-show="!isClaimed" class="card-des">
                The 1st Meme for Orbiter Community
              </div>
              <div
                class="claim-btn"
                :style="`opacity:${loading ? '0.4' : '1'};`"
                @click="claim"
                v-if="!isClaimed"
              >
                {{ loading ? 'loading...' : 'Claim' }}
              </div>
              <div v-else class="go-to-swap"
                @click="goToSwap"
              > 
                Go to swap <svg class="go-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="14.062500" height="9.648438" viewBox="0 0 14.0625 9.64844" fill="none">
                  <path id="→" d="M7.96 1.37L10.35 3.77L0 3.77L0 5.82L10.38 5.82L7.96 8.28L9.3 9.64L14.06 4.83L9.3 0L7.96 1.37Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="evenodd"/>
                </svg>
              </div>

              <div v-if="showProgress" class="progress-group">
                <div class="progress-info">
                  <div class="progress-title">
                    <div class="progress-label">Claim Progress</div>
                    <o-tooltip>
                      <template v-slot:titleDesc>
                        <div style="margin-left: -20px">
                          <span
                            >Task rewards for participating in Orbiter
                            Finance-related activities.</span
                          >
                          <a
                            class="points_more"
                            href="https://docs.orbiter.finance/o-points#activity-points-and-exchange-standards"
                            target="_blank"
                            >More</a
                          >
                        </div>
                      </template>
                      <svg-icon
                        iconName="tips-icon"
                        class="thumbnail_1_3"
                      ></svg-icon>
                    </o-tooltip>
                  </div>
                  <div class="progress-amount">
                    <span class="current">{{
                      decimalNumC(totalQuantity, 0, ',')
                    }}</span>
                    / {{ decimalNumC(max, 0, ',') }}
                  </div>
                </div>
                <div class="progress-box">
                  <div
                    class="progress"
                    :style="{
                      width:
                        Number(ratio) >= 100
                          ? '100%'
                          : decimalNumC(ratio, 3) + '%',
                    }"
                  >
                    <div class="skeleton"></div>
                  </div>
                </div>
              </div>

              <div v-if="isClaimed" class="link-card">
                <div class="link-label">
                  Trade $ORBGUY on
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="55.000000"
                    height="12.000000"
                    viewBox="0 0 55 12"
                    fill="none"
                  >
                    <defs>
                      <pattern
                        id="pattern_960_17550"
                        patternContentUnits="objectBoundingBox"
                        width="1.000000"
                        height="1.000000"
                      >
                        <use
                          xlink:href="#image960_1755_0"
                          transform="matrix(0.002797,0,0,0.012821,-0.003496,0)"
                        />
                      </pattern>
                      <image
                        id="image960_1755_0"
                        width="360.000000"
                        height="78.000000"
                        xlink:href="data:image/png;base64,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"
                      />
                    </defs>
                    <rect
                      id="LIKWID-launch"
                      width="55.000000"
                      height="12.000000"
                      fill="url(#pattern_960_17550)"
                      fill-opacity="1.000000"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div class="join-media-card-group" v-if="showMediaCard">
              <JoinMediaCard></JoinMediaCard>
            </div>
          </div>
        </div>
        <div class="lottery-bg-1-animation"></div>
        <div class="lottery-bg-2-animation"></div>
        <div class="lottery-bg-3-animation"></div>
      </div>
      <div class="lottery-dialog-close-group">
        <div
          @click.self="handleHidden"
          v-if="!disabled"
          class="lottery-dialog-close"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import {
  isMobile,
  claimCardModalShow,
  claimCardModalType,
  claimCardModalDataInfo,
  claimCardModalAmountInfo,
  web3State
} from '../../composition/hooks'
import util from "../../util/util"
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'
import { decimalNum } from '../../util/decimalNum'
import SvgIcon from '../SvgIcon/SvgIcon.vue'
import JoinMediaCard from './JoinMediaCard.vue'
import { Orbiter_CLAIM_ABI } from '../../util/constants/contract/contract'
import { CLAIM_ORBGUY_CONTRACT_ADDRESS } from "../../const"
export default {
  components: { SvgIcon },
  name: 'ClaimRewardModal',
  data() {
    return {
      disabled: false,
      isClaim: false,
      cardIds: [],
      loading: false,
      url: "https://likwid.meme/swap",
      name: "CLAIM_ORBGUY_LIKWID_SWAP"
    }
  },
  components: {
    JoinMediaCard,
  },
  computed: {
    currentEvmAddress() {
      return compatibleGlobalWalletConf?.value?.walletPayload?.walletAddress
    },
    claimCardModalDataInfoData() {
      return claimCardModalDataInfo.value
    },
    claimAmount() {
      const { data = []} = this.claimCardModalDataInfoData || {}
      const cardIds = this.cardIds

      let amount = ethers.utils.parseEther('0')
      let total = ethers.utils.parseEther('0')

      data.forEach((item) => {
        const flag = cardIds.some((option)=>  option?.id?.toLocaleLowerCase() === item.id?.toLocaleLowerCase())
        const value = ethers.utils.parseEther(String(item.value || 0))
        if(!flag) {
          amount = amount.add(value)
        } 
        total = total.add(value)
      });

      amount = ethers.utils.formatEther(amount)
      total = ethers.utils.formatEther(total)
      
      return !Number(amount) ? total : amount
    },
    isShow() {
      return claimCardModalShow.value
    },
    isMobile() {
      return isMobile.value
    },
    claimCardModalType() {
      return claimCardModalType.value
    },
    isClaimed() {
      const { data = []} = this.claimCardModalDataInfoData || {}

      const cardIds = this.cardIds
      let amount = ethers.utils.parseEther('0')

      data.forEach((item) => {
        const flag = cardIds.some((option)=> option?.id?.toLocaleLowerCase() === item.id?.toLocaleLowerCase())
        const value = ethers.utils.parseEther(String(item.value || 0))
        if(!flag) {
          amount = amount.add(value)
        } 
      });

      amount = ethers.utils.formatEther(amount)

      return this.isClaim || (!Number(amount) && !!data?.length)
    },
    showProgress() {
      return this.claimCardModalType === 'LUCKY_BAG' && !this.isClaimed
    },
    showMediaCard() {
      return this.claimCardModalType !== 'LUCKY_BAG' || this.isClaimed
    },
    claimCardModalAmountInfoData() {
      return claimCardModalAmountInfo.value
    },
    ratio() {
      const { ratio } = this.claimCardModalAmountInfoData || {}
      if (!Number(ratio)) return 0

      return ratio
    },
    max() {
      const { max } = this.claimCardModalAmountInfoData || {}
      if (!Number(max)) return 0

      return max
    },
    totalQuantity() {
      const { totalQuantity } = this.claimCardModalAmountInfoData || {}
      if (!Number(totalQuantity)) return 0

      return totalQuantity
    },
  },
  methods: {
    goToSwap() {
      const name = this.name
      const url = this.url
      this.$gtag.event(name, {
        event_category: name,
        event_label: url,
      })
      window.open(url, '_blank')
    },
    async getCardIds() {
      this.cardIds = []
      const evmAddress = this.currentEvmAddress
      if (!evmAddress) return
      const provider = new ethers.providers.Web3Provider(
        compatibleGlobalWalletConf.value.walletPayload.provider
      )
      const signer = provider.getSigner()

      const claimContract = new ethers.Contract(
        CLAIM_ORBGUY_CONTRACT_ADDRESS,
        Orbiter_CLAIM_ABI,
        signer
      )

      const cardIds = await claimContract.getClaimedCards(evmAddress)
      console.log("cardIdscardIdscardIdscardIds", cardIds)
      this.cardIds = [].concat(cardIds)
    },
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
    handleHidden() {
      this.isClaim = false
      this.$store.commit('getClaimORBGUYRewardData', '')
    },
    async claim() {
      if (this.isClaim || this.loading) return
      const { data, sign: signData } = this.claimCardModalDataInfoData || {}
      const chainID = +compatibleGlobalWalletConf.value.walletPayload.networkId
      console.log("chainID", chainID)
      if(Number(chainID) !== 42161) {
        util.showMessage("Please Switch Arbitrum Network", 'warning');
        return
      }
      try {
        this.loading = true

        const provider = new ethers.providers.Web3Provider(
          compatibleGlobalWalletConf.value.walletPayload.provider
        )
        const signer = provider.getSigner()

        const claimContract = new ethers.Contract(
          CLAIM_ORBGUY_CONTRACT_ADDRESS,
          Orbiter_CLAIM_ABI,
          signer
        )
        const params = [
          [...(data||[])].map((item) => {
            return {
              id: item.id,
              value: ethers.utils.parseEther(String(item.value)).toString(),
              expiredTimestamp: Number(item.expiredTimestamp),
              flag: Number(item.flag),
            }
          }),
          [...(signData || [])],
        ]
        console.log("params", data, signData, params)
        const res = await claimContract.claim(params[0], params[1])
        await res.wait()
        this.isClaim = true
      } catch (error) {
        console.log('error', error)
        this.loading = false
      }
    },
  },
  watch: {
    claimCardModalDataInfoData(newValue) {
      if (newValue) {
        this.getCardIds()
      }
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
          width: 296px;
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
            padding: 24px;

            .card-title-claimed {
              display: flex;
              justify-content: center;
              align-items: center;
              white-space: nowrap;
              width: 100%;
              font-size: 22px;
              font-weight: 700;
              line-height: 30px;
              letter-spacing: 0px;
            }

            .card-title {
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              white-space: nowrap;
              .label {
                padding: 0 4px;
                background-image: linear-gradient(
                  180deg,
                  rgb(255, 212, 0),
                  rgb(223, 46, 45)
                );
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-fill-color: transparent;
                font-family: General Sans;
                font-size: 22px;
                font-weight: 700;
                line-height: 30px;
                letter-spacing: 0px;
                text-align: center;
              }
            }

            .card-title-reward {
              display: flex;
              justify-content: center;
              align-items: center;
              white-space: nowrap;
              width: 100%;
              font-size: 22px;
              font-weight: 700;
              line-height: 30px;
              letter-spacing: 0px;
            }

            .card-title-card {
              display: flex;
              justify-content: center;
              align-items: center;
              white-space: nowrap;
              width: 100%;
              font-size: 22px;
              font-weight: 700;
              line-height: 30px;
              letter-spacing: 0px;
            }

            .token-symbol {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;

              .symbol {
                width: 181px;
                height: 144px;
              }
            }

            .token-amount {
              width: 100%;
              margin-top: 4px;
              font-size: 24px;
              font-weight: 700;
              line-height: 32px;
              letter-spacing: 0px;
            }

            .card-des {
              font-size: 16px;
              font-weight: 500;
              margin: 4px 0 0;
              background: linear-gradient(
                180deg,
                rgb(206, 145, 255),
                rgb(255, 71, 191)
              );
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-fill-color: transparent;
              font-family: General Sans;
              font-size: 16px;
              font-weight: 500;
              line-height: 20px;
              letter-spacing: 0px;
              text-align: center;
            }

            .claim-btn {
              width: 100%;
              padding: 14px;
              border-radius: 24px;
              margin-top: 12px;
              background: rgb(223, 46, 45);
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 16px;
              font-weight: 700;
              line-height: 22px;
              color: rgb(255, 255, 255);
              font-family: GeneralSans-SemiBold;
            }

            .go-to-swap {
              width: 100%;
              padding: 14px;
              border-radius: 24px;
              margin-top: 12px;
              background: rgb(0, 0, 0);
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 16px;
              font-weight: 700;
              line-height: 22px;
              color: rgb(255, 255, 255);
              font-family: GeneralSans-SemiBold;
              cursor: pointer;
              .go-icon {
                margin-left: 8px;
                width: 16px;
                height: 16px;
              }
            }

            .progress-group {
              margin-top: 12px;
              width: 100%;

              .progress-info {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .progress-title {
                  display: flex;
                  justify-content: start;
                  align-items: center;
                  .progress-label {
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 20px;
                    letter-spacing: 0px;
                  }
                }

                .progress-amount {
                  font-size: 14px;
                  font-weight: 500;
                  line-height: 19px;
                  letter-spacing: 0px;
                  .current {
                    font-weight: 600;
                  }
                }
              }

              .progress-box {
                width: 100%;
                height: 10px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 6px;
                margin-top: 4px;
                overflow: hidden;

                .progress {
                  height: 10px;
                  background: linear-gradient(
                    90deg,
                    rgb(223, 46, 45) 43.689%,
                    rgb(255, 150, 50) 100%
                  );
                  border-radius: 6px;
                }

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

            .link-card {
              width: 100%;
              margin-top: 12px;
              border-radius: 8px;
              display: flex;
              justify-content: center;
              align-items: center;

              .link-label {
                display: flex;
                justify-content: start;
                align-items: center;
                white-space: nowrap;
                font-size: 14px;
                font-weight: 500;
                line-height: 20px;
                font-family: GeneralSans-SemiBold;

                svg {
                  margin-left: 4px;
                }
              }
            }
          }

          .join-media-card-group {
            margin-top: 16px;
            width: 100%;
          }
        }
      }

      .lottery-dialog-confirm-group {
        width: 100%;
        height: 52px;
        margin-top: 36px;
        display: flex;
        justify-content: center;
        align-content: center;
        position: relative;
        top: 0;
        left: 0;
        z-index: 4;
        .lottery-dialog-confirm-count {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40%;
          height: 100%;
          font-family: GeneralSans-Medium;
          background-image: url('../../assets/activity/header_lottery_card/confirm.png');
          background-repeat: no-repeat;
          font-size: 18px;
          line-height: 24px;
          background-position: center;
          background-size: contain;
          font-weight: 800;
          cursor: pointer;
          animation: fade-in 4s forwards;
          -webkit-animation: fade-in 4s forwards;
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
