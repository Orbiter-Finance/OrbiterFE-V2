<template>
  <img :width="width" :height="width" :src="src" @error="onError" />
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
        return require('../../assets/data/default-rollup.png')
      }
      if (!this.name) {
        return '#'
      }
      const name = this.name.replace(/\s+/g, '').toLowerCase()
      return `${ this.$env.l2BaseUrl }/img/rollups/${ name }.png`;
    },
  },
  watch: {
    name() {
      this.isError = false
    },
  },
  methods: {
    onError() {
      this.isError = true
    },
  },
}
</script>
