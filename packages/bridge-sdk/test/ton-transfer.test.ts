import 'dotenv/config'
import BigNumber from 'bignumber.js';
import TonWeb from 'tonweb';
import TonWebMnemonic from "tonweb-mnemonic";
import { describe, test, beforeAll, expect } from 'vitest';
import { ENDPOINT, OrbiterClient, RouterType, TradePair } from "../src"

describe.skip('test orbiter evm transfer', () => {
  const config = {
    apiEndpoint: ENDPOINT.TESTNET
  }
  let orbiter: OrbiterClient;

  beforeAll(async () => {
    orbiter = await OrbiterClient.create(config);
  })

  test('get all ton tradePair', async () => {
    const tokens = orbiter.getAvailableTokens('TON_TEST');
    expect(tokens).toBeDefined();
    const tradePairs = orbiter.getAvailableTradePairs('TON_TEST', tokens[0].symbol);
    expect(tradePairs).toBeDefined();
  })

  test('send ton native transfer by EOA - testnet', async () => {
    const tradePair: TradePair = {
      srcChainId: 'TON_TEST',
      dstChainId: '202105',
      srcTokenSymbol: 'TON',
      dstTokenSymbol: 'TON',
      routerType: RouterType.EOA
    }
    const router = orbiter.createRouter(tradePair);

    const tonPrivateKey = process.env["tonPrivateKey"];
    console.log(tonPrivateKey);
    expect(tonPrivateKey).toBeDefined();
    const evmAddress = process.env["evmAddress"]
    if(tonPrivateKey && evmAddress) {
      const tonweb = new TonWeb();
      const client = new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC')
      expect(tonweb).toBeDefined();

      const mnemonic = tonPrivateKey.split(' ');
      const keyPair =  await TonWebMnemonic.mnemonicToKeyPair(mnemonic);
      const wallet = new tonweb.wallet.all.v4R2(client, {
        publicKey: keyPair.publicKey,
      });
      console.log('address', ((await wallet.getAddress()).toString(true, false, false)));

      const min = router.getMinSendAmount();
      console.log('min', min);
  
      const { sendAmount, receiveAmount } = router.simulationAmount(min);
      console.log('sendAmount', sendAmount);
      console.log('receiveAmount', receiveAmount);
      expect(new BigNumber(sendAmount).gt(new BigNumber(receiveAmount))).toBeTruthy();
  
      const transactionParams = await router.createTransaction((await wallet.getAddress()).toString(), evmAddress, sendAmount);
      expect(transactionParams).toBeDefined();

      const transaction = await wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress: router.makerAddress,
        amount: tonweb.utils.toNano(sendAmount),
        seqno: await wallet.methods.seqno().call() ?? 0,
        payload: transactionParams.raw as string
      }).send();
      console.log('transaction', transaction);
    }
  }, 100000 * 1000)

  //FIXME:
  test.skip('send ton token transfer by EOA - testnet', async () => {
    const tradePair: TradePair = {
      srcChainId: 'TON_TEST',
      dstChainId: '11155111',
      srcTokenSymbol: 'USDC',
      dstTokenSymbol: 'USDC',
      routerType: RouterType.EOA
    }
    const router = orbiter.createRouter(tradePair);

    const tonPrivateKey = process.env["tonPrivateKey"];
    console.log(tonPrivateKey);
    expect(tonPrivateKey).toBeDefined();
    const evmAddress = process.env["evmAddress"]
    if(tonPrivateKey && evmAddress) {
      const tonweb = new TonWeb();
      const client = new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC')
      expect(tonweb).toBeDefined();

      const mnemonic = tonPrivateKey.split(' ');
      const keyPair =  await TonWebMnemonic.mnemonicToKeyPair(mnemonic);
      const wallet = new tonweb.wallet.all.v4R2(client, {
        publicKey: keyPair.publicKey,
      });
      console.log('address', ((await wallet.getAddress()).toString(true, false, false)));

      const min = router.getMinSendAmount();
      console.log('min', min);
  
      const { sendAmount, receiveAmount } = router.simulationAmount(min);
      console.log('sendAmount', sendAmount);
      console.log('receiveAmount', receiveAmount);
      expect(new BigNumber(sendAmount).div(10 ** router.srcToken.decimals).comparedTo(new BigNumber(sendAmount).div(10 ** 18))).toBe(1);
  
      const transactionParams = await router.createTransaction((await wallet.getAddress()).toString(), evmAddress, sendAmount);
      expect(transactionParams).toBeDefined();

      const minter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {
        adminAddress: await wallet.getAddress(),
        jettonContentUri: 'https://files.raevskyschool.ru/coin.json',
        jettonWalletCodeHex: TonWeb.token.jetton.JettonWallet.codeHex
      });
      console.log("minter address:", (await minter.getAddress()).toString(true, true, true));

      const transaction = await wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress: await minter.getAddress(),
        amount: TonWeb.utils.toNano(sendAmount),
        seqno: await wallet.methods.seqno().call() ?? 0,
        payload: transactionParams.raw as string
      }).send();
      console.log(transaction);
    }
  }, 100000 * 1000)

})