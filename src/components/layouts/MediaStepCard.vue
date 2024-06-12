<template>
  <div class="media-step-card">
    <div v-if="currentStepStatus === 1" class="step1-content">
      <div class="media-iamge">
        <img
          class="card-qr"
          :src="require('../../assets/activity/likwid-qr.png')"
        />
      </div>
      <div class="step1-des">
        <span class="step-des-title">Step 1: </span>
        Join LIKWID Group
        <svg
          class="media-icon"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="16.000000"
          height="16.000000"
          viewBox="0 0 16 16"
          fill="none"
        >
          <defs>
            <clipPath id="clip812_520">
              <rect
                id="telegram.19a5a5db.svg"
                rx="4.000000"
                width="16.000000"
                height="16.000000"
                fill="white"
                fill-opacity="0"
              />
            </clipPath>
          </defs>
          <rect
            id="telegram.19a5a5db.svg"
            rx="4.000000"
            width="16.000000"
            height="16.000000"
            fill="#279EFF"
            fill-opacity="1.000000"
          />
          <g clip-path="url(#clip812_520)">
            <path
              id="Vector"
              d="M12.97 4.75L11.46 11.88C11.34 12.38 11.05 12.5 10.63 12.27L8.33 10.57L7.22 11.63C7.16 11.7 7.09 11.75 7.01 11.79C6.93 11.83 6.84 11.85 6.75 11.85L6.92 9.51L11.18 5.69C11.37 5.52 11.14 5.43 10.89 5.6L5.62 8.9L3.36 8.19C2.86 8.03 2.85 7.7 3.46 7.46L12.33 4.04C12.74 3.89 13.1 4.13 12.97 4.75Z"
              fill="#FFFFFF"
              fill-opacity="1.000000"
              fill-rule="evenodd"
            />
          </g>
        </svg>
      </div>

      <div v-if="isNext" class="step1-next" @click="stepNextClick">
        Next Step
      </div>
      <div v-else class="step1-btn" @click="joinTelegram">Join</div>
    </div>
    <div v-else-if="currentStepStatus === 2" class="step2-content">
      <div class="step2-des">
        <span class="step-des-title">Step 2: </span>
        Follow <span @click="goToFollow" class="link">@LIKWID_MEME</span> for
        ALPHA updates.
      </div>
      <div v-if="isNext" class="step2-next" @click="stepNextClick">
        Next Step
      </div>
      <div v-else class="step2-btn" @click="goToFollow">Go to Follow</div>
    </div>
    <div v-else class="step3-content">
      <div class="step3-des">
        <span class="step-des-title">Step 3: </span>
        Claim your Token on <span class="chain-name">{{ chainName }}</span>
      </div>
      <div
        class="step3-btn"
        @click="claim"
        :style="`opacity:${loading ? '0.4' : '1'};cursor:${
          loading ? 'not-allowed' : 'pointer'
        };`"
      >
        {{ loading ? 'loading...' : 'Claim' }}
      </div>
      <div class="link-card">
        <div class="link-label">
          Trade $ORBGUY on
          <img
            class="token-image"
            :src="require('../../assets/activity/LIKWID-launch.png')"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../util/util'
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'

let timer
export default {
  props: {
    claimCall: Function,
    isLoading: Boolean,
    rewardChainId: String,
  },
  name: 'MediaStepCard',
  data() {
    return {
      step1Url: 'https://t.me/likwid_meme',
      step1Name: 'JOIN_LIKWID_TELEGRAM',
      stepStatus: 1,
      isNext: false,
      step2Url: 'https://twitter.com/LIKWID_MEME',
      step2Name: 'JOIN_LIKWID_X',
    }
  },
  computed: {
    currentEvmAddress() {
      return compatibleGlobalWalletConf?.value?.walletPayload?.walletAddress
    },
    currentStepStatus() {
      const statusGroup =
        localStorage.getItem('LUCKY_BAG_JOIN_MEDIA_STATUS') ||
        JSON.stringify({})

      const evmAddress = (this.currentEvmAddress || '').toLocaleLowerCase()

      return JSON.parse(statusGroup)[evmAddress] ? 3 : this.stepStatus
    },
    chainId() {
      return this.rewardChainId
    },
    loading() {
      return this.isLoading
    },
    chainName() {
      return util.chainName(this.chainId)
    },
  },
  methods: {
    joinTelegram() {
      this.openLink(this.step1Name, this.step1Url)
      this.updateStepNextStatus()
    },
    goToFollow() {
      this.openLink(this.step2Name, this.step2Url)
      this.updateStepNextStatus()
    },
    updateStepNextStatus() {
      clearTimeout(timer)
      this.isNext = true
    },
    stepNextClick() {
      this.isNext = false
      const status = this.stepStatus + 1
      this.stepStatus = status
      this.$emit('getStepStatus', status)
      if (status === 3) {
        const statusGroup =
          localStorage.getItem('LUCKY_BAG_JOIN_MEDIA_STATUS') ||
          JSON.stringify({})
        const evmAddress = (this.currentEvmAddress || '').toLocaleLowerCase()
        if (evmAddress) {
          localStorage.setItem(
            'LUCKY_BAG_JOIN_MEDIA_STATUS',
            JSON.stringify({
              ...JSON.parse(statusGroup),
              [evmAddress]: 'true',
            })
          )
        }
      }
    },
    openLink(tag, url) {
      const name = tag + '_LUCKY_BAG'
      this.$gtag.event(name, {
        event_category: name,
        event_label: url,
      })
      window.open(url, '_blank')
    },
    claim() {
      if (this.isLoading) return
      this.claimCall()
    },
  },
}
</script>

<style lang="scss" scoped>
.media-step-card {
  width: 100%;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 16px;
  background: linear-gradient(
    175.64deg,
    rgb(255, 251, 236) 14.882%,
    rgb(255, 202, 170) 76.231%
  );
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .step-des-title {
    font-weight: 700;
  }
  .step1-content {
    width: 100%;
    .media-iamge {
      display: flex;
      justify-content: center;
      align-items: center;
      .card-qr {
        width: 88px;
        height: 88px;
      }
    }

    .step1-des {
      margin-top: 12px;
      width: 100%;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: 0px;
      white-space: nowrap;
      display: flex;
      justify-content: center;
      align-items: center;

      .media-icon {
        width: 16px;
        height: 16px;
        margin-left: 4px;
      }
    }

    .step1-btn {
      border-radius: 8px;
      background: rgb(0, 0, 0);
      margin-top: 12px;
      width: 100%;
      padding: 12px 0;
      font-size: 16px;
      font-weight: 700;
      line-height: 22px;
      letter-spacing: 0px;
      color: #fff;
      cursor: pointer;
    }
    .step1-next {
      border-radius: 8px;
      background: rgb(223, 46, 45);
      margin-top: 12px;
      width: 100%;
      padding: 12px 0;
      font-size: 16px;
      font-weight: 700;
      line-height: 22px;
      letter-spacing: 0px;
      color: #fff;
      cursor: pointer;
    }
  }

  .step2-content {
    width: 100%;
    .step2-des {
      width: 100%;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: 0px;
      text-align: left;
      .link {
        color: rgb(39, 158, 255);
        font-weight: 700;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .step2-btn {
      border-radius: 8px;
      background: rgb(0, 0, 0);
      margin-top: 12px;
      width: 100%;
      padding: 12px 0;
      font-size: 16px;
      font-weight: 700;
      line-height: 22px;
      letter-spacing: 0px;
      color: #fff;
      cursor: pointer;
    }
    .step2-next {
      border-radius: 8px;
      background: rgb(223, 46, 45);
      margin-top: 12px;
      width: 100%;
      padding: 12px 0;
      font-size: 16px;
      font-weight: 700;
      line-height: 22px;
      letter-spacing: 0px;
      color: #fff;
      cursor: pointer;
    }
  }

  .step3-content {
    .step3-des {
      width: 100%;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: 0px;
      text-align: left;
      .chain-name {
        color: rgb(223, 46, 45);
      }
    }
    .step3-btn {
      border-radius: 8px;
      background: rgb(223, 46, 45);
      margin-top: 12px;
      width: 100%;
      padding: 12px 0;
      font-size: 16px;
      font-weight: 700;
      line-height: 22px;
      letter-spacing: 0px;
      color: #fff;
      cursor: pointer;
    }
    .link-card {
      width: 100%;
      margin-top: 12px;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;

      .link-label {
        display: flex;
        justify-content: start;
        align-items: center;
        white-space: nowrap;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        font-family: GeneralSans-SemiBold;

        .token-image {
          margin-left: 4px;
          width: 55px;
          height: 12px;
        }
      }
    }
  }
}
</style>
