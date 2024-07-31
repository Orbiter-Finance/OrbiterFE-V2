<template>
  <div class="time-out">
    <div v-if="isEnd">End of event</div>
    <div class="time-card">
      <div
        class="time-card-item"
        v-for="(item, index) in timeList"
        :key="item.symbol"
      >
        <div class="card-item-value">{{ item.value }}</div>
        <div class="card-item-symbol">{{ item.symbol }}</div>
        <div v-if="index !== 3" class="card-item-invi">:</div>
      </div>
    </div>
    <div class="card"></div>
  </div>
</template>

<script>
import {
  prizesV2TimeEnd,
  setPrizesV2TimeEnd,
  prizesV2ProjectTime,
} from '../../composition/hooks'
import dayjs from 'dayjs'

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
    symbol: 'm',
  },
  {
    value: '00',
    symbol: 's',
  },
]

export default {
  name: 'HeaderPrizesTimeOut',
  data() {
    return {
      timeList: timeListDefault,
    }
  },
  computed: {
    timeStr() {
      return prizesV2ProjectTime.value
    },
    isEnd() {
      return prizesV2TimeEnd.value
    },
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
    toggleEnd() {
      setPrizesV2TimeEnd(true)
    },
  },
  mounted() {
    const self = this
    timer1 = setInterval(() => {
      if (!self.timeStr) return
      const t = +dayjs.utc(self.timeStr)
      const timeS = Math.floor((t - +dayjs()) / 1000)
      let time = timeS
      if (timeS <= 0) {
        clearInterval(timer1)
        self.toggleEnd()
        self.timeList = timeListDefault
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
          symbol: 'm',
        },
        {
          value: s,
          symbol: 's',
        },
      ]
    }, 1000)
  },
}
</script>

<style scoped lang="scss">
.time-out {
  width: 108px;
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  background: #f3ba2f;
  border-radius: 8px;
  backdrop-filter: blur(156px);
  padding: 0 2px;
  zoom: 0.9;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  .time-card {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .time-card-item {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-family: GeneralSans-SemiBold;
      font-weight: 600;
      font-size: 12px;

      .card-item-invi {
        margin: 0 1px;
      }
    }
  }
  .card {
    width: 8px;
    height: 8px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform-origin: 50% 50%;
    transform: translateY(50%) rotate(45deg);
    background: #f3ba2f;
  }
}
</style>
