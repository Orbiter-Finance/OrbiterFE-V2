<template>
  <div id="account-top" class="account-top">
    <div class="account-info-group">
      <div class="account-info">
        <div>1111</div>
        <div class="user-info">
          <div class="info">111111</div>
          <div class="chain">222222</div>
        </div>
      </div>
      <div class="disconnect-btn">
        <img
          class="disconnect-icon"
          :src="require('../../../assets/headerAccount/disconnect.svg')"
          alt=""
        />
      </div>
    </div>
    <div class="option-label">Total O-Points</div>
    <div class="option-reward-group">
      <div class="option-info">
        <div class="amount">120</div>
        <img
          class="options-card"
          :src="require('../../../assets/headerAccount/card-default.png')"
          alt=""
        />
      </div>
      <div class="reward-card">
        <div class="reward-token-card">
          <img
            class="token-icon"
            :src="require('../../../assets/headerAccount/ORB-token.png')"
            alt=""
          />
          Reward
        </div>
        <div class="details-card">Details</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountTop',
}
</script>

<style lang="scss" scoped>
.account-top {
  width: 100%;
  padding: 16px;
  background-image: url('../../../assets/headerAccount/top-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-color: #000;
  border: 16px 0 0 0;

  .account-info-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .account-info {
      display: flex;
      justify-content: start;
      align-items: center;
      text-align: left;
      .user-info {
        letter-spacing: 0px;
        margin-left: 8px;
        .address {
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
        }
        .chain {
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
        }
      }
    }

    .disconnect-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      .disconnect-icon {
        width: 22px;
        height: 22px;
      }
    }
  }

  .option-label {
    width: 100%;
    margin-top: 8px;
    text-align: left;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0px;
    color: #999999;
  }

  .option-reward-group {
    width: 100%;
    margin-top: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .option-info {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .amount {
        font-size: 32px;
        font-weight: 800;
        line-height: 44px;
        margin-right: 12px;
      }
      .options-card {
        width: 20px;
        height: 28px;
      }
    }

    .reward-card {
      display: flex;
      justify-content: flex-end;
      justify-items: center;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: 0px;

      .reward-token-card {
        padding: 8px;
        border: 1px solid rgb(242, 185, 255);
        border-radius: 8px;
        box-shadow: inset 0px 0px 8px 0px rgb(242, 185, 255);
        backdrop-filter: blur(8px);
        background: rgba(242, 185, 255, 0.1);
        margin-right: 8px;
        color: #f2b9ff;
        display: flex;
        justify-content: center;
        align-items: center;
        .token-icon {
          width: 20px;
          height: 20px;
          margin-right: 4px;
        }
      }

      .details-card {
        padding: 8px 24px;
        border: 1px solid rgb(219, 239, 45);
        border-radius: 8px;
        box-shadow: inset 0px 0px 8px 0px rgb(219, 239, 45),
          0px 0px 4px 0px rgba(219, 239, 45, 0.4);
        backdrop-filter: blur(8px);
        background: rgba(219, 239, 45, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #dbef2d;
      }
    }
  }
}
</style>
