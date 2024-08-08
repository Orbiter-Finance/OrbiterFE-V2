import { Notification } from 'element-ui'
import { compatibleGlobalWalletConf } from '../composition/walletsResponsiveData'
import { transferDataState } from '../composition/useTransferData'
import { exchangeToCoin } from './coinbase'
import BigNumber from 'bignumber.js'
import config, { CHAIN_ID } from '../config/index'
import Web3 from 'web3'
import { Coin_ABI } from './constants/contract/contract.js'
import { isProd } from './env'
import env from '../../env'
import { validateAndParseAddress } from 'starknet'
import { shuffle, uniq } from 'lodash'
import { RequestMethod, requestOpenApi } from '../common/openApiAx'
import solanaHelper from './solana/solana_helper.js'
let chainsList = []

export default {
  async getSolanaBalance(chainId, address, tokenAddress) {
    try {
      const chainInfo = this.getV3ChainInfoByChainId(chainId)
      const nativeCurrency = chainInfo?.nativeCurrency?.address
      const connection = solanaHelper.getConnection(chainId)

      let balanceString = ''

      if (nativeCurrency === tokenAddress) {
        const balance = await connection.getBalance(
          solanaHelper.getPublicKey(address)
        )
        balanceString = String(balance || '0')
      } else {
        const fromTokenAcount = await solanaHelper.getTokenAccount({
          connection,
          fromPublicKey: solanaHelper.getPublicKey(address),
          tokenPublickey: solanaHelper.getPublicKey(tokenAddress),
          toPublickey: solanaHelper.getPublicKey(address),
          chainId,
        })
        const balance = await connection.getTokenAccountBalance(
          fromTokenAcount.address
        )
        const amount = balance?.value?.amount
        balanceString = String(amount || '0')
      }
      return balanceString
    } catch (error) {
      return '0'
    }
  },

  async getTonBalance(chainId, address, tokenAddress) {
    const res = await requestOpenApi(RequestMethod.getBalance, [
      chainId,
      address,
      tokenAddress,
    ])

    return res || '0'
  },

  getAccountAddressError(address, isStarknet) {
    if (isStarknet) {
      try {
        validateAndParseAddress(this.starknetHashFormat(address))
        return null
      } catch (e) {
        return e.message
      }
    } else {
      if (new RegExp(/^0x[a-fA-F0-9]{40}$/).test(address)) {
        return null
      } else {
        return 'Invalid evm address'
      }
    }
  },

  starknetHashFormat(txHash) {
    if (txHash.length < 66) {
      const end = txHash.substring(2, txHash.length)
      const add = 64 - end.length
      let addStr = ''
      for (let i = 0; i < add; i++) {
        addStr += '0'
      }
      txHash = '0x' + addStr + end
    }
    return txHash
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
    return (
      this.getV3ChainInfoByChainId(networkId)?.name ||
      networkId ||
      'Unknown Network'
    )
  },
  chainName(chainId) {
    return this.getV3ChainInfoByChainId(chainId)?.name || chainId || ''
  },
  chainNetWorkId(chainId) {
    return this.getV3ChainInfoByChainId(chainId)?.chainId
  },
  getMetaMaskNetworkId(chainId) {
    return env.metaMaskNetworkId[chainId] || chainId
  },
  getTxExploreUrl(chainId) {
    const chainInfo = this.getV3ChainInfoByChainId(chainId)
    return env.txExploreUrl[chainId] || `${chainInfo?.infoURL}/tx/`
  },
  getAccountExploreUrl(chainId) {
    const chainInfo = this.getV3ChainInfoByChainId(chainId)
    return env.accountExploreUrl[chainId] || `${chainInfo?.infoURL}/address/`
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
  shortAddress(address, dec) {
    const i = dec || 4
    if (address && address.length > 5) {
      var subStr1 = address.substr(0, i)
      var subStr2 = address.substr(address.length - i, i)
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

  isEthTokenAddress(chainId, tokenAddress) {
    const chainInfo = this.getV3ChainInfoByChainId(chainId)
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

  async getAsyncWalletAddress(retryCount = 6) {
    if (
      !compatibleGlobalWalletConf.value.walletPayload.walletAddress ||
      compatibleGlobalWalletConf.value.walletPayload.walletAddress === '0x'
    ) {
      if (retryCount === 0) {
        return (
          compatibleGlobalWalletConf.value.walletPayload.walletAddress || '0x'
        )
      }
      await this.sleep(500)
      return await this.getAsyncWalletAddress(retryCount - 1)
    }
    return compatibleGlobalWalletConf.value.walletPayload.walletAddress
  },

  formatDate(date, isShort) {
    date = new Date(date)
    const year = date.getFullYear()
    const mon =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    const data = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const min =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const seon =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

    if (isShort) return mon + '-' + data + ' ' + hour + ':' + min
    const toYear = new Date().getFullYear()
    if (toYear === year) {
      return mon + '-' + data + ' ' + hour + ':' + min + ':' + seon
    } else {
      return year + '-' + mon + '-' + data + ' ' + hour + ':' + min
    }
  },

  setCache(key, data, sec) {
    localStorage.setItem(
      key,
      JSON.stringify({ data, expireTime: new Date().valueOf() + sec })
    )
  },

  getCache(key) {
    const storage = localStorage.getItem(key)
    if (!storage) return null
    const { data, expireTime } = JSON.parse(storage)
    // this.log("expireTime", new Date(expireTime), `left ${ ((expireTime - new Date().valueOf()) / 1000).toFixed(0) }s`);
    if (new Date().valueOf() > expireTime) {
      return null
    }
    return data
  },

  async isLegalAddress() {
    const { fromChainID } = transferDataState
    const supportContractWallet = [
      CHAIN_ID.mainnet,
      CHAIN_ID.ar,
      CHAIN_ID.po,
      CHAIN_ID.op,
      CHAIN_ID.metis,
      CHAIN_ID.boba,
      CHAIN_ID.zksync2,
      CHAIN_ID.bsc,
      CHAIN_ID.nova,
      CHAIN_ID.pozkevm,
      CHAIN_ID.base,
      CHAIN_ID.linea,
      CHAIN_ID.zora,
    ]
    if (!supportContractWallet.find((item) => item === fromChainID)) {
      return true
    }

    const res = await this.requestWeb3(
      fromChainID,
      'getCode',
      compatibleGlobalWalletConf.value.walletPayload.walletAddress
    )

    if (res && res !== '0x') {
      return false
    }

    // const rpc = await this.stableRpc(fromChainID)

    // if (rpc) {
    //   const web3 = new Web3(rpc)
    //   const walletAddress =
    //     compatibleGlobalWalletConf.value.walletPayload.walletAddress
    //   const code = await web3.eth.getCode(walletAddress)
    //   if (code && code !== '0x') {
    //     return false
    //   }
    // }
    return true
  },

  async stableWeb3(chainId) {
    return new Web3(await this.stableRpc(String(chainId)))
  },

  async stableRpc(chainId) {
    const rpcList = await this.getRpcList(chainId)
    const res = await Promise.any(
      rpcList.map((item) => {
        return new Promise(async (resolve) => {
          const web3 = new Web3(item)
          const res = await web3.eth.getBlockNumber()
          resolve(item)
        })
      })
    )

    if (res) {
      return res
    }
    console.error(`${chainId} Unable to find stable rpc node`)
    return null
  },

  setStableRpc(chainId, rpc, msg) {
    this.log(chainId, rpc, msg || '', 'success')
    localStorage.setItem(
      `${chainId}_stable_rpc`,
      JSON.stringify({ rpc, expireTime: new Date().valueOf() + 60 * 1000 })
    )
  },

  async getNetworkRpc() {
    let list = chainsList
    if (!list?.length) {
      try {
        const res = await fetch('https://chainid.network/chains.json')
        const data = await res.json()
        chainsList = data || []
        list = data || []
      } catch (error) {}
    }
    return list?.map((item) => item) || []
  },

  getChainIdNetworkRpclist(networkList, chainId) {
    const group =
      networkList.filter((item) => {
        return String(item?.chainId) === String(chainId)
      })?.[0]?.rpc || []

    return (
      group?.filter(
        (option) =>
          !(
            option.includes('${') ||
            option.includes('ws://') ||
            option.includes('wss://')
          )
      ) || []
    )
  },

  cleanRpcList(networkList, rpcList) {
    const rpcGroup = networkList.concat(rpcList)
    let list = []
    rpcGroup.forEach((item) => {
      const flag = list.some((option) => option.trim() === item.trim())
      if (!flag) {
        list = list.concat([item.trim()])
      }
    })

    return list
  },

  async getRpcList(chainId) {
    // const res = await this.getNetworkRpc()
    if (!chainId) return
    const res = []
    const netWorkRpcList = this.getChainIdNetworkRpclist(res, chainId)
    const chainInfo = this.getV3ChainInfoByChainId(chainId)
    let rpcList = chainInfo?.rpc || []
    const storageRpc = localStorage.getItem(`${chainId}_stable_rpc`)
    try {
      const stableRpc = JSON.parse(storageRpc)
      if (stableRpc?.rpc && stableRpc.expireTime > new Date().valueOf()) {
        rpcList = [stableRpc.rpc, ...rpcList]
      }
      rpcList = this.cleanRpcList(netWorkRpcList, rpcList)
    } catch (e) {
      console.error('parse stableRpc  error', e)
    }
    rpcList = shuffle(rpcList)
    if (
      process.env[`RPC_${chainId}`] &&
      process.env[`RPC_${chainId}`].includes('http')
    ) {
      rpcList.push(process.env[`RPC_${chainId}`])
    }
    return uniq(rpcList)
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
      selectMakerConfig.fromChain.decimals === 8 ||
        selectMakerConfig.toChain.decimals === 8
        ? 6
        : selectMakerConfig.fromChain.decimals === 18
        ? 5
        : 2,
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

  getV3ChainInfoByChainId(chainId) {
    const info = config.chainConfig.find(
      (item) => item.chainId.toString() === chainId?.toString()
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

  isEvmChain(chainId) {
    return ![
      CHAIN_ID.zksync,
      CHAIN_ID.zksync_test,
      CHAIN_ID.starknet,
      CHAIN_ID.starknet_test,
      CHAIN_ID.solana,
      CHAIN_ID.solana_test,
      CHAIN_ID.ton,
      CHAIN_ID.ton_test,
      CHAIN_ID.imx,
      CHAIN_ID.imx_test,
      CHAIN_ID.loopring,
      CHAIN_ID.loopring_test,
      CHAIN_ID.dydx,
      CHAIN_ID.dydx_test,
      CHAIN_ID.zkspace,
      CHAIN_ID.zkspace_test,
    ].includes(chainId)
  },

  getInternalIdByChainId(chainId) {
    const chainInfo = this.getV3ChainInfoByChainId(chainId)
    return chainInfo?.internalId ? Number(chainInfo.internalId) : null
  },

  getChainTokenList(chain) {
    const allTokenList = []
    if (!chain) return []
    if (chain.tokens && chain.tokens.length) {
      allTokenList.push(...chain.tokens)
    }
    if (chain.nativeCurrency) {
      allTokenList.push(chain.nativeCurrency)
    }
    return allTokenList
  },

  log(...msg) {
    if (isProd()) {
      return
    }
    console.log('======', ...msg)
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
      fromChainID === CHAIN_ID.starknet ||
      fromChainID === CHAIN_ID.starknet_test ||
      toChainID === CHAIN_ID.starknet ||
      toChainID === CHAIN_ID.starknet_test
    )
  },

  isSolana() {
    const { fromChainID, toChainID } = transferDataState
    return (
      fromChainID === CHAIN_ID.solana ||
      fromChainID === CHAIN_ID.solana_test ||
      toChainID === CHAIN_ID.solana ||
      toChainID === CHAIN_ID.solana_test
    )
  },

  isTon() {
    const { fromChainID, toChainID } = transferDataState
    return (
      fromChainID === CHAIN_ID.ton ||
      fromChainID === CHAIN_ID.ton_test ||
      toChainID === CHAIN_ID.ton ||
      toChainID === CHAIN_ID.ton_test
    )
  },
  isSupportXVMContract() {
    const { fromChainID, selectMakerConfig, fromCurrency, toCurrency } =
      transferDataState
    if (!this.isWhite()) {
      return false
    }
    if (this.isStarkNet()) {
      return false
    }
    if (selectMakerConfig.ebcId) {
      return false
    }
    const chainInfo = this.getV3ChainInfoByChainId(fromChainID)
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
   * @param {string} chainId
   */
  async ensureWalletNetwork(chainId) {
    const maskNetworkId = this.getMetaMaskNetworkId(chainId)
    if (!maskNetworkId) {
      console.error(maskNetworkId, 'none of ', chainId)
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
      if (error.code === 4902 || error.data?.originalError?.code === 4902) {
        await this.addEthereumChain(chainId)
      } else {
        console.error(error)
        this.showMessage(error.message, 'error')
      }
      return false
    }
  },

  async addEthereumChain(chainId) {
    const chainInfo = this.getV3ChainInfoByChainId(chainId)
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
      blockExplorerUrls: chainInfo?.infoURL ? [chainInfo.infoURL] : null,
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
  async requestWeb3(chainId, method, ...args) {
    const rpcList = await this.getRpcList(chainId)
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
  async getWeb3TokenBalance(chainId, userAddress, tokenAddress) {
    const rpcList = await this.getRpcList(chainId)
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
        reject(`Request Web3 TokenBalance RPC error ${chainId} ${tokenAddress}`)
      }
    })
  },
}

export function formatCurrency(number, defaultCurrency) {
  if (!number) return defaultCurrency
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
