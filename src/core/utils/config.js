/*
 * @Description:
 * @Author: Eric
 * @Date: 2022-07-25 17:53:45
 * @LastEditors: Eric
 * @LastEditTime: 2022-08-15 17:24:22
 */
export default {
  etherscan: {
    key: process.env.VUE_APP_ETH_KEY,
    Mainnet: 'https://api.etherscan.io/api',
    Rinkeby: 'https://api-goerli.etherscan.io/api',
    TestNet: 'https://api-goerli.etherscan.io/api',
    chainID: '1',
  },
  zkSync: {
    Mainnet: 'https://api.zksync.io/api/v0.2',
    TestNet: 'https://goerli-api.zksync.io/api/v0.2',
    chainID: '3',
    rinkeyChainID: '33',
  },
  starknet: {
    Mainnet: 'https://voyager.online/api',
    Rinkeby: 'https://goerli.voyager.online/api',
    chainID: '4',
    rinkeyChainID: '44',
  },
  metis: {
    Mainnet: 'https://andromeda-explorer.metis.io/api',
    Rinkeby: 'https://stardust-explorer.metis.io/api',
    chainID: '10',
    rinkeyChainID: '510',
  },
  arbitrum: {
    Mainnet: 'https://api.arbiscan.io/api',
    Rinkeby: 'https://api-testnet.arbiscan.io/api',
    chainID: '2',
    rinkeyChainID: '22',
  },
  polygon: {
    key: process.env.VUE_APP_PO_KEY,
    Mainnet: 'https://api.polygonscan.com/api',
    Rinkeby: 'https://api-testnet.polygonscan.com/api',
    chainID: '6',
    rinkeyChainID: '66',
  },
  optimistic: {
    key: process.env.VUE_APP_OP_KEY,
    Mainnet: 'https://api-optimistic.etherscan.io/api',
    Rinkeby: 'https://api-goerli-optimistic.etherscan.io/api',
    chainID: '7',
    rinkeyChainID: '77',
  },
  loopring: {
    Mainnet: 'https://api3.loopring.io',
    Rinkeby: 'https://uat2.loopring.io',
    chainID: '9',
    rinkeyChainID: '99',
  },
  immutableX: {
    Mainnet: 'https://api.x.immutable.com/v1',
    Rinkeby: 'https://api.sandbox.x.immutable.com/v1',
    chainID: '8',
    rinkeyChainID: '88',
  },
  dydx: {
    Mainnet: 'https://api.dydx.exchange',
    Rinkeby: 'https://api.stage.dydx.exchange',
    chainID: '11',
    rinkeyChainID: '511',
  },
  ZKSpace: {
    Mainnet: 'https://api.zks.app/v3/1',
    Rinkeby: 'https://api.zks.app/v3/5',
    chainID: '12',
    rinkeyChainID: '512',
    zksChainID: 13,
    zksrinkebyChainID: 129,
  },
  boba: {
    Mainnet: 'https://api.bobascan.com/api',
    Rinkeby: 'https://api-testnet.bobascan.com/api',
    chainID: '13',
    rinkeyChainID: '513',
  },
  zkSync2: {
    Mainnet: 'https://zksync2.zkscan.io/api',
    Rinkeby: 'https://zksync2-testnet.zkscan.io/api',
    chainID: '14',
    rinkeyChainID: '514',
  },
  L1: {
    Mainnet:
      'https://eth-mainnet.alchemyapi.io/v2/7Y6To95k4MT7oZPTc8oUe0HKK4j0M8Yf',
  },
  bsc: {
    Mainnet: 'https://api.bscscan.com/',
    Rinkeby: 'https://api-testnet.bscscan.com/',
    chainId: '56',
    rinkeyChainID: '97',
  },
  arbitrum_nova: {
    Mainnet: 'https://nova-explorer.arbitrum.io/api',
    Rinkeby: 'https://goerli-rollup-explorer.arbitrum.io/api',
    chainId: '16',
    rinkeyChainID: '516',
  },
  scroll_l1: {
    Rinkeby: 'https://l1scan.scroll.io/api',
    chainId: '534351',
    rinkeyChainID: '518',
  },
  scroll_l2: {
    Rinkeby: 'https://l2scan.scroll.io/api',
    chainId: '534354',
    rinkeyChainID: '519',
  },
}
