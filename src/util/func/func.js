export default {
  debounce: function (fnName, delay) {
    let timeout = null
    const newDelay = delay || 200
    return function () {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        this[fnName]()
      }, newDelay)
    }
  },
}
