<template>
  <div class="prizes-user" id="prizes-user">
    <div class="title-group">
      <div class="user-title">
        <span>200</span>
         <svg-icon class="token" iconName="BNB"></svg-icon>
         $BNB for top 300</div>
    </div>
    <div class="title-group">
      <div class="vice-title">
       0 bridging fee for top 10
      </div>
    </div>

    <!-- <div class="user-card">
      <div class="card-title">My data</div>
      <div class="user-info">
        <div class="info-item">
          <div class="info-label">Address</div>
          <div class="info-value">{{ userAddress }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Rank</div>
          <div class="info-value">{{ userRank }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Cumulative</div>
          <div class="info-value">{{ txTotal }} Tx</div>
        </div>
        <div class="info-item">
          <div class="info-label">Estimated earnings</div>
          <div class="info-value">
            {{ estiReward }}
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>

import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'

import SvgIcon from '../../../components/SvgIcon/SvgIcon.vue'
import SvgIconThemed from '../../../components/SvgIconThemed.vue'

import {
  prizesV2UserRank,
  prizesV2UserList,
  prizesV2RankList
} from '../../../composition/hooks'
import { decimalNum } from '../../../util/decimalNum';
import { shortenAddress } from '../../../util/shortenAddress';

export default {
  components: { SvgIcon, SvgIconThemed },
  name: 'PrizesUser',
  computed: {
    userList(){
      return prizesV2UserList.value
    },
    userRank(){
      return prizesV2UserRank.value || "--"
    },
    rankList(){
      return prizesV2RankList.value
    },
    txTotal() {
      const list = this.userList
      const total = list?.reduce((prev, item)=>{
        return prev + (Number((item?.task_result) || 0))
      }, 0)
      return total 
    },
    evmAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress || ''
    },
    estiReward() {
      const list = this.rankList
      const option = list.filter((item)=> item.address?.toLocaleLowerCase() === this.evmAddress?.toLocaleLowerCase())?.[0]
      const amount = option?.reward?.amount
      const refund = option?.refund
      const total = (Number(amount) || 0) + (Number(refund) || 0)
      return Number(total) ? (this.decimalNumC(total, 2, ",")+ " USDC") : "--"
    },
    userAddress() {
      const address = this.evmAddress
      return address ? shortenAddress(address) : "--"
    }
  },
  methods: {
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
  }
}
</script>

<style lang="scss" scoped>
.prizes-user {
  width: 100%;
  margin-top: 80px;
  .title-group {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .user-title {
    font-size: 48px;
    font-family: GeneralSans-SemiBold;
    line-height: 56px;
    letter-spacing: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    span {
      color: #f3ba2f;
      margin-right: 8px;
    }
    .token {
      width: 56px;
      height: 56px;
      margin: 0 8px;
    }
  }

  .vice-title {
    width: 100%;
    margin-top: 24px;
    font-size: 20px;
    font-family: GeneralSans-Medium;
    line-height: 27px;
    letter-spacing: 0px;
    span {
      color: #f3ba2f;
    }
  }

  .user-card {
    width: 100%;
    margin-top: 32px;
    padding: 32px;
    background-image: url('../../../assets/prizes/v2/user-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .card-title {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 24px;
      font-family: GeneralSans-SemiBold;
      line-height: 32px;
      letter-spacing: 0px;
    }

    .user-info {
      width: 100%;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .info-item {
        .info-label {
          color: #f3ba2f;
          text-align: left;
          font-size: 18px;
          font-family: GeneralSans-Medium;
          line-height: 32px;
          letter-spacing: 0px;
        }
        .info-value {
          font-size: 32px;
          font-family: GeneralSans-SemiBold;
          line-height: 40px;
          letter-spacing: 0px;
        }
      }
    }
  }
}

@media (max-width: 740px) {
  #prizes-user {
    width: 100%;
    margin-top: 32px;
    .title-group {
      width: 100%;
    }
    .user-title {
      width: 100%;
      font-size: 24px;
      line-height: 28px;
      .token {
        width: 24px;
        height: 24px;
      }
    }
    .vice-title {
      margin-top: 16px;
      width: 80%;
      font-size: 16px;
      line-height: 20px;
    }

    .user-card {
      margin-top: 16px;
      padding: 16px;
      .card-title {
        font-size: 16px;
        line-height: 20px;
      }

      .user-info {
        margin-top: 8px;
        display: block;

        .info-item {
          margin-top: 4px;
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          .info-label {
            font-size: 14px;
            line-height: 18px;
          }
          .info-value {
            flex: 1;
            text-align: right;
            font-size: 20px;
            line-height: 24px;
          }
        }
      }
    }
  }
}
</style>
