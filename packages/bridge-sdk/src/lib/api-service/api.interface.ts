import { VMType } from "@orbiter-finance/vm-core";

export interface APIResponse<T> {
  status: string;
  message: string;
  result: T;
}

export interface ChainConfig {
  chainId: string;
  networkId: string;
  internalId: number;
  name: string;
  nativeCurrency: Token;
  tokens: Token[];
  contracts: Contract[];
  vm: VMType;
}

export interface Token {
  name: string;
  symbol: string;
  decimals: number;
  coinKey: string;
  address: string;
  isNative?: boolean;
}

export interface Contract {
  name: string;
  address: string;
}

export interface RouterConfig {
  line: string;
  endpoint: string;
  endpointContract?: string;
  srcChain: string;
  tgtChain: string;
  srcToken: string;
  tgtToken: string;
  maxAmt: string;
  minAmt: string;
  tradeFee: string;
  withholdingFee: string;
  vc: string;
  state: RouterState;
  compRatio: number;
  spentTime: number;
  tieredFee: TieredFee[];
}

export interface TieredFee {
  range: [number, number];
  tradeFee: number;
  withholdingFee: number;
}

export enum RouterState {
  AVAILABLE = 'available',
  DISABLED = "disabled"
}

export interface Transaction {
  sourceId: string;
  targetId: string;
  sourceChain: string;
  targetChain: string;
  sourceAmount: string;
  sourceMaker: string;
  sourceAddress: string;
  targetAddress: string;
  sourceSymbol: string;
  targetSymbol: string;
  status: number;
  sourceTime: string;
  targetTime: string;
  points?: string;
}

export interface PointRule {
  [chain: string] : {
    [symbol: string]: string
  }
}