import axios from 'axios'

const orbiterApiAx = axios.create({
  baseURL: 'https://api.orbiter.finance',
  // baseURL:'http://ec2-54-238-20-18.ap-northeast-1.compute.amazonaws.com:9095',
  timeout: 30000,
})

orbiterApiAx.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default orbiterApiAx
