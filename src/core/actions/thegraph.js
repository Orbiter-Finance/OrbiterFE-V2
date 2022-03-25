// util/thegraph.js
import getMakelist from "../utils/getMakerlist"

let nowMakerList = []
let historyMakerList = []

function filterHistoryMakerList(daysAgo) {
  const nowTimeStamp = Date.parse(new Date()) / 1000
  const needTimeStamp = nowTimeStamp - 86400 * (daysAgo ? daysAgo : 7)
  let newHistoryMakerList = []
  for (let item of historyMakerList) {
    const avalibleTimes = item.c1AvalibleTimes;
    let isMatch = false
    for (let i = 0; i < avalibleTimes.length; i++) {
      const avalibleTime = avalibleTimes[i]
      if (avalibleTime.endTime >= needTimeStamp) {
        isMatch = true
        break
      }
    }
    if (isMatch) {
      newHistoryMakerList.push(item)
    }
  }
  return newHistoryMakerList
}



export default {
  getMakerInfo: async function (req, next) {
    var res = {}
    res.code = 0
    let { makerList, historyMakerList: theHistoryMakerList } = await getMakelist.getMakerListData()
    nowMakerList = makerList
    historyMakerList = theHistoryMakerList
    res.data = nowMakerList
    return res
  },
  getAllMakerList: function (req, next) {
    return new Promise((resolve, reject) => {
      var res = {}
      res.code = 0
      res.data = []

      // push now makerList
      res.data = res.data.concat(nowMakerList)
      const newHistoryMakerList = filterHistoryMakerList(req.daysAgo)
      res.data.concat(newHistoryMakerList)
      if (next) {
        resolve(res)
      } else {
        reject(res)
      }
    })
  },
}

