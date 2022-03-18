export default {
  // baseUrl: process.env.NODE_ENV === 'production' ? 'https://twy7zbm79a.execute-api.ap-northeast-1.amazonaws.com' : '/send',
  baseUrl: 'https://twy7zbm79a.execute-api.ap-northeast-1.amazonaws.com',
  credential: false,
  localProvider: {
    1: process.env.VUE_APP_HP,
    2: process.env.VUE_APP_HP_AR,
    6: process.env.VUE_APP_HP_PO,
    7: process.env.VUE_APP_HP_OP,
    5: process.env.VUE_APP_HP_R, // rinkeby
    22: process.env.VUE_APP_HP_AR_R,
    66: process.env.VUE_APP_HP_PO_G,
    77: process.env.VUE_APP_HP_OP_K,
  },
  localWSProvider: {
    1: process.env.VUE_APP_WP,
    2: process.env.VUE_APP_WP_AR,
    6: process.env.VUE_APP_WP_PO,
    7: process.env.VUE_APP_WP_OP,
    5: process.env.VUE_APP_WP_R, // rinkeby
    22: process.env.VUE_APP_WP_AR_R,
    66: process.env.VUE_APP_WP_PO_G,
    77: process.env.VUE_APP_WP_OP_K,
  },
  supportLocalNetWorksIDs: [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '9',
    '22',
    '33',
    '44',
    '66',
    '77',
    '99',
  ],
  localChainID_netChainID: {
    1: '1', // mainnet
    2: '42161', // Arbitrum
    3: '1', // zk
    4: '1', // starknet
    5: '4', // rinkeby
    6: '137', // polygon
    7: '10', // optimism
    9: '1', // loopring
    22: '421611', // arbitrum test
    33: '4', // zktest
    44: '5', // starknet(R)
    66: '80001', // polygon(R)
    77: '69', // optimism(K)
    99: '5', // loopring(G)
  },
  txExploreUrl: {
    1: 'https://etherscan.io/tx/', // /tx/  /address/
    5: 'https://rinkeby.etherscan.io/tx/', // /tx/  /address/
    2: 'https://arbiscan.io/tx/', // /tx/  /address/
    22: 'https://testnet.arbiscan.io/tx/',
    3: 'https://zkscan.io/explorer/transactions/',
    33: 'https://rinkeby.zkscan.io/explorer/transactions/', // /explorer/transactions/   /explorer/accounts/
    4: 'https://voyager.online/tx/',
    44: 'https://goerli.voyager.online/tx/',
    6: 'https://polygonscan.com/tx/',
    66: 'https://mumbai.polygonscan.com/tx/',
    7: 'https://optimistic.etherscan.io/tx/',
    77: 'https://kovan-optimistic.etherscan.io/tx/',
    9: 'https://explorer.loopring.io/tx/',
    99: 'https://explorer.loopring.io/tx/',
  },
  accountExploreUrl: {
    1: 'https://etherscan.io/address/', // /tx/  /address/
    5: 'https://rinkeby.etherscan.io/address/', // /tx/  /address/
    2: 'https://arbiscan.io/address/', // /tx/  /address/
    22: 'https://testnet.arbiscan.io/address/',
    3: 'https://zkscan.io/explorer/accounts/',
    33: 'https://rinkeby.zkscan.io/explorer/accounts/', // /explorer/transactions/   /explorer/accounts/
    4: 'https://voyager.online/contract/',
    44: 'https://goerli.voyager.online/contract/',
    6: 'https://polygonscan.com/address/',
    66: 'https://mumbai.polygonscan.com/address/',
    7: 'https://optimistic.etherscan.io/address/',
    77: 'https://kovan-optimistic.etherscan.io/address/',
    9: 'https://explorer.loopring.io/account/',
    99: 'https://explorer.loopring.io/account/',
  },
}
