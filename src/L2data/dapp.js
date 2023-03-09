import http from './index'

export async function getDapps(rollup) {
  let res
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

export async function getDappDetail(rollup, name) {
  let res
  try {
    res = await http.get(
      `/dapp/details/${rollup}/${name.replace(' ', '').toLowerCase()}`
    )
    if (res.data.status !== 'success') {
      throw Error()
    }
  } catch (error) {
    console.error('Failed to get dapp detail', error)
  }
  return res ? res.data.data : undefined
}
