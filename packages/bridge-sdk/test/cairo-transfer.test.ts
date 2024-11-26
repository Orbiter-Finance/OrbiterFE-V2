import 'dotenv/config'
import BigNumber from 'bignumber.js';
import { Account, Call, Provider, constants, } from 'starknet';
import { describe, test, beforeAll, expect } from 'vitest';
import { ENDPOINT, OrbiterClient, RouterType, TradePair } from "../src"

describe.skip('test orbiter cairo transfer', () => {
  const config = {
    apiEndpoint: ENDPOINT.TESTNET
  }
  let orbiter: OrbiterClient;

  beforeAll(async () => {
    orbiter = await OrbiterClient.create(config);
  })

  test('send cairo ERC20 transfer by CONTRACT - testnet', async () => {
    const tradePair: TradePair = {
      srcChainId: 'SN_SEPOLIA',
      dstChainId: '11155111',
      srcTokenSymbol: 'ETH',
      dstTokenSymbol: 'ETH',
      routerType: RouterType.CONTRACT
    }
    const router = orbiter.createRouter(tradePair);
    const privateKey = process.env["cairoPrivateKey"];
    const starknetAddress = process.env["cairoAddress"];
    const evmAddress = process.env["evmAddress"];
    expect(privateKey).toBeDefined();
    expect(starknetAddress).toBeDefined();
    expect(evmAddress).toBeDefined();
    if (privateKey && starknetAddress && evmAddress) {
      const provider = new Provider({ nodeUrl: constants.NetworkName.SN_SEPOLIA });
      const account = new Account(provider, starknetAddress, privateKey);
      console.log('address', account.address);

      const min = router.getMaxSendAmount();
      console.log('min', min);

      const { sendAmount, receiveAmount } = router.simulationAmount(min);
      console.log('sendValue', sendAmount);
      console.log('receiveValue', receiveAmount);
      expect(new BigNumber(sendAmount).comparedTo(new BigNumber(receiveAmount))).toBe(1);

      const allowance = await router.createAllowance(account.address);
      expect(allowance).toBeDefined();
      console.time('allowance');
      const allowanceResult = await account.execute(allowance as Call);
      console.log('allowanceResult', allowanceResult);
      console.time('allowance receipt');
      const allowance_receipt = await provider.waitForTransaction(allowanceResult.transaction_hash);
      console.timeEnd('allowance receipt');
      console.log('allowance receipt', allowance_receipt);
      console.timeEnd('allowance');

      const approveParams = await router.createApprove(account.address, sendAmount);
      expect(approveParams).toBeDefined();
      console.time('approve');
      const approveResult = await account.execute(approveParams.raw as Call);
      console.log('approveResult', approveResult);
      console.time('approve receipt');
      const approve_receipt = await provider.waitForTransaction(approveResult.transaction_hash);
      console.timeEnd('approve receipt');
      console.log('approve receipt', approve_receipt);
      console.timeEnd('approve');

      const transactionParams = await router.createTransaction(account.address, evmAddress, sendAmount);
      expect(transactionParams).toBeDefined();
      console.time('transfer');
      const result = await account.execute([transactionParams.raw as Call]);
      console.log('result', result);
      console.time('transfer receipt');
      const receipt = await provider.waitForTransaction(result.transaction_hash);
      console.timeEnd('transfer receipt');
      console.log('transfer receipt', receipt);
      console.timeEnd('transfer');
    }
  }, 120 * 1000)
})