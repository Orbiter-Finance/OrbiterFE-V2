<template>
  <div class="loading-wrapper" v-show="show">
    <div class="loading">
      <img class="logo" src="../../../assets/data/loading.png" />
      <img class="loader" src="../../../assets/data/loader.png" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
  },
}
</script>

<style scoped lang="scss">
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999999;
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 160px;
    height: 160px;
    background: rgba(51, 51, 51, 0.8);
    border-radius: 20px;
    .logo {
      position: absolute;
      height: 28px;
      width: 30px;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
    .loader {
      width: 60px;
      height: 60px;
      animation: rotating 2s linear infinite;
    }
    @keyframes rotating {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(1turn);
      }
    }
  }
}
</style>
