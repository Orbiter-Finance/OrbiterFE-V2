<template>
  <div class="proceed-box">
    <CommBoxHeader :back="closerButton">{{
      detailData
        ? isFailed
          ? 'Transcation Failed'
          : 'Detail'
        : isCompleted
        ? 'Completed'
        : 'Processing'
    }}</CommBoxHeader>
    <div class="ProceedContent">
      <div v-for="item in proceedData" :key="item.title" class="contentItem">
        <span class="item-title" style="width: 100px; text-align: left">{{
          item.title
        }}</span>
        <span class="item-value right" v-if="item.desc || item.descInfo">{{
          item.desc
        }}</span>
        <CommLoading v-else class="right" width="1.2rem" height="1.2rem" />
      </div>
      <div class="chainDataContent">
        <div class="chain-info">
          <div v-if="isMobile" class="middle-icon-abs" style="z-index: 2">
            <div v-if="isProcee" :class="[{ 'rocket-box-bg': isProcee }]"></div>
            <div v-else :class="['rocket-box']">
              <SvgIconThemed v-if="!detailData" icon="satellite" size="xs" />
              <SvgIconThemed
                v-else
                iconName="succeed"
                style="width: 24px; height: 24px"
              />
            </div>
          </div>
          <div class="item left" style="z-index: 3">
            <div class="chain-name from">
              <span>{{ FromChainName }}</span>
            </div>
            <div class="chain">
              <svg-icon
                :iconName="showChainIcon()"
                style="width: 56px; height: 56px"
              ></svg-icon>
            </div>
            <div class="tx from-tx" @click="goToExplorFrom">
              <template v-if="!detailData">
                <svg-icon
                  v-if="$store.state.proceedState === 1"
                  class="status-icon"
                  color="#df2e2d"
                  iconName="history_2"
                ></svg-icon>
                <svg-icon
                  v-else-if="$store.state.proceedState === 2"
                  class="status-icon"
                  color="#df2e2d"
                  iconName="history_3"
                ></svg-icon>
                <svg-icon
                  v-else
                  class="status-icon"
                  color="#df2e2d"
                  iconName="status-success"
                ></svg-icon>
              </template>
              <svg-icon
                v-else
                class="status-icon"
                color="#df2e2d"
                iconName="status-success"
              ></svg-icon>
              <span>{{ FromTx }}</span>
            </div>
            <!--                    <div v-if="!getExplorer()" class="switch-btn" @click="() => switchNetWork()">-->
            <!--                        Switch Network-->
            <!--                    </div>-->
          </div>
          <div class="middle-icon">
            <div
              v-if="!isMobile"
              :class="['rocket-box', { 'rocket-box-bg': isProcee }]"
            >
              <SvgIconThemed
                v-if="!isProcee && !detailData"
                icon="satellite"
                size="xs"
              />
              <!-- <SvgIconThemed v-if="!isProcee && detailData" iconName="succeed" style="width:24px;height:24px;" /> -->
            </div>
            <div v-if="!isMobile" class="rocket-line-box">
              <SvgIconThemed
                icon="rocket-line"
                style="width: 161px; height: 14px; margin-top: 10px"
              />
            </div>
          </div>
          <div class="item right" style="z-index: 3">
            <div class="chain-name to">
              <span>{{ toChainName }}</span>
            </div>
            <div class="chain">
              <svg-icon
                :iconName="showChainIcon(false)"
                style="width: 56px; height: 56px"
              ></svg-icon>
            </div>
            <div class="tx to-tx" @click="goToExplorTo">
              <template v-if="!detailData">
                <svg-icon
                  v-if="$store.state.proceedState === 4"
                  class="status-icon"
                  color="#df2e2d"
                  iconName="history_3"
                ></svg-icon>
                <svg-icon
                  v-else-if="$store.state.proceedState === 5"
                  class="status-icon"
                  color="#df2e2d"
                  iconName="status-success"
                ></svg-icon>
                <svg-icon
                  v-else
                  class="status-icon"
                  color="#df2e2d"
                  iconName="history_1"
                ></svg-icon>
              </template>
              <template v-else>
                <svg-icon
                  v-if="detailData.state === 0"
                  class="status-icon"
                  color="#df2e2d"
                  iconName="status-success"
                ></svg-icon>
                <svg-icon
                  v-else-if="detailData.state === 1"
                  class="status-icon"
                  color="#df2e2d"
                  iconName="history_2"
                ></svg-icon>
                <svg-icon
                  v-else
                  class="status-icon"
                  color="#df2e2d"
                  iconName="status-error"
                ></svg-icon>
              </template>
              <span>{{ ToTx }}</span>
            </div>
            <!--                    <div class="switch-btn" @click="() => switchNetWork(false)">-->
            <!--                        Switch Network-->
            <!--                    </div>-->
           
          </div>
        </div>
        <div class="exploer-group">
          <div
          style="
            display: flex;
            align-items: center;
            justify-content: start;
            flex-wrap: wrap;
            width: 40%;
          "
        >
          <span
            @click="openIconUrl(true, item)"
            id="switch-btn-id"
            class="switch-btn-2"
            v-for="(item, index) in getExplorer()"
            :style="`${index !== 0 ? 'margin-left:4px' : ''}`"
            :key="item.name"
          >
            <svg-icon
              v-if="item.icon"
              :iconName="item.icon"
              style="width: 18px; height: 18px; margin-right: 4px"
            ></svg-icon>
            <span style="height: 20px; line-height: 20px">{{
              item.name
            }}</span>
          </span>
        </div>
        <div
        style="
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          width: 48%;
        "
      >
        <span
          @click="openIconUrl(false, item)"
          id="switch-btn-id-2"
          class="switch-btn-2"
          v-for="item in getExplorer(false)"
          :key="item.name"
        >
          <svg-icon
            v-if="item.icon"
            :iconName="item.icon"
            style="width: 18px; height: 18px; margin-right: 4px"
          ></svg-icon>
          <span style="height: 20px; line-height: 20px">{{
            item.name
          }}</span>
        </span>
      </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { SvgIconThemed, CommBoxHeader } from '../../components'
