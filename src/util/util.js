import { Notification } from 'element-ui'
import env from '../../env'
import chainList from '../config/chains.json'
import { compatibleGlobalWalletConf } from "../composition/walletsResponsiveData"
import { xvmList } from "../core/actions/thegraph";
import { transferDataState } from "../composition/useTransferData";
import { exchangeToCoin } from "./coinbase";
import BigNumber from "bignumber.js";

export default {
  showMessage(message, type) {
    // Message({
    //   showClose: true,
    //   duration: 2000,
    //   message: message,
    //   type: type,
    // })
    const _type = type || 'success'
    Notification[_type]({
      title: message,
      duration: 2000,
    })
  },
  getChainInfo(netChainID) {
    var chain = chainList.chainList.filter(
      (chain) => chain.chainId.toString() === netChainID.toString()
    )
    if (chain.length > 0) {
      return chain[0]
    }
    return undefined
  },
  chainName(localChainID, netChainID) {
    // zksync、starknet
    switch (Number(localChainID)) {
      case 3:
        return 'zkSync'
      case 33:
        return 'zkSync(G)'
      case 4:
        return 'StarkNet'
      case 44:
        return 'StarkNet(R)'
      case 8:
        return 'Immutable X'
      case 88:
        return 'Immutable X(R)'
      case 9:
        return 'Loopring'
      case 99:
        return 'Loopring(G)'
      case 10:
        return 'Metis'
      case 510:
        return 'Metis(R)'
      case 11:
        return 'dYdX'
      case 511:
        return 'dYdX(R)'
      case 12:
        return 'ZKSpace'
      case 512:
        return 'ZKSpace(R)'
      case 13:
        return 'Boba'
      case 513:
        return 'Boba(R)'
      case 14:
        return 'zkSync2'
      case 514:
        return 'zkSync2(G)'
      case 15:
        return "BNB Chain"
      case 515:
        return "BNB Chain(R)"
      case 16:
        return "Arbitrum Nova"
      case 516:
        return "Arbitrum Nova(Goerli)"
      case 17:
        return "Polygon ZKEVM"
      case 517:
        return "Polygon ZKEVM(Goerli)"
    }
    const chain = chainList.chainList.filter(
      (_chain) => _chain.chainId == netChainID
    )
    if (chain.length > 0) {
      return chain[0].name
    } else {
      return 'unknown'
    }
  },
  chainShortName(localChainID, netChainID) {
    if (
      localChainID !== '' &&
      localChainID &&
      localChainID.toString() === '3'
    ) {
      return 'zkSync'
    }
    if (
      localChainID !== '' &&
      localChainID &&
      localChainID.toString() === '33'
    ) {
      return 'zkSync(G)'
    }
    var chain = chainList.chainList.filter(
      (chain) => chain.chainId.toString() === netChainID
    )
    if (chain.length > 0) {
      return chain[0].shortName
    } else {
      return 'unknown'
    }
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
  shortChainName(address) {
    if (address && address.length > 5) {
      var subStr1 = address.substr(0, 2)
      var subStr2 = address.substr(address.length - 2, 2)
      return subStr1 + '...' + subStr2
    }
    return ''
  },

  /**
   * @param {string} value1
   * @param {string} value2
   * @returns {boolean}
   */
  equalsIgnoreCase(value1, value2) {
    if (typeof value1 !== 'string' || typeof value2 !== 'string') {
      return false
    }

    if (value1 == value2) {
      return true
    }
    if (value1.toUpperCase() == value2.toUpperCase()) {
      return true
    }

    return false
  },

  /**
   * @param {string} tokenAddress when tokenAddress=/^0x0+$/i,
   * @returns {boolean}
   */
  isEthTokenAddress(tokenAddress) {
    return /^0x0+$/i.test(tokenAddress)
  },

  isBNBTokenAddress(chainId) {
    return chainId == 97 || chainId == 56;
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

  /**
   * @param {number} chainId
   * @returns
   */
  isSupportEVM(chainId) {
    return [1, 2, 6, 7, 5, 22, 66, 77].indexOf(Number(chainId)) > -1
  },

  isSupportXVMContract() {
    const { fromCurrency, toCurrency } = transferDataState;
    const chainInfo = this.getXVMContractToChainInfo();
    return !!(chainInfo?.toChain && chainInfo.target.symbol === fromCurrency && chainInfo.toChain.symbol === toCurrency);
  },

  isExecuteXVMContract() {
    const { fromCurrency, toCurrency, isCrossAddress } = transferDataState;
    return !!(this.isSupportXVMContract() && (fromCurrency !== toCurrency || isCrossAddress));
  },

  getXVMContractToChainInfo() {
    const { fromChainID, toChainID, fromCurrency, toCurrency } = transferDataState;
    const xvm = xvmList.find(item => item.chainId === fromChainID);
    const target = xvm?.target;
    if (!target) return null;
    const targetData = target.find(item => item.symbol === fromCurrency);
    const toChains = targetData?.toChains;
    if (!toChains) return null;
    targetData.chainId = xvm.chainId;
    const toChain = toChains.find(item => item.chainId === toChainID && item.symbol === toCurrency);
    return { target: targetData, toChain };
  },

  async getXVMExpectValue(value) {
    const chainInfo = this.getXVMContractToChainInfo();
    if (!chainInfo) return '0';
    const fromCurrency = chainInfo.target.symbol;
    const toCurrency = chainInfo.toChain.symbol;
    let expectValue = (new BigNumber(value)).toString();
    if (fromCurrency !== toCurrency) {
      const toPrecision = chainInfo.toChain.precision;
      expectValue = (new BigNumber(expectValue)).multipliedBy(10 ** toPrecision);
      expectValue = (await exchangeToCoin(expectValue, fromCurrency, toCurrency)).toString();
    }
    return expectValue;
  },

  /**
   * @param {number} chainId
   */
  async ensureWalletNetwork(chainId) {
    const chain = this.getChainInfo(env.localChainID_netChainID[chainId])
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