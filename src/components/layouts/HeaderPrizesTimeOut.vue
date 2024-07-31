<template>
  <div>
    <div class="time-out">
      <div class="time-card-item" v-for="(item, index) in timeList" :key="item.symbol">
        <div class="card-item-value">{{ item.value }}</div>
        <div class="card-item-symbol">{{ item.symbol }}</div>
        <div v-if="index !== 3" class="card-item-invi">:</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  prizesV2TimeEnd,
  setPrizesV2TimeEnd,
  prizesV2ProjectTime,
} from '../../composition/hooks'
import dayjs from "dayjs"

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
@keyframes glow {
    0% {
		border-color: #FF4F4F;
		box-shadow: 0 0 5px rgba(255, 0, 0,.2), inset 0 0 5px rgba(255, 0, 0,.1);
    }	
    100% {
		border-color: #FF0000;
		box-shadow: 0 0 20px rgba(255, 0, 0,.6), inset 0 0 10px rgba(255, 0, 0,.4);
    }
}

.time-out {
    display: flex;
    color: #FFFFFF;
    background: #df2e2d;
    border-radius: 8px;
    backdrop-filter: blur(156px);
    animation: glow 800ms ease-out infinite alternate;
    padding: 0 2px;
    scale: 0.8;
    .time-card-item {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-family: GeneralSans-Medium;
        font-weight: 400;
        font-size: 12px;
      
        .card-item-invi {
          margin: 0 1px;
        }
      }
}

</style>
