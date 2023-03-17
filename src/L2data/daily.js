import http from './index'

export async function getDappDailyData(rollup) {
  let res
  try {
    res = await http.get(`/mainpage_dapp_daily_data/${rollup}`)
    if (res.data.status !== 'success') {
      throw Error()
    }
  } catch (error) {
    console.error('Failed to get dapp daily data', error)
  }
  return res ? res.data.data : undefined
}
