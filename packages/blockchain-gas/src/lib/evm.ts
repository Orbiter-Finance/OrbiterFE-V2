import { ChainConfig } from '@orbiter-finance/explore-link';
import BigNumber from 'bignumber.js';
import { BaseChainGas, FeeEstimateForRouterResult, RouterService } from "../interface";
const TOKEN_MAKER_CHAIN: { [key: string]: string } = {
    'ETH-62050': '0xee73323912a4e3772B74eD0ca1595a152b0ef282',
    'ETH-*': '0xe4edb277e41dc89ab076a1f049f4a3efa700bce8',
    'USDC-*': '0x41d3d33156ae7c62c094aae2995003ae63f587b3',
    'BTC-*': '0xe01a40a0894970fc4c2b06f36f5EB94e73Ea502d',
    'USDT-*': '0xd7aa9ba6caac7b0436c91396f22ca5a7f31664fc'
}
import evmGasLimit from '../evm-gasLimit.json';
export class EVM extends BaseChainGas {
    constructor(public readonly chainInfo: ChainConfig) {
        super(chainInfo);
    }
    private gasPrice = new Map<string, bigint>();
    async getFeeEstimateForRouter(route: RouterService): Promise<FeeEstimateForRouterResult> {
        const srcChainId = route.srcChainConfig.chainId;
        let error: Error | null = null;
        let result = {
            fee: '',
            gasPrice: '',
            gasLimit: '',
            feeToken: ''
        }
        try {
            const response = await fetch(`https://gas.api.cx.metamask.io/networks/${srcChainId}/suggestedGasFees`, {
                method: 'GET',
            });
            if (response.ok) {
                const data = await response.json();
                if (data?.high && data.high.suggestedMaxFeePerGas) {
                    const gasPrice = String(data.high.suggestedMaxFeePerGas);
                    const suggestedMaxFeePerGas = BigInt(new BigNumber(gasPrice).multipliedBy(10 ** 9).toFixed(0));
                    this.gasPrice.set(srcChainId, suggestedMaxFeePerGas);
                    console.log('suggested gas price', suggestedMaxFeePerGas);
                }
            }
        } catch (error) {
            console.error(`${srcChainId} get metamask suggestedGasFees fail`, error.message);
        }
        for (const rpc of this.chainInfo.rpc) {
            const account = TOKEN_MAKER_CHAIN[`${route.srcToken.symbol}-${srcChainId}`] || TOKEN_MAKER_CHAIN[`${route.srcToken.symbol}-*`];
            if (!account) {
                console.error(`${route.routerId} account not found`);
                error = new Error(`${route.routerId} account not found`)
                break;
            }
            const request = await route.createTransaction(account, account, route.getMinSendAmount());
            try {
                let gasLimit = 0n;
                let findLocal = evmGasLimit.find(row => row.srcChain == route.srcChainConfig.chainId && row.srcToken == route.srcToken.address);
                if (findLocal) {
                    gasLimit = BigInt(findLocal.gasLimit);
                }
                if (!gasLimit) {
                    const params = [{
                        ...request.raw,
                        from: account
                    }];
                    gasLimit = await sendEthereumRpcRequest(rpc, 'eth_estimateGas', params).then(data => BigInt(data));
                    gasLimit = BigInt(Number(gasLimit) * 1.5);
                }
                if (!this.gasPrice.has(srcChainId)) {
                    let gasPrice = await sendEthereumRpcRequest(rpc, 'eth_gasPrice', []).then(data => BigInt(data));
                    gasPrice  = gasPrice * 2n;
                    this.gasPrice.set(srcChainId, gasPrice);
                }
                const gasPrice = this.gasPrice.get(srcChainId) || 0n;
                console.log(`${route.srcChainConfig.name} - ${route.routerId} Estimated Gas: ${gasLimit}, gasPrice: ${gasPrice}`);
                const transactionFee = gasLimit * gasPrice;
                result = {
                    fee: new BigNumber(transactionFee.toString()).div(10 ** this.chainInfo.nativeCurrency.decimals).toFixed(18),
                    gasPrice: gasPrice.toString(),
                    gasLimit: gasLimit.toString(),
                    feeToken: this.chainInfo.nativeCurrency.symbol
                }
                error = null;
                break;
            } catch (error) {
                const e = error as Error;
                error = e;
                console.error(route.srcChainConfig.name, route.routerId, ' Gas estimation failed:', account, e.message);
            }
        }
        if (error) {
            throw error;
        }
        return result;
    }

