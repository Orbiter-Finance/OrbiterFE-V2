"use client"
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useStarknetWallet } from './useStarknetWallet';
import * as wagmi from 'wagmi';
import { injected } from 'wagmi/connectors'

export const useWallet = () => {
  const { openConnectModal } = useConnectModal();
  const { connect: connectEvmWallet } = wagmi.useConnect()
  // const { address: evmAddress, connect: connectEvmWallet } = useConnect();
  const {  connectStarknetWallet } = useStarknetWallet();

  const connectWallet = (chain: 'evm' | 'ton' | 'starknet') => {
    switch (chain) {
      case 'evm':
        // connectEvmWallet({connector: injected()});
        openConnectModal && openConnectModal()
        break;
      case 'starknet':
        connectStarknetWallet();
        break;
      default:
        throw new Error('Unsupported chain');
    }
  };

  return {
    // starknetWallet,
    connectWallet
  };
};