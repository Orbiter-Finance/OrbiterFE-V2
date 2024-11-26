import { BaseChainGas, RouterService } from "../interface";
import BigNumber from "bignumber.js";
import reuqest from '../request';

export class CairoVM extends BaseChainGas {
    async getFeeEstimateForRouter(route: RouterService, address?: string) {
        try {
            let res;
            if (this.chainInfo.chainId === 'SN_SEPOLIA') {
                 res = await reuqest.post("https://braavos-sepolia-juno-rpc-0.nethermind.io/rpc/v0_7", {
                    "id": 1,
                    "jsonrpc": "2.0",
                    "method": "starknet_estimateFee",
                    "params": {
                        "request": [
                            {
                                "type": "INVOKE",
                                "sender_address": "0x51182a6e8c0f67ea4413817bf51e40ca6cc84daf8d215762e66b75a7b56179d",
                                "calldata": [
                                    "0x1",
                                    "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                                    "0x83afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e",
                                    "0x0",
                                    "0x3",
                                    "0x3",
                                    "0x123456789012345678901234567890123456789012345678901234567890123",
                                    "0x1",
                                    "0x0"
                                ],
                                "version": "0x100000000000000000000000000000001",
                                "signature": [
                                    "0x0",
                                    "0x0",
                                    "0x0"
                                ],
                                "nonce": "0x3",
                                "max_fee": "0x0"
                            }
                        ],
                        "block_id": "pending",
                        "simulation_flags": []
                    }
                });
            } else {
                res = await reuqest.post("https://braavos-mainnet-juno-rpc-0.nethermind.io/rpc/v0_7", {
                    "id": 1,
                    "jsonrpc": "2.0",
                    "method": "starknet_estimateFee",
                    "params": {
                        "request": [
                            {
                                "type": "DEPLOY_ACCOUNT",
                                "constructor_calldata": [
                                    "0x5aa23d5bb71ddaa783da7ea79d405315bafa7cf0387a74f4593578c3e9e6570",
                                    "0x2dd76e7ad84dbed81c314ffe5e7a7cacfb8f4836f01af4e913f275f89a3de1a",
                                    "0x1",
                                    "0x454e60bb690baa9343d352654d8eed4810e045595163ec6757aa2daab8b385e"
                                ],
                                "class_hash": "0x3131fa018d520a037686ce3efddeab8f28895662f019ca3ca18a626650f7d1e",
                                "contract_address_salt": "0x454e60bb690baa9343d352654d8eed4810e045595163ec6757aa2daab8b385e",
                                "version": "0x1",
                                "signature": [
                                    "0x6b12d914ea9563ab6be8fc18e000c1c03722afbdb195af25e7635e48273ca4c",
                                    "0x34a3fc963f645236e0f4dcffeb7dc32047d8a2a24d468ba2361cab8966af59a",
                                    "0x5dec330eebf36c8672b60db4a718d44762d3ae6d1333e553197acb47ee5a062",
                                    "0x0",
                                    "0x0",
                                    "0x0",
                                    "0x0",
                                    "0x0",
                                    "0x0",
                                    "0x0"
                                ],
                                "nonce": "0x0",
                                "max_fee": "0x0"
                            },
                            {
                                "type": "INVOKE",
                                "sender_address": "0x5c99c79d9a0d836b9afb24128a9b58c35e7de71f07b095930aef74748f3f964",
                                "calldata": [
                                    "0x2",
                                    "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                                    "0x219209e083275171774dab1df80982e9df2096516f06319c5c6d71ae0a8480c",
                                    "0x0",
                                    "0x3",
                                    "0x58680be0cf3f29c7a33474a218e5fed1ad213051cb2e9eac501a26852d64ca2",
                                    "0x68bcbdba7cc8cac2832d23e2c32e9eec39a9f1d03521eff5dff800a62725fa",
                                    "0x3",
                                    "0x7",
                                    "0xa",
                                    "0x58680be0cf3f29c7a33474a218e5fed1ad213051cb2e9eac501a26852d64ca2",
                                    "0x1",
                                    "0x0",
                                    "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                                    "0x64a24243f2aabae8d2148fa878276e6e6e452e3941b417f3c33b1649ea83e11",
                                    "0x1",
                                    "0x0",
                                    "0x2",
                                    "0x743d3078613566343664363066346630386631316135343935663863313031",
                                    "0x31353337373138653138386665"
                                ],
                                "version": "0x100000000000000000000000000000001",
                                "signature": [
                                    "0x45c4ae0cbd6f0571ea5237b481104e24ab684283e89a97b3da192a916c81f24",
                                    "0x56748b9765dd8d79db7da52114cf8ef6cf2d82ea056ffdc91939dd36af7351f"
                                ],
                                "nonce": "0x1",
                                "max_fee": "0x0"
                            }
                        ],
                        "block_id": "pending",
                        "simulation_flags": []
                    }
                });
            }
            const feeList = res?.data?.result || [];
            if (!feeList.length) {
                return {};
            }
            let fee = new BigNumber(+feeList[feeList.length - 1].overall_fee);
            if (address) {
                const contractResponse = await reuqest.post('https://braavos-mainnet-juno-rpc-0.nethermind.io/rpc/v0_7', {
                    "id": 1,
                    "jsonrpc": "2.0",
                    "method": "starknet_call",
                    "params": {
                        "request": {
                            "contract_address": address,
                            "entry_point_selector": "0xc8f66e480c0bc9ab679d6a65536cd4fcb2e0694287a34b53632462957d1fdc",
                            "calldata": []
                        },
                        "block_id": "pending"
                    }
                });
                if (contractResponse?.data?.code === 20) {
                    fee = fee.plus(+feeList[0].overall_fee);
                }
            }
            return {
                fee: fee.div(10 ** this.chainInfo.nativeCurrency.decimals).toFixed(18),
                feeToken: this.chainInfo.nativeCurrency.symbol,
                feeList
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
