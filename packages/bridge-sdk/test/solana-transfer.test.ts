import 'dotenv/config'
import BigNumber from "bignumber.js";
import bs58 from "bs58"
import { Connection, Keypair, LAMPORTS_PER_SOL, Transaction, ComputeBudgetProgram } from '@solana/web3.js'
import { describe, test, beforeAll, expect } from 'vitest';
import { ENDPOINT, OrbiterClient, RouterType, TradePair } from "../src"

describe.skip('test orbiter solana transfer', () => {
  const config = {
    apiEndpoint: ENDPOINT.TESTNET
  }
  let orbiter: OrbiterClient;

  beforeAll(async () => {
    orbiter = await OrbiterClient.create(config);
  })

  test('send solana ERC20 transfer by EOA - testnet', async () => { //no test rule
    const tradePair: TradePair = {
      srcChainId: 'SOLANA_DEV',
      dstChainId: '11155111',
      srcTokenSymbol: 'USDC',
      dstTokenSymbol: 'USDC',
      routerType: RouterType.EOA
    }
    const router = orbiter.createRouter(tradePair);

    const connection = new Connection('https://solana-devnet.g.alchemy.com/v2/g62_FXOVPZvFHCPh8739oReVFkjo5GQP', "confirmed");
    const privateKey = process.env["solanaPrivateKey"];
    const evmAddress = process.env["evmAddress"];
    expect(privateKey).toBeDefined();
    expect(evmAddress).toBeDefined();
    if (privateKey && evmAddress) {
      const sender = Keypair.fromSecretKey(bs58.decode(privateKey));
      console.log('address', sender.publicKey);
      const min = router.getMinSendAmount();
      console.log('min', min);

      const { sendAmount, receiveAmount } = router.simulationAmount(min);
      console.log('sendAmount', sendAmount);
      console.log('receiveAmount', receiveAmount);
      expect(new BigNumber(sendAmount).div(10 ** 18).comparedTo(new BigNumber(receiveAmount).div(10 ** 18))).toBe(1);

      //airdrop
      const airdropSignature = await connection.requestAirdrop(
        sender.publicKey,
        LAMPORTS_PER_SOL
      );
      console.log("airdropSignature", airdropSignature);

      const transactionParams = await router.createTransaction(sender.publicKey.toString(), evmAddress, sendAmount);
      expect(transactionParams).toBeDefined();

      const transaction = transactionParams.raw as Transaction
      const blockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash.blockhash;
      transaction.feePayer = sender.publicKey;
      const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 1000000,
      })
    
      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 100,
      })
      transaction
        .add(modifyComputeUnits)
        .add(addPriorityFee);
      transaction.sign(sender);

      console.time('transfer');
      const signature = await connection.sendRawTransaction(
        transaction.serialize()
      );
      console.timeEnd('transfer');
      console.log("solana tx signature", signature);

      const status = await connection.getSignatureStatus(signature, {
        searchTransactionHistory: false,
      });
      console.log("solana tx status", status);
    }

  }, 100000 * 1000)

})
