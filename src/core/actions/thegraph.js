// util/thegraph.js
import Axios from '../utils/Axios'
import env from '../../../env'
Axios.axios()

const nowMakerList = [
  // DAI
  {
    makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
    c1ID: 5,
    c2ID: 22,
    c1Name: 'Goerli',
    c2Name: 'Arbitrum(G)',
    t1Address: env.coinAddress['DAI'][5],
    t2Address: env.coinAddress['DAI'][22],
    tName: 'DAI',
    c1MinPrice: 0.1,
    c1MaxPrice: 100,
    c2MinPrice: 0.1,
    c2MaxPrice: 10,
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
  // {
  //   makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
  //   c1ID: 77,
  //   c2ID: 22,
  //   c1Name: 'optimism(test)',
  //   c2Name: 'arbitrum(test)',
  //   t1Address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  //   t2Address: '0xAe60819A0258e8D34580bf26C755331e8B4B79b4',
  //   tName: 'DAI',
  //   c1MinPrice: 0.1,
  //   c1MaxPrice: 10,
  //   c2MinPrice: 1,
  //   c2MaxPrice: 10,
  //   precision: 18,
  //   c1AvalibleDeposit: 1000,
  //   c2AvalibleDeposit: 1000,
  //   c1TradingFee: 0,
  //   c2TradingFee: 0,
  //   c1GasFee: 0,
  //   c2GasFee: 0,
  //   c1AvalibleTimes: [
  //     {
  //       startTime: 1636019587,
  //       endTime: 99999999999999,
  //     },
  //   ],
  //   c2AvalibleTimes: [
  //     {
  //       startTime: 1636019587,
  //       endTime: 99999999999999,
  //     },
  //   ],
  // },
  // {
  //   makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
  //   c1ID: 77,
  //   c2ID: 5,
  //   c1Name: 'optimism(test)',
  //   c2Name: 'rinkeby',
  //   t1Address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  //   t2Address: '0x2e055eEe18284513B993dB7568A592679aB13188',
  //   tName: 'DAI',
  //   c1MinPrice: 0.1,
  //   c1MaxPrice: 10,
  //   c2MinPrice: 1,
  //   c2MaxPrice: 10,
  //   precision: 18,
  //   c1AvalibleDeposit: 1000,
  //   c2AvalibleDeposit: 1000,
  //   c1TradingFee: 0,
  //   c2TradingFee: 0,
  //   c1GasFee: 0,
  //   c2GasFee: 0,
  //   c1AvalibleTimes: [
  //     {
  //       startTime: 1636019587,
  //       endTime: 99999999999999,
  //     },
  //   ],
  //   c2AvalibleTimes: [
  //     {
  //       startTime: 1636019587,
  //       endTime: 99999999999999,
  //     },
  //   ],
  // },
  // USDC
  {
    makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
    c1ID: 5,
    c2ID: 22,
    c1Name: 'Goerli',
    c2Name: 'Arbitrum(G)',
    t1Address: env.coinAddress['USDC'][5],
    t2Address: env.coinAddress['USDC'][22],
    tName: 'USDC',
    c1MinPrice: 0.1,
    c1MaxPrice: 100,
    c2MinPrice: 0.1,
    c2MaxPrice: 10,
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
