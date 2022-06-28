import axios from 'axios'
// import { Loading, Message } from 'element-ui'

const AX = axios.create({
  baseURL: this.$env.baseUrl,
  timeout: 30000,
  withCredentials: this.$env.credential,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
})

// request Interceptor
AX.interceptors.request.use(
  function (config) {
    const body = config.data
    if (config.method === 'post') {
      config.data = body
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

function requestHandle(type, uri, data, config) {
  const { useLoading } = config
  // var loading = {}
  if (useLoading === true) {
    // loading = Loading.service({
    //   fullscreen: true
    // })
  }
  return new Promise((resolve, reject) => {
    AX[type](uri, data)
      .then((res = {}) => {
        const resCode = res.status
        const resData = res.data || {}
        if (resCode === 200) {
          // return data to Caller
          const resolveData = resData
          resolve(resolveData)
        } else {
          // Message({
          //   showClose: true,
          //   duration: 2000,
          //   message: 'request error',
          //   type: 'error'
          // })
          reject('request error')
        }
      })
      .finally(() => {
        // useLoading && loading.close()
      })
  }).catch((err) => {
    console.warn('err =', err)
    // const msg = err.message || err || 'network error'
    // Message({
    //   type: 'error',
    //   showClose: true,
    //   message: msg
    // })
  })
}

export default {
  get(uri = '', data = {}) {
    if (data.params === undefined) data.params = {}
    if (data.config === undefined) data.config = {}
    return requestHandle('get', uri, { params: data.params }, data.config)
  },
  post(uri = '', data = {}) {
    if (data.params === undefined) data.params = {}
    if (data.config === undefined) data.config = {}
    return requestHandle('post', uri, data.params, data.config)
  },
}
