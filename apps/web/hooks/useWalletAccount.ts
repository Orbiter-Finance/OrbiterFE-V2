import { useWalletAddress, useWallets } from '@orbiter-finance/widget'
import React, { useMemo } from 'react'
import { userMainWalletAccountInfoKeyAtom } from '../stores/bridge'
import { useAtomValue } from "jotai"

export default function useWalletAccount() {

  const userMainWalletAccountInfoKey = useAtomValue(userMainWalletAccountInfoKeyAtom)
  const WalletAddress = useWalletAddress()
  const wallets = useWallets()
  const evmWallet = useMemo(() => wallets.find((item) => item.type === "EVM"), [wallets])
  const MainWalletAccountInfo = useMemo(() => wallets.find((item) => item.type === userMainWalletAccountInfoKey), [wallets])

  const prizesWalletAccount = useMemo(() => wallets.find((item) => item.type === userMainWalletAccountInfoKey && (
    ["EVM"].includes(userMainWalletAccountInfoKey)
  )), [wallets, userMainWalletAccountInfoKey, WalletAddress])

  return ({
    evmWallet,
    MainWalletAccountInfo,
    prizesWalletAccount
  })
}
