<template>
  <div id="prizes-pool" class="prizes-pool">
    <div class="pool-total">
      <div class="pool">
        <div>Prize pool (USDC)</div>
        <div class="pool-total-amount">{{ totalPool }}</div>
      </div>
      <div class="participants">
        <div>Participants</div>
        <div class="participants-total-amount">{{ totalAddress }}</div>
      </div>
    </div>
    <div class="progress-group">
      <div class="progress-pool-title">Prize pool</div>
      <div class="progress-info-scroll">
        <div class="progress-info">
          <div class="progress-pool-amount-group">
            <div class="progress-pool-amount">
              <div class="pool-item-first">0</div>
              <div class="pool-item" v-for="item in poolAmount" :key="item">
                {{ item }}
              </div>
              <div class="pool-item-last">100,000</div>
            </div>
          </div>

          <div class="progress-content">
            <div
              class="progress-tips"
              :style="`padding-left: calc(${ratio}% - 4px);`"
            >
              <div class="pool-text">{{ totalPool }}</div>
              <div class="progress-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="8.489258"
                  height="5.242645"
                  viewBox="0 0 8.48926 5.24265"
                  fill="none"
                >
                  <path
                    d="M1 0L7.48 0C8.37 0 8.82 1.07 8.19 1.7L4.95 4.94C4.56 5.34 3.92 5.34 3.53 4.94L0.29 1.7C-0.34 1.07 0.11 0 1 0Z"
                    fill="#FFA629"
                    fill-opacity="1.000000"
                    fill-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div class="progress-box">
              <div
                class="progress-box-item"
                v-for="(item, index) in new Array(9).fill(0)"
                :key="index"
              ></div>
              <div class="progress" :style="`width: ${ratio}%;`"></div>
            </div>
            <div
              class="progress-tips"
              :style="`padding-left: calc(${ratio}% - 4px);`"
            >
              <div class="progress-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="8.489258"
                  height="5.242645"
                  viewBox="0 0 8.48926 5.24265"
                  fill="none"
                >
                  <path
                    d="M1 5.24L7.48 5.24C8.37 5.24 8.82 4.16 8.19 3.53L4.95 0.29C4.56 -0.1 3.92 -0.1 3.53 0.29L0.29 3.53C-0.34 4.16 0.11 5.24 1 5.24Z"
                    fill="#EF2F2D"
                    fill-opacity="1.000000"
                    fill-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="participants-text">{{ totalAddress }}</div>
            </div>
          </div>

          <div class="progress-participants-amount-group">
            <div class="participants-item-first">0</div>
            <div class="progress-participants-amount">
              <div
                class="participants-item"
                v-for="item in participantsAmount"
                :key="item"
              >
                {{ item }}
              </div>
            </div>
            <div class="participants-item-last">45,000+</div>
          </div>
        </div>
      </div>
      <div class="progress-participants-title">Participants</div>
    </div>
  </div>
</template>

<script>
import { decimalNum } from '../../../util/decimalNum'

export default {
  name: 'PrizesPool',
  props: {
    addressCount: String,
    totalRewards: String,
  },

  data() {
    return {
      poolAmount: [
        '25,000',
        '35,000',
        '45,000',
        '55,000',
        '65,000',
        '75,000',
        '85,000',
        '95,000',
      ],
      participantsAmount: [
        '5,000',
        '10,000',
        '15,000',
        '20,000',
        '25,000',
        '30,000',
        '35,000',
        '40,000',
      ],
    }
  },
  computed: {
    totalAddress() {
      return this.decimalNumC(this.addressCount, 0, ',')
    },
    totalPool() {
      return this.decimalNumC(this.totalRewards, 0, ',', '$')
    },
    ratio() {
      let ratioAmount = '0'
      if (Number(this.totalRewards) >= 25000) {
        const otherAmount = this.decimalNumC(
          Number(this.totalRewards) - 25000,
          2
        )
        const otherRatio = this.decimalNumC((otherAmount / 10000) * (100 / 9))
        ratioAmount = this.decimalNumC(Number(otherRatio) + 100 / 9, 2)
      } else {
        ratioAmount = this.decimalNumC(100 / 9, 2)
      }

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
    justify-content: space-around;
    align-items: center;
    .pool {
      width: calc(50% - 12px);
      padding: 20px 0;
      box-sizing: border-box;
      border-radius: 8px;
      box-shadow: inset 0px 0px 34px 0px rgba(255, 166, 41, 0.4);
      backdrop-filter: blur(156px);
      background: rgb(0, 0, 0);
      font-weight: 500;
      .pool-total-amount {
        color: #ffa629;
        font-weight: 600;
        font-size: 48px;
      }
    }
    .participants {
      width: calc(50% - 12px);
      box-sizing: border-box;
      border-radius: 8px;
      padding: 20px 0;
      box-shadow: inset 0px 0px 34px 0px rgba(239, 47, 45, 0.4);
      backdrop-filter: blur(156px);
      background: rgb(0, 0, 0);
      font-weight: 500;
      .participants-total-amount {
        color: #ef2f2d;
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
      color: #ffa629;
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
          }
          .pool-item-first {
            width: 5.555%;
            text-align: left;
          }
          .pool-item-last {
            width: 5.555%;
            text-align: right;
          }
        }

        .progress-content {
          width: 100%;
          margin: 4px 0;
          .progress-box {
            margin: 1px 0;
            width: 100%;
            height: 32px;
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
            }
          }

          .progress-tips {
            width: 120px;
            font-size: 14px;
            font-weight: 600;
            .pool-text {
              display: flex;
              justify-content: center;
              align-items: center;
              color: #ffa629;
              text-align: center;
            }
            .participants-text {
              display: flex;
              justify-content: center;
              align-items: center;
              color: #ef2f2d;
              text-align: center;
            }
            .progress-icon {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 8px;
              height: 8px;
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
          .participants-item-last {
            width: 5.555%;
            text-align: right;
          }
          .participants-item-first {
            width: 5.555%;
            text-align: left;
          }
          .participants-item {
            flex: 1;
            text-align: center;
          }
        }
      }
    }

    .progress-participants-title {
      color: #ef2f2d;
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
