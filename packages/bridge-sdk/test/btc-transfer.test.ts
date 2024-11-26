import 'dotenv/config'
import axios from 'axios';
import BigNumber from 'bignumber.js';
import * as bitcoin from 'bitcoinjs-lib'
import * as ecc from 'tiny-secp256k1';
import { ECPairFactory, networks } from 'ecpair';
import { describe, test, beforeAll, expect } from 'vitest';
import { ENDPOINT, OrbiterClient, RouterType, TradePair } from "../src";

describe.skip('test orbiter btc transfer', () => {
  const config = {
    apiEndpoint: ENDPOINT.TESTNET
  }
  let orbiter: OrbiterClient;

  beforeAll(async () => {
    orbiter = await OrbiterClient.create(config);
  })

  test('send btc transfer by EOA - testnet', async () => {
    const tradePair: TradePair = {
      srcChainId: 'FRACTAL_TEST',
      dstChainId: '11155111',
      srcTokenSymbol: 'BTC',
      dstTokenSymbol: 'BTC',
      routerType: RouterType.EOA
    }
    const router = orbiter.createRouter(tradePair);
    const btcPrivateKey = process.env["btcPrivateKey"];
    const btcAddress = process.env["btcAddress"];
    const evmAddress = process.env["evmAddress"];
    expect(btcPrivateKey).toBeDefined();
    expect(btcAddress).toBeDefined();
    expect(evmAddress).toBeDefined();
    if (btcPrivateKey && btcAddress && evmAddress) {
      const network = networks.bitcoin;
      const ECPair = ECPairFactory(ecc); 
      const keyPair = ECPair.fromWIF(btcPrivateKey, network);
      const payment = bitcoin.payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network,
      });
      const address = payment.address;
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
      const sendValue = new BigNumber(sendAmount).multipliedBy(10 ** router.srcToken.decimals).toFixed(0);

      //create transaction and add output
      const transactionParams = await router.createTransaction(address, evmAddress, sendAmount);
      expect(transactionParams).toBeDefined();
      const psbt = transactionParams.raw as bitcoin.Psbt

      //get utxo
      const config = {
        headers : {
          "Authorization": "Bearer 599c1ddce32cad229a89fd8b476f208b17348feec9e9828c5e514c9d2226ea7f"
        }
      }
      const utxoData = (await axios.get(`https://open-api-fractal-testnet.unisat.io/v1/indexer/address/${address}/utxo-data`, config)).data;
      const utxos = utxoData.data.utxo;
      const totalValue = utxos.reduce((sum: number, utxo: any) => sum + utxo.satoshi, 0);
      console.log('totalValue', totalValue, 'sendValue', sendValue);
      expect(new BigNumber(totalValue).comparedTo(new BigNumber(sendValue))).toEqual(1);
      
      //add input
      const script = payment.output;
      expect(script).toBeDefined();
      if(!script) {
        return;
      }
      utxos.forEach((utxo: any) => {
        const inputData = {
          hash: utxo.txid, 
          index: utxo.vout,
          witnessUtxo: {
            script, 
            value: utxo.satoshi
          },
        }
        psbt.addInput(inputData);
      });

      //estimate fee
      const feeData = (await axios.get('https://mempool-testnet.fractalbitcoin.io/api/v1/fees/recommended')).data;
      const feePerByte = feeData.fastestFee;
      console.log('Recommended Fee Per Byte:', feePerByte);
      const P2WPKH_INPUT_SIZE = 166;
      const P2WPKH_OUTPUT_SIZE = 31; // Average size of a P2WPKH output
      const OP_RETURN_OUTPUT_SIZE = 34; // Fixed size for an OP_RETURN output
      const txSize = (psbt.txInputs.length * P2WPKH_INPUT_SIZE) + (2 * P2WPKH_OUTPUT_SIZE) + (1 * OP_RETURN_OUTPUT_SIZE);
      const fee = feePerByte * txSize;
      console.log('Fee:', fee);

      // add change
      const change = totalValue - Number(sendValue) - fee;
      console.log(change);
      if (change > 0) {
        psbt.addOutput({
          script,
          value: change
        });
      }

      //sign
      for (let i = 0; i < psbt.inputCount; i++) {
        psbt.signInput(i, keyPair);
        psbt.validateSignaturesOfInput(i, (
          pubkey: Buffer,
          msghash: Buffer,
          signature: Buffer,
        ) => ECPair.fromPublicKey(pubkey).verify(msghash, signature));
      }
      psbt.finalizeAllInputs();
      
      const txHex = psbt.extractTransaction().toHex();
      console.log('txHex', txHex);

      console.time('transfer');
      const transferRes = (await axios.post('https://open-api-fractal-testnet.unisat.io/v1/indexer/local_pushtx', {
        txHex
      }, config)).data;
      console.timeEnd('transfer');
      console.log('transferRes', transferRes);
    }
  }, 120 * 1000)
})