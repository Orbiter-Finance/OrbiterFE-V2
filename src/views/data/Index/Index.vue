<template>
  <div class="l2data">
    <Chart />
  </div>
</template>

<script>
import Chart from './Chart'
export default {
  components: {
    Chart,
  },
}
</script>

<style lang="scss" scoped>
.l2data {
  max-width: 1120px;
  margin: 0 auto;
}
</style>
