<template>
  <div class="target-wrap fade-content">
    <div class="title" :style="{ 'background-image': `url(${titleBg}` }">
      Our Target .
    </div>
    <div class="desc">
      We intend to be able to initiate cross-rollups transactions，enhancing
      Ethereum inter-chain interoperability, and keep rollups synchronized with
      the main network in real time. Also we devoted to minimize chain-related
      gas consumption with advanced techonology.
    </div>
    <div class="desc-keynote">
      Our Future for Ethereum Layer 2 Infrastructure Awaits.
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
          desc: 'inter-chain interoperability',
        },
        {
          icon: this.lowCost,
          label: 'Low-cost',
          desc: 'Worthless Fees of universal service',
        },
        {
          icon: this.scalability,
          label: 'Scalability',
          desc: 'Etheruem + rollups synchronously',
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
  font-family: OpenSans-Regular, OpenSans;
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
  font-family: OpenSans-Regular, OpenSans;
  font-weight: 400;
  color: #666666;
}
@media (max-width: 1240px) {
  .target-wrap {
    margin-top: 0;
    padding: 0 16px;
    max-width: 350px;
    width: max-content;
    .title {
      font-size: 36px;
      background-size: 200px 11px;
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
