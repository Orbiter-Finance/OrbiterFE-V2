<template>
  <div class="ecosystem-dapp-pro-com" :class="show ? 'down' : 'up'">
    <div class="title">
      <span class="text">Ecosystem DApp </span>
      <svg
        class="expand"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 16 16"
        fill="none"
        @click="triggle"
      >
        <desc>Created with Pixso.</desc>
        <defs />
        <rect
          rx="4.000000"
          width="16.000000"
          height="16.000000"
          fill="#EEEEEE"
          fill-opacity="0"
        />
        <rect
          x="0.500000"
          y="0.500000"
          rx="4.000000"
          width="15.000000"
          height="15.000000"
          stroke="#EEEEEE"
          stroke-opacity="0"
          stroke-width="1.000000"
        />
        <path
          d="M10.77 4.69L10.77 4.72L10.97 5L5.02 5L5.22 4.72L5.22 4.69C5.05 4.57 4.82 4.6 4.7 4.77C4.57 4.94 4.6 5.17 4.77 5.3L4.8 5.29L5.01 5.01L8 7.25L10.98 5.01L11.19 5.29L11.22 5.3C11.39 5.17 11.42 4.94 11.3 4.77C11.17 4.6 10.94 4.57 10.77 4.69Z"
          fill="#D8D8D8"
          fill-opacity="0"
          fill-rule="evenodd"
        />
        <path
          d="M5 5L8 7.25L11 5"
          stroke="#222222"
          stroke-opacity="1.000000"
          stroke-width="0.750000"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
        <path
          d="M10.77 8.44L10.77 8.47L10.97 8.75L5.02 8.75L5.22 8.47L5.22 8.44C5.05 8.32 4.82 8.35 4.7 8.52C4.57 8.69 4.6 8.92 4.77 9.05L4.8 9.04L5.01 8.76L8 11L10.98 8.76L11.19 9.04L11.22 9.05C11.39 8.92 11.42 8.69 11.3 8.52C11.17 8.35 10.94 8.32 10.77 8.44Z"
          fill="#D8D8D8"
          fill-opacity="0"
          fill-rule="evenodd"
        />
        <path
          d="M5 8.75L8 11L11 8.75"
          stroke="#222222"
          stroke-opacity="1.000000"
          stroke-width="0.750000"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
      </svg>
    </div>
    <div class="content" :class="show ? 'down' : 'up'">
      <div class="banner">
        <div class="dapp_group_img">
          <img
            class="dapp1"
            :src="require('../../assets/activity/ecosystem_dapp/dapp_1.png')"
          />
          <img
            class="dapp2"
            :src="require('../../assets/activity/ecosystem_dapp/dapp_2.png')"
          />
        </div>
      </div>

      <div class="info">
        <div class="top">
          <div class="top-right">
            <div class="text">
              1st Fair launch on Likwid
              <!-- <o-tooltip>
                  <template v-slot:titleDesc>
                    <div style="margin-left: -20px">
                      <span>
                        1st Fair launch on Likwid
                      </span>
                    </div>
                  </template>
                  <div class="text">
                    1st Fair launch on Likwid
                  </div>
                </o-tooltip> -->
            </div>
          </div>
        </div>
        <div class="label">Layer2-20 🔥</div>
        <div class="bottom">
          <div class="progress-group">
            <div class="holders">
              <div class="total">
                Fundraise Goal:
                <div class="amount">{{ decimalNumC(holders, 0, ',') }} ETH</div>
                <o-tooltip>
                  <template v-slot:titleDesc>
                    <div style="margin-left: -20px">
                      <span> 100% refund for oversubscribed part </span>
                    </div>
                  </template>
                  <img
                    class="help-icon"
                    :src="require('../../assets/activity/tip_ico.png')"
                  />
                </o-tooltip>
              </div>
              <div :class="Number(ratio) >= 100 ? 'ratio100' : 'ratio'">{{ decimalNumC(ratio, 3) }}% 
                <span v-show="Number(ratio) >= 100">!!</span>
              </div>
            </div>
            <div class="progress-box">
              <div
                class="progress"
                :style="{ width:  Number(ratio) >= 100 ? '100%' :decimalNumC(ratio, 3) + '%' }"
                :class="Number(ratio) >= 100 ? 'progress100' : 'default-bg'"
              ></div>
            </div>
          </div>
          <div
            :class="['join', { 'join-end': isEnd }]"
            @click="openUrl('https://www.layer220.io/')"
          >
            Join
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { decimalNum } from '../../util/decimalNum'

let timer

