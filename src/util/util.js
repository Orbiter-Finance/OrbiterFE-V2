import { Notification } from 'element-ui'
import { compatibleGlobalWalletConf } from '../composition/walletsResponsiveData'
import { transferDataState } from '../composition/useTransferData'
import { exchangeToCoin } from './coinbase'
import BigNumber from 'bignumber.js'
import config from '../config/index'
import Web3 from 'web3'
import { Coin_ABI } from './constants/contract/contract.js'
import { isProd } from './env'
import env from '../../env'
import { validateAndParseAddress } from "starknet";

export default {
  getAccountAddressError(address, isStarknet) {
    if (isStarknet) {
      try {
        validateAndParseAddress(this.starknetHashFormat(address));
        return null;
      } catch (e) {
        return e.message;
      }
    } else {
      if ((new RegExp(/^0x[a-fA-F0-9]{40}$/)).test(address)) {
        return null;
      } else {
        return "Invalid evm address";
      }
    }
  },

  starknetHashFormat(txHash) {
    if (txHash.length < 66) {
      const end = txHash.substring(2, txHash.length);
      const add = 64 - end.length;
      let addStr = '';
      for (let i = 0; i < add; i++) {
        addStr += "0";
      }
      txHash = '0x' + addStr + end;
    }
    return txHash;
  },

  showMessage(message, type) {
    const _type = type || 'success'
    Notification[_type]({
      message,
      dangerouslyUseHTMLString: true,
      duration: 3000,
    })
  },
  netWorkName(networkId) {
    return this.getChainInfoByNetworkId(networkId)?.name || 'unknown'
  },
  chainName(chainId) {
    return this.getChainInfoByChainId(chainId)?.name || 'unknown'
  },
  chainNetWorkId(chainId) {
    return this.getChainInfoByChainId(chainId)?.chainId
  },
  getMetaMaskNetworkId(chainId) {
    return env.metaMaskNetworkId[chainId]
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
    return value1.toUpperCase() === value2.toUpperCase()
  },

  /**
   * @param {string} tokenAddress when tokenAddress=/^0x0+$/i,
   * @returns {boolean}
   */
  isEthTokenAddress(chainId, tokenAddress) {
    const chainInfo = this.getChainInfoByChainId(chainId)
    if (chainInfo) {
      // main coin
      if (
        this.equalsIgnoreCase(chainInfo.nativeCurrency?.address, tokenAddress)
      ) {
        return true
      }
      // ERC20
      if (
        chainInfo.tokens.find((item) =>
          this.equalsIgnoreCase(item.address, tokenAddress)
        )
      ) {
        return false
      }
    }
    return /^0x0+$/i.test(tokenAddress)
  },

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null)
      }, ms)
    })
  },

  formatDate(date, isShort) {
    date = new Date(date);
    const year = date.getFullYear();
    const mon = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    const data = date.getDate() < 10 ? "0" + (date.getDate()) : date.getDate();
    const hour = date.getHours() < 10 ? "0" + (date.getHours()) : date.getHours();
    const min = date.getMinutes() < 10 ? "0" + (date.getMinutes()) : date.getMinutes();
    const seon = date.getSeconds() < 10 ? "0" + (date.getSeconds()) : date.getSeconds();

    if (isShort) return mon + "-" + data + " " + hour + ":" + min;
    const toYear = new Date().getFullYear();
    if(toYear === year){
      return mon + "-" + data + " " + hour + ":" + min + ":" + seon;
    }else{
      return year + "-" + mon + "-" + data + " " + hour + ":" + min;
    }
  },

  setCache(key, data, sec) {
    localStorage.setItem(key, JSON.stringify({ data, expireTime: new Date().valueOf() + sec }));
  },

  getCache(key) {
    const storage = localStorage.getItem(key);
    if (!storage) return null;
    const { data, expireTime } = JSON.parse(storage);
    // this.log("expireTime", new Date(expireTime), `left ${ ((expireTime - new Date().valueOf()) / 1000).toFixed(0) }s`);
    if (new Date().valueOf() > expireTime) {
      return null;
    }
    return data;
  },

  async isLegalAddress() {
    const { fromChainID } = transferDataState;
    const supportContractWallet = [1, 2, 6, 7, 10, 13, 14, 15, 16, 17];
    if (!supportContractWallet.find(item => item === Number(fromChainID))) {
      return true;
    }
    const rpc = this.stableRpc(fromChainID);
    if (rpc) {
      const web3 = new Web3(rpc);
      const walletAddress = compatibleGlobalWalletConf.value.walletPayload.walletAddress;
      const code = await web3.eth.getCode(walletAddress);
      if (code && code !== "0x") {
        return false;
      }
    }
    return true;
  },

  stableWeb3(chainId) {
    return new Web3(this.stableRpc(chainId))
  },

  stableRpc(chainId) {
    const rpcList = this.getRpcList(chainId)
    if (rpcList.length) {
      return rpcList[0]
    }
    console.error(`${chainId} Unable to find stable rpc node`)
    return null
  },

  setStableRpc(chainId, rpc, msg) {
    this.log(chainId, rpc, msg || '', 'success')
    localStorage.setItem(`${ chainId }_stable_rpc`, JSON.stringify({ rpc, expireTime: new Date().valueOf() + 60 * 1000 }));
  },

  getRpcList(chainId) {
    const chainInfo = this.getChainInfoByChainId(chainId)
    const rpcList = (chainInfo?.rpc || []).sort(function () {
      return 0.5 - Math.random()
    })
    const storageRpc = localStorage.getItem(`${ chainId }_stable_rpc`);
    try {
      const stableRpc = JSON.parse(storageRpc);
      if (stableRpc.rpc && stableRpc.expireTime > new Date().valueOf()) {
        return [stableRpc.rpc, ...rpcList];
      }
    } catch (e) {
    }
    return rpcList
  },

  // the actual transfer amount
  getRealTransferValue() {
    const { selectMakerConfig, transferValue } = transferDataState
    return new BigNumber(transferValue)
      .plus(new BigNumber(selectMakerConfig.tradingFee))
      .multipliedBy(new BigNumber(10 ** selectMakerConfig.fromChain.decimals))
      .toFixed()
  },

  // Get expected received amount
  async getExpectValue() {
    const { selectMakerConfig, transferValue, fromCurrency, toCurrency } =
      transferDataState
    const value = new BigNumber(transferValue)

    const gasFee = value
      .multipliedBy(new BigNumber(selectMakerConfig.gasFee))
      .dividedBy(new BigNumber(1000))
    const gasFee_fix = gasFee.decimalPlaces(
      selectMakerConfig.fromChain.decimals === 18 ? 5 : 2,
      BigNumber.ROUND_UP
    )

    const toAmount = value.minus(gasFee_fix)
    const expectValue = toAmount.multipliedBy(
      10 ** selectMakerConfig.toChain.decimals
    )

    if (fromCurrency !== toCurrency) {
      return (
        await exchangeToCoin(expectValue, fromCurrency, toCurrency)
      ).toFixed(0)
    } else {
      return expectValue.toFixed(0)
    }
  },

  getChainInfoByChainId(chainId) {
    const info = config.chainConfig.find(
      (item) => +item.internalId === +chainId
    )
    if (!info) return null
    const chainInfo = JSON.parse(JSON.stringify(info))
    const localWsRpc = process.env[`VUE_APP_WP_${chainId}`]
    if (localWsRpc) {
      chainInfo.rpc = chainInfo.rpc || []
      chainInfo.rpc.push(localWsRpc)
    }
    const localHttpRpc = process.env[`VUE_APP_HP_${chainId}`]
    if (localHttpRpc) {
      chainInfo.rpc = chainInfo.rpc || []
      chainInfo.rpc.push(localHttpRpc)
    }
    return chainInfo
  },

  getChainInfoByNetworkId(networkId) {
    const info = config.chainConfig.find(
      (item) => +item.networkId === +networkId
    )
    if (!info) return null
    return JSON.parse(JSON.stringify(info))
  },

  log(...msg) {
    if (isProd()) {
      return
    }
    console.log(...msg)
  },

  isWhite() {
    // if(isProd() && !config?.whiteList.length){
    //   return false;
    // }
    return !(
      config.whiteList.length &&
      !config.whiteList.find((item) =>
        this.equalsIgnoreCase(
          item,
          compatibleGlobalWalletConf.value.walletPayload.walletAddress
        )
      )
    )
  },

  isStarkNet() {
    const { fromChainID, toChainID } = transferDataState
    return (
      fromChainID === 4 ||
      fromChainID === 44 ||
      toChainID === 4 ||
      toChainID === 44
    )
  },

  isSupportXVMContract() {
    const { fromChainID } = transferDataState
    if (!this.isWhite()) {
      return false
    }
    if (this.isStarkNet()) {
      return false
    }
    const chainInfo = this.getChainInfoByChainId(fromChainID)
    return chainInfo?.xvmList && chainInfo.xvmList.length
  },

  isExecuteXVMContract() {
    const { fromCurrency, toCurrency, isCrossAddress } = transferDataState
    return !!(
      this.isSupportXVMContract() &&
      (fromCurrency !== toCurrency || isCrossAddress)
    )
  },

  /**
   * @param {number} chainId
   */
  async ensureWalletNetwork(chainId) {
    const maskNetworkId = this.getMetaMaskNetworkId(chainId)
    if (!maskNetworkId) {
      return
    }
    const switchParams = {
      chainId: this.toHex(maskNetworkId),
    }
    try {
      await compatibleGlobalWalletConf.value.walletPayload.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [switchParams],
      })
      return true
    } catch (error) {
      if (error.code === 4902) {
        await this.addEthereumChain(chainId)
      } else {
        console.error(error)
        this.showMessage(error.message, 'error')
      }
      return false
    }
  },

  async addEthereumChain(chainId) {
    const chainInfo = this.getChainInfoByChainId(chainId)
    const maskNetworkId = this.getMetaMaskNetworkId(chainId)
    const params = {
      chainId: this.toHex(maskNetworkId), // A 0x-prefixed hexadecimal string
      chainName: chainInfo.name,
      nativeCurrency: {
        name: chainInfo.nativeCurrency.name,
        symbol: chainInfo.nativeCurrency.symbol, // 2-6 characters long
        decimals: chainInfo.nativeCurrency.decimals,
      },
      rpcUrls: chainInfo.rpc,
      blockExplorerUrls: [env.networkUrl[chainId]],
    }
    try {
      await compatibleGlobalWalletConf.value.walletPayload.provider.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      })
    } catch (error) {
      console.error(error)
      this.showMessage(error.message, 'error')
    }
  },
  requestWeb3(chainId, method, ...args) {
    const rpcList = this.getRpcList(chainId)
    return new Promise(async (resolve, reject) => {
      let result
      if (rpcList && rpcList.length > 0) {
        for (const url of rpcList) {
          if (!url || url === '') {
            continue
          }
          try {
            const web3 = new Web3(url)
            result = await web3.eth[method](...args)
            this.setStableRpc(chainId, url, 'success')
            resolve(result)
            break
          } catch (error) {
            this.setStableRpc(chainId, '', 'error')
            this.log(
              'request rpc error:',
              url,
              error.message,
              chainId,
              method,
              args
            )
          }
        }
      }
      if (!result) {
        reject(`Reuqest Web3 RPC ERROR：${chainId}-${method}-${args.join(',')}`)
      }
    })
  },
  getWeb3TokenBalance(chainId, userAddress, tokenAddress) {
    const rpcList = this.getRpcList(chainId)
    return new Promise(async (resolve, reject) => {
      let result
      if (rpcList && rpcList.length > 0) {
        for (const url of rpcList) {
          try {
            const web3 = new Web3(url)
            // result = await web3.eth[method](...args)
            const tokenContract = new web3.eth.Contract(Coin_ABI, tokenAddress)
            if (!tokenContract) {
              console.warn('getLocalCoinContract_ecourseContractInstance')
              continue
            }
            const result = await tokenContract.methods
              .balanceOf(userAddress)
              .call()
            this.setStableRpc(chainId, url, 'success')
            resolve(result)
            break
          } catch (error) {
            this.log(
              'Request Web3 token Balance rpc error:',
              url,
              error.message,
              chainId
            )
          }
        }
      }

      if (!result) {
        reject(`Request Web3 TokenBalance RPC error${chainId}`)
      }
    })
  },
}
