import { Router } from '@orbiter-finance/bridge-sdk';
export class RouterService  extends Router {};
export interface FeeEstimateForRouterResult {
    fee: string;
    feeToken: string;
}
export abstract class BaseChainGas {
    constructor(public readonly chainInfo: any) {
    }
    abstract getFeeEstimateForRouter(route: any, address?: string): Promise<FeeEstimateForRouterResult>;

    async getFeeEstimateForFake(useNetworkGasLimit?: boolean): Promise<FeeEstimateForRouterResult> {
        return {
            fee: '',
            feeToken: ''
        };
    }
}

