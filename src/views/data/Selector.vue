<template>
  <div class="checker">
    <div
      class="checker-item"
      v-for="(item, index) in data"
      :key="index"
      @click="$emit('change', item)"
      :class="{ active: item.value === value }"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      require: true,
    },
    value: {
      require: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.checker {
  display: flex;
  align-items: center;
  .checker-item {
    width: 40px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: rgba(51, 51, 51, 0.8);
    cursor: pointer;
    &.active {
      background: #f5f5f5;
      border-radius: 8px;
      color: #df2e2d;
      font-weight: 700;
    }
  }
}
</style>
