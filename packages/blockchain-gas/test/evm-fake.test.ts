import { FeeEstimator } from "../src";
import { Endpoint, ExploreLinkProvider } from '@orbiter-finance/explore-link';
import { OrbiterClient, ENDPOINT, ConfigOptions } from "@orbiter-finance/bridge-sdk";

describe("EVM Fake TEST", function () {
    it("fake", async function () {
        const chainId = '1';
        const exploreLink = new ExploreLinkProvider(Endpoint.mainnet);
        const feeService = new FeeEstimator(exploreLink);

        const r = await feeService.getFeeEstimateForFake('1');
        console.log(`${chainId} pair`, 'fee result', r);
    }, 180000);
});
