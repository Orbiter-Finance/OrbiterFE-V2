<template>
  <div id="prizes-allocation" class="prizes-allocation">
    <div class="prizes-allocation-title">
      Overall prize pool composition and allocation
    </div>
    <div class="prizes-ratio-group">
      <div class="prizes-ratio-item" v-for="item in ratioList" :key="item.text">
        <div class="prizes-ratio-item-group">
          <img :src="require('../../../assets/prizes/' + item.img)" />
        </div>
        <div class="prizes-ratio-item-group" :style="`color: ${item.color};`">
          <div class="text">{{ item.text }}</div>
        </div>
        <div class="prizes-ratio-item-group">
          <div class="des">{{ item.des }}</div>
        </div>
      </div>
    </div>
    <div class="prizes-allocation-card">
      <div class="title">
        <div>My progress</div>
        <div class="rank-reward">
          <span>Estimated earnings: </span>
          <span class="reward-amount">519.5 USDC</span>
        </div>
      </div>
      <div class="description">
        <div class="description-text">
          Accumulated <span class="remark">3</span> Bridges to share
          <span class="remark">10%</span> of prize pool
        </div>
        <div class="current-rank">
          <span>Current rank: </span>
          <span class="current-ranking">19</span>
        </div>
      </div>

      <div class="pogress-group">
        <div class="progress-ratio-group">
          <div
            class="progress-ratio-group-item"
            v-for="item in progressStage"
            :key="item.position"
            :style="`left: ${(item.position / 20) * 100}%;`"
          >
            {{ item.ratio }}
          </div>
        </div>
        <div class="pogress-box">
          <div
            class="progress-bar"
            :style="`width: ${(currentStage / 20) * 100}%;`"
          ></div>
          <div
            class="progress-stage"
            v-for="item in progressStage"
            :key="item.position"
            :style="`left: ${(item.position / 20) * 100}%;visibility:${
              item.position ? 'visable' : 'hidden'
            };background-color:${
              currentStage > item.value ? '#FFBA56' : '#222222'
            };`"
          ></div>
          <div
            class="progress-tx-current-stage"
            :style="`left: ${(currentStage / 20) * 100}%;visibility:${
              currentStage ? 'visable' : 'hidden'
            };`"
          >
            <div>15%</div>
            <div class="progress-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="8.489258"
                height="5.242645"
                viewBox="0 0 8.48926 5.24265"
                fill="none"
              >
                <path
                  d="M1 0L7.48 0C8.37 0 8.82 1.07 8.19 1.7L4.95 4.94C4.56 5.34 3.92 5.34 3.53 4.94L0.29 1.7C-0.34 1.07 0.11 0 1 0Z"
                  fill="#FFA629"
                  fill-opacity="1.000000"
                  fill-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="progress-tx-group">
          <div
            class="progress-tx-group-item"
            :style="`left: ${(item.position / 20) * 100}%;`"
            v-for="item in progressStage"
            :key="item.position"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
      <div class="inv"></div>
      <div class="task-title">Quest</div>
      <div
        class="task-card-options"
        :class="item.isSuccess ? 'task-card-options-success' : ''"
        v-for="item in taskOptionsList"
        :key="item.reward"
      >
        <div class="info">
          <div class="icon">
            <img
              :src="require('../../../assets/prizes/' + item.icon + '.svg')"
            />
          </div>
          <div class="content-text" v-html="item.text"></div>
        </div>
        <div class="reward">
          {{ item.reward }}
          <img
            style="margin: 0 4px"
            :src="require('../../../assets/prizes/o-points.svg')"
          />
          OPoints
          <PrizesTaskSuccessIcon
            v-if="item.isSuccess"
            :fillColor="'#DDF600'"
            style="margin-left: 4px"
          ></PrizesTaskSuccessIcon>
          <img v-else :src="require('../../../assets/prizes/more.svg')" />
        </div>
      </div>

      <div
        class="task-card-pool"
        :class="item.isPromotion ? 'task-card-pool-promotion' : ''"
        v-for="item in taskPoolList"
        :style="
          item.isSuccess
            ? `border: 1px solid ${item.color};backdrop-filter: blur(12px); background: ${item.color}18;`
            : ''
        "
        :key="item.reward"
      >
        <div class="info">
          <div class="icon">
            <img
              :src="require('../../../assets/prizes/' + item.icon + '.svg')"
            />
          </div>
          <div class="content-text" v-html="item.text"></div>
        </div>
        <div v-if="item.isPromotion" class="prizes-promotion">
          Already entered in higher stage pools
        </div>
        <div v-else class="pool-reward" :style="`color: ${item.color};`">
          {{ item.reward }}
          <PrizesTaskSuccessIcon
            v-if="item.isSuccess"
            :fillColor="item.color"
            style="margin-left: 4px"
          ></PrizesTaskSuccessIcon>
          <img v-else :src="require('../../../assets/prizes/more.svg')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PrizesTaskSuccessIcon from './PrizesTaskSuccess.vue'
const ratio10 = '#DBEF2D'
const ratio15 = '#FF29DA'
const ratio20 = '#A862EA'
const ratio25 = '#00EEEE'
const ratio30 = '#FFA629'
export default {
  name: 'PrizesAllocation',
  components: {
    PrizesTaskSuccessIcon,
  },
  data() {
    return {
      ratioList: [
        {
          img: 'tx3.png',
          text: '10%',
          color: ratio10,
          des: 'Cumulative ≥3 tx',
        },
        {
          img: 'tx5.png',
          text: '15%',
          color: ratio15,
          des: 'Cumulative ≥5 tx',
        },
        {
          img: 'tx8.png',
          text: '20%',
          color: ratio20,
          des: 'Cumulative ≥8 tx',
        },
        {
          img: 'tx15.png',
          text: '25%',
          color: ratio25,
          des: 'Cumulative ≥15 tx',
        },
        {
          img: 'top100.png',
          text: '30%',
          color: ratio30,
          des: 'Top 100 users',
        },
      ],
      taskOptionsList: [
        {
          icon: 'x',
          text: `Quote the Tweet and mention 3 friends`,
          reward: '+3',
        },
        {
          icon: 'bridge',
          text: `Bridge <span class="orbiter_global_prizes_tx-color">1 TX</span> from any network to Arbitrum`,
          reward: '+5',
          isSuccess: true,
        },
        {
          icon: 'bridge',
          text: `Bridge <span class="orbiter_global_prizes_tx-color">2 TX</span> from any network to Arbitrum`,
          reward: '+12',
        },
      ],
      taskPoolList: [
        {
          icon: 'bridge',
          text: `Bridge <span class="orbiter_global_prizes_tx-color">3 TX</span> from any network to Arbitrum`,
          reward: '10% Prize Pool',
          color: ratio10,
          isPromotion: true,
        },
        {
          icon: 'bridge',
          text: `Bridge <span class="orbiter_global_prizes_tx-color">5 TX</span> from any network to Arbitrum`,
          reward: '15% Prize Pool',
          isSuccess: true,
          color: ratio15,
        },
        {
          icon: 'bridge',
          text: `Bridge <span class="orbiter_global_prizes_tx-color">8 TX</span> from any network to Arbitrum`,
          reward: '20% Prize Pool',
          color: ratio20,
        },
        {
          icon: 'bridge',
          text: `Bridge <span class="orbiter_global_prizes_tx-color">15 TX</span> from any network to Arbitrum`,
          reward: '25% Prize Pool',
          color: ratio25,
        },
        {
          icon: 'bridge',
          text: `Bridge from any network to Arbitrum's <span class="orbiter_global_prizes_tx-color">Top 100</span>`,
          reward: '30% Prize Pool',
          color: ratio30,
        },
      ],
      progressStage: [
        {
          position: 0,
          label: '0',
          ratio: '0',
          value: 0,
        },
        {
          position: 3,
          label: '3',
          ratio: '10%',
          value: 3,
        },
        {
          position: 5,
          label: '5',
          ratio: '15%',
          value: 5,
        },
        {
          position: 8,
          label: '8',
          ratio: '20%',
          value: 8,
        },
        {
          position: 15,
          label: '15',
          ratio: '25%',
          value: 15,
        },
        {
          position: 20,
          label: 'Top 100',
          ratio: '30%',
          value: 20,
        },
      ],
      currentStage: 6,
    }
  },
}
</script>

