<template>
  <div class="events-wrap fade-content">
    <div class="event-header">
      <div class="title" :style="{ 'background-image': `url(${titleBg}` }">
        Eco Events
      </div>
      <div class="view-more" @click="handlerClickJump">View More ➝</div>
    </div>
    <div class="event-list">
      <div
        class="event-item"
        v-for="item in eventList"
        :key="item.label"
        @click="handlerClickJump({ target: { innerText: item.label } })"
      >
        <div class="item-banner">
          <img v-if="item.banner" :src="item.banner" />
        </div>
        <div class="item-label">
          {{ item.label }}
        </div>
        <div class="item-desc">{{ item.date }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['handlerClickJump'],
  props: {
    eventImg1: {
      type: String,
      default: '',
    },
    eventImg2: {
      type: String,
      default: '',
    },
    eventImg3: {
      type: String,
      default: '',
    },
    titleBg: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      eventList: [
        {
          banner: this.eventImg1,
          label: 'Deep Dive into zkSync',
          date: '20th Feb 2023',
        },
        {
          banner: this.eventImg2,
          label: 'Immersion into StarkWare',
          date: '1st Mar 2023',
        },
        {
          banner: this.eventImg3,
          label: 'A Closer Look at Polygon',
          date: '7th Mar 2023',
        },
      ],
    }
  },
}
</script>

<style scoped lang="scss">
.events-wrap {
  max-width: 100%;
  width: min-content;
  box-sizing: border-box;
  padding: 120px 0 92px 0;
  margin: 0 auto;
  background: #f5f5f5;
  display: flex;
  width: max-content;
  flex-direction: column;
  opacity: 0;
}
.event-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
}
.title {
  font-size: 56px;
  font-family: 'Kodchasan-Bold';
  font-weight: bold;
  color: #222222;
  background-repeat: no-repeat;
  background-position: right bottom;
  line-height: 1.1;
  background-size: 197px 18px;
}
.view-more {
  font-size: 18px;
  font-family: GeneralSans-SemiBold, OpenSansRoman;
  font-weight: 600;
  cursor: pointer;
  color: #df2e2d;
}
.event-list {
  display: flex;
  margin-top: 66px;
}
.event-item {
  display: flex;
  flex-direction: column;
  padding-bottom: 28px;
  cursor: pointer;
  box-sizing: border-box;
  margin-bottom: 24px;
  margin-right: 24px;
  max-width: 384px;
  height: 320px;
  background: #ffffff;
  text-align: left;
  padding-left: 7.5px;
  box-shadow: inset 8px -8px 0px 0px rgba(0, 0, 0, 1);
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #222222;
  &:last-of-type {
    margin-right: 0;
  }
  &:hover {
    box-shadow: inset 8px -8px 0px 0px #df2e2d !important;
    border: 2px solid #df2e2d !important;
    .item-banner {
      &::after {
        background-color: #df2e2d;
      }
    }
  }
}
.item-banner {
  max-width: 384.5px;
  max-height: 144px;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #222;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
.item-label {
  font-size: 24px;
  font-family: 'Kodchasan-Bold';
  font-weight: bold;
  color: #222222;
  margin-top: 16px;
  margin-left: 28px;
}
.item-desc {
  font-size: 16px;
  font-family: 'Kodchasan-Medium';
  font-weight: 500;
  color: #666666;
  margin-top: 78px;
  margin-left: 28px;
}
@media (max-width: 1240px) {
  .events-wrap {
    margin: 60px auto;
    padding: 0;
    padding-left: 16px;
  }
  .title {
    font-size: 36px;
    background-size: 125px 9px;
  }
  .view-more {
    font-size: 14px;
    margin-right: 16px;
  }
  .event-list {
    display: flex;
    margin-top: 22px;
    width: 100%;
    overflow: auto;
  }
  .event-item {
    min-width: 288px;
    height: 240px;
    margin-bottom: 0;
    margin-right: 18px;
    padding-bottom: 0;
    &:last-of-type {
      margin-right: 18px;
    }
  }
  .item-banner {
    width: 100%;
    height: 108px;
  }
  .item-label {
    font-size: 18px;
    margin-left: 13px;
    margin-top: 12px;
  }
  .item-desc {
    font-size: 12px;
    margin-top: 59px;
    margin-left: 13px;
  }
}
</style>
