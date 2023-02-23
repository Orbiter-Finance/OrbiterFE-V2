<template>
  <img
    class="dapp-logo"
    :width="width"
    :height="width"
    :src="src"
    @error="onError"
  />
</template>

<script>
import env from "../../../env";

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
    chains: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    src() {
      if (this.isError) {
        return require('../../assets/data/default-dapp.png')
      }
      if (!this.name) {
        return '#'
      }

      const name = this.name.replace(/\s+/g, '').toLowerCase()
      if (['apex'].includes(name)) {
        return require('../../assets/data/apex.png')
      }
      if (this.chains) {
        return `${ this.$env.l2BaseUrl }/img/chains/${ name }.png`;
      } else {
        return `${ this.$env.l2BaseUrl }/img/dapps/${ name }.png`;
      }
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
<style>
.dapp-logo {
  border-radius: 50%;
}
</style>
