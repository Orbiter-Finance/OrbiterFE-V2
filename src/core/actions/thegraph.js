// util/thegraph.js
import Axios from '../utils/Axios'
Axios.axios()

export default {
  getMakerInfo: function(req, next) {
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
          minPrice: 0.1,
          maxPrice: 1000,
          precision: 6,
          avalibleDeposit: 1000,
          tradingFee: 1,
          gasFee: 3,
          avalibleTimes: [
            {
              startTime: 0,
              endTime: 99999999999999,
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
          minPrice: 0.1,
          maxPrice: 1000,
          precision: 6,
          avalibleDeposit: 1000,
          tradingFee: 1,
          gasFee: 3,
          avalibleTimes: [
            {
              startTime: 0,
              endTime: 99999999999999,
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
          minPrice: 0.1,
          maxPrice: 1000,
          precision: 6,
          avalibleDeposit: 1000,
          tradingFee: 1,
          gasFee: 3,
          avalibleTimes: [
            {
              startTime: 0,
              endTime: 99999999999999,
            },
          ],
        },
      ]
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
        {
          makerAddress: '0x0043d60e87c5dd08C86C3123340705a1556C4719',
          c1ID: 5,
          c2ID: 22,
          c1Name: 'rinkeby',
          c2Name: 'arbitrum(test)',
          t1Address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
          t2Address: '0x6079Dd4565cb1852D6c4190DB7af6C8A69f73Eae',
          tName: 'USDC',
          minPrice: 0.1,
          maxPrice: 1000,
          precision: 6,
          avalibleDeposit: 1000,
          tradingFee: 1,
          gasFee: 3,
          avalibleTimes: [
            {
              startTime: 0,
              endTime: 99999999999999,
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
          minPrice: 0.1,
          maxPrice: 1000,
          precision: 6,
          avalibleDeposit: 1000,
          tradingFee: 1,
          gasFee: 3,
          avalibleTimes: [
            {
              startTime: 0,
              endTime: 99999999999999,
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
          minPrice: 0.1,
          maxPrice: 1000,
          precision: 6,
          avalibleDeposit: 1000,
          tradingFee: 1,
          gasFee: 3,
          avalibleTimes: [
            {
              startTime: 0,
              endTime: 99999999999999,
            },
          ],
        },
      ]
      if (next) {
        resolve(res)
      } else {
        reject(res)
      }
    })
  },
}
