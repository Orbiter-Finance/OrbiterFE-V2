export default {
  etherscan: {
    key: process.env.VUE_APP_ETH_KEY,
    Mainnet: 'https://api.etherscan.io/api',
    Rinkeby: 'https://api-rinkeby.etherscan.io/api',
    chainID: '1',
  },
  zkSync: {
    Mainnet: 'https://api.zksync.io/api/v0.2',
    Rinkeby: 'https://rinkeby-api.zksync.io/api/v0.2',
    chainID: '3',
    rinkeyChainID: '33',
  },
  starknet: {
    Mainnet: 'https://voyager.online/api',
    Rinkeby: 'https://goerli.voyager.online/api',
    chainID: '4',
    rinkeyChainID: '44',
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
    Rinkeby: 'https://api-kovan-optimistic.etherscan.io/api',
    chainID: '7',
    rinkeyChainID: '77',
  },
  loopring: {
    Mainnet: 'https://api3.loopring.io',
    Rinkeby: 'https://uat2.loopring.io',
    chainID: '9',
    rinkeyChainID: '99',
  },
  L1: {
    Mainnet:
      'https://eth-mainnet.alchemyapi.io/v2/7Y6To95k4MT7oZPTc8oUe0HKK4j0M8Yf',
  },
}
