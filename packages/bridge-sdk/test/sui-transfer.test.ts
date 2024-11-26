import 'dotenv/config'
import { describe, test, beforeAll, expect } from 'vitest';
import { ENDPOINT, OrbiterClient, TradePair } from "../src";

describe.skip('test orbiter sui transfer', () => {
  const config = {
    apiEndpoint: ENDPOINT.TESTNET
  }
  let orbiter: OrbiterClient;

  beforeAll(async () => {
    orbiter = await OrbiterClient.create(config);
  })

  test('send sui transfer by CONTRACT - testnet', async () => {
    const tradePair: TradePair = {
      srcChainId: 'SUI_TEST',
      dstChainId: '11155111',
      srcTokenSymbol: 'USDC',
      dstTokenSymbol: 'USDC'
    }
    const router = orbiter.createRouter(tradePair);
    const suiPrivateKey = process.env["suiPrivateKey"];
    const suiAddress = process.env["suiAddress"];
    const evmAddress = process.env["evmAddress"];
    expect(suiPrivateKey).toBeDefined();
    expect(suiAddress).toBeDefined();
    expect(evmAddress).toBeDefined();
    if (suiPrivateKey && suiAddress && evmAddress) {
      //TODO:
    }
  }, 120 * 1000)
})