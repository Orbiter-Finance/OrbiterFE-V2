import axios from 'axios'
import env from '../../../env'

export async function getTransactionsHistoryApi(params = {}) {
  return await axios.get(`${env.baseTraddingUrl}/transactions/history`, {
    params,
  })
}
