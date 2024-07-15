<template>
  <div class="prizes-user" id="prizes-user">
    <div class="user-title"><span>$800,000</span> Prize Pool for Top 100</div>
    <div class="vice-title">
      <span>Top 10</span> get 0 bridging fee with up to <span>$2000</span> extra
      bonus
    </div>

    <div class="user-card">
      <div class="card-title">My data</div>
      <div class="user-info">
        <div class="info-item">
          <div class="info-label">Address</div>
          <div class="info-value">0x033a...823ac3</div>
        </div>
        <div class="info-item">
          <div class="info-label">Rank</div>
          <div class="info-value">3,492</div>
        </div>
        <div class="info-item">
          <div class="info-label">Cumulative</div>
          <div class="info-value">92 Tx</div>
        </div>
        <div class="info-item">
          <div class="info-label">Estimated earnings</div>
          <div class="info-value">--</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../../../components/SvgIcon/SvgIcon.vue'
import SvgIconThemed from '../../../components/SvgIconThemed.vue'
export default {
  components: { SvgIcon, SvgIconThemed },
  name: 'PrizesUser',
}
</script>

<style lang="scss" scoped>
.prizes-user {
  width: 100%;
  margin-top: 80px;
  .user-title {
    font-size: 48px;
    font-family: GeneralSans-SemiBold;
    line-height: 56px;
    letter-spacing: 0px;
    span {
      color: #f3ba2f;
    }
  }

  .vice-title {
    width: 100%;
    margin-top: 24px;
    font-size: 20px;
    font-family: GeneralSans-Medium;
    line-height: 27px;
    letter-spacing: 0px;
    span {
      color: #f3ba2f;
    }
  }

  .user-card {
    width: 100%;
    margin-top: 32px;
    padding: 32px;
    background-image: url('../../../assets/prizes/v2/user-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .card-title {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 24px;
      font-family: GeneralSans-SemiBold;
      line-height: 32px;
      letter-spacing: 0px;
    }

    .user-info {
      width: 100%;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .info-item {
        .info-label {
          color: #f3ba2f;
          text-align: left;
          font-size: 18px;
          font-family: GeneralSans-Medium;
          line-height: 32px;
          letter-spacing: 0px;
        }
        .info-value {
          font-size: 32px;
          font-family: GeneralSans-SemiBold;
          line-height: 40px;
          letter-spacing: 0px;
        }
      }
    }
  }
}

@media (max-width: 740px) {
  #prizes-user {
    width: 100%;
  }
}
</style>
