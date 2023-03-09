import axios from 'axios'

const openApiAx = axios.create({
    baseURL: process.env.VUE_APP_OPEN_URL,
    timeout: 30000,
})

openApiAx.interceptors.response.use(
    function (response) {
        const respData = response.data
        if (respData.code !== 0) {
            return Promise.reject(new Error(respData.msg))
        }
        return respData.result
    },
    function (error) {
        return Promise.reject(error)
    }
)

export default openApiAx
