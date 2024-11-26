import { FeeEstimator } from "../src";
import { Endpoint, ExploreLinkProvider } from '@orbiter-finance/explore-link';
import { OrbiterClient, ENDPOINT, ConfigOptions } from "@orbiter-finance/bridge-sdk";

describe("VM TRONVM TEST", function () {
    it("TRONVM FEE", async function () {
        const chainId = '728126428';
        const exploreLink = new ExploreLinkProvider(Endpoint.mainnet);
        const feeService = new FeeEstimator(exploreLink);
        const config: ConfigOptions = {
            apiEndpoint: ENDPOINT.MAINNET
        };
        const client: OrbiterClient = await OrbiterClient.create(config);
        const pairs = await client.getAllTradePairs();
        const pair = pairs.find(item =>
            item.srcChainId === chainId
        );
        if (!pair) {
            console.error(`${chainId} pair not found`);
            return;
        }
        const router = client.createRouter(pair);
        const r = await feeService.getFeeEstimateForRouter(router);
        console.log(`${chainId} pair`, JSON.stringify(pair), 'fee result', r);
    }, 180000);
});
