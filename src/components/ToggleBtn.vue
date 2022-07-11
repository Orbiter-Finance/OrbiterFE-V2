<template>
<div class="toggle-btn-box">
  <span @click="toggleTab" :class="['tab-btn-item', {selected: isSenderTab}]">Sender</span>
  <span @click="toggleTab('Maker')" :class="['tab-btn-item', {selected: !isSenderTab}]">Maker</span>
</div>
</template>

<script>
import { isSenderTab } from '../composition/hooks'

export default {
  name: 'ToggleBtn',
  computed: {
    isSenderTab() {
      return isSenderTab()
    }
  },
  methods: {
    toggleTab(target) {
      const tab = typeof target === 'string' && target || 'Sender'
      this.$emit('input', tab)
    },
  }
}
</script>

<style lang="scss" scoped>
.toggle-btn-box {
  width: 229px;
  height: 40px;
  border-radius: 40px;
  .tab-btn-item {
    display: inline-block;
    width: 50%;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
    height: 100%;
    line-height: 40px;
    border-radius: 40px;
    cursor: pointer;
  }
  .tab-btn-item.selected {
    background: #DF2E2D;
    color: #FFFFFF;
    box-shadow: inset 0px -6px 0px rgba(0, 0, 0, 0.16);
  }
}
.app-mobile {
  .toggle-btn-box {
    width: 180px;
  }
}
</style>
