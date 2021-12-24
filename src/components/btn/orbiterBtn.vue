<template>
  <div class="o-button"
       :style="{width:width,height:height}">
    <button :style="{background:btnBgc,color:btnColor,fontSize:fontSize,boxShadow:boxShadow}"
            @click="handleClick"
            :disabled='isDisabled'
            class="obtn">
      <label class="btnText">
        <slot></slot>
      </label>
    </button>
  </div>
</template>

<script>

export default {
  name: 'o-button',
  props: {
    btnBgc: {
      type: String,
      default: 'radial-gradient(at 50% 0,#FE7E6E, #EC201E)'
    },
    btnColor: {
      type: String,
      default: '#fff'
    },
    width: {
      type: String,
      default: '10rem'
    },
    height: {
      type: String,
      default: '2.2rem'
    },
    fontSize: {
      type: String,
      default: '0.8rem'
    },
    boxShadow: {
      type: String,
      default: '0px 0.8rem 1.2rem 0px rgba(228,22,22,0.4)'
    },
    isDisabled: {
      type: String,
      default: null
    }
  },
  data() {
    return {
    }
  },
  mounted() {

  },
  watch: {
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.o-button {
  background-color: transparent;
  border-width: 0.1rem;
  border-color: black;
  border-style: solid;
  box-sizing: border-box;
  border-radius: 2rem;
  position: relative;
  display: flex;
  .obtn {
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0.3rem;
    border-radius: 2rem;
    border: 0;
  }
  .obtn:disabled {
    background: radial-gradient(at 50% 0, #d0cbca, #776e6e) !important;
    box-shadow: 0px 0.8rem 1.2rem 0px rgba(151, 144, 143, 0.4) !important;
  }
}
</style>
