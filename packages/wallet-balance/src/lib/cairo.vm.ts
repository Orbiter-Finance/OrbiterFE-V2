import { BaseBalance } from "../interface"

export class CairoVM extends BaseBalance {
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
        return await this.getTokenBalance(url, address, '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7');
    }

    public async getTokenBalance(url: string, address: string, tokenAddress: string): Promise<bigint> {
      const data = {
        jsonrpc: "2.0",
        method: "starknet_call",
        params: [
          {
            contract_address: tokenAddress,
            entry_point_selector: BALANCE_OF_SELECTOR,
            calldata: [address]
          },
          "latest"
        ],
        id: 1
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
    
      return BigInt(result.result[0]);
    }
}
const BALANCE_OF_SELECTOR = "0x2e4263afad30923c891518314c3c95dbe830a16874e8abc5777a9a20b54c76e";
