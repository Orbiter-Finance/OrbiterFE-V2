<template>
  <div class="transfer-box">
    <div class="top-area">
      <span class="title">Token</span>
    </div>
    <div class="from-area">
      <div class="topItem">
        <o-tooltip
          v-if="
            transferDataState.fromChainID === 4 ||
            transferDataState.fromChainID === 44
          "
        >
          <template v-slot:titleDesc>
            <span v-html="starkAddress"></span>
          </template>
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
          <SvgIconThemed v-if="fromChainIdList.length > 1" />
        </div>
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <input style="min-width: 50px"
            type="text"
            v-model="transferValue"
            class="right"
            @input="checkTransferValue()"
            :maxlength="18"
            :placeholder="
              userMinPrice ? (
              userMinPrice > fromBalance || userMinPrice >= userMaxPrice
                ? `at least ${userMinPrice}`
                : `${userMinPrice}~${userMaxPrice}`
                ) : '0'
            "
          />
          <el-button @click="fromMax" class="maxBtn" style>Max</el-button>
          <div style="margin-left: 4px">
            <ObSelect
                    :datas="fromTokenList"
                    v-model="selectFromToken"
                    @input="selectFromTokenChange"
                    @show="() => (isRaiseUpFromTokenListVisible = true)"
            ></ObSelect>
          </div>
        </div>
      </div>
    </div>
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
          <SvgIconThemed v-if="toChainIdList.length > 1" />
        </div>
        <div style="display: flex; align-items: center;height: 40px" class="right">
          <div v-if="toTokenList.length" style="margin-left: 4px">
            <ObSelect
                    :datas="toTokenList"
                    v-model="selectToToken"
                    @input="selectToTokenChange"
                    @show="() => (isRaiseUpToTokenListVisible = true)"
            ></ObSelect>
          </div>
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
    <div :hidden="!isSupportXVM">
      <div style="text-align: left;margin-top: 20px;padding-left: 20px">
        <input type="checkbox" id="checkbox" v-model="isCrossAddress" />
        <label for="checkbox"> Cross Address </label>
      </div>
      <div class="cross-addr-box to-area" v-if="isCrossAddress">
        <div data-v-59545920="" class="topItem">
          <div class="left">Cross Address</div>
        </div>
        <input
                @blur="updateSendBtnInfo"
                type="text"
                v-model="crossAddressReceipt"
                placeholder="You receive cross chain addresses"
        />
      </div>
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
      <div v-if="isErrorAddress" class="info-item">
        <svg-icon class="info-icon" iconName="info"></svg-icon>
        <span class="red">
          Address format error.
        </span>
      </div>
      <div v-if="isShowUnreachMinInfo" class="info-item">
        <svg-icon class="info-icon" iconName="info"></svg-icon>
        <span class="red">
          Less than the minimum transfer amount.
        </span>
      </div>
      <div v-if="isShowMax" class="info-item">
        <svg-icon class="info-icon" iconName="info"></svg-icon>
        <span class="red">
          Makers provide {{ maxPrice }}
          {{ selectFromToken }} for liquidity.
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
          :ChainData="fromChainIdList"
          v-on:getChainInfo="getFromChainInfo"
          v-on:closeSelect="closeFromChainPopupClick()"
        />
      </div>
    </CommDialog>
    <CommDialog ref="SelectToChainPopupRef">
      <div slot="PoperContent" style="width: 100%">
        <ObSelectChain
          :ChainData="toChainIdList"
          v-on:getChainInfo="getToChainInfo"
          v-on:closeSelect="closeToChainPopupClick()"
        />
      </div>
    </CommDialog>
    <RaiseUpSelect
      :iconType="'img'"
      :visible="isRaiseUpFromTokenListVisible"
      @hiden="() => (isRaiseUpFromTokenListVisible = false)"
      :datas="fromTokenList"
      :value="selectFromToken"
      @input="selectFromTokenChange"
      :keyMaps="{ value: 'token', label: 'token' }"
    />
    <RaiseUpSelect
            :iconType="'img'"
            :visible="isRaiseUpToTokenListVisible"
            @hiden="() => (isRaiseUpToTokenListVisible = false)"
            :datas="toTokenList"
            :value="selectToToken"
            @input="selectToTokenChange"
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
import util from '../../util/util'
import check from '../../util/check/check'
import transferCalculate from '../../util/transfer/transferCalculate'
import Middle from '../../util/middle/middle'
import orbiterCore from '../../orbiterCore'
import BigNumber from 'bignumber.js'
import config from '../../config'
import { exchangeToCoin, exchangeToUsd, getRates } from '../../util/coinbase';
import { IMXHelper } from '../../util/immutablex/imx_helper'
import getNonce from '../../core/utils/nonce'

