<template>
  <div class="prizes-user" id="prizes-user">
    <div class="title-group">
      <div class="user-title"><span>$800,000</span> Prize Pool for Top 100</div>
    </div>
    <div class="title-group">
      <div class="vice-title">
        <span>Top 10</span> get 0 bridging fee with up to
        <span>$2000</span> extra bonus
      </div>
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
  .title-group {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
    margin-top: 32px;
    .title-group {
      width: 100%;
    }
    .user-title {
      width: 80%;
      font-size: 24px;
      line-height: 28px;
    }
    .vice-title {
      margin-top: 16px;
      width: 80%;
      font-size: 16px;
      line-height: 20px;
    }

    .user-card {
      margin-top: 16px;
      padding: 16px;
      .card-title {
        font-size: 16px;
        line-height: 20px;
      }

      .user-info {
        margin-top: 8px;
        display: block;

        .info-item {
          margin-top: 4px;
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          .info-label {
            font-size: 14px;
            line-height: 18px;
          }
          .info-value {
            flex: 1;
            text-align: right;
            font-size: 20px;
            line-height: 24px;
          }
        }
      }
    }
  }
}
</style>
