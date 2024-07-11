<template>
  <div id="lucky-task-card-group" class="lucky-task-card-group">
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
    <div class="task-card-group">
      <div class="task-card-title">
        <svg-icon class="task-icon" iconName="534352"></svg-icon>
        100,000 $ORBGUY Reward
      </div>
      <div class="task-card-item" v-for="item in taskList" :key="item.key">
        <div class="task-title">
          <div class="task-info">
            <svg-icon class="task-icon" iconName="task-icon"></svg-icon>
            <div class="task-desction-group">
              <span class="task-desction" v-html="item.text"></span>
              <o-tooltip>
                <template v-slot:titleDesc>
                  <div style="margin-left: -20px">
                    <span>
                      <span>Specific networks include: </span>
                      <br />
                      Arbitrum 、Linea、Cyber、Optopia、Base、Zklink Nova、Manta、Polygon、Blast、Optimism、Ethereum 、Zora
                    </span>
                  </div>
                </template>
                <span class="orbiter_global_prizes_tips_underline tip-text"
                  >specific network</span
                >
              </o-tooltip>
              <span>to Scroll</span>
            </div>
          </div>
          <PrizesTaskSuccessIcon
            class="task-success-icon"
            v-if="!!item.isSuccess"
            :fillColor="'#DDF600'"
          ></PrizesTaskSuccessIcon>
        </div>
        <div class="task-card-item-info">
          <div class="taks-reward-info">
            <div class="card-tips" :style="`background:#000000;`">
              <svg-icon class="tips-icon" iconName="ORBGUY"></svg-icon>
              {{ item.tips }}
            </div>

            <div class="group-reward">
              <svg-icon iconName="O-Points"></svg-icon>
              +{{ item.opoints }} OPoints
            </div>

            <div class="task-progress">
              {{ item.taskResult }}/{{ item.key }}
            </div>
          </div>

          <img
            v-if="item.isTask"
            class="bag-image"
            @click="drawLuckyTaskBag(item)"
            :src="require('../../assets/activity/points_task/bag.png')"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'
import { decimalNum } from '../../util/decimalNum'

import SvgIcon from '../SvgIcon/SvgIcon.vue'

import {
  luckyBaTaskgOrbguyInfo,
  luckyBaTaskgUserOrbguyInfo,
  actDialogVisible,
} from '../../composition/hooks'
import Web3 from 'web3'
const BigNumber = require('bignumber.js')

export default {
  components: {
    SvgIcon,
  },
  name: 'LuckyTaskCard',

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
    amount() {
      const luckyUserList = this.luckyBagUserInfo || []
      let amountValue = 0
      luckyUserList.forEach((item) => {
        const value = item?.taskResult || 0
        amountValue += Number(value)
      })
      return amountValue
    },
    taskList() {
      const luckyUserList = this.luckyBagUserInfo || []
      return [
        {
          icon: 'bridge',
          key: '3',
          text: `Bridge 3TX from `,
          tips: 'Bronze Bag',
          opoints: '10',
        },
        {
          icon: 'bridge',
          key: '12',
          opoints: '45',
          text: `Bridge 12TX from `,
          tips: 'Silver Bag',
        },
        {
          icon: 'bridge',
          key: '24',
          opoints: '100',
          text: `Bridge 24TX from `,
          tips: 'Gold Bag',
        },
        {
          icon: 'bridge',
          key: '36',
          text: `Bridge 36TX from `,
          tips: 'Platinum Bag',
          opoints: '180',
        },
        {
          icon: 'bridge',
          key: '51',
          opoints: '285',
          text: `Bridge 51TX from `,
          tips: 'Diamond Bag',
        }
      ].map((item, index)=>{
        const option = luckyUserList[index] || {}
        return ({
          ...item, 
          taskResult: option?.taskResult || 0,
          distributeResult: option?.distributeResult || 0,
          isTask: option?.distributed,
        })
      })
    },
    selectWalletDialogVisible() {
      return actDialogVisible.value
    },
  },
  created() {
    this.getData()
    this.getOrbguyPrice()
  },
  watch: {
    evmAddress(item1, item2) {
      if (!!item1 && item1 !== item2) {
        this.getUserData()
      }
    },
    selectWalletDialogVisible: function (newVisible) {
      if (!!newVisible) {
        this.getUserData()
      }
    },
  },

  methods: {
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
    openLuckyReward() {
      const list = this.luckyBagUserInfo || []
      let total = 0
      list.forEach((item) => {
        if(!!item?.distributed) {
          total += (Number(item?.distributeResult) || 0)
        }
      });

      if(!list?.length || !Number(total)) {
        return
      }
      this.$store.commit("getClaimORBGUYRewardData", {
          type: "LUCKY_BAG_TASK",
          distributeResult: total
      })
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

.lucky-task-card-group {
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

  .task-card-group {
    width: 100%;
    padding: 12px;
    margin: 12px 16px;
    width: calc(100% - 32px);
    background: #F5F5F5;
    border-radius: 12px;

    .task-card-title {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;
      font-family: GeneralSans-Bold;
      .task-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        margin-right: 6px;
      }
    }
    .task-card-item {
      width: 100%;
      border-radius: 8px;
      background-color: #fff;
      margin-top: 8px;
      padding: 12px;
      text-align: left;

      .task-title {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: start;
        .task-info {
          display: flex;
          justify-content: start;
          align-items: start;
          .task-icon {
            width: 20px;
            height: 20px;
            margin-right: 8px;
          }
          .task-desction-group {
            font-size: 14px;
            font-weight: 700;
            line-height: 20px;
            .task-desction {
              margin: 0 4px;
            }
            .tip-text {
              margin-right: 4px;
            }
          }
        }
      }

      .task-card-item-info {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .taks-reward-info {
          flex: 1;
          display: flex;
          justify-content: start;
          align-items: center;
          margin-top: 8px;

          .card-tips {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2px 4px;
            border-radius: 4px;
            font-family: GeneralSans-SemiBold;
            font-weight: 600;
            font-size: 12px;
            color: #FFF;
            .tips-icon {
              width: 16px;
              height: 16px;
              margin-right: 4px;
            }
          }

          .group-reward {
            display: flex;
            justify-content: start;
            align-items: center;
            padding: 2px 4px;
            border-radius: 4px;
            background: rgb(245, 245, 245);
            font-size: 12px;
            font-weight: 600;
            line-height: 16px;
            margin: 0 8px;
            svg {
              width: 16px;
              height: 16px;
              margin-right: 4px;
            }
          }

          .task-progress {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2px 4px;
            border-radius: 4px;
            background: rgb(245, 245, 245);
            font-size: 12px;
            font-weight: 600;
            line-height: 16px;
          }
        }

        .bag-image {
          width: 24px;
          height: 24px;
          cursor: pointer;
        }
      }
    }
  }
}

.dark-theme {
  #lucky-task-card-group {
    .lucky-task-card {
      background-color: #373951;
    }

    .task-card-group {
      background-color: #373951;
      .task-card-item {
        background-color: var(--dark-page-box-bg);
  
        .group-reward,
        .task-progress {
          background-color: #222222;
        }
      }
    }
    
  }
}
</style>
