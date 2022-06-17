<template>
  <o-box-content class="historybody" style="width: 34.5rem;position:relative;">
    <div @click.stop="stopPenetrate" class="historyContent">
      <div class="topItem">
        <span>History</span>
        <div @click="closerButton">
          <svg-icon
            style="width: 1.5rem; height: 1.5rem"
            iconName="close"
          ></svg-icon>
        </div>
      </div>
      <div style="position:sticky;top:0;z-index:1;">
        <div style="width: 100%; height: 0.3rem; background: var(--default-black)"></div>
        <div class="contentTopItem">
          <svg-icon v-if="$store.state.transactionListInfo.current > 1" @click.native="prevHistory" style="width: 1.5rem; height: 1.5rem;cursor:pointer;" iconName="back"></svg-icon>
          <span style="width: 34%">Time</span>
          <span style="width: 30%">Value</span>
          <span style="width: 18%">From</span>
          <span style="width: 18%">To</span>
          <svg-icon v-if="$store.state.transactionListInfo.current < $store.state.transactionListInfo.pages" @click.native="nextHistory" style="width: 1.5rem; height: 1.5rem;cursor:pointer;transform: rotate(180deg);" iconName="back"></svg-icon>
        </div>
        <div style="width: 100%; height: 0.15rem; background: var(--default-black)"></div>
      </div>
      <div class="dydx-limit" v-if="isShowDydxLimit">
        Limited by the dydx mechanism, the history of dYdX cannot be queried
        temporarily
      </div>
      <div class="dydx-limit">
        Limited by the starkNet mechanism, the history of starkNet cannot be
        queried temporarily
      </div>
      <loading
        v-if="!historyData"
        style="margin: auto; margin-top: 5rem"
        loadingColor="#E85E24"
        width="4rem"
        height="4rem"
      ></loading>
      <div
        v-else-if="historyData && historyData.length !== 0"
        v-for="(item, index) in historyData"
        :key="index"
        @click="getHistoryInfo(item)"
        class="contentItem"
      >
        <svg-icon class="logo" :iconName="iconName(item)"></svg-icon>
        <span style="width: 28%">{{ item.fromTimeStamp }}</span>
        <span style="width: 30%; text-align: center">{{
          item.userAmount + item.tokenName
        }}</span>
        <span style="width: 18%; text-align: center">
          <ChainLogoIcon :id="item.fromChainID" />
        </span>
        <span style="width: 18%; text-align: center">
          <ChainLogoIcon :id="item.toChainID" />
        </span>
      </div>
      <div v-else class="noContentItem">No history</div>
    </div>
  </o-box-content>
</template>

<script>
import Loading from '../../loading/loading.vue'
import ChainLogoIcon from '../../ChainLogoIcon'

export default {
  name: 'History',
  components: {
    Loading,
    ChainLogoIcon,
  },
  computed: {
    historyData() {
      const { transactionList } = this.$store.state
      if (!transactionList) {
        return transactionList
      }
      // Hide dydx (from and to)
      const list = []
      for (const item of transactionList) {
        if (
          item.fromChainID == 11 ||
          item.fromChainID == 511 ||
          item.toChainID == 11 ||
          item.toChainID == 511
        ) {
          continue
        }
        list.push(item)
      }
      return list
    },
    isShowDydxLimit() {
      const { transactionList } = this.$store.state
      if (!this.historyData || !transactionList) {
        return false
      }
      if (this.historyData.length < transactionList.length) {
        return true
      }
      return false
    },
  },
  methods: {
    prevHistory() {
      const info = this.$store.state.transactionListInfo
      info.current > 1 && this.$store.dispatch('getTransactionsHistory', {
        current: info.current - 1
      })
    },
    nextHistory() {
      const info = this.$store.state.transactionListInfo
      this.$store.dispatch('getTransactionsHistory', {
        current: info.current + 1
      })
    },
    closerButton() {
      this.$emit('closeHistory')
    },
    getHistoryInfo(e) {
      this.$emit('getHistoryInfo', e)
      this.closerButton()
    },
    stopPenetrate(e) {
      e.stopPropagation()
    },
    iconName(item) {
      if (item.state === 0) {
        return 'history_success'
      } else if (item.state === 1) {
        return 'history_waiting'
      } else {
        return 'history_fail'
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.historybody {
  background-color: #fff;
  margin: 4.2rem auto;
  height: calc(
    100vh - 8.4rem - var(--top-nav-height) - var(--bottom-nav-height)
  );
  height: calc(
    var(--vh, 1vh) * 100 - 8.4rem - var(--top-nav-height) -
      var(--bottom-nav-height)
  );
  overflow-y: scroll;

  .dydx-limit {
    color: #e85e24;
    font-size: 14px;
    padding-top: 8px;
  }

  .historyContent {
    margin: 1rem 1.5rem;
    position: relative;
    .topItem {
      width: 100%;
      height: 2rem;
      font-size: 2rem;
      font-weight: bold;
      line-height: 2rem;
      color: var(--default-black);
      display: flex;
      justify-content: space-between;
      padding: 0 1rem;
      margin-bottom: 1.5rem;
    }
    .contentTopItem {
      width: 100%;
      font-size: 1.4rem;
      font-weight: bold;
      line-height: 2rem;
      color: var(--default-black);
      display: flex;
      justify-content: space-between;
      align-items: center;
      // padding: 0 1rem;
      margin: 2rem 0 1.5rem;
      text-align: center;
    }
    .contentItem {
      width: 100%;
      font-size: 1.4rem;
      font-weight: lighter;
      line-height: 2rem;
      color: var(--default-black);
      margin: 2rem auto 0 auto;
      align-items: center;
      display: flex;
      justify-content: space-between;
      position: relative;
      text-align: left;
      .logo {
        // position: absolute;
        // left: -1.2rem;
        width: 6%;
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.5rem;
      }
    }
    .noContentItem {
      color: rgba($color: #18191f, $alpha: 0.15);
      font-size: 1.4rem;
      margin-top: 10rem;
    }
  }
}
</style>
