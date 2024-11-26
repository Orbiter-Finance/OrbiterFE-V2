import { BaseChainGas, RouterService } from "../interface";
import TonWeb from 'tonweb';
import {ChainConfig} from '@orbiter-finance/explore-link';

export class TVM extends BaseChainGas {
    private tonweb:TonWeb;

    constructor(public readonly chainInfo: ChainConfig){
        super(chainInfo);
        this.tonweb = new TonWeb(new TonWeb.HttpProvider(
            chainInfo.rpc[0],
            {
                // apiKey: chainInfo.api.key
            })
        );
    }
    async getFeeEstimateForRouter(route: RouterService) {
        try {
            // const srcAddress = route.simulationAddress(route.srcChainConfig.chainId);
            // const dstAddress = route.simulationAddress(route.dstChainConfig.chainId);
            // const request = await route.createTransaction(
            //     srcAddress,
            //     dstAddress,
            //     route.getMinSendAmount()
            // );
            //
            // const tx = await this.tonweb.provider.getEstimateFee({
            //     address: "UQCSyNhjvbUVdZeva8aIOl__75oo2I8HKbeIo7sr1fe5JDdV", body: request.raw
            // });
            // const sourceFee = tx.source_fees;
            // const fee = new BigNumber(sourceFee.in_fwd_fee)
            //     .plus(sourceFee.storage_fee)
            //     .plus(sourceFee.gas_fee)
            //     .plus(sourceFee.fwd_fee)
            //     .div(10 ** this.chainInfo.nativeCurrency.decimals)
            //     .toFixed(this.chainInfo.nativeCurrency.decimals);
            const fee = '0.005';
            return {
                fee,
                feeToken: this.chainInfo.nativeCurrency.symbol
            };
        } catch (error) {
            const e = error as Error;
            console.error(route.srcChainConfig.name, route.routerId, ' Gas estimation failed:', e.message);
            return {
                error: e.message
            }
        }
    }
}

