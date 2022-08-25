export default {
  // baseUrl: process.env.NODE_ENV === 'production' ? 'https://twy7zbm79a.execute-api.ap-northeast-1.amazonaws.com' : '/send',
  baseUrl: 'https://twy7zbm79a.execute-api.ap-northeast-1.amazonaws.com',
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
    // 5: 'https://rinkeby.etherscan.io/tx/', // /tx/  /address/
    2: 'https://arbiscan.io/tx/', // /tx/  /address/
    // 22: 'https://testnet.arbiscan.io/tx/',
    3: 'https://zkscan.io/explorer/transactions/',
    33: 'https://rinkeby.zkscan.io/explorer/transactions/', // /explorer/transactions/   /explorer/accounts/
    6: 'https://polygonscan.com/tx/',
    66: 'https://mumbai.polygonscan.com/tx/',
    7: 'https://optimistic.etherscan.io/tx/',
    77: 'https://kovan-optimistic.etherscan.io/tx/',
  },
  accountExploreUrl: {
    1: 'https://etherscan.io/address/', // /tx/  /address/
    // 5: 'https://rinkeby.etherscan.io/address/', // /tx/  /address/
    2: 'https://arbiscan.io/address/', // /tx/  /address/
    // 22: 'https://testnet.arbiscan.io/address/',
    3: 'https://zkscan.io/explorer/accounts/',
    33: 'https://rinkeby.zkscan.io/explorer/accounts/', // /explorer/transactions/   /explorer/accounts/
    6: 'https://polygonscan.com/address/',
    66: 'https://mumbai.polygonscan.com/address/',
    7: 'https://optimistic.etherscan.io/address/',
    77: 'https://kovan-optimistic.etherscan.io/address/',
  },
  dTokenAddress: {
    DAI: {
      5: '0x75B007E0e6d304Cd4e31D8b1bfD58Edc921C0018',
      22: '0xdFE4feEd3508F4a281CDb807CDb3317bA3bC5235',
    },
    USDC: {
      5: '0x3e361f254cD234D835Db4c79544f38BEa639dAC9',
      22: '0x3A94a03fbfeB92A90EaEEBDB55daD5A684e2A6Ee',
    },
  },
  // pTokenAddress: {
  //   DAI: {
  //     5: '0xE2C1ad36Abbf0C356a28f261b04E1a716A7D2b51', // Rinkeby
  //     22: '0xf3da8481909265aef431627d43CD83d3C1800CF2', // ARB(Rinkeby)
  //   },
  //   USDC: {
  //     5: '0x556E72Cb9848Ec87a9C8D43aA0071CD657A86292', // Rinkeby
  //     22: '0x5A963a3a1B337FEa6E7Fe343BeCc066CEBd6b8bE', // ARB(Rinkeby)
  //   },
  // },
  destAddress: {
    DAI: {
      5: "0xCA7384815D65bDf058382330B3e3848553597980",
      22: "0xD72e2Da199292d0B59D6962caFEb58ca02d48539",
    },
    USDC: {
      5: "0x0AAa10cADf56516b2a01F92fAedEd4a521FB8c7a",
      22: "0xcB14C635c3743Bf10f69c344897D2E0cD165f92d",
    }
  },
  sourceAddress: {
    DAI: {
      5: "0x912a53c752842Cf807E6dd802b19C386fa361bDB",
      22: "0x0caAE6dfA4A8e57008153Bd41343b04dD8884E92",
    },
    USDC: {
      5: "0x778c52C307F20039E4C23d97EaD68741d125E577",
      22: "0x4ad11Dc8f9d822d86f2Fda61FDd7CC172c9c0E2b",
    }
  },
  coinAddress: {
    DAI: {
      5: "0x2736CBF3979C049b049BD9f6C8C8FE18E7427dE2",
      22: "0x296042c0Fe5172D5a702dfE258Fb8a30ce2E4d86",
    },
    USDC: {
      5: "0x9452B0c7cA6B41Ee528631e371b799b222CaC7c2",
      22: "0x20B10C6d32304629cca857e1d5800ED49Dcee72b",
    }
  }
}
