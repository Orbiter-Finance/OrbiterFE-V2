# Orbiter SDK Document

## 🌕 Overview

- The Orbiter SDK package provides a simplest, out-of-the-box approach to access the Orbiter API to find and execute the best on-chain and cross-chain swapping and bridging.

- For more information about API, please see page: [Orbiter REST API](https://docs.orbiter.finance/developer/rest-api/overview).

## 📦 Installation

You can use following ways to get the latest version of Orbiter SDK.

- npm 

  ```shell
  npm install @orbiter-finance/bridge-sdk
  ```

- yarn

  ```shell
  yarn add @orbiter-finance/bridge-sdk
  ```

- pnpm

  ```shell
  pnpm add @orbiter-finance/bridge-sdk
  ```

Feel free to [report](https://discord.com/invite/FbztTBvnBT) if you encounter any problems.



## 👾 Quick Start

- ### Set up the SDK

  ```javascript
  import {  OrbiterClient, ENDPOINT } from "@orbiter-finance/bridge-sdk";
  const config: ConfigOptions = {
    apiEndpoint: ENDPOINT.TESTNET
    defaultRouterType: RouterType.CONTRACT //Optional, which give priority to the transfer type
  }
  let orbiter: OrbiterClient = await OrbiterClient.create(config);
  ```

  

- ### Check Available TradePair

  ```typescript
  // get all available chains
  const chains: Chain[] = orbiter.getAllChains();
  
  // choose a chain from list to get availabletokens
  const tokens: Token[] = orbiter.getAvailableTokens('chainId');
  
  // choose a chain and a token symbol to get available trade pairs
  const tradePairs: TradePair[] = orbiter.getAvailableTradePairs('chainId', 'symbol');
  
  // or directly get all available trade pairs
  const tradePairs: TradePair[] = orbiter.getAllTradePairs();
  
  // in case you want show all symbols
  const symbols = orbiter.getAllSymbols();
  ```

  > 💡Tips:
  > - You don't have to care about the router type you send transaction, SDK will automatically using the availlable type, unless you know what that way means.



- ### Create Router and Send Transaction

  ##### From EVM Chains

  ```typescript
  import { Wallet, JsonRpcProvider } from "ethers";
  
  // choose a tradePair to create router
  const tradePair: TradePair = {
    srcChainId: '11155111',
    dstChainId: '421614',
    srcTokenSymbol: 'ETH',
    dstTokenSymbol: 'ETH'
  }
  const router = orbiter.createRouter(tradePair);
  
  // check min and max value
  const min = router.getMinSendAmount();
  const max = router.getMaxSendAmount();
  
  // simulationAmount
  const { sendAmount, receiveAmount } = router.simulationAmount('amountBetweenMinAndMax');
  
  // connect wallet
  const provider = new JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
  const wallet = new Wallet('privateKey', provider);
  // check if balance sufficient
  const balance = (await provider.getBalance(wallet)).toString();
  
  // if is erc20 token, need approve
  // const approve = await router.createApprove(account.address, sendAmount);
  // const approveResponce = await wallet.sendTransaction(approve);
  // const approveReceipt = await approveRes.wait();
  
  // create transaction
  const transactionParams = router.createTransaction(wallet.address, 'receiver', sendAmount);
  // send transaction
  const transactionResponce = await wallet.sendTransaction(transactionParams.raw as TransactionRequest);
  const transactionReceipt = await transferResponce.wait();
  
  ```

  ##### From BTC Chains

  ```typescript
  import * as bitcoin from 'bitcoinjs-lib'
  import * as ecc from 'tiny-secp256k1';
  import { ECPairFactory, networks } from 'ecpair';
  
  // choose a tradePair to create router
  const tradePair: TradePair = {
    srcChainId: 'FRACTAL_TEST',
    dstChainId: '11155111',
    srcTokenSymbol: 'BTC',
    dstTokenSymbol: 'BTC'
  }
  const router = orbiter.createRouter(tradePair);
  
  // check min and max value
  const min = router.getMinSendAmount();
  const max = router.getMaxSendAmount();
  
  // simulationAmount
  const { sendAmount, receiveAmount } = router.simulationAmount('amountBetweenMinAndMax');
  
  // creat payment
  const network = networks.bitcoin;
  const ECPair = ECPairFactory(ecc); 
  const keyPair = ECPair.fromWIF(btcPrivateKey, network);
  const payment = bitcoin.payments.p2wpkh({
    pubkey: keyPair.publicKey,
    network,
  });
  
  // create transaction and add output
  const transactionParams = await router.createTransaction(payment.address, 'receiver', sendAmount);
  const psbt = transactionParams.raw as bitcoin.Psbt;
  
  // get utxos from chain
  const utxos = ...
  
  // add inputs
  const script = payment.output;
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
  
  // estimate fee from oracle or explorer
  const fee = ...
  
  // add change !!!important!!!
  const change = totalAmount - Number(sendAmount) - fee;
  if (change > 0) {
    psbt.addOutput({
      script,
      value: change
    });
  }
  
  // sign inputs
  for (let i = 0; i < psbt.inputCount; i++) {
    psbt.signInput(i, keyPair);
    psbt.validateSignaturesOfInput(i, (
      pubkey: Buffer,
      msghash: Buffer,
      signature: Buffer,
    ) => ECPair.fromPublicKey(pubkey).verify(msghash, signature));
  }
  psbt.finalizeAllInputs();
  
  // broadcast
  const broadcastResult = ...
  
  ```

  ##### From Tron Chains

  ```typescript
  import { TronWeb } from 'tronweb';
  
  // choose a tradePair to create router
  const tradePair: TradePair = {
    srcChainId: '3448148188',
    dstChainId: '11155111',
    srcTokenSymbol: 'JST',
    dstTokenSymbol: 'JST'
  }
  const router = orbiter.createRouter(tradePair);
  
  // check min and max value
  const min = router.getMinSendAmount();
  const max = router.getMaxSendAmount();
  
  // simulationAmount
  const { sendAmount, receiveAmount } = router.simulationAmount('amountBetweenMinAndMax');
  
  
  // connect to tronweb
  const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io',
    headers: { "TRON-PRO-API-KEY": 'API key' },
    privateKey: 'privateKey'
  })
  
  // create approve
  const approveParams = await router.createApprove(address, sendAmount);
  // sign and send approve
  const signedApprove = await tronWeb.trx.sign((approveParams.raw as Types.TransactionWrapper).transaction);
  const approveRes = await tronWeb.trx.sendRawTransaction(signedApprove);
  
  // create transaction
  const transactionParams = await router.createTransaction(address, evmAddress, sendAmount);
  // sign and send transaction
  const signedTransaction = await tronWeb.trx.sign((transactionParams.raw as Types.TransactionWrapper).transaction);
  const transferRes = await tronWeb.trx.sendRawTransaction(signedTransaction);
  
  ```

  ##### From Starknet Chains

  ```typescript
  import { Account, Provider, constants, } from 'starknet';
  
  // choose a tradePair to create router
  const tradePair: TradePair = {
    srcChainId: 'SN_SEPOLIA',
    dstChainId: '11155111',
    srcTokenSymbol: 'ETH',
    dstTokenSymbol: 'ETH'
  }
  const router = orbiter.createRouter(tradePair);
  
  // check min and max value
  const min = router.getMinSendAmount();
  const max = router.getMaxSendAmount();
  
  // simulationAmount
  const { sendAmount, receiveAmount } = router.simulationAmount('amountBetweenMinAndMax');
  
  // connect account
  const provider = new Provider({ nodeUrl: constants.NetworkName.SN_SEPOLIA });
  const account = new Account(provider, starknetAddress, privateKey);
  
  // create approve
  const approveParams = await router.createApprove(account.address, sendAmount);
  
  // create transaction
  const transactionParams = router.createTransaction(wallet.address, 'receiver', sendAmount);
  
  // send approve and transaction
  const transactionResponce = await account.execute([approveParams.raw as Call, transactionParams.raw as Call]);
  const transactionReceipt = await provider.waitForTransaction(transactionResponce.transaction_hash);
  
  ```

  ##### From Solana Chains

  ```typescript
  import bs58 from "bs58"
  import { Connection, Keypair, TransactionMessage, VersionedTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js'
  
  // choose a tradePair to create router
  const tradePair: TradePair = {
    srcChainId: 'SOLANA_DEV',
    dstChainId: '11155111',
    srcTokenSymbol: 'USDC',
    dstTokenSymbol: 'USDC'
  }
  const router = orbiter.createRouter(tradePair);
  
  // check min and max value
  const min = router.getMinSendAmount();
  const max = router.getMaxSendAmount();
  
  // simulationAmount
  const { sendAmount, receiveAmount } = router.simulationAmount('amountBetweenMinAndMax');
  
  // connect wallet
  const connection = new Connection('solana-endpoint', "confirmed");
  const sender = Keypair.fromSecretKey(bs58.decode('privateKey'));
  
  // create transaction
  const transactionParams = await router.createTransaction(sender.publicKey.toString(), 'receiver', sendAmount);
  
  // process transaction
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
  
  const signature = await connection.sendRawTransaction(
    transaction.serialize()
  );
  
  //check transaction status
  const status = await connection.getSignatureStatus(signature, {
    searchTransactionHistory: false,
  });
  
  ```

  > 💡Tips: 
  >
  > - The function [createTransfer] will return deferent type of transfer structure which depends on source chain type, for EVM it will be TransactionRequest, for BTC will be a PSBT for Starknet will be Call, etc. For more information please see their official document.

- ### Check Bridge Status

  ```typescript
  const transactionStatus = await orbiter.checkTransactionStatus(hash);
  ```

- ### Check User Opoints and Transaction History

  ```typescript
  // get user Opoints
  const opoints = await orbiter.getUserOpoint(wallet.address);
  
  // get user transaction history
  const history = await orbiter.getTransactionHistory(wallet.address, 0);
  ```

  > 💡Tips: 
  >
  > - For structure of result on these two function, please check [Orbiter REST API](https://docs.orbiter.finance/developer/rest-api/overview).