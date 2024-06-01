<template>
  <div id="prizes-top-banner" class="prizes-top-banner">
    <div class="prizes-content">
      <div class="prizes-details">
        <div class="prizes-chain">
          <svg-icon
                style="width: 28px; height: 32px; margin-right: 8px"
                iconName="42161"
        ></svg-icon>
          Arbitrum Super Season</div>
        <div class="prizes-label">
          <span style="white-space: nowrap"
            >Split <span class="prizes-total-pool-amount">$100,000 </span></span
          >
          <br />
          in prizes
        </div>
        <div class="time-label">Ends In</div>
        <div class="time-card">
          <div
            class="time-card-item"
            v-for="item in timeList"
            :key="item.symbol"
          >
            <div class="card-item-value">{{ item.value }}</div>
            <div class="card-item-symbol">{{ item.symbol }}</div>
          </div>
        </div>
        <div class="prizes-to-bridge">Go to Bridge</div>
      </div>
      <img
        class="prizes-banner-image"
        :src="require('../../../assets/prizes/banner-bg.png')"
      />
    </div>
  </div>
</template>

<script>
import getUTCTime from '../../../util/time'

let timer1

const timeListDefault = [
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

export default {
  name: 'PrizesTopBanner',
  data() {
    return {
      timeStr: '2024/6/23 16:00:00',
      timeList: timeListDefault,
    }
  },
  methods: {
    open() {},
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
        this.timeList = timeListDefault
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
}
</script>

<style scoped lang="scss">
.prizes-top-banner {
  width: 100%;
  .prizes-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    .prizes-details {
      .prizes-chain {
        display: flex;
        justify-content: start;
        align-items: center;
        width: fit-content;
        padding: 12px 20px;
        border-radius: 999px;
        box-shadow: inset 0px 0px 34px 0px rgba(239, 47, 45, 0.4);
        backdrop-filter: blur(156px);
        background: linear-gradient(
          179.63deg,
          rgba(239, 47, 45, 0.04) -15.508%,
          rgba(255, 102, 101, 0.04) 116.073%
        );
      }

      .prizes-label {
        margin-top: 16px;
        font-size: 64px;
        font-weight: 700;
        line-height: 72px;
        letter-spacing: 0px;
        text-align: left;
        font-family: OpenSansRoman-Bold;

        .prizes-total-pool-amount {
          color: #ef2f2d;
        }
      }

      .time-label {
        width: 100%;
        margin-top: 20px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(255, 2555, 255, 0.6);
      }

      .time-card {
        display: flex;
        justify-content: start;
        align-items: center;
        width: 100%;
        margin-top: 12px;
        .time-card-item {
          border-radius: 8px;
          padding: 6px 12px;
          box-shadow: inset 0px 0px 34px 0px rgba(239, 47, 45, 0.4);
          backdrop-filter: blur(156px);
          background: linear-gradient(
            179.63deg,
            rgba(239, 47, 45, 0.04) -25.155%,
            rgba(255, 102, 101, 0.04) 127.31%
          );
          margin-right: 12px;
          text-align: center;
          .card-item-value {
            width: 100%;
            font-size: 28px;
            font-weight: 600;
            line-height: 32px;
          }

          .card-item-symbol {
            margin-top: 4px;
            width: 100%;
            font-size: 14px;
            font-weight: 400;
            line-height: 16px;
            color: #ff6665;
          }
        }
      }

      .prizes-to-bridge {
        width: 320px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 24px;
        border-radius: 8px;
        padding: 12px 0;
        background: linear-gradient(
          -2.9deg,
          rgb(239, 47, 45) 32.367%,
          rgb(255, 102, 101) 85.541%
        );
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
        cursor: pointer;
      }
    }
    .prizes-banner-image {
      width: 68%;
      margin-right: -8%;
    }
  }
}
</style>
