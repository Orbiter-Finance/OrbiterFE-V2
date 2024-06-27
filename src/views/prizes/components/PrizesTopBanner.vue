<template>
  <div id="prizes-top-banner" class="prizes-top-banner">
    <div class="prizes-content">
      <div class="prizes-details">
        <div class="prizes-to-chain">
          <div class="prizes-chain">
            <svg-icon
              style="width: 28px; height: 32px; margin-right: 8px"
              iconName="42161"
            ></svg-icon>
            Arbitrum Summer Bridging
          </div>
        </div>
        <div class="prizes-label">
          <span style="white-space: nowrap"
            ><span class="prizes-total-pool-amount">$100,000 </span>
            Bridging
          </span>
          <br />
          Competition
        </div>
        <div class="prizes-orbguy">
          TOP 800 will get
          <svg-icon iconName="ORBGUY" class="orbguy-token-symbol"></svg-icon>
          <span class="token-symbol">$ORBGUY </span>
          randomly
        </div>
        <!-- <img
          class="prizes-banner-image-mobile"
          :src="require('../../../assets/prizes/banner-bg-mobile.png')"
        /> -->

        <div class="prizes-banner-image-mobile">
          <PrizesClaimCard ></PrizesClaimCard>
        </div>

        <div class="prizes-banner-mobile-bg"></div>
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
          <div class="prizes-to-bridge-btn" @click="toBridgeCall"
          :style="`opacity: ${isEnd ? '0.3' : '1'};`"
          >
            <!-- {{ isEnd ? 'In the statistics...' : 'Start Bridge' }} -->
            {{ isEnd ? 'Claim' : 'Start Bridge' }}
          </div>
        </div>
      </div>
      <!-- <img
        class="prizes-banner-image"
        :src="require('../../../assets/prizes/banner-bg.png')"
      /> -->
      <div class="prizes-claim-group">
        <PrizesClaimCard ></PrizesClaimCard>
      </div>
      <div class="prizes-banner-bg"></div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon.vue'
import { isDev } from '../../../util'
import getUTCTime from '../../../util/time'
import PrizesClaimCard from "./PrizesClaimCard.vue"
import { prizesTimeEnd, setPrizesTimeEnd } from "../../../composition/hooks"

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
  components: { 
    SvgIcon,
    PrizesClaimCard
   },
  name: 'PrizesTopBanner',
  data() {
    return {
      timeStr: '2024-06-20T13:30:00.000Z',
      timeList: timeListDefault,
    }
  },
  computed: {
    isEnd() {
      return prizesTimeEnd.value
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
    toBridgeCall() {
      if(this.isEnd) return
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
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;
    .prizes-details {
      .prizes-to-chain {
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
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
      }

      .prizes-label {
        margin-top: 16px;
        font-size: 64px;
        font-weight: 700;
        letter-spacing: 0px;
        text-align: left;
        font-family: GeneralSans-Bold;

        .prizes-total-pool-amount {
          color: #ef2f2d;
        }
      }

      .prizes-orbguy {
        white-space: nowrap;
        font-size: 26px;
        font-weight: 600;
        line-height: 40px;
        letter-spacing: 0px;
        margin-top: 12px;
        display: flex;
        justify-content: start;
        align-items: center;
        .orbguy-token-symbol {
          width: 36px;
          height: 36px;
          margin: 0 8px;
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
          padding-right: 8px;
        }
      }

      .prizes-banner-image-mobile {
        width: 100%;
        display: none;
      }

      .prizes-banner-mobile-bg {
        display: none;
        position: relative;
        top: 0;
        left: -100%;
        width: 300%;
        padding: 32%;
        background-image: url('../../../assets/prizes/banner-bg-bottom.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        transform: translateY(-50%);
        z-index: -1;
        margin-bottom: -64%;
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
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: center;

        .prizes-to-bridge-btn {
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
          // cursor: pointer;
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
      width: 68%;
      margin-right: -8%;
      margin-left: -24%;
    }

    .prizes-banner-bg {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 150%;
      padding: 12%;
      background-image: url('../../../assets/prizes/banner-bg-bottom.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      transform: translateY(30%);
      z-index: -1;
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

        .prizes-banner-mobile-bg {
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
      .prizes-banner-bg {
        display: none;
      }
    }
  }
}
</style>
