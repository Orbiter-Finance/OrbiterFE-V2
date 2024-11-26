import { BaseBalance } from '../interface';

export class FUELVM extends BaseBalance {
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
      return await this.getTokenBalance(url, address, '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07');
    }

    public async getTokenBalance(url: string, address: string, tokenAddress: string) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `query getBalance($owner: Address!, $assetId: AssetId!) {
                balance(owner: $owner, assetId: $assetId) {
                    ...balanceFragment
                }
            }
            
            fragment balanceFragment on Balance {
                owner
                amount
                assetId
            }`,
            variables: {
                owner: address,
                assetId: tokenAddress
            },
            operationName: "getBalance"
        })
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return BigInt(data.data.balance.amount || 0);
    }
}