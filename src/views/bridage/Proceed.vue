<template>
<div class="proceed-box">
  <CommBoxHeader :back="closerButton">{{detailData ? (isFailed ? 'Transcation Failed' : 'Detail') : (isCompleted ? 'Completed' : 'Proceeding')}}</CommBoxHeader>
  <div class="ProceedContent">
    <div v-for="item in proceedData" :key="item.title" class="contentItem">
      <span class="item-title" style="width:100px;text-align:left;">{{ item.title }}</span>
      <span class="item-value right" v-if="item.desc || item.descInfo">{{ item.desc }}</span>
      <CommLoading v-else class="right" width="1.2rem" height="1.2rem" />
    </div>
    <div class="chainDataContent">
      <div v-if="isMobile" class="middle-icon-abs" style="z-index:2;">
        <div v-if="isProcee" :class="[{'rocket-box-bg': isProcee}]">
        </div>
        <div v-else :class="['rocket-box']">
          <SvgIconThemed v-if="true" icon="satellite" size="xs" />
        </div>
      </div>
      <div class="item left" style="z-index:3;">
        <div class="chain-name from">
          <span>{{ FromChainName }}</span>
        </div>
        <div class="chain">
          <svg-icon :iconName="showChainIcon()" style="width: 56px;height: 56px;"></svg-icon>
        </div>
        <div class="tx from-tx" @click="goToExplorFrom">
          <template v-if="!detailData">
            <svg-icon v-if="$store.state.proceedState === 1" class="status-icon" color="#df2e2d" iconName="history_2"></svg-icon>
            <svg-icon v-else-if="$store.state.proceedState === 2" class="status-icon" color="#df2e2d" iconName="history_3"></svg-icon>
            <svg-icon v-else class="status-icon" color="#df2e2d" iconName="history_4"></svg-icon>
          </template>
          <svg-icon v-else class="status-icon" color="#df2e2d" iconName="history_4"></svg-icon>
          <span>{{ FromTx }}</span>
        </div>
        <div class="switch-btn" @click="() => switchNetWork()">Switch Network</div>
      </div>
      <div class="middle-icon">
        <div v-if="!isMobile" :class="['rocket-box', {'rocket-box-bg': isProcee}]">
          <SvgIconThemed v-if="!isProcee" icon="satellite" size="xs" />
        </div>
        <div v-if="!isMobile" class="rocket-line-box">
          <SvgIconThemed icon="rocket-line" style="width:161px;height:14px;margin-top:10px;" />
        </div>
      </div>
      <div class="item right" style="z-index:3;">
        <div class="chain-name to">
          <span>{{ toChainName }}</span>
        </div>
        <div class="chain">
          <svg-icon :iconName="showChainIcon(false)" style="width: 56px;height: 56px;"></svg-icon>
        </div>
        <div class="tx to-tx" @click="goToExplorTo">
          <template v-if="!detailData">
            <svg-icon v-if="$store.state.proceedState === 4" class="status-icon" color="#df2e2d" iconName="history_3"></svg-icon>
            <svg-icon v-else-if="$store.state.proceedState === 5" class="status-icon" color="#df2e2d" iconName="history_4"></svg-icon>
            <svg-icon v-else class="status-icon" color="#df2e2d" iconName="history_1"></svg-icon>
          </template>
          <template v-else>
            <svg-icon v-if="detailData.state === 0" class="status-icon" color="#df2e2d" iconName="history_4"></svg-icon>
            <svg-icon v-else-if="detailData.state === 1" class="status-icon" color="#df2e2d" iconName="history_2"></svg-icon>
            <svg-icon v-else class="status-icon" color="#df2e2d" iconName="history_error"></svg-icon>
          </template>
          <span>{{ ToTx }}</span>
        </div>
        <div class="switch-btn" @click="() => switchNetWork(false)">Switch Network</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { SvgIconThemed, CommBoxHeader, CommBtn } from '../../components'
import util from '../../util/util'
import { chain2icon } from '../../util'
import { compatibleGlobalWalletConf } from "../../composition/walletsResponsiveData"
import { isMobile, transferDataState, realSelectMakerInfo, web3State, saveSenderPageWorkingState } from '../../composition/hooks'

