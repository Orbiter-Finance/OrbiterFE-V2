<template>
  <div class="selector">
    <div
      class="selector-item"
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
<style lang="scss">
.selector {
  display: flex;
  align-items: center;
  .selector-item {
    width: 40px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-style: normal;
    font-family: 'Inter Regular';
    font-weight: 400;
    font-size: 14px;
    color: rgba(51, 51, 51, 0.8);
    cursor: pointer;
    &.active {
      font-family: 'Inter Bold';
      background: #f5f5f5;
      border-radius: 8px;
      color: #df2e2d;
      font-weight: 700;
    }
  }
}
.dark-body,
.dark-theme {
  .selector {
    .selector-item {
      color: rgba(255, 255, 255, 0.6);
      &.active {
        background: #3f415b;
        color: #df2e2d;
      }
    }
  }
}
</style>
