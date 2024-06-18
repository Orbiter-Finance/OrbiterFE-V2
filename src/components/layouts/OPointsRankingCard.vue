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
          <div class="info-label">
            Total O-Points
            <div class="time-refresh-mobile">
              <svg-icon class="clock" iconName="clock"></svg-icon> {{ timeMin() }}m ago
            </div>
          </div>
          <div class="total-options-amount">
            {{ decimalNumC(totalPoint, 2, ",") }}
            <div class="time-refresh" >
              <svg-icon class="clock" iconName="clock"></svg-icon> {{ timeMin() }}m ago
            </div>
          </div>
          <div class="total-amount">
            <div class="total-user">
              Total Users:
              <div class="total-user-amount">{{ decimalNumC(addressCount, 2, ",") }}</div>
            </div>
            <div class="total-user-opoints">
              Top 1% Address:
              <div class="total-user-opoints-amount">≥{{ decimalNumC(ratePoint, 2, ",") }} Points</div>
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
          <div class="ranking">{{ pointRank }}</div>
          <div class="user-address">
            <img
              class="user-image"
              :src="require('../../assets/activity/orbiter-user.png')"
              alt=""
            />
            My Account
          </div>
          <div class="basic-points">{{ baseOPoint }}</div>
          <div class="activity-points">{{ totalActivityPoint }}</div>
          <div class="ecosystem-points">{{ecosystemPoints }}</div>
          <div class="total-points">{{ currentTotalPoint }}</div>
        </div>
        <div class="ranking-list-group">
          <div
            :key="index"
            v-for="(item, index) in list"
            class="rank-list-card-item"
          >
            <div class="ranking">
              <div class="ranking-value" :style="rankingStyle(item.rank)">
                {{ decimalNumC(item.rank, 0, ",") }}
              </div>
            </div>
            <div class="user-address">{{ shortAddress(item.address) }}</div>
            <div class="basic-points">{{ decimalNumC(item.basePoints, 2, ",") }}</div>
            <div class="activity-points">{{ decimalNumC(item.totalActivityPoints, 2, ",") }}</div>
            <div class="ecosystem-points">{{ decimalNumC(item.ecosystemPoints, 2, ",") }}</div>
            <div class="total-points">{{ decimalNumC(item.total, 2, ",") }}</div>
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
  actBasePoint,
  actEcosystemPoints,
  actTotalActivityPoint,
  actTotalPoint,
  actPointRank,
  actPointFetchStatus
} from '../../composition/hooks'
import SvgIcon from '../SvgIcon/SvgIcon.vue'
import { decimalNum } from '../../util/decimalNum'
import util from '../../util/util'
import { ethers } from 'ethers'

export default {
  components: { SvgIcon },
  name: 'OPointsRankingCard',
  data() {
    return {
      current: 1,
      len: 10000,
      loading: false,
      isFetchList: false,
      list: [],
      lastRefreshTime: 0,
      totalPoint: "0",
      addressCount: "0",
      ratePoint: "0",
    }
  },
  computed: {
    OPointsCardModalShow() {
      return OPointsCardModalShow.value
    },
    pointFetchStatus() {
      return actPointFetchStatus.value
    },
    baseOPoint() {
      const base = actBasePoint.value
      return this.pointFetchStatus ? this.decimalNumC(base, 2, ",") : "--"
    },
    totalActivityPoint() {
      const totalActivity = actTotalActivityPoint.value
      return this.pointFetchStatus ? this.decimalNumC(totalActivity, 2, ",") : "--"
    },
    ecosystemPoints() {
      const ecosystem = actEcosystemPoints.value
      return this.pointFetchStatus ? this.decimalNumC(ecosystem, 2, ",") : "--"
    },
    currentTotalPoint() {
      const total = actTotalPoint.value
      return this.pointFetchStatus ? this.decimalNumC(total, 2, ",") : "--"
    },
    pointRank() {
      const rank = actPointRank.value
      return this.pointFetchStatus && Number(rank) > 0 ? this.decimalNumC(rank, 0, ",") : "--"
    },
  },
  methods: {
    shortAddress(address){
      return util.shortAddress(address, 6)
    },
    timeMin(){
      const lastRefreshTime = this.lastRefreshTime
      const current = +new Date()
      const timer = current - lastRefreshTime
      
      return Math.ceil(timer / 60 / 1000) | "0"
    },
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
    async curChange(cur) {
      const result = this.getRankDataList(cur)
      this.current = cur
    },
    close() {
      this.current = 1
      this.loading= false
      this.isFetchList= false
      this.list = []
      setOPointsCardModalShow(false)
    },
    rankingStyle(rankValue) {
      const key = Number(rankValue)
      const list = [
        'background: linear-gradient(180.00deg, rgb(255, 222, 155),rgb(243, 169, 19) 100%);',
        'background: linear-gradient(180.00deg, rgb(240, 254, 255),rgb(190, 190, 190) 100%);',
        'background: linear-gradient(180.00deg, rgb(233, 179, 135),rgb(197, 133, 81) 100%);',
      ]
      const base = 'border-radius:50%;'
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
    async getRankInfo() {
      const response = await fetch(
        `${process.env.VUE_APP_OPEN_URL}/points_platform/rank/info`
      )
      const { result } = await response.json()
      const { lastRefreshTime, totalPoint, addressCount, ratePoint  }= result || {}
      this.lastRefreshTime = lastRefreshTime
      this.loading = false
      this.totalPoint = totalPoint
      this.addressCount = addressCount
      this.ratePoint = ratePoint
    },
    async getRankDataList(current) {
      try {
        this.list = []
        if(this.isFetchList) return
        const page = current || this.current
        const response = await fetch(
          `${process.env.VUE_APP_OPEN_URL}/points_platform/rank/top?page=${page}&pageSize=20`
        )
        const { result } = await response.json()
        this.list = (result || []).map((item)=>{
          return ({
            ...(item || {}),
            ecosystemPoints: ethers.utils.formatEther(ethers.utils.parseEther(item?.ecosystemPoints ? String(item?.ecosystemPoints) : "0").add(
              ethers.utils.parseEther(item?.dappPoints ? String(item?.dappPoints) : "0")
            ))
          })
        })
        this.isFetchList = false
        this.loading = false
        return "SUCCESS"
      } catch (error) {
        this.loading = false
        return "ERROR"
      }
    },
  },
  watch: {
    OPointsCardModalShow: function (status) {
      const loading = this.loading
      if (!loading && status) {
        this.loading = true
        this.getRankInfo()
        this.getRankDataList()
      }
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
        height: 400px;
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
          justify-content: start;
          align-items: center;
          .ranking-value {
            width:24px;height:24px;
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
          .info-label {
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
          height: 200px;
        }
      }

      .pagination-group {
        padding: 8px 0 12px;
      }
    }
  }
}
</style>
