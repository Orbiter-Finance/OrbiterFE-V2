<template>
  <div class="transfer-box">
    <div class="top-area">
      <span class="title">Token</span>
      <ObSelect
        :datas="tokens"
        v-model="selectedToken"
        @input="selectedTokenChange"
        @show="() => (isRaiseUpSelectVisible = true)"
      ></ObSelect>
    </div>
    <div class="from-area">
      <div class="topItem">
        <o-tooltip
          v-if="
            transferDataState.fromChainID == 4 ||
            transferDataState.fromChainID == 44
          "
        >
          <template v-slot:titleDesc>
            <span v-html="starkAddress"></span>
          </template>
          <!-- <div class="left">From&nbsp;&nbsp;&nbsp; {{ shortStarkAddress }}</div> -->
          <div class="left">From</div>
        </o-tooltip>
        <div v-else class="left">From</div>
        <div v-if="isLogin" class="right">
          Balance:
          <CommLoading
            v-if="fromBalanceLoading"
            style="left: 0.3rem; top: 0.2rem"
            width="1.2rem"
            height="1.2rem"
          />
          <span v-else>{{ fromBalance }}</span>
        </div>
      </div>
      <div class="bottomItem">
        <div class="left" @click="changeFromChain">
          <svg-icon
            :iconName="showChainIcon()"
            style="width: 24px; height: 24px; margin-right: 4px"
          ></svg-icon>
          <span>{{ showChainName() }}</span>
          <SvgIconThemed v-if="queryParams.sources.length > 1" />
        </div>
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <input
            type="text"
            v-model="transferValue"
            class="right"
            @input="checkTransferValue()"
            :maxlength="18"
            :placeholder="
              this.userMinPrice > fromBalance
                ? `at least ${this.userMinPrice}`
                : `${this.userMinPrice}~${this.userMaxPrice}`
            "
          />
          <el-button @click="fromMax" class="maxBtn" style>Max</el-button>
        </div>
      </div>
    </div>
    <!-- When queryParams.fixed or toChain is dydx, hide it! -->
    <svg-icon
      v-if="isShowExchangeIcon"
      class="exchange-icon"
      iconName="exchange"
      @click.native="transfer_mid"
    ></svg-icon>
    <div
      class="to-area"
      :style="{ marginTop: isShowExchangeIcon ? '4px' : '-2px' }"
    >
      <div class="topItem">
        <o-tooltip
          v-if="
            transferDataState.toChainID == 4 ||
            transferDataState.toChainID == 44
          "
        >
          <template v-slot:titleDesc>
            <span v-html="starkAddress"></span>
          </template>
          <!-- <div class="left">To&nbsp;&nbsp;&nbsp; {{ shortStarkAddress }}</div> -->
          <div class="left">To</div>
        </o-tooltip>
        <div v-else class="left">To</div>
        <div v-if="isLogin" class="right">
          Balance:
          <CommLoading
            v-if="toBalanceLoading"
            style="left: 0.3rem; top: 0.2rem"
            width="1.2rem"
            height="1.2rem"
          />
          <span v-else>{{ toBalance }}</span>
        </div>
      </div>
      <div class="bottomItem">
        <div class="left" @click="changeToChain">
          <svg-icon
            :iconName="showChainIcon(false)"
            style="width: 24px; height: 24px; margin-right: 4px"
          ></svg-icon>
          <span>{{ showChainName(false) }}</span>
          <SvgIconThemed v-if="queryParams.dests.length > 1" />
        </div>
        <div style="display: flex; align-items: center" class="right">
          <o-tooltip>
            <template v-slot:titleDesc>
              <span v-html="toValueToolTip"></span>
            </template>
            <HelpIcon style="margin-left: 0.5rem" size="sm" />
          </o-tooltip>
          <div class="right-value">{{ toValue }}</div>
        </div>
      </div>
    </div>
    <div
      v-if="isStarknet"
      style="
        font-size: 1.2rem;
        color: #78797d;
        margin-top: 1rem;
        text-align: left;
      "
    >
      <svg-icon
        style="width: 1rem; height: 1rem; height: 1rem; margin-right: 0.2rem"
        iconName="tips"
      ></svg-icon>
      Centralized transfer is provided currently and trustless transfer will be
      launched soon.
      <a
        style="text-decoration: underline"
        href="https://docs.orbiter.finance/"
        target="__blank"
        >More</a
      >
    </div>
    <CommBtn
      @click="sendTransfer"
      :disabled="sendBtnInfo ? sendBtnInfo.disabled : true"
      class="btn select-wallet-dialog"
      style="border-radius: 40px"
    >
      <span class="w700 s16" style="letter-spacing: 0.15rem">
        {{ sendBtnInfo && sendBtnInfo.text }}
      </span>
    </CommBtn>
    <div class="info-box">
      <div v-if="isShowUnreachMinInfo" class="info-item">
        <svg-icon class="info-icon" iconName="info"></svg-icon>
        <span class="red">
          Less than the minimum transfer amount.
          <!-- {{userMinPrice}}ETH -->
        </span>
      </div>
      <div v-if="isShowMax" class="info-item">
        <svg-icon class="info-icon" iconName="info"></svg-icon>
        <span class="red">
          Makers provide {{ maxPrice }}
          {{ transferDataState.selectTokenInfo.token }} for liquidity.
        </span>
      </div>
      <div v-if="showSaveGas" class="gas-save info-item">
        <SvgIconThemed style="margin-right: 6px" icon="orbiter" size="sm" />
        <span class="border">Gas Fee Saved </span>
        <span class="red">
          Save
          <CommLoading
            v-if="saveGasLoading"
            style="margin: 0 1rem"
            width="1rem"
            height="1rem"
          />
          <span v-else style="margin-left: 0.4rem"
            >{{ gasSavingMin }} ~ {{ gasSavingMax }}</span
          >
        </span>
        <o-tooltip placement="bottom">
          <template v-slot:titleDesc>
            <span v-html="gasFeeToolTip"></span>
          </template>
          <HelpIcon style="margin-left: 0.5rem" size="sm" />
        </o-tooltip>
      </div>
      <div class="time-save info-item">
        <SvgIconThemed style="margin-right: 6px" icon="clock" size="sm" />
        <span class="border">
          Time Spend
          <CommLoading v-if="timeSpenLoading" width="1.2rem" height="1.2rem" />
          <span v-else>{{ timeSpent }}</span>
        </span>
        <span class="red">
          Save
          <CommLoading
            v-if="saveTimeLoading"
            style="margin: 0 1rem"
            width="1rem"
            height="1rem"
          />
          <span v-else style="margin-left: 0.4rem">
            {{ transferSavingTime }}
          </span>
        </span>
        <o-tooltip placement="bottom">
          <template v-slot:titleDesc>
            <span v-html="timeSpenToolTip"></span>
          </template>
          <HelpIcon style="margin-left: 0.5rem" size="sm" />
        </o-tooltip>
      </div>
    </div>

    <CommDialog ref="SelectFromChainPopupRef">
      <div slot="PoperContent" style="width: 100%">
        <ObSelectChain
          :ChainData="fromChainArray"
          v-on:getChainInfo="getFromChainInfo"
          v-on:closeSelect="closeFromChainPopupClick()"
        />
      </div>
    </CommDialog>
    <CommDialog ref="SelectToChainPopupRef">
      <div slot="PoperContent" style="width: 100%">
        <ObSelectChain
          :ChainData="toChainArray"
          v-on:getChainInfo="getToChainInfo"
          v-on:closeSelect="closeToChainPopupClick()"
        />
      </div>
    </CommDialog>
    <RaiseUpSelect
      :iconType="'img'"
      :visible="isRaiseUpSelectVisible"
      @hiden="() => (isRaiseUpSelectVisible = false)"
      :datas="tokenInfoArray"
      :value="selectedToken"
      @input="selectedTokenChange"
      :keyMaps="{ value: 'token', label: 'token' }"
    />
  </div>
