<template>
  <img :width="width" :height="width" :src="src" @error="isError = true" />
</template>

<script>
export default {
  data() {
    return {
      isError: false,
    }
  },
  props: {
    name: {
      type: String,
      require: true,
    },
    width: {
      type: Number,
      default: 22,
    },
    height: {
      type: Number,
      default: 22,
    },
  },
  computed: {
    src() {
      if (this.isError) {
        return require('../../assets/data/default-chain.png')
      }
      if (!this.name) {
        return '#'
      }
      const name = this.name.replace(/\s+/g, '').toLowerCase()
      return `${ this.$env.l2BaseUrl }/img/chains/${ name }.png`;
    },
  },
  watch: {
    name() {
      this.isError = false
    },
  },
}
</script>
