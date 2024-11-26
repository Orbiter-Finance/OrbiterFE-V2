import BigNumber from 'bignumber.js';
import { BaseChainGas, RouterService } from "../interface";
import {ChainConfig} from "@orbiter-finance/explore-link";
import { Connection } from "@solana/web3.js";

export class SolanaVM extends BaseChainGas {
    private connection: Connection;

    constructor(public readonly chainInfo: ChainConfig) {
        super(chainInfo);
        const rpc = chainInfo.rpc[0];
        this.connection = new Connection(rpc, 'confirmed');
    }

    async getFeeEstimateForRouter(route: RouterService) {
        try {
            const latestBlockhash = await this.connection.getLatestBlockhash();
            const blockFee = await this.connection.getFeeCalculatorForBlockhash(latestBlockhash.blockhash);
            return {
                fee: new BigNumber(String(blockFee.value.lamportsPerSignature)).div(10 ** this.chainInfo.nativeCurrency.decimals).toFixed(this.chainInfo.nativeCurrency.decimals),
                feeToken: this.chainInfo.nativeCurrency.symbol
            };
        } catch (error) {
            const e = error as Error;
            console.error(route.srcChainConfig.name, route.routerId, ' Gas estimation failed:', e.message);
            return {
                error: e.message
            };
        }
    }
}

