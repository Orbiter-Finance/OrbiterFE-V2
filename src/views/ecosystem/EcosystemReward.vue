<template>
  <div id="ecosystem-reward-container" class="ecosystem-reward-container">
    <div class="content">
      <div class="title">
        <div>Reward</div>
        <div class="symbol">
          <img
            class="card-symbol"
            :src="require('../../assets/ecosystem/card-symbol.svg')"
          />
          FCFS
        </div>
      </div>

      <div class="card-image">
        <img :src="require('../../assets/ecosystem/card-image.png')" />
      </div>

      <div class="amount">50 $BLS</div>

      <div class="progress-card">
        <div class="progress-title">
          <div class="text">Participants Info</div>
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
        <div class="progress-amount-box">
          <div class="text">Participants</div>
          <div class="progress-amount">
            <span>{{ '5,324' }}</span>
            /10000
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
          ></div>
        </div>
      </div>

      <div class="claim">Claim Reward</div>
    </div>
  </div>
</template>

<script>
import { decimalNum } from '../../util/decimalNum'

export default {
  name: 'EcosystemReward',
  data() {
    return {
      ratio: 50,
    }
  },
  methods: {
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
  },
}
</script>

<style scoped lang="scss">
.ecosystem-reward-container {
  width: 100%;
  .content {
    width: 100%;
    padding: 16px;
    border: 2px solid rgb(34, 34, 34);
    border-radius: 20px;
    background: rgb(255, 255, 255);

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: rgb(34, 34, 34);
      font-size: 18px;
      font-weight: 700;
      line-height: 25px;
      letter-spacing: 0px;
      text-align: left;
      .symbol {
        padding: 4px 8px;
        border-radius: 12px;
        background: radial-gradient(
          75% 75% at 50% 50%,
          rgb(48, 63, 21) 33.464%,
          rgb(0, 0, 0) 100%
        );
        color: rgb(191, 251, 84);
        font-size: 12px;
        font-weight: 700;
        line-height: 14px;
        letter-spacing: 0px;
        text-align: left;

        display: flex;
        justify-content: center;
        align-items: center;

        .card-symbol {
          width: 12px;
          height: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 4px;
        }
      }
    }

    .card-image {
      width: 100%;
      margin-top: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 120px;
        height: 120px;
      }
    }

    .amount {
      width: 100%;
      color: rgb(34, 34, 34);
      font-size: 24px;
      font-weight: 700;
      line-height: 33px;
      letter-spacing: 0px;
      text-align: center;
      margin: 12px 0 20px;
    }

    .progress-card {
      width: 100%;
      padding: 12px;
      border-radius: 12px;
      background: rgb(245, 245, 245);

      .progress-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
        letter-spacing: 0px;
        text-align: left;
        .help-icon {
          margin-left: 1.5px;
          width: 16px;
          height: 16px;
        }
      }

      .progress-amount-box {
        margin-top: 8px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: rgb(153, 153, 153);

        .text {
          font-size: 12px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: 0px;
          text-align: left;
        }

        .progress-amount {
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
          letter-spacing: 0px;
          text-align: right;

          span {
            font-weight: 700;
            color: rgb(34, 34, 34);
          }
        }
      }

      .progress-box {
        margin-top: 8px;
        width: 100%;
        height: 8px;
        background: #eeeeee;
        border-radius: 6px;
        overflow: hidden;

        .progress {
          height: 8px;
        }

        .default-bg {
          background: #222222;
          border-radius: 6px;
        }
      }
    }

    .claim {
      margin-top: 80px;
      width: 100%;
      padding: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgb(255, 255, 255);
      font-size: 16px;
      font-weight: 700;
      line-height: 22px;
      letter-spacing: 0px;
      text-align: center;
      border-radius: 24px;
      background: rgb(239, 47, 45);
      opacity: 0.5;
    }
  }
}
@media (max-width: 720px) {
  #ecosystem-reward-container.ecosystem-reward-container {
    .claim {
      margin-top: 32px;
    }
  }
}
</style>
