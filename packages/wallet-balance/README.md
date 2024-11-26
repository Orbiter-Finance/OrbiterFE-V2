# BalanceQueryService

`BalanceQueryService` is a utility class for querying native and token balances across multiple blockchain networks. It utilizes the `ExploreLinkProvider` from the `@orbiter-finance/explore-link` package to interact with different blockchain endpoints.

## Features

- Cache mechanism for reusing instances of `BalanceQueryService`.
- Asynchronous initialization with timeout handling.
- Chain information retrieval with error handling.
- Retry mechanism for fetching balances using multiple RPC URLs.

## Installation

To install the package, use npm or yarn:

```bash
npm install @orbiter-finance/wallet-balance
```

or

```bash
yarn add @orbiter-finance/wallet-balance
```

## Usage

### Import the Service

```javascript
import BalanceQueryService from './BalanceQueryService';
```

### Initialize the Service

You need to initialize the service before making any balance queries.

```javascript
const service = await BalanceQueryService.initializeService();
or 
const service = new BalanceQueryService(new ExploreLinkProvider());// yarn install @orbiter-finance/explore-link

```

### Get Native Token Balance

To retrieve the native balance of a specific address on a specified chain:

```javascript
const balance = await service.getNativeBalance(chainId, address);
console.log(`Native Balance: ${balance}`);
```

### Get Token Balance

To retrieve the balance of a specific token for a given address:

```javascript
const tokenBalance = await service.getTokenBalance(chainId, address, tokenAddress);
console.log(`Token Balance: ${tokenBalance}`);
```

### Error Handling

Make sure to handle potential errors when using the service:

```javascript
try {
    const balance = await service.getNativeBalance(chainId, address);
    console.log(`Native Balance: ${balance}`);
} catch (error) {
    console.error(`Error fetching balance: ${error.message}`);
}
```

## License

JavaScript library for Orbiter Finance Wallet Balance