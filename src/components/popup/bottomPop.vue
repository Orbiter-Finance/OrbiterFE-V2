<template>
  <div>
    <div :class="{'CustomPopup':showCustomPopup}"
         @touchmove.prevent.stop
         @click="maskClick"></div>
    <div class="CustomPopupContent "
         @click="maskClick"
         :class="{'CustomPopupContentShow':showCustomPopup}">
      <slot name="PoperContent"
            class="stopPenetrate"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showCustomPopup: false,
    };
  },
  methods: {
    showCustom() {
      this.showCustomPopup = true;
      document.body.className = "noScroll"
    },
    maskClick() {
      this.showCustomPopup = false;
      document.body.className = "scroll"
    }
  }
}
</script>

<style scoped>
.CustomPopup {
  height: 100%;
  height: calc(var(--vh, 1vh) * 100);
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  /* background: transparent; */
}

.CustomPopupContent {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
  transform: translateY(100%);
  z-index: 3000;
}

.CustomPopupContentShow {
  transform: translateY(0);
}
</style>