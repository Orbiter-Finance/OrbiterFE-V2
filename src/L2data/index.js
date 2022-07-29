import axios from 'axios'

const baseURL = 'https://l2api.orbiter.finance/api/v1/l2_data'

export default axios.create({
  baseURL,
})
