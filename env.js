import { isL2DataDev } from "./src/util";
import { CHAIN_ID } from "./src/config";

export default {
  // l2BaseUrl: isProd() ? 'https://l2api.orbiter.finance' : 'http://datastation.joeyzhou.xyz',
  l2BaseUrl: isL2DataDev() ? 'http://datastation.joeyzhou.xyz' : 'https://l2api.orbiter.finance',
  metaMaskNetworkId: {
    [CHAIN_ID.starknet]: 1,
    [CHAIN_ID.dydx]: 1,
    [CHAIN_ID.loopring]: 1,
    [CHAIN_ID.zkspace]: 1,
    [CHAIN_ID.imx]: 1,

    [CHAIN_ID.starknet_test]: 5,
    [CHAIN_ID.dydx_test]: 5,
    [CHAIN_ID.loopring_test]: 5,
    [CHAIN_ID.zkspace_test]: 5,
    [CHAIN_ID.imx_test]: 5
  },
  chainIcon: {
    "1": "tokenLogo",
    "42161": "arblogo",
    "421613": "arblogo",
    "137": "pglogo",
    "80001": "pglogo",
    "10": 'oplogo',
    "420": "oplogo",
    "1088": 'metislogo',
    "288": 'bobalogo',
    "324": 'zk2logo',
    "280": 'zk2logo',

    "56": 'opbsclogo',
    "97": 'opbsclogo',
    "204": 'opbsclogo',
    "42170": 'arnavologo',
    "1101": 'pglogo',
    "1442": 'pglogo',
    "534353": 'scrolllogo',
    "167005": 'taikologo',
    "8453": 'baselogo',
    "84531": 'baselogo',

    "59144": 'linealogo',
    "59140": 'linealogo',
    "5000": 'mntlogo',
    "5001": 'mntlogo',
    "5611": 'opbsclogo',
    "11155111": 'tokenLogo',
    "195": 'okblogo',

    "7777777": 'zoralogo',
    "999": 'zoralogo',

    [CHAIN_ID.zksync]: 'zklogo',
    [CHAIN_ID.zksync_test]: 'zklogo',
    [CHAIN_ID.starknet]: 'sknlogo',
    [CHAIN_ID.starknet_test]: 'sknlogo',
    [CHAIN_ID.dydx]: "imxlogo",
    [CHAIN_ID.dydx_test]: 'imxlogo',
    [CHAIN_ID.loopring]: 'loopringlogo',
    [CHAIN_ID.loopring_test]: 'loopringlogo',

    [CHAIN_ID.dydx]: 'dydxlogo',
    [CHAIN_ID.dydx_test]: 'dydxlogo',
    [CHAIN_ID.zkspace]: 'zkspacelogo',
    [CHAIN_ID.zkspace_test]: 'zkspacelogo',
  },
  txExploreUrl: {
    [CHAIN_ID.zksync]: 'https://zkscan.io/explorer/transactions/',
    [CHAIN_ID.zksync_test]: 'https://goerli.zkscan.io/explorer/transactions/',
    [CHAIN_ID.dydx]: 'https://trade.dydx.exchange/',
    [CHAIN_ID.dydx_test]: 'https://trade.stage.dydx.exchange/',
    [CHAIN_ID.zkspace]: 'https://zkspace.info/transaction/',
    [CHAIN_ID.zkspace_test]: 'https://v3-rinkeby.zkswap.info/transaction/'
  },
  accountExploreUrl: {
    [CHAIN_ID.zksync]: 'https://zkscan.io/explorer/accounts/',
    [CHAIN_ID.zksync_test]: 'https://goerli.zkscan.io/explorer/accounts/',
    [CHAIN_ID.starknet]: 'https://voyager.online/contract/',
    [CHAIN_ID.starknet_test]: 'https://goerli.voyager.online/contract/',
    [CHAIN_ID.imx]: 'https://market.immutable.com/inventory/',
    [CHAIN_ID.imx_test]: 'https://market.ropsten.immutable.com/inventory/',
    [CHAIN_ID.loopring]: 'https://explorer.loopring.io/account/',
    [CHAIN_ID.loopring_test]: 'https://explorer.loopring.io/account/',
    [CHAIN_ID.dydx]: 'https://trade.dydx.exchange/',
    [CHAIN_ID.dydx_test]: 'https://trade.stage.dydx.exchange/',
    [CHAIN_ID.zkspace]: 'https://zkspace.info/account/',
    [CHAIN_ID.zkspace_test]: 'https://v3-rinkeby.zkswap.info/account/'
  },
  gasPriceMap: {
    "1": 100,
    "42161": 1.9,
    [CHAIN_ID.zksync]: 100,
    [CHAIN_ID.starknet]: 100,
    "137": 60,
    "10": 0.001,
    [CHAIN_ID.imx]: 1.7,
    [CHAIN_ID.loopring]: 100
  },
  gasLimitMap: {
    "1": 35000,
    "42161": 810000,
    [CHAIN_ID.zksync]: 100,
    [CHAIN_ID.starknet]: 35000,
    "137": 1500,
    "10": 21000,
    [CHAIN_ID.imx]: 51000,
    [CHAIN_ID.loopring]: 75000,
    [CHAIN_ID.dydx]: 100000,
    [CHAIN_ID.zkspace]: 646496,
    "324": 10560,
    "56": 150000,
    "42170": 150000,
    "1101": 300000
  }
};
