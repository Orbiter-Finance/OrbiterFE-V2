import { ExploreType, Explorer } from './config.interface';
export class StarkscanExplorer implements Explorer {
    url: string;
    name = ExploreType.Starkscan;
    
    constructor(url: string) {
      this.url = url;
    }
  
    getAccountLink(account: string): string {
      return `${this.url}/contract/${account}`;
    }
  
    getTokenLink(token: string): string {
      return `${this.url}/contract/${token}`;
    }
  
    getTransactionLink(transaction: string): string {
      return `${this.url}/tx/${transaction}`;
    }
  }


  
  