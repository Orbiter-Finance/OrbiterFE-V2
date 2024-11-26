import 'dotenv/config';
import BigNumber from 'bignumber.js';
import { describe, test, beforeAll, expect } from 'vitest';
import { Router } from "../src/lib/router.service";
import { ConfigOptions, ENDPOINT, OrbiterClient, RouterType, TradePair } from "../src"

describe('test orbiter', () => {
  const config: ConfigOptions = {
    apiEndpoint: ENDPOINT.TESTNET,
    defaultRouterType: RouterType.EOA
  }
  let orbiter: OrbiterClient;

  beforeAll(async () => {
    orbiter = await OrbiterClient.create(config);
  })

  test('get all symbols', () => {
    const allSymbols = orbiter.getAllSymbols();
    console.log(allSymbols);
    expect(allSymbols).toBeDefined();
  })

  test('get all available chains', () => {
    const chains = orbiter.getAllChains();
    expect(chains).toBeDefined();
  })

  test('get all available tokens', () => {
    const tokens = orbiter.getAvailableTokens('11155111');
    console.log(tokens);
    expect(tokens).toBeDefined();
  }, 30 * 1000)

  test('get available tradePairs', () => {
    const tradePairs = orbiter.getAvailableTradePairs('11155111', 'ETH');
    console.log(tradePairs);
    expect(tradePairs).toBeDefined();
  }, 30 * 1000)

  test('get all tradepairs', () => {
    const allTradePairs = orbiter.getAllTradePairs();
    expect(allTradePairs).toBeDefined();
  })

  test('get router', () => {
    const tradePair: TradePair = {
      srcChainId: '11155111',
      dstChainId: '421614',
      srcTokenSymbol: 'ETH',
      dstTokenSymbol: 'ETH',
      routerType: RouterType.EOA
    }
    const router = orbiter.createRouter(tradePair);
    expect(router).toBeInstanceOf(Router);
    const min = router.getMinSendAmount();
    const max = router.getMaxSendAmount();
    console.log('min:', min, 'max:', max);
    expect(min).toBeDefined();
    expect(max).toBeDefined();

    const vc = router.vc;
    console.log('vc', vc);
    expect(vc).toBeDefined();

    const routerTypes = router.routerTypes;
    console.log('routerTypes', routerTypes);
    expect(routerTypes).toBeDefined();

    const basePoint = router.basePoint;
    console.log('basePoint', basePoint);
    expect(basePoint).toBeDefined();
  })

  test('get unavailable router', () => {
    const tradePair: TradePair = {
      srcChainId: 'SN_SEPOLIA',
      dstChainId: '11155111',
      srcTokenSymbol: 'ETH',
      dstTokenSymbol: 'ETH',
      routerType: RouterType.EOA
    }
    try {
      const router = orbiter.createRouter(tradePair);
    } catch(error) {
      console.log(error.message);
    }
  })

  test('get defaut router', () => {
    const tradePair: TradePair = {
      srcChainId: 'SN_SEPOLIA',
      dstChainId: '11155111',
      srcTokenSymbol: 'ETH',
      dstTokenSymbol: 'ETH',
    }
    try {
      const router = orbiter.createRouter(tradePair);
      console.log(router.routerTypes);
    } catch(error) {
      console.log(error.message);
    }
  })

  test('get simulationAmount', async () => {
    const tradePair: TradePair = {
      srcChainId: '11155111',
      dstChainId: '421614',
      srcTokenSymbol: 'ETH',
      dstTokenSymbol: 'ETH',
      routerType: RouterType.EOA
    }
    console.log('tradePair:', tradePair);
    const router = orbiter.createRouter(tradePair);
    const min = router.getMinSendAmount();
    const max = router.getMaxSendAmount();
    console.log('min:', min, 'max:', max);
    const valueNumber = Math.random() * (Number(max) - Number(min)) + Number(min);
    console.log('valueNumber:', valueNumber);
    const { sendAmount, receiveAmount } = router.simulationAmount(valueNumber.toString());
    console.log('receiveAmount:', receiveAmount, 'sendAmount:', sendAmount);
    expect(receiveAmount).toBeDefined();
    expect(sendAmount).toBeDefined();

    const line = `${tradePair.srcChainId}/${tradePair.dstChainId}-${tradePair.srcTokenSymbol}/${tradePair.dstTokenSymbol}`;
    const queryValue = new BigNumber(valueNumber).multipliedBy(10 ** router.srcToken.decimals).toFixed(0);
    console.log('queryValue', queryValue);
    const simulationFromAPI = await (await fetch(`${config.apiEndpoint}/routers/simulation/receiveAmount?line=${line}&value=${queryValue}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })).json();
    console.log('simulationFromAPI:', simulationFromAPI);
    expect(new BigNumber(simulationFromAPI.result.targetAmount).eq(receiveAmount)).toBeTruthy();
  })

  test('get simulationAmountPlusWithHoldingFee', async () => {
    const tradePair: TradePair = {
      srcChainId: '11155111',
      dstChainId: '421614',
      srcTokenSymbol: 'ETH',
      dstTokenSymbol: 'ETH',
      routerType: RouterType.EOA
    }
    console.log('tradePair:', tradePair);
    const router = orbiter.createRouter(tradePair);
    const min = router.getMinSendAmountMinusWithHoldingFee();
    const max = router.getMaxSendAmount();
    console.log('min:', min, 'max:', max);
    const valueNumber = min;
    const { sendAmount, receiveAmount } = router.simulationAmountPlusWithHoldingFee(valueNumber);
    console.log('receiveAmount:', receiveAmount, 'sendAmount:', sendAmount);
    expect(receiveAmount).toBeDefined();
    expect(sendAmount).toBeDefined();
    expect(new BigNumber(receiveAmount).lte(valueNumber)).toBeTruthy();
  })

  test('get history', async () => {
    const result = await orbiter.getTransactionHistory(`0xe4310545e143b6e44aefa9a96f9aca44984cb1e0`, 0);
    console.log(result);
    expect(result).toBeDefined();
  }, 60 * 1000)

  test('get opoint', async () => {
    const result = await orbiter.getUserOpoint(`0xe4310545e143b6e44aefa9a96f9aca44984cb1e0`);
    console.log(result.summary);
    expect(result).toBeDefined();
  }, 30 * 1000)

  test('get tx status', async () => {
    const status = await orbiter.getTransactionStatus('0x3e9668376636ab6076ba0419ba70faee34206f9232eebcee1f8ebc42ca38fbec');
    console.log(status);
    expect(status).toBeDefined();
  }, 60 * 1000)

})
