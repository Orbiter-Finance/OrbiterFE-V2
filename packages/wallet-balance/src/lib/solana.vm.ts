import { BaseBalance } from '../interface';

export class SolanaVM extends BaseBalance {
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
        const body = {
            jsonrpc: "2.0",
            id: 1,
            method: "getBalance",
            params: [address],
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
              throw new Error(`HTTP ERROR, status: ${response.statusText}`);
            }

            const data = await response.json();
            const balance = data.result?.value;
            return BigInt(balance);
        } catch (error) {
            console.error('Error fetching SOL balance:', error);
            throw error;
        }
    }

    public async getTokenBalance(url: string, address: string, tokenAddress: string): Promise<bigint> {
        const body = {
            jsonrpc: "2.0",
            id: 1,
            method: "getTokenAccountsByOwner",
            params: [
                address,
                {
                    mint: tokenAddress,
                },
                {
                    encoding: "jsonParsed",
                },
            ],
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
              throw new Error(`HTTP ERROR, status: ${response.statusText}`);
            }

            const data = await response.json();
            const tokenAccounts = data.result?.value || [];
            if (tokenAccounts.length === 0) {
                return BigInt(0);
            }
            const balance = tokenAccounts[0].account.data.parsed.info.tokenAmount.amount;
            return BigInt(balance);
        } catch (error) {
            console.error('Error fetching SPL token balance:', error);
            throw error;
        }
    }
}
