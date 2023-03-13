// var WAValidator = require('wallet-address-validator')
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'
export default {
  checkPrice: function (text) {
    const reg =
      /^(?!0$|0\.$|0\.0$|0\.00$)(?![1-9]\d*\.$)(0?|[1-9]\d*)(\.\d{0,6})?$/
    // 0 0. 0.0 0.00 1.  222. not alow
    return reg.test(text)
  },
  // isETHAddres: function(address) {
  //   if (address && address.length !== 0) {
  //     var valid = WAValidator.validate(address, 'ETH')
  //     if (valid) {
  //       return true
  //     } else return false
  //   }
  //   return false
  // },
  checkIsPC: function () {
    if (
      navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
    ) {
      return false
    } else {
      return true
    }
  },
  checkIsImToken: function () {
    if (compatibleGlobalWalletConf.value.walletPayload.provider) {
      if (compatibleGlobalWalletConf.value.walletPayload.provider.isImToken) {
        return true
      }
    }
    return false
  },
  checkIsMetaMask: function () {
    if (compatibleGlobalWalletConf.value.walletPayload.provider) {
      if (compatibleGlobalWalletConf.value.walletPayload.provider.isMetaMask) {
        return true
      }
    }
    return false
  },
  checkIsTallyHo: function () {
    if (compatibleGlobalWalletConf.value.walletPayload.provider) {
      if (compatibleGlobalWalletConf.value.walletPayload.provider.isTally) {
        return true
      }
    }
    return false
  },
  checkIsBitKeep: function () {
    if (compatibleGlobalWalletConf.value.walletPayload.provider) {
      if (compatibleGlobalWalletConf.value.walletPayload.provider.isBitKeep) {
        return true
      }
    }
    return false
  },
}
