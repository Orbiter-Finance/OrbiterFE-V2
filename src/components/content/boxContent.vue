<template>
  <div class="o-box-content">
    <slot></slot>
  </div>
</template>

<script>

export default {
  name: 'o-box-content',
  props: {
  },
  data() {
    return {
    }
  },
  mounted() {

  },
  watch: {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.o-box-content {
  position: relative;
  border-width: 0.15rem 0.25rem 0.5rem 0.25rem;
  border-color: black;
  border-style: solid;
  border-radius: 2rem;
  padding: 1rem;
  background-image: url("../../assets/contentBox/contentTopBg.svg");
  background-size: 100% 45%;
  background-repeat: no-repeat;
  box-shadow: 0 1.8rem 2rem -1rem rgba(248, 95, 83, 0.3);
}
</style>
