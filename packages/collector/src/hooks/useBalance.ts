import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { formatUnits } from 'viem'
import { BalanceQueryService } from '@orbiter-finance/wallet-balance'
import { useCollectorContext } from '../page/BridgePage'
import { useOrbiterGetChainsConfig } from './useOrbiterGetChainsConfig'

export function useBalance() {
    const { getChainsConfig } = useOrbiterGetChainsConfig()
    const { orbiterExplore, orbiterClient } = useCollectorContext()
    const balcneService = useMemo(
        () => orbiterExplore && new BalanceQueryService(orbiterExplore),
        [orbiterExplore],
    )

    const getBalance = useCallback(
        async (chainId: string, address: string, symbol: string) => {
            if (!balcneService) return '0'
            const chainConfig = getChainsConfig(chainId)
            if (chainConfig && address) {
                try {
                    const token = chainConfig.tokens
                        .concat([chainConfig.nativeCurrency])
                        .filter((item: any) => {
                            return item.symbol === symbol
                        })?.[0]
                    if (!token || !token?.address) return '0'
                    let balance
                    if (symbol === chainConfig?.nativeCurrency?.symbol) {
                        balance = await balcneService.getNativeBalance(chainId, address)
                    } else {
                        balance = await balcneService.getTokenBalance(
                            chainId,
                            address,
                            token?.address || '',
                        )
                    }
                    balance = formatUnits(BigInt(balance || '0'), token?.decimals || 0)
                    return balance
                } catch (error) {
                    console.log('error', error, chainId, address, symbol)
                    return ''
                }
            }
            return '0'
        },
        [balcneService, getChainsConfig],
    )
    return getBalance
}