export default {
  name: 'Proceed',
  props: {
    detailData: {
      type: Object,
      required: false,
      default: null
    },
  },
  components: {
    SvgIconThemed, CommBoxHeader, CommBtn
  },
  computed: {
    isCompleted() {
      return !this.detailData && !(this.$store.state.proceedState === 1 || this.$store.state.proceedState === 2) && !(this.$store.state.proceedState === 4 || this.$store.state.proceedState === 5)
    },
    isFailed() {
      return this.detailData && !(this.detailData.state === 1 || this.detailData.state === 0)
    },
    isMobile() {
      return isMobile.value
    },
    isProcee() {
      if (this.detailData) {
        return this.detailData.state == 1
      } else {
        return this.$store.state.proceedState !== 5
      }
    },
    isLightMode() {
      return this.$store.state.themeMode === 'light'
    },
    FromChainName() {
      const chainId = this.getChainId()
      return util.chainName(chainId, this.$env.localChainID_netChainID[chainId])
    },
    toChainName() {
      const chainId = this.getChainId(false)
      return util.chainName(chainId, this.$env.localChainID_netChainID[chainId])
    },
    FromTx() {
      if (this.detailData) {
        const { fromTxHash, fromChainID } = this.detailData
        // immutablex
        if (fromChainID == 8 || fromChainID == 88) {
          return `TransferId: ${fromTxHash}`
        }
        return `Tx:${util.shortAddress(fromTxHash)}`
      } 
      
      const { proceedState, proceeding } = this.$store.state
      if (proceedState === 1) {
        return 'View on Explore'
      } else {
        // immutablex
        if (transferDataState.fromChainID == 8 || transferDataState.fromChainID == 88) {
          return `TransferId: ${proceeding.userTransfer.txid}`
        }
        console.log('FromTx: ', proceeding.userTransfer.txid)
        return `Tx:${util.shortAddress(proceeding.userTransfer.txid)}`
      }
    },
    ToTx() {
      if (this.detailData) {
        const { state, toTxHash, toChainID } = this.detailData
        if (state !== 0) {
          return 'View on Explore'
        } else {
          // immutablex
          if (toChainID == 8 || toChainID == 88) {
            return `TransferId: ${toTxHash}`
          }
          return `Tx:${util.shortAddress(toTxHash)}`
        }
      } 

      const { proceedState, proceeding } = this.$store.state
      if (proceedState < 4) {
        return 'View on Explore'
      } else {
        // immutablex
        if (transferDataState.toChainID == 8 || transferDataState.toChainID == 88) {
          return `TransferId: ${proceeding.makerTransfer.txid}`
        }
        console.log('ToTx: ', proceeding.makerTransfer.txid)
        return `Tx:${util.shortAddress(proceeding.makerTransfer.txid)}`
      }
    },
    proceedData() {
      if (this.detailData) {
        return [
          {
            title: 'Timestamp',
            desc: util.transferTimeStampToTime(this.detailData.fromTimeStamp),
          },
          {
            title: 'Value',
            desc:
              this.detailData.userAmount.toString() +
              ' ' +
              this.detailData.tokenName,
          },
        ]
      }
      return [
        {
          title: 'Timestamp',
          desc: util.transferTimeStampToTime(
            this.$store.state.proceeding.userTransfer.timeStamp
          ),
        },
        {
          title: 'Value',
          desc:
            (
              this.$store.state.proceeding.userTransfer.amount /
              10 ** realSelectMakerInfo.value.precision
            ).toFixed(6) +
            ' ' +
            transferDataState.selectTokenInfo.token,
        },
      ]
    },
  },
  methods: {
    showChainIcon(isFrom = true) {
      if (this.detailData) {
        return chain2icon(this.detailData[`${isFrom ? 'from' : 'to'}ChainID`])
      }
      return chain2icon(transferDataState[`${isFrom ? 'from' : 'to'}ChainID`])
    },
    getChainId(isFrom = true) {
      let chainID
      if (this.detailData) {
        chainID = this.detailData[`${isFrom ? 'from' : 'to'}ChainID`]
      } else {
        chainID = transferDataState[`${isFrom ? 'from' : 'to'}ChainID`]
      }
      return chainID
    },
    switchNetWork(e = true) {
      this.addChainNetWork(this.getChainId(e))
    },
    async goToExplorFrom() {
      let url;
      if (this.detailData) {
        const { accountExploreUrl } = this.$env
        const { fromChainID } = this.detailData
        let txid = this.detailData.fromTxHash
        url = this.$env.txExploreUrl[fromChainID] + txid

        // ImmutableX don't have testnet browser
        if (fromChainID == 88) {
          url = accountExploreUrl[fromChainID]
        }

        // loopring
        if (
          this.detailData.fromChainID == 9 ||
          this.detailData.fromChainID == 99
        ) {
          if (
            this.detailData.blockNum != 0 &&
            this.detailData.indexInBlock != 0 &&
            this.detailData.blockNum != undefined &&
            this.detailData.indexInBlock != undefined
          ) {
            url =
              this.$env.txExploreUrl[this.detailData.fromChainID] +
              `${this.detailData.blockNum}-${this.detailData.indexInBlock}`
          } else {
            url =
              this.$env.txExploreUrl[this.detailData.fromChainID] +
              txid +
              '-transfer'
          }
        }
        window.open(url, '_blank')
        return
      }
      
      const { fromChainID } = transferDataState
      const { accountExploreUrl, txExploreUrl } = this.$env
      if (this.$store.state.proceedState === 1) {
        let userAddress = web3State.coinbase
        if (fromChainID == 4 || fromChainID == 44) {
          userAddress = web3State.starkNet.starkNetAddress
        }
        url = accountExploreUrl[fromChainID] + userAddress

        // ImmutableX
        if (fromChainID == 8 || fromChainID == 88) {
          url = accountExploreUrl[fromChainID]
        }
      } else {
        let txid = this.$store.state.proceeding.userTransfer.txid
        url =
          txExploreUrl[fromChainID] +
          txid +
          (fromChainID == 9 || fromChainID == 99 ? '-transfer' : '')

        // ImmutableX don't have testnet browser
        if (fromChainID == 88) {
          url = accountExploreUrl[fromChainID]
        }
      }
      window.open(url, '_blank')
    },
    async goToExplorTo() {
      let data = {}
      if (this.detailData) {
        data = this.detailData
      } else {
        data = transferDataState
      }
      const { toChainID, state } = data
      const { accountExploreUrl, txExploreUrl } = this.$env
      let url = null;

      const commHandler = () => {
        let userAddress = web3State.coinbase
        if (toChainID == 4 || toChainID == 44) {
          userAddress = web3State.starkNet.starkNetAddress
        }
        url = accountExploreUrl[toChainID] + userAddress

        // ImmutableX
        if (toChainID == 8 || toChainID == 88) {
          url = accountExploreUrl[toChainID]
        }
      }
      
      if (this.detailData) {
        if (state !== 0) {
          commHandler()
        } else {
          let txid = this.detailData.toTxHash
          url = txExploreUrl[toChainID] + txid

          // ImmutableX don't have testnet browser
          if (toChainID == 88) {
            url = accountExploreUrl[toChainID]
          }

          // loopring
          if (this.detailData.toChainID == 9 || this.detailData.toChainID == 99) {
            if (
              this.detailData.blockNum != 0 &&
              this.detailData.indexInBlock != 0 &&
              this.detailData.blockNum != undefined &&
              this.detailData.indexInBlock != undefined
            ) {
              url =
                this.$env.txExploreUrl[this.detailData.toChainID] +
                `${this.detailData.blockNum}-${this.detailData.indexInBlock}`
            } else {
              url =
                this.$env.txExploreUrl[this.detailData.toChainID] +
                txid +
                '-transfer'
            }
          }
        }
      } else {
        if (this.$store.state.proceedState < 4) {
          commHandler()
        } else {
          let txid = this.$store.state.proceeding.makerTransfer.txid
          url =
            txExploreUrl[toChainID] +
            txid +
            (toChainID == 9 || toChainID == 99 ? '-transfer' : '')

          // ImmutableX don't have testnet browser
          if (toChainID == 88) {
            url = accountExploreUrl[toChainID]
          }
        }
      }
      window.open(url, '_blank')
    },
    closerButton() {
      if (this.detailData) {
        const route = this.$route
        localStorage.setItem('last_page_before_history', JSON.stringify({
          path: route.path,
          params: route.params,
          query: route.query,
        }))
        saveSenderPageWorkingState()
        this.$router.push({
          path: '/history'
        })

        this.$emit('stateChanged', '4')
      } else {
        this.$store.commit('updateProceedTxID', null)
        this.$emit('stateChanged', '1')
      }
    },
    reportError() {
      console.log('reportError')
    },
    addChainNetWork(useChainID) {
      var chain = util.getChainInfo(
        this.$env.localChainID_netChainID[useChainID]
      )
      const switchParams = {
        chainId: util.toHex(chain.chainId),
      }
      compatibleGlobalWalletConf.value.walletPayload.provider
        .request({
          method: 'wallet_switchEthereumChain',
          params: [switchParams],
        })
        .then(() => {
          // switch success
          util.showMessage('switch success', 'success')
        })
        .catch((error) => {
          console.warn(error)
          if (error.code === 4902) {
            // need add net
            const params = {
              chainId: util.toHex(chain.chainId), // A 0x-prefixed hexadecimal string
              chainName: chain.name,
              nativeCurrency: {
                name: chain.nativeCurrency.name,
                symbol: chain.nativeCurrency.symbol, // 2-6 characters long
                decimals: chain.nativeCurrency.decimals,
              },
              rpcUrls: chain.rpc,
              blockExplorerUrls: [
                chain.explorers &&
                chain.explorers.length > 0 &&
                chain.explorers[0].url
                  ? chain.explorers[0].url
                  : chain.infoURL,
              ],
            }
            compatibleGlobalWalletConf.value.walletPayload.provider
              .request({
                method: 'wallet_addEthereumChain',
                params: [params, web3State.coinbase],
              })
              .then(() => {})
              .catch((error) => {
                console.warn(error)
                util.showMessage(error.message, 'error')
              })
          } else {
            util.showMessage(error.message, 'error')
          }
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.app {
  .proceed-box {
    width: 600px;
    height: 568px;
    margin: 0 auto;
    .ProceedContent {
      padding: 0 40px;
      .chainDataContent {
        padding: 20px 41px;
        width: 520px;
        .middle-icon {
          .rocket-box {
            margin-top: 18px;
            background-size: 100%;
          }
        }
      }
    }
  }
}
.app-mobile {
  .proceed-box {
    width: 100%;
    height: 100%;
    .ProceedContent {
      padding: 0 20px;
      .chainDataContent {
        padding: 20px 6px;
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        .middle-icon-abs {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          // width: calc(100% - 12px);
          width: 100%;
          z-index: 2;
          .rocket-box {
            background-repeat: no-repeat;
            background-size: 50%;
            margin-top: 90px;
          }
          .rocket-box-bg {
            background-repeat: no-repeat;
            background-size: 100%;
            margin-top: 80px;
            background-origin: content-box;
            height: calc(100% - 90px);
            padding-left: 120px;
            padding-right: 120px;
          }
        }
        .middle-icon {
          width: 65px;
          .rocket-box {
            // margin-top: 24px;
            margin-top: 50px;
            background-size: 200%;
          }
        }
      }
    }
  }
}
.proceed-box {
  font-family: 'Inter Regular';
  border-radius: 20px;
  max-height: calc(
    100vh - 8.4rem - var(--top-nav-height) - var(--bottom-nav-height)
  );
  // max-height: calc(
  //   var(--vh, 1vh) * 100 - 8.4rem - var(--top-nav-height) -
  //     var(--bottom-nav-height)
  // );
  overflow-y: scroll;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  .ProceedContent {
    margin-top: 8px;
    position: relative;
    .contentItem {
      width: 100%;
      display: flex;
      margin-bottom: 12px;
    }
    .chainDataContent {
      height: 280px;
      border-radius: 20px;
      position: relative;
      display: flex;
      flex-direction: row;
      text-align: center;

      .item {
        width: 128px;
        height: 100%;
        z-index: 3;
        .chain-name {
          font-family: 'Inter Bold';
          font-weight: 700;
          font-size: 16px;
          line-height: 24px;
          text-align: center;
          margin-bottom: 20px;
          white-space: nowrap;
          .label {
            font-weight: 400;
            font-size: 12px;
            line-height: 24px;
            margin-right: 12px;
          }
        }
        .chain {
          width: 100px;
          height: 100px;
          border: 1px solid #1DFFF1;
          border-radius: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 14px;
        }
        .tx {
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          cursor: pointer;
          margin-top: 22px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          text-decoration: underline;
          .status-icon {
            width: 24px;
            height: 24px;
            margin-right: 4px;
          }
        }
        .tx:hover {
          text-decoration: underline;
          color: red;
        }
        .switch-btn {
          width: 128px;
          height: 28px;
          border-radius: 20px;
          font-weight: 400;
          font-size: 14px;
          line-height: 28px;
          cursor: pointer;
        }
      }
      .middle-icon {
        flex: 1;
        .rocket-box {
          height: 60px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background-repeat: no-repeat;
        }
      }
    }
  }
}
</style>
