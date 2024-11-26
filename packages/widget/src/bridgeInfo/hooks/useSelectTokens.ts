import React, { useContext, useMemo } from 'react'

import { useAtomValue } from "jotai"
import { BridgeInfoContext } from '../providers.js'
import { selectFromChainAtom } from '../../stores/bridge.js'
export interface ITokenItem {
    symbol: string
    icon: string
    name: string
    address: string
    disabled: boolean
}
export function useSelectTokens(): ITokenItem[] {
    const { orbiterClient } = useContext(BridgeInfoContext)
    const selectFromChain = useAtomValue(selectFromChainAtom)
    const allSymbols = (orbiterClient?.getAllSymbols() || [])
    const chainTokens = orbiterClient?.getAvailableTokens(selectFromChain) || []
    const tokens: ITokenItem[] = useMemo(() => {
        if (allSymbols?.length) {
            return allSymbols.map((item) => {
                const group = chainTokens.find((chainToken) => chainToken.symbol === item)
                return ({
                    symbol: group?.symbol || item,
                    icon: group?.symbol || item,
                    name: group?.name || item,
                    address: group?.address || "",
                    disabled: !group
                })
            })
        } else {
            return chainTokens.map((item) => ({
                symbol: item.symbol,
                icon: item.symbol,
                name: item.name,
                address: item.address,
                disabled: false
            }))
        }
    }, [orbiterClient, allSymbols, chainTokens, selectFromChain])
    return tokens
}
