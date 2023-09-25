<template>
  <div v-if="showData" class="date-wrap fade-content">
    <div class="data-content">
      <div class="data-item" v-for="item in dataList" :key="item.value">
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
      countToStartValue: 0,
      countToDuration: 3000,
      dataList: [
        {
          label: 'Media',
          value: 480,
          unit: 'k',
        },
        {
          label: 'Chains supported',
          value: 17,
          unit: '+',
        },
        {
          label: 'Transaction couns',
          value: 16,
          unit: 'M',
        },
        {
          label: 'Transfer amounts',
          value: 6.8,
          unit: 'B',
        },
        {
          label: 'Total Users',
          value: 1.2,
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
  opacity: 0;
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
  font-family: OpenSans-Regular, OpenSans;
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
