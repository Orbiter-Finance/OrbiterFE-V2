<template>
  <div class="percent">
    <div
      v-for="(item, i) in data"
      :key="i"
      :style="{
        width: `${(item / total) * 100}%`,
        flex: `0 0 ${(item / total) * 100}}%`,
      }"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      require: true,
    },
  },
  computed: {
    total() {
      return this.data.reduce((t, i) => t + i, 0)
    },
  },
}
</script>

<style lang="scss" scoped>
.percent {
  display: flex;
  height: 12px;
  width: 65px;
  :nth-child(1) {
    background: #df2e2d;
  }
  :nth-child(2) {
    background: rgba(223, 45, 56, 0.8);
  }
  :nth-child(3) {
    background: rgba(223, 45, 56, 0.6);
  }
}
</style>
