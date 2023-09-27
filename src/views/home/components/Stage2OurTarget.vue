<template>
  <div class="target-wrap fade-content">
    <div class="title" :style="{ 'background-image': `url(${titleBg}` }">
      Our Target
    </div>
    <div class="desc">
      Our goal is to enable cross-rollup transactions, improving Ethereum's
      inter-chain compatibility and maintaining real-time synchronization
      between rollups and the mainnet. We are committed to reducing gas
      consumption through zk technology.
    </div>
    <div class="desc-keynote">
      Our future for Ethereum Layer 2 infrastructure awaits.
    </div>
    <div class="target-list">
      <div class="target-item" v-for="item in targetList" :key="item.label">
        <div class="item-icon">
          <img v-if="item.icon" :src="item.icon" />
        </div>
        <div class="item-word-content">
          <div class="item-label">{{ item.label }}</div>
          <div class="item-desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    realTime: {
      type: String,
      default: '',
    },
    lowCost: {
      type: String,
      default: '',
    },
    scalability: {
      type: String,
      default: '',
    },
    titleBg: {
      type: String,
      default: '',
    },
  },
  computed: {
    targetList () {
      return [
        {
          icon: this.realTime,
          label: 'Real-time',
          desc: 'Ethreum + rollup synchronising',
        },
        {
          icon: this.lowCost,
          label: 'Low-cost',
          desc: 'The lowest basic network costs',
        },
        {
          icon: this.scalability,
          label: 'Scalability',
          desc: 'Interchain interoperability',
        },
      ]
    },
  },
}
</script>

<style scoped lang="scss">
.target-wrap {
  width: min-content;
  box-sizing: border-box;
  padding: 0 0;
  margin: 0 auto;
  opacity: 0;
  background: #f5f5f5;
  display: flex;
  text-align: left;
  flex-direction: column;
  margin-top: -180px;
}
.title {
  width: 333px;
  font-size: 56px;
  font-family: 'Kodchasan-Bold';
  font-weight: bold;
  color: #222222;
  background-repeat: no-repeat;
  background-position-y: bottom;
  background-size: 307px 22px;
}
.desc {
  max-width: 75%;
  margin-top: 26px;
  font-size: 18px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-weight: 400;
  color: #666666;
}
.desc-keynote {
  margin-top: 24px;
  font-size: 20px;
  font-family: 'Kodchasan-Bold';
  font-weight: bold;
  color: #222222;
}
.target-list {
  margin-top: 38px;
  display: flex;
}
.target-item {
  width: 384px;
  height: 440px;
  background: #ffffff;
  box-shadow: inset 8px -8px 0px 0px rgba(0, 0, 0, 1);
  border-radius: 16px;
  border: 2px solid #222222;
  padding: 40px 24px 56px 40px;
  box-sizing: border-box;
  margin-right: 24px;
  &:last-of-type {
    margin-right: 0;
  }
}
.item-icon {
  width: 128px;
  height: 128px;
  margin-bottom: 150px;
  img {
    width: 100%;
    height: 100%;
  }
}
.item-label {
  font-size: 24px;
  font-family: 'Kodchasan-Bold';
  font-weight: bold;
  color: #222222;
}
.item-desc {
  font-size: 18px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-weight: 400;
  color: #666666;
}
@media (max-width: 1240px) {
  .target-wrap {
    margin-top: 0;
    max-width: 350px;
    width: max-content;
    .title {
      font-size: 36px;
      background-size: 201px 10px;
    }
    .desc {
      width: 100%;
      margin-top: 14px;
      font-size: 14px;
      max-width: 100%;
    }
    .desc-keynote {
      font-size: 16px;
    }
    .target-list {
      flex-direction: column;
      margin-top: 24px;
      .target-item {
        width: 100%;
        height: 100px;
        margin-right: 0;
        margin-bottom: 16px;
        display: flex;
        padding: 16px 20px 20px 16px;
        box-shadow: inset 4px -4px 0px 0px #000000;
        border-radius: 12px;
        &:last-of-type {
          margin-bottom: 0;
        }
        .item-icon {
          width: 64px;
          height: 64px;
          margin-bottom: 0;
          margin-right: 12px;
        }
        .item-word-content {
          display: flex;
          flex-direction: column;
        }
        .item-label {
          font-size: 18px;
          margin-bottom: 8px;
        }
        .item-desc {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
