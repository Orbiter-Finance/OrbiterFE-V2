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
  },
  zkSync: {
    Mainnet: 'https://api.zksync.io/api/v0.2',
    TestNet: 'https://goerli-api.zksync.io/api/v0.2',
  },
  starknet: {
    Mainnet: 'https://voyager.online/api',
    Rinkeby: 'https://goerli.voyager.online/api',
  },
  metis: {
    Mainnet: 'https://andromeda-explorer.metis.io/api',
    Rinkeby: 'https://stardust-explorer.metis.io/api',
  },
  arbitrum: {
    Mainnet: 'https://api.arbiscan.io/api',
    Rinkeby: 'https://api-testnet.arbiscan.io/api',
  },
  polygon: {
    key: process.env.VUE_APP_PO_KEY,
    Mainnet: 'https://api.polygonscan.com/api',
    Rinkeby: 'https://api-testnet.polygonscan.com/api',
  },
  optimistic: {
    key: process.env.VUE_APP_OP_KEY,
    Mainnet: 'https://api-optimistic.etherscan.io/api',
    Rinkeby: 'https://api-goerli-optimistic.etherscan.io/api',
  },
  loopring: {
    Mainnet: 'https://api3.loopring.io',
    Rinkeby: 'https://uat2.loopring.io',
  },
  immutableX: {
    Mainnet: 'https://api.x.immutable.com/v1',
    Rinkeby: 'https://api.sandbox.x.immutable.com/v1',
  },
  dydx: {
    Mainnet: 'https://api.dydx.exchange',
    Rinkeby: 'https://api.stage.dydx.exchange',
  },
  ZKSpace: {
    Mainnet: 'https://api.zks.app/v3/1',
    Rinkeby: 'https://api.zks.app/v3/5'
  },
  boba: {
    Mainnet: 'https://api.bobascan.com/api',
    Rinkeby: 'https://api-testnet.bobascan.com/api'
  },
  zkSync2: {
    Mainnet: 'https://zksync2.zkscan.io/api',
    Rinkeby: 'https://zksync2-testnet.zkscan.io/api'
  },
  L1: {
    Mainnet:
      'https://eth-mainnet.alchemyapi.io/v2/7Y6To95k4MT7oZPTc8oUe0HKK4j0M8Yf',
  },
  bsc: {
    Mainnet: 'https://api.bscscan.com/',
    Rinkeby: 'https://api-testnet.bscscan.com/'
  },
  arbitrum_nova: {
    Mainnet: 'https://nova-explorer.arbitrum.io/api',
    Rinkeby: 'https://goerli-rollup-explorer.arbitrum.io/api'
  },
  scroll_l1: {
    Rinkeby: 'https://l1scan.scroll.io/api'
  },
  scroll_l2: {
    Rinkeby: 'https://l2scan.scroll.io/api'
  },
}
