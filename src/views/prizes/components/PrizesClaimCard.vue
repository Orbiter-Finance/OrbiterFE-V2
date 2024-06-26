<template>
  <div class="prizes-claim-card" id="prizes-claim-card">
    <div class="card-title"> {{ isFetch ? 'Congratulations!' : 'Achievements!' }} 🎉</div>

    <div v-if="tx >= 3" class="ranking-info info">
      <div class="label">Current rank</div>
      <div class="amount">{{ decimalNumC(rank, 0, ",") }}</div>
    </div>

    <div class="tx-info info">
      <div class="label">Accumulated</div>
      <div class="amount">{{ txAmount }}tx bridges</div>
    </div>
    <div class="ranking-info info">
      <div class="label">Claimed</div>
      <div class="amount">{{ opointsAmount }} O-Points</div>
    </div>
    <div class="reward-card-group">
      <div class="reward-group">
        <div
          class="reward-card"
          v-for="item in list"
          :key="item.symbol"
          :style="`width: ${isFetch ? '48%' : '100%'}`"
        >
          <div class="usdc-symbol">
            <svg-icon v-if="item.symbol" :iconName="item.symbol"></svg-icon>
            <div v-else class="reward-image"></div>
          </div>
          <div v-if="item.symbol" class="reward-amount">
            {{ item.quantity }} ${{ item.symbol }}
          </div>
        </div>
      </div>

      <div class="claim-group">
        <div class="claim-btn" @click="claim">
          {{ isFetch ? 'claim' : 'earn extra prize' }}
        </div>
      </div>
    </div>
    <div class="desction">
      <span v-if="isFetch">Claim your Token on <span class="tips">Arbitrum</span> from AAbank</span>
      <span v-else>partner's incentives from AAbank</span>
    </div>
  </div>
</template>

<script>
import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'
import { requestClaimPrizesRewardData } from '../../../common/openApiAx'
import { decimalNum } from '../../../util/decimalNum'
import {
  prizesUserTx,
  prizesUserIsJoinTelegram,
  prizesRewardList,
  setPrizesRewardList,
  prizesRewardIsFetch,
  setPrizesRewardIsFetch,
  prizesUserRank
} from '../../../composition/hooks'

let timer

export default {
  name: 'PrizesClaimCard',
  computed: {
    isFetch() {
      return prizesRewardIsFetch.value
    },
    list() {
      return prizesRewardList.value
    },
    isJoinTelegram() {
      return prizesUserIsJoinTelegram.value
    },
    tx() {
      return prizesUserTx.value
    },
    rank() {
      return prizesUserRank.value
    },
    txAmount() {
      return this.decimalNumC(this.tx || '0', 0, ',')
    },
    opointsAmount() {
      const opoints = this.tx > 0 ? (this.tx >= 2 ? 17 : 5) : 0
      const joinTelegramOPoints = this.isJoinTelegram ? 3 : 0

      return opoints + joinTelegramOPoints
    },
    evmAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress || ''
    },
  },
  created() {
    this.getData()
  },
  watch: {
    evmAddress(item1, item2) {
      if (!!item1 && item1 !== item2) {
        this.getData()
      }
    },
  },
  methods: {
    decimalNumC(num, decimal, delimiter, symbol) {
      return decimalNum(num, decimal, delimiter, symbol)
    },
    async getData() {
      clearTimeout(timer)
      if (!this.evmAddress || this.evmAddress === '0x') return
      timer = setTimeout(async () => {
        const res = await requestClaimPrizesRewardData(this.evmAddress)
        if (res.length) {
          setPrizesRewardIsFetch(true)
          setPrizesRewardList(res.map((item) => {
            return {
              ...item,
              quantity: this.decimalNumC(item.quantity, '6', ','),
            }
          }))
        } else {
          setPrizesRewardList([{
              symbol: '',
              quantity: '',
            }])
            setPrizesRewardIsFetch(false)
        }
      }, 200)
    },
    claim() {
      if (!this.evmAddress || this.evmAddress === '0x') return
      const name = 'go to earn prizes'
      const url = `https://www.aabank.xyz/claim?from=orbiter&user=${this.evmAddress}`
      this.$gtag.event(name, {
        event_category: name,
        event_label: url,
      })
      window.open(url, '_blanck')
    },
  },
}
</script>

<style lang="scss" scoped>
.prizes-claim-card {
  width: 100%;
  max-width: 456px;
  border: 2px solid rgb(239, 47, 45);
  border-radius: 16px;
  box-shadow: inset 0px 0px 34px 0px rgba(239, 47, 45, 0.4),
    0px 0px 14px 0px rgb(239, 47, 45);
  backdrop-filter: blur(40px);
  background: rgba(0, 0, 0, 0.6);
  padding: 24px;
  text-align: left;
  .card-title {
    color: rgb(255, 255, 255);
    font-size: 20px;
    font-weight: 700;
    line-height: 27px;
    letter-spacing: 0px;
    font-family: GeneralSans-SemiBold;
  }
  .info {
    margin-top: 8px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: GeneralSans-SemiBold;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0px;
    .label {
      font-family: GeneralSans-Medium;
    }
    .amount {
      color: #ffba56;
    }
  }
  .reward-card-group {
    width: 100%;
    background: rgb(34, 34, 34);
    border-radius: 12px;
    margin-top: 16px;

    .reward-group {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: start;
      .reward-card {
        padding: 24px 16px 0;
        .usdc-symbol {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          svg {
            width: 64px;
            height: 64px;
          }

          .reward-image {
            width: 165px;
            height: 125px;
            background-image: url(../../../assets/prizes/reward.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }
        }
        .reward-amount {
          width: 100%;
          margin-top: 12px;
          color: rgb(255, 255, 255);
          font-size: 16px;
          font-weight: 700;
          line-height: 32px;
          letter-spacing: 0px;
          text-align: center;
          font-family: GeneralSans-SemiBold;
          white-space: nowrap;
        }

        .reward-amount-extra {
          width: 100%;
          color: rgb(255, 255, 255);
          font-size: 16px;
          font-weight: 700;
          line-height: 32px;
          letter-spacing: 0px;
          text-align: center;
          font-family: GeneralSans-SemiBold;
          white-space: nowrap;
        }
      }
    }

    .claim-group {
      width: 100%;
      padding: 12px 16px 24px;
      .claim-btn {
        width: 100%;
        border-radius: 8px;
        background: rgb(223, 46, 45);
        padding: 12px 0;
        font-family: GeneralSans-Bold;
        font-size: 20px;
        font-weight: 700;
        line-height: 22px;
        letter-spacing: 0px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .desction {
    width: 100%;
    margin-top: 16px;
    font-size: 14px;
    font-family: GeneralSans-SemiBold;
    line-height: 16px;
    letter-spacing: 0px;
    text-align: center;
    .tips {
      color: #df2e2d;
    }
  }
}

@media (max-width: 740px) {
  #prizes-claim-card {
    .reward-card {
      .reward-image {
        width: 110px;
        height: 84px;
      }
    }
  }
}
</style>
