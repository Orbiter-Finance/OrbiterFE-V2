// util/thegraph.js
import getMakelist from "../utils/getMakerlist"

let nowMakerList = []
let historyMakerList = []
export default {
  getMakerInfo: async function (req, next) {
    var res = {}
    res.code = 0
    let { makerList, historyMakerList: theHistoryMakerList } = await getMakelist.getData()
    nowMakerList = makerList
    historyMakerList = theHistoryMakerList
    res.data = nowMakerList
    return res
  },
  getAllMakerList: function (req, next) {
    return new Promise((resolve, reject) => {
      var res = {}
      res.code = 0
      res.data = [
        {
          makerAddress: '0x0043d60e87c5dd08C86C3123340705a1556C4719',
          c1ID: 5,
          c2ID: 22,
          c1Name: 'rinkeby',
          c2Name: 'arbitrum(test)',
          t1Address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
          t2Address: '0x6079Dd4565cb1852D6c4190DB7af6C8A69f73Eae',
          tName: 'USDC',
          c1MinPrice: 0.1,
          c1MaxPrice: 1000,
          c2MinPrice: 0.1,
          c2MaxPrice: 1000,
          precision: 6,
          c1AvalibleDeposit: 1000,
          c2AvalibleDeposit: 1000,
          c1TradingFee: 1,
          c2TradingFee: 1,
          c1GasFee: 3,
          c2GasFee: 3,
          c1AvalibleTimes: [
            {
              startTime: 0,
              endTime: 1636019587,
            },
          ],
          c2AvalibleTimes: [
            {
              startTime: 0,
              endTime: 1636019587,
            },
          ],
        },
        {
          makerAddress: '0x0043d60e87c5dd08C86C3123340705a1556C4719',
          c1ID: 5,
          c2ID: 33,
          c1Name: 'rinkeby',
          c2Name: 'zksync(test)',
          t1Address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
          t2Address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
          tName: 'USDC',
          c1MinPrice: 0.1,
          c1MaxPrice: 1000,
          c2MinPrice: 0.1,
          c2MaxPrice: 1000,
          precision: 6,
          c1AvalibleDeposit: 1000,
          c2AvalibleDeposit: 1000,
          c1TradingFee: 1,
          c2TradingFee: 1,
          c1GasFee: 3,
          c2GasFee: 3,
          c1AvalibleTimes: [
            {
              startTime: 0,
              endTime: 1636019587,
            },
          ],
          c2AvalibleTimes: [
            {
              startTime: 0,
              endTime: 1636019587,
            },
          ],
        },
        {
          makerAddress: '0x0043d60e87c5dd08C86C3123340705a1556C4719',
          c1ID: 22,
          c2ID: 33,
          c1Name: 'arbitrum(test)',
          c2Name: 'zksync(test)',
          t1Address: '0x6079Dd4565cb1852D6c4190DB7af6C8A69f73Eae',
          t2Address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
          tName: 'USDC',
          c1MinPrice: 0.1,
          c1MaxPrice: 1000,
          c2MinPrice: 1,
          c2MaxPrice: 1000,
          precision: 6,
          c1AvalibleDeposit: 1000,
          c2AvalibleDeposit: 1000,
          c1TradingFee: 1,
          c2TradingFee: 2,
          c1GasFee: 3,
          c2GasFee: 4,
          c1AvalibleTimes: [
            {
              startTime: 0,
              endTime: 1636019586,
            },
          ],
          c2AvalibleTimes: [
            {
              startTime: 0,
              endTime: 1636019586,
            },
          ],
        },
      ]

      // push now makerList
      res.data = res.data.concat(nowMakerList)

      if (next) {
        resolve(res)
      } else {
        reject(res)
      }
    })
  },
}
