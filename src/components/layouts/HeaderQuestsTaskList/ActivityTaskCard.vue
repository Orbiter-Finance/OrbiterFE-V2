<template>
  <div class="activity-card">
    <div class="activity-card-title">
      <div class="activity-card-title-left">
        <svg-icon
          v-if="icon"
          class="icon"
          :iconName="icon"
        ></svg-icon>
        <div class="text">{{ title }}</div>
      </div>
      <o-tooltip>
        <template v-slot:titleDesc>
          <div class="task-tips-time" style="margin-left: -20px">
            {{ formatTime3(startTime) }} -
            {{ formatTime3(endTime) }}
          </div>
        </template>
        <div class="text_5">
          {{ formatTime2(startTime) }} -
          {{ formatTime2(endTime) }}
        </div>
      </o-tooltip>
    </div>
    <div>
      <template v-for="option in taskList">
        <div
          class="task-card"
          :style="`opacity:${option.isSuccess ? '0.4' : '1'};`"
        >
          <div class="title">
            <div class="task-info">
              <svg-icon class="task-icon" iconName="task-icon"></svg-icon>
              <div class="description" v-html="option.name"></div>
            </div>
          </div>
          <div class="group">
            <div v-for="tag in option.tags">
              <div v-if="tag.type === 'opoint'" class="group-reward">
                <svg-icon iconName="O-Points"></svg-icon>
                + {{ tag.amount }} OPoints
              </div>
              <div v-else-if="tag.token" class="token-tag">
                <img
                  v-if="tag.icon"
                  :src="tag.icon"
                  alt=""
                  class="tag-token-icon"
                />
                <span class="tag-token-text">{{ tag.title }}</span>
              </div>
              <div
                class="text-wrapper_17 flex-col"
                :key="tag.title"
                v-else
              >
                <span class="text_27">{{ tag.title }}</span>
              </div>
            </div>

            <div class="text-wrapper_18">
              <span class="text_28" v-if="!option.isSuccess">{{
                option.progress
                  ? `${option.progress.current}/${option.progress.total}`
                  : '0/0'
              }}</span>
              <span v-else class="text_28">Undone</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import SvgIcon from '../../SvgIcon/SvgIcon.vue'
import { questsUserInfoList } from '../../../composition/hooks';

export default {
  name: 'ActivityTaskCard',
  components: {
    SvgIcon,
  },
  props: {
    dataInfo: Object,
  },
  computed: {
    questsUserList() {
      return questsUserInfoList.value
    },
    currentUserInfo(){
      const list = this.questsUserList || []
      console.log("this.questsUserList", this.dataInfo, this.id, this.questsUserList)
      const option = list.filter((item)=> this.id === item.projectId)?.[0]
      return option || null
    },
    startTime(){
      return this.dataInfo.start_time
    },
    endTime(){
      return this.dataInfo.end_time
    },
    title() {
      console.log("this.dataInfo", this.dataInfo)
      return this.dataInfo.name
    },
    id() {
      return this.dataInfo.id
    },
    icon() {
      return this.dataInfo.icon
    },
    taskList() {
      const currentUserInfo = this.currentUserInfo
      console.log("currentUserInfo", currentUserInfo);
      const list = this.dataInfo.tasks || []
      const useList = this.currentUserInfo?.records || []
      const task = list.slice(0, list.length - 1)

      return task.map((item)=>{
        const total = Number(item?.rule?.totalVolume)

        const userInfo = useList.filter((option)=> option.task_id === item.id)?.[0]

        const tags = item.rewards.map((option)=>{
            return ({
              icon: option.rule.icon || "",
              amount: option.rule.amount,
              type: option.rule.name,
              title: option.rule.title,
              token: option.rule.token
            })
        })

        return ({
          name: item.name,
          isSuccess: Number(userInfo?.task_result || 0) >= total,
          tags,
          progress: total ? ({
            total,
            current: 0
          }) : null
        })
      })
    },
  },
  methods: {
    formatTime(time) {
      return dayjs.utc(time).format("MMM.DD")
    },
    formatTime2(time) {

      return dayjs.utc(time).format("MMM.DD")
    },
    formatTime3(time) {
      return dayjs.utc(time).format("MMM.DD HH:mm")
    },
  }
}
</script>

<style lang="scss" scoped>
.activity-card {
  width: calc(100% - 32px);
  border-radius: 12px;
  background-color: #f5f5f5;
  padding: 12px;
  margin: 12px 16px;
  
  .activity-card-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .activity-card-title-left {
      display: flex;
      justify-content: start;
      align-items: center;
      .icon {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        margin-right: 6px;
      }
      .text {
        color: rgb(34, 34, 34);
        font-family: GeneralSans-Bold;
        font-size: 14px;
        font-weight: 700;
        line-height: 19px;
        letter-spacing: 0px;
        text-align: left;
      }
    }
    .task-tips-time {
        letter-spacing: 0;
        font-size: 12px;
      }
    .text_5 {
        height: 17px;
        overflow-wrap: break-word;
        color: rgba(153, 153, 153, 1);
        font-size: 12px;
        font-family: GeneralSans-Regular;
        text-align: left;
        white-space: nowrap;
        line-height: 17px;
    }
  }

  .task-card {
    width: 100%;
    border-radius: 8px;
    background-color: #fff;
    margin-top: 8px;
    padding: 12px;
    text-align: left;
    .title {
      width: 100%;
      font-size: 14px;
      font-weight: 700;
      line-height: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .task-info {
        display: flex;
        justify-content: start;
        align-items: start;
        .task-icon {
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }
      }
    }

    .group {
      width: 100%;
      display: flex;
      justify-content: start;
      align-items: center;
      margin-top: 8px;

      .text-wrapper_17 {
        height: 20px;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        color: #FFF;
        background: linear-gradient(139.64deg, rgb(229, 69, 255) 0%,rgb(255, 0, 0) 85.476%);
        .text_27 {
            height: 17px;
            overflow-wrap: break-word;
            font-size: 12px;
            font-family: GeneralSans-Bold;
            text-align: left;
            white-space: nowrap;
            line-height: 17px;
            margin: 0 8px;
        }
      }

      .token-tag {
        height: 20px;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        color: #FFF;
        background: #000000;
        padding: 2px 4px;
    
        .tag-token-icon {
          width: 12px;
          height: 12px;
          margin-right: 4px;
        }
        .tag-token-text {
          font-size: 12px;
          font-family: GeneralSans-SemiBold;
        } 
      }

      .group-reward {
        display: flex;
        justify-content: start;
        align-items: center;
        padding: 2px 4px;
        border-radius: 4px;
        background: rgb(245, 245, 245);
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
        margin: 0 8px;
        svg {
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }
      }

      .text-wrapper_18 {
        padding: 0 8px;
        height: 20px;
        background: url('../../../assets/activity/light_tag_undone.png') 100% no-repeat;
        background-size: 100% 100%;
        margin-left: 2px;
        width: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        .text_28 {
            width: 35px;
            height: 17px;
            overflow-wrap: break-word;
            color: rgba(34, 34, 34, 1);
            font-size: 12px;
            font-family: GeneralSans-SemiBold;
            text-align: left;
            white-space: nowrap;
            line-height: 17px;
          }
      }
    
    }
  }
}

.dark-theme {
  .activity-card {
    background: #373951;
    .activity-card-title {
      .text {
        color: #fff;
      }
    }
    .task-card {
        background-color: var(--dark-page-box-bg);
        .group {
            .group-reward {
                background-color: #222222;
              }
        }
    }
  }
}
</style>