    async getFeeEstimateForFake(useNetworkGasLimit?: boolean) {
        const srcChainId = this.chainInfo.chainId;
        const symbol = this.chainInfo.nativeCurrency.symbol;
        let error: Error | null = null;
        let result = {
            fee: '',
            gasPrice: '',
            gasLimit: '',
            feeToken: ''
        };
        try {
            const response = await fetch(`https://gas.api.cx.metamask.io/networks/${srcChainId}/suggestedGasFees`, {
                method: 'GET',
            });
            if (response.ok) {
                const data = await response.json();
                if (data?.high && data.high.suggestedMaxFeePerGas) {
                    const gasPrice = String(data.high.suggestedMaxFeePerGas);
                    const suggestedMaxFeePerGas = BigInt(new BigNumber(gasPrice).multipliedBy(10 ** 9).toFixed(0));
                    this.gasPrice.set(srcChainId, suggestedMaxFeePerGas);
                    console.log('suggested gas price', suggestedMaxFeePerGas);
                }
            }
        } catch (error) {
            console.error(`${srcChainId} get metamask suggestedGasFees fail`, error.message);
        }


        for (const rpc of this.chainInfo.rpc) {
            try {
                let gasLimit = 0n;
                let findLocal = evmGasLimit.find(row =>
                    row.srcChain == srcChainId &&
                    row.srcTokenSymbol == symbol &&
                    row.routerType === 'EOA');
                if (findLocal) {
                    gasLimit = BigInt(findLocal.gasLimit);
                }
                if (!gasLimit || useNetworkGasLimit) {
                    const params = [{
                        from: '0xe4edb277e41dc89ab076a1f049f4a3efa700bce8',
                        to: '0xe4edb277e41dc89ab076a1f049f4a3efa700bce8',
                        value: '0x1',
                        data: '0x'
                    }];
                    const localGasLimit = gasLimit;
                    gasLimit = await sendEthereumRpcRequest(rpc, 'eth_estimateGas', params).then(data => BigInt(data));
                    console.log('gasLimit', localGasLimit, '=>', gasLimit);
                }
                if (!this.gasPrice.has(srcChainId)) {
                    const gasPrice = await sendEthereumRpcRequest(rpc, 'eth_gasPrice', []).then(data => BigInt(data));
                    this.gasPrice.set(srcChainId, gasPrice);
                }
                const gasPrice = this.gasPrice.get(srcChainId) || 0n;
                const transactionFee = gasLimit * gasPrice;
                const fee = new BigNumber(transactionFee.toString()).div(10 ** this.chainInfo.nativeCurrency.decimals).toFixed(18);
                console.log(`${this.chainInfo.name} gas limit: ${gasLimit}, gas price: ${gasPrice}, fee: ${fee}`);
                result = {
                    fee,
                    gasPrice: gasPrice.toString(),
                    gasLimit: gasLimit.toString(),
                    feeToken: this.chainInfo.nativeCurrency.symbol
                };
                error = null;
                break;
            } catch (error) {
                const e = error as Error;
                error = e;
                console.error(this.chainInfo.name, ' Gas estimation failed:', e.message);
            }
        }
        if (error) {
            throw error;
        }
        return result;
    }
}



async function sendEthereumRpcRequest(
    url: string,
    method: string,
    params: any[] = []
): Promise<any> {
    const data = {
        jsonrpc: '2.0',
        method,
        params,
        id: Date.now()
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        if (responseData.error) {
            throw new Error(`RPC error: ${responseData.error.message}`);
        }
        return responseData.result;
    } catch (error) {
        console.error('Error in Ethereum RPC request:', error);
        throw error;
    }
}
