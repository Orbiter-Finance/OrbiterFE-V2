<template>
  <div id="lucky-task-card-banner" @click="luckyClick"  class="lucky-task-card-banner">
    <div class="lucky-task-card">
        <div class="top-banenr">
          <div class="banner-content">
            <div class="banner-title">
              <div class="banner-task-title orbiter_global_o_points_title">
                <svg-icon class="task-icon" iconName="534352"></svg-icon>
                $ORBGUY Prize Pool
              </div>
              <div class="orbguy-price" @click="openLikwidSwap">
                <svg-icon class="task-icon" iconName="ORBGUY"></svg-icon>
                <div class="price-amount">{{ price }}</div>
                <span class="price-symbol">ETH/ORBGUY</span>
              </div>
            </div>
  
            <div class="progress-box">
              <div
                class="progress progress-bg"
                :style="{
                  width:
                    Number(ratio) >= 100 ? '100%' : decimalNumC(ratio, 3) + '%',
                }"
              >
                <div class="skeleton"></div>
              </div>
              <div class="banner-progress">
                <div class="progress-amount">
                  <span class="current-amount">{{ current }}/</span
                  ><span class="total-amount">{{ total }}</span>
                </div>
                <div class="progress-label">Claim Progress</div>
              </div>
            </div>
            <!-- <img class="bag-image" @click="drawLuckyTaskBag()"
             :src="require(`../../assets/activity/points_task/${amount ? 'bag' :'bag-d'}.png`)" 
            alt=""> -->
          </div>
        </div>
      </div>
  </div>
</template>

<script>

import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'
import { decimalNum } from '../../util/decimalNum'
import SvgIcon from '../SvgIcon/SvgIcon.vue'
import { isMobileDevice } from '../../util'

import {
  luckyBaTaskgOrbguyInfo,
  luckyBaTaskgUserOrbguyInfo,
} from '../../composition/hooks'
import Web3 from 'web3'
const BigNumber = require('bignumber.js')
export default {
  components: {
    SvgIcon,
  },
  name: 'LuckyTaskBagBanner',

  data() {
    return {
      price: "",
    }
  },

  computed: {
    luckyBagInfo() {
      return luckyBaTaskgOrbguyInfo.value
    },
    total() {
      const t = this.luckyBagInfo?.total
      return this.decimalNumC(Number(t) || 0, 2, ',')
    },
    current() {
      let c = this.luckyBagInfo?.current
      const t = this.luckyBagInfo?.total
      c = t >= c ? c : t
      return this.decimalNumC(Number(c) || 0, 2, ',')
    },
    ratio() {
      const r = Number(this.luckyBagInfo?.progressRatio) * 100
      return r >= 100 ? 100 : r
    },
    evmAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress
    },
    luckyBagUserInfo() {
      return luckyBaTaskgUserOrbguyInfo.value
    },
  },
  created() {
    this.getData()
    this.getOrbguyPrice()
  },

  methods: {
    luckyClick() {
      if (isMobileDevice()) {
        document.getElementById('block_mobile_scroll_group').scrollTop = document.getElementById('lucky-task-card-group').offsetTop - 160;
      } else {
        document.getElementById('ativity-list').scrollTop = document.getElementById('lucky-task-card-group').offsetTop - 200;
      }

    },
    openLikwidSwap() {
      const evmAddress = this.evmAddress
      if (!evmAddress || evmAddress === '0x') return
      const name = 'TASK_TO_LIKWID_SWAP_SCROLL_ORBGUY'
      const url = 'https://likwid.meme/swap?from=orbiter&user=' + evmAddress
      this.$gtag.event(name, {
        event_category: name,
        event_label: evmAddress,
      })
      window.open(url, '_blank')
    },
    async getOrbguyPrice() {
      const web3 = new Web3(
        new Web3.providers.HttpProvider('https://rpc.vizing.com')
      )
      const raw = web3.eth.abi.encodeFunctionSignature('getReserves()')
      const res = await web3.eth.call({
        to: '0xFaf184a9d23A4F0377c7b1A4D58aB0d36353190B',
        data: raw,
      })
      const result = web3.eth.abi.decodeParameters(
        ['uint256', 'uint256'],
        res || ''
      )
      this.price = this.decimalNumC(
        new BigNumber(result[0]).div(result[1] + "").toFixed(7) + "",
        7,
        ','
      )
    },
    drawLuckyTaskBag(data) {
      this.$store.commit("getClaimORBGUYRewardData", {
          type: "LUCKY_BAG_TASK",
          distributeResult: Number(data?.distributeResult) || 0
      })
      // const evmAddress = this.evmAddress
      // if (!Number(this.amount) || !evmAddress || evmAddress === '0x') return
      // const name = 'CLAIM_TO_BNB_LUCKY_BAG_AABANK'
      // const url = 'https://www.aabank.xyz/claim?from=orbiter&user=' + evmAddress
      // this.$gtag.event(name, {
      //   event_category: name,
      //   event_label: evmAddress,
      // })
      // window.open(url, '_blank')
    },
    getData() {
      this.$store.commit('getLuckyBagTaskInfo')
    },
    getUserData() {
      if (!this.evmAddress || this.evmAddress === '0x') return
      this.$store.commit(
        'getLuckyBagUserTaskInfo',
        this.evmAddress.toLocaleLowerCase()
      )
      // this.$store.commit(
      //   'getLuckyBagTaskUserOPointsInfo',
      //   this.evmAddress.toLocaleLowerCase()
      // )
    },
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
  },
}
</script>

