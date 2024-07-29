<template>
  <div class="activity-card">
    <div class="activity-card-title">
      <div class="activity-card-title-left">
        <svg-icon
          v-if="item.label.icon"
          class="icon"
          :iconName="item.label.icon"
        ></svg-icon>
        <div class="text">{{ item.name }}</div>
      </div>
      <o-tooltip>
        <template v-slot:titleDesc>
          <div class="task-tips-time" style="margin-left: -20px">
            {{ formatTime3(item.startTime) }} -
            {{ formatTime3(item.endTime) }}
          </div>
        </template>
        <div class="text_5">
          {{ formatTime2(item.startTime) }} -
          {{ formatTime2(item.endTime) }}
        </div>
      </o-tooltip>
    </div>
    <div>
      <template v-for="option in item.taskList">
        <div
          class="task-card"
          :style="`opacity:${option.status === 0 ? '1' : '0.4'};`"
        >
          <div class="title">
            <div class="task-info">
              <svg-icon class="task-icon" iconName="task-icon"></svg-icon>
              <div class="description" v-html="option.description"></div>
            </div>
          </div>
          <div class="group">
            <div v-for="tag in option.tags">
              <div v-if="tag.style === 'token'" class="token-tag">
                <img
                  v-if="tag.icon"
                  :src="tag.icon"
                  alt=""
                  class="tag-token-icon"
                />
                <span class="tag-token-text">{{ tag.description }}</span>
              </div>
              <div
                class="text-wrapper_17 flex-col"
                :key="tag.description"
                v-else
              >
                <span class="text_27">{{ tag.description }}</span>
              </div>
            </div>

            <!-- <div v-else class="text-wrapper_4 flex-col">
                <span class="text_9">Done</span>
              </div> -->

            <div class="group-reward">
              <svg-icon iconName="O-Points"></svg-icon>
              + {{ option.points }} OPoints
            </div>

            <div class="text-wrapper_18">
              <span class="text_28" v-if="!!option.progress">{{
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
export default {
  name: 'ActivityTaskCard',
  data(){
    return {
        item: {}
    }
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
  }
}
</style>
