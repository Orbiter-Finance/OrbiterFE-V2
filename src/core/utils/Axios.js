import axios from 'axios'
import tunnel from 'tunnel'

export default {
  axios: function () {
    axios.defaults.proxy = false
    axios.defaults.httpsAgent = tunnel.httpsOverHttp({
      proxy: { host: '127.0.0.1', port: '7890' },
    })
  },
}
async function axiosPlus(method, url, params = {}, count = 5) {
  try {
    let resp
    if (method.toLowerCase() == 'get') {
      resp = await axios.get(url, { params })
    } else {
      resp = await axios.post(url, params)
    }

    if (resp.status == 200 && resp.data) {
      return resp.data
    } else {
      throw new Error(`get ${url} error`)
    }
  } catch (error) {
    count--
    if (count >= 0) {
      return await axiosPlus(method, url, params, count)
    } else {
      throw new Error(`get ${url} error`)
    }
  }
}
export { axiosPlus }
