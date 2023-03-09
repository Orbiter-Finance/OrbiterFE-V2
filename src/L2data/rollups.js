import http from './index'

const tabs = {}

export async function getRollups() {
  let res
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

export async function getTabRollups(from) {
  let res
  if (tabs[from]) {
    return tabs[from]
  }
  try {
    res = await http.get(`/rollup_tab/${from}`)
    if (res.data.status !== 'success') {
      throw Error()
    }
  } catch (error) {
    console.error('Failed to get rollups', error)
  }
  return res
    ? (tabs[from] = res.data.data.map((item) => ({
        label: Object.keys(item)[0],
        value: item[Object.keys(item)[0]],
      })))
    : undefined
}
