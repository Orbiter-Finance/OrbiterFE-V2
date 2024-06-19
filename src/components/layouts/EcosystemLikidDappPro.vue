<template>
  <div
    class="ecosystem-likwid-dapp-pro-com"
    :style="showCard ? 'height: 320px' : 'height: 50px;'"
  >
    <div class="content" :class="showCard ? 'down' : 'up'">
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
              <!-- <span>1st Fair launch on Likwid</span> -->
              <div class="time">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="16.000000"
                  height="16.000000"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    id="Vector"
                    d="M8 14.66C4.31 14.66 1.33 11.67 1.33 8C1.33 4.31 4.31 1.33 8 1.33C11.67 1.33 14.66 4.31 14.66 8C14.66 11.67 11.67 14.66 8 14.66Z"
                    stroke="#999999"
                    stroke-opacity="1.000000"
                    stroke-width="1.000000"
                    stroke-linejoin="round"
                  />
                  <path
                    id="Vector"
                    d="M10.47 10.11L8.4 8.88C8.04 8.67 7.75 8.15 7.75 7.73L7.75 5"
                    stroke="#999999"
                    stroke-opacity="1.000000"
                    stroke-width="1.000000"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  />
                  <g opacity="0.000000" />
                </svg>
                <div
                  :key="item.symbol"
                  class="time-item"
                  v-for="item in timeList"
                >
                  <div class="time-value">{{ item.value }}</div>
                  <div class="time-symbol">{{ item.symbol }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="label">
          <div>$GATO</div>
        </div>
        <div class="bottom">
          <div class="progress-group">
            <div class="holders">
              <div class="total">
                Current Funds Raised:
                <div class="amount">{{ decimalNumC(amount, 2, ',') }} ETH</div>
                <o-tooltip>
                  <template v-slot:titleDesc>
                    <div style="margin-left: -20px">
                      <span> 100% refund for oversubscribed part </span>
                    </div>
                  </template>
                  <img
                    class="help-icon"
                    :src="require('../../assets/activity/tooltip.png')"
                  />
                </o-tooltip>
              </div>
              <div :class="Number(ratio) >= 100 ? 'ratio100' : 'ratio'">
                {{ decimalNumC(ratio, 1) }}%
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
            @click="openUrl('https://likwid.meme/launch')"
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
let timer
let timer1
export default {
  name: 'EcosystemLikidDappPro',
  props: {
    showCard: Boolean,
  },
  data() {
    return {
        amount: 0,
        ratio: 0,
        total: '10',
        isEnd: false,
        timeStr: '2024/06/21 16:00:00',
        timeList: [],
    }
  },
  methods: {
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
    openUrl(url) {
      this.$gtag.event('$GATO', {
        event_category: '$GATO',
        event_label: url,
      })
      window.open(url, '_blank')
    },
    async getData() {
      const web3 = new Web3(
        new Web3.providers.HttpProvider('https://rpc.vizing.com')
      )
      const raw = web3.eth.abi.encodeFunctionSignature('presaleAccumulate()')
      const res = await web3.eth.call({
        // from: zeroAddress,
        to: '0x698460e83EbcD03c4733Cec37Bc602820Dfd7961',
        data: raw,
      })
      const result = web3.eth.abi.decodeParameters(['uint256'], res || '')
      const amount = ethers.utils.formatEther(result[0])
      this.amount = amount
      const ratio = ethers.utils
        .parseEther(amount)
        .mul(ethers.utils.parseEther('100'))
        .div(ethers.utils.parseEther(this.total))
      this.ratio = ethers.utils.formatEther(ratio)
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
  mounted() {
    timer1 = setInterval(() => {
      const t = this.getUTCTime1(this.timeStr)
      const timeS = Math.floor((t - getUTCTime()) / 1000)
      let time = timeS
      if (timeS <= 0) {
        clearInterval(timer1)
        this.timeList = [
          {
            value: '00',
            symbol: 'D',
          },
          {
            value: '00',
            symbol: 'H',
          },
          {
            value: '00',
            symbol: 'M',
          },
          {
            value: '00',
            symbol: 'S',
          },
        ]
        return
      }
      let d = Math.floor(time / 3600 / 24)
      time -= d * 3600 * 24
      d = d < 0 ? 0 : d
      d = d < 10 ? '0' + d : d
      let h = Math.floor(time / 3600)
      time -= h * 3600
      h = h < 0 ? 0 : h
      h = h < 10 ? '0' + h : h
      let m = Math.floor(time / 60)
      time -= m * 60
      m = m < 0 ? 0 : m
      m = m < 10 ? '0' + m : m
      const s = time < 10 ? '0' + time : time
      this.timeList = [
        {
          value: d,
          symbol: 'D',
        },
        {
          value: h,
          symbol: 'H',
        },
        {
          value: m,
          symbol: 'M',
        },
        {
          value: s,
          symbol: 'S',
        },
      ]
    }, 1000)
  },
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
.ecosystem-likwid-dapp-pro-com {
  width: 100%;
  box-sizing: border-box;
  will-change: height;
  transition: all 0.5s linear;
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
      background: url('../../assets/activity/ecosystem_dapp/likwid-image.png') 100%
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
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .time {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              font-family: OpenSansRoman-Regular;
              .time-item {
                display: flex;
                .time-value {
                  font-size: 14px;
                  color: #222222;
                  margin: 0 2px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-weight: 700;
                  font-family: OpenSansRoman-SemiBold;
                }
                .time-symbol {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-size: 12px;
                  color: #999999;
                  margin: 0 2px;
                }
              }
            }
          }
        }
      }
      .label {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
    .content {
      border: 1px solid rgba(255, 255, 255, 0.2);
      background-color: rgb(71, 74, 111);
      .top {
        .top-right {
          .text {
            color: rgba(255, 255, 255, 0.6);
            .time {
              .time-item {
                .time-value {
                  color: rgba(255, 255, 255, 0.8);
                }
              }
            }
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
