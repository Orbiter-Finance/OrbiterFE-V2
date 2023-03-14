import http from './index'

export async function getMainpageRollup() {
  let res
  try {
    res = await http.get('/mainpage_rollup_tx_by_day')
    if (res.data.status !== 'success') {
      throw Error()
    }
  } catch (error) {
    console.error('Failed to get l2data', error)
  }
  return res ? res.data.data : undefined
}
