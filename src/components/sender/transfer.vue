<template>
  <o-box-content class="senderbody" style="width: 34.5rem">
    <div class="header">
      <span class="left">Token</span>
      <button @click="selectToken" class="right" :style="{ width: tokenInfoArray.length > 1 ? '13rem' : '11rem' }">
        <img class="token_icon" v-if="this.$store.state.transferData.selectTokenInfo.icon" :src="this.$store.state.transferData.selectTokenInfo.icon" alt />
        <svg-icon v-else class="token_icon" iconName="tokenLogo"></svg-icon>

        <div class="token_name">
          <loading v-if="getMakerLoading" style="top:10px" width="1.2rem" height="1.2rem"></loading>
          <span v-else>{{ this.$store.state.transferData.selectTokenInfo.token }}</span>
        </div>
        <svg-icon v-if="tokenInfoArray.length > 1" class="arrow_icon" iconName="arrow_down"></svg-icon>
      </button>
    </div>
    <div class="content">
      <div class="subContent">
        <div class="topItem">
          <div class="left">From</div>
          <div v-if="isLogin" class="right">
            Balance:
            <span>{{ fromBalance }}</span>
          </div>
        </div>
        <div class="bottomItem">
          <div class="left" @click="changeFromChain">
            <loading v-if="getMakerLoading" style="left: 0.3rem; top: 0.2rem" width="1.2rem" height="1.2rem"></loading>
            <span v-else>
              {{
              showChainName(
              this.$store.state.transferData.fromChainID,
              this.$env.localChainID_netChainID[
              this.$store.state.transferData.fromChainID
              ]
              )
              }}
            </span>
            <svg-icon
              v-if="queryParams.sources.length > 1"
              style="
                margin-left: 0.5rem;
                margin-top: 0.5rem;
                width: 2rem;
                height: 2rem;
              "
              iconName="arrow_down"
            ></svg-icon>
          </div>
          <div style="display: flex;justify-content: center;align-items: center;">
            <loading v-if="getMakerLoading" width="1.2rem" height="1.2rem"></loading>
            <input v-else type="text" v-model="transferValue" class="right" @input="checkTransferValue()" :maxlength="18" :placeholder="`${this.userMinPrice}~${this.userMaxPrice}`" />
            <el-button @click="fromMax" class="maxBtn" style>Max</el-button>
          </div>
        </div>
      </div>
      <div class="subContent">
        <div class="topItem">
          <div class="left">To</div>
          <div v-if="isLogin" class="right">
            Balance:
            <loading v-if="toBalanceLoading" style="left: 0.3rem; top: 0.2rem" width="1.2rem" height="1.2rem"></loading>
            <span v-else>{{ toBalance }}</span>
          </div>
        </div>
        <div class="bottomItem">
          <div class="left" @click="changeToChain">
            <loading v-if="getMakerLoading" style="left: 0.3rem; top: 0.2rem" width="1.2rem" height="1.2rem"></loading>
            <span v-else>
              {{
              showChainName(
              this.$store.state.transferData.toChainID,
              this.$env.localChainID_netChainID[
              this.$store.state.transferData.toChainID
              ]
              )
              }}
            </span>

            <svg-icon
              v-if="queryParams.dests.length > 1"
              style="
                margin-left: 0.5rem;
                margin-top: 0.5rem;
                width: 2rem;
                height: 2rem;
              "
              iconName="arrow_down"
            ></svg-icon>
          </div>
          <div style="display: flex; align-items: center" class="right">
            <o-tooltip>
              <template v-slot:titleDesc>
                <span v-html="toValueToolTip"></span>
              </template>
              <svg-icon
                style="
                  width: 1.5rem;
                  height: 1.5rem;
                  margin-left: 0.5rem;
                  margin-bottom: 0.1rem;
                "
                iconName="help"
              ></svg-icon>
            </o-tooltip>

            <div>{{ toValue }}</div>
          </div>
        </div>
        <div v-if="!queryParams.fixed" class="middleImge" @click="transfer_mid">
          <img src="../../assets/middleIcon.png" style="width: 100%; height: 100%" alt />
          <!-- <svg-icon style="width:100%;height:100%"
          iconName="transfer_mid"></svg-icon>-->
        </div>
      </div>
    </div>
    <o-button style="margin: 2.5rem auto 0" width="29.5rem" height="4rem" :isDisabled="sendBtnInfo ? sendBtnInfo.disabled : 'disabled'" @click="sendTransfer">
      <span class="w700 s16" style="letter-spacing: 0.15rem">
        {{
        sendBtnInfo && sendBtnInfo.text
        }}
      </span>
    </o-button>
    <div class="notice">
      <div v-if="isShowMax" class="item" style="margin-top: 1.5rem">
        <div class="left">
          <div style="display: flex; color: #e85e24">
            <svg-icon
              style="
                width: 2.2rem;
                height: 2.2rem;
                margin-right: 0.8rem;
                margin-left: 0.2rem;
              "
              iconName="maxInfo"
            ></svg-icon>
            Makers provide {{ maxPrice }}
            {{ this.$store.state.transferData.selectTokenInfo.token }} for
            liquidity.
          </div>
        </div>
      </div>
      <div v-if="showSaveGas" class="item" style="margin-top: 1rem">
        <div class="left">
          <div style="display: flex">
            <svg-icon
              style="
                width: 1.5rem;
                height: 1.5rem;
                left: 1.5rem;
                margin-right: 0.8rem;
                margin-left: 0.3rem;
              "
              iconName="gas_cost"
            ></svg-icon>Gas Fee Saved
          </div>
          <o-tooltip placement="bottom">
            <template v-slot:titleDesc>
              <span v-html="gasFeeToolTip"></span>
            </template>
            <svg-icon
              style="
                width: 1.5rem;
                height: 1.5rem;
                margin-left: 0.5rem;
                margin-bottom: 0.1rem;
              "
              iconName="help"
            ></svg-icon>
          </o-tooltip>
        </div>
        <div class="right">
          <div class="item">
            save
            <loading v-if="saveGasLoading" style="margin: 0 1rem" width="1rem" loadingColor="#FFFFFF" height="1rem"></loading>
            <span style="margin-left: 0.4rem" v-else>{{ gasSavingMin }} ~ {{ gasSavingMax }}</span>
          </div>
        </div>
      </div>
      <div class="item" style="margin-top: 1rem">
        <div class="left">
          <div style="display: flex">
            <svg-icon
              style="
                width: 1.6rem;
                height: 1.6rem;
                margin-right: 0.8rem;
                margin-left: 0.2rem;
              "
              iconName="time_spent"
            ></svg-icon>Time Spend
          </div>
          <o-tooltip placement="bottom">
            <template v-slot:titleDesc>
              <span v-html="timeSpenToolTip"></span>
            </template>
            <svg-icon
              style="
                width: 1.5rem;
                height: 1.5rem;
                margin-left: 0.5rem;
                margin-bottom: 0.1rem;
              "
              iconName="help"
            ></svg-icon>
          </o-tooltip>
        </div>

        <div class="right">
          <loading v-if="timeSpenLoading" width="1.2rem" height="1.2rem"></loading>
          <span v-else>{{ timeSpent }}</span>
          <div class="item">
            save
            <loading v-if="saveTimeLoading" style="margin: 0 1rem" width="1rem" loadingColor="#FFFFFF" height="1rem"></loading>
            <span style="margin-left: 0.4rem" v-else>
              {{
              transferSavingTime
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <CustomPopup ref="SelectTokenPopupRef">
      <div slot="PoperContent" style="padding-bottom: var(--bottom-nav-height)">
        <SelectToken :tokenData="tokenInfoArray" v-on:getTokenInfo="getTokenInfo" v-on:closeSelect="closeSelectPopupClick()" />
      </div>
    </CustomPopup>
    <CustomPopup ref="SelectFromChainPopupRef">
      <div slot="PoperContent" style="padding-bottom: var(--bottom-nav-height)">
        <SelectChain :ChainData="fromChainArray" v-on:getChainInfo="getFromChainInfo" v-on:closeSelect="closeFromChainPopupClick()" />
      </div>
    </CustomPopup>
    <CustomPopup ref="SelectToChainPopupRef">
      <div slot="PoperContent" style="padding-bottom: var(--bottom-nav-height)">
        <SelectChain :ChainData="toChainArray" v-on:getChainInfo="getToChainInfo" v-on:closeSelect="closeToChainPopupClick()" />
      </div>
    </CustomPopup>
  </o-box-content>
</template>

<script>
import SelectToken from '../popup/selectToken/selectToken.vue'
import SelectChain from '../popup/selectChain/selectChain.vue'
import CustomPopup from '../popup/bottomPop'
import Loading from '../loading/loading.vue'
import makerInfo from '../../core/routes/makerInfo'
import util from '../../util/util'
// import BigNumber from "bignumber.js";
import check from '../../util/check/check'
import transferCalculate from '../../util/transfer/transferCalculate'
import Middle from '../../util/middle/middle'
import orbiterCore from '../../orbiterCore'
import BigNumber from 'bignumber.js'
import config from '../../config'
import { exchangeToUsd } from '../../util/coinbase'
import { IMXHelper } from '../../util/immutablex/imx_helper'

const queryParamsChainMap = {
  'Mainnet': 1,
  'Arbitrum': 2,
  'ZkSync': 3,
  'StarkNet': 4,
  'Polygon': 6,
  'Optimism': 7,
  'ImmutableX': 8,
  'Rinkeby': 5,
  'Arbitrum(R)': 22,
  'ZkSync(R)': 33,
  'StarkNet(R)': 44,
  'Polygon(R)': 66,
  'Optimism(K)': 77,
  'Loopring': 9,
  'Loopring(G)': 99,
  'ImmutableX(R)': 88
}

export default {
  name: 'Transfer',
  props: {},
  components: {
    SelectToken,
    SelectChain,
    CustomPopup,
    Loading,
  },
  data() {
    return {
      // loading
      getMakerLoading: true,
      timeSpenLoading: false,
      gasCostLoading: false,
      originGasLoading: false,

      saveTimeLoading: false,

      c1Balance: 0,
      c2Balance: 0,
      originGasCost: 0,

      makerInfoList: '',
      fromChainArray: [],
      toChainArray: [],
      tokenInfoArray: [],

      transferValue: '',

      exchangeToUsdPrice: 0,
    }
  },
  asyncComputed: {
    async userMaxPrice() {
      if (!this.isLogin) {
        return this.$store.getters.realSelectMakerInfo.maxPrice
      }
      // check selectMakerInfo
      let selectMakerInfo = this.$store.getters.realSelectMakerInfo
      if (selectMakerInfo.precision === undefined) {
        return '0'
      }

      // check fromBalance
      if (!this.fromBalance) {
        return '0'
      }

      const transferGasFee =
        (await transferCalculate.getTransferGasLimit(
          this.$store.state.transferData.fromChainID,
          selectMakerInfo.makerAddress,
          selectMakerInfo.t1Address
        )) || 0

      let avalibleDigit = orbiterCore.getDigitByPrecision(
        selectMakerInfo.precision
      )
      let opBalance = 10 ** -avalibleDigit
      let useBalanle = new BigNumber(this.fromBalance)
        .minus(new BigNumber(selectMakerInfo.tradingFee))
        .minus(new BigNumber(opBalance))
        .minus(new BigNumber(transferGasFee))
      let userMax =
        useBalanle.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN) > 0
          ? useBalanle.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN)
          : new BigNumber(0)
      let max =
        userMax.comparedTo(new BigNumber(selectMakerInfo.maxPrice)) > 0
          ? new BigNumber(selectMakerInfo.maxPrice)
          : userMax
      if (
        (selectMakerInfo.c1ID == 9 ||
          selectMakerInfo.c1ID == 99 ||
          selectMakerInfo.c2ID == 9 ||
          selectMakerInfo.c2ID == 99) &&
        selectMakerInfo.precision == 18
      ) {
        max = max.decimalPlaces(5, BigNumber.ROUND_DOWN)
      }
      return max.toString()
    },

    async makerMaxBalance() {
      const selectMakerInfo = this.$store.getters.realSelectMakerInfo
      let makerMaxBalance = 0
      try {
        const _balance = await this.getBalance(
          selectMakerInfo.makerAddress,
          selectMakerInfo.c2ID,
          selectMakerInfo.t2Address,
          selectMakerInfo.tName,
          selectMakerInfo.precision
        )
        if (_balance > 0) {
          // Max use maker balance's 95%, because it transfer need gasfee(also zksync need changePubKey fee)
          makerMaxBalance = _balance * 0.95
        }
      } catch (err) {
        console.error('Get maker balance error:', err.message)
      }
      return makerMaxBalance
    },
  },
  computed: {
    queryParams() {
      const { query } = this.$route
      const { referer } = query
      let { token, tokens, amount, fixed } = query
      amount = new BigNumber(amount)
      tokens = !tokens ? [] : tokens.split(',')

      const getMapChainId = (chainName) => {
        if (!chainName) {
          return 0
        }

        for (const key in queryParamsChainMap) {
          if (util.equalsIgnoreCase(key, chainName)) {
            return queryParamsChainMap[key]
          }
        }
        return 0
      }
      let source = getMapChainId(query.source)
      let dest = getMapChainId(query.dest)

      const getMapChainIds = (chainNames) => {
        const chainIds = []

        if (!chainNames) {
          return chainIds
        }

        for (const chainName of chainNames.split(',')) {
          const chainId = getMapChainId(chainName)
          if (chainId) {
            chainIds.push(chainId)
          }
        }

        return chainIds
      }
      let sources = getMapChainIds(query.sources)
      let dests = getMapChainIds(query.dests)

      // Tidy source(s) and dest(s)
      const tidyChains = (chainIds) => {
        const newChains = []
        const allChains = []
        if (this.makerInfoList) {
          for (const makerInfo of this.makerInfoList) {
            if (allChains.indexOf(makerInfo.c1ID) == -1) {
              allChains.push(makerInfo.c1ID)
            }
            if (allChains.indexOf(makerInfo.c2ID) == -1) {
              allChains.push(makerInfo.c2ID)
            }
          }

          for (const item of chainIds) {
            if (allChains.indexOf(item) > -1 && newChains.indexOf(item) == -1) {
              newChains.push(item)
            }
          }
        }

        // If newChains empty, return allChains
        if (newChains.length == 0) {
          return allChains
        }

        return newChains
      }
      sources = tidyChains(sources)
      dests = tidyChains(dests)
      if (sources.length == 1 && dests.length == 1 && sources[0] == dests[0]) {
        // Example: sources=[1], dests=[1], invalid, reset them!
        sources = []
        dests = []
      }

      if (source > 0 && sources.length > 0 && sources.indexOf(source) == -1) {
        source = 0
      }
      if (dest > 0 && dests.length > 0 && dests.indexOf(dest) == -1) {
        dest = 0
      }
      if (source <= 0 && sources.length > 0) {
        source = sources[0]
      }
      if (dest <= 0 && dests.length > 0) {
        dest = dests[0]
      }
      if (dests.length == 1 && sources.length > 1) {
        // When dests only 1 item: A, remove sources A item
        const _index = sources.indexOf(dests[0])
        if (_index > -1) {
          sources.splice(_index, 1)

          // When source same as dests[0], set source=sources[0]
          if (source == dests[0]) {
            source = sources[0]
          }
        }
      }
      if (dests.length > 0 && dests[0] == source) {
        source = 0
      }
      if (source == dest) {
        dest = 0
      }

      // Tidy tokens
      const tidyTokens = []
      if (this.makerInfoList) {
        for (const _token of tokens) {
          if (
            this.makerInfoList.findIndex((makerInfo) =>
              util.equalsIgnoreCase(makerInfo.tName, _token)
            ) > -1
          ) {
            tidyTokens.push(_token)
          }
        }
      }

      // Tidy
      if (!token) {
        token = tokens?.[0] || ''
      }
      if (amount.comparedTo(0) == 1) {
        amount = amount.toFixed()
      } else {
        amount = ''
      }
      fixed = fixed == 1 // To boolean

      return {
        referer,
        source,
        dest,
        token,
        tokens: tidyTokens,
        amount,
        fixed,
        sources,
        dests,
      }
    },
    sendBtnInfo() {
      let selectMakerInfo = this.$store.getters.realSelectMakerInfo
      let avalibleDigit = orbiterCore.getDigitByPrecision(
        selectMakerInfo.precision
      )
      let opBalance = 10 ** -avalibleDigit
      let useBalanle = new BigNumber(this.fromBalance)
        .minus(new BigNumber(selectMakerInfo.tradingFee))
        .minus(new BigNumber(opBalance))
      let userMax =
        useBalanle.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN) > 0
          ? useBalanle.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN)
          : new BigNumber(0)
      let makerMax = new BigNumber(this.maxPrice)
      let makerMin = new BigNumber(this.userMinPrice)
      let transferValue = new BigNumber(this.transferValue)

      const info = {
        text: 'CONNECT A WALLET',
        disabled: null,
      }
      if (this.isLogin) {
        info.text = 'SEND'

        if (transferValue.comparedTo(0) < 0) {
          info.disabled = 'disabled'
        } else if (transferValue.comparedTo(this.userMaxPrice) > 0) {
          info.disabled = 'disabled'
        }
        if (transferValue.comparedTo(userMax) > 0) {
          info.text = 'INSUFFICIENT FUNDS'
        } else if (transferValue.comparedTo(makerMax) > 0) {
          info.text = 'INSUFFICIENT LIQUIDITY'
        } else if (transferValue.comparedTo(makerMin) < 0) {
          info.text = 'INSUFFICIENT FUNDS'
          info.disabled = 'disabled'
        } else if (transferValue.comparedTo(0) > 0 && this.toValue <= 0) {
          info.text = 'INSUFFICIENT FUNDS'
          info.disabled = 'disabled'
        } else if (this.toValue > 0 && this.toValue > this.makerMaxBalance) {
          console.warn('this.toValue =', this.toValue)
          console.warn('this.makerMaxBalance =', this.makerMaxBalance)
          info.text = 'INSUFFICIENT LIQUIDITY'
          info.disabled = 'disabled'
        }
      }

      return info
    },
    maxPrice() {
      return this.$store.getters.realSelectMakerInfo.maxPrice
    },
    isShowMax() {
      return new BigNumber(this.transferValue).comparedTo(
        new BigNumber(this.$store.getters.realSelectMakerInfo.maxPrice)
      ) > 0
        ? true
        : false
    },

    userMinPrice() {
      return this.$store.getters.realSelectMakerInfo.minPrice
    },
    realTransferValue() {
      return transferCalculate.realTransferOPID()
    },
    realPtext() {
      let ptextResult = orbiterCore.getPTextFromTAmount(
        this.$store.state.transferData.fromChainID,
        this.realTransferValue
      )
      if (ptextResult.state) {
        return ptextResult.pText
      } else {
        return '0'
      }
    },
    toValueToolTip() {
      let value = this.$store.getters.realSelectMakerInfo?.gasFee || 0
      value = parseFloat((value / 10).toFixed(2))
      return `Sender will pay a ${value}% trading fee for each transfer.`
    },
    securityToolTip() {
      return `In Orbiter, each transaction will have a security code. The code is attached to the end of the transfer amount in the form of a four-digit number to specify the necessary information when you transfer. If a Maker is dishonest, the security code will become the necessary evidence for you to claim money from margin contracts.`
    },
    timeSpenToolTip() {
      return `It will take about ${this.originTimeSpent
        ? this.originTimeSpent.replace('~', '')
        : this.originTimeSpent
        } by traditional way, but only take about ${this.timeSpent ? this.timeSpent.replace('~', '') : this.timeSpent
        } with Orbiter.`
    },
    gasFeeToolTip() {
      const gasFee = `<b>The cost before using Orbiter</b><br />Gas Fee: $${this.originGasCost.toFixed(
        2
      )}<br />`
      const tradingFee = ` <br /><b>The cost after using Orbiter</b><br />Trading Fee: $${(
        this.orbiterTradingFee * this.exchangeToUsdPrice
      ).toFixed(2)}`
      const withholdingGasFee = `<br />Withholding Fee: $${this.$store.getters.realSelectMakerInfo
        ? (
          this.$store.getters.realSelectMakerInfo.tradingFee *
          this.exchangeToUsdPrice
        ).toFixed(2)
        : 0
        }`
      const total = `<br /><br /><b>Total: $${(
        this.gasTradingTotal * this.exchangeToUsdPrice
      ).toFixed(2)}</b>`

      return gasFee + tradingFee + withholdingGasFee + total
    },
    isLogin() {
      return (
        this.$store.state.web3.isInstallMeta &&
        this.$store.state.web3.isInjected &&
        this.$store.state.web3.localLogin
      )
    },
    toValue() {
      if (
        this.transferValue === '' ||
        this.$store.getters.realSelectMakerInfo === ''
      ) {
        return '0'
      }
      return orbiterCore.getToAmountFromUserAmount(
        new BigNumber(this.transferValue).plus(
          new BigNumber(this.$store.getters.realSelectMakerInfo.tradingFee)
        ),
        this.$store.getters.realSelectMakerInfo,
        false
      )
    },
    fromBalanceLoading() {
      if (this.fromBalance === null) {
        return true
      }
      return false
    },
    toBalanceLoading() {
      if (this.toBalance === null) {
        return true
      }
      return false
    },
    fromBalance() {
      if (
        this.$store.state.transferData.selectMakerInfo.c1ID ===
        this.$store.state.transferData.fromChainID
      ) {
        return this.c1Balance
      } else {
        return this.c2Balance
      }
    },
    toBalance() {
      if (
        this.$store.state.transferData.selectMakerInfo.c1ID ===
        this.$store.state.transferData.fromChainID
      ) {
        return this.c2Balance
      } else {
        return this.c1Balance
      }
    },
    gasCost() {
      if (
        this.$store.state.transferData.fromChainID === 3 ||
        this.$store.state.transferData.fromChainID === 33
      ) {
        if (this.$store.state.transferData.selectTokenInfo.token !== 'ETH') {
          return (
            Math.ceil(Number(this.$store.state.transferData.gasFee * 10)) / 10
          ).toFixed(2)
        }
      }

      return (
        Math.ceil(
          this.$store.state.transferData.gasFee *
          this.$store.state.transferData.ethPrice *
          10
        ) / 10
      ).toFixed(2)
    },
    timeSpent() {
      return transferCalculate.transferSpentTime(
        this.$store.state.transferData.fromChainID,
        this.$store.state.transferData.toChainID
      )
    },
    originTimeSpent() {
      return transferCalculate.transferOrginTime(
        this.$store.state.transferData.fromChainID,
        this.$store.state.transferData.toChainID
      )
    },
    orbiterTradingFee() {
      let selectMakerInfo = this.$store.getters.realSelectMakerInfo
      let tradingFee = new BigNumber(
        this.transferValue ? this.transferValue : 0
      )
        .multipliedBy(new BigNumber(selectMakerInfo.gasFee))
        .dividedBy(new BigNumber(1000))
      let digit = orbiterCore.getDigitByPrecision(selectMakerInfo.precision)
      let tradingFee_fix = tradingFee.decimalPlaces(digit, BigNumber.ROUND_UP)
      return tradingFee_fix
    },
    gasTradingTotal() {
      let selectMakerInfo = this.$store.getters.realSelectMakerInfo
      let gasFee = new BigNumber(selectMakerInfo.tradingFee)
      return gasFee.plus(this.orbiterTradingFee).toFixed(6)
    },
    gasSavingMax() {
      let savingValue =
        this.originGasCost - this.gasTradingTotal * this.exchangeToUsdPrice
      if (savingValue < 0) {
        savingValue = 0
      }
      let savingTokenName = '$'
      return savingTokenName + savingValue.toFixed(2).toString()
    },
    showSaveGas() {
      let savingValue =
        this.originGasCost - this.gasTradingTotal * this.exchangeToUsdPrice
      if (savingValue > 0) {
        return true
      }
      return false
    },
    gasSavingMin() {
      let savingValue =
        this.originGasCost -
        this.gasTradingTotal * this.exchangeToUsdPrice -
        this.gasCost.toString()
      if (savingValue < 0) {
        savingValue = 0
      }
      let savingTokenName = '$'
      return savingTokenName + savingValue.toFixed(2).toString()
    },
    saveGasLoading() {
      return this.originGasLoading
    },
    transferSavingTime() {
      return transferCalculate.transferSavingTime(
        this.$store.state.transferData.fromChainID,
        this.$store.state.transferData.toChainID
      )
    },
  },
  watch: {
    queryParams: function (nv) {
      // When transferValue is empty, set it = nv.amount
      if (this.transferValue <= 0) {
        this.transferValue = nv.amount
      }
      this.initChainArray()
    },
    makerInfoList: function (newValue, oldValue) {
      if (oldValue === '' && newValue !== '') {
        this.initChainArray()
      }
    },
    '$store.state.web3.coinbase': function (newValue, oldValue) {
      if (!newValue || newValue === '0x') {
        this.c1Balance = 0
        this.c2Balance = 0
      }
      if (oldValue !== newValue && newValue !== '0x') {
        this.c1Balance = null
        this.c2Balance = null
        let selectMakerInfo = this.$store.state.transferData.selectMakerInfo
        transferCalculate
          .getTransferBalance(
            selectMakerInfo.c1ID,
            selectMakerInfo.t1Address,
            selectMakerInfo.tName,
            this.$store.state.web3.coinbase
          )
          .then((response) => {
            this.c1Balance = (
              response /
              10 ** selectMakerInfo.precision
            ).toFixed(6)
          })
          .catch((error) => {
            console.log(error)
            return
          })
        transferCalculate
          .getTransferBalance(
            selectMakerInfo.c2ID,
            selectMakerInfo.t2Address,
            selectMakerInfo.tName,
            this.$store.state.web3.coinbase
          )
          .then((response) => {
            this.c2Balance = (
              response /
              10 ** selectMakerInfo.precision
            ).toFixed(6)
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        this.c1Balance = 0
        this.c2Balance = 0
      }
    },
    '$store.state.transferData.selectMakerInfo': function (newValue, oldValue) {
      this.updateExchangeToUsdPrice()
      if (this.isLogin && oldValue !== newValue) {
        this.c1Balance = null
        this.c2Balance = null
        if (
          newValue.c1ID == 9 ||
          newValue.c1ID == 99 ||
          newValue.c2ID == 9 ||
          newValue.c2ID == 99
        ) {
          this.checkTransferValue()
        }
        transferCalculate
          .getTransferBalance(
            newValue.c1ID,
            newValue.t1Address,
            newValue.tName,
            this.$store.state.web3.coinbase
          )
          .then((response) => {
            this.c1Balance = (response / 10 ** newValue.precision).toFixed(6)
          })
          .catch((error) => {
            console.log(error)
          })
        transferCalculate
          .getTransferBalance(
            newValue.c2ID,
            newValue.t2Address,
            newValue.tName,
            this.$store.state.web3.coinbase
          )
          .then((response) => {
            this.c2Balance = (response / 10 ** newValue.precision).toFixed(6)
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    '$store.state.transferData.fromChainID': function (newValue) {
      this.toChainArray = []
      this.makerInfoList.filter((makerInfo) => {
        if (
          makerInfo.c1ID === newValue &&
          this.toChainArray.indexOf(makerInfo.c2ID) === -1
        ) {
          // dests fiter
          if (
            this.queryParams.dests.length <= 0 ||
            this.queryParams.dests.indexOf(makerInfo.c2ID) > -1
          ) {
            this.toChainArray.push(makerInfo.c2ID)
          }
        }
        if (
          makerInfo.c2ID === newValue &&
          this.toChainArray.indexOf(makerInfo.c1ID) === -1
        ) {
          if (
            this.queryParams.dests.length <= 0 ||
            this.queryParams.dests.indexOf(makerInfo.c1ID) > -1
          ) {
            this.toChainArray.push(makerInfo.c1ID)
          }
        }
      })
      if (
        this.toChainArray.indexOf(this.$store.state.transferData.toChainID) ===
        -1
      ) {
        let _toChainID = this.toChainArray[0]
        if (
          this.queryParams.dest > 0 &&
          this.toChainArray.indexOf(this.queryParams.dest) > -1
        ) {
          // When dest > 0 and query params dest at this.toChainArray
          _toChainID = this.queryParams.dest
        }
        this.$store.commit('updateTransferToChainID', _toChainID)
      } else {
        this.tokenInfoArray = []
        this.makerInfoList.filter((makerInfo) => {
          const { fromChainID, toChainID } = this.$store.state.transferData
          const pushToken = (_fromChainID, _toChainID) => {
            if (_fromChainID !== fromChainID || _toChainID !== toChainID) {
              return
            }

            const { tokens } = this.queryParams
            if (
              tokens.length > 0 &&
              tokens.findIndex((_token) =>
                util.equalsIgnoreCase(_token, makerInfo.tName)
              ) == -1
            ) {
              return
            }

            if (
              this.tokenInfoArray.findIndex(
                (tokenInfo) => tokenInfo.token === makerInfo.tName
              ) == -1
            ) {
              this.tokenInfoArray.push({
                icon: config.getTokenIcon(makerInfo.tName),
                token: makerInfo.tName,
                amount: 0,
              })
            }
          }
          pushToken(makerInfo.c1ID, makerInfo.c2ID)
          pushToken(makerInfo.c2ID, makerInfo.c1ID)
        })

        // if can's find, use first; else find same name token's makerInfo
        if (
          this.tokenInfoArray.findIndex(
            (item) =>
              item.token == this.$store.state.transferData.selectTokenInfo.token
          ) === -1
        ) {
          let defaultIndex = this.tokenInfoArray.findIndex((item) =>
            util.equalsIgnoreCase(item.token, this.queryParams.token)
          )
          if (defaultIndex < 0) {
            defaultIndex = 0
          }

          this.$store.commit(
            'updateTransferTokenInfo',
            this.tokenInfoArray[defaultIndex]
          )
        } else {
          this.makerInfoList.filter((makerInfo) => {
            if (
              (makerInfo.c1ID === this.$store.state.transferData.fromChainID &&
                makerInfo.c2ID === this.$store.state.transferData.toChainID &&
                makerInfo.tName ===
                this.$store.state.transferData.selectTokenInfo.token) ||
              (makerInfo.c2ID === this.$store.state.transferData.fromChainID &&
                makerInfo.c1ID === this.$store.state.transferData.toChainID &&
                makerInfo.tName ===
                this.$store.state.transferData.selectTokenInfo.token)
            ) {
              this.$store.commit('updateTransferMakerInfo', makerInfo)
            }
          })
        }
        if (newValue) {
          this.updateOriginGasCost()
        }
      }
      if (newValue) {
        let that = this
        this.gasCostLoading = true
        transferCalculate
          .transferSpentGas(this.$store.state.transferData.fromChainID)
          .then((response) => {
            this.$store.commit('updateTransferGasFee', response)
            that.gasCostLoading = false
          })
          .catch((error) => {
            that.gasCostLoading = false
            console.log('GetGasFeeError =', error)
          })
      }
    },
    '$store.state.transferData.toChainID': function (newValue) {
      this.tokenInfoArray = []
      this.makerInfoList.filter((makerInfo) => {
        const { fromChainID, toChainID } = this.$store.state.transferData
        const pushToken = (_fromChainID, _toChainID) => {
          if (_fromChainID !== fromChainID || _toChainID !== toChainID) {
            return
          }

          const { tokens } = this.queryParams
          if (
            tokens.length > 0 &&
            tokens.findIndex((_token) =>
              util.equalsIgnoreCase(_token, makerInfo.tName)
            ) == -1
          ) {
            return
          }

          if (
            this.tokenInfoArray.findIndex(
              (tokenInfo) => tokenInfo.token === makerInfo.tName
            ) == -1
          ) {
            this.tokenInfoArray.push({
              icon: config.getTokenIcon(makerInfo.tName),
              token: makerInfo.tName,
              amount: 0,
            })
          }
        }
        pushToken(makerInfo.c1ID, makerInfo.c2ID)
        pushToken(makerInfo.c2ID, makerInfo.c1ID)
      })

      if (
        this.tokenInfoArray.findIndex(
          (item) =>
            item.token == this.$store.state.transferData.selectTokenInfo.token
        ) === -1
      ) {
        let defaultIndex = this.tokenInfoArray.findIndex((item) =>
          util.equalsIgnoreCase(item.token, this.queryParams.token)
        )
        if (defaultIndex < 0) {
          defaultIndex = 0
        }

        this.$store.commit(
          'updateTransferTokenInfo',
          this.tokenInfoArray[defaultIndex]
        )
      } else {
        this.makerInfoList.filter((makerInfo) => {
          if (
            (makerInfo.c1ID === this.$store.state.transferData.fromChainID &&
              makerInfo.c2ID === this.$store.state.transferData.toChainID &&
              makerInfo.tName ===
              this.$store.state.transferData.selectTokenInfo.token) ||
            (makerInfo.c2ID === this.$store.state.transferData.fromChainID &&
              makerInfo.c1ID === this.$store.state.transferData.toChainID &&
              makerInfo.tName ===
              this.$store.state.transferData.selectTokenInfo.token)
          ) {
            this.$store.commit('updateTransferMakerInfo', makerInfo)
          }
        })
      }

      if (newValue) {
        this.updateOriginGasCost()
      }
    },
    '$store.state.transferData.selectTokenInfo': function (newValue) {
      this.makerInfoList.filter((makerInfo) => {
        if (
          (makerInfo.c1ID === this.$store.state.transferData.fromChainID &&
            makerInfo.c2ID === this.$store.state.transferData.toChainID &&
            makerInfo.tName === newValue.token) ||
          (makerInfo.c2ID === this.$store.state.transferData.fromChainID &&
            makerInfo.c1ID === this.$store.state.transferData.toChainID &&
            makerInfo.tName === newValue.token)
        ) {
          this.$store.commit('updateTransferMakerInfo', makerInfo)
        }
      })

      this.updateOriginGasCost()
    },
    
    transferValue: function (newValue) {
      if (this.$store.state.transferData.transferValue !== newValue) {
        this.$store.commit('updateTransferValue', newValue)
      }
    },
  },
  async mounted() {
    if (!this.makerInfoList) {
      this.getMakerLoading = true
      await this.getMakerList()
      this.getMakerLoading = false
    }

    const updateETHPrice = async () => {
      transferCalculate
        .getTokenConvertUsd('ETH')
        .then((response) => {
          this.$store.commit('updateETHPrice', response)
        })
        .catch((error) => {
          console.log('GetETHPriceError =', error)
        })
    }
    updateETHPrice()

    setInterval(async () => {
      let selectMakerInfo = this.$store.state.transferData.selectMakerInfo
      if (selectMakerInfo && this.isLogin) {
        this.getBalance(
          this.$store.state.web3.coinbase,
          selectMakerInfo.c1ID,
          selectMakerInfo.t1Address,
          selectMakerInfo.tName,
          selectMakerInfo.precision
        ).then((v) => {
          if (v) {
            this.c1Balance = v
          }
        })

        this.getBalance(
          this.$store.state.web3.coinbase,
          selectMakerInfo.c2ID,
          selectMakerInfo.t2Address,
          selectMakerInfo.tName,
          selectMakerInfo.precision
        ).then((v) => {
          if (v) {
            this.c2Balance = v
          }
        })
      }
      updateETHPrice()
      this.updateExchangeToUsdPrice()
    }, 10 * 1000)
    this.transferValue = this.queryParams.amount
  },
  created() {
    setInterval(async () => {
      await this.getMakerList()
    }, 30 * 1000)
  },
  methods: {
    async getMakerList() {
      const getMakerInfoFromGraphReq = {
        maker: '0',
      }
      try {
        const response = await makerInfo.getMakerInfoFromGraph(getMakerInfoFromGraphReq, true)
        if (response.code === 0) {
          this.makerInfoList = response.data
        }
      } catch (error) {
        console.log('error =', error)
      }
    },
    initChainArray() {
      this.fromChainArray = []
      this.makerInfoList.filter((makerInfo) => {
        if (this.fromChainArray.indexOf(makerInfo.c1ID) === -1) {
          // sources fiter
          if (
            this.queryParams.sources.length <= 0 ||
            this.queryParams.sources.indexOf(makerInfo.c1ID) > -1
          ) {
            this.fromChainArray.push(makerInfo.c1ID)
          }
        }
        if (this.fromChainArray.indexOf(makerInfo.c2ID) === -1) {
          if (
            this.queryParams.sources.length <= 0 ||
            this.queryParams.sources.indexOf(makerInfo.c2ID) > -1
          ) {
            this.fromChainArray.push(makerInfo.c2ID)
          }
        }
      })

      // default from chain id
      let fromChainID = this.fromChainArray[0]
      if (this.queryParams.source) {
        for (const item of this.fromChainArray) {
          if (item == this.queryParams.source) {
            fromChainID = item
            break
          }
        }
      }

      this.$store.commit('updateTransferFromChainID', fromChainID)
    },
    fromMax() {
      if (!this.isLogin) {
        this.transferValue = '0'
        return
      }
      let selectMakerInfo = this.$store.getters.realSelectMakerInfo
      let avalibleDigit = orbiterCore.getDigitByPrecision(
        selectMakerInfo.precision
      )
      let opBalance = 10 ** -avalibleDigit
      let useBalanle = new BigNumber(this.fromBalance)
        .minus(new BigNumber(selectMakerInfo.tradingFee))
        .minus(new BigNumber(opBalance))
      let userMax =
        useBalanle.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN) > 0
          ? useBalanle.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN)
          : new BigNumber(0)
      let max =
        userMax.comparedTo(new BigNumber(this.userMaxPrice)) > 0
          ? new BigNumber(this.userMaxPrice)
          : userMax
      if (
        (selectMakerInfo.c1ID == 9 ||
          selectMakerInfo.c1ID == 99 ||
          selectMakerInfo.c2ID == 9 ||
          selectMakerInfo.c2ID == 99) &&
        selectMakerInfo.precision == 18
      ) {
        max = max.decimalPlaces(5, BigNumber.ROUND_DOWN)
      }
      this.transferValue = max.toString()
    },
    showChainName(localChainID, netChainID) {
      return util.chainName(localChainID, netChainID)
    },
    transfer_mid() {
      const { fromChainID, toChainID, selectTokenInfo } =
        this.$store.state.transferData
      this.$store.commit('updateTransferFromChainID', toChainID)
      this.$store.commit('updateTransferTokenInfo', selectTokenInfo)

      // Wait toChainArray updated
      this.$nextTick(() => {
        let _toChainID = fromChainID
        if (this.toChainArray.indexOf(_toChainID) == -1) {
          _toChainID = this.toChainArray[0]
        }
        this.$store.commit('updateTransferToChainID', _toChainID)
      })

      // Transfer query params
      const { path, query } = this.$route
      let { source, dest, sources, dests } = query
      if (source || dest || sources || dests) {
        // When only one is noempty, do it
        //  - Change query params, will trigger queryParams computed
        //  - If query no change, don't replace
        const newQuery = {
          ...query,
          source: dest || '',
          dest: source || '',
          sources: dests || '',
          dests: sources || '',
        }
        const isSame = (v1, v2) => {
          if ((v1 == '' || v1 == undefined) && (v2 == '' || v2 == undefined)) {
            return true
          }
          return v1 == v2
        }
        if (
          !isSame(newQuery.source, query.source) ||
          !isSame(newQuery.dest, query.dest) ||
          !isSame(newQuery.sources, query.sources) ||
          !isSame(newQuery.dests, query.dests)
        ) {
          this.$router.replace({ path, query: newQuery })
        }
      }
    },
    selectToken() {
      if (this.tokenInfoArray.length <= 1) {
        return
      }

      this.showCustomPopupClick()
    },
    getTokenInfo(e) {
      this.$store.commit('updateTransferTokenInfo', e)
    },
    // open pop
    showCustomPopupClick() {
      this.$refs.SelectTokenPopupRef.showCustom()
    },
    // close pop
    closeSelectPopupClick() {
      this.$refs.SelectTokenPopupRef.maskClick()
    },
    changeFromChain() {
      if (this.queryParams.sources.length <= 1) {
        return
      }

      this.showFromChainPopupClick()
    },
    getFromChainInfo(e) {
      this.$store.commit('updateTransferFromChainID', e.localID)

      // Change query params's source
      const { path, query } = this.$route
      for (const key in queryParamsChainMap) {
        if (queryParamsChainMap[key] == e.localID) {
          if (!util.equalsIgnoreCase(query.source, key)) {
            this.$router.replace({ path, query: { ...query, source: key } })
            break
          }
        }
      }
    },
    // open selectChain
    showFromChainPopupClick() {
      this.$refs.SelectFromChainPopupRef.showCustom()
    },
    // close selectChain
    closeFromChainPopupClick() {
      this.$refs.SelectFromChainPopupRef.maskClick()
    },
    changeToChain() {
      if (this.queryParams.dests.length <= 1) {
        return
      }

      this.showToChainPopupClick()
    },
    getToChainInfo(e) {
      this.$store.commit('updateTransferToChainID', e.localID)

      // Change query params's source
      const { path, query } = this.$route
      for (const key in queryParamsChainMap) {
        if (queryParamsChainMap[key] == e.localID) {
          if (!util.equalsIgnoreCase(query.dest, key)) {
            this.$router.replace({ path, query: { ...query, dest: key } })
            break
          }
        }
      }
    },
    // open selectChain
    showToChainPopupClick() {
      this.$refs.SelectToChainPopupRef.showCustom()
    },
    // close selectChain
    closeToChainPopupClick() {
      this.$refs.SelectToChainPopupRef.maskClick()
    },
    checkTransferValue() {
      let fromChianID = this.$store.getters.realSelectMakerInfo.c1ID
      let toChainID = this.$store.getters.realSelectMakerInfo.c2ID
      if (
        fromChianID == 9 ||
        fromChianID == 99 ||
        toChainID == 9 ||
        toChainID == 99
      ) {
        this.transferValue =
          this.$store.getters.realSelectMakerInfo.precision === 18
            ? this.transferValue.replace(/^\D*(\d*(?:\.\d{0,5})?).*$/g, '$1')
            : this.transferValue.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
      } else {
        this.transferValue =
          this.$store.getters.realSelectMakerInfo.precision === 18
            ? this.transferValue.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g, '$1')
            : this.transferValue.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
      }
    },
    async sendTransfer() {
      // if unlogin  login first
      if (!this.isLogin) {
        Middle.$emit('connectWallet', true)
      } else {
        if (!check.checkPrice(this.transferValue)) {
          this.$notify.error({
            title: `The format of input amount is incorrect`,
            duration: 3000,
          })
          return
        }
        if (this.fromBalance === null) {
          this.$notify.error({
            title: `Waiting for account balance to be obtained`,
            duration: 3000,
          })
          return
        }
        let selectMakerInfo = this.$store.getters.realSelectMakerInfo
        if (
          !this.transferValue ||
          new BigNumber(this.transferValue).comparedTo(
            new BigNumber(this.userMaxPrice)
          ) > 0 ||
          new BigNumber(this.transferValue).comparedTo(
            new BigNumber(this.userMinPrice)
          ) < 0
        ) {
          this.$notify.error({
            title: `As an alpha release, Orbiter can only support ${this.userMinPrice} ~ ${this.maxPrice} ${this.$store.state.transferData.selectTokenInfo.token} for each transfer.`,
            duration: 3000,
          })
          return
        }
        if (
          this.$store.state.web3.networkId.toString() !==
          this.$env.localChainID_netChainID[
          this.$store.state.transferData.fromChainID
          ]
        ) {
          this.addChainNetWork()
        } else {
          // Ensure immutablex's registered
          const { toChainID } = this.$store.state.transferData
          if (toChainID == 8 || toChainID == 88) {
            const imxHelper = new IMXHelper(toChainID)
            await imxHelper.ensureUser(this.$store.state.web3.coinbase)
          }

          // sendTransfer
          this.$store.commit('updateConfirmRouteDescInfo', [
            {
              no: 1,
              amount: new BigNumber(this.transferValue).plus(
                new BigNumber(selectMakerInfo.tradingFee)
              ),
              coin: this.$store.state.transferData.selectTokenInfo.token,
              toAddress: util.shortAddress(selectMakerInfo.makerAddress),
            },
          ])
          this.$emit('stateChanged', '2')
        }
      }
    },
    addChainNetWork() {
      var chain = util.getChainInfo(
        this.$env.localChainID_netChainID[
        this.$store.state.transferData.fromChainID
        ]
      )
      let selectMakerInfo = this.$store.getters.realSelectMakerInfo
      const switchParams = {
        chainId: util.toHex(chain.chainId),
      }
      window.ethereum
        .request({
          method: 'wallet_switchEthereumChain',
          params: [switchParams],
        })
        .then(async () => {
          // Ensure immutablex's registered
          const { toChainID } = this.$store.state.transferData
          if (toChainID == 8 || toChainID == 88) {
            const imxHelper = new IMXHelper(toChainID)
            await imxHelper.ensureUser(this.$store.state.web3.coinbase)
          }

          // switch success
          this.$store.commit('updateConfirmRouteDescInfo', [
            {
              no: 1,
              amount: new BigNumber(this.transferValue).plus(
                new BigNumber(selectMakerInfo.tradingFee)
              ),
              coin: this.$store.state.transferData.selectTokenInfo.token,
              toAddress: util.shortAddress(selectMakerInfo.makerAddress)
            }
          ])
          this.$emit('stateChanged', '2')
        })
        .catch((error) => {
          console.log(error)
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
            window.ethereum
              .request({
                method: 'wallet_addEthereumChain',
                params: [params, this.$store.state.web3.coinbase]
              })
              .then(() => { })
              .catch((error) => {
                console.log(error)
                util.showMessage(error.message, 'error')
              })
          } else {
            util.showMessage(error.message, 'error')
          }
        })
    },

    async updateOriginGasCost() {
      this.originGasLoading = true
      const { fromChainID, toChainID } = this.$store.state.transferData

      if (!fromChainID || !toChainID) {
        return
      }

      try {
        const response = await transferCalculate.transferOrginGasUsd(
          this.$store.state.transferData.fromChainID,
          this.$store.state.transferData.toChainID,
          this.$store.state.transferData.selectTokenInfo.token !== 'ETH'
        )

        this.originGasCost = response
      } catch (error) {
        console.log('error =', error)
        this.$notify.error({
          title: `GetOrginGasFeeError`,
          desc: error,
          duration: 3000,
        })
      }
      this.originGasLoading = false
    },

    async updateExchangeToUsdPrice() {
      const selectMakerInfo = this.$store.getters.realSelectMakerInfo

      const price = (await exchangeToUsd(1, selectMakerInfo.tName)).toNumber()

      if (price > 0) {
        this.exchangeToUsdPrice = price
      }
    },

    async getBalance(
      makerAddress,
      chainId,
      tokenAddress,
      tokenName,
      precision
    ) {
      try {
        if (!makerAddress) {
          return ''
        }
        const response = await transferCalculate.getTransferBalance(
          chainId,
          tokenAddress,
          tokenName,
          makerAddress,
          true
        )
        return (response / 10 ** precision).toFixed(6)
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.senderbody {
  margin: 4.2rem auto;
  color: var(--default-black);
  max-height: calc(
    100vh - 8.4rem - var(--top-nav-height) - var(--bottom-nav-height)
  );
  max-height: calc(
    var(--vh, 1vh) * 100 - 8.4rem - var(--top-nav-height) -
      var(--bottom-nav-height)
  );
  text-align: left;
  font-size: 2rem;
  overflow-y: scroll;
  .header {
    display: flex;
    align-items: center;
    .left {
      margin: 1.85rem 0 0 2.5rem;
      font-weight: 900;
    }
    .right {
      margin: 2rem 1.5rem 0 auto;
      padding: 0;
      display: flex;
      width: 13rem;
      height: 3.6rem;
      background-color: #fff;
      border-width: 0.15rem 0.15rem 0.25rem 0.15rem;
      border-color: black;
      border-style: solid;
      border-radius: 2rem;
      .token_icon {
        margin: 0.5rem 0 0.5rem 1rem;
        width: 2.2rem;
        height: 2.2rem;
      }
      .token_name {
        margin-left: 1rem;
        font-size: 1.8rem;
        line-height: 3.6rem;
        font-weight: 500;
        height: 100%;
      }
      .arrow_icon {
        width: 2rem;
        height: 2rem;
        margin: 0.8rem 1rem auto auto;
      }
    }
  }
  .content {
    margin: 2.1rem auto 0;
    width: 29.5rem;
    text-align: center;
    .subContent {
      position: relative;
      height: 5.7rem;
      border: 0.15rem solid var(--default-black);
      border-radius: 2rem;
      text-align: left;
      font-weight: 400;
      font-size: 1.2rem;
      .topItem {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 0.6rem 2.4rem 0 2rem;
        color: #616266;
        .right {
          display: flex;
          text-align: right;
        }
      }
      .bottomItem {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: -0.2rem 2.4rem 1.3rem 2rem;
        font-size: 1.6rem;
        font-weight: 550;
        height: 2.9rem;
        .left {
          color: #2c2d32;
          display: flex;
          line-height: 2.9rem;
        }
        .right {
          width: 100%;
          color: var(--primary-color);
          text-align: right;
          border: 0;
          outline: 0px;
          appearance: none;
          background-color: transparent;
          transition: all 0.2s ease 0s;
          flex-direction: row-reverse;
        }
        input {
          font-weight: 600;
        }
        input::placeholder {
          color: #adadb0;
          font-size: 1.4rem;
          font-weight: 400;
        }
        .maxBtn {
          padding: 0.1rem 0.3rem;
          font-size: 1rem;
          margin: auto;
          border-radius: 0.5rem;
          margin-left: 0.3rem;
          color: rgba($color: #18191f, $alpha: 0.6);
          border-color: rgba($color: #18191f, $alpha: 0.6);
          background: #ffffff;
        }
        .maxBtn:hover {
          color: rgba($color: #18191f, $alpha: 0.6);
          border-color: rgba($color: #18191f, $alpha: 0.6);
          background: #ffffff;
        }
      }
    }
    .subContent:last-child {
      margin-top: 1.8rem;
      .middleImge {
        position: absolute;
        width: 3.8rem;
        height: 3.8rem;
        top: -2.9rem;
        left: calc(50% - 1.7rem);
        z-index: 1;
      }
    }
  }
  .notice {
    margin: 3rem auto 3rem;
    width: 27rem;
    .item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 1.2rem;
      color: #78797d;
      text-align: left;
      .left {
        display: flex;
        // line-height: 100%;
      }
      .right {
        display: flex;
        text-align: right;
        align-items: center;
        .item {
          height: 1.5rem;
          padding: 0.1rem 0.2rem;
          background-color: #ff9675;
          color: #ffffff;
          font-size: 1rem;
          line-height: 1.5rem;
          text-align: left;
          border-radius: 0.3rem;
          margin-left: 0.7rem;
        }
      }
    }
  }
}
</style>
