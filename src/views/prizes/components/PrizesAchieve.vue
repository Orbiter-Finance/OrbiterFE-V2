<template>
  <div class="prizes-achieve-card">
    <div class="title">
      <div class="label">🎁 Daliy Transaction Speed Race</div>
      
    </div>
    <div class="rank-list-group">
        <div class="rank-list">
          <div class="rank-list-header rank-list-card-item">
            <div class="user-address">User</div>
            <div class="cumulative-tx">Time</div>
            <div class="cumulative-tx">Transaction</div>
            <div class="emit-reward">daliy extra bounus</div>
          </div>
          <div
            class="rank-list-item rank-list-card-item"
            v-for="(item, index) in dataList"
            :key="index"
          >
            <div class="user-address">
              {{ shortAddress(item.address, isMobile ? 4 : 6) }}
            </div>
            <div class="user-address">
              {{ dayTime(item) }}
            </div>
            <div class="cumulative-tx">
              {{ decimalNumC(item.txsCount, 0, ',') }} tx
            </div>
            <div class="emit-reward">
              <div>
                +200 USDC
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { prizesTaskList, prizesTimeEnd, prizesAchieveList } from '../../../composition/hooks'

export default {
  name: 'PrizesAchieve',
  computed: {
    isEnd() {
      return prizesTimeEnd.value
    },
    taskList() {
      return prizesTaskList.value
    },
    achieveList() {
      return prizesAchieveList.value
    },
    dataList() {
      const taskList = this.taskList
      const achieveList = this.achieveList

      const taskId = taskList.filter((item)=>{
        const startTime =  +dayjs.utc(item.rule.startTime)
        const endTime =  +dayjs.utc(item.rule.endTime)
        const now = +dayjs()
        return startTime <= now && 
        endTime >= now
      })?.[0]?.id  || taskList?.[taskList?.length-1 || 0]?.id 

      const group = achieveList.filter((item)=>{
        return item.taskId === taskId
      })?.[0]

      return group?.result || []

    }
  },
  methods: {
    dayTime(option) {
      return dayjs(option.time).format("MM.DD HH:mm")
    }
  }
}
</script>

<style scoped lang="scss">
.prizes-achieve-card {
  width: 100%;
  padding: 32px;
  border: 4px solid rgb(69, 35, 48);
  margin-top: 56px;
  background: radial-gradient(
      96% 96% at 50% 50%,
      rgba(27, 21, 37, 0) 1.849%,
      rgba(255, 70, 68, 0.2) 100%
    ),
    rgb(18, 4, 30);
  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .rank-list-group {
    width: 100%;
    .rank-list {
      width: 100%;
      text-align: left;
      margin-top: 24px;
      position: relative;
      background-color: #040809;
      border: 1px solid rgb(69, 35, 48);
      .rank-list-card-item {
        width: 100%;
        padding: 14px 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .ranking {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 84px;
          .tips {
            cursor: pointer;
            margin-left: 2px;
            svg {
              width: 12px;
              height: 12px;
            }
          }
        }

        .user-address {
          width: 26%;
        }

        .cumulative-tx {
          width: 26%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .bridge-fee-image {
            margin-left: 4px;
            width: 95px;
            height: 20px;
          }
        }

        .bridge-fee {
          width: 26%;
        }

        .emit-reward {
          flex: 1;
          text-align: right;
        }
      }

      .ranking-1 {
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(
          180deg,
          rgb(255, 222, 155),
          rgb(243, 169, 19) 100%
        );
        border-radius: 50%;
        width: 32px;
        height: 32px;
        color: #000000;
      }

      .ranking-2 {
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(
          180deg,
          rgb(240, 254, 255),
          rgb(190, 190, 190) 100%
        );
        border-radius: 50%;
        width: 32px;
        height: 32px;
        color: #000000;
      }

      .ranking-3 {
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(
          180deg,
          rgb(233, 179, 135),
          rgb(197, 133, 81) 100%
        );
        border-radius: 50%;
        width: 32px;
        height: 32px;
        color: #000000;
      }

      .rank-list-header {
        font-size: 14px;
        background: #1e140e;
        border-bottom: 1px solid rgb(69, 35, 48);
      }

      .rank-list-item {
        font-family: GeneralSans-SemiBold;
        height: 76px;
        border-bottom: 1px solid rgb(69, 35, 48);
        background: rgb(4, 8, 9);
        .emit-reward {
          color: #ffd166;
          span {
            font-size: 14px;
            color: rgba(#ffd166, 0.6);
          }
        }
      }

      .pagination-group {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 14px 0;
      }
    }
  }
}
</style>
