export default {
  // baseUrl: process.env.NODE_ENV === 'production' ? 'https://twy7zbm79a.execute-api.ap-northeast-1.amazonaws.com' : '/send',
  baseUrl: 'https://XXX',
  credential: false,
  localProvider: {
    '1': 'https://mainnet.infura.io/v3/XXX',
    '2': 'https://arb-mainnet.g.alchemy.com/v2/XXX',
    '5': 'https://rinkeby.infura.io/v3/XXX', // rinkeby
    '22': 'https://arb-rinkeby.g.alchemy.com/v2/XXX',
  },
  localWSProvider: {
    '1': 'wss://mainnet.infura.io/v3/XXX',
    '2': 'wss://arb-mainnet.g.alchemy.com/v2/XXX',
    '5': 'wss://rinkeby.infura.io/v3/XXX', // rinkeby
    '22': 'wss://arb-rinkeby.g.alchemy.com/v2/XXX',
  },
  supportLocalNetWorksIDs: ['1', '2', '3', '5', '22', '33'],
  supportNetWorks: {
    MainNet: '1',
    Rinkeby: '4',
    ArbitrumTest: '421611',
    Arbitrum: '42161',
  },
  localChainID_netChainID: {
    '1': '1', // mainnet
    '2': '42161', // Arbitrum
    '3': '1', // zk
    '5': '4', // rinkeby
    '22': '421611', // arbitrum test
    '33': '4', // zktest
  },
  txExploreUrl: {
    '1': 'https://etherscan.io/tx/', // /tx/  /address/
    '5': 'https://rinkeby.etherscan.io/tx/', // /tx/  /address/
    '2': 'https://arbiscan.io/tx/', // /tx/  /address/
    '22': 'https://rinkeby-explorer.arbitrum.io/tx/',
    '3': 'https://zkscan.io/explorer/transactions/',
    '33': 'https://rinkeby.zkscan.io/explorer/transactions/', // /explorer/transactions/   /explorer/accounts/
  },
  accountExploreUrl: {
    '1': 'https://etherscan.io/address/', // /tx/  /address/
    '5': 'https://rinkeby.etherscan.io/address/', // /tx/  /address/
    '2': 'https://arbiscan.io/address/', // /tx/  /address/
    '22': 'https://rinkeby-explorer.arbitrum.io/address/',
    '3': 'https://zkscan.io/explorer/accounts/',
    '33': 'https://rinkeby.zkscan.io/explorer/accounts/', // /explorer/transactions/   /explorer/accounts/
  },
}
