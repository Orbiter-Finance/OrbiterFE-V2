export default {
  // baseUrl: process.env.NODE_ENV === 'production' ? 'https://twy7zbm79a.execute-api.ap-northeast-1.amazonaws.com' : '/send',
  baseUrl: 'http://ec2-35-73-220-137.ap-northeast-1.compute.amazonaws.com',
  // baseUrl: 'http://127.0.0.1',
  credential: false,
  localProvider: {
    5: 'VUE_APP_HP_G', //Goerli
    22: 'VUE_APP_HP_AR_G',// Arbitrum Goerli
  },
  localWSProvider: {
    5: 'VUE_APP_WP_G', //Goerli
    22: 'VUE_APP_WP_AR_G', // Arbitrum Goerli
  },

  supportLocalNetWorksIDs: [
    '1',
    '2',
    '3',
    '5',
    '6',
    '7',
    '22',
    '33',
    '66',
    '77',
  ],
  localChainID_netChainID: {
    1: '1', // mainnet
    2: '42161', // Arbitrum
    3: '1', // zk
    4: '1', // starknet  
    5: '5', // Goerli
    6: '137', // polygon
    7: '10', // optimism
    22: '421613', // Arbitrum(G)
    33: '4', // zktest
    44: '4', // starknet(R)
    66: '80001', // polygon(R)
    77: '69', // optimism(K)
  },
  localChainMap: {
    Mainnet: 1,
    Arbitrum: 2,
    ZkSync: 3,
    Polygon: 6,
    Optimism: 7,
    Goerli: 5,
    'Arbitrum(G)': 22,
    'ZkSync(R)': 33,
    'Polygon(R)': 66,
    'Optimism(K)': 77,
  },
  txExploreUrl: {
    1: 'https://etherscan.io/tx/', // /tx/  /address/
    5: 'https://goerli.etherscan.io/tx/', // /tx/  /address/
    2: 'https://arbiscan.io/tx/', // /tx/  /address/
    22: 'https://goerli-rollup-explorer.arbitrum.io/tx/',
    3: 'https://zkscan.io/explorer/transactions/',
    33: 'https://rinkeby.zkscan.io/explorer/transactions/', // /explorer/transactions/   /explorer/accounts/
    6: 'https://polygonscan.com/tx/',
    66: 'https://mumbai.polygonscan.com/tx/',
    7: 'https://optimistic.etherscan.io/tx/',
    77: 'https://kovan-optimistic.etherscan.io/tx/',
  },
  accountExploreUrl: {
    1: 'https://etherscan.io/address/', // /tx/  /address/
    5: 'https://goerli.etherscan.io/address/', // /tx/  /address/
    2: 'https://arbiscan.io/address/', // /tx/  /address/
    22: 'https://goerli-rollup-explorer.arbitrum.io/address/',
    3: 'https://zkscan.io/explorer/accounts/',
    33: 'https://rinkeby.zkscan.io/explorer/accounts/', // /explorer/transactions/   /explorer/accounts/
    6: 'https://polygonscan.com/address/',
    66: 'https://mumbai.polygonscan.com/address/',
    7: 'https://optimistic.etherscan.io/address/',
    77: 'https://kovan-optimistic.etherscan.io/address/',
  },
  dTokenAddress: {
    DAI: {
      5: "0xE326693B9E7660CE4F3d1946801B91513404eDbC",
      22: "0x179ac6e2513B0B78BE36941E0eEC8f0E58b1A2Cf"
    },
    USDC: {
      5: "0x2f845eA71752FF80963a99D16a0966B073704d63",
      22: "0x68388C0D8c9C197015f4f6FCd7e0ff4e48b36839"
    },
  },
  destAddress: {
    DAI: {
      5: "0xb1e19241A5b7fF57d66e2fd57a02d8c10F92b452",
      22: "0xC7Ea534F4831f2D96Ee59770cA3Bf4681890E4EF"
    },
    USDC: {
      5: "0x04bD524550c18cFcdf5F6d2b98675ADFfCC7dcA2",
      22: "0xA4C60a10553B70267c6E9Deeb8231cA5d2D91280"
    }
  },
  sourceAddress: {
    DAI: {
      5: "0xeF301C3a142A0a20310b1bf98e9b9af5e56f52F1",
      22: "0x42cbE44636aEb019402Eae2808131a5E858E8636"
    },
    USDC: {
      5: "0x92972D81E4875a3FC76Dd8D7A1dEDa4371AC53b4",
      22: "0x0a21C890958562419d665A69eD991CE894706eC8"
    }
  },
  coinAddress: {
    DAI: {
      5: "0x5C221E77624690fff6dd741493D735a17716c26B",
      22: "0x3d9835F9cB196f8A88b0d4F9586C3E427af1Ffe0",
    },
    USDC: {
      5: "0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4",
      22: "0xEA70a40Df1432A1b38b916A51Fb81A4cc805a963"
    }
  }
}
