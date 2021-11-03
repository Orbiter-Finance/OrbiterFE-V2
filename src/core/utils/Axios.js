import axios from 'axios'
import tunnel from 'tunnel'

export default {
  axios: function() {
    axios.defaults.proxy = false
    axios.defaults.httpsAgent = tunnel.httpsOverHttp({
      proxy: { host: '127.0.0.1', port: '7890' },
    })
  },
}
