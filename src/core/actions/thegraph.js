// util/thegraph.js
export const nowMakerList = [
  {
    makerAddress: '0x0043d60e87c5dd08C86C3123340705a1556C4719',
    c1ID: 33,
    c2ID: 66,
    c1Name: 'zksync_test',
    c2Name: 'polygon(R)',
    t1Address: '0x0000000000000000000000000000000000000000',
    t2Address: '0x0000000000000000000000000000000000000000',
    tName: 'ETH',
    c1MinPrice: 0.005,
    c1MaxPrice: 0.01,
    c2MinPrice: 0.005,
    c2MaxPrice: 0.01,
    precision: 18,
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0.0001,
    c2TradingFee: 0.0001,
    c1GasFee: 2,
    c2GasFee: 2,
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
    _X_ROW_KEY: 'row_193',
  },
  {
    "makerAddress": "0x0043d60e87c5dd08C86C3123340705a1556C4719",
    "c1ID": 5,
    "c2ID": 22,
    "c1Name": "goerli",
    "c2Name": "arbitrum_test",
    "t1Address": "0x0000000000000000000000000000000000000000",
    "t2Address": "0x0000000000000000000000000000000000000000",
    "tName": "ETH",
    "c1MinPrice": 0.005,
    "c1MaxPrice": 10,
    "c2MinPrice": 0.005,
    "c2MaxPrice": 10,
    "precision": 18,
    "c1AvalibleDeposit": 1000,
    "c2AvalibleDeposit": 1000,
    "c1TradingFee": 0.0013,
    "c2TradingFee": 0.005,
    "c1GasFee": 0.15,
    "c2GasFee": 0.3,
    "c1AvalibleTimes": [{ "startTime": 1655967601, "endTime": 99999999999999 }],
    "c2AvalibleTimes": [{ "startTime": 1655967601, "endTime": 99999999999999 }]
  }
]

// { chainId: { tokenAddress:data } }
export const xvmList = [
  {
    chainId: 5, contractAddress: '0xeb5a56c4424ca7c9f6470841db1b0070b87449d2', target: [
      {
        tokenAddress: "0x0000000000000000000000000000000000000000",
        symbol: "ETH",
        toChains: [
          {
            chainId: 22,
            tokenAddress: "0x0000000000000000000000000000000000000000",
            symbol: "ETH",
            precision: 18,
            rate: 200   // Ten thousandth ratio
          },
        ]
      }
    ],
  },
  {
    chainId: 22, contractAddress: '0x2ad8d38d29275a5f2f52a1a69fa4f4f409b223a0', target: [
      {
        tokenAddress: "0x0000000000000000000000000000000000000000",
        symbol: "ETH",
        toChains: [
          {
            chainId: 5,
            tokenAddress: "0x0000000000000000000000000000000000000000",
            symbol: "ETH",
            precision: 18,
            rate: 200
          },
          {
            chainId: 5,
            tokenAddress: "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
            symbol: "DAI",
            precision: 18,
            rate: 200
          }
        ]
      }
    ],
  },
  {
    chainId: 66, contractAddress: '0xD834F61E9bf59E1d7D417fE50625f72e36EB1ffb', target: [
      {
        tokenAddress: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
        symbol: "MATIC",
        toChains: [
          {
            chainId: 5,
            tokenAddress: "0x0000000000000000000000000000000000000000",
            symbol: "ETH",
            precision: 18,
            rate: 200
          },
          {
            chainId: 5,
            tokenAddress: "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
            symbol: "DAI",
            precision: 18,
            rate: 200
          },
          {
            chainId: 22,
            tokenAddress: "0x0000000000000000000000000000000000000000",
            symbol: "ETH",
            precision: 18,
            rate: 200
          },
        ]
      }
    ],
  }
];

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
  getAllMakerList,
}
export { getMakerInfo, getMakerTokenNames, getAllMakerList }