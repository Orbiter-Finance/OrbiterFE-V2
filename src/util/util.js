import { Notification } from 'element-ui'
import { compatibleGlobalWalletConf } from "../composition/walletsResponsiveData"
import { transferDataState } from "../composition/useTransferData";
import { exchangeToCoin } from "./coinbase";
import BigNumber from "bignumber.js";
import config from '../config/index'
import Web3 from "web3";

export default {
  showMessage(message, type) {
    const _type = type || 'success'
    Notification[_type]({
      message: message,
      dangerouslyUseHTMLString: true,
      duration: 3000,
    })
  },
  netWorkName(networkId) {
    return this.getChainInfoByNetworkId(networkId)?.name || 'unknown';
  },
  chainName(chainId) {
    return this.getChainInfoByChainId(chainId)?.name || 'unknown';
  },
  chainNetWorkId(chainId) {
    return this.getChainInfoByChainId(chainId)?.chainId;
  },
  toHex(num) {
    return '0x' + Number(num).toString(16)
  },
  transferTimeStampToTime(timestamp) {
    if (!timestamp) {
      return timestamp
    }
    if (timestamp.toString().length === 10) {
      timestamp = Number(timestamp) * 1000
    }
    var date = new Date(timestamp)
    var Y = date.getFullYear() + '-'
    var M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-'
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    var h =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var m =
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ':'
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    var result = Y + M + D + h + m + s
    return result
  },
  shortAddress(address) {
    if (address && address.length > 5) {
      var subStr1 = address.substr(0, 4)
      var subStr2 = address.substr(address.length - 4, 4)
      return subStr1 + '...' + subStr2
    }
    return ''
  },
  equalsIgnoreCase(value1, value2) {
    if (typeof value1 !== 'string' || typeof value2 !== 'string') {
      return false
    }
    return value1.toUpperCase() === value2.toUpperCase();
  },

  /**
   * @param {string} tokenAddress when tokenAddress=/^0x0+$/i,
   * @returns {boolean}
   */
  isEthTokenAddress(chainId, tokenAddress) {
    const chainInfo = this.getChainInfoByChainId(chainId);
    if (chainInfo) {
      // main coin
      if (this.equalsIgnoreCase(chainInfo.nativeCurrency?.address, tokenAddress)) {
        return true;
      }
      // ERC20
      if (chainInfo.tokens.find(item => this.equalsIgnoreCase(item.address, tokenAddress))) {
        return false;
      }
    }
    return /^0x0+$/i.test(tokenAddress);
  },

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null)
      }, ms)
    })
  },

  stableWeb3(chainId) {
    return new Web3(this.stableRpc(chainId));
  },

  stableRpc(chainId) {
    const rpcList = this.getRpcList(chainId);
    if (rpcList.length) {
      return rpcList[0];
    }
    console.error(`${ chainId } Unable to find stable rpc node`);
    return null;
  },

  setStableRpc(chainId, rpc, msg) {
    console.log(chainId, rpc, msg || '', 'success');
    localStorage.setItem(`${ chainId }_stable_rpc`, rpc);
  },

  getRpcList(chainId) {
    const chainInfo = this.getChainInfoByChainId(chainId);
    const rpcList = (chainInfo?.rpc || []).sort(function () {
      return 0.5 - Math.random();
    });
    const stableRpc = localStorage.getItem(`${ chainId }_stable_rpc`);
    if (stableRpc) {
      return [stableRpc, ...rpcList];
    }
    return rpcList;
  },

  // the actual transfer amount
  getRealTransferValue() {
    const { selectMakerConfig, transferValue } = transferDataState;
    return new BigNumber(transferValue)
        .plus(new BigNumber(selectMakerConfig.tradingFee))
        .multipliedBy(new BigNumber(10 ** selectMakerConfig.fromChain.decimals))
        .toFixed();
  },

  // Get expected received amount
  async getExpectValue() {
    const { selectMakerConfig, transferValue, fromCurrency, toCurrency } = transferDataState;
    const value = new BigNumber(transferValue);

    const gasFee = value
        .multipliedBy(new BigNumber(selectMakerConfig.gasFee))
        .dividedBy(new BigNumber(1000));
    const gasFee_fix = gasFee.decimalPlaces(
        selectMakerConfig.fromChain.decimals === 18 ? 5 : 2,
        BigNumber.ROUND_UP);

    const toAmount = value.minus(gasFee_fix);
    const expectValue = toAmount.multipliedBy(10 ** selectMakerConfig.toChain.decimals);

    if (fromCurrency !== toCurrency) {
      return (await exchangeToCoin(expectValue, fromCurrency, toCurrency)).toFixed(0);
    } else {
      return expectValue.toFixed(0);
    }
  },

  getChainInfoByChainId(chainId) {
    const info = config.chainConfig.find(item => +item.internalId === +chainId);
    if (!info) return null;
    const chainInfo = JSON.parse(JSON.stringify(info));
    const localWsRpc = process.env[`VUE_APP_WP_${ chainId }`];
    if (localWsRpc) {
      chainInfo.rpc = chainInfo.rpc || [];
      chainInfo.rpc.push(localWsRpc);
    }
    const localHttpRpc = process.env[`VUE_APP_HP_${ chainId }`];
    if (localHttpRpc) {
      chainInfo.rpc = chainInfo.rpc || [];
      chainInfo.rpc.push(localHttpRpc);
    }
    return chainInfo;
  },

  getChainInfoByNetworkId(networkId) {
    const info = config.chainConfig.find(item => +item.networkId === +networkId);
    if (!info) return null;
    return JSON.parse(JSON.stringify(info));
  },

  isWhite() {
    return !(config.whiteList.length && !config.whiteList.find(item => this.equalsIgnoreCase(item, compatibleGlobalWalletConf.value.walletPayload.walletAddress)));
  },

  isSupportXVMContract() {
    const { fromChainID } = transferDataState;
    if (!this.isWhite()) {
      return false;
    }
    const chainInfo = this.getChainInfoByChainId(fromChainID);
    return chainInfo?.xvmList && chainInfo.xvmList.length;
  },

  isExecuteXVMContract() {
    const { fromCurrency, toCurrency, isCrossAddress } = transferDataState;
    return !!(this.isSupportXVMContract() && (fromCurrency !== toCurrency || isCrossAddress));
  },

  /**
   * @param {number} chainId
   */
  async ensureWalletNetwork(chainId) {
    const chain = this.getChainInfoByChainId(chainId);
    if (!+chain.networkId) {
      return;
    }
    const switchParams = {
      chainId: this.toHex(chain.networkId),
    };
    try {
      await compatibleGlobalWalletConf.value.walletPayload.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [switchParams],
      });
    } catch (error) {
      if (error.code === 4902) {
        await this.addEthereumChain(chainId);
      } else {
        console.error(error);
        this.showMessage(error.message, 'error');
      }
    }
  },

  async addEthereumChain(chainId) {
    const chainInfo = this.getChainInfoByChainId(chainId);
    const params = {
      chainId: this.toHex(chainInfo.networkId), // A 0x-prefixed hexadecimal string
      chainName: chainInfo.name,
      nativeCurrency: {
        name: chainInfo.nativeCurrency.name,
        symbol: chainInfo.nativeCurrency.symbol, // 2-6 characters long
        decimals: chainInfo.nativeCurrency.decimals,
      },
      rpcUrls: chainInfo.rpc,
      blockExplorerUrls: [
        chainInfo.explorers &&
        chainInfo.explorers.length &&
        chainInfo.explorers[0].url
            ? chainInfo.explorers[0].url
            : chainInfo.infoURL,
      ],
    };
    try {
      await compatibleGlobalWalletConf.value.walletPayload.provider.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      });
    } catch (error) {
      console.error(error);
      this.showMessage(error.message, 'error');
    }
  },
}