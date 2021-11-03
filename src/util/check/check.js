// var WAValidator = require('wallet-address-validator')
export default {
  checkPrice: function(text) {
    var reg = /^(?!0$|0\.$|0\.0$|0\.00$)(?![1-9]\d*\.$)(0?|[1-9]\d*)(\.\d{0,5})?$/
    // 0 0. 0.0 0.00 1.  222. not alow
    if (reg.test(text)) {
      return true
    } else {
      return false
    }
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
  checkIsPC: function() {
    if (
      navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
      )
    ) {
      return false
    } else {
      return true
    }
  },
  checkIsImToken: function() {
    if (window.ethereum) {
      if (window.ethereum.isImToken) {
        return true
      }
    }
    return false
  },
  checkIsMetaMask: function() {
    if (window.ethereum) {
      if (window.ethereum.isMetaMask) {
        return true
      }
    }
    return false
  },
}
