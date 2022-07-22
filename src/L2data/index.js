import axios from 'axios'

const baseURL = 'http://datastation.joeyzhou.xyz/api/v1/l2_data'

export default axios.create({
  baseURL,
})