<style lang="scss" scoped>

@keyframes shine {
    to {
      // Move shine from left to right, with offset on the right based on the width of the shine - see background-size
      background-position: right -40px top 0;
    }
  }

.lucky-task-card-banner {
    width: 100%;


  .lucky-task-card {
    margin: 12px 16px;
    width: calc(100% - 32px);
    border: 1px solid rgb(235, 194, 142);
    border-radius: 12px;
    box-shadow: inset 0px 0px 24px 0px rgb(235, 194, 142);
    background: rgb(0, 0, 0);

    .top-banenr {
      width: 100%;
      // height: 100px;
      // background-image: url(../../assets/activity/points_task/lucky_orbguy.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      border-radius: 12px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 12px;
      text-align: left;
      color: #fff;
      .banner-content {
        width: 100%;

        .banner-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          font-family: GeneralSans-Bold;
          font-weight: 700;
          white-space: nowrap;

          .banner-task-title {
            display: flex;
            justify-content: start;
            align-items: center;
          }

          .orbguy-price {
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .price-amount {
              font-size: 12px;
              margin-right: 4px;
              font-family: GeneralSans-Bold;
              text-decoration: underline;
              cursor: pointer;
            }

            .price-symbol {
              font-size: 12px;
              font-family: GeneralSans-Regular;
            }
          }

          .task-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 20px;
            height: 20px;
            margin-right: 6px;
          }
        }
        .bag-image {
          width: 28px;
          height: 28px;
          cursor: pointer;
        }

        .progress-box {
          width: 100%;
          height: 14px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          margin-top: 8px;
          overflow: hidden;
          position: relative;
          top: 0;
          left: 0;
          .progress {
            height: 14px;
            border-radius: 6px;
          }
          .progress-bg {
            background: linear-gradient(
              90deg,
              rgb(223, 46, 45) 43.689%,
              rgb(255, 150, 50) 100%
            );
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
          .banner-progress {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            position: absolute;
            top: 0;
            left: 0;
            padding: 0 8px;

            .progress-label {
              white-space: nowrap;
              font-family: GeneralSans-Regular;
              zoom: 0.8;
            }

            .progress-amount {
              white-space: nowrap;
              font-weight: 500;
              font-family: GeneralSans-Medium;
              zoom: 0.8;
              .current-amount {
                font-family: GeneralSans-SemiBold;
                font-weight: 600;
              }

              .total-amount {
                font-family: GeneralSans-Medium;
                color: rgba(#fff, 0.5);
              }
            }
          }
        }
      }
    }
  }
}

</style>