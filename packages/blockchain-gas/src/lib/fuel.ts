import BigNumber from 'bignumber.js';
import { BaseChainGas, RouterService } from "../interface";
import { Provider, ScriptTransactionRequest, Wallet, WalletUnlocked } from "@fuel-ts/account";

export class FuelVM extends BaseChainGas {
    async getFeeEstimateForRouter(route: RouterService) {
        const provider = await Provider.create(this.chainInfo.rpc[0]);
        const wallet: WalletUnlocked = Wallet.fromPrivateKey('0x8b61e2308c14838359daf16cc2399c5592d9f3c503c900bc6438e680304ce106', provider);
        try {
            const request = await route.createTransaction(
                '0xE485bC364E5BAF7365E772Ce8911d5F67aa983adf8469D92bB7D29C4cd5f459A',
                '0xe4edb277e41dc89ab076a1f049f4a3efa700bce8',
                route.getMinSendAmount()
            );
            const txRequest = {
                scriptData: request.raw
            };
            let transactionRequest = new ScriptTransactionRequest(<any>txRequest);
            transactionRequest = wallet.addTransfer(transactionRequest, {
                destination: '0xE485bC364E5BAF7365E772Ce8911d5F67aa983adf8469D92bB7D29C4cd5f459A',
                amount: Number(request.value),
                assetId: route.srcToken.address
            });
            const tx = await wallet.getTransactionCost(transactionRequest);
            return {
                fee: new BigNumber(String(tx.maxFee)).div(10 ** this.chainInfo.nativeCurrency.decimals).toFixed(18),
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

