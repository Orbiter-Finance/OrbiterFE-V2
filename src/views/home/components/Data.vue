<template>
  <div v-if="showData" class="date-wrap fade-content">
    <div class="data-content">
      <div
        class="data-item"
        v-for="(item, index) in dataList"
        :key="item.value + index"
      >
        <div class="value">
          <CountTo
            :startVal="countToStartValue"
            :endVal="item.value"
            :duration="countToDuration"
          />
          {{ item.unit }}
        </div>
        <div class="label">
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
export default {
  components: {
    CountTo,
  },
  props: {
    showData: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      countToStartValue: 999,
      countToDuration: 2000,
      dataList: [
        {
          label: 'Community Members',
          value: 700,
          unit: 'k',
        },
        {
          label: 'Supported Chains',
          value: 17,
          unit: '+',
        },
        {
          label: 'Transaction Volume',
          value: 9,
          unit: '.5M',
        },
        {
          label: 'Transfer amounts',
          value: 9,
          unit: '.6B',
        },
        {
          label: 'Active Users',
          value: 3,
          unit: 'M',
        },
      ],
    }
  },
}
</script>

<style scoped lang="scss">
.date-wrap {
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
}
.data-content {
  display: flex;
  margin: 0 auto;
  justify-content: center;
}
.data-item {
  padding-top: 43px;
  padding-bottom: 32px;
  width: 240px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.value {
  font-size: 64px;
  display: flex;
  justify-content: center;
  font-family: 'Kodchasan-Bold';
  font-weight: bold;
  color: #222222;
}
.label {
  margin-top: 17px;
  font-size: 18px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-weight: 400;
  color: #666666;
}
@media (max-width: 1240px) {
  .date-wrap {
    padding: 0;
    .data-content {
      flex-wrap: wrap;
      justify-content: unset;
    }
    .data-item {
      width: 50%;
      align-items: center;
      .value {
        font-size: 40px;
      }
      .label {
        font-size: 14px;
      }
    }
  }
}
</style>
