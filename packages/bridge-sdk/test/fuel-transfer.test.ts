import 'dotenv/config'
import BigNumber from 'bignumber.js';
import { Wallet, Provider } from '@fuel-ts/account';
import { describe, test, beforeAll, expect } from 'vitest';
import { ENDPOINT, OrbiterClient, RouterType, TradePair } from "../src"

describe.skip('test orbiter fuel transfer', () => {
  const config = {
    apiEndpoint: ENDPOINT.TESTNET
  }
  let orbiter: OrbiterClient;

  beforeAll(async () => {
    orbiter = await OrbiterClient.create(config);
  })

  test('send fuel ETH transfer by CONTRACT - testnet', async () => {
    const tradePair: TradePair = {
      srcChainId: 'FUEL_TEST',
      dstChainId: '11155111',
      srcTokenSymbol: 'ETH',
      dstTokenSymbol: 'ETH',
      routerType: RouterType.EOA
    }
    const router = orbiter.createRouter(tradePair);
    const privateKey = process.env["fuelPrivateKey"];
    const fuleAddress = process.env["fuelAddress"];
    const evmAddress = process.env["evmAddress"];
    expect(privateKey).toBeDefined();
    expect(fuleAddress).toBeDefined();
    expect(evmAddress).toBeDefined();
    if (privateKey && fuleAddress && evmAddress) {
      const provider = await Provider.create('https://testnet.fuel.network/v1/graphql');
      const wallet = Wallet.fromPrivateKey(privateKey, provider);

      const min = router.getMaxSendAmount();
      console.log('min', min);

      const { sendAmount, receiveAmount } = router.simulationAmount(min);
      console.log('sendAmount', sendAmount);
      console.log('receiveAmount', receiveAmount);
      expect(new BigNumber(sendAmount).comparedTo(new BigNumber(receiveAmount))).toBe(1);

      const transactionParams = await router.createTransaction(fuleAddress, evmAddress, sendAmount);
      expect(transactionParams).toBeDefined();
      console.time('transfer');
      const token = router.srcToken;
      const txRequest = {
        scriptData: transactionParams.raw
    };
      const value = new BigNumber(sendAmount).multipliedBy(10 ** token.decimals).toFixed(0);
      const transaction = await wallet.transfer(router.makerAddress, Number(value), token.address, <any>txRequest);
      console.timeEnd('transfer');
      console.log('transfer hash', transaction.id);
    }
  }, 120 * 1000)

  test('send fuel ERC20 transfer by CONTRACT - testnet', async () => {
    const tradePair: TradePair = {
      srcChainId: 'FUEL_TEST',
      dstChainId: '11155111',
      srcTokenSymbol: 'USDC',
      dstTokenSymbol: 'USDC',
      routerType: RouterType.EOA
    }
    const router = orbiter.createRouter(tradePair);
    const privateKey = process.env["fuelPrivateKey"];
    const fuleAddress = process.env["fuelAddress"];
    const evmAddress = process.env["evmAddress"];
    expect(privateKey).toBeDefined();
    expect(fuleAddress).toBeDefined();
    expect(evmAddress).toBeDefined();
    if (privateKey && fuleAddress && evmAddress) {
      const provider = await Provider.create('https://testnet.fuel.network/v1/graphql');
      const wallet = Wallet.fromPrivateKey(privateKey, provider);

      const min = router.getMaxSendAmount();
      console.log('min', min);

      const { sendAmount, receiveAmount } = router.simulationAmount(min);
      console.log('sendAmount', sendAmount);
      console.log('receiveAmount', receiveAmount);
      expect(new BigNumber(sendAmount).comparedTo(new BigNumber(receiveAmount))).toBe(1);

      const transactionParams = await router.createTransaction(fuleAddress, evmAddress, sendAmount);
      expect(transactionParams).toBeDefined();
      console.time('transfer');
      const token = router.srcToken;
      const txRequest = {
        scriptData: transactionParams.raw
    };
      const value = new BigNumber(sendAmount).multipliedBy(10 ** token.decimals).toFixed(0);
      const transaction = await wallet.transfer(router.makerAddress, Number(value), token.address, <any>txRequest);
      console.timeEnd('transfer');
      console.log('transfer hash', transaction.id);
    }
  }, 120 * 1000)
})