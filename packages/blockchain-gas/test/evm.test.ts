import { Endpoint, ExploreLinkProvider } from '@orbiter-finance/explore-link';
import { FeeEstimator } from '../src/feeEstimator';
import { describe, it, expect, vi } from 'vitest';
import { OrbiterClient, ENDPOINT, ConfigOptions } from "@orbiter-finance/bridge-sdk";
// import { VMType } from '@orbiter-finance/vm-core';
import gasCache from '../src/evm-gasLimit.json';
describe('VM EVM TEST', async () => {
    const exploreLink = new ExploreLinkProvider(Endpoint.mainnet);
    const feeService = new FeeEstimator(exploreLink);
    const config: ConfigOptions = {
        apiEndpoint: ENDPOINT.MAINNET
    }
    const client: OrbiterClient = await OrbiterClient.create(config);
    const pairs = await client.getAllTradePairs();
    const notApprove: any[] = [];
    const errors: any[] = [];
    it('EVM FEE', async () => {
        let totalCount = 0;

        // Helper function to handle errors related to allowance
        const handleAllowanceError = (router, result) => {
            const fromAddress = result.error.match(/from:\s+(0x[a-fA-F0-9]{40})/);
            if (!fromAddress) return;
            const tokenUrl = exploreLink.getTokenLink(router.srcChainConfig.chainId, router.srcToken.address);

            if (!notApprove.find(r =>
                r.chain === router.srcChainConfig.name &&
                r.token === router.srcToken.address &&
                r.maker === fromAddress[1]
            )) {
                notApprove.push({
                    id: router.routerId,
                    chain: router.srcChainConfig.name,
                    token: router.srcToken.address,
                    tokenName: router.srcToken.name,
                    contractAddress: router.contractAddress,
                    maker: fromAddress[1],
                    tokenUrl,
                });
            }
        };

        const feePromises = pairs.map(async (item) => {
            const srcChain = client.getChainConfig(item.srcChainId);
            const tgtChain = client.getChainConfig(item.dstChainId);
            // Check for incompatible chain types and continue if they do not match
            if (srcChain?.vm !== tgtChain?.vm || srcChain?.vm !== 'EVM') {
                return null;
            }

            totalCount++;
            const router = client.createRouter(item);
            const cacheKey = `${router.routerType}-${router.srcChainConfig.chainId}-${router.srcToken.symbol}`;
            const cacheData = gasCache.find(row => row.srcChain == router.srcChainConfig.chainId && row.srcToken == router.srcToken.address && row['routerType'] == router.routerType)
            if (cacheData) {
                return {
                    key: router.routerId,
                    value: 'read cache'
                };
            }

            const result = await feeService.getFeeEstimateForRouter(router);

            if (result?.error) {
                errors.push({
                    id: router.routerId,
                    message: result.error
                });

                if (result.error.includes('allowance')) {
                    handleAllowanceError(router, result);
                }
            } else {
                delete result.fee;
                delete result.gasPrice;
                gasCache.push({
                    ...result,
                    routerType: router.routerType,
                    srcChain: router.srcChainConfig.chainId,
                    srcTokenSymbol: router.srcToken.symbol,
                    srcToken: router.srcToken.address,
                    vm: router.srcChainConfig.vm
                })

            }
            return {
                key: router.routerId,
                value: result
            };
        });

        const feeResults = await Promise.all(feePromises);

        // Order the filtered results and output
        // const orderedResults = orderBy(
        //     feeResults.filter(res => res && res?.value),
        //     ['key'],
        //     ['asc']
        // );

        console.log(`notApprove:`, JSON.stringify(notApprove));
        console.log(`errors:`, JSON.stringify(errors));
        // Optionally log gasCache if needed
        console.log(`gasCache:`, JSON.stringify(gasCache));
    }, {
        timeout: 1000 * 60 * 5
    });

});