<template>
  <div id="task-prizes-card" class="task-prizes-card">
    <div class="card-title">
      <div class="title-info">
        <svg-icon iconName="42161" class="task-icon"></svg-icon>
        <div class="label">Split <span>$100,000</span> in prizes</div>
      </div>
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
            d="M7.99 14.66C4.31 14.66 1.33 11.67 1.33 8C1.33 4.31 4.31 1.33 7.99 1.33C11.67 1.33 14.66 4.31 14.66 8C14.66 11.67 11.67 14.66 7.99 14.66Z"
            stroke="#292D32"
            stroke-opacity="1.000000"
            stroke-width="1.000000"
            stroke-linejoin="round"
          />
          <path
            id="Vector"
            d="M10.47 10.12L8.4 8.88C8.04 8.67 7.75 8.16 7.75 7.74L7.75 5"
            stroke="#292D32"
            stroke-opacity="1.000000"
            stroke-width="1.000000"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
          <g opacity="0.000000" />
        </svg>
        <div class="time-group" v-for="item in timeList" :key="item.symbol">
          <div class="time-value">{{ item.value }}</div>
          <div class="time-symbol">{{ item.symbol }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getUTCTime from '../../util/time'

import { decimalNum } from '../../util/decimalNum'

import SvgIcon from '../SvgIcon/SvgIcon.vue'

let timer1

export default {
  components: { SvgIcon },
  name: 'PrizesCard',
  data() {
    return {
      timeStr: '2024/6/23 16:00:00',
      timeList: [],
    }
  },
  methods: {
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
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
}
</script>

<style lang="scss" scoped>
.task-prizes-card {
  margin: 12px 16px;
  padding: 12px;
  width: calc(100% - 32px);
  background-color: #f5f5f5;
  border-radius: 12px;

  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title-info {
      display: flex;
      justify-content: start;
      align-items: center;

      .task-icon {
        width: 20px;
        height: 20px;
        margin-right: 6px;
      }

      .label {
        font-size: 14px;
        font-weight: 700;
        line-height: 19px;
        letter-spacing: 0px;
        span {
          color: #ff402b;
        }
      }
    }

    .time {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .time-group {
        display: flex;
        justify-content: center;
        align-items: center;
        .time-value {
          font-size: 14px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: 0px;
          margin: 0 2px;
        }
        .time-symbol {
          color: rgb(153, 153, 153);
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
        }
      }
    }
  }
}
</style>
