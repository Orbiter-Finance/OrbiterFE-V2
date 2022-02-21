// util/thegraph.js
import Axios from '../utils/Axios'
Axios.axios()

const nowMakerList = [
  // usdc
  {
    makerAddress: '0x694434EC84b7A8Ad8eFc57327ddD0A428e23f8D5',
    c1ID: 77,
    c2ID: 22,
    c1Name: 'optimism(test)',
    c2Name: 'arbitrum(test)',
    t1Address: '0x18A895508d046e74739b81e01a46A97073C4df92',
    t2Address: '0x877E2C25aA7fBb4a84bdbd07a6C9535B31E1FC2D',
    tName: 'USDC',
    c1MinPrice: 0.1,
    c1MaxPrice: 1000,
    c2MinPrice: 1,
    c2MaxPrice: 1000,
    precision: 18,
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0,
    c2TradingFee: 0,
    c1GasFee: 0,
    c2GasFee: 0,
    c1AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
  },
  {
    makerAddress: '0x694434EC84b7A8Ad8eFc57327ddD0A428e23f8D5',
    c1ID: 5,
    c2ID: 22,
    c1Name: 'rinkeby',
    c2Name: 'arbitrum(test)',
    t1Address: '0x0364e46658a88Cb4Fbce2560E871Bed1ADe46FE4',
    t2Address: '0x877E2C25aA7fBb4a84bdbd07a6C9535B31E1FC2D',
    tName: 'USDC',
    c1MinPrice: 0.1,
    c1MaxPrice: 1000,
    c2MinPrice: 1,
    c2MaxPrice: 1000,
    precision: 18,
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0,
    c2TradingFee: 0,
    c1GasFee: 0,
    c2GasFee: 0,
    c1AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
  },
  {
    makerAddress: '0x694434EC84b7A8Ad8eFc57327ddD0A428e23f8D5',
    c1ID: 77,
    c2ID: 5,
    c1Name: 'optimism(test)',
    c2Name: 'rinkeby',
    t1Address: '0x18A895508d046e74739b81e01a46A97073C4df92',
    t2Address: '0x0364e46658a88Cb4Fbce2560E871Bed1ADe46FE4',
    tName: 'USDC',
    c1MinPrice: 0.1,
    c1MaxPrice: 1000,
    c2MinPrice: 1,
    c2MaxPrice: 1000,
    precision: 18,
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0,
    c2TradingFee: 0,
    c1GasFee: 0,
    c2GasFee: 0,
    c1AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
  },
]

export default {
  getMakerInfo: function (req, next) {
    return new Promise((resolve, reject) => {
      var res = {}
      res.code = 0
      res.data = nowMakerList
      if (next) {
        resolve(res)
      } else {
        reject(res)
      }
    })
  },
  getAllMakerList: function (req, next) {
    return new Promise((resolve, reject) => {
      var res = {}
      res.code = 0
      res.data = []

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
