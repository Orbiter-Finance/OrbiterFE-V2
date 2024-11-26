"use client";

import React, { useEffect, useState } from 'react';
import { WalletType } from '../types';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useWalletModal } from '@tronweb3/tronwallet-adapter-react-ui';
import { VM } from '../constant';
export function useTron(): WalletType {

  const { setVisible } = useWalletModal();
  const { wallet, disconnect } = useWallet();

  const [account, setAccount] = useState('');

  const adapter = wallet?.adapter;

  useEffect(() => {
    setAccount(adapter?.address!);

    adapter?.on('connect', () => {
      setAccount(adapter?.address!);
    });

    adapter?.on('readyStateChanged', (state) => {
      console.log("readyStateChanged", state);
    });

    adapter?.on('accountsChanged', (data) => {
      console.log("accountsChanged", data);
    });

    adapter?.on('chainChanged', (data) => {
      console.log("chainChanged", data);
    });

    adapter?.on('disconnect', () => {
      console.log("disconnect");
    });
    return () => {
      // remove all listeners when components is destroyed
      adapter?.removeAllListeners();
    };
  }, [adapter]);

  async function sign() {
    const res = await adapter!.signMessage('helloworld');
  }

  const connect = async () => {
    // await adapter?.connect()
    // await adapter?.switchChain("0xcd8690dc")
    // t.openConnectingModal()
    setVisible(true);
  };

  const switchChain = async () => {

  };

  const getBalance = async ({ chainId, token, user, isMainnet }: { chainId: string, token: string, user: string; isMainnet?: boolean; }) => {
    const tronweb3 = (wallet?.adapter as any)["_wallet"].tronWeb;
    if (isMainnet) {
      const res = await tronweb3.trx.getBalance();
      return String(res || 0);
    } else {
      const contract = await tronweb3.contract().at(token);
      const balance = await contract.methods.balanceOf(user).call();
      return balance.toString();
    }
  };

  const checkChain = (chainId: string) => {
    return true
  };

  const checkAddress = (address: string) => {
    try {
      const tronweb3 = (wallet?.adapter as any)["_wallet"].tronWeb;
      return tronweb3.isAddress(address);
    } catch (error) {
      return false;
    }
  };

  const transfer = async ({ params, allowance, approve, isMainnet, value, token }: any) => {
    console.log("wallet", wallet)
    const tokenAddress = token.address
    const tronweb3 = (wallet?.adapter as any)["_wallet"].tronWeb
    if (tronweb3 && !isMainnet && allowance && approve) {
      const contract = await tronweb3.contract().at(tokenAddress)
      const allowanceAmount = await contract.allowance(adapter?.address, approve.spenderAddress).call()
      if (Number(allowanceAmount) < Number(value)) {
        const result = await tronweb3.trx.sign(approve.raw.transaction)
        const tx = await tronweb3.trx.sendRawTransaction(result)
      }
    }
    const result = await tronweb3.trx.sign(params.transaction)
    const tx = await tronweb3.trx.sendRawTransaction(result)
    console.log("tx", tx)
    return tx?.transaction?.txID || ""
  }

  const disConnectAsync = async () => {
    await disconnect();
  };
  const emitGas = async () => {
    return "";
  };

  // const network = adapter?.network
  return ({
    address: adapter?.address || "",
    chainId: "",
    chainName: "",
    vm: [VM.TRONVM],
    switchChain,
    getBalance,
    connect,
    checkAddress,
    transfer,
    walletId: adapter?.name || '',
    walletName: adapter?.name || '',
    walletIcon: adapter?.icon || '',
    disConnectAsync,
    isMainnet: false,
    emitGas,
    type: "Tron",
    checkChain,
    defaultChain: "728126428"

  });
}
