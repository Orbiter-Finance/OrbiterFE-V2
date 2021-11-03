# Orbiter

## Project

- The latest version of Orbiter is used vuejs to build
- Orbiter was created to give users a better cross-rollup transaction experience, greatly reducing the economic and time costs of interaction between L1 and L2, such as L1<->L2,L2<->L2.
- As a proof-of-concept project, Orbiter currently supports ERC20 token transactions on mainnet, zkSync, Arbitrum.

## Functional

- Running this project requires setting the necessary parameters, such as localProvider and localWSProvider, which support each rollup node.

- By configuring the parameters, the project can realize the economic and time savings that users can make by Orbiter when configuring the rollup dynamics. After the user initiates payment through the front-end wallet, it will monitor the transaction data of each rollup in real time and feed back the real-time status of the user's cross-rollup transfer in time.

## Design

**[config](https://github.com/OrbiterCross/orbiterFE-V2/tree/main/src/config)** - Third-party and global configurations of the CSS

**[core](https://github.com/OrbiterCross/orbiterFE-V2/tree/main/src/core)** - Related network processing and interface implementation of the on-rollup and TheGraph.

**[icons](https://github.com/OrbiterCross/orbiterFE-V2/tree/main/src/icons)** - SVG Image Processing & SVG Image resources

**[store](https://github.com/OrbiterCross/orbiterFE-V2/tree/main/src/store)** - vuex data.

**[util](https://github.com/OrbiterCross/orbiterFE-V2/tree/main/src/util)** - Implementation of common methods for each module of the project.

**[views](https://github.com/OrbiterCross/orbiterFE-V2/tree/main/src/views)** - Implement project page.

**[components](https://github.com/OrbiterCross/orbiterFE-V2/tree/main/src/components)** - Implement project components.

## Project setup

```
You need to change env.backup.js to env.js and configure localProvider and localWSProvider.
```

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```