</template>

<script>
import {
  ObSelect,
  CommBtn,
  ObSelectChain,
  CommDialog,
  SvgIconThemed,
  HelpIcon,
} from '../../components'
import makerInfo from '../../core/routes/makerInfo'
import util from '../../util/util'
import check from '../../util/check/check'
import transferCalculate from '../../util/transfer/transferCalculate'
import Middle from '../../util/middle/middle'
import orbiterCore from '../../orbiterCore'
import BigNumber from 'bignumber.js'
import config from '../../config'
import { exchangeToUsd } from '../../util/coinbase'
import { IMXHelper } from '../../util/immutablex/imx_helper'
import getNonce from '../../core/utils/nonce'
import { DydxHelper } from '../../util/dydx/dydx_helper'
import Web3 from 'web3'
import { netStateBlock } from '../../util/confirmCheck'
import { chain2idMap } from '../../util/chain2id'
import { chain2icon } from '../../util'
import {
  connectStarkNetWallet,
  getStarkMakerAddress,
} from '../../util/constants/starknet/helper'
import { asyncGetExchangeToUsdRate } from '../../util/coinbase'
import { RaiseUpSelect } from '../../components'

// composition
import {
  walletIsLogin,
  compatibleGlobalWalletConf,
} from '../../composition/walletsResponsiveData'
import walletDispatchers from '../../util/walletsDispatchers'
import { METAMASK } from '../../util/walletsDispatchers/index'
import {
  transferDataState,
  realSelectMakerInfo,
  updateTransferMakerInfo,
  updateTransferValue,
  updateTransferExt,
  updateTransferTokenInfo,
  updateTransferFromChainID,
  updateTransferToChainID,
  updateTransferGasFee,
  updateETHPrice,
  web3State,
} from '../../composition/hooks'
import { watchEffect } from '../../composition'

const queryParamsChainMap = chain2idMap

const { walletDispatchersOnSwitchChain } = walletDispatchers

