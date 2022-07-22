<template>
  <div class="time-diff">
    <img src="../../assets/data/seconds.png" width="14" height="14" />
    {{ timeDiff }}
  </div>
</template>

<script>
import getTimeDiff from '../../util/getTimeDiff'

export default {
  props: {
    timestamp: {
      type: Number,
      require: true,
    },
  },
  computed: {
    timeDiff() {
      if (this.timestamp) {
        return getTimeDiff(this.timestamp)
      }
      return '-'
    },
  },
}
</script>

<style lang="scss" scoped>
.time-diff {
  font-family: 'Inter';
  font-style: normal;
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  color: rgba(51, 51, 51, 0.4);
  img {
    margin-right: 4px;
  }
}
</style>
