import { BaseBalance } from '../interface';

export class ZKLITEVM extends BaseBalance {
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
      const response = await this.requestBalance(url, address);
      if (!response || !response.balances || !response.balances['ETH']){
          return BigInt(0);
      }
      const balance = response.balances['ETH'];
      return BigInt(balance);
    }

    public async getTokenBalance(url: string, address: string, tokenAddress: string) {
        const tokenInfo = await this.requestTokenInfo(url, tokenAddress);
        const symbol = tokenInfo.symbol;
        const response = await this.requestBalance(url, address);
        if (!response || !response.balances || !response.balances[symbol]){
            return BigInt(0);
        }
        const balance = response.balances[symbol];
        return BigInt(balance);
    }

    async requestBalance(url: string, address: string) {
        try {
            const response = await fetch(`${url}/accounts/${address}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }

            const data = await response.json();
            return data['result']['committed'];
        } catch (error) {
            console.error('Error:', (error as Error).message);
            throw error;
        }
    }

    async requestTokenInfo(url: string, tokenAddress: string) {
        try {
          const response = await fetch(`${url}/tokens/${tokenAddress}`);
          if (!response.ok) {
              throw new Error(`Failed to fetch data: ${response.statusText}`);
          }
          
          const data = await response.json();
          return data['result'] as {
              id: string;
              address: string;
              symbol: string;
              decimals: string;
          };
        } catch (error) {
            console.error('Error:', (error as Error).message);
            throw error;
        }
    }
}