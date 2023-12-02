<template>
  <div>
    <div class="transfer-box" v-loading="boxLoading" element-loading-background="rgba(0, 0, 0, 0)" v-if="!isEmpty">
<!--      <div v-if="makerAddress" style="font-size: 15px;margin-bottom: 20px">{{ makerAddress }}</div>-->
      <div class="top-area" style="position: relative">
        <span class="title">Token</span>
        <div v-if="!isNewVersion" class="symbol">
          <ObSelect
                  :datas="fromTokenList"
                  v-model="selectFromToken"
                  @input="selectFromTokenChange"
                  @show="() => (isRaiseUpFromTokenListVisible = true)"
          ></ObSelect>
        </div>
        <div v-if="!isV3" style="flex-grow: 1;display: flex;justify-content: flex-end;align-items: center">
          <span :style="`margin-right:10px;color:${isNewVersion ? (!isLightMode ? '#22DED7' : '#4890FE') : '#888888'}`">{{ isNewVersion ? 'V2' : 'V1' }}</span>
          <el-switch :hidden="isLightMode"
                     v-model="isNewVersion"
                     active-color="#22DED7"
                     inactive-color="#888888">
          </el-switch>
          <el-switch :hidden="!isLightMode"
                     v-model="isNewVersion"
                     active-color="#4890FE"
                     inactive-color="#888888">
          </el-switch>
        </div>
      </div>
      <div class="from-area">
        <div class="topItem">
          <o-tooltip
                  v-if="
            transferDataState.fromChainID === CHAIN_ID.starknet ||
            transferDataState.fromChainID === CHAIN_ID.starknet_test
          "
          >
            <template v-slot:titleDesc>
              <span v-html="starkAddress"></span>
            </template>
            <div class="left">From</div>
          </o-tooltip>
          <div v-else class="left">From</div>
          <div v-if="isLogin && fromBalance !== '-1'" class="right">
            Balance:
            <CommLoading
                    :hidden="!fromBalanceLoading"
                    style="left: 0.3rem; top: 0.2rem"
                    width="1.2rem"
                    height="1.2rem"
            />
            <span :hidden="fromBalanceLoading">{{ fromBalance }}</span>
          </div>
        </div>
        <div class="bottomItem">
          <div class="left" @click="changeFromChain">
            <svg-icon
              :iconName="showChainIcon()"
              style="width: 24px; height: 24px; margin-right: 4px"
            ></svg-icon>
            <span>{{ showChainName() }}</span>
            <SvgIconThemed v-if="fromChainIdList.length" />
          </div>
          <div
                  style="display: flex; justify-content: center; align-items: center;height: 30px"
          >
            <input style="min-width: 50px"
                   type="text"
                   v-model="transferValue"
                   class="right"
                   @input="inputTransferValue()"
                   :maxlength="18"
                   :placeholder="
              userMinPrice ? (
              userMinPrice > fromBalance || userMinPrice >= userMaxPrice
                ? `at least ${userMinPrice}`
                : `${userMinPrice}~${userMaxPrice}`
                ) : '0'
            "
            />
            <el-button :disabled="fromBalanceLoading" @click="fromMax" class="maxBtn" style>Max</el-button>
            <div style="margin-left: 4px">
              <ObSelect :hidden="!isNewVersion"
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
            transferDataState.toChainID == CHAIN_ID.starknet ||
            transferDataState.toChainID == CHAIN_ID.starknet_test
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
                    :hidden="!toBalanceLoading"
                    style="left: 0.3rem; top: 0.2rem"
                    width="1.2rem"
                    height="1.2rem"
            />
            <span :hidden="toBalanceLoading">{{ toBalance }}</span>
          </div>
        </div>
        <div class="bottomItem">
          <div class="left" @click="changeToChain">
              <svg-icon
                  :iconName="showChainIcon(false)"
                  style="width: 24px; height: 24px; margin-right: 4px"
              ></svg-icon>
            <span>{{ showChainName(false) }}</span>
            <SvgIconThemed v-if="toChainIdList.length" />
          </div>
          <div style="display: flex; align-items: center;height: 30px" class="right">
            <div v-if="toTokenList.length" style="margin-left: 4px">
              <ObSelect v-if="isNewVersion"
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
      <div :hidden="(!isNewVersion || selectFromToken === selectToToken || !isSupportXVM) && !isLoopring && !(isBrowserApp && selectStarknet)">
        <div style="text-align: left;margin-top: 10px;padding-left: 20px;font-size: 16px;">
          <input v-if="!isBrowserApp" type="checkbox" style="margin-right: 5px" id="checkbox" :disabled="crossAddressInputDisable" v-model="isCrossAddress" />
          <label v-if="transferDataState.selectMakerConfig && transferDataState.selectMakerConfig.toChain" for="checkbox"> To {{ transferDataState.selectMakerConfig.toChain.name }} Address </label>
          <label v-else for="checkbox"> Recipient's Address </label>
        </div>
        <div class="cross-addr-box to-area" style="margin-top: 10px" v-if="isCrossAddress">
          <div data-v-59545920="" class="topItem">
            <div class="left"></div>
            <div v-if="isBrowserApp" @click="fillAddress">Autofill from wallet</div>
          </div>
          <input
                  @blur="updateSendBtnInfo"
                  type="text"
                  v-model="crossAddressReceipt"
                  :placeholder="`Recipient's ${chainName} Address`"
          />
        </div>
      </div>
      <CommBtn
              @click="sendTransfer"
              :disabled="sendBtnInfo ? sendBtnInfo.disabled : true"
              class="btn select-wallet-dialog"
              :style="`border-radius: 40px;${!isNewVersion || isCrossAddress ? '' : 'margin-top: 10px'}`"
      >
      <span class="w700 s16" style="letter-spacing: 0.15rem">
        {{ sendBtnInfo && sendBtnInfo.text }}
      </span>
      </CommBtn>
      <div class="info-box">
        <div v-if="isWillUpdate" class="info-item">
          <svg-icon class="info-icon" iconName="info-warn"></svg-icon>
          <span class="warn">
          Configuration is updated after two minutes, there is a possibility of not being able to get back the money, it is recommended to trade after two minutes.
          </span>
        </div>
        <div v-if="isCurrentAddress" class="info-item">
          <svg-icon class="info-icon" iconName="info-warn"></svg-icon>
          <span class="warn">
          This is your address.
        </span>
        </div>
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
                  :hidden="!saveGasLoading"
                  style="margin: 0 1rem"
                  width="1rem"
                  height="1rem"
          />
          <span :hidden="saveGasLoading" style="margin-left: 0.4rem"
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
          <CommLoading :hidden="!timeSpenLoading" width="1.2rem" height="1.2rem" />
          <span :hidden="timeSpenLoading">{{ timeSpent }}</span>
        </span>
          <span class="red">
          Save
          <CommLoading
                  :hidden="!saveTimeLoading"
                  style="margin: 0 1rem"
                  width="1rem"
                  height="1rem"
          />
          <span :hidden="saveTimeLoading" style="margin-left: 0.4rem">
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

      <CommTipDialog ref="TipPopupRef">
        <div slot="PoperContent" class="dialog">
          <div class="dialog-box">
            <div @click="closeTipPopup" class="icon">
              <i class="el-icon-close"></i>
            </div>
            <div class="title">
              Interested in starting your voyage here?
            </div>
            <div class="content">
              Go experience more transactions on Orbiter Finance mainnet.
              Have fun!
            </div>
            <div class="bottom">
            <span class="btn" @click="openUrl">
              Let's Go
            </span>
            </div>
          </div>
        </div>
      </CommTipDialog>
    </div>
    <div v-if="isEmpty">
      <img style="margin:25px" src="../../assets/data/empty.png" width="200" />
      <div>
        Sorry, we can't find the corresponding configuration for dealer.
      </div>
    </div>
  </div>
