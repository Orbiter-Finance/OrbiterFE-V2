import { Explorer, ExploreType } from './config.interface';
export class EtherscanExplorer implements Explorer {
    url: string;
    name = ExploreType.Etherscan;
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