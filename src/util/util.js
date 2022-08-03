import chainList from '../config/chains.json'
import { Message } from 'element-ui'
import web3 from 'web3'

export default {
  onCopySuccess() {
    // Notify({ title: 'copy success', type: 'success', duration: 2000 })
  },
  onCopyError() {
    // Notify.error({ title: 'copy faild', duration: 2000 })
  },
  showMessage(message, type) {
    Message({
      showClose: true,
      duration: 2000,
      message: message,
      type: type,
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
        return 'zkSync(R)'
      case 4:
        return 'StarkNet'
      case 44:
        return 'StarkNet(R)'
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
      return 'zkSync(R)'
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
    return '0x' + num.toString(16)
  },
  transferTimeStampToTime(timestamp) {
    if (!timestamp) {
      return timestamp
    }
    if (timestamp.toString().length === 10) {
      timestamp = timestamp * 1000
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

  isETHAddress(address) {
    return web3.utils.isAddress(address)
  },

  /**
   * @param {number} chainId
   */
  async ensureMetamaskNetwork(chainId) {
    const chain = this.getChainInfo(chainId)
    const switchParams = {
      chainId: this.toHex(chain.chainId),
    }
    try {
      const nowChainId = await window.ethereum.request({
        method: 'eth_chainId',
      })
      if (switchParams.chainId !== nowChainId) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [switchParams],
        })
        this.showMessage('Switch Success', 'success')
      }
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

        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [params],
        })
      } else {
        this.showMessage(error.message, 'error')
        throw error
      }
    }
  },
}
