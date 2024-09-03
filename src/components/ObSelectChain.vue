<template>
  <div id="obSelectChainBody" class="obSelectChainBody">
    <div @click.stop="stopPenetrate" class="selectChainContent">
      <div class="topItem">
        <span>Select a Chain</span>
        <div @click="closerButton" style="position: absolute; top: 0; right: 0">
          <SvgIconThemed
            style="width: 20px; height: 20px; cursor: pointer"
            iconName="close"
          />
        </div>
      </div>
      <div class="selectChainTab">
        <template v-for="tab of tabsList">
          <div
            :key="tab.key"
            :class="
              tabKey === tab.key
                ? 'selectChainItem selectChainActiveItem'
                : 'selectChainItem'
            "
            @click="selectTab(tab)"
          >
            {{ tab.label }}
          </div>
        </template>
      </div>
      <div style="width: 100%; position: relative">
        <input
          type="text"
          v-model="keyword"
          class="input"
          @input="checkKeyWord()"
          :placeholder="`Search`"
        />
        <SvgIconThemed @click="search" class="searchIcon" icon="search" />
      </div>
    </div>
    <div class="list-content-box ob-scrollbar" :key="updateTime">
      <div class="list-content">
        <template v-if="isExistChainsGroup">
          <template v-for="(chains, name) of groupChains">
            <div class="contentItem title">{{ toCapitalize(name) }}</div>
            <div
              v-for="(item, index) of chains"
              :key="name + index"
              @click="getChainInfo(item, index)"
              class="contentItem"
            >
              <div class="contentItemChain">
                <svg-icon
                  class="logo"
                  :iconName="item.localID"
                  style="margin-right: 1.5rem"
                ></svg-icon>
                <span
                  >{{ item.chain }}
                  <span class="remark">{{ remark[item.localID] }}</span></span
                >
              </div>
              <div class="contentItemBalance">
                <CommLoading
                  v-if="loading"
                  style="left: 1rem; top: 0rem"
                  width="1.5rem"
                  height="1.5rem"
                />
                <span v-else>{{ getChainBalance(item.localID) }}</span>
              </div>
            </div>
          </template>
          <div class="contentItem title">{{ toCapitalize('networks') }}</div>
          <div
            v-for="(item, index) in newChainData"
            :key="item.chain + index"
            @click="getChainInfo(item, index)"
            class="contentItem"
          >
            <div class="contentItemChain">
              <svg-icon
                class="logo"
                :iconName="item.localID"
                style="margin-right: 1.5rem"
              ></svg-icon>
              <span
                >{{ item.chain }}
                <span class="remark">{{ remark[item.localID] }}</span></span
              >
            </div>
            <div class="contentItemBalance">
              <CommLoading
                v-if="loading"
                style="left: 1rem; top: 0rem"
                width="1.5rem"
                height="1.5rem"
              />
              <span v-else>{{ getChainBalance(item.localID) }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-for="(item, index) in newChainData"
            :key="item.chain + index"
            @click="getChainInfo(item, index)"
            class="contentItem"
          >
            <div class="contentItemChain">
              <svg-icon
                class="logo"
                :iconName="item.localID"
                style="margin-right: 1.5rem"
              ></svg-icon>
              <span
                >{{ item.chain }}
                <span class="remark">{{ remark[item.localID] }}</span></span
              >
            </div>
            <div class="contentItemBalance">
              <CommLoading
                v-if="loading"
                style="left: 1rem; top: 0rem"
                width="1.5rem"
                height="1.5rem"
              />
             <span v-else> {{ getChainBalance(item.localID) }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Web3 from 'web3'
import { DydxHelper } from '../util/dydx/dydx_helper'
import { IMXHelper } from '../util/immutablex/imx_helper'
import util from '../util/util.js'
import { customSort } from '../util/index'
import { decimalNum } from '../util/decimalNum'

import { compatibleGlobalWalletConf } from '../composition/walletsResponsiveData'
import { SvgIconThemed } from './'
import {
  web3State,
  setSelectWalletDialogVisible,
  setConnectWalletGroupKey,
  transferDataState,
  isMobile
} from '../composition/hooks'
import config, { CHAIN_ID } from '../config'
import solanaHelper from '../util/solana/solana_helper'
import tonHelper from '../util/ton/ton_helper'
import fuelsHelper from '../util/fuels/fuels_helper'
import transferCalculate from '../util/transfer/transferCalculate'
import { ethers } from 'ethers'
import orbiterCryptoTool from '../util/orbiterCryptoTool'
import { PASSPHRASE } from '../const'
import { balanceList, updateBalanceList } from "../composition/hooks"
import orbiterHelper from '../util/orbiter_helper.js';

const chainConfig = config.chainConfig

const chainsSelectGroup = JSON.parse(
  process.env.VUE_APP_CHAINS_SELECT_GROUP || '{}'
)

let timer = 0
let timerT = 0
let timeGroup = 0

let time1 = 0
let time2 = 0
let localAddress = ''

export default {
  name: 'ObSelectChain',
  components: { SvgIconThemed },
  props: {
    ChainData: {
      type: Array,
      default: function () {
        return []
      },
    },
    type: String,
  },
  data() {
    const { query } = this.$route
    return {
      keyword: '',
      loadingIndex: -1,
      tabKey: 'ALL',
      updateTime: 0,
      symbol: query.token || 'ETH',
      loading: false,
    }
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
    balanceGroup () {
      return balanceList.value || {}
    },
    remark() {
      const { toChainID, selectMakerConfig } = transferDataState
      const toChainId = selectMakerConfig.toChain.chainId || toChainID
      const toArbText = this.type === 'from' && toChainId === '42161' ? '' : ''

      return {
        167000: 'Grab $PINK Airdrop',
        81457: toArbText,
        62050: toArbText,
        42766: toArbText,
        34443: toArbText,
        810180: toArbText,
        7777777: toArbText,
        169: toArbText,
        5000: toArbText,
        137: toArbText,
        534352: toArbText,
        204: toArbText,
        zksync: toArbText,
        42170: toArbText,
        70700: toArbText,
        56: toArbText,
        60808: toArbText,
        324: toArbText,
        167000: toArbText,
        11501: toArbText,
        4200: toArbText,
      }
    },
    currentWalletAddress() {
      const evmAddress =
        compatibleGlobalWalletConf.value.walletPayload.walletAddress
      return evmAddress
    },
    starknetAddress() {
      return web3State.starkNet.starkNetAddress
    },
    fuelAddress() {
      const fuelAddress = web3State.fuel.fuelAddress
      return fuelAddress
    },
    solanaAddress() {
      const solanaAddress = web3State.solana.solanaAddress
      return solanaAddress
    },
    tronAddress() {
      const tronAddress =
        web3State.tron.tronAddress
      return tronAddress
    },
    tabsList() {
      return [
        {
          key: 'ALL',
          label: 'All',
        },
        {
          key: 'ETH',
          label: 'Ethereum & L2',
        },
        {
          key: 'BTC',
          label: 'BTC L2',
        },
      ]
    },
    chainsGroup() {
      const chainsGroupL = config.chainsGroup
      const symbol = this.symbol
      let obj = {}
      for (const groupName in chainsGroupL) {
        const group = chainsGroupL?.[groupName || '']?.[this.tabKey || ''] || {}
        const list = group?.[symbol || ''] || group?.DEFAULT
        obj = {
          [groupName]: list || [],
        }
      }
      return obj
    },
    isExistChainsGroup() {
      return !!Object.keys(this.chainsGroup).length
    },
    localIdsInGroup() {
      const localIdsInGroup = Object.values(this.chainsGroup).reduce(
        (localIds, ids) => {
          localIds.push(...ids)
          return localIds
        },
        []
      )
      return localIdsInGroup || []
    },
    transferChainData: function () {
      const newArray = []
      for (let index = 0; index < this.ChainData.length; index++) {
        const item = this.ChainData[index]

        const chainData = {
          chain: util.chainName(item),
          localID: item || 1,
        }
        newArray.push(chainData)
      }
      const chainOrderIds = [
        CHAIN_ID.zksync2,
        CHAIN_ID.zksync2_test,
        CHAIN_ID.zksync,
        CHAIN_ID.zksync_test,
        CHAIN_ID.pozkevm,
        CHAIN_ID.pozkevm_test,
        CHAIN_ID.po,
        CHAIN_ID.po_test,
        CHAIN_ID.mainnet,
        CHAIN_ID.goerli,
        CHAIN_ID.ar,
        CHAIN_ID.ar_test,
        CHAIN_ID.nova,
        CHAIN_ID.loopring,
        CHAIN_ID.loopring_test,
        CHAIN_ID.op,
        CHAIN_ID.op_test,
        CHAIN_ID.zkspace,
        CHAIN_ID.zkspace_test,
        CHAIN_ID.imx,
        CHAIN_ID.imx_test,
        CHAIN_ID.metis,
        CHAIN_ID.dydx,
        CHAIN_ID.dydx_test,
        CHAIN_ID.boba,
        CHAIN_ID.starknet,
        CHAIN_ID.starknet_test,
        CHAIN_ID.bsc,
        CHAIN_ID.bsc_test,
        CHAIN_ID.solana,
        CHAIN_ID.solana_test,
        CHAIN_ID.tron_nile_test,
        CHAIN_ID.tron_shasta_test,
        CHAIN_ID.tron,
        CHAIN_ID.ton,
        CHAIN_ID.ton_test,
        CHAIN_ID.fuel,
        CHAIN_ID.fuel_test,
      ]
      return this.orderChainIds(chainOrderIds, newArray)
    },
    groupChains: function () {
      const data = {}
      for (const groupName in this.chainsGroup) {
        const chainsIds = this.chainsGroup[groupName]
        let chains = chainsIds
          .map((item) => {
            return this.transferChainData.filter(
              (option) => String(item) === String(option.localID)
            )[0]
          })
          .filter((option) => !!option)

        const list = chainsSelectGroup?.[this.tabKey]

        chains = chains.filter((item) => {
          const flag = this.tabKey === this.tabsList[0]?.key
          return (
            flag ||
            list?.some(
              (option) =>
                String(option).trim().toLocaleLowerCase() ===
                String(item?.localID).trim().toLocaleLowerCase()
            )
          )
        })

        let chainData = []

        chains.forEach((item) => {
          const flag = chainData?.some(
            (option) =>
              String(option?.localID).trim().toLocaleLowerCase() ===
              String(item?.localID).trim().toLocaleLowerCase()
          )
          if (!flag) {
            chainData = chainData.concat([item])
          }
        })

        if (this.keyword || this.keyword !== '') {
          chains = chains.filter((item) =>
            item.chain.toLowerCase().includes(this.keyword.toLowerCase())
          )
        }
        data[groupName] = chains
      }
      return data
    },
    newChainData: function () {
      let chains = this.transferChainData.filter(
        (item) =>
          !this.localIdsInGroup.find(
            (id) => String(id) === String(item.localID)
          )
      )
      if (this.keyword || this.keyword !== '') {
        chains = chains.filter((item) =>
          item.chain.toLowerCase().includes(this.keyword.toLowerCase())
        )
      }
      const chainOrderIds = [
        CHAIN_ID.mainnet,
        CHAIN_ID.ar,
        CHAIN_ID.op,
        CHAIN_ID.xlayer,
        CHAIN_ID.blast,
        CHAIN_ID.mode,
        CHAIN_ID.zora,
        CHAIN_ID.merlin,
        CHAIN_ID.bevm,
        CHAIN_ID.zksync2,
        CHAIN_ID.zksync2_test,
        CHAIN_ID.zksync,
        CHAIN_ID.zksync_test,
        CHAIN_ID.pozkevm,
        CHAIN_ID.pozkevm_test,
        CHAIN_ID.po,
        CHAIN_ID.po_test,
        CHAIN_ID.goerli,
        CHAIN_ID.ar_test,
        CHAIN_ID.nova,
        CHAIN_ID.loopring,
        CHAIN_ID.loopring_test,
        CHAIN_ID.op_test,
        CHAIN_ID.zkspace,
        CHAIN_ID.zkspace_test,
        CHAIN_ID.imx,
        CHAIN_ID.imx_test,
        CHAIN_ID.metis,
        CHAIN_ID.dydx,
        CHAIN_ID.dydx_test,
        CHAIN_ID.boba,
        CHAIN_ID.starknet,
        CHAIN_ID.starknet_test,
        CHAIN_ID.bsc,
        CHAIN_ID.bsc_test,
        CHAIN_ID.solana,
        CHAIN_ID.solana_test,
        CHAIN_ID.tron_nile_test,
        CHAIN_ID.tron_shasta_test,
        CHAIN_ID.tron,
        CHAIN_ID.ton,
        CHAIN_ID.ton_test,
      ]

      let data = customSort(chainOrderIds, chains)
      const list = chainsSelectGroup?.[this.tabKey]

      data = data.filter((item) => {
        const flag = this.tabKey === this.tabsList[0]?.key
        return (
          flag ||
          list?.some(
            (option) =>
              String(option).trim().toLocaleLowerCase() ===
              String(item?.localID).trim().toLocaleLowerCase()
          )
        )
      })

      let chainData = []

      data.forEach((item) => {
        const flag = chainData?.some(
          (option) =>
            String(option?.localID).trim().toLocaleLowerCase() ===
            String(item?.localID).trim().toLocaleLowerCase()
        )
        if (!flag) {
          chainData = chainData.concat([item])
        }
      })

      return chainData
    },
  },
  watch: {
    currentWalletAddress: function (newAddress) {
      if (localAddress !== newAddress && newAddress) {
        localAddress = newAddress
        clearTimeout(time2)
        time2 = setTimeout(() => {
          updateBalanceList(null)
          this.getBanlanceGroupCall(this.symbol)
        }, 100)
      }
    },
  },
  methods: {
    async getBalance() {
      // this.loading = true
      try {
        const tonAddress = tonHelper.account()
        const symbol = this.symbol
        const address = [
          {
            address: this.fuelAddress,
            type: 'Fuel',
          },
          {
            address: tonAddress,
            type: 'Ton',
          },
          {
            address: this.tronAddress,
            type: 'Tron',
          },
          {
            address: this.solanaAddress,
            type: 'Solana',
          },
          {
            address: this.starknetAddress,
            type: 'Starknet',
          },
          {
            address: this.currentWalletAddress,
            type: 'EVM',
          },
        ].filter((item) => !!item.address)
        // console.log('address', symbol, address)
        const respone = await fetch(
          `${process.env.VUE_APP_OPEN_URL}/sdk/chains/balance`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              address: address,
              tokens: [symbol],
            }),
          }
        )
        const res = await respone.json()
        const { result } = res || {}
        const { data, iv } = result || {}

        const decodeData = await orbiterCryptoTool.aesDecrypt(
          data,
          PASSPHRASE,
          iv
        )
        const list = JSON.parse(decodeData)
        // console.log("decodeData", JSON.parse(decodeData))
        let chainInfoList = []
        list.forEach((item) => {
          item.balancesList.forEach((option) => {
            const obj = {
              chainId: option.chainId,
              value:
                option.balances.filter((value) => value.symbol === symbol)[0]
                  ?.balance,
            }
          
            chainInfoList = chainInfoList.concat([obj])
          })
        })
        updateBalanceList({
          ...this.balanceGroup,
          [symbol]: chainInfoList
        })
        // this.loading = false
      } catch (error) {
        console.log('error', error)
        // this.loading = false
      }
    },
    show(isTo) {
      this.updateTime = +new Date()
      if(!isTo) {
        this.getBanlanceGroupCall()
      }
    },
    selectSymbol(symbol) {
      this.symbol = symbol
    },
    getChainBalance(chainId) {
      const list = this.balanceGroup[this.symbol || ""] || []
      const option = list.filter(
        (item) => item.chainId === chainId
      )[0]
      return !isNaN(option?.value) ? decimalNum(option?.value, 8, ',') : '--'
    },
    getBanlanceGroupCall() {
      clearTimeout(timeGroup)
      timeGroup = setTimeout(() => {
        this.getBalance()
      }, 50)
    },
    selectTab(tab) {
      this.tabKey = tab.key
    },
    getChainsInGroup(chainLocalIds) {
      if (!chainLocalIds) {
        return []
      }
      let chains = chainLocalIds.map((id) => {
        return this.transferChainData.find((c) => id == c.localID)
      })
      //     if (this.keyword || this.keyword !== '') {
      //     chains = chains.filter(item=> item.chain.toLowerCase().includes(this.keyword.toLowerCase()))
      // }
      return chains.filter((row) => row && row.localID)
    },
    toCapitalize(str) {
      if (!str) return ''
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    orderChainIds: function (chainOrderIds, theArray) {
      theArray.sort((chainInfo, nextChainInfo) => {
        return (
          chainOrderIds.indexOf(chainInfo.localID) -
          chainOrderIds.indexOf(nextChainInfo.localID)
        )
      })
      return theArray
    },
    closerButton() {
      ;(this.tabKey = 'ALL'), this.$emit('closeSelect')
    },
    async getChainInfo(e, index) {
      // When chain use stark system

      if (orbiterHelper.isNotEVMChain({chainId: e.localID}) && this.type === "from") {
        try {
          // starknet
          if (
            e.localID === CHAIN_ID.starknet ||
            e.localID === CHAIN_ID.starknet_test
          ) {
            const { starkIsConnected, starkNetAddress } = web3State.starkNet
            if (!starkIsConnected && !starkNetAddress) {
              setConnectWalletGroupKey('STARKNET')
              setSelectWalletDialogVisible(true)
            }
          }

          // solana
          if (
            orbiterHelper.isSolanaChain({chainId: e.localID})
          ) {
            const isConnected = web3State.solana.solanaIsConnected
            if (!isConnected) {
              setSelectWalletDialogVisible(true)
              setConnectWalletGroupKey('SOLANA')
            }
          }
          // fuel
          if ( orbiterHelper.isFuelChain({chainId: e.localID})) {
            const account = this.fuelAddress
            const isConnected = web3State.fuel.fuelIsConnected
            if (!account || !isConnected) {
              setSelectWalletDialogVisible(true)
              setConnectWalletGroupKey('FUEL')
            }
          }
          if (
           orbiterHelper.isTronChain({chainId:  e.localID})
          ) {
            const address = web3State.tron.tronAddress
            const isConnected = web3State.tron.tronIsConnected
            if (!address || !isConnected) {
              setSelectWalletDialogVisible(true)
              setConnectWalletGroupKey('TRON')
            }
          }
          // ton
          if (orbiterHelper.isTonChain({chainId: e.localID}) ) {
            const account = await tonHelper.account()
            const isConnected = await tonHelper.isConnected()
            if (!account || !isConnected) {
              await tonHelper.connect()
            }
          }
          // immutableX
          if (e.localID === CHAIN_ID.imx || e.localID === CHAIN_ID.imx_test) {
            this.loadingIndex = index
            const coinbase =
              compatibleGlobalWalletConf.value.walletPayload.walletAddress
            const imxHelper = new IMXHelper(e.localID)
            coinbase && (await imxHelper.ensureUser(coinbase))
          }

          // dydx
          if (e.localID === CHAIN_ID.dydx || e.localID === CHAIN_ID.dydx_test) {
            try {
              this.loadingIndex = index
              const coinbase =
                compatibleGlobalWalletConf.value.walletPayload.walletAddress
              const dydxHelper = new DydxHelper(
                e.localID,
                new Web3(
                  compatibleGlobalWalletConf.value.walletPayload.provider
                ),
                'MetaMask'
              )
              await dydxHelper.getDydxClient(coinbase)
            } catch (error) {
              console.error(error)
            }
          }

          this.loadingIndex = -1
        } catch (err) {
          this.$notify.error({
            title: err.message,
            duration: 3000,
          })
          this.loadingIndex = -1
          return
        }
      }
      this.$emit('getChainInfo', e)
      this.closerButton()
    },
    stopPenetrate(e) {
      e.stopPropagation
    },
    search() {},
    checkKeyWord() {},
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.app {
  .obSelectChainBody {
    width: 100%;
    height: 608px;
    max-width: 404px;
    max-height: 608px;
    overflow: hidden;
  }
}

.app-mobile {
  .obSelectChainBody {
    width: calc(100% - 30px);
    max-height: 90vh;
    height: 608px;
    overflow: hidden;
  }
}

.obSelectChainBody {
  position: relative;
  margin: 4.2rem auto 0;
  // height: calc(
  //   100vh - 8.4rem - var(--top-nav-height) - var(--bottom-nav-height)
  // );
  height: calc(
    100% - 8.4rem - var(--top-nav-height) - var(--bottom-nav-height)
  );
  border-radius: 20px;
  padding: 20px 0;
  font-family: Inter Regular;

  .selectChainContent {
    // margin: 1rem 1.5rem;
    position: relative;
    padding: 0 20px;

    .selectChainTab {
      width: 100%;
      height: 32px;
      font-size: 14px;
      border-radius: 8px;
      background-color: #f5f5f5;
      padding: 2px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 14px 0;

      .selectChainItem {
        width: 33%;
        height: 100%;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: #999999;
        font-family: Inter Regular;
      }

      .selectChainActiveItem {
        background: #ffffff;
        border-radius: 6px;
        color: #222222;
        font-weight: 700;
      }
    }

    .topItem {
      width: 100%;
      height: 2rem;
      font-size: 2rem;
      font-weight: bold;
      line-height: 2rem;
      display: flex;
      justify-content: space-between;
      padding: 0 1rem;
      margin-bottom: 18px;
      position: relative;
      text-align: left;
    }

    .input {
      position: relative;
      border-radius: 2rem;
      margin-bottom: 10px;
      height: 4rem;
      width: 100%;
      outline: none;
      font-size: 1.4rem;
      padding: 10px;
      padding-left: 48px;
      border: none;
    }

    input::placeholder {
      font-size: 1.4rem;
      font-family: 'Inter Regular';
    }

    .searchIcon {
      position: absolute;
      left: 20px;
      top: 10px;
    }
  }

  .list-content-box {
    overflow-y: scroll;
    height: calc(100% - 120px);

    .title {
      font-size: 13px;
      text-align: start;
      font-family: inherit;
      font-weight: 600;
      color: #696969;
    }
  }

  .contentItem {
    width: 100%;
    align-items: center;
    display: flex;
    position: relative;
    padding: 10px 30px;
    cursor: pointer;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    justify-content: space-between;
    font-family: Inter Regular;

    .contentItemChain {
      display: flex;
      align-items: center;

      .logo {
        width: 2.4rem;
        height: 2.4rem;
        border-radius: 50%;
        background: rgba($color: #000000, $alpha: 0.05);
        padding: 0.2rem;
      }

      .right {
        text-align: right;
        position: absolute;
        right: 0.5rem;
      }

      .remark {
        color: #f81e96;
        font-size: 12px;
      }
    }

    .contentItemBalance {
      display: flex;
      font-size: 14px;
      font-weight: 500;
      font-family: Inter Regular;
      color: #999999;
    }
  }
}

// .ant-input-affix-wrapper >>> .ant-input {
//   background-color: transparent;
//   border: 0;
// }

::v-deep .ant-input {
  background-color: transparent;
  border: 0;
  outline: none;
  color: var(--default-black);
  font-size: 1.4rem;
  height: 100%;
}

::v-deep .ant-input-affix-wrapper {
  border: none;
  background: transparent;
  outline: none;
  box-shadow: none;
}

.dark-theme {
  #obSelectChainBody {
    .selectChainTab {
      background: var(--dark-page-bg);
      .selectChainItem {
      }
      .selectChainActiveItem {
        color: #fff;
        background: var(--dark-page-box-bg);
      }
    }
  }
}
</style>
