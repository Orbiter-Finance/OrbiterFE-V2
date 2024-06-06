<template>
  <div class="notice-box"  v-if="show"
  >
    <div class="notice-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          :fill="noticeColor"
          d="M18.0003 16.7503C17.8403 16.7503 17.6903 16.7003 17.5503 16.6003C17.2203 16.3503 17.1503 15.8803 17.4003 15.5503C18.9703 13.4603 18.9703 10.5403 17.4003 8.45027C17.1503 8.12027 17.2203 7.65027 17.5503 7.40027C17.8803 7.15027 18.3503 7.22027 18.6003 7.55027C20.5603 10.1703 20.5603 13.8303 18.6003 16.4503C18.4503 16.6503 18.2303 16.7503 18.0003 16.7503Z"
        />
        <path
          :fill="noticeColor"
          d="M19.8284 19.2503C19.6684 19.2503 19.5184 19.2003 19.3784 19.1003C19.0484 18.8503 18.9784 18.3803 19.2284 18.0503C21.8984 14.4903 21.8984 9.51027 19.2284 5.95027C18.9784 5.62027 19.0484 5.15027 19.3784 4.90027C19.7084 4.65027 20.1784 4.72027 20.4284 5.05027C23.4984 9.14027 23.4984 14.8603 20.4284 18.9503C20.2884 19.1503 20.0584 19.2503 19.8284 19.2503Z"
        />
        <path
          :fill="noticeColor"
          d="M14.02 3.78168C12.9 3.16168 11.47 3.32168 10.01 4.23168L7.09 7.06168C6.89 7.18168 6.66 7.25168 6.43 7.25168H5.5H5C2.58 7.25168 1.25 7.58168 1.25 10.0017V14.0017C1.25 16.4217 2.58 16.7517 5 16.7517H5.5H6.43C6.66 16.7517 6.89 16.8217 7.09 16.9417L10.01 19.7717C10.89 20.3217 11.75 20.5917 12.55 20.5917C13.07 20.5917 13.57 20.4717 14.02 20.2217C15.13 19.6017 15.75 18.3117 15.75 16.5917V7.41168C15.75 5.69168 15.13 4.40168 14.02 3.78168Z"
        />
      </svg>
    </div>
    <div class="notice-group"
      v-show="show"
    >
      <div 
        class="notice-content" 
        key="first"
        ref="first"
      >
        <div class="notice-text"
          v-for="(item, index) in noticeList"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
      <div 
        class="notice-content" 
        key="last"
        ref="last"
      >
        <div class="notice-text"
          v-for="(item, index) in noticeList"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="notice-group"
      v-show="!show"
    >
      <div >
        No notices
      </div>
    </div>
  </div>
</template>

<script>
import { getNoticeData } from '../common/openApiAx'
export default {
  name: 'Notice',
  data() {
    return {
      noticeList: [],
    }
  },
  computed: {
    isLightMode() {
      return this.$store.state.themeMode === 'light'
    },
    noticeColor() {
      return this.isLightMode ? '#DF2E2E' : '#FFF'
    },
    show() {
      return !!this.noticeList?.length
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      try {
        const data = await getNoticeData()
        const list = data?.map((item)=> item.description || "") || []
        this.noticeList = [...new Set(list.map((item)=> item.trim()))].filter((item)=> !!item)
        if(this.noticeList?.length) {
          const dymanicStyle = `@keyframes move-notice-left {
            0% {
              transform: translateX(0)
            }
            100% {
              transform: translateX(-100%)
            }
          }`
          let sheet = document.styleSheets[0]
          sheet.insertRule(dymanicStyle, 0)
          this.$nextTick(() => {
            this.$refs.first.style.animation = `move-notice-left ${(this.noticeList?.length || 0) * 10}s linear infinite`
            this.$refs.last.style.animation = `move-notice-left ${(this.noticeList?.length || 0) * 10}s linear infinite`
          })
        }
      } catch (error) {
        this.noticeList = []
      }
    },
  }
}
</script>

<style scoped lang="scss">

.notice-box {
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 16px;
  width: 480px;
  max-width: 100%;
  background: #fbeaea;
  border-radius: 12px;
  text-align: left;
  padding: 12px;

  .notice-icon {
    width: 24px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .notice-group {
    flex: 1;
    overflow: hidden;
    margin-left: 8px;
    white-space: nowrap;
    height: 100%;
    display: flex;
    color: #df2e2e;
    font-size: 12px;
    .notice-content {
      width: fit-content;
      padding-right: 12px;
      .notice-text {
        display: inline-block;
        padding-right: 12px;
      }
    }
  }
}

.dark-theme {
  .notice-box {
    background: #5e2a38;
    .notice-group {
      color: #fff;
    }
  }
}
</style>
