import 'dotenv/config'
import BigNumber from "bignumber.js";
import { Wallet, JsonRpcProvider, TransactionRequest } from "ethers";
import { describe, test, beforeAll, expect } from 'vitest';
import { OrbiterClient, RouterType, TradePair, ENDPOINT } from "../src"

describe.skip('test orbiter evm transfer', () => {
  const config = {
    apiEndpoint: ENDPOINT.TESTNET
  }
  let orbiter: OrbiterClient;

  beforeAll(async () => {
    orbiter = await OrbiterClient.create(config);
  })

  test('send evm ETH transfer by EOA - testnet', async () => {
    const tradePair: TradePair = {
      srcChainId: '11155111',
      dstChainId: '421614',
      srcTokenSymbol: 'ETH',
      dstTokenSymbol: 'ETH',
      routerType: RouterType.EOA
    }
    const router = orbiter.createRouter(tradePair);
    const privateKey = process.env["evmPrivateKey"];
    expect(privateKey).toBeDefined();
    if (privateKey) {
      const provider = new JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
      const wallet = new Wallet(privateKey, provider);
      console.time('get balance');
      const balance = (await provider.getBalance(wallet)).toString();
      console.timeEnd('get balance');
      console.log('address', wallet.address);
      console.log('balance', balance);

      const min = router.getMinSendAmount();
      console.log('min', min);
      expect(new BigNumber(balance).comparedTo(min)).toEqual(1);

      const { sendAmount, receiveAmount } = router.simulationAmount(min);
      console.log('sendAmount', sendAmount);
      console.log('receiveAmount', receiveAmount);
      expect(new BigNumber(sendAmount).div(10 ** 18).comparedTo(new BigNumber(receiveAmount).div(10 ** 18))).toBe(1);

      const transactionParams = await router.createTransaction(wallet.address, wallet.address, sendAmount);
      expect(transactionParams).toBeDefined();

      console.time('transfer');
      const res = await wallet.sendTransaction(transactionParams.raw as TransactionRequest);
      console.timeEnd('transfer');
      console.log('res', res);

      console.time('receipt');
      const receipt = await res.wait();
      console.timeEnd('receipt');
      console.log('receipt', receipt);
    }
  }, 60 * 1000)

  test('send evm ERC20 transfer by EOA - testnet', async () => {
    const tradePair: TradePair = {
      srcChainId: '11155111',
      dstChainId: '421614',
      srcTokenSymbol: 'USDC',
      dstTokenSymbol: 'USDC',
      routerType: RouterType.EOA
    }
    const router = orbiter.createRouter(tradePair);
    const privateKey = process.env["evmPrivateKey"];
    expect(privateKey).toBeDefined();
    if (privateKey) {
      const provider = new JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
      const wallet = new Wallet(privateKey, provider);

      const min = router.getMinSendAmount();
      console.log('min', min);

      const { sendAmount, receiveAmount } = router.simulationAmount(min);
      console.log('sendAmount', sendAmount);
      console.log('receiveAmount', receiveAmount);
      expect(Number(sendAmount)).toBeGreaterThan(Number(receiveAmount));

      const transactionParams = await router.createTransaction(wallet.address, wallet.address, sendAmount);
      expect(transactionParams).toBeDefined();

      console.time('transfer');
      const res = await wallet.sendTransaction(transactionParams.raw as TransactionRequest);
      console.timeEnd('transfer');
      console.log('res', res);

      console.time('receipt');
      const receipt = await res.wait();
      console.timeEnd('receipt');
      console.log('receipt', receipt);
    }
  }, 60 * 1000)

  test('send evm ETH transfer by Contract - testnet', async () => {
    const tradePair: TradePair = {
      srcChainId: '11155111',
      dstChainId: '421614',
      srcTokenSymbol: 'ETH',
      dstTokenSymbol: 'ETH',
      routerType: RouterType.CONTRACT
    }
    const router = orbiter.createRouter(tradePair);
    const privateKey = process.env["evmPrivateKey"];
    expect(privateKey).toBeDefined();
    if (privateKey) {
      const provider = new JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
      const wallet = new Wallet(privateKey, provider);
      console.time('get balance');
      const balance = (await provider.getBalance(wallet)).toString();
      console.timeEnd('get balance');
      console.log('address', wallet.address);
      console.log('balance', balance);

      const min = router.getMinSendAmount();
      console.log('min', min);
      expect(new BigNumber(balance).comparedTo(min)).toEqual(1);

      const { sendAmount, receiveAmount } = router.simulationAmount(min);
      console.log('sendAmount', sendAmount);
      console.log('receiveAmount', receiveAmount);
      expect(Number(sendAmount)).toBeGreaterThan(Number(receiveAmount))

      const transactionParams = await router.createTransaction(wallet.address, wallet.address, sendAmount);
      expect(transactionParams).toBeDefined();

      console.time('transfer');
      const res = await wallet.sendTransaction(transactionParams.raw as TransactionRequest);
      console.timeEnd('transfer');
      console.log('res', res);

      console.time('receipt');
      const receipt = await res.wait();
      console.timeEnd('receipt');
      console.log('receipt', receipt);
    }
  }, 60 * 1000)

  test('send evm ERC20 transfer by Contract - testnet', async () => {
    const tradePair: TradePair = {
      srcChainId: '11155111',
      dstChainId: '421614',
      srcTokenSymbol: 'USDC',
      dstTokenSymbol: 'USDC',
      routerType: RouterType.CONTRACT
    }
    const router = orbiter.createRouter(tradePair);
    const privateKey = process.env["evmPrivateKey"];
    expect(privateKey).toBeDefined();
    if (privateKey) {
      const provider = new JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
      const wallet = new Wallet(privateKey, provider);

      const min = router.getMinSendAmount();
      console.log('min', min);

      const { sendAmount, receiveAmount } = router.simulationAmount(min);
      console.log('sendAmount', sendAmount);
      console.log('receiveAmount', receiveAmount);
      expect(Number(sendAmount)).toBeGreaterThan(Number(receiveAmount));

      const allowance = await router.createAllowance(wallet.address);
      expect(allowance).toBeDefined();

      console.time('allowance');
      const allowanceRes = await wallet.sendTransaction(allowance as TransactionRequest);
      console.timeEnd('allowance');
      console.log('allowanceRes', allowanceRes);

      console.time('allowanceReceipt');
      const allowanceReceipt = await allowanceRes.wait();
      console.timeEnd('allowanceReceipt');
      console.log('allowanceReceipt', allowanceReceipt);

      const approveParams = await router.createApprove(wallet.address, new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff').div(10 ** router.srcToken.decimals).toString());
      expect(approveParams).toBeDefined();

      console.time('approve');
      const approveRes = await wallet.sendTransaction(approveParams.raw as TransactionRequest);
      console.timeEnd('approve');
      console.log('approveRes', approveRes);

      console.time('approveReceipt');
      const approveReceipt = await approveRes.wait();
      console.timeEnd('approveReceipt');
      console.log('approveReceipt', approveReceipt);

      const transactionParams = await router.createTransaction(wallet.address, wallet.address, sendAmount);
      expect(transactionParams).toBeDefined();

      console.time('transfer');
      const transferRes = await wallet.sendTransaction(transactionParams.raw as TransactionRequest);
      console.timeEnd('transfer');
      console.log('transferRes', transferRes);

      console.time('receipt');
      const transferReceipt = await transferRes.wait();
      console.timeEnd('receipt');
      console.log('transferReceipt', transferReceipt);
    }
  }, 120 * 1000);

  test.skip('send evm ERC20 multiple transfer to Tron by Contract - testnet', async () => {
    const tradePair: TradePair = {
      srcChainId: '11155111',
      dstChainId: '3448148188',
      srcTokenSymbol: 'USDC',
      dstTokenSymbol: 'USDC',
      routerType: RouterType.CONTRACT
    }
    const router = orbiter.createRouter(tradePair);
    const privateKey = process.env["evmPrivateKey"];
    const tronAddress = process.env["tronAddress"];
    expect(privateKey).toBeDefined();
    expect(tronAddress).toBeDefined();
    if (privateKey && tronAddress) {
      const provider = new JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
      const wallet = new Wallet(privateKey, provider);

      const min = router.getMinSendAmount();
      console.log('min', min);

      const { sendAmount, receiveAmount } = router.simulationAmount(min);
      console.log('sendAmount', sendAmount);
      console.log('receiveAmount', receiveAmount);
      expect(Number(sendAmount)).toBeGreaterThan(Number(receiveAmount))

      const allowance = await router.createAllowance(wallet.address);
      expect(allowance).toBeDefined();

      console.time('allowance');
      const allowanceRes = await wallet.sendTransaction(allowance as TransactionRequest);
      console.timeEnd('allowance');
      console.log('allowanceRes', allowanceRes);

      console.time('allowanceReceipt');
      const allowanceReceipt = await allowanceRes.wait();
      console.timeEnd('allowanceReceipt');
      console.log('allowanceReceipt', allowanceReceipt);

      const approveParams = await router.createApprove(wallet.address, new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff').div(10 ** router.srcToken.decimals).toString());
      expect(approveParams).toBeDefined();

      console.time('approve');
      const approveRes = await wallet.sendTransaction(approveParams.raw as TransactionRequest);
      console.timeEnd('approve');
      console.log('approveRes', approveRes);

      console.time('approveReceipt');
      const approveReceipt = await approveRes.wait();
      console.timeEnd('approveReceipt');
      console.log('approveReceipt', approveReceipt);

      const transactionParams = await router.createTransaction(wallet.address, tronAddress, sendAmount);
      expect(transactionParams).toBeDefined();

      console.time('transfer');
      const transferRes = await wallet.sendTransaction(transactionParams.raw as TransactionRequest);
      console.timeEnd('transfer');
      console.log('transferRes', transferRes);

      const transactionParams2 = await router.createTransaction(wallet.address, tronAddress, sendAmount);
      expect(transactionParams2).toBeDefined();

      console.time('transfer2');
      const transferRes2 = await wallet.sendTransaction(transactionParams2.raw as TransactionRequest);
      console.timeEnd('transfer2');
      console.log('transferRes2', transferRes2);

      const transactionParams3 = await router.createTransaction(wallet.address, tronAddress, sendAmount);
      expect(transactionParams3).toBeDefined();
      console.time('transfer3');
      const transferRes3 = await wallet.sendTransaction(transactionParams3.raw as TransactionRequest);
      console.timeEnd('transfer3');
      console.log('transferRes3', transferRes3);
    }
  }, 120 * 1000);

})
