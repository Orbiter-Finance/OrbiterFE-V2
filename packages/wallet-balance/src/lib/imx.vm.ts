import { BaseBalance } from '../interface';

export class IMXVM extends BaseBalance {
    public async fetchBalanceWithRetry(chainInfo: any, address: string, tokenAddress?: string): Promise<bigint | undefined> {
        for (const url of chainInfo.api) {
            try {
              return tokenAddress ? await this.getTokenBalance(url, address, tokenAddress) : await this.getBalance(url, address);
            } catch(error) {
              console.error(`Failed to fetch ${tokenAddress ? tokenAddress : 'Native Token'} balance for address ${address} on chain ${chainInfo.chainId}, error: ${(error as Error).message}`);
              continue;
            }
        }
        return undefined;
    }

    public async getBalance(url: string, address: string): Promise<bigint> {
        const response =  await this.requestBalance(url, address);
        const results: { symbol: string; balance: string; }[] = response?.result || [];
        const item = results.find(result => result.symbol === 'ETH');
        if(item) {
            return BigInt(item.balance);
        }
        return BigInt(0);
    }

    async getTokenBalance(url: string, address: string, tokenAddress: string) {
        const response =  await this.requestBalance(url, address);
        const results: { token_address: string; balance: string; }[] = response?.result || [];
        const item = results.find(result => result.token_address === tokenAddress);
        if(item) {
            return BigInt(item.balance);
        }
        return BigInt(0);
    }

    public async requestBalance(url: string, address: string) {
        try {
            const response = await fetch(`${url}/v2/balances/${address}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', (error as Error).message);
            throw error;
        }
    }

}
