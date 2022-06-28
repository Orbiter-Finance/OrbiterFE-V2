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
    10: process.env.VUE_APP_HP_MT,
    510: process.env.VUE_APP_HP_MT_R,
    13: process.env.VUE_APP_HP_BOBA,
    513: process.env.VUE_APP_HP_BOBA_R,
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
    10: process.env.VUE_APP_WP_MT,
    510: process.env.VUE_APP_WP_MT_R,
    13: process.env.VUE_APP_WP_BOBA,
    513: process.env.VUE_APP_WP_BOBA_R,
  },
  supportLocalNetWorksIDs: [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '22',
    '33',
    '44',
    '66',
    '77',
    '88',
    '99',
    '510',
    '511',
    '512',
    '513',
  ],
  localChainID_netChainID: {
    1: '1', // mainnet
    2: '42161', // Arbitrum
    3: '1', // zk
    4: '1', // starknet
    5: '4', // rinkeby
    6: '137', // polygon
    7: '10', // optimism
    8: '1', // mainnet
    9: '1', // loopring
    10: '1088', //metis
    11: '1', // dydx
    12: '1', // zkspace
    13: '288', // boba mainnet
    22: '421611', // arbitrum test
    33: '4', // zktest
    44: '5', // starknet(R)
    66: '80001', // polygon(R)
    77: '69', // optimism(K)
    88: '3', // ropsten
    99: '5', // loopring(G)
    510: '588', //metis test
    511: '3', // dydx(R)
    512: '4', // zkspace(R)s
    513: '28', // boba rinkeby
  },
  crossAddressContracts: {
    1: '0xD9D74a29307cc6Fc8BF424ee4217f1A587FBc8Dc',
    2: '0xD9D74a29307cc6Fc8BF424ee4217f1A587FBc8Dc',
    3: '',
    4: '',
    5: '0x783703C20dF627893952d59DF40f556A172d1719',
    6: '0xD9D74a29307cc6Fc8BF424ee4217f1A587FBc8Dc',
    7: '0xD9D74a29307cc6Fc8BF424ee4217f1A587FBc8Dc',
    8: '',
    9: '',
    22: '0x721fBB2C2C9cdFa5547feE6b683949c20F175457',
    33: '',
    44: '',
    66: '0x40eC19690ebEd534e9b9C58e341727028cF143c0',
    77: '0x2200a79aDdFE2EFd7bDe34300f4C8FE902E31d39',
    88: '',
    99: '',
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
    8: 'https://immutascan.io/tx/',
    88: '', // ImmutableX don't have testnet browser
    9: 'https://explorer.loopring.io/tx/',
    99: 'https://explorer.loopring.io/tx/',
    10: 'https://andromeda-explorer.metis.io/tx/',
    510: 'https://stardust-explorer.metis.io/tx/',
    11: 'https://trade.dydx.exchange/',
    511: 'https://trade.stage.dydx.exchange/',
    12: 'https://zkspace.info/transaction/',
    512: 'https://v3-rinkeby.zkswap.info/transaction/',
    13: 'https://blockexplorer.boba.network/tx/',
    513: 'https://blockexplorer.rinkeby.boba.network/tx/',
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
    8: 'https://market.immutable.com/inventory/',
    88: 'https://market.ropsten.immutable.com/inventory/',
    9: 'https://explorer.loopring.io/account/',
    99: 'https://explorer.loopring.io/account/',
    10: 'https://andromeda-explorer.metis.io/address/',
    510: 'https://stardust-explorer.metis.io/address/',
    11: 'https://trade.dydx.exchange/',
    511: 'https://trade.stage.dydx.exchange/',
    12: 'https://zkspace.info/account/',
    512: 'https://v3-rinkeby.zkswap.info/account/',
    13: 'https://blockexplorer.boba.network/address/',
    513: 'https://blockexplorer.rinkeby.boba.network/address/',
  },
}
