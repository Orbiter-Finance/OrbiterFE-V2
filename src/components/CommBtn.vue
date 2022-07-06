<template>
  <span @click="$emit('click')" :class="['comm-btn', { disabled }]">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'CommBtn',
  props: {
    disabled: Boolean
  }
}
</script>

<style scoped lang="scss">
.comm-btn {
  height:40px;
  background:#DF2E2D;
  box-shadow: inset 0px -6px 0px rgba(0, 0, 0, 0.16);
  border-radius: 20px;
  padding: 8px 24px;
  text-align:center;
  color:white;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  cursor:pointer;
  display: inline-block;
}
.comm-btn:not(.disabled):hover {
  background: #CA2221;
}
.comm-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
