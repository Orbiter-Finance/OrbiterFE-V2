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
      5: '0x5D649b98B8D678441D3AcC9A82a6a8757120FA95', // Rinkeby
      22: '0x92D4E2df09d38D2f805Bac3031ce2c756d1B6290', // ARB(Rinkeby)
    },
    USDC: {
      5: '0x48D3C937A4F8a1a855C45A8F75da3e8d972b6806', // Rinkeby
      22: '0x6F4E161967EBC4929068A46a5e2ec26272666B0D', // ARB(Rinkeby)
    },
  },
  pTokenAddress: {
    DAI: {
      5: '0xE2C1ad36Abbf0C356a28f261b04E1a716A7D2b51', // Rinkeby
      22: '0xf3da8481909265aef431627d43CD83d3C1800CF2', // ARB(Rinkeby)
    },
    USDC: {
      5: '0x556E72Cb9848Ec87a9C8D43aA0071CD657A86292', // Rinkeby
      22: '0x5A963a3a1B337FEa6E7Fe343BeCc066CEBd6b8bE', // ARB(Rinkeby)
    },
  },
  destAddress: {
    DAI: {
      5: "0x35ee29870FAb05E64844614137a3563Ae0b514b5",
      22: "0xcC29953339348eF921D545cE554aA5A78A5403C3",
    },
    USDC: {
      5: "0xCc039Bd084Ec795F2C5cC0846832fF88D86B5248",
      22: "0x55abd4a2840e97f6124A9D05889FCB0c8BAB311f",
    }
  },
  sourceAddress: {
    DAI: {
      5: "0xF801518555C9C222C14bAbeF3eB4275f9D6B1b5d",
      22: "0xeD431a02DA21c6a33Df6560997c11Afd620f46a3",
    },
    USDC: {
      5: '0x2786516cf1382375EcCCb2C98b613D88bdc7AC3A',
      22: '0xf36b073Aa1C2088Cc77Fc4Aa951cd45795eBac06',
    }
  }
}
