export interface ConfigOptions {
  apiEndpoint: ENDPOINT;
  dealerId?: string;
  apiKey?: string;
  channelId?: string;
  defaultRouterType?: RouterType;
}

export enum ENDPOINT {
  TESTNET = "https://testnet-api.orbiter.finance/sdk",
  MAINNET = "https://api.orbiter.finance/sdk"
}

export enum CDNENDPOINT {
  TESTNET = "https://testnet-cdn.orbiter.finance/config",
  MAINNET = "https://cdn.orbiter.finance/config"
}

export interface TradePair {
  srcChainId: string;
  dstChainId: string;
  srcTokenSymbol: string;
  dstTokenSymbol: string;
  routerType?: RouterType;
}

export enum RouterType {
  EOA = 'EOA',
  CONTRACT = "CONTRACT"
}

export interface Chain {
  id: string;
  name: string;
}

export interface TransactionParams {
  routerType: RouterType;
  srcAddress: string;
  dstAddress: string;
  value: string;
  amount: string;
  raw: unknown;
}

export interface ApproveParams {
  ownerAddress: string;
  spenderAddress: string;
  value: string;
  amount: string;
  raw: unknown;
}
