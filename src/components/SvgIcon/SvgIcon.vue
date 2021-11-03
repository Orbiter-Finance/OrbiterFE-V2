<template>
  <svg>
    <use :xlink:href="`#icon-${iconName}`" />
  </svg>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      require: true
    }
  }
}
</script>