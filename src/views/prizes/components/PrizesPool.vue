<template>
  <div id="prizes-pool" class="prizes-pool">
    <div class="pool-total">
      <div class="pool">
        <div>Prize Pool (USDC)</div>
        <div class="pool-total-amount">{{ totalPool }}</div>
      </div>
      <div class="participants">
        <div>Tx Amount</div>
        <div class="participants-total-amount">{{ totalTxAmount }}</div>
      </div>
    </div>
    <div class="progress-group">
      <div class="progress-pool-title">Prize pool</div>
      <div class="progress-info-scroll">
        <div class="progress-info">
          <div class="progress-pool-amount-group">
            <div class="progress-pool-amount">
              <div :class="`pool-item ${totalPool === item.reward ? 'pool-item-active' : ''}`" v-for="item in group" :key="item.reward">
                {{ item.reward }}
              </div>
            </div>
          </div>

          <div class="progress-content">
            <div class="progress-box">
              <div
                class="progress-box-item"
                v-for="item in group"
                :key="item.reward"
              ></div>
              <div class="progress" :style="`width: ${ratio}%;`">
                <div class="skeleton"></div>
              </div>
            </div>
          </div>

          <div class="progress-participants-amount-group">
            <div class="progress-participants-amount">
              <div
                :class="`participants-item ${totalPool === item.reward ? 'participants-item-active' : ''}`"
                v-for="item in group"
                :key="item.tx"
              >
                {{ item.tx }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="progress-participants-title">Tx Amount</div>
    </div>
  </div>
</template>

<script>
import { 
  prizesTotaltx
 } from "../../../composition/hooks"
import { decimalNum } from '../../../util/decimalNum'

export default {
  name: 'PrizesPool',

  data() {
    return {
      group: [
        {
          tx: "1~55,000 Tx",
          reward: "$7,000",
          range:[1, 55000]
        },
        {
          tx: "55,000~100,000 Tx",
          reward: "$10,500",
          range:[55000, 100000]

        },
        {
          tx: "100,000~180,000 Tx",
          reward: "$21,000",
          range:[100000, 180000]
        },
        {
          tx: "≥180,000 Tx",
          reward: "$35,000",
          range:[180000, 500000]
        }
      ]
    }
  },
  computed: {
    totalTx() {
      const tx = prizesTotaltx.value || 0

      return tx
    },
    totalTxAmount() {
      const tx = this.totalTx
      return this.decimalNumC(tx, 0, ",")
    },
    totalPool() {
      const list = this.group
      const tx = this.totalTx
      if(tx >= 180000) return list[list.length-1]?.reward || "$0"
      const group = list.filter((item)=> {
        const [first, last] = item.range
        return first <= tx && last >= tx
      })?.[0]
      return group?.reward || "$0"
    },
    ratio() {
      let ratioAmount = 0
      const list = this.group
      const tx = this.totalTx
      list.forEach((item)=> {
        const [first, last] = item.range
        if(first <= tx) {
          ratioAmount += 25
        } else {
          ratioAmount += 0
        }
      })

      return Number(ratioAmount) > 100 ? '100' : ratioAmount
    },
  },
  methods: {
    decimalNumC(num, decimal, delimiter, symbol) {
      return decimalNum(num, decimal, delimiter, symbol)
    },
  },
}
</script>

<style scoped lang="scss">
.prizes-pool {
  width: 100%;
  margin-top: 4px;

  .pool-total {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .pool {
      width: calc(50% - 12px);
      padding: 20px 0;
      box-sizing: border-box;
      border-radius: 16px;
      background: linear-gradient(-0.77deg, rgba(15, 34, 37, 0.2) 60.809%,rgba(209, 112, 85, 0.2) 117.632%),rgb(15, 34, 37);
      font-weight: 500;
      .pool-total-amount {
        color: #27FFFB;
        font-weight: 600;
        font-size: 48px;
      }
    }
    .participants {
      width: calc(50% - 12px);
      box-sizing: border-box;
      padding: 20px 0;
      border-radius: 16px;
      background: linear-gradient(-0.77deg, rgba(15, 34, 37, 0.2) 60.809%,rgba(209, 112, 85, 0.2) 117.632%),rgb(15, 34, 37);
      font-weight: 500;
      .participants-total-amount {
        color: #FF4F4F;
        font-weight: 600;
        font-size: 48px;
      }
    }
  }

  .progress-group {
    margin-top: 24px;
    width: 100%;
    text-align: left;

    .progress-pool-title {
      color: #27FFFB;
    }

    .progress-info-scroll {
      width: 100%;
      .progress-info {
        margin: 12px 0;
        width: 100%;
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;

        .progress-pool-amount-group {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .progress-pool-amount {
            flex: 1;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .pool-item {
              flex: 1;
              text-align: center;
            }

            .pool-item-active {
              font-size: 20px;
              font-family: GeneralSans-SemiBold;
              color: #27FFFB;
            }
          }
          
        }

        .progress-content {
          width: 100%;
          margin: 4px 0;
          .progress-box {
            margin: 1px 0;
            width: 100%;
            height: 32px;
            margin: 12px 0;
            box-sizing: border-box;
            border: 1px solid rgb(239, 47, 45);
            border-radius: 999px;
            box-shadow: inset 0px 0px 34px 0px rgba(239, 47, 45, 0.4);
            backdrop-filter: blur(156px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            overflow: hidden;
            position: relative;
            top: 0;
            left: 0;
            .progress-box-item {
              width: 100%;
              height: 100%;
              flex: 1;
              border-right: 1px solid rgba(239, 47, 45, 0.2);
            }

            .progress {
              position: absolute;
              top: 0;
              left: 0;
              height: 30px;
              background: linear-gradient(
                90deg,
                rgb(239, 47, 45),
                rgb(255, 102, 101) 100%
              );
              border-radius: 16px;
              overflow: hidden;
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

          .progress-tips {
            font-size: 14px;
            font-weight: 600;
            .progress-tips-group {
              width: 80px;
              transform: translateX(-40px);
              .participants-text {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #FF4F4F;
                text-align: center;
              }
              .progress-icon {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                svg {
                  width: 8px;
                  height: 8px;
                }
              }
            }
            
          }
        }

        .progress-participants-amount-group {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .progress-participants-amount {
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
          }
          .participants-item {
            flex: 1;
            text-align: center;
          }
          .participants-item-active {
            font-size: 20px;
            font-family: GeneralSans-SemiBold;
            color: #FF4F4F;
          }
        }
      }
    }

    .progress-participants-title {
      color: #FF4F4F;
    }
  }
}

@media (max-width: 740px) {
  #prizes-pool {
    padding: 0 16px;
    margin-top: 24px;
    .pool-total {
      font-size: 14px;
      .pool-total-amount {
        font-size: 24px;
      }
      .participants-total-amount {
        font-size: 24px;
      }
    }

    .progress-group {
      .progress-info-scroll {
        width: 100%;
        overflow: auto;
        .progress-info {
          width: 100%;
          min-width: 740px;
        }
      }
    }
  }
}
</style>
