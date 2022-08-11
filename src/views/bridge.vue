<template>
  <div class="bridage-page">
    <template>
      <div
        v-show="!isMobile && curPage.Status === '1' && !showDetail"
        class="sub-tabs"
      >
        <ToggleBtn />
      </div>
      <div
        v-show="
          curPage.TabState === 'Sender' && curPage.Status === '1' && !showDetail
        "
        class="sender-box"
      >
        <keep-alive>
          <sender />
        </keep-alive>
      </div>
      <div
        v-show="
          curPage.TabState === 'Maker' && curPage.Status === '1' && !showDetail
        "
        class="maker-box"
      >
        <maker />
      </div>
      <div
        v-show="
          curPage.TabState === 'Pool' && curPage.Status === '1' && !showDetail
        "
        class="pool-box"
      >
        <cur-network-pool v-if="makerInfoStatus && isLogin" />
        <div class="maker-box" style="margin: 0 auto" v-else>
          <div class="maker-title">About Maker</div>
          <div class="maker-content">
            <div>
              Orbiter's Maker provides liquidity for Layer 2 and benefits from
              it.
            </div>
            <div @click="clickLearnMore" class="maker-link">LEARN MORE</div>
            <div class="maker-foot-btn">COMING SOON</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { curNetworkPool, sender, maker } from './'
import { ToggleBtn } from '../components'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'Bridge',
  components: { ToggleBtn, sender, maker, curNetworkPool },
  computed: {
    ...mapState(['curPage', 'isMobile']),
    ...mapGetters(['isLogin']),
    showDetail() {
      return false
    },
  },
  data() {
    return {
      makerInfoStatus: false,
    }
  },
  async mounted() {
    this.makerInfoStatus = await this.getMakerInfoList()
  },
  methods: {
    ...mapMutations(['togglePageTab']),
    ...mapActions(['getMakerInfoList']),
    clickLearnMore() {
      window.open('https://docs.orbiter.finance/', '_blank')
    },
    changeState(e) {
      if (e !== '1' && e !== '2' && e !== '3') {
        // historyPanelState.isShowHistory = false
      } else {
        if (this.curPage.Status !== e) {
          this.togglePageTab({ type: 'Status', value: e })
        }
      }
    },
  },
}
</script>

<style scoped lang="scss">
.app {
  .bridage-page {
    .maker-box {
      width: 480px;
      height: 331px;
      .maker-content {
        .maker-foot-btn {
          width: 400px;
        }
      }
    }
    .sender-box {
      width: 480px;
      height: 540px;
      padding: 24px 20px;
    }
  }
}
.app-mobile {
  .bridage-page {
    // height: 100%;
    .maker-box {
      height: 100%;
      width: 100%;
    }
    .sender-box {
      width: 100%;
      height: 100%;
      padding: 24px 20px;
    }
  }
}
.bridage-page {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .sub-tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 24px;
    margin-top: 0px;
    .tab-toggle-btn {
      width: 229px;
      height: 40px;
      border-radius: 40px;
      .tab-btn-item {
        display: inline-block;
        width: 50%;
        text-align: center;
        font-weight: 700;
        font-size: 16px;
        height: 100%;
        line-height: 40px;
        border-radius: 20px;
        cursor: pointer;
      }
      .tab-btn-item.selected {
        background: #df2e2d;
        color: #ffffff;
        box-shadow: inset 0px -6px 0px rgba(0, 0, 0, 0.16);
      }
    }
  }
  .sender-box {
    border-radius: 20px;
  }
  .maker-box {
    border-radius: 20px;
    padding: 34px 40px;
    text-align: left;
    .maker-title {
      font-weight: 700;
      font-size: 20px;
      line-height: 20px;
    }
    .maker-content {
      font-family: 'Inter Regular';
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      margin-top: 30px;
      .maker-link {
        margin-top: 20px;
        color: #df2e2d;
      }
      .maker-link:hover {
        text-decoration: underline;
        cursor: pointer;
      }
      .maker-foot-btn {
        height: 50px;
        box-shadow: inset 0px -8px 0px rgba(0, 0, 0, 0.16);
        border-radius: 40px;
        font-weight: 700;
        font-size: 20px;
        line-height: 20px;
        color: #fff;
        margin-top: 40px;
        text-align: center;
        line-height: 50px;
        font-family: 'Inter Bold';
      }
    }
  }
  .pool-box {
    width: 1120px;
    // height: 1100px;
  }
}
</style>
