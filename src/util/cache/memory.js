// {[string]: {value: any, expired: number(ms timestramp)}}
const cache = {}
module.exports = {
  /**
   * @param {string} key
   * @param {any} value
   * @param {number} duration ms, 0: Indefinitely
   */
  cacheMemorySet(key, value, duration = 0) {
    let expired = 0
    if (duration != 0) {
      expired = new Date().getTime() + duration
    }

    cache[key] = { value, expired }
  },

  /**
   * @param {string} key
   * @returns {undefined | any}
   */
  cacheMemoryGet(key) {
    if (!cache[key]) {
      return undefined
    }

    if (cache[key].expired !== 0 && new Date().getTime > cache[key].expired) {
      return undefined
    }

    return cache[key].value
  },
}
