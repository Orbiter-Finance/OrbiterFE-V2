
# ExploreLinkProvider

The `ExploreLinkProvider` class is designed to provide convenient links for blockchain explorers. This class can fetch and manage blockchain configuration data (either locally or remotely via API) and generate links for accounts, tokens, and transactions across different blockchain networks. It supports both mainnet and testnet environments.

## Features

- **Load Blockchain Configurations**: Load chain configurations either from local JSON files or remotely via the Orbiter API.
- **Explorer Link Generation**: Generate explorer links for accounts, tokens, and transactions based on chain configuration.
- **Dynamic Configuration Management**: Add or update blockchain configurations dynamically at runtime.

## Installation

To install and use this package, run:

```bash
npm install
```

## Usage

### 1. Import the Module

```typescript
import ExploreLinkProvider, { Endpoint } from './ExploreLinkProvider';
```

### 2. Initialize the Provider

You can initialize the `ExploreLinkProvider` by passing the appropriate endpoint for either `mainnet` or `testnet`:

```typescript
const exploreProvider = new ExploreLinkProvider(Endpoint.mainnet);
```

### 3. Generate Explorer Links

Once initialized, you can generate explorer links for accounts, tokens, and transactions by providing the respective blockchain `chainId` and values:

#### Get Account Link

```typescript
const accountLink = await exploreProvider.getAccountLink('1', '0x123...abc');
console.log(accountLink); // Returns the explorer URL for the account
```

#### Get Token Link

```typescript
const tokenLink = await exploreProvider.getTokenLink('1', '0x456...def');
console.log(tokenLink); // Returns the explorer URL for the token
```

#### Get Transaction Link

```typescript
const txLink = await exploreProvider.getTransactionLink('1', '0x789...ghi');
console.log(txLink); // Returns the explorer URL for the transaction
```

### 4. Add or Update Blockchain Configuration

You can dynamically add a new chain configuration or update an existing one:

```typescript
const newChainConfig: ChainConfig = {
  chainId: '100',
  name: 'NewChain',
  explorers: [
    {
      url: 'https://newchain.explorer.io',
      name: 'NewChain Explorer',
      standard: 'EIP3091',
    },
  ],
};

await exploreProvider.addBlockchain('100', newChainConfig);
```

## Configuration

The `ExploreLinkProvider` uses two primary sources for blockchain configurations:

- **Local JSON Files**: Predefined configurations for mainnet and testnet chains.
  - `chains.json`: Mainnet chain configurations
  - `testnet.json`: Testnet chain configurations

## ExplorerFactory

`ExploreLinkProvider` uses an `ExplorerFactory` to create explorer objects based on the chain configuration. These explorers provide methods to generate the appropriate links for accounts, tokens, and transactions.

### Example ExplorerFactory Usage

```typescript
import { ExplorerFactory } from './explorer.factory';

const config = {
  url: 'https://etherscan.io',
  name: 'Etherscan',
  standard: 'EIP3091',
};
const explorer = ExplorerFactory.createExplorer(config);

const accountLink = explorer.getAccountLink('0x123...abc');
console.log(accountLink); // Generates the Etherscan account URL
```

## Error Handling

If no explorers are available for a given chain, the `ExploreLinkProvider` will throw an error:

```typescript
try {
  const accountLink = await exploreProvider.getAccountLink('999', '0x123...abc');
} catch (error) {
  console.error(error.message); // "No explorers available for chain: 999"
}
```

## API Endpoints

The `ExploreLinkProvider` supports two API endpoints, represented by the `Endpoint` enum:

- `Endpoint.mainnet`: Mainnet chains
- `Endpoint.testnet`: Testnet chains

## ChainConfig Interface

A `ChainConfig` represents the configuration for a blockchain network, including its explorers:

```typescript
export interface ChainConfig {
  chainId: string;
  name: string;
  explorers: {
    url: string;
    name: string;
    standard: string;
  }[];
}
```

## Development

Clone the repository:

```bash
git clone https://github.com/your-repo/explore-link-provider.git
cd explore-link-provider
```

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

## License

This project is licensed under the MIT License.
