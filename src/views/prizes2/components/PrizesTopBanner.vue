<template>
  <div id="prizes-top-banner" class="prizes-top-banner">
    <div class="prizes-content">
      <div class="prizes-details">
        <div class="prizes-to-chain">
          <div class="prizes-chain"></div>
        </div>
        <div class="prizes-label">
          <div style="white-space: nowrap">
            <span class="prizes-total-pool-amount">$80,000 Prize Pool </span>
          </div>
          <div class="token-symbol">200,000 $ORBGUY!</div>
        </div>
        <img
          class="prizes-banner-image-mobile"
          :src="require('../../../assets/prizes/v2/banner-bg-mobile.png')"
        />

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

        <div class="prizes-to-bridge">
          <div
            class="prizes-to-bridge-btn"
            @click="toBridgeCall"
            :style="`opacity: ${isEnd ? '0.3' : '1'};`"
          >
            <!-- {{ isEnd ? 'In the statistics...' : 'Start Bridge' }} -->
            {{ isEnd ? 'Claim' : 'Start Bridge' }}
          </div>
        </div>
      </div>
      <img
        class="prizes-banner-image"
        :src="require('../../../assets/prizes/v2/banner-bg.png')"
      />
    </div>
  </div>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon.vue'
import { isDev } from '../../../util'
import getUTCTime from '../../../util/time'
import { prizesTimeEnd, setPrizesTimeEnd } from '../../../composition/hooks'

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
      timeStr: '2024-07-20T13:30:00.000Z',
      timeList: timeListDefault,
    }
  },
  computed: {
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
      if (this.isEnd) return
      localStorage.setItem(
        'last_page_before_history',
        JSON.stringify({
          params: {},
          path: '/',
          query: { source: 'Ethereum', dest: 'Arbitrum', token: 'ETH' },
        })
      )
      this.$router.push({
        path: isDev()
          ? '/?source=Sepolia%28G%29&dest=Arbitrum%20Sepolia'
          : '/?source=Ethereum&dest=Arbitrum&token=ETH',
      })
    },
  },
  mounted() {
    timer1 = setInterval(() => {
      const t = this.getUTCTime1(this.timeStr)
      const timeS = Math.floor((t - getUTCTime()) / 1000)
      let time = timeS
      if (timeS <= 0) {
        clearInterval(timer1)
        setPrizesTimeEnd(true)
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
  padding: 80px 0 40px;
  background-image: url('../../../assets/prizes/v2/bg.png');
  background-size: 36px 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  .prizes-content {
    width: 100%;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    .prizes-details {
      .prizes-to-chain {
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        .prizes-chain {
          width: 454px;
          height: 64px;
          display: flex;
          justify-content: start;
          align-items: center;
          background-image: url('../../../assets/prizes/v2/banner-chain.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100% 100%;
        }
      }

      .prizes-label {
        margin-top: 16px;
        font-size: 64px;
        font-weight: 700;
        letter-spacing: 0px;
        text-align: left;
        font-family: GeneralSans-Bold;

        .prizes-total-pool-amount {
          background-image: linear-gradient(
            to bottom,
            rgb(250, 227, 170),
            rgb(243, 186, 47)
          );
          -webkit-text-fill-color: transparent;
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

        .token-symbol {
          background-image: linear-gradient(
            90deg,
            rgb(248, 242, 254),
            rgb(239, 197, 250),
            rgb(195, 167, 248)
          );
          -webkit-text-fill-color: transparent;
          background-position-x: initial;
          background-position-y: initial;
          background-size: initial;
          background-repeat-x: initial;
          background-repeat-y: initial;
          background-attachment: initial;
          background-origin: initial;
          -webkit-background-clip: text;
          background-color: initial;
          font-size: 44px;
        }
      }

      .prizes-banner-image-mobile {
        width: 100%;
        display: none;
      }

      .time-label {
        width: 100%;
        margin-top: 20px;
        font-size: 20px;
        font-weight: 500;
        color: rgba(255, 2555, 255, 0.6);
        font-family: GeneralSans-Medium;
      }

      .time-card {
        display: flex;
        justify-content: start;
        align-items: center;
        width: 100%;
        margin-top: 12px;
        .time-card-item {
          width: 72px;
          height: 72px;
          border-radius: 8px;
          padding: 6px 12px;
          backdrop-filter: blur(156px);
          background: rgba(243, 223, 47, 0.2);
          margin-right: 12px;
          text-align: center;
          .card-item-value {
            width: 100%;
            font-size: 32px;
            font-weight: 600;
            line-height: 32px;
            font-family: GeneralSans-SemiBold;
          }

          .card-item-symbol {
            margin-top: 4px;
            width: 100%;
            font-size: 16px;
            font-weight: 400;
            line-height: 16px;
            color: rgb(243, 186, 47);
            font-family: GeneralSans-Medium;
          }
        }
      }

      .prizes-to-bridge {
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: center;

        .prizes-to-bridge-btn {
          width: 348px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #010101;

          margin-top: 56px;
          padding: 12px 0;
          background-image: url('../../../assets/prizes/v2/prizes-btn.png');
          font-size: 24px;
          font-family: GeneralSans-SemiBold;
          line-height: 28px;
          // cursor: pointer;
          background-size: 100% 100%;
        }
      }
    }

    .prizes-claim-group {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .prizes-banner-image {
      width: 45%;
      margin-right: -8%;
      margin-left: -24%;
    }
  }
}

@media (max-width: 1200px) {
  #prizes-top-banner {
    .prizes-label {
      font-size: 52px;
    }
    .prizes-orbguy {
      font-size: 24px;
      .orbguy-token-symbol {
        width: 32px;
        height: 32px;
      }
    }
  }
}
@media (max-width: 960px) {
  #prizes-top-banner {
    .prizes-label {
      font-size: 40px;
    }
    .prizes-orbguy {
      font-size: 22px;
      .orbguy-token-symbol {
        width: 30px;
        height: 30px;
      }
    }
  }
}
@media (max-width: 840px) {
  #prizes-top-banner {
    .prizes-label {
      font-size: 32px;
    }
  }
}

@media (max-width: 740px) {
  #prizes-top-banner {
    width: 100%;
    .prizes-content {
      width: 100%;
      display: block;
      text-align: center;
      .prizes-details {
        .prizes-banner-image-mobile {
          padding: 24px 12px;
          display: flex;
        }

        .prizes-to-chain {
          width: 100%;
          display: flex;
          justify-content: center;
          align-content: center;
        }
        .prizes-label {
          text-align: center;
        }
        .prizes-orbguy {
          font-size: 20px;
          width: 100%;
          .orbguy-token-symbol {
            width: 28px;
            height: 28px;
          }
        }

        .time-label {
          text-align: center;
        }

        .time-card {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .prizes-to-bridge {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .prizes-banner-image {
        display: none;
      }
      .prizes-claim-group {
        display: none;
      }
    }
  }
}
</style>
