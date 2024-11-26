import 'dotenv/config'
import BigNumber from 'bignumber.js';
import {
  Account,
  Ed25519PrivateKey
} from "@aptos-labs/ts-sdk";
import { describe, test, beforeAll, expect } from 'vitest';
import { ENDPOINT, OrbiterClient, TradePair } from "../src";

describe.skip('test orbiter aptos transfer', () => {
  const config = {
    apiEndpoint: ENDPOINT.TESTNET
  }
  let orbiter: OrbiterClient;

  beforeAll(async () => {
    orbiter = await OrbiterClient.create(config);
  })

  test('send aptos transfer by CONTRACT - testnet', async () => {
    const tradePair: TradePair = {
      srcChainId: 'MOVEMENT_TEST',
      dstChainId: '11155111',
      srcTokenSymbol: 'USDC',
      dstTokenSymbol: 'USDC'
    }
    const router = orbiter.createRouter(tradePair);
    const aptosPrivateKey = process.env["aptosPrivateKey"];
    const aptosAddress = process.env["aptosAddress"];
    const evmAddress = process.env["evmAddress"];
    expect(aptosPrivateKey).toBeDefined();
    expect(aptosAddress).toBeDefined();
    expect(evmAddress).toBeDefined();
    if (aptosPrivateKey && aptosAddress && evmAddress) {
      const wallet = Account.fromPrivateKey({ privateKey: new Ed25519PrivateKey(aptosPrivateKey) });
      const address = wallet.accountAddress.toString();
      if(!address) {
        throw new Error('address is undefined');
      }
      console.log('address', address);

      const min = router.getMinSendAmount();
      console.log('min', min);

      const { sendAmount, receiveAmount } = router.simulationAmount(min);
      console.log('sendAmount', sendAmount);
      console.log('receiveAmount', receiveAmount);
      expect(new BigNumber(sendAmount).div(10 ** 6).comparedTo(new BigNumber(receiveAmount).div(10 ** 18))).toBe(1);

      //create transaction and add output
      const transactionParams = await router.createTransaction(address, evmAddress, sendAmount);
      expect(transactionParams).toBeDefined();

      console.time('transfer');

      console.timeEnd('transfer');
      console.log('transferRes');
    }
  }, 120 * 1000)
})