export default {
  name: 'Transfer',
  components: {
    ObSelect,
    CommBtn,
    ObSelectChain,
    SvgIconThemed,
    CommDialog,
    RaiseUpSelect,
    HelpIcon,
  },
  data() {
    return {
      isRaiseUpSelectVisible: false,
      selectedToken: 'ETH',
      // loading
      timeSpenLoading: false,
      gasCostLoading: false,
      originGasLoading: false,

      saveTimeLoading: false,

      c1Balance: Number(0).toFixed(6),
      c2Balance: Number(0).toFixed(6),
      originGasCost: 0,

      makerInfoList: '',
      fromChainArray: [],
      toChainArray: [],
      tokenInfoArray: [],

      transferValue: '',

      exchangeToUsdPrice: 0,

      makerMaxBalance: 0,
    }
  },
  asyncComputed: {
    async userMaxPrice() {
      if (!walletIsLogin.value) {
        return realSelectMakerInfo.value.maxPrice
      }
      // check selectMakerInfo
      let selectMakerInfo = realSelectMakerInfo.value
      if (selectMakerInfo.precision === undefined) {
        return '0'
      }
      // check fromBalance
      if (!this.fromBalance) {
        return '0'
      }
      let transferGasFee =
        (await transferCalculate.getTransferGasLimit(
          transferDataState.fromChainID,
          selectMakerInfo.makerAddress,
          selectMakerInfo.t1Address
        )) || 0
      let avalibleDigit = orbiterCore.getDigitByPrecision(
        selectMakerInfo.precision
      )
      let opBalance = 10 ** -avalibleDigit
      let preGasDigit = 3
      let preGas = 10 ** -preGasDigit
      let useBalanle = new BigNumber(this.fromBalance)
        .minus(new BigNumber(selectMakerInfo.tradingFee))
        .minus(new BigNumber(opBalance))
        .minus(new BigNumber(transferGasFee))
        .minus(new BigNumber(preGas))
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
  },
  computed: {
    transferDataState() {
      return transferDataState
    },
    web3State() {
      return web3State
    },
    isLogin() {
      return walletIsLogin.value
    },
    isShowExchangeIcon() {
      return (
        !this.queryParams.fixed &&
        transferDataState.toChainID != 11 &&
        transferDataState.toChainID != 511 &&
        !this.starkMid
      )
    },
    isStarknet() {
      return this.refererUpper === 'STARKNET'
    },
    refererUpper() {
      // Don't use [$route.query.referer], because it will delay
      const { href } = window.location
      const match = href.match(/referer=(\w*)/i)
      if (match?.[1]) {
        return match[1].toUpperCase()
      }
      return ''
    },
    tokens() {
      return this.tokenInfoArray.map((v) => {
        return {
          ...v,
          icon: v.icon || 'tokenLogo',
          label: v.token,
          value: v.token,
          iconType: 'img',
        }
      })
    },
    starkAddress() {
      var stark = web3State.starkNet.starkNetAddress
      if (!stark) {
        return ''
      }
      return stark
    },
    shortStarkAddress() {
      var stark = web3State.starkNet.starkNetAddress
      if (stark && stark.length > 5) {
        var subStr1 = stark.substr(0, 4)
        var subStr2 = stark.substr(stark.length - 4, 4)
        return subStr1 + '...' + subStr2
      }
      return 'not connected'
    },
    starkMid() {
      const fromChainID = transferDataState.fromChainID
      const toChainID = transferDataState.toChainID
      if (
        (fromChainID == 4 || fromChainID == 44) &&
        toChainID != 1 &&
        toChainID != 5 &&
        toChainID != 2 &&
        toChainID != 22 &&
        toChainID != 6 &&
        toChainID != 66 &&
        toChainID != 7 &&
        toChainID != 77
      ) {
        return true
      }
      return false
    },
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
      let selectMakerInfo = realSelectMakerInfo.value
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
      if (walletIsLogin.value) {
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
          info.disabled = 'disabled'
        } else if (transferValue.comparedTo(makerMin) < 0) {
          info.text = 'INSUFFICIENT FUNDS'
          info.disabled = 'disabled'
        } else if (transferValue.comparedTo(0) > 0 && this.toValue <= 0) {
          info.text = 'INSUFFICIENT FUNDS'
          info.disabled = 'disabled'
        } else if (this.toValue > 0 && this.toValue > this.makerMaxBalance) {
          info.text = 'INSUFFICIENT LIQUIDITY'
          info.disabled = 'disabled'
        }

        if (this.isShowUnreachMinInfo || this.isShowMax) {
          info.text = 'SEND'
          info.disabled = 'disabled'
        }
      }

      return info
    },
    isShowMax() {
      return (
        new BigNumber(this.transferValue).comparedTo(
          new BigNumber(realSelectMakerInfo.value.maxPrice)
        ) > 0
      )
    },
    isShowUnreachMinInfo() {
      if (walletIsLogin.value && this.transferValue) {
        let makerMin = new BigNumber(this.userMinPrice)
        let transferValue = new BigNumber(this.transferValue)
        const fromBalance = new BigNumber(this.fromBalance)
        return (
          transferValue.comparedTo(makerMin) < 0 &&
          transferValue.comparedTo(fromBalance) < 0
        )
      }
      return false
    },
    maxPrice() {
      return realSelectMakerInfo.value.maxPrice
    },
    userMinPrice() {
      return realSelectMakerInfo.value.minPrice
    },
    realTransferValue() {
      return transferCalculate.realTransferOPID()
    },
    realPtext() {
      let ptextResult = orbiterCore.getPTextFromTAmount(
        transferDataState.fromChainID,
        this.realTransferValue
      )
      if (ptextResult.state) {
        return ptextResult.pText
      } else {
        return '0'
      }
    },
    toValueToolTip() {
      let value = realSelectMakerInfo.value?.gasFee || 0
      value = parseFloat((value / 10).toFixed(2))
      return `Sender pays a ${value}% trading fee for each transfer.`
    },
    securityToolTip() {
      return `In Orbiter, each transaction will have a security code. The code is attached to the end of the transfer amount in the form of a four-digit number to specify the necessary information when you transfer. If a Maker is dishonest, the security code will become the necessary evidence for you to claim money from margin contracts.`
    },
    timeSpenToolTip() {
      return `It takes about ${
        this.originTimeSpent
          ? this.originTimeSpent.replace('~', '')
          : this.originTimeSpent
      } moving funds using the native bridge, and it only takes about ${
        this.timeSpent ? this.timeSpent.replace('~', '') : this.timeSpent
      } using Orbiter.`
    },
    gasFeeToolTip() {
      const gasFee = `<b>Fees using the native bridge costs around:</b><br />Gas Fee: $${this.originGasCost.toFixed(
        2
      )}<br />`
      const tradingFee = ` <br /><b>Fees using Orbiter costs:</b><br />Trading Fee: $${(
        this.orbiterTradingFee * this.exchangeToUsdPrice
      ).toFixed(2)}`
      const withholdingGasFee = `<br />Withholding Fee: $${
        realSelectMakerInfo.value
          ? (
              realSelectMakerInfo.value.tradingFee * this.exchangeToUsdPrice
            ).toFixed(2)
          : 0
      }`
      const total = `<br /><br /><b>Total: $${(
        this.gasTradingTotal * this.exchangeToUsdPrice
      ).toFixed(2)}</b>`

      return gasFee + tradingFee + withholdingGasFee + total
    },
    toValue() {
      if (this.transferValue === '' || realSelectMakerInfo.value === '') {
        return '0'
      }
      return orbiterCore.getToAmountFromUserAmount(
        new BigNumber(this.transferValue).plus(
          new BigNumber(realSelectMakerInfo.value.tradingFee)
        ),
        realSelectMakerInfo.value,
        false
      )
    },
    fromBalanceLoading() {
      return this.fromBalance === null
    },
    toBalanceLoading() {
      return this.toBalance === null
    },
    fromBalance() {
      const c1 = transferDataState.selectMakerInfo.c1ID
      const from = transferDataState.fromChainID
      return c1 === from ? this.c1Balance : this.c2Balance
    },
    toBalance() {
      const c1 = transferDataState.selectMakerInfo.c1ID
      const from = transferDataState.fromChainID
      return c1 === from ? this.c2Balance : this.c1Balance
    },
    timeSpent() {
      return transferCalculate.transferSpentTime(
        transferDataState.fromChainID,
        transferDataState.toChainID
      )
    },
    originTimeSpent() {
      return transferCalculate.transferOrginTime(
        transferDataState.fromChainID,
        transferDataState.toChainID
      )
    },
    orbiterTradingFee() {
      let selectMakerInfo = realSelectMakerInfo.value
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
      let selectMakerInfo = realSelectMakerInfo.value
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
    gasSavingMin() {
      const gasCost = this.gasCost()
      let savingValue =
        this.originGasCost -
        this.gasTradingTotal * this.exchangeToUsdPrice -
        gasCost
      if (savingValue < 0) {
        savingValue = 0
      }
      let savingTokenName = '$'
      return savingTokenName + savingValue.toFixed(2).toString()
    },
    showSaveGas() {
      return (
        this.originGasCost - this.gasTradingTotal * this.exchangeToUsdPrice > 0
      )
    },
    saveGasLoading() {
      return this.originGasLoading
    },
    transferSavingTime() {
      return this.originTimeSpent?.replace('~', '')
      // return transferCalculate.transferSavingTime(
      //   transferDataState.fromChainID,
      //   transferDataState.toChainID
      // )

      // this.originTimeSpent - this.timeSpent
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
      oldValue === '' && newValue !== '' && this.initChainArray()
    },
    'web3State.starkNet.starkNetAddress': function (newValue) {
      if (newValue) {
        let selectMakerInfo = transferDataState.selectMakerInfo
        let fromChianID = selectMakerInfo.c1ID
        let toChainID = selectMakerInfo.c2ID
        if (
          fromChianID == 4 ||
          fromChianID == 44 ||
          toChainID == 4 ||
          toChainID == 44
        ) {
          this.c1Balance = null
          this.c2Balance = null
          transferCalculate
            .getTransferBalance(
              selectMakerInfo.c1ID,
              selectMakerInfo.t1Address,
              selectMakerInfo.tName,
              web3State.coinbase
            )
            .then((response) => {
              this.c1Balance = (
                response /
                10 ** selectMakerInfo.precision
              ).toFixed(6)
            })
            .catch((error) => {
              this.c1Balance = Number(0).toFixed(6)
              console.warn(error)
              return
            })
          transferCalculate
            .getTransferBalance(
              selectMakerInfo.c2ID,
              selectMakerInfo.t2Address,
              selectMakerInfo.tName,
              web3State.coinbase
            )
            .then((response) => {
              this.c2Balance = (
                response /
                10 ** selectMakerInfo.precision
              ).toFixed(6)
            })
            .catch((error) => {
              this.c2Balance = Number(0).toFixed(6)
              console.warn(error)
            })
        }
      }
    },
    compatibleGlobalWalletConf: function (newValue, oldValue) {
      if (!newValue || newValue === '0x') {
        this.c1Balance = Number(0).toFixed(6)
        this.c2Balance = Number(0).toFixed(6)
      }
      if (oldValue !== newValue && newValue !== '0x') {
        this.c1Balance = null
        this.c2Balance = null
        let selectMakerInfo = transferDataState.selectMakerInfo
        transferCalculate
          .getTransferBalance(
            selectMakerInfo.c1ID,
            selectMakerInfo.t1Address,
            selectMakerInfo.tName,
            compatibleGlobalWalletConf.value.walletPayload.walletAddress
          )
          .then((response) => {
            this.c1Balance = (
              response /
              10 ** selectMakerInfo.precision
            ).toFixed(6)
          })
          .catch((error) => {
            console.warn(error)
            return
          })
        transferCalculate
          .getTransferBalance(
            selectMakerInfo.c2ID,
            selectMakerInfo.t2Address,
            selectMakerInfo.tName,
            compatibleGlobalWalletConf.value.walletPayload.walletAddress
          )
          .then((response) => {
            this.c2Balance = (
              response /
              10 ** selectMakerInfo.precision
            ).toFixed(6)
          })
          .catch((error) => {
            console.warn(error)
          })
      } else {
        this.c1Balance = Number(0).toFixed(6)
        this.c2Balance = Number(0).toFixed(6)
      }
    },
    'transferDataState.selectMakerInfo': async function (newValue, oldValue) {
      this.updateExchangeToUsdPrice()
      this.getMakerMaxBalance()

      if (
        newValue.c1ID == 4 ||
        newValue.c1ID == 44 ||
        newValue.c2ID == 4 ||
        newValue.c2ID == 44
      ) {
        const { starkNetIsConnect, starkNetAddress } = web3State.starkNet
        if (!starkNetIsConnect || !starkNetAddress) {
          await connectStarkNetWallet()
          if (
            !web3State.starkNet.starkIsConnected &&
            !web3State.starkNet.starkNetAddress
          ) {
            const makerInfo = this.makerInfoList[0]
            updateTransferFromChainID(makerInfo.c1ID)
            // Change query params's source
            const { path, query } = this.$route

            for (const key in queryParamsChainMap) {
              if (queryParamsChainMap[key] == makerInfo.c1ID) {
                if (!util.equalsIgnoreCase(query.source, key)) {
                  this.$router.replace({
                    path,
                    query: { ...query, source: key },
                  })
                  break
                }
              }
            }
          }
        }
      }

      if (walletIsLogin.value && oldValue !== newValue) {
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
            compatibleGlobalWalletConf.value.walletPayload.walletAddress
          )
          .then((response) => {
            this.c1Balance = (response / 10 ** newValue.precision).toFixed(6)
          })
          .catch((error) => {
            console.warn(error)
          })
        transferCalculate
          .getTransferBalance(
            newValue.c2ID,
            newValue.t2Address,
            newValue.tName,
            compatibleGlobalWalletConf.value.walletPayload.walletAddress
          )
          .then((response) => {
            this.c2Balance = (response / 10 ** newValue.precision).toFixed(6)
          })
          .catch((error) => {
            this.c2Balance = 0
            console.warn(error)
          })
      }
    },
    'transferDataState.fromChainID': function (newValue) {
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
        newValue != 1 &&
        newValue != 5 &&
        newValue != 2 &&
        newValue != 22 &&
        newValue != 6 &&
        newValue != 66 &&
        newValue != 7 &&
        newValue != 77
      ) {
        if (this.toChainArray.indexOf(4) != -1) {
          let index = this.toChainArray.indexOf(4)
          this.toChainArray.splice(index, 1)
        }
        if (this.toChainArray.indexOf(44) != -1) {
          let index = this.toChainArray.indexOf(44)
          this.toChainArray.splice(index, 1)
        }
      }

      if (this.toChainArray.indexOf(transferDataState.toChainID) === -1) {
        let _toChainID = this.toChainArray[0]
        if (
          this.queryParams.dest > 0 &&
          this.toChainArray.indexOf(this.queryParams.dest) > -1
        ) {
          // When dest > 0 and query params dest at this.toChainArray
          _toChainID = this.queryParams.dest
        }
        updateTransferToChainID(_toChainID)
      } else {
        this.tokenInfoArray = []
        this.makerInfoList.filter((makerInfo) => {
          const { fromChainID, toChainID } = transferDataState
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
            (item) => item.token == transferDataState.selectTokenInfo.token
          ) === -1
        ) {
          let defaultIndex = this.tokenInfoArray.findIndex((item) =>
            util.equalsIgnoreCase(item.token, this.queryParams.token)
          )
          if (defaultIndex < 0) {
            defaultIndex = 0
          }
          updateTransferTokenInfo(this.tokenInfoArray[defaultIndex])
        } else {
          this.makerInfoList.filter((makerInfo) => {
            if (
              (makerInfo.c1ID === transferDataState.fromChainID &&
                makerInfo.c2ID === transferDataState.toChainID &&
                makerInfo.tName === transferDataState.selectTokenInfo.token) ||
              (makerInfo.c2ID === transferDataState.fromChainID &&
                makerInfo.c1ID === transferDataState.toChainID &&
                makerInfo.tName === transferDataState.selectTokenInfo.token)
            ) {
              updateTransferMakerInfo(makerInfo)
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
          .transferSpentGas(transferDataState.fromChainID)
          .then((response) => {
            updateTransferGasFee(response)
            that.gasCostLoading = false
          })
          .catch((error) => {
            that.gasCostLoading = false
            console.warn('GetGasFeeError =', error)
          })
      }

      this.setDefaultTokenWhenNotSupport()
    },
    'transferDataState.toChainID': function (newValue) {
      this.tokenInfoArray = []
      this.makerInfoList.filter((makerInfo) => {
        const { fromChainID, toChainID } = transferDataState
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
          (item) => item.token == transferDataState.selectTokenInfo.token
        ) === -1
      ) {
        let defaultIndex = this.tokenInfoArray.findIndex((item) =>
          util.equalsIgnoreCase(item.token, this.queryParams.token)
        )
        if (defaultIndex < 0) {
          defaultIndex = 0
        }

        updateTransferTokenInfo(this.tokenInfoArray[defaultIndex])
      } else {
        this.makerInfoList.filter((makerInfo) => {
          if (
            (makerInfo.c1ID === transferDataState.fromChainID &&
              makerInfo.c2ID === transferDataState.toChainID &&
              makerInfo.tName === transferDataState.selectTokenInfo.token) ||
            (makerInfo.c2ID === transferDataState.fromChainID &&
              makerInfo.c1ID === transferDataState.toChainID &&
              makerInfo.tName === transferDataState.selectTokenInfo.token)
          ) {
            updateTransferMakerInfo(makerInfo)
          }
        })
      }

      if (newValue) {
        this.updateOriginGasCost()
      }

      this.setDefaultTokenWhenNotSupport()
    },
    'transferDataState.selectTokenInfo': function (newValue) {
      this.makerInfoList.filter((makerInfo) => {
        if (
          (makerInfo.c1ID === transferDataState.fromChainID &&
            makerInfo.c2ID === transferDataState.toChainID &&
            makerInfo.tName === newValue.token) ||
          (makerInfo.c2ID === transferDataState.fromChainID &&
            makerInfo.c1ID === transferDataState.toChainID &&
            makerInfo.tName === newValue.token)
        ) {
          updateTransferMakerInfo(makerInfo)
        }
      })

      this.updateOriginGasCost()
      if (newValue) {
        let that = this
        this.gasCostLoading = true
        transferCalculate
          .transferSpentGas(transferDataState.fromChainID)
          .then((response) => {
            updateTransferGasFee(response)
            that.gasCostLoading = false
          })
          .catch((error) => {
            that.gasCostLoading = false
            console.warn('GetGasFeeError =', error)
          })
      }
    },
    transferValue: function (newValue) {
      transferDataState.transferValue !== newValue &&
        updateTransferValue(newValue)
    },
  },
  mounted() {
    const updateETHPriceI = async () => {
      transferCalculate
        .getTokenConvertUsd('ETH')
        .then((response) => updateETHPrice(response))
        .catch((error) => console.warn('GetETHPriceError =', error))
    }
    const getTransferBalance = (idx = 1) => {
      const selectMakerInfo = transferDataState.selectMakerInfo
      const id = selectMakerInfo[`c${idx}ID`] // c1ID
      const addr = selectMakerInfo[`t${idx}Address`] // t1Address
      const name = selectMakerInfo.tName
      // const oldVal = this[`c${idx}Balance`]
      this[`c${idx}Balance`] = null
      transferCalculate
        .getTransferBalance(
          id,
          addr,
          name,
          web3State.coinbase ||
            compatibleGlobalWalletConf.value.walletPayload.walletAddress
        )
        .then(
          (response) =>
            (this[`c${idx}Balance`] = (
              response /
              10 ** selectMakerInfo.precision
            ).toFixed(6))
        )
        .catch(() => (this[`c${idx}Balance`] = Number(0).toFixed(6)))
    }

    watchEffect(() => {
      if (transferDataState.selectMakerInfo && walletIsLogin.value) {
        getTransferBalance()
        getTransferBalance(2)
      }
    })

    updateETHPriceI()
    this.getMakerMaxBalance()

    setInterval(() => {
      updateETHPriceI()
      this.getMakerMaxBalance()
      this.updateExchangeToUsdPrice()
    }, 10 * 1000)

    this.transferValue = this.queryParams.amount
    makerInfo
      .getMakerInfoFromGraph({ maker: '0' }, true)
      .then((response) => {
        if (response.code === 0) {
          this.makerInfoList = response.data
        }
      })
      .catch((error) => console.warn('error =', error))
  },
  created() {
    this.replaceStarknetWrongHref()
  },
  methods: {
    replaceStarknetWrongHref() {
      /*
        ?refer=starknet&dests=starknet
        =>
        ?referer=starknet&dest=starknet&fixed=1
      */
      let isStarknetRefer = false
      const { href } = window.location
      const match = href.match(/refer=starknet/i)
      if (match) {
        isStarknetRefer = true
      }

      if (isStarknetRefer) {
        const { path, query } = this.$route
        delete query.dests
        delete query.refer
        try {
          window.location.href = `${path}?referer=starknet&dest=starknet&fixed=1`
          // this.$router.push({ path, query: {
          //   ...query,
          //   referer: 'starknet',
          //   dest: 'starknet',
          //   fixed: 1,
          //   source: 'Mainnet'
          // }})
        } catch (err) {
          //
        }
      }
    },
    naNString(tar) {
      return typeof tar === 'string' && tar === 'NaN' ? 0 : tar
    },
    showChainName(isFrom = true) {
      const localChainID = transferDataState[`${isFrom ? 'from' : 'to'}ChainID`]
      const netChainID = this.$env.localChainID_netChainID[localChainID]
      return util.chainName(localChainID, netChainID)
    },
    showChainIcon(isFrom = true) {
      const localChainID = transferDataState[`${isFrom ? 'from' : 'to'}ChainID`]
      return chain2icon(localChainID)
    },
    selectedTokenChange(val) {
      const tar = this.tokens.find((v) => v.value == val)
      this.selectedToken = val || 'ETH'
      updateTransferTokenInfo(tar || {})
    },
    setDefaultTokenWhenNotSupport() {
      this.$nextTick(() => {
        const st = this.tokenInfoArray.some(
          (v) => v.token == this.selectedToken
        )
        if (!st) {
          if (this.tokenInfoArray.length > 0) {
            const first = this.tokenInfoArray[0]
            this.selectedTokenChange(first.token || 'ETH')
          } else {
            this.selectedTokenChange('ETH')
          }
        }
      })
    },
    initChainArray() {
      this.fromChainArray = []
      this.makerInfoList.filter((makerInfo) => {
        // Don't show dydx
        if (
          makerInfo.c1ID == 11 ||
          makerInfo.c1ID == 511 ||
          makerInfo.c2ID == 11 ||
          makerInfo.c2ID == 511
        ) {
          return
        }

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

      updateTransferFromChainID(fromChainID)
    },
    fromMax() {
      if (!walletIsLogin.value) {
        this.transferValue = '0'
        return
      }
      let selectMakerInfo = realSelectMakerInfo.value
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
    transfer_mid() {
      const { fromChainID, toChainID, selectTokenInfo } = transferDataState
      updateTransferFromChainID(toChainID)
      updateTransferTokenInfo(selectTokenInfo)
      // Wait toChainArray updated
      this.$nextTick(() => {
        let _toChainID = fromChainID
        if (this.toChainArray.indexOf(_toChainID) == -1) {
          _toChainID = this.toChainArray[0]
        }
        updateTransferToChainID(_toChainID)
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
      if (this.tokenInfoArray.length <= 1) return
      this.showCustomPopupClick()
    },
    getTokenInfo(e) {
      updateTransferTokenInfo(e)
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
      updateTransferFromChainID(e.localID)
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
      this.setDefaultTokenWhenNotSupport()
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
      updateTransferToChainID(e.localID)

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
      this.setDefaultTokenWhenNotSupport()
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
      let fromChianID = realSelectMakerInfo.value.c1ID
      let toChainID = realSelectMakerInfo.value.c2ID
      if (
        fromChianID == 9 ||
        fromChianID == 99 ||
        toChainID == 9 ||
        toChainID == 99
      ) {
        this.transferValue =
          realSelectMakerInfo.value.precision === 18
            ? this.transferValue.replace(/^\D*(\d*(?:\.\d{0,5})?).*$/g, '$1')
            : this.transferValue.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
      } else {
        this.transferValue =
          realSelectMakerInfo.value.precision === 18
            ? this.transferValue.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g, '$1')
            : this.transferValue.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
      }
    },
    async sendTransfer() {
      if (check.checkIsBitKeep()) {
        this.$notify.error({
          title: `Bitkeep is not supported by Orbiter, please try another wallet.`,
          duration: 3000,
        })
        return
      }
      if (this.sendBtnInfo && this.sendBtnInfo.disabled === 'disabled') {
        return
      }
      // if unlogin  login first
      if (!walletIsLogin.value) {
        Middle.$emit('connectWallet', true)
        return
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
        let selectMakerInfo = realSelectMakerInfo.value
        let nonce = await getNonce.getNonce(
          transferDataState.fromChainID,
          realSelectMakerInfo.value.t1Address,
          realSelectMakerInfo.value.tName,
          compatibleGlobalWalletConf.value.walletPayload.walletAddress
        )
        if (!(await netStateBlock(transferDataState.fromChainID))) {
          this.$notify.error({
            title: `Affected by the ${selectMakerInfo.c1Name} interface issue, the transfer from ${selectMakerInfo.c1Name} is suspended.`,
            duration: 3000,
          })
          return
        }
        if (nonce > 8999) {
          this.$notify.error({
            title: `Address with the nonce over 9000 are not supported by Orbiter`,
            duration: 3000,
          })
          return
        }

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
            title: `Orbiter can only support minimum of ${this.userMinPrice} and maximum of ${this.maxPrice} ${transferDataState.selectTokenInfo.token} on transfers.`,
            duration: 3000,
          })
          return
        }

        const { fromChainID, toChainID } = transferDataState

        // Ensure immutablex's registered
        if (toChainID == 8 || toChainID == 88) {
          const imxHelper = new IMXHelper(toChainID)
          const walletAddress =
            compatibleGlobalWalletConf.value.walletPayload.walletAddress
          walletAddress && (await imxHelper.ensureUser(walletAddress))
        }

        // To dYdX
        if (toChainID == 11 || toChainID == 511) {
          const dydxHelper = new DydxHelper(
            toChainID,
            new Web3(compatibleGlobalWalletConf.value.walletPayload.provider),
            'MetaMask'
          )
          const dydxAccount = await dydxHelper.getAccount(
            compatibleGlobalWalletConf.value.walletPayload.walletAddress
          )

          updateTransferExt({
            type: '0x02', // for dydx
            value: dydxHelper.conactStarkKeyPositionId(
              '0x' + dydxAccount.starkKey,
              dydxAccount.positionId
            ),
          })
        } // To starkNet
        else if (toChainID == 4 || toChainID == 44) {
          const { starkIsConnected, starkNetAddress, starkChain } =
            web3State.starkNet
          if (!starkChain || starkChain == 'unlogin') {
            util.showMessage('please connect StarkNet Wallet', 'error')
            return
          }
          if (
            toChainID == 4 &&
            (starkChain == 44 || starkChain == 'localhost')
          ) {
            util.showMessage(
              'please switch StarkNet Wallet to mainnet',
              'error'
            )
            return
          }
          if (
            toChainID == 44 &&
            (starkChain == 4 || starkChain == 'localhost')
          ) {
            util.showMessage(
              'please switch StarkNet Wallet to testNet',
              'error'
            )
            return
          }
          if (starkNetAddress && starkIsConnected) {
            updateTransferExt({
              type: '0x03',
              value: starkNetAddress,
            })
          } else {
            util.showMessage('please connect StarkNet Wallet', 'error')
            return
          }
        } else {
          // Clear TransferExt
          updateTransferExt(null)
        }

        if (fromChainID == 4 || fromChainID == 44) {
          const { starkChain } = web3State.starkNet
          if (!starkChain || starkChain == 'unlogin') {
            util.showMessage('please connect StarkNet Wallet', 'error')
            return
          }
          if (
            fromChainID == 4 &&
            (starkChain == 44 || starkChain == 'localhost')
          ) {
            util.showMessage(
              'please switch StarkNet Wallet to mainnet',
              'error'
            )
            return
          }
          if (
            fromChainID == 44 &&
            (starkChain == 4 || starkChain == 'localhost')
          ) {
            util.showMessage(
              'please switch StarkNet Wallet to testNet',
              'error'
            )
            return
          }
        } else {
          // Ensure fromChainId's networkId
          //    if (
          //   compatibleGlobalWalletConf.value.walletPayload.networkId.toString() !==
          //   this.$env.localChainID_netChainID[
          //     transferDataState.fromChainID
          //   ]
          // ) {
          //   if (compatibleGlobalWalletConf.value.walletType === METAMASK) {
          //     try {
          //       await util.ensureWalletNetwork(
          //         transferDataState.fromChainID
          //       )
          //     } catch (err) {
          //       util.showMessage(err.message, 'error')
          //       return
          //     }
          //   } else {
          if (
            compatibleGlobalWalletConf.value.walletPayload.networkId.toString() !==
            this.$env.localChainID_netChainID[transferDataState.fromChainID]
          ) {
            if (compatibleGlobalWalletConf.value.walletType === METAMASK) {
              try {
                await util.ensureWalletNetwork(transferDataState.fromChainID)
              } catch (err) {
                util.showMessage(err.message, 'error')
                return
              }
            } else {
              const matchSwitchChainDispatcher =
                walletDispatchersOnSwitchChain[
                  compatibleGlobalWalletConf.value.walletType
                ]
              if (matchSwitchChainDispatcher) {
                const successCallback = () => this.$emit('stateChanged', '2')
                matchSwitchChainDispatcher(
                  compatibleGlobalWalletConf.value.walletPayload.provider,
                  () => successCallback.bind(this)
                )
                return
              }
            }
          }
        }
        let toAddress = util.shortAddress(selectMakerInfo.makerAddress)
        if (fromChainID == 4 || fromChainID == 44) {
          toAddress = util.shortAddress(
            getStarkMakerAddress(selectMakerInfo.makerAddress, fromChainID)
          )
        }
        // sendTransfer
        this.$store.commit('updateConfirmRouteDescInfo', [
          {
            no: 1,
            amount: new BigNumber(this.transferValue).plus(
              new BigNumber(selectMakerInfo.tradingFee)
            ),
            coin: transferDataState.selectTokenInfo.token,
            toAddress: toAddress,
          },
        ])
        this.$emit('stateChanged', '2')
      }
    },
    async updateOriginGasCost() {
      this.originGasLoading = true
      const { fromChainID, toChainID } = transferDataState

      if (!fromChainID || !toChainID) {
        return
      }

      try {
        const response = await transferCalculate.transferOrginGasUsd(
          transferDataState.fromChainID,
          transferDataState.toChainID,
          transferDataState.selectTokenInfo.token !== 'ETH'
        )
        this.originGasCost = response
      } catch (error) {
        console.warn('updateOriginGasCost error =', error.message)
        this.$notify.error({
          title: `GetOrginGasFeeError`,
          desc: error,
          duration: 3000,
        })
      }
      this.originGasLoading = false
    },
    async updateExchangeToUsdPrice() {
      const selectMakerInfo = realSelectMakerInfo.value
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
        console.warn(error)
        return 0
      }
    },
    async getMakerMaxBalance() {
      const selectMakerInfo = realSelectMakerInfo.value
      if (!selectMakerInfo) {
        return
      }
      // dYdX can't get maker's balance, don't check it
      if (selectMakerInfo.c2ID == 11 || selectMakerInfo.c2ID == 511) {
        this.makerMaxBalance = Number.MAX_SAFE_INTEGER
        return
      }
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
          this.makerMaxBalance = _balance * 0.95
        }
      } catch (err) {
        alert(err.message)
      }
    },
    gasCost() {
      if (
        transferDataState.fromChainID === 3 ||
        transferDataState.fromChainID === 33 ||
        transferDataState.fromChainID === 9 ||
        transferDataState.fromChainID === 99
      ) {
        const selectMakerInfo = transferDataState.selectMakerInfo
        let transferGasFee = transferDataState.gasFee
        const selectTokenRate = asyncGetExchangeToUsdRate(selectMakerInfo.tName)
        if (selectTokenRate > 0) {
          // switch to usd
          transferGasFee = transferGasFee / selectTokenRate
        }
        return Math.ceil(Number(transferGasFee * 10)) / 10
      }
      return (
        Math.ceil(transferDataState.gasFee * transferDataState.ethPrice * 10) /
        10
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.app {
  .transfer-box {
    .btn {
      width: 440px;
    }
  }
}
.app-mobile {
  .transfer-box {
    .btn {
      width: 100%;
    }
  }
}
.transfer-box {
  .top-area {
    display: flex;
    align-items: center;
    .title {
      font-weight: 700;
      font-size: 20px;
      line-height: 20px;
      margin-right: 10px;
    }
  }
  .from-area,
  .to-area {
    margin-top: 20px;
    height: 96px;
    border-radius: 20px;
    position: relative;
    padding: 20px;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;

    .topItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Inter Regular';
    }

    .bottomItem {
      display: flex;
      justify-content: space-between;
      margin-top: 12px;
      align-items: center;

      .left {
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        white-space: nowrap;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }

      .right {
        width: 100%;
        // color: #df2e2d;
        text-align: right;
        border: 0;
        outline: 0px;
        appearance: none;
        background-color: transparent;
        transition: all 0.2s ease 0s;
        flex-direction: row-reverse;
      }
      .right-value {
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
      }

      input {
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
      }

      input::placeholder {
        color: rgba(51, 51, 51, 0.2);
        font-weight: 700;
        font-size: 16px;
      }

      .maxBtn {
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        cursor: pointer;
        border: none;
        background: transparent;
        text-align: right;
        padding: 0;
        margin-left: 8px;
        font-family: 'Inter Regular';
      }
    }
  }
  .from-area {
    margin-bottom: 8px;
  }
  .exchange-icon {
    width: 28px;
    height: 28px;
    cursor: pointer;
  }
  .btn {
    margin-top: 32px;
    height: 50px;
    display: inline-block;
    line-height: 34px;
    margin-bottom: 20px;
    background: linear-gradient(90.46deg, #eb382d 4.07%, #bc3035 98.55%);
  }
  .info-box {
    font-family: 'Inter Regular';
    margin-left: 20px;
    .info-item {
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      .border {
        margin-right: 8px;
        padding-right: 8px;
      }
    }
    .info-icon {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }
  }
  .red {
    color: #df2e2d;
  }
  .starknet-tips {
    font-family: 'Inter Regular';
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
