<template>
  <svg class="svg">
    <use :xlink:href="`#icon-${iconName}`" />
  </svg>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      require: true
    },
    // className: {
    //   type: String,
    //   default: ''
    // },
  }
}
</script>
<style lang="scss">
.svg {
  outline: none;
  fill: currentColor;
}
</style>



