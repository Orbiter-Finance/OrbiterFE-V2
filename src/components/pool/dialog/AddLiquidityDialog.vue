<template>
  <div class="add-liquidity-dialog" v-if="AddLiquidityVisible">
    <div class="maker-title">About Maker</div>
    <div class="maker-content">
      <div>
        Orbiter's Maker provides liquidity for Layer 2 and benefits from it.
      </div>
      <div @click="clickLearnMore" class="maker-link">LEARN MORE</div>
      <div class="maker-foot-btn">COMING SOON</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddLiquidityDialog',
  props: { AddLiquidityVisible: Boolean },
  data() {
    return {
      //   visible: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.add-liquidity-dialog {
  border-radius: 20px;
  padding: 34px 40px;
  text-align: left;
  .maker-title {
    font-weight: 700;
    font-size: 20px;
    line-height: 20px;
  }
  .maker-content {
    font-family: 'Inter Regular';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    margin-top: 30px;
    .maker-link {
      margin-top: 20px;
      color: #df2e2d;
    }
    .maker-link:hover {
      text-decoration: underline;
      cursor: pointer;
    }
    .maker-foot-btn {
      height: 50px;
      box-shadow: inset 0px -8px 0px rgba(0, 0, 0, 0.16);
      border-radius: 40px;
      font-weight: 700;
      font-size: 20px;
      line-height: 20px;
      color: #fff;
      margin-top: 40px;
      text-align: center;
      line-height: 50px;
      font-family: 'Inter Bold';
    }
  }
}
</style>
