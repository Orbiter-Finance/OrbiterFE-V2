import axios from 'axios'
import {  isLocal } from '../util/env'

const baseURL = isLocal() ? '/api/v1/l2_data': 'https://l2api.orbiter.finance/api/v1/l2_data'

export default axios.create({
  baseURL,
})