<style scoped lang="scss">
.prizes-allocation {
  width: 100%;
  margin-top: 32px;
  .prizes-allocation-title {
    width: 100%;
    text-align: center;
    font-size: 32px;
    font-weight: 600;
    line-height: 44px;
    text-align: center;
  }

  .prizes-ratio-group {
    margin-top: 32px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: start;

    .prizes-ratio-item {
      flex: 1;
      .prizes-ratio-item-group {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        & > img {
          width: 84px;
          height: 84px;
        }

        .text {
          margin-top: 12px;
          font-size: 24px;
          font-weight: 600;
        }

        .des {
          font-size: 14px;
        }
      }
    }
  }

  .prizes-allocation-card {
    width: 100%;
    padding: 24px;
    margin-top: 32px;
    border: 2px solid rgb(239, 47, 45);
    border-radius: 16px;
    box-shadow: inset 0px 0px 34px 0px rgba(239, 47, 45, 0.4),
      0px 0px 14px 0px rgb(239, 47, 45);
    backdrop-filter: blur(156px);
    background: rgb(0, 0, 0);

    .title {
      width: 100%;
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      text-align: left;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .rank-reward {
        font-size: 18px;
        line-height: -1px;
        letter-spacing: 0px;
        text-align: right;

        display: flex;
        justify-content: flex-end;
        align-items: center;

        .reward-amount {
          padding-left: 4px;
          color: #ffba56;
          font-weight: 600;
        }
      }
    }

    .description {
      margin-top: 12px;
      font-size: 18px;
      font-weight: 500;
      line-height: -1px;
      letter-spacing: 0px;
      text-align: left;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .description-text {
        display: flex;
        justify-content: start;
        align-items: center;
        .remark {
          padding: 0 4px;
          color: #ffba58;
          font-weight: 600;
        }
      }

      .current-rank {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 18px;
        line-height: -1px;
        letter-spacing: 0px;
        text-align: right;
        .current-ranking {
          padding-left: 4px;
          color: #ffba58;
          font-weight: 600;
        }
      }
    }

    .pogress-group {
      width: 100%;
      margin: 16px 0 32px;
      font-size: 14px;

      .pogress-box {
        width: 100%;
        height: 8px;
        margin: 20px 0;
        display: flex;
        justify-content: start;
        align-items: center;
        border-radius: 12px;
        background: rgb(26, 26, 26);
        position: relative;
        top: 0;
        left: 0;

        .progress-bar {
          height: 100%;
          border-radius: 16px;
          background: rgb(255, 186, 86);
        }

        .progress-stage {
          position: absolute;
          top: 50%;
          width: 24px;
          height: 24px;
          border: 2px solid rgb(34, 34, 34);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .progress-stage:last-child {
          transform: translate(-100%, -50%);
        }

        .progress-tx-current-stage {
          position: absolute;
          top: -16px;
          color: #ffa629;
          transform: translate(-50%, -50%);
          width: 32px;

          .progress-icon {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            & > svg {
              width: 8px;
              height: 8px;
            }
          }
        }
      }

      .progress-ratio-group {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        top: 0;
        left: 0;
        color: rgba(255, 255, 255, 0.6);
        .progress-ratio-group-item {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          white-space: nowrap;
        }
        .progress-ratio-group-item:last-child {
          transform: translate(-100%, -50%);
        }
      }

      .progress-tx-group {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        top: 0;
        left: 0;
        color: rgba(255, 255, 255, 0.6);
        .progress-tx-group-item {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          white-space: nowrap;
        }

        .progress-tx-group-item:last-child {
          transform: translate(-100%, -50%);
        }
      }
    }

    .inv {
      width: 100%;
      height: 0;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.4);
    }

    .task-title {
      font-size: 20px;
      font-weight: 600;
      line-height: -1px;
      letter-spacing: 0px;
      text-align: left;
      padding: 24px 0 4px;
    }

    .task-card-options {
      width: 100%;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgb(26, 26, 26);
      margin-top: 12px;
      border-radius: 12px;
      cursor: pointer;
      border: 1px solid transparent;

      .info {
        display: flex;
        justify-content: start;
        align-items: center;
        .icon {
          width: 24px;
          height: 24px;
        }

        .content-text {
          font-size: 16px;
          font-weight: 500;
          line-height: 24px;
          letter-spacing: 0px;
          text-align: left;
          margin-left: 4px;
        }
      }

      .reward {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        letter-spacing: 0px;
        text-align: right;
      }
    }

    .task-card-options-success {
      border: 1px solid rgb(219, 239, 45);
      border-radius: 12px;
      backdrop-filter: blur(12px);
      background: rgba(219, 239, 45, 0.15);
    }

    .task-card-pool {
      width: 100%;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgb(26, 26, 26);
      margin-top: 12px;
      border-radius: 12px;
      cursor: pointer;
      border: 1px solid transparent;

      .info {
        display: flex;
        justify-content: start;
        align-items: center;
        .icon {
          width: 24px;
          height: 24px;
        }

        .content-text {
          font-size: 16px;
          font-weight: 500;
          line-height: 24px;
          letter-spacing: 0px;
          text-align: left;
          margin-left: 4px;
        }
      }

      .pool-reward {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        letter-spacing: 0px;
        text-align: right;
      }

      .prizes-promotion {
        color: #ffff;
      }
    }

    .task-card-pool-promotion {
      opacity: 0.4;
    }
  }
}
</style>
