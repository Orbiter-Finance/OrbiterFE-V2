import { BaseBalance } from '../interface';

export class SUIVM extends BaseBalance {
    public async fetchBalanceWithRetry(chainInfo: any, address: string, tokenAddress?: string): Promise<bigint | undefined> {
        for (const url of chainInfo.rpc) {
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
      return this.getTokenBalance(url, address, '0x2::sui::SUI');
    }

    public async getTokenBalance(url: string, address: string, tokenAddress: string): Promise<bigint> {
      const data = {
        jsonrpc: "2.0",
        id: 1,
        method: "suix_getBalance",
        params: [
          address,
          tokenAddress
        ]
      };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP ERROR, status: ${response.statusText}`);
      }
    
      const result = await response.json();
      if (result.error) {
        throw new Error(`Error fetching balance: ${result.error.message}`);
      }
    
      return BigInt(result.result.totalBalance);
    }
}
