<template>
  <div :class="isPool ? 'prizes-card mt-20' : 'prizes-card mt-8'"
  >
    <img
      class="card-left"
      :src="require('../../../assets/prizes/card-left.png')"
      alt=""
    />
    <img
      class="card-right"
      :src="require('../../../assets/prizes/card-right.png')"
      alt=""
    />
    <img
      v-if="isPool"
      class="card-top"
      :src="require('../../../assets/prizes/card-top.png')"
      alt=""
    />

    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    isPool: Boolean,
  },
  name: 'PrizesCard',
}
</script>

<style scoped lang="scss">
.prizes-card {
  width: 100%;
  border: 4px solid rgb(69, 35, 48);
  position: relative;
  top: 0;
  left: 0;
  padding: 32px;
  .card-top {
    position: absolute;
    top: -4px;
    left: 50%;
    width: 197px;
    height: 48px;
    transform: translate(-50%, -100%);
  }
  .card-left {
    position: absolute;
    top: -24px;
    left: -4px;
    width: 37px;
    height: 36px;
  }
  .card-right {
    position: absolute;
    top: -24px;
    right: -4px;
    width: 37px;
    height: 36px;
  }
}
.mt-20 {
    margin-top: 80px;
    background: radial-gradient(
        28% 50% at 50% 0%,
        rgba(255, 70, 68, 0.5),
        rgba(30, 20, 14, 0) 99.575%
      ),
      linear-gradient(180deg, rgb(75, 21, 10) -39.024%, rgb(30, 20, 14) 78.021%);
}
.mt-8 {
    margin-top: 32px;
    background: radial-gradient(96.00% 96.00% at 50% 50%,rgba(27, 21, 37, 0) 1.849%,rgba(255, 70, 68, 0.2) 100%),rgb(18, 4, 30);
}
</style>
