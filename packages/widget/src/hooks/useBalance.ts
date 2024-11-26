import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { formatUnits } from 'viem'
import { useOrbiterGetChainsConfig } from '../bridgeInfo/hooks/useOrbiterGetChainsConfig.js'
import { bridgeBalanceDataGroupAtom, bridgeCurrentChainBalanceAtom, orbiterExploreInitAtom, selectFromChainAtom, selectToChainAtom, selectTokenAtom } from '../stores/bridge.js'
import { useCurrentWallet } from './useCurrentWallet.js'
import { BalanceQueryService } from '@orbiter-finance/wallet-balance'
import { BridgeInfoContext } from '../bridgeInfo/providers.js'
import { useWallet } from './useWallet.js'
import useDisPatchBalance from './useDisPatchBalance.js'
import { useWalletAddress } from './useWalletAddress.js'

export function useBalance() {
    const wallet = useCurrentWallet()
    const { walletAddress } = useWalletAddress()
    const { getWallet } = useWallet()
    const selectFromChain = useAtomValue(selectFromChainAtom)
    const selectToChain = useAtomValue(selectToChainAtom)
    const selectToken = useAtomValue(selectTokenAtom)
    const orbiterExploreInit = useAtomValue(orbiterExploreInitAtom)
    const { getChainsConfig } = useOrbiterGetChainsConfig()
    const { orbiterExplore, allChains, orbiterClient } = useContext(BridgeInfoContext)

    const setBridgeCurrentChainBalance = useSetAtom(bridgeCurrentChainBalanceAtom)
    const bridgeBalanceDataGroup = useAtomValue(bridgeBalanceDataGroupAtom)

    const { updateBalance } = useDisPatchBalance()

    const balcneService = useMemo(() => orbiterExplore && new BalanceQueryService(orbiterExplore), [orbiterExplore])

    const getBalance = useCallback(
        async (chainId: string, address: string, symbol: string) => {
            if (!balcneService || !address) return "0"
            const chainConfig = getChainsConfig(chainId)
            if (chainConfig && address) {
                try {
                    const token = chainConfig.tokens.concat([chainConfig.nativeCurrency]).filter((item: any) => {
                        return item.symbol === symbol
                    })?.[0]
                    if (!token || !token?.address) return "0"
                    let balance
                    if (symbol === chainConfig?.nativeCurrency?.symbol) {
                        balance = await balcneService.getNativeBalance(chainId, address)
                    } else {
                        balance = await balcneService.getTokenBalance(chainId, address, token?.address || "")
                    }
                    balance = formatUnits(BigInt(balance || "0"), token?.decimals || 0)
                    return balance
                } catch (error) {
                    console.log("error", error, chainId, address, symbol)
                    return ""
                }
            }
            return "0"
        },
        [balcneService, getChainsConfig],
    )

    const getCurrentBalance = useCallback(
        async () => {
            if (!orbiterExplore) return "0"

            const user = wallet?.address
            const toWallet = getWallet(selectToChain)
            if (!user || !selectFromChain || !selectToken || !selectToChain) {
                setBridgeCurrentChainBalance([{
                    pending: false,
                    balance: "0",
                    error: false,
                    chainId: selectToChain
                }])
                return ""
            }
            let balance = ["", ""]
            let error = false
            try {
                balance = await Promise.all([getBalance(selectFromChain, wallet.address, selectToken),
                    getBalance(selectToChain, toWallet?.address || "", selectToken)
                ])
                return balance
            } catch (error) {
                console.log("error", error)
                error = true
                return ""
            } finally {
                setBridgeCurrentChainBalance([
                    {
                        pending: false,
                        balance: balance?.[0] || "",
                        error,
                        chainId: selectFromChain
                    },
                    {
                        pending: false,
                        balance: balance?.[1] || "",
                        error,
                        chainId: selectToChain
                    }
                ])
                return balance
            }
        },
        [selectFromChain, wallet?.address, selectToken, getChainsConfig, orbiterExplore, walletAddress, bridgeBalanceDataGroup, getBalance]
    )

    const getAllBalance = useCallback(
        async () => {
            if (!orbiterExploreInit) return []
            const allSymbols = (orbiterClient?.getAvailableTokens(selectFromChain) || [])
            let list: Array<{ chainId: string, address: string, symbol: string }> = []
            allChains.forEach((item) => {
                const wallet = getWallet(item.id)
                if (item.id !== selectFromChain && walletAddress && wallet?.address && ((bridgeBalanceDataGroup.walletAddress !== walletAddress) || item.id === bridgeBalanceDataGroup.chainId || bridgeBalanceDataGroup.token !== selectToken)) {
                    list = list.concat([{
                        chainId: item.id,
                        address: wallet?.address || "",
                        symbol: selectToken
                    }])
                }
            })
            allSymbols.forEach((item) => {
                if (wallet?.address && walletAddress) {
                    list = list.concat([{
                        chainId: selectFromChain,
                        address: wallet?.address || "",
                        symbol: item.symbol
                    }])
                }
            })
            list = list.filter((item) => {
                const chainConfig = getChainsConfig(item.chainId)
                if (!chainConfig) {
                    return false
                }

                const token = chainConfig.tokens.concat([chainConfig.nativeCurrency]).find((item: any) => {
                    return item.symbol === item.symbol
                })

                return token && token?.address
            })
            if (!list.length) return ""

            const res = await Promise.all((list.map((item) => getBalance(item.chainId, item.address, item.symbol))))
            updateBalance({
                walletAddress,
                chainId: selectFromChain,
                token: selectToken,
                bridgeList: list.map((item, index) => ({
                    chainId: item.chainId,
                    symbol: item.symbol,
                    walletAddress: item.address,
                    balance: res?.[index] || "",
                    pending: true
                }))
            })
        },
        [walletAddress, orbiterExploreInit, allChains, orbiterClient, getChainsConfig, selectFromChain, selectToken, wallet, bridgeBalanceDataGroup],
    )

    return ({
        getBalance,
        getAllBalance,
        getCurrentBalance
    })
}