export default {
  name: 'EcosystemDappPro',
  data() {
    return {
      holders: 0,
      ratio: 0,
      isEnd: false,
      show: false,
    }
  },
  methods: {
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
    openUrl(url) {
      // window.open(url, '_blank')
      this.ratio += 50

    },
    async getData() {
      const res = await fetch(
        'https://api.layer220.io/statistic?protocol=layer2-20&tick=%24L2',
        {}
      )
      // const {
      //   data: { totalHolders = 0, max, totalAmount }
      // } = await res.json()

      // this.holders = totalHolders || 0

      // if (Number(max) && Number(totalAmount)) {
      //   const total = (totalAmount * 100) / max
      //   this.ratio = Number(total) <= 100 ? Number(total) : 100
      //   this.isEnd = this.ratio === 100
      // }
    },
    triggle() {
      this.show = !this.show
      let time = 1000

      try {
        timer = setInterval(() => {
          time -= 10
          if (time < -10) {
            clearInterval(timer)
            throw new Error("aaaaa")
          }
          this.$emit('getTaskHeight')
        }, 10)
      } catch (error) {
        console.error('error', error)
        clearInterval(timer)
      }
    },
  },
  created() {
    this.getData()
  },
}
</script>
<style lang="scss" scoped>
.ecosystem-dapp-pro-com {
  width: 100%;
  padding: 16px 12px;
  box-sizing: border-box;
  height: 310px;
  will-change: height;
  transition: all 0.5s linear;

  &.up {
    height: 50px;
  }
  &.down {
    height: 310px;
  }

  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .text {
      font-family: Kodchasan-Bold;
      font-size: 16px;
      font-weight: bold;
      color: #222222;
      line-height: 22px;
    }
    .expand {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      background: rgb(238, 238, 238);
      cursor: pointer;
    }
  }
  .content {
    width: 100%;
    background: #ffffff;
    border-radius: 8px;
    margin-top: 12px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.11);
    opacity: 1;
    will-change: opacity;
    transition: all 0.5s linear;

    &.up {
      opacity: 0;
    }
    &.down {
      opacity: 1;
    }

    .banner {
      width: 100%;
      padding: 16.75%;
      background: url('../../assets/activity/ecosystem_dapp/banner.png') 100%
        no-repeat;
      background-size: 100% 100%;
      border-radius: 12px;
      position: relative;
      top: 0;
      left: 0;
      z-index: 1;

      .dapp_group_img {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 4px;
        background: #fff;
        border-radius: 50%;
        z-index: 2;
        transform: translateY(50%);
        left: 16px;

        .dapp1 {
          width: 56px;
          height: 56px;
        }

        .dapp2 {
          width: 20px;
          height: 20px;
          position: absolute;
          right: 4px;
          bottom: 4px;
        }
      }
    }

    .info {
      padding: 12px 16px;
      width: 100%;

      .top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .top-right {
          flex: 1;
          text-align: left;
          padding-left: 64px;

          .text {
            width: 100%;
            font-size: 12px;
            font-weight: 400;
            color: #999999;
            font-weight: 500;
            line-height: 18px;
            font-family: OpenSansRoman-Regular;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }

      .label {
        display: flex;
        margin-top: 2px;
        color: #222222;
        font-size: 18px;
        font-weight: 700;
        font-family: OpenSansRoman-ExtraBold;
      }

      .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-top: 4px;

        .progress-group {
          flex: 1;

          .holders {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;

            .total {
              display: flex;
              align-items: center;
              font-size: 14px;
              font-family: OpenSansRoman-Regular;
              color: #999999;
              line-height: 20px;

              .amount {
                margin-left: 4px;
                font-weight: 600;
                color: #222222;
              }

              .help-icon {
                margin-left: 1.5px;
                width: 16px;
                height: 16px;
              }
            }

            .ratio {
              font-size: 16px;
              font-family: OpenSansRoman-Regular;
              font-weight: 500;
              color: #222222;
              font-size: 16px;
              font-weight: 700;
            }

            .ratio100 {
              font-size: 16px;
              font-family: OpenSansRoman-Regular;
              font-weight: 600;
              font-size: 16px;
              font-weight: 700;
              color: #7f0d0d;
              -webkit-text-fill-color: transparent;
              background-image: linear-gradient(
                243.43deg,
                rgb(253, 4, 15),
                rgb(255, 190, 93)
              );
              background-position-x: initial;
              background-position-y: initial;
              background-size: initial;
              background-repeat-x: initial;
              background-repeat-y: initial;
              background-attachment: initial;
              background-origin: initial;
              -webkit-background-clip: text;
              background-color: initial;
            }
          }

          .progress-box {
            width: 100%;
            height: 8px;
            background: #eeeeee;
            border-radius: 6px;
            margin-top: 4px;

            .progress {
              height: 8px;
              border-radius: 6px;
            }

            .default-bg {
              background: #222222;
            }

            .progress100 {
              background: linear-gradient(
                90deg,
                rgb(255, 0, 164) 1.799%,
                rgb(113, 109, 255) 26.644%,
                rgb(255, 190, 93) 68.961%,
                rgb(253, 4, 15) 97.662%
              );
            }
          }
        }

        .join {
          width: 72px;
          height: 32px;
          background: #222222;
          border-radius: 18px;
          margin-left: 12px;
          font-size: 14px;
          font-family: OpenSansRoman-Regular;
          font-weight: bold;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }

        .join-end {
          opacity: 0.5;
        }
      }
    }
  }
}

.dark-theme {
  .ecosystem-dapp-pro-com {
    .text {
      color: #f5f5f5;
    }

    .content {
      border: 1px solid rgba(255, 255, 255, 0.2);
      background-color: rgb(71, 74, 111);

      .top {
        .top-right {
          .label {
            color: rgba(255, 255, 255, 0.8);
          }
          .text {
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }

      .bottom {
        .progress-group {
          .holders {
            .total {
              color: rgba(255, 255, 255, 0.6);
              .amount {
                color: #dddddd;
              }
            }
          }

          .progress-box {
            .default-bg {
              background-color: #df2e2e;
            }
          }
        }
        .join {
          background-color: #df2e2e;
        }
      }
    }
  }
}
</style>
