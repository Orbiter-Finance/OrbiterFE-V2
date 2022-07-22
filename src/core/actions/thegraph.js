// util/thegraph.js
import Axios from '../utils/Axios'
Axios.axios()

const nowMakerList = [

    {
    makerAddress: '0x0043d60e87c5dd08C86C3123340705a1556C4719',
    c1ID: 515,
    c2ID: 5,
    c1Name: 'bsc_test',
    c2Name: 'rinkeby',
    t1Address: '0x2ceea9fead4584aba77ecde697e9fc80c9bd4c56',
    t2Address: '0x0000000000000000000000000000000000000000',
    tName: 'ETH',
    c1MinPrice: 0.005,
    c1MaxPrice: 10,
    c2MinPrice: 0.005,
    c2MaxPrice: 10,
    precision: 18,
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0.0007,
    c2TradingFee: 0.0013,
    c1GasFee: 0.15,
    c2GasFee: 0.15,
    c1AvalibleTimes: [
      {
        startTime: 0,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 0,
        endTime: 99999999999999,
      },
    ],
  },
    {
    makerAddress: '0x0043d60e87c5dd08C86C3123340705a1556C4719',
    c1ID: 515,
    c2ID: 5,
    c1Name: 'bsc_test',
    c2Name: 'rinkeby',
    t1Address: '0x0000000000000000000000000000000000000000',
    t2Address: '0x5a5D3Eb7265854902460523340a75148AAD7fcF1',
    tName: 'BNB',
    c1MinPrice: 0.0001,
    c1MaxPrice: 10,
    c2MinPrice: 0.0001,
    c2MaxPrice: 10,
    precision: 18,
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0.0007,
    c2TradingFee: 0.0013,
    c1GasFee: 0.15,
    c2GasFee: 0.15,
    c1AvalibleTimes: [
      {
        startTime: 0,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 0,
        endTime: 99999999999999,
      },
    ],
  },
]
function getMakerInfo(req, next) {
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
}
function getMakerTokenNames(maketList) {
  let makerTokenNames = {}
  for (let item of maketList) {
    makerTokenNames[item.tName] = true
  }
  return makerTokenNames
}
function getAllMakerList(req, next) {
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
}
export default {
  getMakerInfo,
  getMakerTokenNames,
  getAllMakerList
}
export {
  getMakerInfo,
  getMakerTokenNames,
  getAllMakerList
}
