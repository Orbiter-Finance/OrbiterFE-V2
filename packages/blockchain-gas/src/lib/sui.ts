import { BaseChainGas, RouterService } from "../interface";
import BigNumber from "bignumber.js";
import reuqest from '../request';
export class SuiVM extends BaseChainGas {
    async getFeeEstimateForRouter(route: RouterService) {

        const res = await reuqest.post('https://fullnode.testnet.sui.io:443', {
            "jsonrpc": "2.0",
            "id": 0,
            "method": "suix_getReferenceGasPrice",
            "params": []
        });
        const transferChainFee = res.data;
        const decimals = this.chainInfo.nativeCurrency.decimals;
        return {
            gasPrice: new BigNumber(transferChainFee.result)
                .div(10 ** decimals)
                .toFixed(decimals),
            fee: '0',
            feeToken: this.chainInfo.nativeCurrency.symbol
        };
    }
}