import util from '../../util/util'
import {
  isMobile,
  transferDataState,
  web3State,
  saveSenderPageWorkingState,
} from '../../composition/hooks'
import { CHAIN_ID } from '../../config'
import solanaHelper from '../../util/solana/solana_helper'
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'
import tonHelper from '../../util/ton/ton_helper'
import fuelsHelper from '../../util/fuels/fuels_helper'
import { completeTx } from '../../util/proceeding/getProceeding'
import { MQTT_HREF, MQTT_USER_NAME, MQTT_PASSWORD } from '../../const'
import mqtt from 'mqtt'
import orbiterHelper from '../../util/orbiter_helper';

let client = null

export default {
  name: 'Proceed',
  props: {
    detailData: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      connection: {
        href: MQTT_HREF || "",
        clean: true,
        connectTimeout: 30 * 1000, // ms
        reconnectPeriod: 4000, // ms
        clientId: 'mqttx_' + Math.random().toString(16).substring(2, 8),
        username: MQTT_USER_NAME || '',
        password: MQTT_PASSWORD || '',
      },
    }
  },
  components: {
    SvgIconThemed,
    CommBoxHeader,
  },
  created() {
    this.getMessageData()
  },
  computed: {
    isCompleted() {
      return (
        !this.detailData &&
        !(
          this.$store.state.proceedState === 1 ||
          this.$store.state.proceedState === 2
        ) &&
        this.$store.state.proceedState === 5
      )
    },
    isFailed() {
      return (
        this.detailData &&
        !(this.detailData.state === 1 || this.detailData.state === 0)
      )
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
      return util.chainName(chainId)
    },
    toChainName() {
      const chainId = this.getChainId(false)
      return util.chainName(chainId)
    },
    FromTx() {
      if (this.detailData) {
        const { fromTxHash, fromChainID } = this.detailData
        // immutablex
        if (fromChainID === CHAIN_ID.imx || fromChainID === CHAIN_ID.imx_test) {
          return `TransferId: ${fromTxHash}`
        }
        return `Tx:${util.shortAddress(fromTxHash)}`
      }

      const { proceedState, proceeding } = this.$store.state
      if (proceedState === 1) {
        return 'View on Explorer'
      } else {
        // immutablex
        if (
          transferDataState.fromChainID === CHAIN_ID.imx ||
          transferDataState.fromChainID === CHAIN_ID.imx_test
        ) {
          return `TransferId: ${proceeding.userTransfer.txid}`
        }
        return `Tx:${util.shortAddress(proceeding.userTransfer.txid)}`
      }
    },
    ToTx() {
      if (this.detailData) {
        const { state, toTxHash, toChainID } = this.detailData
        if (state !== 0) {
          return 'View on Explorer'
        } else {
          // immutablex
          if (toChainID === CHAIN_ID.imx || toChainID === CHAIN_ID.imx_test) {
            return `TransferId: ${toTxHash}`
          }
          return `Tx:${util.shortAddress(toTxHash)}`
        }
      }
      const { toChainID } = transferDataState
      const { proceedState, proceeding } = this.$store.state
      if (proceedState < 4) {
        return 'View on Explorer'
      } else {
        // immutablex
        if (toChainID === CHAIN_ID.imx || toChainID === CHAIN_ID.imx_test) {
          return `TransferId: ${proceeding.makerTransfer.txid}`
        }
        return `Tx:${util.shortAddress(proceeding.makerTransfer.txid)}`
      }
    },
    proceedData() {
      const { selectMakerConfig, fromCurrency } = transferDataState
      if (this.detailData) {
        return [
          {
            title: 'Timestamp',
            desc: this.detailData.fromTimeStamp,
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
              10 ** selectMakerConfig.fromChain.decimals
            ).toFixed(6) +
            ' ' +
            fromCurrency,
        },
      ]
    },
  },
  methods: {
    async getMessageData() {
      const { toChainID } = transferDataState
      const hash = this.$store?.state?.proceeding?.userTransfer?.txid || ''

      let userAddress = orbiterHelper.currentConnectChainInfo({chainId: toChainID})?.address || ""

      if (
        !MQTT_USER_NAME ||
        !MQTT_PASSWORD ||
        !hash ||
        !MQTT_HREF ||
        !userAddress
      )
        return

      const { href, ...options } = this.connection
      const connectUrl = href

      if (!client?.connected) {
        client = mqtt.connect(connectUrl, options)
      }

     try {
      client.on('connect', () => {
        util.log('Connected to MQTT broker')
        client.subscribe(
          `bridge-success/pending-confirm/address/${userAddress}`,
          (err) => {
            if (!err) {
              util.log('Subscribed to user/+/message')
            } else {
              util.log('2222222222')
            }
          }
        )
        client.on('message', (topic, message) => {
          const { sourceId, targetId } = JSON.parse(
            message || JSON.stringify({})
          )
          if (
            sourceId &&
            targetId &&
            hash?.toLocaleLowerCase() === sourceId?.toLocaleLowerCase()
          ) {
            completeTx(userAddress, sourceId, targetId)
            this.$store.commit('updateProceedingUserTransferTxid', sourceId)
            this.$store.commit('updateProceedingMakerTransferTxid', targetId)
          }
        })
      })

     } catch (error) {
      console.log("CLient Error", error)
     }

    },
   async openIconUrl(isFrom, explorerInfo) {
      // let params = explorerInfo?.icon?.toLocaleLowerCase() === "oklink" ? "?channelId=orbite" :""
      let params = "?channelId=orbite"
      let hash = ''
      if (this.detailData) {
        hash = isFrom ? this.detailData.fromTxHash : this.detailData.toTxHash
      }
      if (!hash)
        hash = isFrom
          ? this.$store.state.proceeding.userTransfer.txid
          : this.$store.state.proceeding.makerTransfer.txid
      if (hash) {
        const txUrl = ( explorerInfo.txUrl || explorerInfo.url) + '/tx' + '/' + hash + params
        window.open(txUrl, '_blank')
        return
      } else {
        if (isFrom) {
          const txUrl = (explorerInfo.txUrl || explorerInfo.url) + '/tx' + '/' + this.$store.state.proceedTXID + params
          window.open(txUrl, '_blank')
          return
        }
      }

      const { fromChainID, toChainID } = transferDataState
      const chainId = isFrom ? fromChainID : toChainID
      //   let userAddress = web3State.coinbase;
      let userAddress = orbiterHelper.currentConnectChainInfo({chainId})?.address || ""
      const accountUrl =
        explorerInfo.accountUrl || explorerInfo.url + '/address'
      const url = accountUrl + '/' + userAddress + params
      window.open(url, '_blank')
    },
    getExplorer(isFrom = true) {
      const chainId = this.getChainId(isFrom)
      const chainInfo = util.getV3ChainInfoByChainId(chainId)
      return chainInfo?.explorers?.length > 1 ? chainInfo?.explorers : null
    },
    showChainIcon(isFrom = true) {
      if (this.detailData) {
        return this.detailData[`${isFrom ? 'from' : 'to'}ChainID`] || 1
      }
      return transferDataState[`${isFrom ? 'from' : 'to'}ChainID`] || 1
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
      util.ensureWalletNetwork(this.getChainId(e))
    },
    async goToExplorFrom() {
      let url
      if (this.detailData) {
        const { fromChainID } = this.detailData
        const txid = this.detailData.fromTxHash
        url = util.getTxExploreUrl(fromChainID) + txid

        // ImmutableX don't have testnet browser
        if (fromChainID === CHAIN_ID.imx) {
          url = util.getAccountExploreUrl(fromChainID)
        }

        // loopring
        if (
          this.detailData.fromChainID === CHAIN_ID.loopring ||
          this.detailData.fromChainID === CHAIN_ID.loopring_test
        ) {
          if (
            this.detailData.blockNum != 0 &&
            this.detailData.indexInBlock != 0 &&
            this.detailData.blockNum != undefined &&
            this.detailData.indexInBlock != undefined
          ) {
            url =
              util.getTxExploreUrl(this.detailData.fromChainID) +
              `${this.detailData.blockNum}-${this.detailData.indexInBlock}`
          } else {
            url =
              util.getTxExploreUrl(this.detailData.fromChainID) +
              txid +
              '-transfer'
          }
        }
        window.open(url, '_blank')
        return
      }

      const { fromChainID } = transferDataState
      if (this.$store.state.proceedState === 1) {
        // let userAddress = web3State.coinbase
        let userAddress = orbiterHelper.currentConnectChainInfo({chainId: fromChainID})?.address || ""
        url = util.getAccountExploreUrl(fromChainID) + userAddress

        // ImmutableX
        if (fromChainID === CHAIN_ID.imx) {
          url = util.getAccountExploreUrl(fromChainID)
        }
      } else {
        const txid = this.$store.state.proceeding.userTransfer.txid

        url =
          util.getTxExploreUrl(fromChainID) +
          txid +
          (fromChainID === CHAIN_ID.loopring ||
          fromChainID === CHAIN_ID.loopring_test
            ? '-transfer'
            : '')
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
      let url = null

      const commHandler = async () => {
        // let userAddress = web3State.coinbase
        const userAddress = orbiterHelper.currentConnectChainInfo({chainId: toChainID})?.address || ""
        url = util.getAccountExploreUrl(toChainID) + userAddress

        // ImmutableX
        if (toChainID === CHAIN_ID.imx || toChainID === CHAIN_ID.imx_test) {
          url = util.getAccountExploreUrl(toChainID)
        }
      }

      if (this.detailData) {
        if (state !== 0) {
          commHandler()
        } else {
          const txid = this.detailData.toTxHash
          url = util.getTxExploreUrl(toChainID) + txid

          // ImmutableX don't have testnet browser
          if (toChainID === CHAIN_ID.imx) {
            url = util.getAccountExploreUrl(toChainID)
          }

          // loopring
          if (
            this.detailData.toChainID === CHAIN_ID.loopring ||
            this.detailData.toChainID === CHAIN_ID.loopring_test
          ) {
            if (
              this.detailData.blockNum != 0 &&
              this.detailData.indexInBlock != 0 &&
              this.detailData.blockNum != undefined &&
              this.detailData.indexInBlock != undefined
            ) {
              url =
                util.getTxExploreUrl(this.detailData.toChainID) +
                `${this.detailData.blockNum}-${this.detailData.indexInBlock}`
            } else {
              url =
                util.getTxExploreUrl(this.detailData.toChainID) +
                txid +
                '-transfer'
            }
          }
        }
      } else {
        if (this.$store.state.proceedState < 4) {
          commHandler()
        } else {
          const txid = this.$store.state.proceeding.makerTransfer.txid
          url =
            util.getTxExploreUrl(toChainID) +
            txid +
            (toChainID === CHAIN_ID.loopring ||
            toChainID === CHAIN_ID.loopring_test
              ? '-transfer'
              : '')
        }
      }
      window.open(url, '_blank')
    },
    closerButton() {
      if (this.detailData) {
        const route = this.$route
        localStorage.setItem(
          'last_page_before_history',
          JSON.stringify({
            path: route.path,
            params: route.params,
            query: route.query,
          })
        )
        saveSenderPageWorkingState()
        this.$router.push({
          path: '/history',
        })

        this.$emit('stateChanged', '4')
      } else {
        this.$store.commit('updateProceedTxID', null)
        this.$emit('stateChanged', '1')
      }
    },
  },
  async beforeDestroy() {
    if (client?.connected) {

      try {
        let userAddress = orbiterHelper.currentConnectChainInfo({chainId: fromChainID})?.address || ""
        client.unsubscribe(
          `bridge-success/pending-confirm/address/${userAddress}`,
          { qos: 0 },
          (error) => {
            if (error) {
              console.log('unsubscribe error:', error)
              return
            }
          }
        )
      } catch (error) {}
      try {
        client.end(false, () => {
          util.log('disconnected successfully')
        })
      } catch (error) {
        console.log('disconnect error:', error)
      }
    }
  },
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

        .chain-info {
          width: 100%;
        }
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
        .chain-info {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
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

        .exploer-group {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: start;
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
  // overflow-y: scroll;
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
      // height: 280px;
      border-radius: 20px;

      .chain-info {
        position: relative;
        display: flex;
        flex-direction: row;
        text-align: center;
      }

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
          border: 1px solid #1dfff1;
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

      .exploer-group {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: start;
        .switch-btn-2 {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 2px;
          padding-right: 4px;
          border: rgba(51, 51, 51, 0) 1px solid;
          height: 20px;
          border-radius: 20px;
          font-weight: 400;
          font-size: 12px;
          line-height: 20px;
          cursor: pointer;
          background-color: rgba(255, 255, 255, 1);
          margin: 2px;
        }
        #switch-btn-id:hover {
          border: rgba(34, 34, 34, 1) 1px solid;
        }
        #switch-btn-id-2:hover {
          border: rgba(34, 34, 34, 1) 1px solid;
        }
      }
    }
  }
}
.dark-theme {
  .proceed-box {
    .ProceedContent {
      .chainDataContent {
        .exploer-group {
          .switch-btn-2 {
            background-color: #282938;
            color: #ffffff;
          }

          #switch-btn-id:hover {
            border: #ffffff 1px solid;
          }
          #switch-btn-id-2:hover {
            border: #ffffff 1px solid;
          }
        }
      }
    }
  }
}
</style>
