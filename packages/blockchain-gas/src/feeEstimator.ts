import { ChainConfig, ExploreLinkProvider } from '@orbiter-finance/explore-link';

export class FeeEstimator {
    private exploreLinkProvider: ExploreLinkProvider;

    constructor(exploreLinkProvider: ExploreLinkProvider) {
        this.exploreLinkProvider = exploreLinkProvider;
    }
    async getFeeEstimateForRouter(route: RouterService):Promise<FeeEstimateForRouterResult> {
        try {
            const chainInfo = await this.exploreLinkProvider.getChainAsync(route.srcChainConfig.chainId);
            if (!chainInfo) {
                throw new Error(`ChainInfo Configuration not found`);
            }
            const vm = registerByVM(chainInfo);
            return vm.getFeeEstimateForRouter(route);
            // return 0;
        } catch (error) {
            console.error(`Error fetching fee estimate for chain ${route.srcChainConfig.chainId}:`, error);
            throw error;
        }
    }
    async getFeeEstimateForFake(chainId: string, useNetworkGasLimit?: boolean): Promise<FeeEstimateForRouterResult> {
        try {
            const chainInfo = await this.exploreLinkProvider.getChainAsync(chainId);
            if (!chainInfo) {
                throw new Error(`ChainInfo Configuration not found`);
            }
            const vm = registerByVM(chainInfo);
            return vm.getFeeEstimateForFake(useNetworkGasLimit);
            // return 0;
        } catch (error) {
            console.error(`Error fetching fee estimate for fake ${chainId}:`, error);
            throw error;
        }
    }
}

import * as libs from "./lib";
import { BaseChainGas, FeeEstimateForRouterResult, RouterService } from "./interface";

export function registerByVM(chainInfo: ChainConfig): BaseChainGas {
    const lib = getLibByVm(chainInfo?.vm);
    // if (!lib) {
    //     return undefined;
    // }
    return new lib(chainInfo);
}

function getLibByVm(vm: string) {
    const libList = libs as any;
    for (const lib in libList) {
        for (const key in libs) {
            if (typeof libList[key] === 'function' && String(key).toLowerCase() === String(vm).toLowerCase()) {
                return libList[key];
            }
        }
    }
    return null;
}
