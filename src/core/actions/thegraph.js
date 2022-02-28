// util/thegraph.js
import Axios from '../utils/Axios'
Axios.axios()

const nowMakerList = [
  // usdc
  {
    makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
    c1ID: 77,
    c2ID: 22,
    c1Name: 'optimism(test)',
    c2Name: 'arbitrum(test)',
    t1Address: '0xf1F75cd394D76065d836DD58E93c4c8e9a003D6E',
    t2Address: '0x750Bf8642CCe3644A0E434026f5Bd392bA13d1F1',
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
    makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
    c1ID: 5,
    c2ID: 22,
    c1Name: 'rinkeby',
    c2Name: 'arbitrum(test)',
    t1Address: '0x9C37dB6B4ddd21d6C0ef89065c1C353719fc63aB',
    t2Address: '0x750Bf8642CCe3644A0E434026f5Bd392bA13d1F1',
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
    makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
    c1ID: 77,
    c2ID: 5,
    c1Name: 'optimism(test)',
    c2Name: 'rinkeby',
    t1Address: '0xf1F75cd394D76065d836DD58E93c4c8e9a003D6E',
    t2Address: '0x9C37dB6B4ddd21d6C0ef89065c1C353719fc63aB',
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
