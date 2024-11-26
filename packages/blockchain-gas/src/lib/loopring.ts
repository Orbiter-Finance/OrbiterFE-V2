import { BaseChainGas, RouterService } from "../interface";
import BigNumber from "bignumber.js";
import reuqest from '../request';

export class LprVM extends BaseChainGas {
    async getFeeEstimateForRouter(route: RouterService) {
        const res = await reuqest.get('https://api3.loopring.io/api/v3/user/offchainFee?accountId=11215&requestType=3');
        const transferChainFee = res.data;
        const gasPrice = transferChainFee.gasPrice;
        const fees = transferChainFee.fees;
        const symbol = this.chainInfo.nativeCurrency.symbol;
        const decimals = this.chainInfo.nativeCurrency.decimals;
        const feeInfo = fees.find(item => item.token === symbol);
        const fee = feeInfo?.fee ? new BigNumber(feeInfo.fee)
            .div(10 ** decimals)
            .toFixed(decimals) : '';
        return {
            gasPrice,
            fee,
            feeToken: symbol
        };
    }
}

