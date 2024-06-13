<template>
  <div
    id="o-points-card-modal"
    class="o-points-card-modal"
    :style="`display: ${OPointsCardModalShow ? 'flex' : 'none'}`"
  >
    <div class="card-content">
      <div class="top">
        <div class="title">
          <div class="label">O-Points Leaderboard</div>
          <div @click="close" class="close">
            <svg-icon iconName="close" class="close-icon"></svg-icon>
          </div>
        </div>
        <div class="info">
          <div class="info-label">Total O-Points</div>
          <div class="total-options-amount">
            192,102,840
            <div class="time-refresh">
              <svg-icon class="clock" iconName="clock"></svg-icon> 42m ago
            </div>
          </div>
          <div class="total-amount">
            <div class="total-user">
              Total Users:
              <div class="total-user-amount">3,880,000</div>
            </div>
            <div class="total-user-opoints">
              Top 1% Address:
              <div class="total-user-opoints-amount">>800 Points</div>
            </div>
          </div>
        </div>

        <div class="top-banner-image"></div>
      </div>
      <div class="table">
        <div class="rank-list-card-item rank-list-header">
          <div class="ranking">Rank</div>
          <div class="user-address">User</div>
          <div class="basic-points">Basic Points</div>
          <div class="activity-points">Activity Points</div>
          <div class="ecosystem-points">Ecosystem Points</div>
          <div class="total-points">Total Points</div>
        </div>
        <div class="rank-list-card-item my-rank-card">
          <div class="ranking">1,234,567</div>
          <div class="user-address">
            <img class="user-image" :src="require('../../assets/activity/orbiter-user.png')" alt="">
            My Account</div>
          <div class="basic-points">240</div>
          <div class="activity-points">5,123</div>
          <div class="ecosystem-points">6,123</div>
          <div class="total-points">12,138</div>
        </div>
        <div class="rank-list-card-item">
          <div class="ranking">1,234,567</div>
          <div class="user-address">0x024a...49ac41</div>
          <div class="basic-points">240</div>
          <div class="activity-points">5,123</div>
          <div class="ecosystem-points">6,123</div>
          <div class="total-points">12,138</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  setOPointsCardModalShow,
  OPointsCardModalShow,
} from '../../composition/hooks'
import SvgIcon from '../SvgIcon/SvgIcon.vue'
export default {
  components: { SvgIcon },
  name: 'OPointsRankingCard',
  computed: {
    OPointsCardModalShow() {
      return OPointsCardModalShow.value
    },
  },
  methods: {
    close() {
      setOPointsCardModalShow(false)
    },
  },
}
</script>

<style lang="scss" scoped>
.o-points-card-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(255, 255, 255);
  text-align: left;
  .card-content {
    width: 100%;
    max-width: 752px;
    border-radius: 16px;
    overflow: hidden;
    .top {
      width: 100%;
      background-image: url(../../assets/activity/ranking_bg.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 16px;
      border: 16px 16px 0 0;
      position: relative;
      top: 0;
      left: 0;
      .title {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .label {
          font-family: GeneralSans-Medium;
          font-size: 18px;
          font-weight: 600;
          line-height: 24px;
          letter-spacing: 0px;
        }

        .close {
          width: 24px;
          height: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgb(34, 34, 34);
          border-radius: 4px;
          cursor: pointer;
          position: relative;
          top: 0;
          left: 0;
          z-index: 2;
          &:hover {
            background-color: #999999;
          }
          .close-icon {
            width: 16px;
            height: 16px;
          }
        }
      }

      .info {
        width: 100%;
        margin-top: 20px;
        .info-label {
          width: 100%;
          color: rgb(255, 255, 255);
          font-family: GeneralSans-Semibold;
          font-size: 16px;
          font-weight: 500;
          line-height: 20px;
          letter-spacing: 0px;
        }
        .total-options-amount {
          display: flex;
          justify-content: start;
          align-items: flex-end;
          margin-top: 4px;
          color: rgb(255, 217, 139);
          font-family: GeneralSans-Bold;
          font-size: 32px;
          font-weight: 700;
          line-height: 43px;
          letter-spacing: 0px;
          .time-refresh {
            margin-left: 16px;
            color: #b6b6b6;
            font-family: GeneralSans-Regular;
            font-size: 12px;
            font-weight: 500;
            line-height: 16px;
            letter-spacing: 0px;
            padding: 4px 0;
            display: flex;
            justify-content: start;
            align-items: center;
            .clock {
              width: 16px;
              height: 16px;
              margin-right: 2px;
            }
          }
        }

        .total-amount {
          width: 100%;
          display: flex;
          justify-content: start;
          align-items: center;
          margin-top: 12px;
          font-size: 15px;
          font-weight: 600;
          line-height: 20px;
          letter-spacing: 0px;

          font-family: GeneralSans-Semibold;

          .total-user {
            display: flex;
            justify-content: start;
            align-items: center;
            margin-right: 12px;

            .total-user-amount {
              color: #ffd98b;
              font-family: GeneralSans-Medium;
              margin-left: 4px;
            }
          }
          .total-user-opoints {
            display: flex;
            justify-content: start;
            align-items: center;
            margin-right: 12px;

            .total-user-opoints-amount {
              color: #ffd98b;
              font-family: GeneralSans-Medium;
              margin-left: 4px;
            }
          }
        }
      }

      .top-banner-image {
        width: 246px;
        height: 264px;
        position: absolute;
        top: 10px;
        right: 0;
        background-image: url(../../assets/activity/ranking-banner-image.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }

    .table {
      position: relative;
      top: 0;
      left: 0;
      z-index: 2;
      background-color: #fff;
      width: 100%;
      height: 500px;
      color: #222222;
      font-size: 14px;
      font-weight: 500;
      line-height: 19px;
      letter-spacing: 0px;
      font-family: GeneralSans-Medium;

      .rank-list-card-item {
        width: 100%;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .ranking {
          width: 80px;
          white-space: nowrap;
          letter-spacing: 0px;
        }

        .user-address {
          width: 132px;
          white-space: nowrap;
          letter-spacing: 0px;
          display: flex;
          justify-content: start;
          align-items: center;
          .user-image {
            width: 24px;
            height: 24px;
            margin-right: 4px;
          }
        }

        .basic-points {
          width: 132px;
          white-space: nowrap;
          letter-spacing: 0px;
        }

        .activity-points {
          width: 132px;
          white-space: nowrap;
          letter-spacing: 0px;
        }

        .ecosystem-points {
          width: 132px;
          white-space: nowrap;
          letter-spacing: 0px;
        }

        .total-points {
          flex: 1;
          text-align: right;
          white-space: nowrap;
          letter-spacing: 0px;
        }
      }

      .my-rank-card {
        background: rgba(255, 217, 139, 0.2);
      }

      .rank-list-header {
        font-size: 12px;
        font-weight: 400;
        color: #666666;
        font-family: GeneralSans-Regular;
      }
    }
  }
}
</style>
