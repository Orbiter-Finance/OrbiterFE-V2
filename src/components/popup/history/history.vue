<template>
  <o-box-content class="historybody" style="width: 34.5rem">
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
      <div
        style="width: 100%; height: 0.3rem; background: var(--default-black)"
      ></div>
      <div class="contentTopItem">
        <span style="width: 34%">Time</span>
        <span style="width: 30%">Value</span>
        <span style="width: 18%">From</span>
        <span style="width: 18%">To</span>
      </div>
      <div
        style="width: 100%; height: 0.15rem; background: var(--default-black)"
      ></div>
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
          <svg-icon
            :iconName="logoName(item.fromChainID)"
            style="width: 1.6rem; height: 1.6rem"
          ></svg-icon>
        </span>
        <span style="width: 18%; text-align: center">
          <svg-icon
            :iconName="logoName(item.toChainID)"
            style="width: 1.6rem; height: 1.6rem"
          ></svg-icon>
        </span>
      </div>
      <div v-else class="noContentItem">No history</div>
    </div>
  </o-box-content>
</template>

<script>
import Loading from '../../loading/loading.vue'

export default {
  name: 'History',
  props: {},
  components: {
    Loading,
  },
  watch: {},
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
  mounted() {},
  methods: {
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
    logoName(chainID) {
      if (chainID == '2' || chainID == '22') {
        return 'arblogo'
      } else if (chainID == '3' || chainID == '33') {
        return 'zklogo'
      } else if (chainID == '4' || chainID == '44') {
        return 'sknlogo'
      } else if (chainID == '6' || chainID == '66') {
        return 'pglogo'
      } else if (chainID == '7' || chainID == '77') {
        return 'oplogo'
      } else if (chainID == '8' || chainID == '88') {
        return 'imxlogo'
      } else if (chainID == '9' || chainID == '99') {
        return 'loopringlogo'
      } else if (chainID == '10' || chainID == '510') {
        return 'metislogo'
      } else if (chainID == '11' || chainID == '511') {
        return 'dydxlogo'
      } else if (chainID == '12' || chainID == '512') {
        return 'zkspacelogo'
      } else if (chainID == '13' || chainID == '513') {
        return 'bobalogo'
      } else {
        return 'ethlogo'
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
