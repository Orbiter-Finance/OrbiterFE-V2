<template>
  <div class="global-tg-card"
  :style="`display: ${isMobile ? 'none': 'block'}`"
  >
    <img :src="require('../assets/tg.png')" alt="telegram" class="card-code">
    <div class="card-label">@orbiterORB</div>
  </div>
</template>

<script>
import { isMobile } from '../composition/hooks';
export default {
  name: 'GlobalTgCard',
  computed: {
    isMobile() {
      return isMobile.value
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes card-rotate {
  0%,
  84%,
  88%,
  92%,
  96%,
  100% {
    transform: rotate(0);
  }
  86%,
  94% {
    transform: rotate(-15deg);
  }
  90%,
  98% {
    transform: rotate(15deg);
  }
}
.global-tg-card {
  position: fixed;
  bottom: 32px;
  left: 32px;
  width: 112px;
  height: 188px;
  padding: 8px;
  background-image: url('../assets/tg-card.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  animation: card-rotate 4s;
  -webkit-animation: card-rotate 4s;
  .card-code {
    width: 96px;
    height: 96px;
    margin-top: 48px;
  }
  .card-label {
    background-color: #df2e2e;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    border-radius: 4px;
  }
}
</style>
