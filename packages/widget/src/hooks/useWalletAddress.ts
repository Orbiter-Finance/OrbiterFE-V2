import React from 'react'
import { useWallets } from '@orbiter-finance/wallet-management'

export function useWalletAddress() {
  const wallets = useWallets()

  const walletAddress = React.useMemo(() => {
    return wallets.filter((item) => item.address).map((item) => item.address).join(",")
  }, [wallets])
  return ({
    walletAddress
  })
}
