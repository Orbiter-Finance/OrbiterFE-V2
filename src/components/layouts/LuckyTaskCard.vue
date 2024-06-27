<template>
  <div id="lucky-task-card" class="lucky-task-card">
    <div class="top-banenr">
      <div class="banner-content">
        <div class="banner-title">Get $ORBGUY and Opoints</div>
        <div class="banner-progress">
          <div class="progress-label">Claim Progress</div>
          <div class="progress-amount">
            <span class="current-amount">70,849</span>/<span
              class="total-amount"
              >100,000</span
            >
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
        </div>
      </div>
    </div>

    <div class="task-card-group">
      <div class="task-card-item" v-for="item in taskList" :key="item.key">
        <div class="task-title">
          <div class="task-info">
            <svg-icon class="task-icon" iconName="task-icon"></svg-icon>
            <div class="task-desction-group">
              <span class="task-desction" v-html="item.text"></span>
              <o-tooltip v-if="item.specificChain">
                      <template v-slot:titleDesc>
                        <div style="margin-left: -20px">
                          <span>
                            <span>Specific chains include: </span>
                            <br />
                            Linea、Manta、Base、Arbitrum、Polygon、Polygon zkEVM、Optimism、Ethereum、zkSync Lite、ZKSyncEra、Scroll、Zora、Mantle
                          </span>
                        </div>
                      </template>
                      <span class="orbiter_global_prizes_tips_underline tip-text"
                        >specific chain</span
                      >
                    </o-tooltip>
              <span v-if="item.specificChain">to opBNB/BSC</span>
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
            <div class="card-tips" :style="`background:${item.bg};`">
              <svg-icon class="tips-icon" iconName="ORBGUY"></svg-icon>
              {{ item.tips }}
            </div>

            <div class="group-reward">
              <svg-icon iconName="O-Points"></svg-icon>
              +{{ item.opoints }} OPoints
            </div>

            <div class="task-progress">{{ item.taskResult }}/{{ item.key }}</div>
          </div>

          <img class="bag-image" :src="require('../../assets/activity/points_task/bag.png')" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'
import { decimalNum } from '../../util/decimalNum'

import SvgIcon from '../SvgIcon/SvgIcon.vue'

export default {
  components: { SvgIcon },
  name: 'LuckyTaskCard',
  data() {
    return {
      ratio: 50,
    }
  },

  computed: {
    evmAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress || ''
    },
    taskList() {
      return [
        {
          icon: 'bridge',
          key: '3',
          text: `Bridge <span class="orbiter_global_lucky_bag_task">3TX</span> from `,
          tips: 'Bronze luckybag',
          opoints: '15',
          taskResult: 0,
          specificChain: true,
          bg: 'linear-gradient(180.00deg, rgb(233, 179, 135),rgb(197, 133, 81) 100%)',
        },
        {
          icon: 'bridge',
          key: '6',
          opoints: '40',
          text: `Bridge <span class="orbiter_global_lucky_bag_task">6TX</span> from `,
          tips: 'Silver luckybag',
          taskResult: 0,
          specificChain: true,
          bg: 'linear-gradient(180.00deg, rgb(240, 254, 255),rgb(190, 190, 190) 100%)',
        },
        {
          icon: 'bridge',
          key: '9',
          opoints: '60',
          text: `Bridge <span class="orbiter_global_lucky_bag_task">9TX</span> from `,
          tips: 'Gold luckybag',
          taskResult: 0,
          specificChain: true,
          bg: 'linear-gradient(180.00deg, rgb(255, 222, 155),rgb(243, 169, 19) 100%)',
        },
      ]
    },
  },
  created() {
    this.getData()
  },
  watch: {
    evmAddress(item1, item2) {
      if (!!item1 && item1 !== item2) {
        this.getUserData()
      }
    },
  },
  methods: {
    getData(){
        this.$store.commit("getLuckyBagTaskInfo")
    },
    getUserData(){
        if (!this.evmAddress || this.evmAddress === "0x") return
        this.$store.commit("getLuckyBagUserTaskInfo", this.evmAddress.toLocaleLowerCase())
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
.lucky-task-card {
  margin: 12px 16px;
  width: calc(100% - 32px);
  background-color: #f5f5f5;
  border-radius: 12px;

  .top-banenr {
    width: 100%;
    height: 100px;
    background-image: url(../../assets/activity/points_task/lucky_orbguy.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 16px 20px;
    text-align: left;
    color: #fff;
    .banner-content {
      width: 64%;

      .banner-title {
        width: 100%;
        font-size: 18px;
        white-space: nowrap;
        font-family: GeneralSans-Bold;
        font-weight: 700;
      }

      .banner-progress {
        margin-top: 4px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;

        .progress-label {
          white-space: nowrap;
          font-family: GeneralSans-Medium;
          font-weight: 500;
        }

        .progress-amount {
          white-space: nowrap;
          font-weight: 500;
          font-family: GeneralSans-Medium;

          .current-amount {
            font-family: GeneralSans-SemiBold;
            font-weight: 600;
          }

          .total-amount {
            color: rgba(#fff, 0.5);
          }
        }
      }

      .progress-box {
        width: 100%;
        height: 8px;
        background: #eeeeee;
        border-radius: 6px;
        margin-top: 8px;
        overflow: hidden;
        .progress {
          height: 8px;
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
      }
    }
  }

  .task-card-group {
    width: 100%;
    padding: 4px 12px 12px;
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
  #lucky-task-card {
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
</style>
