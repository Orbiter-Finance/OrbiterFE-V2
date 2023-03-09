import http from './index'

export async function getContracts(rollup) {
  let res
  try {
    res = await http.get(`/new_contracts/${rollup}`)
    if (res.data.status !== 'success') {
      throw Error()
    }
  } catch (error) {
    console.error('Failed to get contracts', error)
  }
  return res ? res.data.data : undefined
}
