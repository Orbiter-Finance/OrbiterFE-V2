import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useWallets } from '@orbiter-finance/wallet-management'

export function useWallet() {
    const wallets = useWallets()
    const wallet = useMemo(() => {
        return wallets.find((item) => item.type === 'EVM')
    }, [wallets])
    const address = useMemo(() => {
        return wallet?.address || ''
    }, [wallet])

    return { address, wallet }
}
