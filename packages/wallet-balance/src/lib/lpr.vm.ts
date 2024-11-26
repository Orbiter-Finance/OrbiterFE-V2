import { BaseBalance } from '../interface';

export class LPRVM extends BaseBalance {
    private tokenInfos: {
      type: string,
      tokenId: string,
      symbol: string,
      name: string,
      address: string
    }[] = [];

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
      return this.getTokenBalance(url, address, '0x0000000000000000000000000000000000000000');
    }

    public async getTokenBalance(url: string, address: string, tokenAddress: string) {
      const tokenInfo = await this.getTokenInfo(url, tokenAddress);
      if(!tokenInfo) {
        throw new Error(`Failed to get token info: ${tokenAddress} `);
      }
      const response = await fetch(`${url}/user/balances?address=${address}&tokens=${tokenInfo.tokenId}`);
      if (!response.ok) {
          if(response.status == 400) {
             return BigInt(0);
          }
          throw new Error(`Failed to fetch token balance: ${tokenAddress} data: ${response.statusText}`);
      }

      const data = await response.json();
      return BigInt(data[0].total);
    }

    private async getTokenInfo(url: string, tokenAddress: string) {
        try {
            if(this.tokenInfos.length == 0) {
              const response = await fetch(`${url}/exchange/tokens`);
              if (!response.ok) {
                  throw new Error(`Failed to fetch data: ${response.statusText}`);
              }
              
              const data = await response.json();
              this.tokenInfos = data;
            };
            return this.tokenInfos.find(tokenInfo => {
              return tokenInfo.address == tokenAddress;
            });
        } catch (error) {
            throw new Error(`Failed to fetch token info, ${JSON.stringify(error)}`);
        }
    }
}
