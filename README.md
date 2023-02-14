# orbiter
## Project

- The latest version of Orbiter is used vuejs to build
- Orbiter was created to give users a better cross-rollup transaction experience, greatly reducing the economic and time costs of interaction between L1 and L2, such as L1<->L2,L2<->L2.
- As a proof-of-concept project, Orbiter currently supports ERC20 token transactions on mainnet, zkSync, Arbitrum.

## Functional

- Running this project requires setting the necessary parameters, which support each rollup node.

- By configuring the parameters, the project can realize the economic and time savings that users can make by Orbiter when configuring the rollup dynamics. After the user initiates payment through the front-end wallet, it will monitor the transaction data of each rollup in real time and feed back the real-time status of the user's cross-rollup transfer in time.

## Design

**[config](https://github.com/OrbiterCross/orbiterFE-V2/tree/main/src/config)** - Third-party and global configurations of the CSS

**[core](https://github.com/OrbiterCross/orbiterFE-V2/tree/main/src/core)** - Related network processing and interface implementation of the on-rollup.

**[icons](https://github.com/OrbiterCross/orbiterFE-V2/tree/main/src/icons)** - SVG Image Processing & SVG Image resources

**[store](https://github.com/OrbiterCross/orbiterFE-V2/tree/main/src/store)** - vuex data.

**[util](https://github.com/OrbiterCross/orbiterFE-V2/tree/main/src/util)** - Implementation of common methods for each module of the project.

**[views](https://github.com/OrbiterCross/orbiterFE-V2/tree/main/src/views)** - Implement project page.

**[components](https://github.com/OrbiterCross/orbiterFE-V2/tree/main/src/components)** - Implement project components.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Query Params

| Name    | Type    | Required | Desc                                                                                                                                                                                                                               |
| ------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| referer | String  | False    | values: <br/>`zksync`                                                                                                                                                                                                              |
| source  | String  | False    | From chain, values: <br/>`Mainnet` <br/>`Arbitrum` <br/>`ZkSync` <br/>`Polygon` <br/><br/>Testnet values: <br/>`Rinkeby` <br/>`Arbitrum(R)` <br/>`ZkSync(R)` <br/>`Polygon(R)` <br/><br/> When it's empty, use sources first item. |
| dest    | String  | False    | To chain, values: (Same as source)                                                                                                                                                                                                 |
| sources | String  | False    | From chains, example: `Mainnet,Arbitrum,ZkSync`. When it's empty, show all chain.                                                                                                                                                  |
| dests   | String  | False    | To chains, example: `ZkSync,Polygon`. When it's empty, show all chain (filter source/from chain).                                                                                                                                  |
| token   | String  | False    | Transfer currency, values: <br/>`ETH` <br/>`USDC`. When it's empty, use tokens first item.                                                                                                                                         |
| tokens  | String  | False    | Transfer currencys, example: `ETH,USDC`. When it's empty, show all currencys.                                                                                                                                                      |
| amount  | Float   | False    | Transfer out amount. (Notice: when currency's decimal = 18, minimum reserve 6 decimal places, when currency's decimal = 6, minimum reserve 2 decimal places )                                                                      |
| fixed   | Integer | False    | 0: Can transfer from«»to chain (default)<br/>1: Cann't transfer from«»to chain                                                                                                                                                     |

> Example(Rinkeby): https://rinkeby.orbiter.finance/?referer=zksync&source=Polygon%28R%29&sources=Polygon%28R%29,zksync%28R%29&dests=Arbitrum%28R%29&dest=Polygon%28R%29&token=&amount=0.03&fixed=0&tokens=
