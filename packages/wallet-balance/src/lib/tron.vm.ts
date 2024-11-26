import { BaseBalance } from '../interface';

export class TronVM extends BaseBalance {
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
        const response = await fetch(`${url}/v1/accounts/${address}`, {
            method: "GET",
            headers: {
                "accept": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP ERROR, status: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(`Failed to fetch account data, response: ${data}`);
        }
        return BigInt(data.data[0]?.balance || 0);
    }

    public async getTokenBalance(url: string, address: string, tokenAddress: string): Promise<bigint> {
        const response = await fetch(`${url}/v1/accounts/${address}`, {
            method: "GET",
            headers: {
                "accept": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP ERROR, status: ${response.statusText}`);
        }

        const data: { success: boolean; data: Array<{ trc20: Array<Record<string, number>> }> } = await response.json();
        if (!data.success || !data.data.length) {
            throw new Error(`Failed to fetch account data, response: ${data}`);
        }
    
        const tokens = data?.data[0]?.trc20;
        if(!tokens) {
            throw new Error(`Failed to fetch account data, response: ${data}`);
        }
        const tokenInfo = tokens.find(token => Object.keys(token)[0] === tokenAddress);
    
        if (!tokenInfo) {
            return BigInt(0);
        }
    
        return BigInt(tokenInfo[tokenAddress]!);
    }

}
