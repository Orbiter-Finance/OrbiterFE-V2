import { BaseBalance } from '../interface';

export class EVM extends BaseBalance {
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
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: [address, 'latest'],
            id: 1,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return BigInt(data.result);
      } catch (error) {
        throw new Error(`Failed to fetch ETH balance: ${error}`);
      }
    }

    public async getTokenBalance(url: string, address: string, tokenAddress: string): Promise<bigint> {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [{
              to: tokenAddress,
              data: '0x70a08231000000000000000000000000' + address.slice(2),
            }, 'latest'],
            id: 1,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        if(data.result == '0x') {
          throw new Error(`ERC20 token: ${tokenAddress} not found.`);
        }
        return BigInt(data.result);
      } catch (error) {
        throw new Error(`Failed to fetch ERC20 token balance: ${error}`);
      }
    }
}
