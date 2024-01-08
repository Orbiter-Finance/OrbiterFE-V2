<template>
  <div class="ecosystem-dapp-com">
    <div style="width: 100%; display: flex">
      <span class="title">Ecosystem DApp </span>
    </div>
    <div class="content">
      <div class="top">
        <img
          class="image"
          :src="require('../../assets/activity/ecosystem-dapp-logo.png')"
        />
        <div class="top-right">
          <div class="label">Layer2-20 🔥</div>
          <div class="text">
            <o-tooltip>
              <template v-slot:titleDesc>
                <div style="margin-left: -20px">
                  <span>
                    $L2, The First Omni-Inscription for ETH Community, powered by
                    Orbiter Finance. Fair mint is starting!
                  </span>
                </div>
              </template>
              <div class="text">
                $L2, The First Omni-Inscription for ETH Community, powered by
                Orbiter Finance. Fair mint is starting!
              </div>
            </o-tooltip>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="progress-group">
          <div class="holders">
            <div class="total">Holders: {{ decimalNumC(holders, 0, ',') }}</div>
            <div class="ratio">{{ decimalNumC(ratio, 3) }}%</div>
          </div>
          <div class="progress-box">
            <div class="progress"></div>
          </div>
        </div>
        <div class="mint" @click="openUrl('https://www.layer220.io/')">
          Mint
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { decimalNum } from '../../util/decimalNum'

export default {
  name: 'EcosystemDapp',
  data() {
    return {
      holders: 0,
      ratio: 0,
    }
  },
  methods: {
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
    openUrl(url) {
      window.open(url, '_blank')
    },
    async getData() {
      const res = await fetch(
        'https://api.layer220.io/statistic?protocol=layer2-20&tick=%24L2',
        {}
      )
      const {
        data: { totalHolders, max, totalAmount },
      } = await res.json()

      this.holders = totalHolders || 0

      if (Number(max) && Number(totalAmount)) {
        this.ratio = (totalAmount * 100) / max
      }
    },
  },
  created() {
    this.getData()
  },
}
</script>
<style lang="scss" scoped>
.ecosystem-dapp-com {
  width: 100%;
  padding: 16px 12px 16px 16px;
  box-sizing: border-box;
  .title {
    font-family: Kodchasan-Bold;
    font-size: 16px;
    font-weight: bold;
    color: #222222;
    line-height: 22px;
  }
  .content {
    width: 100%;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #222222;
    padding: 12px;
    margin-top: 12px;

    .top {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .image {
        width: 44px;
        height: 44px;
        border-radius: 8px;
        margin-right: 12px;
      }

      .top-right {
        flex: 1;
        text-align: left;
        width: calc( 100% - 56px);

        .label {
          width: 100%;
          font-size: 14px;
          font-weight: bold;
          color: #222222;
          line-height: 18px;
          font-family: OpenSansRoman-Regular;
        }

        .text {
          width: 100%;
          font-size: 12px;
          font-weight: 400;
          color: #999999;
          line-height: 18px;
          font-family: OpenSansRoman-Regular;
          margin-top: 4px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-top: 12px;

      .progress-group {
        flex: 1;

        .holders {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;

          .total {
            font-size: 14px;
            font-family: OpenSansRoman-Regular;
            font-weight: 600;
            color: #999999;
            line-height: 19px;
          }

          .ratio {
            font-size: 14px;
            font-family: OpenSansRoman-Regular;
            font-weight: 600;
            color: #222222;
          }
        }

        .progress-box {
          width: 100%;
          height: 8px;
          background: #eeeeee;
          border-radius: 6px;
          margin-top: 4px;

          .progress {
            width: 44px;
            height: 8px;
            background: #222222;
            border-radius: 6px;
          }
        }
      }

      .mint {
        width: 72px;
        height: 32px;
        background: #222222;
        border-radius: 18px;
        margin-left: 12px;
        font-size: 14px;
        font-family: OpenSansRoman-Regular;
        font-weight: bold;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }
}
</style>
