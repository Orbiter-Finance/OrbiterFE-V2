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
  chainIcon(item) {
    let iconName = 'tokenLogo'
    if (item === 2 || item === 22) {
      iconName = 'arblogo'
    }
    if (item === 3 || item === 33) {
      iconName = 'zklogo'
    }
    if (item === 4 || item === 44) {
      iconName = 'sknlogo'
    }
    if (item === 6 || item === 66) {
      iconName = 'pglogo'
    }
    if (item === 7 || item === 77) {
      iconName = 'oplogo'
    }
    if (item === 8 || item === 88) {
      iconName = 'imxlogo'
    }
    if (item === 9 || item === 99) {
      iconName = 'loopringlogo'
    }
    if (item === 10 || item === 510) {
      iconName = 'metislogo'
    }
    if (item === 11 || item === 511) {
      iconName = 'dydxlogo'
    }
    if (item === 12 || item === 512) {
      iconName = 'zkspacelogo'
    }
    if (item === 13 || item === 513) {
      iconName = 'bobalogo'
    }
    if (item === 14 || item === 514) {
      iconName = 'zk2logo'
    }
    if (item === 15 || item === 515) {
      iconName = 'bsclogo'
    }
    return iconName
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
  /**
   * [groupingData 根据共同字段将数据分组]
   * @param {[type]} arr [数据源]
   * @param {[type]} field [字段名]
   */
  // 传入两个参数 一个是待分组的数据 一个是按照哪个字段进行分组
  groupingData(data, filed) {
    // map用来保存存过的字段 为下边添加新对象或者将相同字段的数据保存到同一个list中
    let map = {}
    // dest主要保存分组后的数据
    let dest = {}
    // 循环遍历传入的data
    data.forEach((item) => {
      // 判断map对象中是否有遍历时data的key 如果没有则向dest数组中推入一个新的对象(包含两个属性，一个要分组的字段名，一个保存相同字段名数据的数组)
      if (!map[item[filed]]) {
        dest.item[filed].push({
          [item[filed]]: [item],
        })
        console.log('item[filed]', item[filed])
        // 进行一次新添对象的记录
        map[item[filed]] = item
        // 如果在map中有data遍历的key(字段相同) 则向dest数组里面的相同字段的list下推入数据
      } else {
        dest.forEach((dItem) => {
          if (dItem[filed] == item[filed]) {
            dItem.list.push(item)
          }
        })
      }
    })
    return dest
  },
}
