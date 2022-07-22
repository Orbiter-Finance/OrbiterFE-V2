<template>
  <div class="rollups">
    <div
      class="rollup"
      v-for="item in rollups"
      :key="item.value"
      :class="{ active: value === item.value }"
      @click="$emit('rollup-change', item.value)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script>
const rollups = [
  { label: 'Arbitrum', value: 'arbitrum' },
  { label: 'Optimism', value: 'optimism' },
  { label: 'zkSync', value: 'zksync' },
]
export default {
  props: {
    value: {
      require: true,
    },
  },
  data() {
    return {
      rollups,
    }
  },
}
</script>

<style lang="scss" scoped>
.rollups {
  display: flex;
  .rollup {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 83px;
    height: 32px;
    background: #f5f5f5;
    border-radius: 20px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    margin-right: 10px;
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
    &.active {
      font-weight: 700;
      color: #ffffff;
      background: #df2e2d;
    }
  }
}
</style>
