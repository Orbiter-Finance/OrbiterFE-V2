import http from './index'

export async function getRollupDetail(name) {
  let res
  try {
    res = await http.get(
      `/rollup_details/${name.replace(' ', '').toLowerCase()}`
    )
    if (res.data.status !== 'success') {
      throw Error()
    }
  } catch (error) {
    console.error('Failed to get dapp detail', error)
  }
  return res ? res.data.data : undefined
}
