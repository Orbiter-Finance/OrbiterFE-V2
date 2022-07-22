import http from './index'

export async function getDapps(rollup) {
  let res = undefined
  try {
    res = await http.get(`/dapp_data/${rollup}`)
    if (res.data.status !== 'success') {
      throw Error()
    }
  } catch (error) {
    console.error('Failed to get dapps', error)
  }
  return res ? res.data.data : undefined
}
