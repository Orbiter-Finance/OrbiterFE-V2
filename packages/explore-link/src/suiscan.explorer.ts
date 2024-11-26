import { Explorer, ExploreType } from './config.interface';
export class SuiScanExplorer implements Explorer {
    url: string;
    name = ExploreType.Suiscan;
  
    constructor(url: string) {
      this.url = url;
    }

    getAccountLink(account: string): string {
        return `${this.url}/account/${account}`;
    }

    getTokenLink(token: string): string {
        return `${this.url}/coin/${token}`;
    }

    getTransactionLink(transaction: string): string {
        return `${this.url}/tx/${transaction}`;
    }
  }