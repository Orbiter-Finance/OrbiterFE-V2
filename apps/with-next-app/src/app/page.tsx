'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {WaleltConnectButton,useWallet} from '@orbiter-finance/wallet-kit'
import React, { createContext } from "react";
import { useRouter } from 'next/navigation'

function Page() {
  const router = useRouter()
  const {connectWallet}= useWallet()
  const openConnectWallet = (type:any) => {
    connectWallet(type);
  }
  const goWalletBalancePage = () => {
    router.push('/wallet-balance')
  }
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 12,
      }}
    >
      <WaleltConnectButton />
      <ConnectButton />
      <button onClick={() => openConnectWallet("evm")}>EVM Connect</button>
      <button onClick={() => openConnectWallet("starknet")}>Starknet Connect</button>
      <button onClick={goWalletBalancePage}>Go WalletBalance</button>
    </div>
  );
}



export default Page;
