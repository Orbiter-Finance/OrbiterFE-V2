// util/thegraph.js
import Axios from '../utils/Axios'
Axios.axios()

const nowMakerList = [
  // usdc able
  {
    makerAddress: '0x41d3D33156aE7c62c094AAe2995003aE63f587B3',
    c1ID: 1,
    c2ID: 2,
    c1Name: 'mainnet',
    c2Name: 'arbitrum',
    t1Address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    t2Address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    tName: 'USDC',
    c1MinPrice: 0.1,
    c1MaxPrice: 500,
    c2MinPrice: 0.1,
    c2MaxPrice: 500,
    precision: 6,
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 6,
    c2TradingFee: 25,
    c1GasFee: 3,
    c2GasFee: 3,
    c1AvalibleTimes: [
      {
        startTime: 1635523201,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 1635523201,
        endTime: 99999999999999,
      },
    ],
  },
  // usdc able
  {
    makerAddress: '0x41d3D33156aE7c62c094AAe2995003aE63f587B3',
    c1ID: 1,
    c2ID: 3,
    c1Name: 'mainnet',
    c2Name: 'zksync',
    t1Address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    t2Address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    tName: 'USDC',
    c1MinPrice: 0.1,
    c1MaxPrice: 500,
    c2MinPrice: 0.1,
    c2MaxPrice: 500,
    precision: 6,
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0.8,
    c2TradingFee: 25,
    c1GasFee: 3,
    c2GasFee: 3,
    c1AvalibleTimes: [
      {
        startTime: 1635523201,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 1635523201,
        endTime: 99999999999999,
      },
    ],
  },
  // usdc able
  {
    makerAddress: '0x41d3D33156aE7c62c094AAe2995003aE63f587B3',
    c1ID: 2,
    c2ID: 3,
    c1Name: 'arbitrum',
    c2Name: 'zksync',
    t1Address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    t2Address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    tName: 'USDC',
    c1MinPrice: 0.1,
    c1MaxPrice: 500,
    c2MinPrice: 0.1,
    c2MaxPrice: 500,
    precision: 6,
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0.8,
    c2TradingFee: 6,
    c1GasFee: 3,
    c2GasFee: 3,
    c1AvalibleTimes: [
      {
        startTime: 1635523201,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 1635523201,
        endTime: 99999999999999,
      },
    ],
  },
  // usdt able
  {
    makerAddress: '0xB859fE929f9f74CE96dD3F1F616fa3fF49D489A6',
    c1ID: 1,
    c2ID: 2,
    c1Name: 'mainnet',
    c2Name: 'arbitrum',
    t1Address: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
    t2Address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    tName: 'USDT',
    c1MinPrice: 0.1,
    c1MaxPrice: 500,
    c2MinPrice: 0.1,
    c2MaxPrice: 500,
    precision: 6,
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 6,
    c2TradingFee: 25,
    c1GasFee: 3,
    c2GasFee: 3,
    c1AvalibleTimes: [
      {
        startTime: 1640318400,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 1640318400,
        endTime: 99999999999999,
      },
    ],
  },
  // usdt able
  {
    makerAddress: '0xB859fE929f9f74CE96dD3F1F616fa3fF49D489A6',
    c1ID: 1,
    c2ID: 3,
    c1Name: 'mainnet',
    c2Name: 'zksync',
    t1Address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    t2Address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    tName: 'USDT',
    c1MinPrice: 0.1,
    c1MaxPrice: 500,
    c2MinPrice: 0.1,
    c2MaxPrice: 500,
    precision: 6,
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0.8,
    c2TradingFee: 25,
    c1GasFee: 3,
    c2GasFee: 3,
    c1AvalibleTimes: [
      {
        startTime: 1640318400,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 1640318400,
        endTime: 99999999999999,
      },
    ],
  },
  // usdt able
  {
    makerAddress: '0xB859fE929f9f74CE96dD3F1F616fa3fF49D489A6',
    c1ID: 2,
    c2ID: 3,
    c1Name: 'arbitrum',
    c2Name: 'zksync',
    t1Address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    t2Address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    tName: 'USDC',
    c1MinPrice: 0.1,
    c1MaxPrice: 500,
    c2MinPrice: 0.1,
    c2MaxPrice: 500,
    precision: 6,
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0.8,
    c2TradingFee: 6,
    c1GasFee: 3,
    c2GasFee: 3,
    c1AvalibleTimes: [
      {
        startTime: 1640318400,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 1640318400,
        endTime: 99999999999999,
      },
    ],
  },
]

export default {
  getMakerInfo: function(req, next) {
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
  getAllMakerList: function(req, next) {
    return new Promise((resolve, reject) => {
      var res = {}
      res.code = 0
      res.data = [
        // usdc unable
        {
          makerAddress: '0x41d3D33156aE7c62c094AAe2995003aE63f587B3',
          c1ID: 1,
          c2ID: 2,
          c1Name: 'mainnet',
          c2Name: 'arbitrum',
          t1Address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          t2Address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
          tName: 'USDC',
          c1MinPrice: 0.1,
          c1MaxPrice: 500,
          c2MinPrice: 0.1,
          c2MaxPrice: 500,
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
              endTime: 1635523200,
            },
          ],
          c2AvalibleTimes: [
            {
              startTime: 0,
              endTime: 1635523200,
            },
          ],
        },
        // usdc unable
        {
          makerAddress: '0x41d3D33156aE7c62c094AAe2995003aE63f587B3',
          c1ID: 1,
          c2ID: 3,
          c1Name: 'mainnet',
          c2Name: 'zksync',
          t1Address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          t2Address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          tName: 'USDC',
          c1MinPrice: 0.1,
          c1MaxPrice: 500,
          c2MinPrice: 0.1,
          c2MaxPrice: 500,
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
              endTime: 1635523200,
            },
          ],
          c2AvalibleTimes: [
            {
              startTime: 0,
              endTime: 1635523200,
            },
          ],
        },
        // usdc unable
        {
          // usdt unable
          makerAddress: '0x41d3D33156aE7c62c094AAe2995003aE63f587B3',
          c1ID: 2,
          c2ID: 3,
          c1Name: 'arbitrum',
          c2Name: 'zksync',
          t1Address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
          t2Address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          tName: 'USDC',
          c1MinPrice: 0.1,
          c1MaxPrice: 500,
          c2MinPrice: 0.1,
          c2MaxPrice: 500,
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
              endTime: 1635523200,
            },
          ],
          c2AvalibleTimes: [
            {
              startTime: 0,
              endTime: 1635523200,
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
