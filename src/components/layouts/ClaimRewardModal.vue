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
              <div v-if="isClaimed && isAmount" class="card-title-reward">
                Claimed
              </div>
              <div
                v-else-if="claimCardModalType === 'LUCKY_BAG'"
                class="card-title"
              >
                🎉
                <div class="label">Congratulations!</div>
                🎉
              </div>
              <div
                v-else-if="claimCardModalType === 'REWARD' || !isAmount"
                class="card-title-reward"
              >
                Your Rewards
              </div>
              <div v-else class="card-title-card">Your Rewards</div>

              <div class="token-symbol">
                <img
                  :src="
                    isAmount
                      ? require('../../assets/activity/orbguy-modal.png')
                      : require('../../assets/activity/claim-empty.png')
                  "
                  alt=""
                  class="symbol"
                />
              </div>

              <div v-if="isAmount" class="token-amount" :style="`color:#222;`">
                {{ decimalNumC(claimAmount, 0) }} $ORBGUY
              </div>

              <div v-else class="not-token-amount">No rewards found</div>

              <div v-if="!isAmount" class="not-token-amount-tips">
                Explore Orbiter to grab some
              </div>

              <div v-if="!!isAmount && !isLuckyBagTask" class="card-des">
                The 1st Meme for Orbiter Community
              </div>
              <div
                class="claim-btn"
                :style="`opacity:${loading ? '0.4' : '1'};cursor:${
                  loading ? 'not-allowed' : 'pointer'
                };`"
                @click="claim"
                v-if="!isClaimed && !showMediaStepCard && !!isAmount && !isLuckyBagTask"
              >
                {{ loading ? 'loading...' : 'Claim' }}
              </div>

              <div v-if="showProgress && isAmount" class="progress-group">
                <div class="progress-info">
                  <div class="progress-title">
                    <div class="progress-label">Claim Progress</div>
                    <o-tooltip>
                      <template v-slot:titleDesc>
                        <div style="margin-left: -20px">
                          <span
                            >Over 50 O-points users can claim a reward randomly.
                            A total reward of
                            {{ decimalNumC(max, 0, ',') }} $ORBGUY available.
                            Rewards are claimed on Arbitrum network. FCFS!</span
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

              <div v-if="isClaimed && isAmount" class="link-card">
                <div class="link-label">
                  Trade $ORBGUY on
                  <img
                    class="token-image"
                    :src="require('../../assets/activity/LIKWID-launch.png')"
                    alt=""
                  />
                </div>
              </div>
              <div v-if="showClaimChainText" class="claim-chain-text">
                Claim your Token on
                <span class="chain-name">{{ chainName }}</span>
              </div>
              <div v-if="isLuckyBagTask" class="lucky_bag_task">Claim channel will be opened after the event ends.</div>
            </div>
            <div
              class="join-media-card-group"
              v-if="showMediaCard && !!isAmount"
            >
              <JoinMediaCard></JoinMediaCard>
            </div>
            <div class="join-media-card-group" v-if="showMediaStepCard">
              <MediaStepCard
                :claimCall="claim"
                :isLoading="loading"
                :rewardChainId="rewardChainId"
                @getStepStatus="setStepStatus"
              ></MediaStepCard>
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
          v-if="isShowClose"
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
  claimCardModalOtherDataInfo,
  web3State,
} from '../../composition/hooks'
import util from '../../util/util'
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'
import { decimalNum } from '../../util/decimalNum'
import SvgIcon from '../SvgIcon/SvgIcon.vue'
import JoinMediaCard from './JoinMediaCard.vue'
import MediaStepCard from './MediaStepCard.vue'

import { Orbiter_CLAIM_ABI } from '../../util/constants/contract/contract'

import { COINBASE, TOKEN_POCKET_APP } from '../../util/walletsDispatchers'
import { METAMASK, WALLETCONNECT } from '../../util/walletsDispatchers/index'
export default {
  components: { SvgIcon },
  name: 'ClaimRewardModal',
  data() {
    return {
      isClaim: false,
      cardIds: [],
      loading: false,
      url: 'https://likwid.meme/swap',
      name: 'CLAIM_ORBGUY_LIKWID_SWAP',
      status: 1,
    }
  },
  components: {
    JoinMediaCard,
    MediaStepCard,
  },
  computed: {
    currentEvmAddress() {
      return compatibleGlobalWalletConf?.value?.walletPayload?.walletAddress
    },
    claimCardModalDataInfoData() {
      return claimCardModalDataInfo.value
    },
    rewardInfo() {
      const { data = [] } = this.claimCardModalDataInfoData || {}
      return data?.[0] || {}
    },
    rewardChainId() {
      return this.rewardInfo?.chainId || ''
    },
    claimCardModalAmountInfoData() {
      return claimCardModalAmountInfo.value
    },
    claimCardModalOtherData() {
      return claimCardModalOtherDataInfo.value
    },
    currentNetwork() {
      return compatibleGlobalWalletConf.value.walletPayload.networkId
    },
    claimAmount() {
      const { data = [] } = this.claimCardModalDataInfoData || {}
      const cardIds = this.cardIds
      if (this.isLuckyBagTask)
        return this.claimCardModalOtherData?.distributeResult || 0

      let amount = ethers.utils.parseEther('0')
      let total = ethers.utils.parseEther('0')

      data.forEach((item) => {
        const flag = cardIds.some(
          (option) =>
            option?.id?.toLocaleLowerCase() === item.id?.toLocaleLowerCase()
        )
        const value = ethers.utils.parseEther(String(item.value || 0))
        if (!flag) {
          amount = amount.add(value)
        }
        total = total.add(value)
      })

      amount = ethers.utils.formatEther(amount)
      total = ethers.utils.formatEther(total)

      return !Number(amount) ? total : amount
    },
    isAmount() {
      if (this.isLuckyBagTask)
        return !!Number(this.claimCardModalOtherData?.distributeResult)
      const { data = [] } = this.claimCardModalDataInfoData || {}

      let amount = ethers.utils.parseEther('0')

      data.forEach((item) => {
        amount = amount.add(ethers.utils.parseEther(String(item.value || 0)))
      })
      return amount.gt('0')
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
    isLuckyBagTask() {
      return this.claimCardModalType === 'LUCKY_BAG_TASK'
    },
    isClaimed() {
      const { data = [], isClaimedData } = this.claimCardModalDataInfoData || {}

      if (this.isLuckyBagTask) return false

      if (isClaimedData) {
        return true
      }

      const cardIds = this.cardIds
      let amount = ethers.utils.parseEther('0')

      data.forEach((item) => {
        const flag = cardIds.some(
          (option) =>
            option?.id?.toLocaleLowerCase() === item.id?.toLocaleLowerCase()
        )
        const value = ethers.utils.parseEther(String(item.value || 0))
        if (!flag) {
          amount = amount.add(value)
        }
      })

      amount = ethers.utils.formatEther(amount)

      return this.isClaim || (!Number(amount) && !!data?.length)
    },
    showProgress() {
      return this.claimCardModalType === 'LUCKY_BAG' && !this.isClaimed
    },
    showMediaCard() {
      return this.claimCardModalType !== 'LUCKY_BAG' || this.isClaimed
    },
    showMediaStepCard() {
      const { chainId } = this.claimCardModalAmountInfoData || {}
      return (
        this.rewardChainId === chainId &&
        this.claimCardModalType === 'LUCKY_BAG' &&
        !this.isClaimed
      )
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
    isShowClose() {
      const statusGroup = JSON.parse(
        localStorage.getItem('LUCKY_BAG_JOIN_MEDIA_STATUS') ||
          JSON.stringify({})
      )
      const evmAddress = (this.currentEvmAddress || '').toLocaleLowerCase()

      return (
        this.isClaimed ||
        this.claimCardModalType !== 'LUCKY_BAG' ||
        statusGroup[evmAddress] ||
        this.status === 3
      )
    },
    chainName() {
      return util.chainName(this.rewardChainId)
    },
    showClaimChainText() {
      return (
        !this.showMediaStepCard &&
        this.isAmount &&
        !this.isClaimed &&
        this.claimCardModalType === 'LUCKY_BAG'
      )
    },
  },
  methods: {
    setStepStatus(status) {
      this.status = status
      if (status === 3) {
        const statusGroup =
          localStorage.getItem('LUCKY_BAG_JOIN_MEDIA_STATUS') ||
          JSON.stringify({})
        const evmAddress = (this.currentEvmAddress || '').toLocaleLowerCase()
        if (evmAddress) {
          localStorage.setItem(
            'LUCKY_BAG_JOIN_MEDIA_STATUS',
            JSON.stringify({
              ...JSON.parse(statusGroup),
              [evmAddress]: 'true',
            })
          )
        }
      }
    },
    goToSwap() {
      const name = this.name
      const url = this.url
      this.$gtag.event(name, {
        event_category: name,
        event_label: url,
      })
      window.open(url, '_blank')
    },
    async getCardIds(_self, rpcList, error) {
      _self = _self || this
      _self.cardIds = []
      if (_self.claimCardModalType !== 'LUCKY_BAG') return
      const evmAddress = _self.currentEvmAddress
      if (!evmAddress || evmAddress === '0x') return
      let rpc = ''
      let currentRpcList = []
      const chainId = this.rewardChainId
      const claimContractAddress = this.rewardInfo?.claimContract
      if (error || !chainId || !claimContractAddress) return
      try {
        if (rpcList?.length) {
          currentRpcList = rpcList
        } else {
          currentRpcList = await util.getRpcList(chainId)
        }
        rpc = currentRpcList?.[0] || ''

        const provider = new ethers.providers.JsonRpcProvider(rpc)

        const signer = provider.getSigner(evmAddress)

        const claimContract = new ethers.Contract(
          claimContractAddress,
          Orbiter_CLAIM_ABI,
          signer
        )

        const cardIds = await claimContract.getClaimedCards(evmAddress)

        _self.cardIds = [].concat(cardIds)
      } catch (error) {
        _self.getCardIds(
          _self,
          currentRpcList?.slice(1),
          !currentRpcList?.slice(1)?.length
        )
      }
    },
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
    handleHidden() {
      this.isClaim = false
      this.loading = false
      this.$store.commit('getClaimORBGUYRewardData', { type: '' })
    },
    async claim() {
      const evmAddress = this.currentEvmAddress
      if (!evmAddress || evmAddress === '0x') return
      if (this.isLuckyBagTask) {
        const name = "CLAIM_REWARD_AABANK"
        const url = 'https://www.aabank.xyz/claim?from=orbiter&user=' + evmAddress
        this.$gtag.event(name, {
          event_category: name,
          event_label: evmAddress,
        })
        window.open(url, '_blank')
        return
      }
      const chainId = this.rewardChainId
      const rewardInfo = this.rewardInfo
      const claimContractAddress = rewardInfo?.claimContract
      if (this.isClaim || this.loading || !chainId || !claimContractAddress)
        return
      const { data, sign: signData } = this.claimCardModalDataInfoData || {}
      const provider = new ethers.providers.Web3Provider(
        compatibleGlobalWalletConf.value.walletPayload.provider
      )

      const chainID =
        +web3State?.networkId ||
        +provider?.network?.chainId ||
        +this.currentNetwork

      if (Number(chainID) !== Number(chainId)) {
        util.showMessage(`Please Switch ${this.chainName} Network`, 'warning')
        if (
          [METAMASK, COINBASE, WALLETCONNECT, TOKEN_POCKET_APP].includes(
            compatibleGlobalWalletConf.value.walletType
          )
        ) {
          try {
            if (!(await util.ensureWalletNetwork(String(chainId)))) {
              return
            }
          } catch (err) {
            console.error(err)
            util.showMessage(err.message, 'error')
            return
          }
        }
        return
      }
      try {
        this.loading = true

        const signer = provider.getSigner()

        const claimContract = new ethers.Contract(
          claimContractAddress,
          Orbiter_CLAIM_ABI,
          signer
        )

        try {
          const cardIds = await claimContract.getClaimedCards(evmAddress)
        } catch (error) {
          console.log('error', error)
          util.showMessage(
            'Claim failed, please check your network/wallet address, 1 wallet could only claim once.',
            'error'
          )
          this.loading = false
          return
        }

        const params = [
          [...(data || [])].map((item) => {
            return {
              id: item.id,
              value: ethers.utils
                .parseUnits(String(item.value), item.decimals)
                .toString(),
              expiredTimestamp: Number(item.expiredTimestamp),
              flag: Number(item.flag),
            }
          }),
          [...(signData || [])],
        ]

        let emitGas = ethers.utils.parseUnits('500000')
        try {
          emitGas = await claimContract.estimateGas.claim(params[0], params[1])
        } catch (error) {}

        const res = await claimContract.claim(params[0], params[1], {
          gasLimit: emitGas.mul('12').div('10'),
        })
        await res.wait()
        this.isClaim = true
        this.$store.commit('requestLuckyBagDataInfo', {
          address: this.currentEvmAddress,
        })
        const addTokenRes = await provider.provider.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: rewardInfo?.token,
              symbol: rewardInfo?.symbol,
              decimals: rewardInfo?.decimals,
              image: '',
            },
          },
        })
      } catch (error) {
        this.loading = false
        util.showMessage(String(error?.message || error), 'error')
      }
    },
  },
  watch: {
    claimCardModalDataInfoData(newValue) {
      if (newValue) {
        this.getCardIds()
      }
    },
    currentEvmAddress(newValue) {
      if (newValue && newValue !== '0x') {
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

            .not-token-amount {
              width: 100%;
              margin-top: 24px;
              font-size: 18px;
              font-weight: 600;
              line-height: 32px;
              letter-spacing: 0px;
              color: rgb(255, 79, 79);
            }

            .not-token-amount-tips {
              color: rgb(34, 34, 34);
              font-size: 16px;
              font-weight: 500;
              line-height: 24px;
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

                .token-image {
                  margin-left: 4px;
                  width: 55px;
                  height: 12px;
                }
              }
            }

            .claim-chain-text {
              width: 100%;
              margin-top: 12px;
              font-size: 14px;
              font-weight: 600;
              line-height: 20px;
              letter-spacing: 0px;
              .chain-name {
                color: rgb(223, 46, 45);
              }
            }

            .lucky_bag_task {
              width: 100%;
              margin-top: 12px;
              font-size: 14px;
              font-weight: 600;
              line-height: 20px;
              letter-spacing: 0px;
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
