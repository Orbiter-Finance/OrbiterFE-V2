import { BaseBalance } from "../interface"

export class BTCVM extends BaseBalance {
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
        const response = await fetch(`${url}/v1/indexer/address/${address}/balance`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const balanceData = await response.json();
        if(balanceData.msg == 'ok') {
            return BigInt(balanceData.data.satoshi);
        } else {
            throw new Error(`getBalance error! response: ${balanceData}`);
        }
    }

    //BRC 20
    public async getTokenBalance(url: string, address: string, tokenAddress: string): Promise<bigint> {
        const response = await fetch(`${url}/v1/indexer/address/${address}/brc20/summary`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const brc20Summary = await response.json();
        interface BRC20Detail {
            ticker: string,
            overallBalance: string,
            transferableBalance: string,
            availableBalance: string
        }
        if(brc20Summary.msg == 'ok') {
            const brc20: BRC20Detail = brc20Summary.data.detail.find((brc20: BRC20Detail) => {
              return brc20.ticker == tokenAddress;
            })
            return BigInt(brc20.overallBalance);
        } else {
          throw new Error(`getTokenBalance error! response: ${brc20Summary}`);
        }
    }
}
