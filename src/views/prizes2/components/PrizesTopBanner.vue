<template>
  <div id="prizes-top-banner" class="prizes-top-banner">
    <div class="prizes-content">
      <div class="prizes-details">
        <div class="prizes-to-chain">
          <div class="prizes-chain"></div>
        </div>
        <div class="prizes-label">
          <div style="white-space: nowrap">
            <span class="prizes-total-pool-amount">
              $200,000
              <br class="title-br" />
              Prize Pool
            </span>
          </div>
          <div class="token-symbol">
            <div class="prizes-token-info"></div>
          </div>
        </div>
        <img
          class="prizes-banner-image-mobile"
          :src="require('../../../assets/prizes/v2/banner-bg-mobile.png')"
        />

        <!-- <div class="time-label">Ends In</div> -->
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
          <div class="btn-group">
            <div
              class="prizes-to-bridge-btn"
              @click="toBridgeCall"
              :style="`opacity: ${isEnd ? '0.3' : '1'};`"
            >
              {{ isEnd ? 'In the statistics...' : 'Start Bridge' }}
              <!-- {{ isEnd ? 'Claim' : 'Start Bridge' }} -->
            </div>
          </div>
        </div>
      </div>
      <img
        class="prizes-banner-image"
        :src="require('../../../assets/prizes/v2/banner-bg.png')"
      />

      <div class="prizes-linea"></div>
      <div class="prizes-zksync-era"></div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon.vue'
import { isDev } from '../../../util'
import getUTCTime from '../../../util/time'
import {
  prizesV2TimeEnd,
  setPrizesV2TimeEnd,
  prizesV2ProjectTime,
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
    toBridgeCall() {
      if (this.isEnd) return
      localStorage.setItem(
        'last_page_before_history',
        JSON.stringify({
          params: {},
          path: '/',
          query: { source: 'Ethereum', dest: 'BNB Chain', token: 'ETH' },
        })
      )
      this.$router.push({
        path: isDev()
          ? '/?source=Sepolia%28G%29&dest=BNB%20Chain'
          : '/?source=Ethereum&dest=BNB%20Chain&token=ETH',
      })
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
    position: relative;
    top: 0;
    left: 0;
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
        font-weight: 700;
        letter-spacing: 0px;
        text-align: left;
        font-family: GeneralSans-Bold;

        .title-br {
          display: none;
        }

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
          font-size: 64px;
          line-height: 72px;
        }

        .token-symbol {
          margin-top: 24px;
          .prizes-token-info {
            width: 500px;
            height: 64px;
            background-image: url(../../../assets/prizes/v2/prizes-info-image.png);
            background-size: 100% 100%;
          }
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
        margin-top: 24px;
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

        .btn-group {
          background-color: #010101;
          display: flex;
          justify-content: center;
          align-items: center;
        }

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
    }
  }

  .prizes-linea {
    width: 36px;
    height: 36px;
    background-image: url('../../../assets/prizes/v2/prizes-linea.png');
    background-size: 36px 36px;
    position: absolute;
    top: -48px;
    left: 40%;
  }

  .prizes-zksync-era {
    width: 64px;
    height: 64px;
    background-image: url('../../../assets/prizes/v2/prizes-zksync-era.png');
    background-size: 64px 64px;
    position: absolute;
    top: 60%;
    left: -80px;
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
  
    .prizes-zksync-era {
      display: none;
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
      .title-br {
        display: flex;
      }
    }
  }
}

@media (max-width: 740px) {
  #prizes-top-banner {
    padding: 40px 0 20px;
    width: 100%;

    .prizes-linea {
      display: none;
    }

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

          .prizes-chain {
            width: 296px;
            height: 40px;
          }
        }
        .prizes-label {
          text-align: center;
          .token-symbol {
            font-size: 32px;
          }
          .token-symbol {
            display: flex;
            justify-content: center;
            align-items: center;
            .prizes-token-info {
              width: 80%;
              height: 0;
              padding: 6.4% 0;
            }
          }
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
          .prizes-to-bridge-btn {
            width: 320px;
            height: 74px;
            margin-top: 24px;
          }
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
