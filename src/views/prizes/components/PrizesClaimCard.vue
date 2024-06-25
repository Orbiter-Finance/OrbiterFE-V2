<template>
  <div class="prizes-claim-card">
    <div class="card-title">Congratulations 🎉</div>
    <!-- <div class="ranking-info info">
      <div class="label">Current rank</div>
      <div class="amount">19</div>
    </div> -->
    <div class="tx-info info">
      <div class="label">Accumulated</div>
      <div class="amount">{{ txAmount }}tx bridges</div>
    </div>
    <div class="reward-card-group">
      <div class="reward-group">
        <div class="reward-card" v-for="item in list" :key="item.symbol">
          <div class="usdc-symbol">
            <svg-icon :iconName="item.symbol"></svg-icon>
          </div>
          <div class="reward-amount"> {{ item.quantity }} $USDC</div>
        </div>
      </div>

     <div class="claim-group">
      <div class="claim-btn">
        Claim
      </div>
     </div>
    </div>
    <div class="desction">
      Claim your Token on <span class="tips">Arbitrum</span>
    </div>
  </div>
</template>

<script>

import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'
import {requestClaimPrizesRewardData  } from "../../../common/openApiAx"
import { decimalNum } from '../../../util/decimalNum'
import {
  prizesUserTx
} from '../../../composition/hooks'

export default {
  name: 'PrizesClaimCard',
  data() {
    return {
      list: [{
      symbol: "USDC",
      quantity: "--"
    }]
    }
  },
  computed: {
    tx() {
      return prizesUserTx.value
    },
    txAmount() {
      return this.decimalNumC(this.tx || "0", 0, ",")
    },
    evmAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress || ''
    },
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
      if (!this.evmAddress || this.evmAddress === "0x") return
      const res = await requestClaimPrizesRewardData(
        this.evmAddress
      )
      console.log("1111", res )
      this.list = res.map((item)=>{
        return ({
          ...item,
          quantity: this.decimalNumC(item.quantity, "6", ",")
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.prizes-claim-card {
  width: 456px;
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
        width: 48%;
        padding: 24px 16px;
        .usdc-symbol {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          svg {
            width: 64px;
            height: 64px;
          }
        }
        .reward-amount {
          width: 100%;
          margin-top: 12px;
          color: rgb(255, 255, 255);
          font-size: 20px;
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
      padding: 12px 16px;
      .claim-btn {
        width: 100%;
        border-radius: 8px;
        background: rgb(223, 46, 45);
        padding: 12px 0;
        font-family: GeneralSans-Bold;
        font-size: 16px;
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
</style>