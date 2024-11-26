import { BaseChainGas, RouterService } from "../interface";

export class ImxVM extends BaseChainGas {

    async getFeeEstimateForRouter(route: RouterService) {
        return {
            fee: '0',
            feeToken: this.chainInfo.nativeCurrency.symbol
        };
    }
}

