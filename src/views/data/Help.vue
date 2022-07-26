<template>
  <span class="help"> </span>
</template>

<style lang="scss" scoped>
.help {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-image: url('../../assets/data/help.png');
  background-size: 10px 10px;
}
.dark-body,
.dark-theme {
  .help {
    background-image: url('../../assets/data/help-dark.png');
  }
}
</style>
