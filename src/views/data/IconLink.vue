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
  width: 16px;
  height: 16px;
  background-image: url('../../assets/data/link.png');
  background-size: 16px 16px;
}
.dark-body,
.dark-theme {
  .link {
    background-image: url('../../assets/data/link-dark.png');
  }
}
</style>
