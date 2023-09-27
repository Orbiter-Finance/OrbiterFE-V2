<template>
  <div class="stage2-banner-wrap">
    <div class="flow">
      <img class="zk-prover" :src="zkProverBg" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    zkProverBg: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped lang="scss">
.stage2-banner-wrap {
  width: 100%;
  box-sizing: border-box;
  background: #f5f5f5;
  padding: 120px 0 0 0;
  margin: 0 auto;
}
.flow {
  width: 100%;
  position: relative;
  height: 1040px;
  top: -320px;
  z-index: 1;
  .zk-prover {
    width: 100%;
    height: 100%;
    max-width: 1200px;
    max-height: 1040px;
    margin: 0 auto;
    z-index: 1;
  }
}
@media (max-width: 1240px) {
  .stage2-banner-wrap {
    padding: 0 16px;
    .flow {
      height: 370px;
      top: -60px;
    }
  }
}
</style>
