import chainList from '../config/chains.json'
import { Message } from 'element-ui'

export default {
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
      (chain) => chain.chainId.toString() === netChainID.toString(),
    )
    if (chain.length > 0) {
      return chain[0]
    }
    return undefined
  },
  chainName(localChainID, netChainID) {
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
      (chain) => chain.chainId.toString() === netChainID,
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
      (chain) => chain.chainId.toString() === netChainID,
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
}
