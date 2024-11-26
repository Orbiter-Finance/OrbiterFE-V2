export interface ExplorerItem {
  name: string;
  url: string;
}
export interface IToken {
  name: string;
  symbol: string;
  decimals: number;
}

export interface ChainConfig {
  chainId: string;
  name: string;
  rpc: string[],
  nativeCurrency: IToken,
  explorers: ExplorerItem[];
  vm: string;
}
export interface BlockchainConfigs {
  [key: string]: ChainConfig
}
export const addPathToUrl = (customNetworkUrl: string, linkType: string, suffixType?: string,) => {
  const { username, password, protocol, host, pathname, search, hash } = new URL(customNetworkUrl);

  const newPath = pathname.endsWith('/') ? `${pathname}${linkType}/${suffixType}` : `${pathname}/${linkType}/${suffixType}`;

  const auth = username ? `${username}:${password}` : '';

  const parsedUrl = new URL(`${protocol}//${auth}${host}${newPath}${search}${hash}`);

  return parsedUrl.toString();
};


export enum ExploreType {
  Unknown = 'Unknown',
  Etherscan = 'Etherscan',
  Explorer = 'Explorer',
  Blockscout = 'Blockscout',
  Starkscan = 'Starkscan',
  OKX = 'OKX',
  Thehemera = 'Thehemera',
  TronScan = 'TronScan',
  L2Scan = 'L2Scan',
  Suiscan = 'Suiscan'
}

export const ExploreTypeMappingLogo = {
  [ExploreType.Etherscan]: ''
}


export interface Explorer {
  name: string;
  url: string;
  getAccountLink(account: string): string;
  getTokenLink(token: string): string;
  getTransactionLink(transaction: string): string;
}