</template>

<script>
import {
  ObSelect,
  CommBtn,
  ObSelectChain,
  CommDialog,
  CommTipDialog,
  SvgIconThemed,
  HelpIcon
} from '../../components'
import util from '../../util/util'
import check from '../../util/check/check'
import transferCalculate from '../../util/transfer/transferCalculate'
import Middle from '../../util/middle/middle'
import orbiterCore from '../../orbiterCore'
import BigNumber from 'bignumber.js'
import config, { CHAIN_ID } from '../../config';
import { exchangeToCoin, exchangeToUsd, getRates } from '../../util/coinbase';
import { IMXHelper } from '../../util/immutablex/imx_helper'
import getNonce from '../../core/utils/nonce'

import {
  connectStarkNetWallet
} from '../../util/constants/starknet/helper';
import { asyncGetExchangeToUsdRate } from '../../util/coinbase'
import { RaiseUpSelect } from '../../components'
import {
  walletIsLogin,
  compatibleGlobalWalletConf,
} from '../../composition/walletsResponsiveData'
import walletDispatchers, { COINBASE, TOKEN_POCKET_APP } from '../../util/walletsDispatchers';
import { METAMASK, WALLETCONNECT } from '../../util/walletsDispatchers/index'
import {
  isMobile,
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
  updateTransferExt,
  curPageStatus,
  updateDealerId,
  setActAddPoint,
  setActAddPointVisible,
  updateActDataList,
  setActDialogVisible,
} from '../../composition/hooks';
import { isArgentApp, isBrowserApp, isDev } from "../../util";
import { RequestMethod, requestOpenApi, requestPointSystem } from "../../common/openApiAx";
import { getMdcRuleLatest, getV2TradingPair } from "../../common/thegraph";
import { walletConnectDispatcherOnInit } from "../../util/walletsDispatchers/pcBrowser/walletConnectPCBrowserDispatcher";
let makerConfigs = config.v1MakerConfigs;
let v1MakerConfigs = config.v1MakerConfigs;

const { walletDispatchersOnSwitchChain } = walletDispatchers

