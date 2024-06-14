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
          <div class="info-label">Total O-Points
            <div class="time-refresh-mobile">
              <svg-icon class="clock" iconName="clock"></svg-icon> 42m ago
            </div>
          </div>
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
            <img
              class="user-image"
              :src="require('../../assets/activity/orbiter-user.png')"
              alt=""
            />
            My Account
          </div>
          <div class="basic-points">240</div>
          <div class="activity-points">5,123</div>
          <div class="ecosystem-points">6,123</div>
          <div class="total-points">12,138</div>
        </div>
        <div class="ranking-list-group">
          <div
            :key="index"
            v-for="(item, index) in new Array(100).fill(0)"
            class="rank-list-card-item"
          >
            <div class="ranking">
              <div class="ranking-value"
              :style="rankingStyle(index+1)"
              >{{ index+1 }}</div>
            </div>
            <div class="user-address">0x024a...49ac41</div>
            <div class="basic-points">240</div>
            <div class="activity-points">5,123</div>
            <div class="ecosystem-points">6,123</div>
            <div class="total-points">12,138</div>
          </div>
        </div>

        <div class="pagination-group">
          <el-pagination
            :page-size="20"
            @current-change="curChange"
            class="rank-pagination"
            layout="prev, pager, next"
            :current-page="1"
            :total="len"
          >
          </el-pagination>
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
  data() {
    return {
      current: 1,
      len: 10000
    }
  },
  computed: {
    OPointsCardModalShow() {
      return OPointsCardModalShow.value
    },
  },
  methods: {
    curChange(cur) {
      this.current = cur
    },
    close() {
      setOPointsCardModalShow(false)
    },
    rankingStyle(rankValue) {
      const key = Number(rankValue)
      const list = [
        'background: linear-gradient(180.00deg, rgb(255, 222, 155),rgb(243, 169, 19) 100%);',
        'background: linear-gradient(180.00deg, rgb(240, 254, 255),rgb(190, 190, 190) 100%);',
        'background: linear-gradient(180.00deg, rgb(233, 179, 135),rgb(197, 133, 81) 100%);',
      ]
      const base = 'width:24px;height:24px;border-radius:50%;'
      let value = ''
      switch (key) {
        case 1:
          value = list[0]
          break
        case 2:
          value = list[1]
          break
        case 3:
          value = list[2]
          break
        default:
          value = ''
          break
      }
      return value ? base + value : value
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
      border-radius: 16px 16px 0 0;
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
        position: relative;
        top: 0;
        left: 0;
        z-index: 1;
        .info-label {
          width: 100%;
          color: rgb(255, 255, 255);
          font-family: GeneralSans-Semibold;
          font-size: 16px;
          font-weight: 500;
          line-height: 20px;
          letter-spacing: 0px;
          display: flex;
          justify-content: start;
          align-items: center;
          .time-refresh-mobile {
            display: none;
            margin-left: 12px;
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
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          letter-spacing: 0px;

          font-family: GeneralSans-Semibold;

          .total-user {
            display: flex;
            justify-content: start;
            align-items: center;
            margin-right: 12px;
            white-space: nowrap;
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
            white-space: nowrap;
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
      color: #222222;
      font-size: 14px;
      font-weight: 500;
      line-height: 19px;
      letter-spacing: 0px;
      font-family: GeneralSans-Medium;

      .rank-list-header {
        font-size: 12px;
        font-weight: 400;
        color: #666666;
        font-family: GeneralSans-Regular;
      }

      .ranking-list-group {
        width: 100%;
        max-height: 400px;
        overflow: auto;
      }

      .rank-list-card-item {
        width: 100%;
        padding: 0 10px;
        height: 44px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .ranking {
          width: 80px;
          white-space: nowrap;
          letter-spacing: 0px;
          display: flex;
          justify-content: center;
          align-items: center;
          .ranking-value {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
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

      .pagination-group {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 12px;
      }
    }
  }
}

::v-deep .rank-pagination .btn-next {
  background: transparent;
  color: #999999;
}
::v-deep .rank-pagination .el-pager .number {
  background: transparent;
  color: #999999;
}
::v-deep .rank-pagination .el-pager .more {
  background: transparent;
  color: #999999;
}
::v-deep .rank-pagination .btn-prev {
  background: transparent;
  color: #999999;
}

::v-deep .rank-pagination .el-pager .number.active {
  border: 1px solid rgb(238, 238, 238);
  border-radius: 4px;
  background: rgb(245, 245, 245);
  color: #222222;
}

@media (max-width: 760px) {
  #o-points-card-modal {
    align-items: flex-end;
    .card-content {
      border-radius: 16px 16px 0 0;
      .top {
        .info {
          .info-label{
            .time-refresh-mobile {
              display: flex;
            }
          }
          .total-amount {
            flex-wrap: wrap;
            .total-user,
            .total-user-amount {
              width: 100%;
            }
          }
          .total-options-amount {
            .time-refresh {
              display: none;
            }
          }
        }
        .top-banner-image {
          width: 183px;
          height: 198px;
          top: 40px;
          right: -20px;
        }
      }
      .table {
        .rank-list-card-item {
          .basic-points,
          .activity-points,
          .ecosystem-points {
            display: none;
          }
        }
        .ranking-list-group {
          max-height: 200px;
        }
      }

      .pagination-group {
        padding: 8px 0 12px;
      }
    }
  }
}
</style>
