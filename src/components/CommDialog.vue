<template>
  <div>
    <div :class="{'CommDialog':showCommDialog}"
         @touchmove.prevent.stop
         @click="maskClick"></div>
    <div @click="maskClick"
         :class="{'CommDialogContentShow':showCommDialog}" class="CommDialogContent ">
      <slot name="PoperContent" class="stopPenetrate"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showCommDialog: false,
    };
  },
  methods: {
    showCustom() {
      this.showCommDialog = true;
      document.body.className = "noScroll"
    },
    maskClick() {
      this.showCommDialog = false;
      // document.body.className = "scroll"
    }
  }
}
</script>

<style scoped>
.CommDialog {
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

.CommDialogContent {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
  transform: translateY(100%);
  z-index: 3000;
}

.CommDialogContentShow {
  transform: translateY(0);
}
</style>
