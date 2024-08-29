<template>
  <div id="prizes-pool" class="prizes-pool">
    <div class="pool-total">
      <div class="pool">
        <div>Prize Pool (USDC)</div>
        <div class="pool-total-amount"
        :style="`font-size: ${ !currentPool ? '32px' : '48px'};`"
        >{{ totalPool }}</div>
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
              <div
                :class="`pool-item ${
                  totalPool === item.reward ? 'pool-item-active' : ''
                }`"
                v-for="item in group"
                :key="item.reward"
              >
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
              >
              <svg-icon iconName="lock"></svg-icon>
              </div>
              <div class="progress" :style="`width: ${ratio}%;`">
                <div class="skeleton"></div>
              </div>
            </div>
          </div>

          <div class="progress-participants-amount-group">
            <div class="progress-participants-amount">
              <div
                :class="`participants-item ${
                  totalPool === item.reward ? 'participants-item-active' : ''
                }`"
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
import SvgIcon from '../../../components/SvgIcon/SvgIcon.vue'
import { prizesTotaltx } from '../../../composition/hooks'
import { decimalNum } from '../../../util/decimalNum'

export default {
  components: { SvgIcon },
  name: 'PrizesPool',

  data() {
    return {
      group: [
        {
          tx: '0~2,499 Tx',
          reward: '',
          range: [0, 2499],
          bridge50Fee: 0,
          bridge100Fee: 0,
        },
        {
          tx: '2,500~11,499 Tx',
          reward: '$1,750',
          range: [2500, 11499],
          bridge50Fee: 5,
          bridge100Fee: 15,
        },
        {
          tx: '11,500~25,999 Tx',
          reward: '$5,250',
          range: [11500, 25999],
          bridge50Fee: 10,
          bridge100Fee: 30,
        },
        {
          tx: '26,000~45,999 Tx',
          reward: '$15,750',
          range: [26000, 45999],
          bridge50Fee: 20,
          bridge100Fee: 45,
        },
        {
          tx: '46,000~99,999 Tx',
          reward: '$28,000',
          range: [46000, 99999],
          bridge50Fee: 30,
          bridge100Fee: 60,
        },
        {
          tx: '≥100,000 Tx',
          reward: '$35,000',
          range: [100000, 999999],
          bridge50Fee: 50,
          bridge100Fee: 95,
        },
      ]
    }
  },
  computed: {
    totalTx() {
      const tx = Number(prizesTotaltx.value) || 0
      return tx
    },
    totalTxAmount() {
      const tx = this.totalTx
      return this.decimalNumC(tx, 0, ',')
    },
    currentPool() {
      const list = this.group
      const tx = this.totalTx
      if (tx >= 120000) return list[list.length - 1]?.reward || '$0'
      const group = list.filter((item) => {
        const [first, last] = item.range
        return first <= tx && last >= tx
      })?.[0]
      return group?.reward
    },
    totalPool() {
      return this.currentPool || "To be unlocked"
    },
    ratio() {
      let ratioAmount = 0
      const list = this.group
      const tx = this.totalTx
      list.forEach((item) => {
        const [first, last] = item.range
        if (first <= tx) {
          ratioAmount += 100 / this.group.length
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
  margin-top: 56px;

  .pool-total {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: GeneralSans-SemiBold;
    .pool {
      width: calc(50% - 12px);
      padding: 20px 0;
      box-sizing: border-box;
      border-radius: 16px;
      border-radius: 16px;
      background: linear-gradient(-0.77deg, rgba(15, 34, 37, 0.2) 60.809%,rgba(209, 112, 85, 0.2) 117.632%),rgb(15, 34, 37);
      font-weight: 500;
      .pool-total-amount {
        color: #3B7FFF;
        height: 72px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .participants {
      width: calc(50% - 12px);
      box-sizing: border-box;
      padding: 20px 0;
      border-radius: 16px;
      background: linear-gradient(
          -0.77deg,
          rgba(15, 34, 37, 0.2) 60.809%,
          rgba(209, 112, 85, 0.2) 117.632%
        ),
        rgb(15, 34, 37);
      font-weight: 500;
      .participants-total-amount {
        color: #ff4f4f;
        font-size: 48px;
        height: 72px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .progress-group {
    margin-top: 24px;
    width: 100%;
    text-align: left;

    .progress-pool-title {
      color: #3B7FFF;
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
              color: #3B7FFF;
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
            border: 1px solid rgb(65, 79, 81);
            border-radius: 999px;
            background: linear-gradient(179.63deg, rgba(239, 47, 45, 0.04) 34.849%,rgba(255, 102, 101, 0.04) 57.408%);            
            backdrop-filter: blur(156px);
            background-color: rgb(15, 34, 37);
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
              border-right: 1px solid #414F51;
              display: flex;
              justify-content: center;
              align-items: center;
              svg {
                width: 20px;
                height: 20px;
              }
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
                color: #ff4f4f;
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
            color: #ff4f4f;
          }
        }
      }
    }

    .progress-participants-title {
      color: #ff4f4f;
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
        height: 36px;
      }
      .participants-total-amount {
        font-size: 24px;
        height: 36px;
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
