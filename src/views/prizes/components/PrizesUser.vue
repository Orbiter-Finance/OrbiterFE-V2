<template>
  <div class="prizes-user" id="prizes-user">

    <div class="user-card">
      <div class="card-title">My progress</div>
      <div class="user-info">
        <div class="info-item">
          <div class="info-label">Rank</div>
          <div class="info-value">{{ userRank }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Estimated Earnings</div>
          <div class="info-value">
            {{ estiReward }}
          </div>
        </div>
        <div class="info-item">
          <div class="info-label">Cumulative</div>
          <div class="info-value">{{ txTotal }} Tx</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'

import SvgIcon from '../../../components/SvgIcon/SvgIcon.vue'
import SvgIconThemed from '../../../components/SvgIconThemed.vue'

import {
  prizesUserRank,
  prizesUserList,
  prizesRankList
} from '../../../composition/hooks'
import { decimalNum } from '../../../util/decimalNum';
import { shortenAddress } from '../../../util/shortenAddress';

export default {
  components: { SvgIcon, SvgIconThemed },
  name: 'PrizesUser',
  computed: {
    userList(){
      return prizesUserList.value
    },
    userRank(){
      return prizesUserRank.value || "--"
    },
    rankList(){
      return prizesRankList.value
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
      const rank = this.userRank
      const option = list.filter((item)=> {
        
        const address = item.address?.toLocaleLowerCase()
        const evmAddresss = this.evmAddress?.toLocaleLowerCase()
        return address && evmAddresss && address.slice(0, 6) === evmAddresss.slice(0, 6) && 
        address.slice(address.length-6) === evmAddresss.slice(address.length-6) && rank === item.rank
      })?.[0]
      const amount = option?.reward?.uAmount
      const total = (Number(amount) || 0)
      return Number(total) ? (this.decimalNumC(total, 2, ",")+ " USDC") : "--"
    },
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
  
  .user-card {
    width: 100%;
    margin-top: 40px;
    padding: 16px 24px;
    border-radius: 16px;

    background: linear-gradient(-0.77deg, rgba(15, 34, 37, 0.2) 59.661%,rgba(209, 112, 85, 0.2) 93.809%),rgb(15, 34, 37);

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
          color: #FFFFFF;
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
