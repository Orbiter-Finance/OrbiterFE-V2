<template>
  <div id="prizes-top-banner" class="prizes-top-banner">
    <div class="prizes-content">
      <div class="group">

      <div class="badge">
          Mint Your Exclusive Pilot Badge
      </div>
    </div>
      <div class="group">
        <div class="title orbiter-linear-text">$35,000 Prize Pool</div>
      </div>
      <div class="group">
        <div class="amount orbiter-linear-text"><span class="chain orbiter-linear-text">Scroll</span> Trading Frenzy</div>
      </div>
      <div class="group">
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
      </div>
      <div class="group">
        <div class="bridge" @click="toBridgeCall">Start Bridge</div>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon.vue'
import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'
import {
  prizesTimeEnd,
  setPrizesTimeEnd,
  prizesProjectTime,
} from '../../../composition/hooks'
import dayjs from 'dayjs'

let timer1

const timeListDefault = [
  {
    value: '00',
    symbol: 'DAYS',
  },
  {
    value: '00',
    symbol: 'HOURS',
  },
  {
    value: '00',
    symbol: 'MIN',
  },
  {
    value: '00',
    symbol: 'SEC',
  },
]

export default {
  components: {
    SvgIcon,
  },
  name: 'PrizesTopBanner',
  data() {
    return {
      timeList: timeListDefault,
    }
  },
  computed: {
    evmAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress || ''
    },
    timeStr() {
      return prizesProjectTime.value
    },
    isEnd() {
      return prizesTimeEnd.value
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
    toBridgeCall() {
      const address = this.evmAddress
      if (!address || address === '0x' || this.isEnd) return
      const name = 'PRIZES_V4_BANNER_TO_BRIDGE'
      this.$gtag.event(name, {
        event_category: name,
        event_label: 'to home',
      })
      localStorage.setItem(
        'last_page_before_history',
        JSON.stringify({
          params: {},
          path: '/',
          query: { source: 'Ethereum', dest: 'Scroll', token: 'ETH' },
        })
      )

      const url = location.origin + '/?source=Ethereum&dest=Scroll&token=ETH'

      window.open(url, '_self')
    },
    toggleEnd() {
      setPrizesTimeEnd(true)
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
          symbol: 'DAYS',
        },
        {
          value: h,
          symbol: 'HOURS',
        },
        {
          value: m,
          symbol: 'MIN',
        },
        {
          value: s,
          symbol: 'SEC',
        },
      ]
    }, 1000)
  },
}
</script>

<style scoped lang="scss">
.prizes-top-banner {
  width: 100%;
  padding: 0 0 80px;
  background-image: url('../../../assets/prizes/bg.png');
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  height: 680px;
  .prizes-content {
    width: 100%;
   
    .group {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .badge {
        border-radius: 999px;
        background: linear-gradient(176.00deg, rgb(255, 232, 181) 30%,rgb(255, 196, 125) 53.451%);
        padding: 12px 40px;
        color: #0A1313;
        font-family: GeneralSans-SemiBold;
        font-size: 24px;
      }
      .title {
        margin-top: 16px;
        
        color: rgb(255, 242, 240);
        background-image: linear-gradient(
          to right,
          rgb(255, 242, 240),
        rgb(255, 222, 181)
        );
        font-size: 88px;
        line-height: 1;
        font-family: GeneralSans-SemiBold;
        letter-spacing: 0px;
      }
      .amount {
        margin-top: 16px;
        background-image: linear-gradient(
          to right,
          rgb(255, 242, 240),
        rgb(255, 222, 181)
        );
        color: rgb(255, 242, 240);
        font-size: 88px;
        line-height: 1;
        letter-spacing: 0px;
        font-family: GeneralSans-SemiBold;
        .chain {
          background-image: linear-gradient(
          to right,
          #FFC47D,
          #FFC47D
        );
        }
      }
    }

    .time-card {
      margin-top: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      .time-card-item {
        width: 64px;
        height: 64px;
        border-radius: 8px;
        backdrop-filter: blur(156px);
        background: linear-gradient(
            180deg,
            rgba(21, 63, 66, 0),
            rgba(255, 21, 0, 0.2) 100%
          ),
          rgb(71, 55, 21);
        margin: 0 6px;
        .card-item-value {
          font-size: 28px;
          font-family: GeneralSans-SemiBold;
          line-height: 32px;
          letter-spacing: 0px;
          margin-top: 6px;
        }
        .card-item-symbol {
          color: #FFDEB5;
          font-family: GeneralSans-Medium;
          font-size: 14px;
          line-height: 16px;
          letter-spacing: 0px;
          text-align: center;
          margin-top: 4px;
        }
      }
    }
    .bridge {
      width: 240px;
      height: 56px;
      margin-top: 46px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      box-shadow: 0px 0px 24px 0px rgba(255, 21, 0, 0.4);
      backdrop-filter: blur(156px);
      cursor: pointer;
      background: linear-gradient(
          310.65deg,
          rgb(255, 255, 234) -11.715%,
          rgb(143, 247, 255) -11.715%,
          rgb(255, 79, 79) 29.554%
        ),
        rgb(255, 79, 79);
      font-size: 18px;
      font-family: GeneralSans-SemiBold;
      line-height: 28px;
      letter-spacing: 0px;
      clip-path: polygon(
        0 12px,
        12px 0,
        100% 0,
        100% calc(100% - 12px),
        calc(100% - 12px) 100%,
        0 100%
      );
    }
  }
}

@media (max-width: 1200px) {
  #prizes-top-banner {
    height: 420px;
    .prizes-content {
      .badge {
        font-size: 16px;
      }
      .title {
        font-size: 24px;
        line-height: 1;
      }
      .amount {
        font-size: 32px;
        line-height: 1;
      }
      .bridge {
        margin-top: 24px;
      }
    }
  }
}
</style>
