<template>
  <div id="header-account-dialog" class="header-account-dialog">
    <div class="close-card">
      <div class="close-btn">
        <img class="img" :src="require('../../assets/activity/right.png')" />
      </div>
    </div>
    <div class="account-card">
        <AccountTop></AccountTop>
        <AccountQuests></AccountQuests>
    </div>
  </div>
</template>

<script>
import AccountTop from "./components/AccountTop.vue"
import AccountQuests from "./components/AccountQuests.vue"
export default {
  name: 'HeaderAccountDialog',
  components: {
    AccountTop,
    AccountQuests
  }
}
</script>

<style lang="scss" scoped>
.header-account-dialog {
  position: fixed;
  top: 0;
  right: 0;
  width: 460px;
  height: 100%;
  z-index: 1200;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 16px 0px 0px 16px;
  background: rgb(245, 245, 245);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #FFF;
  .close-card {
    width: 42px;
    padding-top: 24px;
    height: 100%;
    cursor: pointer;
    .close-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      .img {
        width: 24px;
        height: 24px;
      }
    }
  }

  .account-card {
    flex: 1;
    height: 100%;
    border-radius: 16px 0px 0px 16px;

    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.05);
    background: rgb(255, 255, 255);
  }
}
</style>
