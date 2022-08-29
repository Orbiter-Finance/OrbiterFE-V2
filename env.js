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
      5: "0x6533D3216141e22F3FA3A099C69bb3cE32EAD6A2",
      22: "0xb453474C5564e7c6726A9A62360f2376C4e17167",
    },
    USDC: {
      5: "0x91594B33f8b0a754134fdEa226668F7d31499F7E",
      22: "0x1e309413155fE73774da34f3a3ea39420B0C23a8",
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
      5: "0xe7CC85a5C44C8C0DA6f8F68E32D72D8c08D4C9Ff",
      22: "0x626Fc17425C04Bd81114202C9Ab99A18eb32E5C0",
    },
    USDC: {
      5: "0xD5C4E922b772e7b1BE4b897DdFab3916b919EFe7",
      22: "0x95ae2d444e4e0709f96C198A3230290246bE9593",
    }
  },
  sourceAddress: {
    DAI: {
      5: "0x93e195eF221dAE453bbd27416eDcc295A3D9F1f5",
      22: "0x67390F07DD8a8dC1378dee7f803F1793524aD489",
    },
    USDC: {
      5: "0x8d2ef1178302b3726346af942DCAa3C2Ab360950",
      22: "0x69F6C13eCFf269dD0AA8d796F14C16A72286f75F",
    }
  },
  coinAddress: {
    DAI: {
      5: "0x6e7354859fdE9d44D25b57bC5b9907700cC19b27",
      22: "0xacb4C7A74F812926860eB672B84300e79506e511",
    },
    USDC: {
      5: "0x92cf3C6F4AE73eA46eF79DAc8791b63C4006860A",
      22: "0xA454aBB804FCf39b829804023e8109CB11C731D7",
    }
  }
}
