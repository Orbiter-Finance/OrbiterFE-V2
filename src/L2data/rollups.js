import http from './index'

export async function getRollups() {
  let res = undefined
  try {
    res = await http.get('/rollups_data')
    if (res.data.status !== 'success') {
      throw Error()
    }
  } catch (error) {
    console.error('Failed to get rollups', error)
  }
  return res ? res.data.data : undefined
}
