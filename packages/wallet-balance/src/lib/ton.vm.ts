import { BaseBalance } from '../interface';

export class TonVM extends BaseBalance {
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
        const addressRaw = await this.getRawAddress(url, address);
        const response = await fetch(`${url}/v2/accounts/${addressRaw}`);
        if (!response.ok) {
            throw new Error(`HTTP ERROR, status: ${response.statusText}`);
        }
        const balanceData = await response.json();
        return BigInt(balanceData.balance);
    }

    public async getTokenBalance(url: string, address: string, tokenAddress: string): Promise<bigint> {
        const addressRaw = await this.getRawAddress(url, address);
        const tokenRaw = await this.getRawAddress(url, tokenAddress);
        const response = await fetch(`${url}/v2/accounts/${addressRaw}/jettons/${tokenRaw}`);
        if (!response.ok) {
            throw new Error(`HTTP ERROR, status: ${response.statusText}`);
        }
        const balanceData = await response.json();
        return BigInt(balanceData.balance);
    }

    private async getRawAddress(url: string, address: string) {
        const response = await fetch(`${url}/v2/address/${address}/parse`);
        if (!response.ok) {
            throw new Error(`HTTP ERROR, status: ${response.statusText}`);
        }
        const addressInfo = await response.json();
        return addressInfo.raw_form;
    }

    // public async getBalance(url: string, address: string): Promise<bigint> {
    //     const tonAddress = new TonWeb.Address(address);
    //     const balance = await this.getClient(url).getBalance(tonAddress);
    //     return BigInt(balance);
    // }

    // public async getTokenBalance(url: string, address: string, tokenAddress: string): Promise<bigint> {
    //     const tonAddress = new TonWeb.Address(address);
    //     const cell = new TonWeb.boc.Cell();
    //     cell.bits.writeAddress(tonAddress);
        
    //     const client = this.getClient(url);
    //     const getWalletAddressResponse = await client.provider.call2(
    //         tokenAddress,
    //         'get_wallet_address',
    //         [['tvm.Slice', TonWeb.utils.bytesToBase64(await cell.toBoc(false))]]
    //     );

    //     const jettonWalletAddress = this.parseAddress(getWalletAddressResponse);
    //     const jettonWalletData = await client.provider.call2(
    //         jettonWalletAddress!.toString(true, true, true),
    //         'get_wallet_data'
    //     );
    //     const balance = jettonWalletData[0] || '0';
    //     return BigInt(balance);
    // }

    // private getClient(url: string) {
    //     const urlParams = new URL(url);
    //     const apiKey = urlParams.searchParams.get('key') || undefined;
    //     if (!apiKey) {
    //         throw new Error('apiKey parameter is missing ');
    //     }
    //     return new TonWeb(new TonWeb.HttpProvider(url, { apiKey }));
    // }

    // private parseAddress(cell: { bits: any }) {
    //     let n = this.readIntFromBitString(cell.bits, 3, 8);
    //     if (n > BigInt(127)) {
    //         n = n - BigInt(256);
    //     }
    //     const hashPart = this.readIntFromBitString(cell.bits, 3 + 8, 256);
    //     if (n.toString(10) + ':' + hashPart.toString(16) === '0:0') return null;
    //     const s = n.toString(10) + ':' + hashPart.toString(16).padStart(64, '0');
    //     return new TonWeb.Address(s);
    // };

    // private readIntFromBitString(bs: { get: (arg0: any) => string | number | bigint | boolean; }, cursor: number, bits: number) {
    //     let n = BigInt(0);
    //     for (let i = 0; i < bits; i++) {
    //         n *= BigInt(2);
    //         n += BigInt(bs.get(cursor + i));
    //     }
    //     return n;
    // };

}
