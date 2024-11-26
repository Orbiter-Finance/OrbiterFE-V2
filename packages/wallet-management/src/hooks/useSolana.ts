import React from 'react';
import { WalletType } from '../types';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { VM } from '../constant';
import { PublicKey, Transaction} from '@solana/web3.js';
import {
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import { useWalletConfigContext } from 'src/providers/WalletConfigProvider'
import { Connection } from '@solana/web3.js'

export function useSolana(): WalletType {

  const { setVisible } = useWalletModal();

  const { disconnect, signTransaction, publicKey, wallet } = useWallet();
  const { adapter } = wallet || {};

  const {  exploreLink } = useWalletConfigContext()

  const switchChain = async () => {
  };

  const checkChain = (chainId: string) => {
    return true
  };

  const connect = async () => {
    setVisible(true);
  };

  const checkAddress = (address: string) => {
    try {
      const publicKey = new PublicKey(address);
      console.log('Valid Solana address:', publicKey.toString());
      return true;
    } catch (error) {
      console.error('Invalid Solana address:', error);
      return false;
    }
  };

  const getBalance = async ({ chainId, token, user, isMainnet }: { chainId: string, token: string, user: string; isMainnet?: boolean; }) => {
    try {

      const rpc= exploreLink.getChain(chainId)?.rpc?.[0] || ""

      const connection = new Connection(rpc, "confirmed")

      let balanceString = '';

      if (isMainnet) {
        const balance = await connection.getBalance(
          new PublicKey(user)
        );
        balanceString = String(balance || '0');
      } else {
        const fromTokenAcount = await getOrCreateAssociatedTokenAccount(
          connection,
          new PublicKey(user) as any,
          new PublicKey(token),
          new PublicKey(user),
          true
        );
        const balance = await connection.getTokenAccountBalance(
          fromTokenAcount.address
        );
        const amount = balance?.value?.amount;
        balanceString = String(amount || '0');
      }
      return balanceString;
    } catch (error) {
      return '0';
    }
  };


  const transfer = async ({params, chainId}: any) => {
    if (!signTransaction || !publicKey) return "";

    const rpc= exploreLink.getChain(chainId)?.rpc?.[0] || ""
    console.log("rpc", rpc)
      const connection = new Connection(rpc, "confirmed")

    const recentBlockhash = await connection.getLatestBlockhash('confirmed');

    const tokenTransaction = new Transaction({
      recentBlockhash: recentBlockhash.blockhash,
      feePayer: publicKey,
    }).add(
      params
    );

    const signedTx = await signTransaction(tokenTransaction)
    // versionedTransaction.sign([publicKey as any]);

    const signature = await connection.sendRawTransaction(signedTx.serialize())
    return signature;
  };

  const emitGas = async () => {
    return "";
  };


  return ({
    address: publicKey?.toString() || "",
    chainId: "",
    chainName: "",
    vm: [VM.SOLANAVM],
    switchChain,
    getBalance,
    connect,
    checkAddress,
    transfer,
    walletId: '',
    walletName: adapter?.name || '',
    walletIcon: adapter?.icon || '',
    disConnectAsync: disconnect,
    isMainnet: false,
    emitGas,
    type: "Solana",
    checkChain,
    defaultChain: "SOLANA_MAIN"
  });
}
