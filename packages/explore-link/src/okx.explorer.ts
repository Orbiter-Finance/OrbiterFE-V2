import { Explorer, ExploreType } from './config.interface';
export const ChainIdMap = {
  '1': 'eth',
  '42161': 'arbitrum',
  '56': 'bsc',
  '137': 'polygon',
  '196': 'xlayer',
  '10': 'optimism',
  '1625': 'gravity-alpha',
  '60808': 'bob',
  '213': 'bsquared',
  '200901': 'bitlayer',
  '8453': 'base',
  '534352': 'scroll',
  '324': 'zksync',
  '1101': 'polygon-zkevm',
  '59144': 'linea',
  '169': 'manta',
  '204': 'opbnb',
  'SN_MAIN': 'starknet',
  'SOLANA_MAIN': 'sol',
  '728126428': 'trx'
}
export class OKXExplorer implements Explorer {
  url: string;
  name = ExploreType.OKX;

  constructor(url: string) {
    this.url = url;
  }

  getAccountLink(account: string): string {
    return `${this.url}/address/${account}`;
  }

  getTokenLink(token: string): string {
    return `${this.url}/token/${token}`;
  }

  getTransactionLink(transaction: string): string {
    return `${this.url}/tx/${transaction}`;
  }
}