import {
  connectStarkNetWallet,
  getStarkMakerAddress,
} from '../../util/constants/starknet/helper'
import { asyncGetExchangeToUsdRate } from '../../util/coinbase'
import { RaiseUpSelect } from '../../components'
import {
  walletIsLogin,
  compatibleGlobalWalletConf,
} from '../../composition/walletsResponsiveData'
import walletDispatchers from '../../util/walletsDispatchers'
import { METAMASK } from '../../util/walletsDispatchers/index'
import {
  transferDataState,
  updateTransferValue,
  updateTransferFromChainID,
  updateTransferToChainID,
  updateTransferGasFee,
  updateETHPrice,
  web3State,
  updateCrossAddressReceipt,
  updateTransferToCurrency,
  updateIsCrossAddress,
  updateTransferFromCurrency,
  updateTransferMakerConfig,
} from '../../composition/hooks';
import { makerConfigs } from "../../core/actions/thegraph";

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
      isCrossAddress: false,
      isRaiseUpFromTokenListVisible: false,
      isRaiseUpToTokenListVisible: false,
      crossAddressReceipt: '',
      selectFromToken: 'ETH',
      selectToToken: 'ETH',
      // loading
      timeSpenLoading: false,
      gasCostLoading: false,
      originGasLoading: false,
      fromBalanceLoading: false,
      toBalanceLoading: false,

      saveTimeLoading: false,

      balanceMap: {},
      originGasCost: 0,
      sendBtnInfo: {
        text: 'SEND',
        disabled: null,
      },

      fromChainIdList: [],
      toChainIdList: [],
      fromTokenList: [],
      toTokenList: [],

      transferValue: '',
      toValue: 0,

      exchangeToUsdPrice: 0,

      fromBalance: Number(0).toFixed(6),
      toBalance: Number(0).toFixed(6),

      makerMaxBalance: 0,
      userMaxPrice: 0,
      userMinPrice: 0,

      formWith: 0,

      cronList: []
    };
  },
  computed: {
    isErrorAddress() {
      if (!this.isCrossAddress || !this.crossAddressReceipt || !util.isSupportXVMContract()) {
        return false;
      }
      if (transferDataState.toChainID === 4 || transferDataState.toChainID === 44) {
        return false;
      }
      const reg = new RegExp(/^0x[a-fA-F0-9]{40}$/);
      return !reg.test(this.crossAddressReceipt);
    },
    isSupportXVM() {
      return util.isSupportXVMContract();
    },
    transferDataState() {
      return transferDataState;
    },
    web3State() {
      return web3State;
    },
    isLogin() {
      return walletIsLogin.value;
    },
    currentWalletAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress;
    },
    currentNetwork() {
      return compatibleGlobalWalletConf.value.walletPayload.networkId;
    },
    isShowExchangeIcon() {
      return (
              !this.queryParams.fixed &&
              transferDataState.toChainID !== 11 &&
              transferDataState.toChainID !== 511 &&
              !this.starkMid
      );
    },
    isStarknet() {
      return this.refererUpper === 'STARKNET';
    },
    refererUpper() {
      // Don't use [$route.query.referer], because it will delay
      const { href } = window.location;
      const match = href.match(/referer=(\w*)/i);
      if (match?.[1]) {
        return match[1].toUpperCase();
      }
      return '';
    },
    starkAddress() {
      const stark = web3State.starkNet.starkNetAddress;
      if (!stark) {
        return '';
      }
      return stark;
    },
    starkMid() {
      const fromChainID = transferDataState.fromChainID;
      const toChainID = transferDataState.toChainID;
      if (
              (fromChainID === 4 || fromChainID === 44) &&
              toChainID !== 1 &&
              toChainID !== 5 &&
              toChainID !== 2 &&
              toChainID !== 22 &&
              toChainID !== 6 &&
              toChainID !== 66
      ) {
        return true;
      }
      return false;
    },
    queryParams() {
      const { query } = this.$route;
      const { referer } = query;
      let { token, tokens, amount, fixed } = query;
      amount = new BigNumber(amount);
      tokens = !tokens ? [] : tokens.split(',');
      let source = makerConfigs.find(item => item.fromChain.name === query.source)?.fromChain?.id || 0;
      let dest = makerConfigs.find(item => item.toChain.name === query.dest)?.toChain?.id || 0;
      const getMapChainIds = (chainNames, isDest) => {
        const chainIds = [];
        if (!chainNames) {
          return chainIds;
        }
        for (const chainName of chainNames.split(',')) {
          const chainId = isDest ?
                  makerConfigs.find(item => item.toChain.name === chainName)?.toChain?.id || 0 :
                  makerConfigs.find(item => item.fromChain.name === chainName)?.fromChain?.id || 0;
          if (chainId) {
            chainIds.push(chainId);
          }
        }
        return Array.from(new Set(chainIds)).sort(function (a, b) {
          return a - b;
        });
      };

      let sources = getMapChainIds(query.sources);
      let dests = getMapChainIds(query.dests, 1);

      if (sources.length === 1 && dests.length === 1 && sources[0] === dests[0]) {
        // Example: sources=[1], dests=[1], invalid, reset them!
        sources = [];
        dests = [];
      }

      if (source > 0 && sources.length > 0 && sources.indexOf(source) === -1) {
        source = 0;
      }
      if (dest > 0 && dests.length > 0 && dests.indexOf(dest) === -1) {
        dest = 0;
      }
      if (source <= 0 && sources.length > 0) {
        source = sources[0];
      }
      if (dest <= 0 && dests.length > 0) {
        dest = dests[0];
      }
      if (dests.length === 1 && sources.length > 1) {
        // When dests only 1 item: A, remove sources A item
        const _index = sources.indexOf(dests[0]);
        if (_index > -1) {
          sources.splice(_index, 1);

          // When source same as dests[0], set source=sources[0]
          if (source == dests[0]) {
            source = sources[0];
          }
        }
      }
      if (dests.length > 0 && dests[0] === source) {
        source = 0;
      }
      if (source === dest) {
        dest = 0;
      }

      // Tidy tokens
      const tidyTokens = [];
      for (const tk of tokens) {
        const makerConfig = makerConfigs.find(item => util.equalsIgnoreCase(item.fromChain.symbol, tk));
        if (makerConfig) {
          tidyTokens.push(makerConfig.fromChain.symbol);
        }
      }
      // Tidy
      if (!token) {
        token = tokens?.[0] || '';
      }
      if (amount.comparedTo(0) === 1) {
        amount = amount.toFixed();
      } else {
        amount = '';
      }
      fixed = fixed === 1; // To boolean
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
      };
    },
    isShowMax() {
      return (
              new BigNumber(this.transferValue).comparedTo(
                      new BigNumber(transferDataState.selectMakerConfig?.fromChain?.maxPrice)
              ) > 0
      );
    },
    isShowUnreachMinInfo() {
      if (walletIsLogin.value && this.transferValue) {
        let makerMin = new BigNumber(this.userMinPrice);
        let transferValue = new BigNumber(this.transferValue);
        const fromBalance = new BigNumber(this.fromBalance);
        return (
                transferValue.comparedTo(makerMin) < 0 &&
                transferValue.comparedTo(fromBalance) < 0
        );
      }
      return false;
    },
    maxPrice() {
      return transferDataState.selectMakerConfig?.fromChain?.maxPrice;
    },
    toValueToolTip() {
      const { selectMakerConfig } = transferDataState;
      let value = selectMakerConfig?.gasFee || 0;
      value = parseFloat((value / 10).toFixed(2));
      return `Sender pays a ${ value }% trading fee for each transfer.`;
    },
    timeSpenToolTip() {
      return `It takes about ${
              this.originTimeSpent
                      ? this.originTimeSpent.replace('~', '')
                      : this.originTimeSpent
      } moving funds using the native bridge, and it only takes about ${
              this.timeSpent ? this.timeSpent.replace('~', '') : this.timeSpent
      } using Orbiter.`;
    },
    gasFeeToolTip() {
      const { selectMakerConfig } = transferDataState;
      const gasFee = `<b>Fees using the native bridge costs around:</b><br />Gas Fee: $${ this.originGasCost.toFixed(
              2
      ) }<br />`;
      const tradingFee = ` <br /><b>Fees using Orbiter costs:</b><br />Trading Fee: $${ (
              this.orbiterTradingFee * this.exchangeToUsdPrice
      ).toFixed(2) }`;
      const withholdingGasFee = `<br />Withholding Fee: $${
              selectMakerConfig
                      ? (
                              selectMakerConfig.tradingFee * this.exchangeToUsdPrice
                      ).toFixed(2)
                      : 0
      }`;
      const total = `<br /><br /><b>Total: $${ (
              this.gasTradingTotal * this.exchangeToUsdPrice
      ).toFixed(2) }</b>`;

      return gasFee + tradingFee + withholdingGasFee + total;
    },
    timeSpent() {
      // const { selectMakerConfig } = transferDataState;
      // return selectMakerConfig.spendTime
      return transferCalculate.transferSpentTime(
              transferDataState.fromChainID,
              transferDataState.toChainID
      );
    },
    originTimeSpent() {
      return transferCalculate.transferOrginTime(
              transferDataState.fromChainID,
              transferDataState.toChainID
      );
    },
    orbiterTradingFee() {
      const { selectMakerConfig } = transferDataState;
      if (!selectMakerConfig) return;
      const { fromChain } = selectMakerConfig;
      let tradingFee = new BigNumber(
              this.transferValue ? this.transferValue : 0
      )
              .multipliedBy(new BigNumber(selectMakerConfig.gasFee))
              .dividedBy(new BigNumber(1000));
      let digit = orbiterCore.getDigitByPrecision(fromChain.decimals);
      let tradingFee_fix = tradingFee.decimalPlaces(digit, BigNumber.ROUND_UP);
      return tradingFee_fix;
    },
    gasTradingTotal() {
      const { selectMakerConfig } = transferDataState;
      if (!selectMakerConfig) return "0.000000";
      let gasFee = new BigNumber(selectMakerConfig.tradingFee);
      return gasFee.plus(this.orbiterTradingFee).toFixed(6);
    },
    gasSavingMax() {
      let savingValue =
              this.originGasCost - this.gasTradingTotal * this.exchangeToUsdPrice;
      if (savingValue < 0) {
        savingValue = 0;
      }
      let savingTokenName = '$';
      return savingTokenName + savingValue.toFixed(2).toString();
    },
    gasSavingMin() {
      const gasCost = this.gasCost();
      let savingValue =
              this.originGasCost -
              this.gasTradingTotal * this.exchangeToUsdPrice -
              gasCost;
      if (savingValue < 0) {
        savingValue = 0;
      }
      let savingTokenName = '$';
      return savingTokenName + savingValue.toFixed(2).toString();
    },
    showSaveGas() {
      return (
              this.originGasCost - this.gasTradingTotal * this.exchangeToUsdPrice > 0
      );
    },
    saveGasLoading() {
      return this.originGasLoading;
    },
    transferSavingTime() {
      return this.originTimeSpent?.replace('~', '');
    },
  },
  watch: {
    queryParams: function (nv) {
      // When transferValue is empty, set it = nv.amount
      if (this.transferValue <= 0) {
        this.transferValue = nv.amount;
      }
    },
    crossAddressReceipt: function (newValue) {
      updateCrossAddressReceipt(newValue);
    },
    selectFromToken(newValue) {
      if (transferDataState.fromCurrency !== newValue) {
        this.updateTransferInfo({ fromCurrency: newValue });
        this.clearTransferValue();
      }
    },
    selectToToken: function (newValue) {
      if (transferDataState.toCurrency !== newValue) {
        this.updateTransferInfo({ toCurrency: newValue });
      }
    },
    isCrossAddress: function (newValue) {
      updateIsCrossAddress(newValue);
      this.updateSendBtnInfo();
    },
    currentNetwork(newValue, oldValue) {
      if (oldValue !== newValue) this.clearTransferValue();
    },
    currentWalletAddress: function (newValue, oldValue) {
      console.log('Current wallet address', newValue);
      if (oldValue !== newValue && newValue !== '0x') this.refreshUserBalance();
    },
    'web3State.starkNet.starkNetAddress': function (newValue) {
      if (newValue) this.refreshUserBalance();
    },
    'transferDataState.fromChainID': function (newValue) {
      if (transferDataState.fromChainID !== newValue) this.updateTransferInfo({ fromChainID: newValue });
    },
    'transferDataState.toChainID': function (newValue) {
      if (transferDataState.toChainID !== newValue) this.updateTransferInfo({ toChainID: newValue });
    },
    transferValue: function (newValue) {
      transferDataState.transferValue !== newValue &&
      updateTransferValue(newValue);
    },
  },
  async mounted() {
    const updateETHPriceI = async () => {
      transferCalculate
              .getTokenConvertUsd('ETH')
              .then((response) => updateETHPrice(response))
              .catch((error) => console.warn('GetETHPriceError =', error));
    };

    await updateETHPriceI();

    this.transferValue = this.queryParams.amount;
    updateIsCrossAddress(this.isCrossAddress);
    updateCrossAddressReceipt(this.crossAddressReceipt);

    this.rates = await getRates('ETH');

    this.updateTransferInfo();
  },
  onBeforeUnmount() {
    for (const cron of this.cronList) {
      clearInterval(cron);
    }
  },
  created() {
    this.replaceStarknetWrongHref();
  },
  methods: {
    updateTransferInfo({ fromChainID, toChainID, fromCurrency, toCurrency } = transferDataState) {
      const oldFromChainID = transferDataState.fromChainID;
      const oldToChainID = transferDataState.toChainID;
      const oldFromCurrency = transferDataState.fromCurrency;
      fromChainID = fromChainID || transferDataState.fromChainID;
      toChainID = toChainID || transferDataState.toChainID;
      fromCurrency = fromCurrency || transferDataState.fromCurrency;
      toCurrency = toCurrency || transferDataState.toCurrency;
      const { tokens, source, dest } = this.queryParams;
      const fromTokens = tokens;
      const fromChainIdList = Array.from(new Set(
              makerConfigs.map(item => item.fromChain.id)
      )).sort(function (a, b) {
        return a - b;
      });
      fromChainID = fromChainID || (source && fromChainIdList.find(item => item === +source) ?
              +source :
              fromChainIdList[0]);
      const toChainIdList = Array.from(new Set(
              makerConfigs.filter(item => item.fromChain.id === fromChainID)
                      .map(item => {
                        if (item.fromChain.id === fromChainID) {
                          return item.toChain.id;
                        }
                      })
      )).sort(function (a, b) {
        return a - b;
      });

      toChainID = toChainID || (dest && toChainIdList.find(item => item === +dest) ?
              +dest :
              toChainIdList[0]);
      if (toChainIdList.indexOf(toChainID) === -1) {
        toChainID = toChainIdList.indexOf(dest) > -1 ?
                dest :
                toChainIdList[0];
      }

      const duplicateFromChainIdIndex = fromChainIdList.findIndex(item => item === toChainID);
      if (duplicateFromChainIdIndex !== -1) {
        fromChainIdList.splice(duplicateFromChainIdIndex, 1);
      }
      const selectedFromChainIdIndex = fromChainIdList.findIndex(item => item === fromChainID);
      if (selectedFromChainIdIndex !== -1) {
        fromChainIdList.splice(selectedFromChainIdIndex, 1);
      }
      const duplicateToChainIdIndex = toChainIdList.findIndex(item => item === fromChainID);
      if (duplicateToChainIdIndex !== -1) {
        toChainIdList.splice(duplicateToChainIdIndex, 1);
      }
      const selectedToChainIdIndex = toChainIdList.findIndex(item => item === toChainID);
      if (selectedToChainIdIndex !== -1) {
        toChainIdList.splice(selectedToChainIdIndex, 1);
      }

      let makerConfigList = makerConfigs.filter(item => item.fromChain.id === fromChainID && item.toChain.id === toChainID);
      if (fromTokens.length) {
        makerConfigList = makerConfigList.filter(item =>
                fromTokens.find((it) => util.equalsIgnoreCase(it, item.fromChain.symbol))
        );
      }

      const fromTokenList = [];
      const toTokenList = [];
      makerConfigList.forEach(item => {
        if (!fromTokenList.find(it => it.token === item.fromChain.symbol)) {
          fromTokenList.push({
            icon: config.getTokenIcon(item.fromChain.symbol),
            token: item.fromChain.symbol,
            amount: 0,
          });
        }
        if (fromCurrency === item.fromChain.symbol && !toTokenList.find(it => it.token === item.toChain.symbol)) {
          toTokenList.push({
            icon: config.getTokenIcon(item.toChain.symbol),
            token: item.toChain.symbol,
            amount: 0,
          });
        }
      });
      if (fromTokenList.length && !fromTokenList.find((item) => item.token === fromCurrency)) {
        fromCurrency = fromTokenList[0].token;
        if (oldFromChainID !== fromChainID) this.selectFromToken = fromTokenList[0].token;
      }

      makerConfigList.forEach(item => {
        if (fromCurrency === item.fromChain.symbol && !toTokenList.find(it => it.token === item.toChain.symbol)) {
          toTokenList.push({
            icon: config.getTokenIcon(item.toChain.symbol),
            token: item.toChain.symbol,
            amount: 0,
          });
        }
      });

      if (toTokenList.length && !toTokenList.find((item) => item.token === toCurrency)) {
        toCurrency = toTokenList[0].token;
        if (oldToChainID !== toChainID) this.selectToToken = toTokenList[0].token;
      }

      if (this.fromChainIdList !== fromChainIdList) {
        this.fromChainIdList = fromChainIdList;
      }
      if (this.toChainIdList !== toChainIdList) {
        this.toChainIdList = toChainIdList;
      }
      if (this.toTokenList !== toTokenList) {
        this.toTokenList = toTokenList;
      }
      if (this.fromTokenList !== fromTokenList) {
        this.fromTokenList = fromTokenList;
      }
      updateTransferFromChainID(fromChainID);
      updateTransferToChainID(toChainID);
      updateTransferFromCurrency(fromCurrency);
      updateTransferToCurrency(toCurrency);

      const makerConfig = makerConfigs.find(item =>
              item.fromChain.id === fromChainID &&
              item.toChain.id === toChainID &&
              item.fromChain.symbol === fromCurrency &&
              item.toChain.symbol === toCurrency
      );
      updateTransferMakerConfig(makerConfig);

      if (fromChainID !== oldFromChainID || toChainID !== oldToChainID) {
        this.updateOriginGasCost();
        this.specialProcessing();
      }
      if (fromChainID !== oldFromChainID) {
        let self = this;
        this.gasCostLoading = true;
        transferCalculate
                .transferSpentGas(fromChainID)
                .then((response) => {
                  updateTransferGasFee(response);
                  self.gasCostLoading = false;
                })
                .catch((error) => {
                  self.gasCostLoading = false;
                  console.warn('GetGasFeeError =', error);
                });
      }
      if (fromCurrency !== oldFromCurrency) {
        this.updateExchangeToUsdPrice();
      }
      this.refreshUserBalance();
      if (fromChainID !== oldFromChainID || fromCurrency !== oldFromCurrency) {
        this.userMinPrice = makerConfig?.fromChain?.minPrice || 0;
      }
      this.updateRoutes(oldFromChainID, oldToChainID);
      this.updateSendBtnInfo();
    },
    async updateSendBtnInfo() {
      const { selectMakerConfig } = transferDataState;
      if (!selectMakerConfig) return;
      const { fromChain } = selectMakerConfig;
      await this.getMakerMaxBalance();
      this.updateToValue();
      const availableDigit = fromChain.decimals === 18 ? 6 : 2;
      let opBalance = 10 ** -availableDigit;
      let useBalance = new BigNumber(this.fromBalance)
              .minus(new BigNumber(selectMakerConfig.tradingFee))
              .minus(new BigNumber(opBalance));
      let userMax = useBalance.decimalPlaces(availableDigit, BigNumber.ROUND_DOWN) > 0
              ? useBalance.decimalPlaces(availableDigit, BigNumber.ROUND_DOWN)
              : new BigNumber(0);
      let makerMax = new BigNumber(fromChain.maxPrice);
      let makerMin = new BigNumber(this.userMinPrice);
      let transferValue = new BigNumber(this.transferValue || 0);
      const info = {
        text: 'SEND',
        disabled: null,
      };
      console.log('userMax', userMax.toString(), 'transferValue', transferValue.toString(), 'selectMakerConfigMax', makerMax.toString(),
              'toValue', this.toValue.toString(), 'makerMaxBalance', new BigNumber(this.makerMaxBalance).toString());
      if (walletIsLogin.value) {
        info.text = 'SEND';
        if (transferValue.comparedTo(0) < 0) {
          info.disabled = 'disabled';
        } else if (transferValue.comparedTo(this.userMaxPrice) > 0) {
          info.disabled = 'disabled';
        }
        if (transferValue.comparedTo(userMax) > 0) {
          info.text = 'INSUFFICIENT FUNDS';
          info.disabled = 'disabled';
        } else if (transferValue.comparedTo(makerMax) > 0) {
          info.text = 'INSUFFICIENT LIQUIDITY';
          info.disabled = 'disabled';
        } else if (transferValue.comparedTo(makerMin) < 0) {
          info.text = 'INSUFFICIENT FUNDS';
          info.disabled = 'disabled';
        } else if (transferValue.comparedTo(0) > 0 && this.toValue <= 0) {
          info.text = 'INSUFFICIENT FUNDS';
          info.disabled = 'disabled';
        } else if (this.toValue > 0 && this.toValue.comparedTo(new BigNumber(this.makerMaxBalance)) > 0) {
          info.text = 'INSUFFICIENT LIQUIDITY 1';
          info.disabled = 'disabled';
        }

        if (this.isShowUnreachMinInfo || this.isShowMax) {
          info.text = 'SEND';
          info.disabled = 'disabled';
        }

        if (util.isSupportXVMContract() && this.isCrossAddress && (!this.crossAddressReceipt || this.isErrorAddress)) {
          info.text = 'SEND';
          info.disabled = 'disabled';
        }
      }
      this.sendBtnInfo = info;
    },
    updateRoutes(oldFromChainID, oldToChainID) {
      const { fromChainID, toChainID, selectMakerConfig } = transferDataState;
      const { path, query } = this.$route;
      const changeQuery = {};
      if (fromChainID !== oldFromChainID && query?.source !== selectMakerConfig.fromChain.name) {
        changeQuery.source = selectMakerConfig.fromChain.name;
      }
      if (toChainID !== oldToChainID && query?.dest !== selectMakerConfig.toChain.name) {
        changeQuery.dest = selectMakerConfig.toChain.name;
      }
      if (Object.keys(changeQuery).length) {
        const newQuery = JSON.parse(JSON.stringify(query));
        Object.assign(newQuery, changeQuery);
        this.$router.push({
          path,
          query: newQuery,
        });
      }
    },
    updateToValue() {
      const { fromCurrency, toCurrency, selectMakerConfig } = transferDataState;
      if (!this.transferValue || !selectMakerConfig) return '0';
      let amount = orbiterCore.getToAmountFromUserAmount(
              new BigNumber(this.transferValue).plus(
                      new BigNumber(selectMakerConfig.tradingFee)
              ),
              selectMakerConfig,
              false
      );
      if (fromCurrency !== toCurrency) {
        const exchangeRates = this.rates;
        const fromRate = exchangeRates[fromCurrency];
        const toRate = exchangeRates[toCurrency];
        const slippage = selectMakerConfig.slippage;
        if (!fromRate || !toRate || !slippage) {
          console.log('get rate fail', fromCurrency, fromRate, toCurrency, toRate);
          return 0;
        }
        const value = (amount.dividedBy(fromRate).multipliedBy(toRate)).toFixed(6);
        this.toValue = new BigNumber(value).multipliedBy(1 - slippage / 10000);
      } else {
        this.toValue = amount;
      }
    },
    async specialProcessing() {
      const { fromChainID, toChainID } = transferDataState;
      if (fromChainID === 4 || fromChainID === 44 || toChainID === 4 || toChainID === 44) {
        const { starkNetIsConnect, starkNetAddress } = web3State.starkNet;
        if (!starkNetIsConnect || !starkNetAddress) {
          await connectStarkNetWallet();
          if (!web3State.starkNet.starkIsConnected && !web3State.starkNet.starkNetAddress) {
            const makerConfig = makerConfigs[0];
            this.updateTransferInfo({ fromChainID: makerConfig.fromChain.id });
            return;
          }
        }
      }
      if (fromChainID === 9 || fromChainID === 99 || toChainID === 9 || toChainID === 99) {
        if (walletIsLogin.value) {
          this.checkTransferValue();
        }
      }
    },
    async updateUserMaxPrice() {
      const { selectMakerConfig } = transferDataState;
      if (!selectMakerConfig) return '0';
      const { fromChain, toChain } = selectMakerConfig;
      if (!walletIsLogin.value) {
        return fromChain.maxPrice;
      }
      // check fromBalance
      if (!this.fromBalance) {
        return '0';
      }
      let transferGasFee = (await transferCalculate.getTransferGasLimit(
              fromChain.id,
              selectMakerConfig.sender,
              fromChain.tokenAddress
      )) || 0;
      let avalibleDigit = orbiterCore.getDigitByPrecision(fromChain.decimals);
      let opBalance = 10 ** -avalibleDigit;
      let preGasDigit = 3;
      let preGas = 0;
      if ([3, 33, 1, 5, 2, 22, 7, 77, 16, 516].includes(fromChain.id)) {
        preGas = 10 ** -preGasDigit;
      }
      let userBalance = new BigNumber(this.fromBalance)
              .minus(new BigNumber(selectMakerConfig.tradingFee))
              .minus(new BigNumber(opBalance))
              .minus(new BigNumber(transferGasFee))
              .minus(new BigNumber(preGas));
      let userMax = userBalance.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN) > 0
              ? userBalance.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN)
              : new BigNumber(0);
      let max = userMax.comparedTo(new BigNumber(fromChain.maxPrice)) > 0
              ? new BigNumber(fromChain.maxPrice)
              : userMax;
      if ((
              fromChain.id === 9 ||
              fromChain.id === 99 ||
              toChain.id === 9 ||
              toChain.id === 99) &&
              fromChain.decimals === 18
      ) {
        max = max.decimalPlaces(5, BigNumber.ROUND_DOWN);
      }
      this.userMaxPrice = max.toString();
    },
    addBalance(chainId, symbol, value, address) {
      const walletAddress = address || compatibleGlobalWalletConf.value.walletPayload.walletAddress;
      const addressBalanceMap = this.balanceMap[walletAddress] = this.balanceMap[walletAddress] || {};
      const chainBalanceMap = addressBalanceMap[chainId] = addressBalanceMap[chainId] || {};
      chainBalanceMap[symbol] = value || Number(0).toFixed(6);
      this.balanceMap = JSON.parse(JSON.stringify(this.balanceMap));
    },
    clearTransferValue() {
      this.transferValue = '';
      this.toValue = 0;
    },
    replaceStarknetWrongHref() {
      /*
        ?refer=starknet&dests=starknet
        =>
        ?referer=starknet&dest=starknet&fixed=1
      */
      let isStarknetRefer = false;
      const { href } = window.location;
      const match = href.match(/refer=starknet/i);
      if (match) {
        isStarknetRefer = true;
      }

      if (isStarknetRefer) {
        const { path, query } = this.$route;
        delete query.dests;
        delete query.refer;
        try {
          window.location.href = `${ path }?referer=starknet&dest=starknet&fixed=1`;
        } catch (err) {
          //
        }
      }
    },
    showChainName(isFrom = true) {
      const localChainID = transferDataState[`${ isFrom ? 'from' : 'to' }ChainID`];
      return util.chainName(localChainID);
    },
    showChainIcon(isFrom = true) {
      const localChainID = transferDataState[`${ isFrom ? 'from' : 'to' }ChainID`];
      return this.$env.chainIcon[localChainID];
    },
    selectFromTokenChange(val) {
      this.selectFromToken = val;
    },
    selectToTokenChange(val) {
      this.selectToToken = val;
    },
    fromMax() {
      if (!walletIsLogin.value) {
        this.transferValue = '0';
        return;
      }
      const { selectMakerConfig } = transferDataState;
      if (!selectMakerConfig) return;
      const { fromChain, toChain } = selectMakerConfig;
      let avalibleDigit = orbiterCore.getDigitByPrecision(fromChain.decimals);
      let opBalance = 10 ** -avalibleDigit;
      let useBalanle = new BigNumber(this.fromBalance)
              .minus(new BigNumber(selectMakerConfig.tradingFee))
              .minus(new BigNumber(opBalance));
      let userMax = useBalanle.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN) > 0
              ? useBalanle.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN)
              : new BigNumber(0);
      let max = userMax.comparedTo(new BigNumber(this.userMaxPrice)) > 0
              ? new BigNumber(this.userMaxPrice) : userMax;
      if ((fromChain.id === 9 ||
              fromChain.id === 99 ||
              toChain.id === 9 ||
              toChain.id === 99) &&
              fromChain.decimals === 18
      ) {
        max = max.decimalPlaces(5, BigNumber.ROUND_DOWN);
      }
      this.transferValue = max.toString();
    },
    transfer_mid() {
      const { fromChainID, toChainID, fromCurrency, toCurrency } = transferDataState;
      this.updateTransferInfo({
        toChainID: fromChainID,
        fromChainID: toChainID,
      });
      this.selectFromToken = toCurrency;
      this.selectToToken = fromCurrency;
    },
    changeFromChain() {
      if (this.fromChainIdList.length <= 1) {
        return;
      }
      this.showFromChainPopupClick();
    },
    changeToChain() {
      if (this.toChainIdList.length <= 1) {
        return;
      }
      this.showToChainPopupClick();
    },
    getFromChainInfo(e) {
      if (transferDataState.fromChainID !== e.localID) this.updateTransferInfo({ fromChainID: e.localID });
    },
    getToChainInfo(e) {
      if (transferDataState.toChainID !== e.localID) this.updateTransferInfo({ toChainID: e.localID });
    },
    // open selectChain
    showFromChainPopupClick() {
      this.$refs.SelectFromChainPopupRef.showCustom();
    },
    // close selectChain
    closeFromChainPopupClick() {
      this.$refs.SelectFromChainPopupRef.maskClick();
    },
    // open selectChain
    showToChainPopupClick() {
      this.$refs.SelectToChainPopupRef.showCustom();
    },
    // close selectChain
    closeToChainPopupClick() {
      this.$refs.SelectToChainPopupRef.maskClick();
    },
    checkTransferValue() {
      const { selectMakerConfig } = transferDataState;
      if (!selectMakerConfig) return;
      const { fromChain, toChain } = selectMakerConfig;
      if (fromChain.id === 9 || fromChain.id === 99 || toChain.id === 9 || toChain.id === 99) {
        this.transferValue = fromChain.decimals === 18
                ? this.transferValue.replace(/^\D*(\d*(?:\.\d{0,5})?).*$/g, '$1')
                : this.transferValue.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1');
      } else {
        this.transferValue = fromChain.decimals === 18
                ? this.transferValue.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g, '$1')
                : this.transferValue.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1');
      }
      this.updateSendBtnInfo();
    },
    async sendTransfer() {
      if (check.checkIsBitKeep()) {
        this.$notify.error({
          title: `Bitkeep is not supported and please try another wallet.`,
          duration: 3000,
        });
        return;
      }
      if (this.sendBtnInfo && this.sendBtnInfo.disabled === 'disabled') {
        return;
      }
      // if unlogin  login first
      if (!walletIsLogin.value) {
        Middle.$emit('connectWallet', true);
        return;
      } else {
        if (!check.checkPrice(this.transferValue)) {
          this.$notify.error({
            title: `The format of input amount is incorrect`,
            duration: 3000,
          });
          return;
        }
        if (this.fromBalance === null) {
          this.$notify.error({
            title: `Waiting for account balance to be obtained`,
            duration: 3000,
          });
          return;
        }
        const { fromChainID, toChainID, fromCurrency, selectMakerConfig } = transferDataState;
        if (!selectMakerConfig) return;
        const { fromChain } = selectMakerConfig;
        let nonce = await getNonce.getNonce(
                fromChain.id,
                fromChain.tokenAddress,
                fromChain.symbol,
                compatibleGlobalWalletConf.value.walletPayload.walletAddress
        );

        if ((toChainID === 4 || toChainID === 44) && fromCurrency == 'DAI'
        ) {
          this.$notify.error({
            title: `Due to the Insufficient liquidity of DAI for StarkNet, “to StarkNet” function is suspende.`,
            duration: 6000,
          });
          return;
        }

        if (nonce > 8999) {
          this.$notify.error({
            title: `Address with the nonce over 9000 are not supported by Orbiter`,
            duration: 3000,
          });
          return;
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
            title: `Orbiter can only support minimum of ${ this.userMinPrice } and maximum of ${ this.maxPrice } ${ fromCurrency } on transfers.`,
            duration: 3000,
          });
          return;
        }

        // Ensure immutablex's registered
        if (toChainID === 8 || toChainID === 88) {
          const imxHelper = new IMXHelper(toChainID);
          const walletAddress =
                  compatibleGlobalWalletConf.value.walletPayload.walletAddress;
          walletAddress && (await imxHelper.ensureUser(walletAddress));
        }

        if (fromChainID === 4 || fromChainID === 44) {
          const { starkChain } = web3State.starkNet;
          if (!starkChain || starkChain === 'unlogin') {
            util.showMessage('please connect StarkNet Wallet', 'error');
            return;
          }
          if (fromChainID === 4 && (starkChain === 44 || starkChain === 'localhost')) {
            util.showMessage(
                    'please switch StarkNet Wallet to mainnet',
                    'error'
            );
            return;
          }
          if (fromChainID === 44 && (starkChain === 4 || starkChain == 'localhost')) {
            util.showMessage(
                    'please switch StarkNet Wallet to testNet',
                    'error'
            );
            return;
          }
        } else {
          if (compatibleGlobalWalletConf.value.walletPayload.networkId.toString() !== util.chainNetWorkId(fromChainID)) {
            if (compatibleGlobalWalletConf.value.walletType === METAMASK) {
              try {
                await util.ensureWalletNetwork(fromChainID);
              } catch (err) {
                util.showMessage(err.message, 'error');
                return;
              }
            } else {
              const matchSwitchChainDispatcher = walletDispatchersOnSwitchChain[compatibleGlobalWalletConf.value.walletType];
              if (matchSwitchChainDispatcher) {
                const successCallback = () => this.$emit('stateChanged', '2');
                matchSwitchChainDispatcher(
                        compatibleGlobalWalletConf.value.walletPayload.provider,
                        () => successCallback.bind(this)
                );
                return;
              }
            }
          }
        }
        const chainInfo = util.getChainInfoByChainId(fromChainID);
        const toAddressAll = (util.isExecuteXVMContract() ?
                chainInfo.xvmList[0] :
                selectMakerConfig.sender).toLowerCase();
        let toAddress = util.shortAddress(toAddressAll);
        if (fromChainID === 4 || fromChainID === 44 && !util.isExecuteXVMContract()) {
          toAddress = util.shortAddress(
                  getStarkMakerAddress(selectMakerConfig.sender, fromChainID)
          );
        }
        const { isCrossAddress, crossAddressReceipt } = transferDataState;
        const walletAddress = (isCrossAddress ? crossAddressReceipt : compatibleGlobalWalletConf.value.walletPayload.walletAddress).toLowerCase();
        // sendTransfer
        this.$store.commit('updateConfirmRouteDescInfo', [
          {
            no: 1,
            from: new BigNumber(this.transferValue).plus(
                    new BigNumber(selectMakerConfig.tradingFee)
            ) + fromCurrency,
            to: toAddress,
            fromTip: '',
            toTip: toAddressAll,
            icon: util.isExecuteXVMContract() ? 'contract' : 'wallet'
          },
          {
            no: 2,
            from: toAddress,
            to: util.shortAddress(walletAddress),
            fromTip: toAddressAll,
            toTip: walletAddress,
            icon: 'wallet'
          }
        ]);
        this.$emit('stateChanged', '2');
      }
    },
    async updateOriginGasCost() {
      this.originGasLoading = true;
      const { fromChainID, toChainID, fromCurrency } = transferDataState;

      if (!fromChainID || !toChainID) {
        return;
      }
      try {
        this.originGasCost = await transferCalculate.transferOrginGasUsd(
                fromChainID,
                toChainID,
                fromCurrency !== 'ETH'
        );
      } catch (error) {
        console.warn('updateOriginGasCost error =', error.message);
        this.$notify.error({
          title: `GetOrginGasFeeError`,
          desc: error,
          duration: 3000,
        });
      }
      this.originGasLoading = false;
    },
    async updateExchangeToUsdPrice() {
      const { selectMakerConfig } = transferDataState;
      if (!selectMakerConfig) return;
      const price = (await exchangeToUsd(1, selectMakerConfig.fromChain.symbol)).toNumber();
      if (price > 0) {
        this.exchangeToUsdPrice = price;
      }
    },
    async getBalance(
            chainId,
            tokenAddress,
            tokenName,
            precision
    ) {
      const { fromCurrency, selectMakerConfig } = transferDataState;
      const sender = selectMakerConfig.sender;
      try {
        if (!sender) {
          return '';
        }
        const response = await transferCalculate.getTransferBalance(
                chainId,
                tokenAddress,
                tokenName,
                sender,
                true
        );
        if (fromCurrency !== tokenName) {
          const exchangeRes = (await exchangeToCoin(response, tokenName, fromCurrency, this.rates)).toString();
          return (new BigNumber(exchangeRes).dividedBy(10 ** precision)).toFixed(6);
        }
        return (response / 10 ** precision).toFixed(6);
      } catch (error) {
        console.warn(error);
        return 0;
      }
    },
    async getMakerMaxBalance() {
      const { selectMakerConfig } = transferDataState;
      if (!selectMakerConfig) return;
      const { toChain } = selectMakerConfig;
      // dYdX can't get maker's balance, don't check it
      if (toChain.id === 11 || toChain.id === 511) {
        this.makerMaxBalance = Number.MAX_SAFE_INTEGER;
        return;
      }
      const makerAddress = selectMakerConfig.sender;
      const addressBalanceMap = this.balanceMap[makerAddress] = this.balanceMap[makerAddress] || {};
      const chainBalanceMap = addressBalanceMap[toChain.id] = addressBalanceMap[toChain.id] || {};
      if (chainBalanceMap[toChain.symbol]) {
        this.makerMaxBalance = chainBalanceMap[toChain.symbol];
        return;
      }

      const _balance = await this.getBalance(
              toChain.id,
              toChain.tokenAddress,
              toChain.symbol,
              toChain.decimals
      );
      if (_balance > 0) {
        // Max use maker balance's 95%, because it transfer need gasfee(also zksync need changePubKey fee)
        this.makerMaxBalance = (new BigNumber(_balance).multipliedBy(0.95)).toString();
        this.addBalance(toChain.id, toChain.symbol, this.makerMaxBalance, makerAddress)
      }
    },
    gasCost() {
      const { fromChainID, selectMakerConfig } = transferDataState;
      if (
              fromChainID === 3 ||
              fromChainID === 33 ||
              fromChainID === 9 ||
              fromChainID === 99
      ) {
        let transferGasFee = transferDataState.gasFee;
        const selectTokenRate = asyncGetExchangeToUsdRate(selectMakerConfig.fromChain.symbol);
        if (selectTokenRate > 0) {
          // switch to usd
          transferGasFee = transferGasFee / selectTokenRate;
        }
        return Math.ceil(Number(transferGasFee * 10)) / 10;
      }
      return (
              Math.ceil(transferDataState.gasFee * transferDataState.ethPrice * 10) /
              10
      );
    },
    refreshUserBalance() {
      const self = this;
      const { fromChainID, selectMakerConfig } = transferDataState;
      if (!selectMakerConfig) return;
      const { fromChain, toChain } = selectMakerConfig;
      let address = compatibleGlobalWalletConf.value.walletPayload.walletAddress;
      if (fromChainID === 4 || fromChainID === 44) {
        address = web3State.coinbase;
      }
      if (!address || address === '0x') return;
      const addressBalanceMap = this.balanceMap[address] = this.balanceMap[address] || {};
      const fromChainBalanceMap = addressBalanceMap[fromChain.id] = addressBalanceMap[fromChain.id] || {};
      if (typeof fromChainBalanceMap[fromChain.symbol] === 'undefined') {
        this.fromBalanceLoading = true;
        transferCalculate.getTransferBalance(fromChain.id, fromChain.tokenAddress, fromChain.symbol, address)
                .then((response) => {
                  const balance = (response / 10 ** fromChain.decimals).toFixed(6);
                  self.addBalance(fromChain.id, fromChain.symbol, balance, address);
                  self.fromBalance = balance;
                  self.updateUserMaxPrice();
                })
                .catch((error) => {
                  console.warn(error);
                }).finally(() => {
          this.fromBalanceLoading = false;
        });
      } else {
        self.updateUserMaxPrice();
        self.fromBalance = fromChainBalanceMap[fromChain.symbol];
      }

      const toChainBalanceMap = addressBalanceMap[toChain.id] = addressBalanceMap[toChain.id] || {};
      if (typeof toChainBalanceMap[toChain.symbol] === 'undefined') {
        this.toBalanceLoading = true;
        transferCalculate.getTransferBalance(toChain.id, toChain.tokenAddress, toChain.symbol, address)
                .then((response) => {
                  const balance = (response / 10 ** toChain.decimals).toFixed(6);
                  self.addBalance(toChain.id, toChain.symbol, balance, address);
                  self.toBalance = balance;
                })
                .catch((error) => {
                  console.warn(error);
                }).finally(() => {
          this.toBalanceLoading = false;
        });
      } else {
        self.toBalance = toChainBalanceMap[toChain.symbol];
      }
    },
  },
};
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
  .cross-addr-box {
    input {
      border: 0;
      outline: none; //
      background-color: rgba(0, 0, 0, 0); //
      width: 100%;
      height: 40px;
    }
  }
}
</style>
