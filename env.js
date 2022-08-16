export default {
  // baseUrl: process.env.NODE_ENV === 'production' ? 'https://twy7zbm79a.execute-api.ap-northeast-1.amazonaws.com' : '/send',
  baseUrl: 'https://twy7zbm79a.execute-api.ap-northeast-1.amazonaws.com',
  credential: false,
  localProvider: {
    5: 'VUE_APP_HP_R', // rinkeby
    77: 'VUE_APP_HPOP_K',
    22: 'VUE_APP_HPAR_R',
  },
  localWSProvider: {
    5: 'VUE_APP_WP_R', // rinkeby
    22: 'VUE_APP_WP_AR',
    77: 'VUE_APP_WP_OPK',
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
    5: '4', // rinkeby
    6: '137', // polygon
    7: '10', // optimism
    22: '421611', // arbitrum test
    33: '4', // zktest
    44: '4', // starknet(R)
    66: '80001', // polygon(R)
    77: '69', // optimism(K)
  },
  txExploreUrl: {
    1: 'https://etherscan.io/tx/', // /tx/  /address/
    5: 'https://rinkeby.etherscan.io/tx/', // /tx/  /address/
    2: 'https://arbiscan.io/tx/', // /tx/  /address/
    22: 'https://testnet.arbiscan.io/tx/',
    3: 'https://zkscan.io/explorer/transactions/',
    33: 'https://rinkeby.zkscan.io/explorer/transactions/', // /explorer/transactions/   /explorer/accounts/
    6: 'https://polygonscan.com/tx/',
    66: 'https://mumbai.polygonscan.com/tx/',
    7: 'https://optimistic.etherscan.io/tx/',
    77: 'https://kovan-optimistic.etherscan.io/tx/',
  },
  accountExploreUrl: {
    1: 'https://etherscan.io/address/', // /tx/  /address/
    5: 'https://rinkeby.etherscan.io/address/', // /tx/  /address/
    2: 'https://arbiscan.io/address/', // /tx/  /address/
    22: 'https://testnet.arbiscan.io/address/',
    3: 'https://zkscan.io/explorer/accounts/',
    33: 'https://rinkeby.zkscan.io/explorer/accounts/', // /explorer/transactions/   /explorer/accounts/
    6: 'https://polygonscan.com/address/',
    66: 'https://mumbai.polygonscan.com/address/',
    7: 'https://optimistic.etherscan.io/address/',
    77: 'https://kovan-optimistic.etherscan.io/address/',
  },
  dTokenAddress: {
    DAI: {
      5: '0x05ffa6120c15C652B80c498BA7E1342f4Fc3b54E', // Rinkeby
      22: '0x57d5779232064aa6be5C93cF05FbcaD748CbCf61', // ARB(Rinkeby)
    },
    USDC: {
      5: '0x48D3C937A4F8a1a855C45A8F75da3e8d972b6806', // Rinkeby
      22: '0x6F4E161967EBC4929068A46a5e2ec26272666B0D', // ARB(Rinkeby)
    },
  },
  pTokenAddresses: {
    DAI: {
      5: '0x18e37c92209Bee092913Df4984f4386e192e0B85', // Rinkeby
      22: '0xA30e0a3dA901E0cCd398a0c7DDA39051E6539F0b', // ARB(Rinkeby)
    },
    USDC: {
      5: '0x556E72Cb9848Ec87a9C8D43aA0071CD657A86292', // Rinkeby
      22: '0x5A963a3a1B337FEa6E7Fe343BeCc066CEBd6b8bE', // ARB(Rinkeby)
    },
  },
  destAddress: {
    DAI: {
      5: '0x8A769e4E9AE68310971C6875c86F4DE8f66BD65A', // Rinkeby
      22: '0x7Efc576D720f98ea43f3c401E8702bBAd2323516', // ARB(Rinkeby)
    },
    USDC: {
      5: "0xCc039Bd084Ec795F2C5cC0846832fF88D86B5248",
      22: "0x55abd4a2840e97f6124A9D05889FCB0c8BAB311f",
    }
  },
  sourceAddress: {
    DAI: {
      5: '0xA7cfafB26aE43bC673da38de02Bf236CB6a6b9B8', // Rinkeby
      22: '0x0f61f0E8C62cd944561244764c34B5576412152E', // ARB(Rinkeby)
    },
    USDC: {
      5: '0x2786516cf1382375EcCCb2C98b613D88bdc7AC3A',
      22: '0xf36b073Aa1C2088Cc77Fc4Aa951cd45795eBac06',
    }
  }
}
