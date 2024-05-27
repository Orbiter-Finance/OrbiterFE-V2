<template>
  <div
    ref="ecosystem_dapp_pro_ref"
    class="ecosystem-dapp-pro-com"
    :style="showCard ? 'height: 300px' : 'height: 50px;'"
  >
    <div class="title">
      <span class="text">Ecosystem DApp </span>
      <svg
        v-show="!isMobile"
        class="expand"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 16 16"
        fill="none"
        @click="triggle(!showCard)"
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
    <div class="content" :class="showCard ? 'down' : 'up'">
      <div class="banner">
        <!-- <div class="dapp_group_img">
          <img
            class="dapp1"
            :src="require('../../assets/activity/ecosystem_dapp/dapp_1.png')"
          />
          <img
            class="dapp2"
            :src="require('../../assets/activity/ecosystem_dapp/dapp_2.png')"
          />
        </div> -->
      </div>

      <div class="info">
        <div class="top">
          <div class="top-right">
            <div class="card-title">
              <div class="card-first">Fair Launch</div>
              <div class="card-next">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="16.000000"
                  height="16.000000"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <defs />
                  <path
                    d="M8.75 6.75C8.75 4.95 7.29 3.5 5.5 3.5C3.7 3.5 2.25 4.95 2.25 6.75C2.25 8.54 3.7 10 5.5 10C7.29 10 8.75 8.54 8.75 6.75Z"
                    stroke="#666666"
                    stroke-opacity="1.000000"
                    stroke-width="1.000000"
                  />
                  <path
                    d="M9.71 3.61C9.99 3.54 10.29 3.5 10.59 3.5C11.45 3.5 12.28 3.84 12.89 4.45C13.5 5.06 13.84 5.88 13.84 6.75C13.84 7.61 13.5 8.43 12.89 9.04C12.28 9.65 11.45 10 10.59 10"
                    stroke="#666666"
                    stroke-opacity="1.000000"
                    stroke-width="1.000000"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  />
                  <path
                    d="M1 12.33C1.5 11.61 2.18 11.02 2.96 10.61C3.74 10.21 4.61 9.99 5.5 9.99C6.38 9.99 7.25 10.21 8.03 10.61C8.81 11.02 9.49 11.61 10 12.33"
                    stroke="#666666"
                    stroke-opacity="1.000000"
                    stroke-width="1.000000"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  />
                  <path
                    d="M10.59 10C11.47 9.99 12.34 10.21 13.12 10.61C13.91 11.02 14.58 11.61 15.09 12.33"
                    stroke="#666666"
                    stroke-opacity="1.000000"
                    stroke-width="1.000000"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  />
                </svg>
                {{ decimalNumC(holders, 0, ',') }}
              </div>
            </div>
          </div>
        </div>
        <div class="label">
          <div>
            The initial Tx requires a fix value of 0.00888e. 
          </div>
        </div>
        <div class="bottom">
          <div class="progress-group">
            <div class="holders">
              <div class="total">
                Launch Progress:
                <!-- <div class="amount">{{ decimalNumC(amount, 2, ',') }} ETH</div> -->
                <o-tooltip>
                  <template v-slot:titleDesc>
                    <div style="margin-left: -20px">
                      <span>Receive an airdrop share for every 6 TXs To Taiko. Stops once the total amount (2,888,888 TXs) reaches. </span>
                    </div>
                  </template>
                  <img
                    class="help-icon"
                    :src="require('../../assets/activity/tooltip.png')"
                  />
                </o-tooltip>
              </div>
              <div :class="Number(ratio) >= 100 ? 'ratio100' : 'ratio'">
                {{ decimalNumC(ratio, 6) }}%
                <span v-show="Number(ratio) >= 100">!!</span>
              </div>
            </div>
            <div class="progress-box">
              <div
                class="progress"
                :style="{
                  width:
                    Number(ratio) >= 100 ? '100%' : decimalNumC(ratio, 3) + '%',
                }"
                :class="Number(ratio) >= 100 ? 'progress100' : 'default-bg'"
              >
                <div class="skeleton"></div>
              </div>
            </div>
          </div>
          <div
            :class="['join', { 'join-end': isEnd }]"
            @click="openUrl()"
          >
            Join
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import getUTCTime from '../../util/time'
import { decimalNum } from '../../util/decimalNum'
import { ethers } from 'ethers'
import Web3 from 'web3'
import { isMobile } from '../../composition/hooks'
import util from '../../util/util'

let timer
let timer1

