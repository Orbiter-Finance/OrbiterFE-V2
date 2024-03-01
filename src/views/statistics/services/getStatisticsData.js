import axios from 'axios'

export const queryUsersStatisticsData = async () => {
  let res
  try {
    res = await axios.get(
      'https://api.orbiter.finance/bd-data/address_count_last3m'
    )
    if (res.data.code !== 0) {
      throw Error()
    }
  } catch (error) {
    console.error('Failed queryUsersStatisticsData.', error)
  }
  return res ? res.data.result : undefined
}

export const queryUSDAmountStatisticsData = async () => {
  let res
  try {
    res = await axios.get('https://api.orbiter.finance/bd-data/tx_total')
    if (res.data.code !== 0) {
      throw Error()
    }
  } catch (error) {
    console.error('Failed queryUSDAmountStatisticsData.', error)
  }
  return res ? res.data.result : undefined
}

export const queryTxStatisticsData = async (symbol = 'ETH') => {
  let res
  try {
    res = await axios.get(
      `https://api.orbiter.finance/bd-data/day_amount_last3m?symbol=${symbol}`
    )
    if (res.data.code !== 0) {
      throw Error()
    }
  } catch (error) {
    console.error('Failed queryTxStatisticsData.', error)
  }
  return res ? res.data.result : undefined
}
