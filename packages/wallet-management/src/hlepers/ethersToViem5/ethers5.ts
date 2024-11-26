import React from 'react';
import {
  useWalletClient
} from 'wagmi'
import { providers } from 'ethers5'
import { WalletClient } from 'viem'
import { useMemo } from 'react'

function walletClientToSigner5(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient

  if (!chain) throw new Error('Chain not found in public client')
  if (!account) throw new Error('Account not found in public client')

  const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
  }

  // Force disable type checking of transport
  // See https://github.com/wagmi-dev/viem/discussions/792#discussioncomment-6297530
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner5({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId })
  return useMemo(
      () => walletClient ? walletClientToSigner5(walletClient as any) : undefined,
      [walletClient],
  )
}