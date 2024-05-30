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
      <div class="title">My progress</div>
      <div class="description">
        Accumulated <span class="remark">3</span> Bridges to share
        <span class="remark">10%</span> of prize pool
      </div>

      <div class="pogress-group"></div>
      <div class="inv"></div>
      <div class="task-title">Quest</div>
      <div
        class="task-card-options"
        :class="item.isSuccess ? 'task-card-options-success' :'' "
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
        :class="item.isPromotion ? 'task-card-pool-promotion' :'' "
        v-for="item in taskPoolList"
        :style="item.isSuccess ? `border: 1px solid ${item.color};backdrop-filter: blur(12px); background: ${item.color}18;` : ''"
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
        <div v-if="item.isPromotion" class="prizes-promotion">Already entered in higher stage pools</div>
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
const ratio10 ="#DBEF2D"
const ratio15 ='#FF29DA'
const ratio20 ='#A862EA'
const ratio25 ='#00EEEE'
const ratio30 ='#FFA629'
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
          isPromotion: true
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
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      text-align: left;
    }

    .description {
      margin-top: 12px;
      font-size: 18px;
      font-weight: 500;
      line-height: -1px;
      letter-spacing: 0px;
      text-align: left;
      .remark {
        color: #ffba58;
        font-weight: 600;
      }
    }

    .pogress-group {
      width: 100%;
      margin: 16px 0 32px;
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
        color: #FFFF;
      }
    }

    .task-card-pool-promotion {
      opacity: 0.4;
    }

  }
}
</style>
