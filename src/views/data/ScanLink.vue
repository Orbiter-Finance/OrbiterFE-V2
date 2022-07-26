<template>
  <a class="link" :href="href" target="_blank"> </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
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
