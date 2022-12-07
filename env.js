const baseUrl = `https://twy7zbm79a.execute-api.ap-northeast-1.amazonaws.com`
const baseDomain = `https://api.orbiter.finance`
export const netStateUrl = `${baseDomain}`
export default {
  // baseUrl: process.env.NODE_ENV === 'production' ? 'https://twy7zbm79a.execute-api.ap-northeast-1.amazonaws.com' : '/send',
  baseUrl,
  baseTraddingUrl: `${baseDomain}/api`,
  credential: false,
  localProvider: {
    1: process.env.VUE_APP_HP,
    2: process.env.VUE_APP_HP_AR,
    6: process.env.VUE_APP_HP_PO,
    7: process.env.VUE_APP_HP_OP,
    5: process.env.VUE_APP_HP_R, // rinkeby
    22: process.env.VUE_APP_HP_AR_R,
    66: process.env.VUE_APP_HP_PO_G,
    77: 'https://goerli.optimism.io',
    10: process.env.VUE_APP_HP_MT,
    510: process.env.VUE_APP_HP_MT_R,
    13: process.env.VUE_APP_HP_BOBA,
    513: process.env.VUE_APP_HP_BOBA_R,
    514: 'https://zksync2-testnet.zksync.dev',
    515: process.env.VUE_APP_HP_BSC_R,
    15: process.env.VUE_APP_HP_BSC,
    16: 'https://nova.arbitrum.io/rpc',
    516: 'https://goerli-rollup.arbitrum.io/rpc',
    517: 'https://public.zkevm-test.net:2083',
    518: 'https://prealpha.scroll.io/l1',
    519: 'https://prealpha.scroll.io/l2',
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
    514: 'wss://zksync2-testnet.zksync.dev/ws',
    16: 'https://nova.arbitrum.io/rpc',
    516: 'https://goerli-rollup.arbitrum.io/rpc',
    517: 'https://public.zkevm-test.net:2083',
    518: 'https://prealpha.scroll.io/l1',
    519: 'https://prealpha.scroll.io/l2',
  },
  publicRPC: {
    1: ["https://eth-mainnet.public.blastapi.io",'https://api.mycryptoapi.com/eth',"https://api.securerpc.com/v1",process.env.VUE_APP_HP],
    2: ['https://arb1.arbitrum.io/rpc',"https://1rpc.io/arb", process.env.VUE_APP_HP_AR],
    6: ["https://polygon-rpc.com/", 'https://poly-rpc.gateway.pokt.network', process.env.VUE_APP_HP_PO],
    7: ['https://mainnet.optimism.io', process.env.VUE_APP_HP_OP],
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
    '14',
    '15',
    '16',
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
    '514',
    '515',
    '516',
    '517',
    '518',
    '519',
  ],
  localChainID_netChainID: {
    1: '1', // mainnet
    2: '42161', // Arbitrum
    3: '1', // zk
    4: '1', // starknet
    5: '5', // goerli
    6: '137', // polygon
    7: '10', // optimism
    8: '1', // mainnet
    9: '1', // loopring
    10: '1088', //metis
    11: '1', // dydx
    12: '1', // zkspace
    13: '288', // boba mainnet,
    15: '56', // bsc mainnet,
    22: '421611', // arbitrum test
    33: '5', // zktest
    44: '5', // starknet(R)
    66: '80001', // polygon(R)
    77: '420', // optimism(G)
    88: '3', // ropsten
    99: '5', // loopring(G)
    510: '588', //metis test
    511: '3', // dydx(R)
    512: '4', // zkspace(R)s
    513: '28', // boba rinkeby
    514: '280', //zksync2(G)
    515: '97', // bsc test
    16: '42170', // ar nova
    516: '421613', // ar nova g
    517: '1402',
    518: '534351', // Scroll L1 Testnet
    519: '534354', // Scroll L2 Testnet
  },
  crossAddressContracts: {
    1: '0xD9D74a29307cc6Fc8BF424ee4217f1A587FBc8Dc',
    2: '0xD9D74a29307cc6Fc8BF424ee4217f1A587FBc8Dc',
    3: '',
    4: '',
    5: '0xD9D74a29307cc6Fc8BF424ee4217f1A587FBc8Dc',
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
    515: '',
  },
  txExploreUrl: {
    1: 'https://etherscan.io/tx/', // /tx/  /address/
    5: 'https://goerli.etherscan.io/tx/', // /tx/  /address/
    2: 'https://arbiscan.io/tx/', // /tx/  /address/
    22: 'https://testnet.arbiscan.io/tx/',
    3: 'https://zkscan.io/explorer/transactions/',
    33: 'https://rinkeby.zkscan.io/explorer/transactions/', // /explorer/transactions/   /explorer/accounts/
    4: 'https://starkscan.co/tx/',
    44: 'https://testnet.starkscan.co/tx/',
    6: 'https://polygonscan.com/tx/',
    66: 'https://mumbai.polygonscan.com/tx/',
    7: 'https://optimistic.etherscan.io/tx/',
    77: 'https://blockscout.com/optimism/goerli/tx/',
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
    15: 'https://bscscan.com/tx/',
    515: 'https://testnet.bscscan.com/tx/',
    514: 'https://zksync2-testnet.zkscan.io/tx/',
    16: 'https://nova.arbiscan.io/tx/',
    516: 'https://goerli-rollup-explorer.arbitrum.io/tx/',
    517: 'https://public.zkevm-test.net:8443/tx/',
    518: 'https://l1scan.scroll.io/tx/',
    519: 'https://l2scan.scroll.io/tx/',
  },
  accountExploreUrl: {
    1: 'https://etherscan.io/address/', // /tx/  /address/
    5: 'https://goerli.etherscan.io/address/', // /tx/  /address/
    2: 'https://arbiscan.io/address/', // /tx/  /address/
    22: 'https://testnet.arbiscan.io/address/',
    3: 'https://zkscan.io/explorer/accounts/',
    33: 'https://goerli.zkscan.io/explorer/accounts/', // /explorer/transactions/   /explorer/accounts/
    4: 'https://voyager.online/contract/',
    44: 'https://goerli.voyager.online/contract/',
    6: 'https://polygonscan.com/address/',
    66: 'https://mumbai.polygonscan.com/address/',
    7: 'https://optimistic.etherscan.io/address/',
    77: 'https://blockscout.com/optimism/goerli/address/',
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
    13: 'https://bobascan.com/address/',
    513: 'https://testnet.bobascan.com/address/',
    514: 'https://zksync2-testnet.zkscan.io/address/',
    15: 'https://bscscan.com/address',
    515: 'https://testnet.bscscan.com/address/',
    16: 'https://nova.arbiscan.io/address/',
    516: 'https://goerli-rollup-explorer.arbitrum.io/address/',
    517: 'https://public.zkevm-test.net:8443/address/',
    518: 'https://l1scan.scroll.io/address/',
    519: 'https://l2scan.scroll.io/address/',
  },
}
