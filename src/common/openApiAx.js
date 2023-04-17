import axios from 'axios'
import util from "../util/util";

const openApiAx = axios.create({
  baseURL: process.env.VUE_APP_OPEN_URL,
  timeout: 30000,
})

openApiAx.interceptors.response.use(
  function (response) {
    const respData = response.data
    if (respData.code !== 0) {
        // util.showMessage(respData.msg, 'error');
        return null;
    }
    return respData.result
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default openApiAx
