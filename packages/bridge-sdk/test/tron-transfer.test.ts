import 'dotenv/config'
import BigNumber from 'bignumber.js';
import { TronWeb, Types } from 'tronweb';
import { describe, test, beforeAll, expect } from 'vitest';
import { ENDPOINT, OrbiterClient, RouterType, TradePair } from "../src";

describe.skip('test orbiter tron transfer', () => {
  const config = {
    apiEndpoint: ENDPOINT.TESTNET
  }
  let orbiter: OrbiterClient;

  beforeAll(async () => {
    orbiter = await OrbiterClient.create(config);
  })

  test('send tron transfer by EOA - testnet', async () => {
    const tradePair: TradePair = {
      srcChainId: '3448148188',
      dstChainId: '11155111',
      srcTokenSymbol: 'USDC',
      dstTokenSymbol: 'USDC',
      routerType: RouterType.CONTRACT
    }
    const router = orbiter.createRouter(tradePair);
    console.log(router.dstChainConfig);
    console.log(router.srcChainConfig);
    const tronPrivateKey = process.env["tronPrivateKey"];
    const tronAddress = process.env["tronAddress"];
    const evmAddress = process.env["evmAddress"];
    expect(tronPrivateKey).toBeDefined();
    expect(tronAddress).toBeDefined();
    expect(evmAddress).toBeDefined();
    if (tronPrivateKey && tronAddress && evmAddress) {
      const tronWeb = new TronWeb({
        fullHost: 'https://nile.trongrid.io',
        headers: { "TRON-PRO-API-KEY": 'f696c7e9-8b72-4859-9e98-97ef6689f3bf' },
        privateKey: tronPrivateKey
      })
      const address = tronWeb.address.fromPrivateKey(tronPrivateKey);
      if(!address) {
        throw new Error('address is undefined');
      }
      expect(address).toEqual(tronAddress);
      console.log('address', address);

      const min = router.getMinSendAmount();
      console.log('min', min);

      const { sendAmount, receiveAmount } = router.simulationAmount(min);
      console.log('sendAmount', sendAmount);
      console.log('receiveAmount', receiveAmount);
      expect(new BigNumber(sendAmount).comparedTo(new BigNumber(receiveAmount))).toBe(1);

      //create allowance
      const allowance = await router.createAllowance(address);
      expect(allowance).toBeDefined();
      //sign allowance
      const signedAllowance = await tronWeb.trx.sign((allowance as Types.TransactionWrapper).transaction);

      console.time('allowance');
      const allowanceRes = await tronWeb.trx.sendRawTransaction(signedAllowance);
      console.timeEnd('allowance');
      console.log('allowanceRes', allowanceRes);

      //create approve
      const approveParams = await router.createApprove(address, sendAmount);
      expect(approveParams).toBeDefined();
      //sign approve
      const signedApprove = await tronWeb.trx.sign((approveParams.raw as Types.TransactionWrapper).transaction);

      console.time('approve');
      const approveRes = await tronWeb.trx.sendRawTransaction(signedApprove);
      console.timeEnd('approve');
      console.log('approveRes', approveRes);

      //create transaction
      const transactionParams = await router.createTransaction(address, evmAddress, sendAmount);
      expect(transactionParams).toBeDefined();
      //sign transaction
      const signedTransaction = await tronWeb.trx.sign((transactionParams.raw as Types.TransactionWrapper).transaction);

      console.time('transfer');
      const transferRes = await tronWeb.trx.sendRawTransaction(signedTransaction);
      console.timeEnd('transfer');
      console.log('transferRes', transferRes);
    }
  }, 120 * 1000)
})