export default {
  name: 'Transfer',
  components: {
    ObSelect,
    CommBtn,
    ObSelectChain,
    SvgIconThemed,
    CommDialog,
    CommTipDialog,
    RaiseUpSelect,
    HelpIcon,
  },
  data() {
    return {
      makerAddress: '',

      isWhiteWallet: '',
      isNewVersion: false,
      isLoopring: false,
      isBrowserApp: false,
      isV3: false,
      isEmpty: false,
      isWillUpdate: false,

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

      boxLoading: false,

      // balanceMap: {},
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
      isShowExchangeIcon: true,

      toValueToolTip: 'Sender pays a 0.00% trading fee for each transfer.',

      exchangeToUsdPrice: 0,

      fromBalance: Number(0).toFixed(6),
      toBalance: Number(0).toFixed(6),

      makerMaxBalance: 0,
      userMaxPrice: 0,
      userMinPrice: 0,

      formWith: 0,

      cronList: [],
      banList: []
    };
  },
  computed: {
    selectStarknet() {
      return util.isStarkNet();
    },
    CHAIN_ID() {
      return CHAIN_ID;
    },
    isLightMode() {
      return this.$store.state.themeMode === 'light';
    },
    chainName() {
      return util.chainName(transferDataState.toChainID);
    },
    isCurrentAddress() {
      if (!this.isNewVersion || this.selectFromToken === this.selectToToken) {
        return false;
      }
      if (!this.isCrossAddress || !this.crossAddressReceipt || !util.isSupportXVMContract()) {
        return false;
      }
      if (transferDataState.toChainID === CHAIN_ID.starknet || transferDataState.toChainID === CHAIN_ID.starknet_test) {
        return false;
      }
      return !!util.equalsIgnoreCase(this.crossAddressReceipt, this.currentWalletAddress);
    },
    isErrorAddress() {
      if (!(isArgentApp() && util.isStarkNet()) && (!this.isNewVersion || this.selectFromToken === this.selectToToken)) {
        return false;
      }
      if (!(isArgentApp() && util.isStarkNet()) && (!this.isCrossAddress || !this.crossAddressReceipt || !util.isSupportXVMContract())) {
        return false;
      }
      if (transferDataState.toChainID === CHAIN_ID.starknet || transferDataState.toChainID === CHAIN_ID.starknet_test) {
        return false;
      }
      const reg = new RegExp(/^0x[a-fA-F0-9]{40}$/);
      const isCheck = !reg.test(this.crossAddressReceipt);
      if (isCheck) {
        this.sendBtnInfo.disabled = 'disabled';
      } else if(this.sendBtnInfo.disabled === 'disabled'){
        // this.updateTransferInfo()
      }
      return isCheck;
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
        util.log('walletIsLogin.value',walletIsLogin.value);
        if (!walletIsLogin.value) {
            this.isNewVersion = false;
            this.isWhiteWallet = false;
        } else {
            this.isWhiteWallet = !!util.isWhite();
        }
      return walletIsLogin.value;
    },
    currentWalletAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress;
    },
    curPageStatus(){
      return curPageStatus.value;
    },
    currentNetwork() {
      return compatibleGlobalWalletConf.value.walletPayload.networkId;
    },
    isStarknet() {
      return this.refererUpper === 'STARKNET';
    },
    crossAddressInputDisable() {
      const toChainID = transferDataState.toChainID;
      return toChainID === CHAIN_ID.starknet || toChainID === CHAIN_ID.starknet_test || toChainID === CHAIN_ID.dydx || toChainID === CHAIN_ID.dydx_test;
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
    queryParams() {
      const { query } = this.$route;
      const { referer } = query;
      let { token, tokens, amount, fixed } = query;
      amount = new BigNumber(amount);
      tokens = !tokens ? [] : tokens.split(',');
      // if (!makerConfigs || !makerConfigs.length) {
      //   return;
      // }

      let source = makerConfigs.find(item => item?.fromChain?.name.toLowerCase() === query?.source?.toLowerCase())?.fromChain?.chainId || 0;
      let dest = makerConfigs.find(item => item?.toChain?.name.toLowerCase() === query?.dest?.toLowerCase())?.toChain?.chainId || 0;
      const getMapChainIds = (chainNames, isDest) => {
        const chainIds = [];
        if (!chainNames) {
          return chainIds;
        }
        for (const chainName of chainNames.split(',')) {
          const chainId = isDest ?
                  makerConfigs.find(item => item.toChain.name === chainName)?.toChain?.chainId || 0 :
                  makerConfigs.find(item => item.fromChain.name === chainName)?.fromChain?.chainId || 0;
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
    timeSpenToolTip() {
      return `It takes about ${
              this.originTimeSpent
                      ? this.originTimeSpent.replace('~', '')
                      : this.originTimeSpent
      } moving funds using the native bridge, and it only takes about ${
              this.timeSpent ? this.timeSpent.replace('~', '') : this.timeSpent
      } using Orbiter.`;
    },
    timeSpent() {
      // const { selectMakerConfig } = transferDataState;
      // return selectMakerConfig?.spentTime ? `${selectMakerConfig.spentTime}s` : transferCalculate.transferSpentTime(
      //         transferDataState.fromChainID,
      //         transferDataState.toChainID
      // );
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
    curPageStatus(value) {
      if (Number(value) === 1) this.updateTransferInfo();
    },
    isWhiteWallet() {
      this.refreshConfig();
    },
    isNewVersion() {
      this.refreshConfig();
    },
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
      this.updateTransferInfo();
    },
    // currentNetwork(newValue, oldValue) {
    //   if (oldValue !== newValue) this.clearTransferValue();
    // },
    currentWalletAddress: function (newValue, oldValue) {
      util.log('Current wallet address', newValue);
      this.isNewVersion = false;
      this.isWhiteWallet = !!util.isWhite();
      if (oldValue !== newValue && newValue !== '0x') this.updateTransferInfo();

      this.getWalletAddressPoint(newValue);

      setTimeout(async () => {
        const dataList = await this.getWalletAddressActList(newValue);
        const actList = JSON.parse(localStorage.getItem(`act_list_${ compatibleGlobalWalletConf.value.walletPayload.walletAddress || '0x' }`) || '[]');
        for (const data of dataList) {
          if (!actList.find(item => item === `${ data.activity_id }_${ data.id }`)) {
            localStorage.setItem(`act_show_times_${ compatibleGlobalWalletConf.value.walletPayload.walletAddress || '0x' }`, '0');
          }
        }
        localStorage.setItem(`act_list_${ compatibleGlobalWalletConf.value.walletPayload.walletAddress || '0x' }`, JSON.stringify(dataList.map(item => `${ item.activity_id }_${ item.id }`)));
        let times = +(localStorage.getItem(`act_show_times_${ compatibleGlobalWalletConf.value.walletPayload.walletAddress || '0x' }`) || 0);
        if (times < 3) {
          setActDialogVisible(true);
          times++;
          localStorage.setItem(`act_show_times_${ compatibleGlobalWalletConf.value.walletPayload.walletAddress || '0x' }`, String(times));
        }
      }, 0);
    },
    'web3State.starkNet.starkNetAddress': function (newValue) {
      if (newValue) {
        if (isArgentApp()) {
          if ([CHAIN_ID.starknet, CHAIN_ID.starknet].includes(transferDataState.toChainID)) {
            this.crossAddressReceipt = newValue;
          }
        } else {
          this.crossAddressReceipt = newValue;
        }
        this.updateTransferInfo();
      }
    },
    transferValue: function (newValue) {
      transferDataState.transferValue !== newValue &&
      updateTransferValue(newValue);
    },
  },
  async mounted() {
    try {
      await this.syncV3Data(1);
    } catch (e) {
      console.error('syncV3Data error', e);
    }
    this.openApiFilter();
    this.updateTransferInfo();

     if (isDev() && !isMobile.value) {
       this.showTipPopup();
     }

    const updateETHPriceI = async () => {
      transferCalculate
              .getTokenConvertUsd('ETH')
              .then((response) => updateETHPrice(response))
              .catch((error) => console.warn('GetETHPriceError =', error));
    };

    updateETHPriceI();

    this.transferValue = this.queryParams.amount;
    updateIsCrossAddress(this.isCrossAddress);
    updateCrossAddressReceipt(this.crossAddressReceipt);

    this.rates = await getRates('ETH');
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
    async getWalletAddressPoint(address) {
      if (util.getAccountAddressError(address)) {
        return;
      }
      const pointRes = await requestPointSystem('user/points', {
        address
      });
      this.totalPoint = pointRes.data.points;
      const point = pointRes.data.points;
      if (point) {
        setActAddPoint(String(point));
        setActAddPointVisible(true);
        setTimeout(() => {
          setActAddPointVisible(false);
        }, 3000);
      }
    },
    async getWalletAddressActList(address) {
      if (util.getAccountAddressError(address)) {
        return;
      }
      const res = await requestPointSystem('activity/list', {
        address,
        pageSize: 10,
        page: 1
      });
      const list = res.data.list;
      const dataList = [];
      for (const data of list) {
        dataList.push(...data.taskList);
      }
      updateActDataList(dataList);
      return dataList;
    },
    async fillAddress() {
      if ([CHAIN_ID.starknet, CHAIN_ID.starknet_test].includes(transferDataState.fromChainID)) {
        const account = await walletConnectDispatcherOnInit(WALLETCONNECT);
        if (account?.address) {
          this.crossAddressReceipt = account.address;
        }
      } else if ([CHAIN_ID.starknet, CHAIN_ID.starknet_test].includes(transferDataState.toChainID)) {
        this.crossAddressReceipt = web3State.starkNet.starkNetAddress;
      }
    },
    async syncV3Data(first) {
      const dealerId = this.$route?.query?.dealerId;
      if (!dealerId) {
        makerConfigs = JSON.parse(JSON.stringify(await getV2TradingPair())).filter(item => item.fromChain.symbol === item.toChain.symbol);
        return;
      }
      updateDealerId(dealerId);
      if (first) this.sendBtnInfo.disabled = 'disabled';
      try {
        const self = this;
        const ruleCache = localStorage.getItem(`${ dealerId }_rule`);
        if (!ruleCache) {
          await self.getNetWorkRule(dealerId);
        } else {
          makerConfigs = JSON.parse(ruleCache);
          setTimeout(async () => {
            await self.getNetWorkRule(dealerId);
            self.isEmpty = !makerConfigs.length;
            self.isV3 = true;
          }, 0);
        }
        this.isEmpty = !makerConfigs.length;
        this.isV3 = true;
      } catch (e) {
        console.error(e);
        makerConfigs = v1MakerConfigs;
      }
    },
    async getNetWorkRule(dealerId) {
      const ruleRes = await getMdcRuleLatest(dealerId);
      if (!ruleRes?.ruleList || !ruleRes.ruleList.length) return [];
      const { ruleList, updateTime } = ruleRes;
      if (JSON.stringify(makerConfigs) !== JSON.stringify(ruleList)) {
        makerConfigs = ruleList;
        this.updateTransferInfo();
      }
      localStorage.setItem(`${ dealerId }_rule`, JSON.stringify(ruleList));

      const self = this;
      const lastUpdateDiff = Math.max(updateTime - new Date().valueOf() + 2000, 0);
      util.log(`update after ${ Math.floor(lastUpdateDiff / 1000) }s`);
      setTimeout(async () => {
        await self.syncV3Data();
      }, lastUpdateDiff);
      return ruleList;
    },
    async openApiFilter() {
      try {
        const banList = await requestOpenApi(RequestMethod.offline, []);
        if (Array.isArray(banList)) {
          this.banList = banList;
        }
      } catch (error) {
        console.error('openApiFilter error', error);
      }

      const self = this;
      const cron = setInterval(async () => {
        try {
          const banList = await requestOpenApi(RequestMethod.offline, []);
          if (Array.isArray(banList)) {
            self.banList = banList;
          }
        } catch (error) {
        }
      }, 30000);
      this.cronList.push(cron);
     
    },
      refreshGasFeeToolTip() {
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

          this.gasFeeToolTip =  gasFee + tradingFee + withholdingGasFee + total;
      },
      refreshOrbiterTradingFee() {
          const { selectMakerConfig } = transferDataState;
          if (!selectMakerConfig) return;
          const { fromChain } = selectMakerConfig;
          let tradingFee = new BigNumber(
              this.transferValue ? this.transferValue : 0
          )
              .multipliedBy(new BigNumber(selectMakerConfig.gasFee))
              .dividedBy(new BigNumber(1000));
          let digit = orbiterCore.getDigitByPrecision(fromChain.decimals);
          this.orbiterTradingFee =  tradingFee.decimalPlaces(digit, BigNumber.ROUND_UP);
      },
      refreshGasSavingMax() {
        let savingValue =
                (this.originGasCost - this.gasTradingTotal * this.exchangeToUsdPrice) || 0;
          if (savingValue < 0) {
              savingValue = 0;
          }
          let savingTokenName = '$';
          this.gasSavingMax =  savingTokenName + savingValue.toFixed(2).toString();
      },
      refreshGasSavingMin() {
          const gasCost = this.gasCost();
        let savingValue = (this.originGasCost -
                this.gasTradingTotal * this.exchangeToUsdPrice -
                gasCost) || 0;
          if (savingValue < 0) {
              savingValue = 0;
          }
          let savingTokenName = '$';
          this.gasSavingMin = savingTokenName + savingValue.toFixed(2).toString();
      },
      refreshGasTradingTotal() {
          const { selectMakerConfig } = transferDataState;
          if (!selectMakerConfig) return "0.000000";
          let gasFee = new BigNumber(selectMakerConfig.tradingFee);
          this.gasTradingTotal = gasFee.plus(this.orbiterTradingFee).toFixed(6);
      },
      refreshGas(){
          this.refreshOrbiterTradingFee();
          this.refreshGasTradingTotal();
          this.refreshGasSavingMin();
          this.refreshGasSavingMin();
          this.refreshGasSavingMax();
          this.refreshGasFeeToolTip();
      },
    async refreshConfig() {
      if (this.isV3) {
        return;
      }
      const allMakerConfigs = await getV2TradingPair();
      if (this.isNewVersion) {
        makerConfigs = JSON.parse(JSON.stringify(allMakerConfigs));
      } else {
        const dealerId = this.$route?.query?.dealerId;
        if (!dealerId) {
          makerConfigs = JSON.parse(JSON.stringify(allMakerConfigs)).filter(item => item.fromChain.symbol === item.toChain.symbol);
        }
      }
      this.updateTransferInfo();
    },
    async updateTransferInfo({ fromChainID, toChainID, fromCurrency, toCurrency } = transferDataState) {
      if (!this.isNewVersion) {
        toCurrency = fromCurrency;
      }
      this.sendBtnInfo.disabled = 'disabled';

      const isCrossAddress = transferDataState.isCrossAddress;
      const oldFromChainID = transferDataState.fromChainID;
      const oldToChainID = transferDataState.toChainID;
      const oldFromCurrency = transferDataState.fromCurrency;
      fromChainID = fromChainID || transferDataState.fromChainID;
      toChainID = toChainID || transferDataState.toChainID;
      fromCurrency = fromCurrency || transferDataState.fromCurrency;
      toCurrency = toCurrency || transferDataState.toCurrency;

      // change toChainId,and toChainId equal fromChainId
      if (oldToChainID !== toChainID && oldFromChainID === fromChainID && toChainID === fromChainID) {
        fromChainID = oldToChainID;
      }

      this.isLoopring = fromChainID === CHAIN_ID.loopring || fromChainID === CHAIN_ID.loopring_test;
      this.isBrowserApp = isBrowserApp();

      if (fromCurrency === toCurrency && !this.isLoopring && !this.isBrowserApp) {
        if (isCrossAddress && util.isExecuteXVMContract()) {
          this.$notify.warning({
            title: `Not supported yet Change Account.`,
            duration: 3000,
          });
        }
        this.isCrossAddress = false;
      }

      const { query } = this.$route;
      const source = makerConfigs.find(item => item?.fromChain?.name.toLowerCase() === query?.source?.toLowerCase())?.fromChain?.chainId || 0;
      const dest = makerConfigs.find(item => item?.toChain?.name.toLowerCase() === query?.dest?.toLowerCase())?.toChain?.chainId || 0;
      fromCurrency = fromCurrency || query.token;
      const fromChainIdList = Array.from(new Set(
              makerConfigs.map(item => item.fromChain.chainId)
      )).sort(function (a, b) {
        return a - b;
      });
      fromChainID = fromChainID || (source && fromChainIdList.find(item => String(item) === String(source)) ?
              source :
              fromChainIdList[0]);
      let toChainIdList = Array.from(new Set(
              makerConfigs
                      .map(item => {
                        if (item.fromChain.chainId === fromChainID) {
                          return item.toChain.chainId;
                        }
                      })
                      .filter(item => item)
      )).sort(function (a, b) {
        return a - b;
      });

      toChainID = toChainID || (dest && toChainIdList.find(item => item === dest) ?
              dest :
              toChainIdList[0]);
      if (toChainIdList.indexOf(toChainID) === -1) {
        toChainID = toChainIdList.indexOf(dest) > -1 ?
                dest :
                toChainIdList[0];
      }

      // Reverse path
      if (makerConfigs.find(item => item.toChain.chainId === fromChainID) && makerConfigs.find(item => item.fromChain.chainId === toChainID)) {
        toChainIdList.push(fromChainID);
        toChainIdList = toChainIdList.sort(function (a, b) {
          return a - b;
        });
      }

      // const duplicateFromChainIdIndex = fromChainIdList.findIndex(item => item === toChainID);
      // if (duplicateFromChainIdIndex !== -1) {
      //   fromChainIdList.splice(duplicateFromChainIdIndex, 1);
      // }
      const selectedFromChainIdIndex = fromChainIdList.findIndex(item => item === fromChainID);
      if (selectedFromChainIdIndex !== -1) {
        fromChainIdList.splice(selectedFromChainIdIndex, 1);
      }
      // const duplicateToChainIdIndex = toChainIdList.findIndex(item => item === fromChainID);
      // if (duplicateToChainIdIndex !== -1) {
      //   toChainIdList.splice(duplicateToChainIdIndex, 1);
      // }
      const selectedToChainIdIndex = toChainIdList.findIndex(item => item === toChainID);
      if (selectedToChainIdIndex !== -1) {
        toChainIdList.splice(selectedToChainIdIndex, 1);
      }

      let makerConfigList = makerConfigs.filter(item => item.fromChain.chainId === fromChainID && item.toChain.chainId === toChainID);

      let fromTokenList = [];
      const toTokenList = [];
      makerConfigList.forEach(item => {
        if (!fromTokenList.find(it => it.token === item.fromChain.symbol)) {
            if (item.fromChain.symbol) {
                fromTokenList.push({
                    icon: item.fromChain.symbol,
                    token: item.fromChain.symbol,
                    amount: 0,
                });
            }
        }
        if (fromCurrency === item.fromChain.symbol && !toTokenList.find(it => it.token === item.toChain.symbol)) {
            if (item.toChain.symbol) {
                toTokenList.push({
                    icon: item.toChain.symbol,
                    token: item.toChain.symbol,
                    amount: 0,
                });
            }
        }
      });
      if (fromTokenList.length) {
        fromTokenList = fromTokenList.sort(function (a, b) {
          return a.token !== 'ETH';
        });
      }
      if (fromTokenList.length && !fromTokenList.find((item) => item.token === fromCurrency)) {
        fromCurrency = fromTokenList[0].token;
        if (oldFromChainID !== fromChainID) this.selectFromToken = fromTokenList[0].token;
      }

      makerConfigList.forEach(item => {
        if (fromCurrency === item.fromChain.symbol && !toTokenList.find(it => it.token === item.toChain.symbol)) {
          toTokenList.push({
            icon: item.toChain.symbol,
            token: item.toChain.symbol,
            amount: 0,
          });
        }
      });

      if (toTokenList.length && !toTokenList.find((item) => item.token === toCurrency)) {
        toCurrency = toTokenList[0].token;
        if (oldToChainID !== toChainID) this.selectToToken = toTokenList[0].token;
      }

      if (fromCurrency !== this.selectFromToken) {
        this.selectFromToken = fromCurrency;
      }
      if (toCurrency !== this.selectToToken) {
        this.selectToToken = toCurrency;
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

      this.isShowExchangeIcon = !!makerConfigs.find(item =>
              item.fromChain.chainId === toChainID &&
              item.fromChain.symbol === toCurrency &&
              item.toChain.chainId === fromChainID &&
              item.toChain.symbol === fromCurrency);

      const makerConfig = makerConfigs.find(item =>
              item.fromChain.chainId === fromChainID &&
              item.toChain.chainId === toChainID &&
              item.fromChain.symbol === fromCurrency &&
              item.toChain.symbol === toCurrency
      );
      if (!makerConfig) {
        console.error(`can't find makerConfig`, fromChainID, toChainID, fromCurrency, toCurrency);
        return;
      }
      const makerConfigInfo = JSON.parse(JSON.stringify(makerConfig));
      if (fromCurrency === toCurrency && isCrossAddress && makerConfigInfo.crossAddress?.recipient) {
        makerConfigInfo.recipient = makerConfigInfo.crossAddress?.recipient;
        makerConfigInfo.sender = makerConfigInfo.crossAddress?.sender;
        makerConfigInfo.tradingFee = makerConfigInfo.crossAddress?.tradingFee;
        makerConfigInfo.gasFee = makerConfigInfo.crossAddress?.gasFee;
      }
      this.makerAddress = makerConfigInfo.recipient;
      this.userMinPrice = makerConfigInfo.fromChain.minPrice || 0;
      this.userMaxPrice = makerConfigInfo.fromChain.maxPrice || 0;
      updateTransferMakerConfig(makerConfigInfo);
      if (makerConfig.ebcId && makerConfig.nextUpdateTime) {
        this.isWillUpdate = makerConfig.nextUpdateTime - new Date().valueOf() < 1000 * 60 * 2;
      } else {
        this.isWillUpdate = false;
      }
      this.toValueToolTip = `Sender pays a ${ parseFloat(((makerConfigInfo.gasFee || 0) / 10).toFixed(3)) }% trading fee for each transfer.`;
      this.specialProcessing(oldFromChainID, oldToChainID);
      if (fromChainID !== oldFromChainID || toChainID !== oldToChainID) {
        this.updateOriginGasCost();
      }
      if (fromChainID !== oldFromChainID) {
        let self = this;
        this.gasCostLoading = true;
        transferCalculate
                .transferSpentGas(fromChainID, this.$env.gasPriceMap, this.$env.gasLimitMap)
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
      await this.refreshUserBalance();
      this.updateRoutes(oldFromChainID, oldToChainID, oldFromCurrency);
      await this.updateSendBtnInfo();
    },
    async updateSendBtnInfo() {
      const { selectMakerConfig, fromCurrency, toCurrency } = transferDataState;
      if (!selectMakerConfig) return;
      const { fromChain } = selectMakerConfig;
      await this.getMakerMaxBalance();
      this.updateToValue();
      // if (util.isStarkNet()) {
      //     this.isCrossAddress = true;
      // }
      const availableDigit = fromChain.decimals === 18 ? 6 : 2;
      let opBalance = 10 ** -availableDigit;
      let useBalance = this.fromBalance === "-1" ? new BigNumber(100) : new BigNumber(this.fromBalance)
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
      if (walletIsLogin.value) {
        info.text = 'SEND';
        if (transferValue.comparedTo(0) < 0) {
          info.disabled = 'disabled';
          util.log('transferValue < 0', transferValue.toString());
        } else if (transferValue.comparedTo(this.userMaxPrice) > 0) {
          info.disabled = 'disabled';
          util.log('transferValue > userMaxPrice', transferValue.toString(), this.userMaxPrice.toString());
        }
        if (transferValue.comparedTo(userMax) > 0) {
          info.text = 'INSUFFICIENT FUNDS';
          info.disabled = 'disabled';
          util.log('transferValue > userMax', transferValue.toString(), userMax.toString());
        } else if (transferValue.comparedTo(makerMax) > 0) {
          info.text = 'INSUFFICIENT LIQUIDITY';
          info.disabled = 'disabled';
          util.log('transferValue > makerMax', transferValue.toString(), makerMax.toString());
        } else if (transferValue.comparedTo(makerMin) < 0) {
          info.text = 'INSUFFICIENT FUNDS';
          info.disabled = 'disabled';
          util.log('transferValue < makerMin', transferValue.toString(), makerMin.toString());
        } else if (transferValue.comparedTo(0) > 0 && this.toValue <= 0) {
          info.text = 'INSUFFICIENT FUNDS';
          info.disabled = 'disabled';
          util.log('transferValue > 0 && toValue <= 0', transferValue.toString(), this.toValue.toString());
        } else if (this.toValue > 0 && this.toValue.comparedTo(new BigNumber(this.makerMaxBalance)) > 0) {
          info.text = 'INSUFFICIENT LIQUIDITY';
          info.disabled = 'disabled';
          util.log('toValue > 0 && toValue > makerMaxBalance', this.toValue.toString(), new BigNumber(this.makerMaxBalance).toString());
        }

        if (this.isShowUnreachMinInfo || this.isShowMax) {
          info.text = 'SEND';
          info.disabled = 'disabled';
          util.log('isShowUnreachMinInfo || isShowMax', this.isShowUnreachMinInfo, this.isShowMax);
        }

        if ((fromCurrency !== toCurrency || this.isCrossAddress) &&
                !util.isSupportXVMContract() && !this.isLoopring && !util.isStarkNet()) {
          info.text = 'SEND';
          info.disabled = 'disabled';
          util.log('(fromCurrency !== toCurrency || this.isCrossAddress) && !isSupportXVMContract && !this.isLoopring && !util.isStarkNet',
                  fromCurrency !== toCurrency, this.isCrossAddress, !util.isSupportXVMContract(), !this.isLoopring, !util.isStarkNet());
        }

        if (util.isSupportXVMContract() && this.isCrossAddress && (!this.crossAddressReceipt || this.isErrorAddress)) {
          info.text = 'SEND';
          info.disabled = 'disabled';
          util.log('isSupportXVM && isCrossAddress && (!crossAddressReceipt || isErrorAddress)',
                  this.crossAddressReceipt, this.isErrorAddress);
        }
        const reg = new RegExp(/^0x[a-fA-F0-9]{40}$/);
        const isCheck = !reg.test(this.crossAddressReceipt);
        if (this.isLoopring  && this.isCrossAddress && (!this.crossAddressReceipt || isCheck)) {
          info.text = 'SEND';
          info.disabled = 'disabled';
          util.log('this.isLoopring && !this.crossAddressReceipt',
                  this.isLoopring, !this.crossAddressReceipt);
        }
      }
      this.sendBtnInfo = info;
    },
    updateRoutes(oldFromChainID, oldToChainID, oldFromCurrency) {
      const { fromChainID, toChainID, fromCurrency, selectMakerConfig } = transferDataState;
      const { path, query } = this.$route;
      const changeQuery = {};
      if (fromChainID !== oldFromChainID && query?.source !== selectMakerConfig.fromChain.name) {
        changeQuery.source = selectMakerConfig.fromChain.name;
      }
      if (toChainID !== oldToChainID && query?.dest !== selectMakerConfig.toChain.name) {
        changeQuery.dest = selectMakerConfig.toChain.name;
      }
      if(fromCurrency !== oldFromCurrency && query?.token !== selectMakerConfig.fromChain.symbol) {
        changeQuery.token = selectMakerConfig.fromChain.symbol;
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
      if (!this.transferValue || !selectMakerConfig) {
        this.toValue = 0;
        return;
      }
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
          util.log('get rate fail', fromCurrency, fromRate, toCurrency, toRate);
          return 0;
        }
        const value = (amount.dividedBy(fromRate).multipliedBy(toRate)).toFixed(6);
        this.toValue = new BigNumber(value).multipliedBy(1 - slippage / 10000);
      } else {
        this.toValue = amount;
      }
    },
    async specialProcessing(oldFromChainID, oldToChainID) {
      const { fromChainID, toChainID } = transferDataState;
      if (toChainID !== oldToChainID && oldToChainID === CHAIN_ID.starknet || oldToChainID === CHAIN_ID.starknet_test || oldToChainID === CHAIN_ID.dydx || oldToChainID === CHAIN_ID.dydx_test) {
        if (this.isCrossAddress) this.isCrossAddress = false;
        if (this.crossAddressReceipt) this.crossAddressReceipt = '';
      }
      if (fromChainID === CHAIN_ID.starknet || fromChainID === CHAIN_ID.starknet_test || toChainID === CHAIN_ID.starknet || toChainID === CHAIN_ID.starknet_test) {
        const { starkNetIsConnect, starkNetAddress } = web3State.starkNet;
        if (!starkNetIsConnect || !starkNetAddress) {
          await connectStarkNetWallet();
          if (!web3State.starkNet.starkIsConnected && !web3State.starkNet.starkNetAddress) {
            const makerConfig = makerConfigs[0];
            this.updateTransferInfo({ fromChainID: makerConfig.fromChain.chainId });
            return;
          }
        }
        if (toChainID === CHAIN_ID.starknet || toChainID === CHAIN_ID.starknet_test) {
          this.isCrossAddress = true;
          this.crossAddressReceipt = web3State.starkNet.starkNetAddress;
          updateTransferExt({
            fromAddress: this.currentWalletAddress,
            ext: {
              type: '0x03',
              value: web3State.starkNet.starkNetAddress,
            }
          });
        }
      }
      if (fromChainID === CHAIN_ID.loopring || fromChainID === CHAIN_ID.loopring_test || toChainID === CHAIN_ID.loopring || toChainID === CHAIN_ID.loopring_test) {
        if (walletIsLogin.value) {
          this.inputTransferValue();
        }
      }
      if (oldFromChainID !== fromChainID &&
        (fromChainID === CHAIN_ID.loopring || fromChainID === CHAIN_ID.loopring_test) ||
        (isBrowserApp() && (fromChainID === CHAIN_ID.starknet || fromChainID === CHAIN_ID.starknet_test))) {
        this.isCrossAddress = true;
      }
      if (toChainID !== oldToChainID && (toChainID === CHAIN_ID.dydx || toChainID === CHAIN_ID.dydx_test)) {
        if (!this.isCrossAddress) this.isCrossAddress = true;
        const self = this;
        if (self.crossAddressReceipt !== compatibleGlobalWalletConf.value.walletPayload.walletAddress){
          setTimeout(() => {
            self.crossAddressReceipt = compatibleGlobalWalletConf.value.walletPayload.walletAddress;
          }, 500);
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
              fromChain.chainId,
              selectMakerConfig.recipient,
              fromChain.tokenAddress
      )) || 0;
      let avalibleDigit = orbiterCore.getDigitByPrecision(fromChain.decimals);
      let opBalance = 10 ** -avalibleDigit;
      let preGasDigit = 3;
      let preGas = 0;
      if ([CHAIN_ID.zksync, CHAIN_ID.zksync_test, CHAIN_ID.mainnet, CHAIN_ID.goerli, CHAIN_ID.ar, CHAIN_ID.op, CHAIN_ID.nova].find(item => String(item) === String(fromChain.chainId))) {
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
              fromChain.chainId === CHAIN_ID.loopring ||
              fromChain.chainId === CHAIN_ID.loopring_test ||
              toChain.chainId === CHAIN_ID.loopring ||
              toChain.chainId === CHAIN_ID.loopring_test) &&
              fromChain.decimals === 18
      ) {
        max = max.decimalPlaces(5, BigNumber.ROUND_DOWN);
      }
      this.userMaxPrice = max.toString();
    },
    // addBalance(chainId, symbol, value, address) {
    //   const walletAddress = address || compatibleGlobalWalletConf.value.walletPayload.walletAddress;
    //   const addressBalanceMap = this.balanceMap[walletAddress] = this.balanceMap[walletAddress] || {};
    //   const chainBalanceMap = addressBalanceMap[chainId] = addressBalanceMap[chainId] || {};
    //   chainBalanceMap[symbol] = value || Number(0).toFixed(6);
    //   this.balanceMap = JSON.parse(JSON.stringify(this.balanceMap));
    // },
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
      return transferDataState[`${ isFrom ? 'from' : 'to' }ChainID`] || 1;
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
      util.log('userMaxPrice',this.userMaxPrice)
      this.transferValue = this.userMaxPrice;
      this.updateTransferInfo()
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
      if (!this.fromChainIdList.length) {
        return;
      }
      this.showFromChainPopupClick();
    },
    changeToChain() {
      if (!this.toChainIdList.length) {
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
    closeFromChainPopupClick(data) {
      try {
        const address = compatibleGlobalWalletConf.value.walletPayload.walletAddress;
        this.$gtag.event('SwitchChain', {
          'event_category': 'SwitchFromChain',
          'event_label': address.toLocaleLowerCase(),
          'chainId':this.transferDataState.fromChainID
        })
      }catch(error) {

      }
     
      this.$refs.SelectFromChainPopupRef.maskClick();
    },
    // open selectChain
    showToChainPopupClick() {
      this.$refs.SelectToChainPopupRef.showCustom();
    },
    // close selectChain
    closeToChainPopupClick() {
      try {
        const address = compatibleGlobalWalletConf.value.walletPayload.walletAddress;
        this.$gtag.event('SwitchChain', {
          'event_category': 'SwitchToChain',
          'event_label': address.toLocaleLowerCase(),
          'chainId':this.transferDataState.toChainID
        })
      }catch(error){

      }
      
      this.$refs.SelectToChainPopupRef.maskClick();
    },
    showTipPopup() {
      this.$refs.TipPopupRef.showCustom();
    },
    closeTipPopup() {
      this.$refs.TipPopupRef.maskClick();
    },
    openUrl() {
      window.open('https://www.orbiter.finance/', '_blank');
    },
    inputTransferValue() {
      const { selectMakerConfig } = transferDataState;
      if (!selectMakerConfig) return;
      const { fromChain, toChain } = selectMakerConfig;
      if (fromChain.chainId === CHAIN_ID.loopring || fromChain.chainId === CHAIN_ID.loopring_test || toChain.chainId === CHAIN_ID.loopring || toChain.chainId === CHAIN_ID.loopring_test) {
        this.transferValue = fromChain.decimals === 18
                ? this.transferValue.replace(/^\D*(\d*(?:\.\d{0,5})?).*$/g, '$1')
                : this.transferValue.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1');
      } else {
        this.transferValue = fromChain.decimals === 18
                ? this.transferValue.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g, '$1')
                : this.transferValue.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1');
      }

      this.refreshGas();

      this.updateSendBtnInfo();
    },
    async sendTransfer() {
      // if (check.checkIsBitKeep()) {
      //   this.$notify.error({
      //     title: `Bitkeep is not supported and please try another wallet.`,
      //     duration: 3000,
      //   });
      //   return;
      // }
      const { fromChainID, toChainID, fromCurrency, toCurrency, selectMakerConfig } = transferDataState;

      const isNotWallet = !isArgentApp() ? isBrowserApp() : (isArgentApp() && ![CHAIN_ID.starknet, CHAIN_ID.starknet_test].includes(fromChainID));
      if (isNotWallet && (!compatibleGlobalWalletConf?.value?.walletPayload?.walletAddress || String(compatibleGlobalWalletConf.value.walletPayload.walletAddress) === '0x')) {
        await walletConnectDispatcherOnInit(WALLETCONNECT);
        return;
      }
      if (this.sendBtnInfo && this.sendBtnInfo.disabled === 'disabled') {
        util.log('sendBtnInfo disabled');
        return;
      }
      // if (selectMakerConfig.ebcId) {
      //   try {
      //     const receiveValue = await transferCalculate.calEBCValue();
      //     util.log('ebc receive value', +receiveValue, 'toValue', +this.toValue);
      //     transferDataState.ebcValue = new BigNumber(receiveValue).dividedBy(10 ** selectMakerConfig.toChain.decimals).toString();
      //   } catch (e) {
      //     console.error(e);
      //     this.$notify.error({
      //       title: `EBC validation failure`,
      //       duration: 3000,
      //     });
      //     return;
      //   }
      // }
      if (!await util.isLegalAddress()) {
        this.$notify.error({
          title: `Contract address is not supported, please use EVM address.`,
          duration: 3000,
        });
        return;
      }
      try {
        if (this.banList) {
          for (const ban of this.banList) {
            if (ban.source && ban.dest) {
              if (util.getInternalIdByChainId(fromChainID) === ban.source && util.getInternalIdByChainId(toChainID) === ban.dest) {
                if (ban.sourceToken && ban.sourceToken === fromCurrency) {
                  if (ban.destToken && ban.destToken === toCurrency) {
                    this.$notify.error({
                      title: `The ${ selectMakerConfig.fromChain.name }-${ selectMakerConfig.toChain.name } network ${ fromCurrency } transaction maintenance, please try again later`,
                      duration: 3000,
                    });
                    return;
                  }
                  if (!ban.destToken) {
                    this.$notify.error({
                      title: `The ${ selectMakerConfig.fromChain.name }-${ selectMakerConfig.toChain.name } network ${ toCurrency } transaction maintenance, please try again later`,
                      duration: 3000,
                    });
                    return;
                  }
                }

                if (!ban.sourceToken) {
                  this.$notify.error({
                    title: `The ${ selectMakerConfig.fromChain.name }-${ selectMakerConfig.toChain.name } network transaction maintenance, please try again later`,
                    duration: 3000,
                  });
                  return;
                }
              }
              continue;
            }
            if (ban.source) {
              if (util.getInternalIdByChainId(fromChainID) === ban.source) {
                if (ban.sourceToken && ban.sourceToken === fromCurrency) {
                  this.$notify.error({
                    title: `The ${ selectMakerConfig.fromChain.name } network ${ fromCurrency } transaction maintenance, please try again later`,
                    duration: 3000,
                  });
                  return
                }
                if (!ban.sourceToken) {
                  this.$notify.error({
                    title: `The ${ selectMakerConfig.fromChain.name } network transaction maintenance, please try again later`,
                    duration: 3000,
                  });
                  return;
                }
              }
              continue;
            }
            if (ban.dest) {
              if (util.getInternalIdByChainId(toChainID) === ban.dest) {
                if (ban.destToken && ban.destToken === toCurrency) {
                  this.$notify.error({
                    title: `The ${ selectMakerConfig.toChain.name } network ${ toCurrency } transaction maintenance, please try again later`,
                    duration: 3000,
                  });
                  return;
                }
                if (!ban.destToken) {
                  this.$notify.error({
                    title: `The ${ selectMakerConfig.toChain.name } network transaction maintenance, please try again later`,
                    duration: 3000,
                  });
                  return;
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
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
        if (!selectMakerConfig) return;
        const { fromChain } = selectMakerConfig;
        let nonce = await getNonce.getNonce(
                fromChain.chainId,
                fromChain.tokenAddress,
                fromChain.symbol,
                compatibleGlobalWalletConf.value.walletPayload.walletAddress
        );
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
        }

        // Ensure immutablex's registered
        if (toChainID === CHAIN_ID.dydx || toChainID === CHAIN_ID.dydx_test) {
          const imxHelper = new IMXHelper(toChainID);
          const walletAddress =
                  compatibleGlobalWalletConf.value.walletPayload.walletAddress;
          walletAddress && (await imxHelper.ensureUser(walletAddress));
        }

        if (fromChainID === CHAIN_ID.starknet || fromChainID === CHAIN_ID.starknet_test || toChainID === CHAIN_ID.starknet || toChainID === CHAIN_ID.starknet_test) {
          let { starkChain } = web3State.starkNet;
          starkChain = +starkChain ? +starkChain : starkChain;
          if (!starkChain || starkChain === 'unlogin') {
            util.showMessage('please connect Starknet Wallet', 'error');
            return;
          }
          // if (!getStarknet().selectedAddress) {
          //   await connectStarkNetWallet();
          //   util.log(`can't find starknet selectedAddress,reconnect starknet wallet ${ getStarknet().selectedAddress }`);
          // }
          if ((fromChainID === CHAIN_ID.starknet || toChainID === CHAIN_ID.starknet) && (starkChain === CHAIN_ID.starknet_test || starkChain === 'localhost')) {
            util.showMessage(
                    'please switch Starknet Wallet to mainnet',
                    'error'
            );
            return;
          }
          if ((fromChainID === CHAIN_ID.starknet_test || toChainID === CHAIN_ID.starknet_test) && (starkChain === CHAIN_ID.starknet || starkChain === 'localhost')) {
            util.showMessage(
                    'please switch Starknet Wallet to testNet',
                    'error'
            );
            return;
          }
        } else {
          if (+compatibleGlobalWalletConf.value.walletPayload.networkId !== +util.getMetaMaskNetworkId(fromChainID)) {
            if ([METAMASK, COINBASE, WALLETCONNECT, TOKEN_POCKET_APP].includes(compatibleGlobalWalletConf.value.walletType)) {
              try {
                if (!await util.ensureWalletNetwork(fromChainID)) {
                  return;
                }
              } catch (err) {
                console.error(err);
                util.showMessage(err.message, 'error');
                return;
              }
            } else {
              const matchSwitchChainDispatcher = walletDispatchersOnSwitchChain[compatibleGlobalWalletConf.value.walletType];
              if (matchSwitchChainDispatcher) {
                const successCallback = () => this.$emit('stateChanged', '2');
                matchSwitchChainDispatcher(
                        compatibleGlobalWalletConf.value.walletPayload.provider,
                        () => {
                          this.$emit('stateChanged', '2')
                        }
                );
                return;
              }
            }
          }
        }
        const chainInfo = util.getV3ChainInfoByChainId(fromChainID);
        const toAddressAll = (util.isExecuteXVMContract() ?
                chainInfo.xvmList[0] :
                selectMakerConfig.recipient).toLowerCase();
        const senderAddress = (util.isExecuteXVMContract() ?
                chainInfo.xvmList[0] :
                selectMakerConfig.sender).toLowerCase();
        const toAddress = util.shortAddress(toAddressAll);
        const senderShortAddress = util.shortAddress(senderAddress);
        const { isCrossAddress, crossAddressReceipt } = transferDataState;
        const walletAddress = ((isCrossAddress || toChainID === CHAIN_ID.starknet || toChainID === CHAIN_ID.starknet_test) ? crossAddressReceipt : compatibleGlobalWalletConf.value.walletPayload.walletAddress).toLowerCase();
        // sendTransfer
        this.$store.commit('updateConfirmRouteDescInfo', [
          {
            no: 1,
            from: new BigNumber(this.transferValue).plus(
                    new BigNumber(selectMakerConfig.tradingFee)
            ).toFixed(4) + fromCurrency,
            to: toAddress,
            fromTip: '',
            toTip: toAddressAll,
            icon: util.isExecuteXVMContract() ? 'contract' : 'wallet'
          },
          {
            no: 2,
            from: senderShortAddress,
            to: util.shortAddress(walletAddress),
            fromTip: senderAddress,
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
        this.refreshGas();
      } catch (error) {
        console.error('updateOriginGasCost error =', error);
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
      if (toChain.chainId === CHAIN_ID.dydx || toChain.chainId === CHAIN_ID.dydx_test) {
        this.makerMaxBalance = Number.MAX_SAFE_INTEGER;
        return;
      }

      const _balance = await this.getBalance(
              toChain.chainId,
              toChain.tokenAddress,
              toChain.symbol,
              toChain.decimals
      );
      if (_balance > 0) {
        // Max use maker balance's 95%, because it transfer need gasfee(also zksync need changePubKey fee)
        this.makerMaxBalance = (new BigNumber(_balance).multipliedBy(0.95)).toString();
      }
    },
    gasCost() {
      const { fromChainID, selectMakerConfig } = transferDataState;
      if (
              fromChainID === CHAIN_ID.zksync ||
              fromChainID === CHAIN_ID.zksync_test ||
              fromChainID === CHAIN_ID.loopring ||
              fromChainID === CHAIN_ID.loopring_test
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
    async refreshUserBalance() {
      this.fromBalanceLoading = true;
      this.toBalanceLoading = true;
      const self = this;
      const { fromChainID, toChainID, selectMakerConfig } = transferDataState;
      if (!selectMakerConfig) return;
      const { fromChain, toChain } = selectMakerConfig;
      let address = compatibleGlobalWalletConf.value.walletPayload.walletAddress;
      if (fromChainID === CHAIN_ID.starknet || fromChainID === CHAIN_ID.starknet_test) {
        address = web3State.starkNet.starkNetAddress;
      }
      if (address && address !== '0x') {
          await transferCalculate.getTransferBalance(fromChain.chainId, fromChain.tokenAddress, fromChain.symbol, address)
                  .then(async (response) => {
                    const balance = (response / 10 ** fromChain.decimals).toFixed(6);
                    self.fromBalance = balance;
                    await self.updateUserMaxPrice();
                  })
                  .catch((error) => {
                    self.fromBalance = "-1"
                    console.warn(error);
                  }).finally(() => {
                  self.fromBalanceLoading = false;
          });
          // await self.updateUserMaxPrice();
        // } else {
        //   self.fromBalance = fromChainBalanceMap[fromChain.symbol];
        //   await self.updateUserMaxPrice();
        // }
          self.fromBalanceLoading = false;
      } else {
        self.fromBalanceLoading = false;
      }

      address = compatibleGlobalWalletConf.value.walletPayload.walletAddress;
      if (toChainID === CHAIN_ID.starknet || toChainID === CHAIN_ID.starknet_test) {
        address = web3State.starkNet.starkNetAddress;
      }
      if (address && address !== '0x') {
          await transferCalculate.getTransferBalance(toChain.chainId, toChain.tokenAddress, toChain.symbol, address)
                  .then((response) => {
                    const balance = (response / 10 ** toChain.decimals).toFixed(6);
                    self.toBalance = balance;
                  })
                  .catch((error) => {
                    console.warn(error);
                  }).finally(() => {
                  self.toBalanceLoading = false;
          });
        // } else {
        //   self.toBalance = toChainBalanceMap[toChain.symbol];
        // }
          self.toBalanceLoading = false;
      } else {
        self.toBalanceLoading = false;
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
  .symbol {
    position: absolute;
    left: 80px;
  }
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
  .warn {
    color: #E2989A;
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

.dialog {
  width: 450px;

  .dialog-box {
    position: relative;
    background-color: #ffffff;
    color: #161616;
    border-radius: 40px;
    width: 450px;
    padding: 10px;
    font-family: 'Inter Regular';
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);

    .icon {
      position: absolute;
      right: 20px;
      top: 10px;
      cursor: pointer;
    }

    .title {
      margin-bottom: 10px;
      font-weight: 700;
      font-size: 17px;
    }

    .content {
      margin-bottom: 10px;
      font-weight: lighter;
      font-size: 15px;
    }

    .bottom {
      height: 30px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      .btn {
        width: 350px;
        text-align: center;
        font-weight: 700;
        font-size: 16px;
        border-radius: 30px;
        cursor: pointer;
        color: #FFFFFF;

        height: 40px;
        display: inline-block;
        line-height: 40px;
        background: linear-gradient(90.46deg, #eb382d 4.07%, #bc3035 98.55%);
      }
    }
  }
}

.dark-theme {
  .dialog {
    width: 100%;

    .dialog-box {
      position: relative;
      background-color: #3f415b;
      color: #FFFFFF;
      border-radius: 40px;
      width: 100%;
      padding: 10px;
      font-family: 'Inter Regular';
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);

      .icon {
        position: absolute;
        right: 20px;
        top: 10px;
        cursor: pointer;
      }

      .title {
        margin-bottom: 10px;
        font-weight: 700;
        font-size: 17px;
      }

      .content {
        margin-bottom: 10px;
        font-weight: lighter;
        font-size: 15px;
      }

      .bottom {
        height: 30px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        .btn {
          display: inline-block;
          width: 350px;
          text-align: center;
          font-weight: 700;
          font-size: 16px;
          line-height: 30px;
          height: 30px;
          border-radius: 30px;
          cursor: pointer;
          background: linear-gradient(to right, #D93E28, #A6453E);
          color: #FFFFFF;
        }
      }
    }
  }
}
</style>
