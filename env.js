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
  dTokenAddresses: {
    DToken: {
      5: '0xA78Eb19720C6043B118FfBf48Ee5CCb019983e60', // Rinkeby
      22: '0xF2164c10FA18A5e1795410871374BF7b34Fdc268', // ARB(Rinkeby)
      77: '0x76D7d615fAa7A37fB0123f7C8724534e1D387c42', // OP(Kovan)
    },
    USDC: {
      5: '0xd74194556F75ca0858B706bCaDa3796F0f7C4004', // Rinkeby
      22: '0xB4a97034E9e0af01Dc16aF07cfd98eD620e30836', // ARB(Rinkeby)
    },
  },
}
