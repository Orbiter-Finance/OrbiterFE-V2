export default {
  debounce: function(fnName, delay) {
    var timeout = null
    var newDelay = delay || 200
    return function() {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        this[fnName]()
      }, newDelay)
    }
  }
}

