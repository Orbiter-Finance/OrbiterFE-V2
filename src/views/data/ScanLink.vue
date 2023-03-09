<template>
  <a class="link" :style="style" :href="href" target="_blank"> </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
    },
    width: {
      type: Number,
      default: 12,
    },
    height: {
      type: Number,
      default: 12,
    },
  },
  computed: {
    style() {
      const width = this.width
      const height = this.height
      return {
        width: `${width}px`,
        height: `${height}px`,
        'background-size': `${width}px ${height}px`,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.link {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-image: url('../../assets/data/export.png');
  background-size: 12px 12px;
}
.dark-body,
.dark-theme {
  .link {
    background-image: url('../../assets/data/export-dark.png');
  }
}
</style>
