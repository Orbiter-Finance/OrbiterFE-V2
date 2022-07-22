<template>
<div class="bridage-page">
  <template>
    <div v-show="!isMobile && status === '1' && !showDetail" class="sub-tabs">
      <ToggleBtn @input="toggleTab" />
    </div>
    <div v-show="isSenderTab && status === '1' && !showDetail" class="sender-box">
      <keep-alive>
        <Transfer @stateChanged="changeState" />
      </keep-alive>
    </div>
    <div v-show="!isSenderTab && status === '1' && !showDetail" class="maker-box">
      <div class="maker-title">About Maker</div>
      <div class="maker-content">
        <div>Orbiter's Maker provides liquidity for Layer 2 and benefits from it.</div>
        <div @click="clickLearnMore" class="maker-link">LEARN MORE</div>
        <div class="maker-foot-btn">COMING SOON</div>
      </div>
    </div>
  </template>
  <div v-show="status !== '1' || showDetail" style="width:100%;height:100%;" class="center">
    <Proceed v-if="showDetail" :detailData="detailData" @stateChanged="changeState" />
    <template v-else>
      <Confirm v-if="status === '2'" @stateChanged="changeState" />
      <Proceed v-if="status === '3'" @stateChanged="changeState" />
    </template>
  </div>
</div>
</template>

<script>
import { Transfer, Confirm, Proceed } from './'
import { ToggleBtn } from '../../components'
import { isMobile, curPageTabState, togglePageTab, curPageStatus, changeCurPageStatus, historyPanelState } from '../../composition/hooks'

export default {
  name: 'Bridge',
  components: { Transfer, Confirm, Proceed, ToggleBtn },
  computed: {
    isMobile() {
      return isMobile.value
    },
    isSenderTab() {
      return curPageTabState.value === 'Sender'
    },
    status() {
      return curPageStatus.value
    },
    showDetail() {
      return historyPanelState.isShowHistory
    },
    detailData() {
      // return {
      //   fromChainID: 3,
      //   fromTimeStamp: "06-11 03:49",
      //   fromTxHash: "0x91d15798366f2d48384b1d734862384008142fa547ac9b56300f2a1c4632ba5c",
      //   makerAddress: "0xd7...64fc",
      //   state: 0,
      //   toChainID: 6,
      //   toTimeStamp: "2022-06-11T03:49:08.000Z",
      //   toTxHash: "0x9ba8de5039d794dfeea1a056bf46d0793a8204bb57a6771c0d363ed22eff523a",
      //   tokenName: "USDT",
      //   userAddress: "0x6b...5f66",
      //   userAmount: "4.509006",
      // }
      return historyPanelState.historyInfo
    }
  },
  methods: {
    toggleTab() {
      changeCurPageStatus('1')
      togglePageTab()
    },
    clickLearnMore() {
      window.open('https://docs.orbiter.finance/', '_blank')
    },
    changeState(e) {
      if (e !== '1' && e !== '2' && e !== '3') {
        historyPanelState.isShowHistory = false
      } else {
        if (this.status !== e) {
          changeCurPageStatus(e)
        }
      }
    },
  }
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
        background: #DF2E2D;
        color: #FFFFFF;
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
        color: #DF2E2D;
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
        color: #FFF;
        margin-top: 40px;
        text-align: center;
        line-height: 50px;
        font-family: 'Inter Bold';
      }
    }
  }
}
</style>
