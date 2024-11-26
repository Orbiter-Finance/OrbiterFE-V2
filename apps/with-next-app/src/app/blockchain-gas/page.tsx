import * as BlockchainGas from '@orbiter-finance/blockchain-gas'
import ExploreLinkProvider, { Endpoint } from '@orbiter-finance/explore-link';
import {  OrbiterClient, ENDPOINT, ConfigOptions, TradePair } from "@orbiter-finance/bridge-sdk";
const config: ConfigOptions = {
  apiEndpoint: ENDPOINT.MAINNET
}
export  default async function Page() {
    const orbiter: OrbiterClient = await OrbiterClient.create(config);
    const exploreLink = new ExploreLinkProvider(Endpoint.mainnet);
    const service = new BlockchainGas.FeeEstimator(exploreLink);
    const tradePairs: TradePair[] = orbiter.getAvailableTradePairs('1','ETH');
    const router = orbiter.createRouter(tradePairs[0])
    const data = await service.getFeeEstimateForRouter(router);
    console.log('data:', data)
    return (
            <div>BlockChain Gas</div>

    );
}