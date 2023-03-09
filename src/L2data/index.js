import axios from 'axios'
import { isLocal } from '../util/env'
import env from '../../env'

const baseURL = isLocal()
  ? '/api/v1/l2_data/'
  : `${env.l2BaseUrl}/api/v1/l2_data`

export default axios.create({
  baseURL,
})