export default {
  name: 'EcosystemDappPro',
  data() {
    return {
      holders: 0,
      ratio: 0,
      total: '2888888',
      isEnd: false,
      show: true,
      timeStr: '2024/5/23 16:00:00',
      timeList: [],
    }
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
    showCard() {
      return this.isMobile || this.show
    },
  },
  watch: {
    isMobile: function (mobile1) {
      if (!mobile1) {
        this.show = true
        this.triggle(true)
      }
    },
  },
  methods: {
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
    openUrl() {
      const url = "https://www.pinketh.xyz/"
      this.$gtag.event('TaiKo', {
        event_category: 'TaiKo',
        event_label: url,
      })
      window.open(url, '_blank')
    },
    async getData() {
      const res = await fetch(
        'https://api.orbiter.finance/taiko-pink/address/tx_count',
        {}
      )
      const {
        result: { txCount = '0', addressCount = '0' },
      } = await res.json()
      const amount = !isNaN(Number(txCount)) ? String(txCount) : '0'
      const holders = !isNaN(Number(addressCount)) ? String(addressCount) : '0'
      this.holders = holders
      const ratio = ethers.utils
        .parseEther(amount)
        .mul(ethers.utils.parseEther('100'))
        .div(ethers.utils.parseEther(this.total))
      this.ratio = ethers.utils.formatEther(ratio)
    },
    triggle(status) {
      this.show = status
      let time = 1000

      try {
        timer = setInterval(() => {
          time -= 10
          if (time < -10) {
            clearInterval(timer)
            util.log('card', status)
          }
          this.$emit('getTaskHeight')
        }, 10)
      } catch (error) {
        clearInterval(timer)
      }
    },
    getUTCTime1(str) {
      let d1 = new Date(str)
      let d2 = new Date(
        d1.getUTCFullYear(),
        d1.getUTCMonth(),
        d1.getUTCDate(),
        d1.getUTCHours(),
        d1.getUTCMinutes(),
        d1.getUTCSeconds()
      )
      return Date.parse(d2)
    },
  },
  // mounted() {
  //   timer1 = setInterval(() => {
  //     const t = this.getUTCTime1(this.timeStr)
  //     const timeS = Math.floor((t - getUTCTime()) / 1000)
  //     let time = timeS
  //     if (timeS <= 0) {
  //       clearInterval(timer1)
  //       this.timeList = [
  //         {
  //           value: '00',
  //           symbol: 'D',
  //         },
  //         {
  //           value: '00',
  //           symbol: 'H',
  //         },
  //         {
  //           value: '00',
  //           symbol: 'M',
  //         },
  //         {
  //           value: '00',
  //           symbol: 'S',
  //         },
  //       ]
  //       return
  //     }
  //     let d = Math.floor(time / 3600 / 24)
  //     time -= d * 3600 * 24
  //     d = d < 0 ? 0 : d
  //     d = d < 10 ? '0' + d : d
  //     let h = Math.floor(time / 3600)
  //     time -= h * 3600
  //     h = h < 0 ? 0 : h
  //     h = h < 10 ? '0' + h : h
  //     let m = Math.floor(time / 60)
  //     time -= m * 60
  //     m = m < 0 ? 0 : m
  //     m = m < 10 ? '0' + m : m
  //     const s = time < 10 ? '0' + time : time

  //     this.timeList = [
  //       {
  //         value: d,
  //         symbol: 'D',
  //       },
  //       {
  //         value: h,
  //         symbol: 'H',
  //       },
  //       {
  //         value: m,
  //         symbol: 'M',
  //       },
  //       {
  //         value: s,
  //         symbol: 'S',
  //       },
  //     ]
  //   }, 1000)
  // },
  created() {
    this.getData()
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

.ecosystem-dapp-pro-com {
  width: 100%;
  padding: 16px 12px;
  box-sizing: border-box;
  will-change: height;
  transition: all 0.5s linear;

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
    border-radius: 12px;
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
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.11);
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
          border-radius: 50%;
        }

        .dapp2 {
          width: 20px;
          height: 20px;
          position: absolute;
          right: 4px;
          bottom: 4px;
          border-radius: 50%;
        }
      }
    }

    .info {
      padding: 8px 16px;
      width: 100%;

      .top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .top-right {
          display: flex;
          justify-content: start;
          align-items: center;

          .card-title {
            width: 100%;
            font-size: 12px;
            font-weight: 400;
            color: #999999;
            font-weight: 500;
            line-height: 18px;
            font-family: OpenSansRoman-Regular;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .card-first {
              color: rgb(8, 12, 24);
              font-weight: 700;
              padding: 2px 8px;
              border-radius: 12px;
              line-height: 16px;
              background: linear-gradient(
                169deg,
                rgb(248, 218, 211) 7.353%,
                rgb(220, 84, 161) 60.561%
              );
            }

            .card-next {
              color: rgb(102, 102, 102);
              font-weight: 600;
              padding: 2px 8px;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-left: 6px;
              box-sizing: border-box;
              line-height: 16px;
              border: 1px solid rgb(238, 238, 238);
              border-radius: 999px;
              background: rgb(245, 245, 245);

              > svg {
                margin-right: 2px;
              }
            }
          }
        }
      }

      .label {
        margin-top: 8px;
        color: rgb(34, 34, 34);
        font-family: General Sans;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: 0px;
        text-align: left;
        font-family: OpenSansRoman-SemiBold;
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
                font-size: 12px;
              }

              .help-icon {
                margin-left: 1.5px;
                width: 16px;
                height: 16px;
              }
            }

            .ratio {
              font-family: OpenSansRoman-Regular;
              font-weight: 500;
              color: #222222;
              font-size: 14px;
              font-weight: 700;
            }

            .ratio100 {
              font-size: 14px;
              font-family: OpenSansRoman-Regular;
              font-weight: 600;
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
            overflow: hidden;

            .progress {
              height: 8px;
            }

            .default-bg {
              background: #222222;
              border-radius: 6px;
            }

            .progress100 {
              background: linear-gradient(
                90deg,
                rgb(255, 0, 164) 1.799%,
                rgb(113, 109, 255) 26.644%,
                rgb(255, 190, 93) 68.961%,
                rgb(253, 4, 15) 97.662%
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

        .join {
          width: 56px;
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
          .card-title {
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }

      .label {
        color: rgba(255, 255, 255, 0.8);
      }

      .bottom {
        .progress-group {
          .holders {
            .ratio {
              color: rgba(255, 255, 255, 0.8);
            }
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
