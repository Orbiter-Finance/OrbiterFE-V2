import axios from 'axios'
const apiUrl = 'https://orbiter-makerlist.s3.ap-northeast-1.amazonaws.com'

async function getNewMakerList(count = 0) {
  try {
    return await getNewMakerListOnce()
  } catch (error) {
    console.warn(`getNewMakerList error=${error.message},try again ${count}`)
    count++
    if (count < 5) {
      return await getNewMakerList(count)
    }
  }
}

async function getNewMakerListOnce() {
  const res = await axios({
    url: `${apiUrl}/rinkeby/makerList.json?t=${new Date().getTime()}`,
    method: 'get',
  })
  if (res.status == 200) {
    return { ...res.data }
  } else {
    throw new Error('pull maker_list nothing')
  }
}
export default {
  getNewMakerList,
}
