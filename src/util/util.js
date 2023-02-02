import { Notification } from 'element-ui'
import { compatibleGlobalWalletConf } from "../composition/walletsResponsiveData"
import { transferDataState } from "../composition/useTransferData";
import { exchangeToCoin } from "./coinbase";
import BigNumber from "bignumber.js";
import testnet from '../config/testnet.json'
import mainnet from '../config/mainnet.json'

export default {
  showMessage(message, type) {
    const _type = type || 'success'
    Notification[_type]({
      message: message,
      dangerouslyUseHTMLString: true,
      duration: 3000,
    })
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
      if (this.equalsIgnoreCase(chainInfo.nativeCurrency.address, tokenAddress)) {
        return true;
      }
      // ERC20
      if (chainInfo.tokens.find(item => this.equalsIgnoreCase(item.address, tokenAddress))) {
        return false;
      }
    }
    return /^0x0+$/i.test(tokenAddress);
  },

  /**
   * @param {number} ms Sleep millisecond
   * @returns
   */
  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null)
      }, ms)
    })
  },

  getChainInfoByChainId(chainId) {
    let configChainList = [...mainnet, ...testnet];
    const info = configChainList.find(item => +item.internalId === +chainId);
    if (!info) return null;
    const chainInfo = JSON.parse(JSON.stringify(info));
    const localWsRpc = process.env[`VUE_APP_WP_${ chainId }`];
    if (localWsRpc) {
      chainInfo.rpc = chainInfo.rpc || [];
      chainInfo.rpc.unshift(localWsRpc);
    }
    const localHttpRpc = process.env[`VUE_APP_HP_${ chainId }`];
    if (localHttpRpc) {
      chainInfo.rpc = chainInfo.rpc || [];
      chainInfo.rpc.unshift(localHttpRpc);
    }
    return chainInfo;
  },

  isSupportXVMContract() {
    const { fromChainID } = transferDataState;
    const chainInfo = this.getChainInfoByChainId(fromChainID);
    return chainInfo?.xvmList && chainInfo.xvmList.length;
  },

  isExecuteXVMContract() {
    const { fromCurrency, toCurrency, isCrossAddress } = transferDataState;
    return !!(this.isSupportXVMContract() && (fromCurrency !== toCurrency || isCrossAddress));
  },

  async getXVMExpectValue(value) {
    const { selectMakerConfig } = transferDataState;
    const {fromChain,toChain} = selectMakerConfig;
    const fromCurrency = fromChain.symbol;
    const toCurrency = toChain.symbol;
    const fromPrecision = fromChain.decimals;
    let expectValue = (new BigNumber(value)).multipliedBy(10 ** fromPrecision);
    if (fromCurrency !== toCurrency) {
      const toPrecision = toChain.decimals;
      expectValue = (new BigNumber(value)).multipliedBy(10 ** toPrecision);
      expectValue = await exchangeToCoin(expectValue, fromCurrency, toCurrency);
    }
    return expectValue.toFixed(0);
  },

  /**
   * @param {number} chainId
   */
  async ensureWalletNetwork(chainId) {
    const chain = this.getChainInfoByChainId(chainId)
    const switchParams = {
      chainId: this.toHex(chain.chainId),
    }
    try {
      await compatibleGlobalWalletConf.value.walletPayload.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [switchParams],
      })
    } catch (error) {
      if (error.code === 4902) {
        // need add net
        const params = {
          chainId: this.toHex(chain.chainId), // A 0x-prefixed hexadecimal string
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
        await compatibleGlobalWalletConf.value.walletPayload.provider.request({
          method: 'wallet_addEthereumChain',
          params: [params],
        })
      } else {
        throw error
      }
    }
  },
}