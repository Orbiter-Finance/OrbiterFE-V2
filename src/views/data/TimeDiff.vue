<template>
  <div class="time-diff">
    <span class="icon"></span>
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
  font-style: normal;
  font-family: 'Inter Regular';
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  color: rgba(51, 51, 51, 0.4);
  .icon {
    display: inline-block;
    height: 14px;
    width: 14px;
    margin-right: 4px;
    background-image: url('../../assets/data/seconds.png');
    background-size: 14px 14px;
  }
}
.dark-theme {
  .time-diff {
    color: rgba(255, 255, 255, 0.4);
  }
  .icon {
    background-image: url('../../assets/data/seconds-dark.png');
  }
}
</style>
