import React, { useContext, useEffect, useMemo } from 'react'
import { useAtom, useAtomValue } from "jotai"
import { Chain } from '@orbiter-finance/bridge-sdk'
import { BridgeInfoContext, ChainViewType } from '../providers.js'
import { selectFromChainAtom, selectToChainAtom, selectTokenAtom } from '../../stores/bridge.js'

export interface ChainListType extends Chain {
    disabled?: boolean
}

export interface ChainConfigItemType extends ChainViewType {
    classify: string[]
    recommend: boolean,
    tags: string[]
}

export function useSelectChains(
    isTo?: boolean
): ChainConfigItemType[] {
    const { orbiterClient, allChains, selectChainConfig } = useContext(BridgeInfoContext)
    const selectFromChain = useAtomValue(selectFromChainAtom)
    const [selectToChain, setSelectToChain] = useAtom(selectToChainAtom)
    const [selectToken, setSelectToken] = useAtom(selectTokenAtom)
    useEffect(() => {
        if (!!orbiterClient && selectFromChain) {
            const tokens = orbiterClient?.getAvailableTokens(selectFromChain) || []
            const tokenFlag = tokens.some((item) => item.symbol === selectToken)
            const token = tokens[0]?.symbol || ""
            let list = (orbiterClient?.getAvailableTradePairs(selectFromChain, selectToken) || [])
            let toChainId = selectToChain
            if (!tokenFlag) {
                setSelectToken(token)
                list = orbiterClient?.getAvailableTradePairs(selectFromChain, token) || []
            }
            const chainFlag = list.some((item) => item.dstChainId === selectToChain)
            toChainId = list[0]?.dstChainId || ""
            if (!chainFlag) {
                setSelectToChain(toChainId)
            }
        }

    }, [orbiterClient, selectFromChain, selectToken, selectToChain])

    const toChain = useMemo(() => {
        if (!orbiterClient || !selectFromChain) return []
        let list = (orbiterClient?.getAvailableTradePairs(selectFromChain, selectToken) || [])

        const toChainList = allChains.map((item) => {
            const flag = list.some((option) => option.dstChainId === item.id)
            const group = list.filter((option) => option.dstChainId === item.id)[0]
            return ({
                ...item,
                disabled: !flag,
            })
        })
        return toChainList.filter((item) => !item?.disabled).concat(
            toChainList.filter((item) => !!item.disabled)
        ).filter((item) => {
            return item.id !== selectFromChain
        })
    }, [orbiterClient, selectFromChain, selectToken, allChains, setSelectToken])

    return useMemo(() => {
        const allChainsList = (!isTo ? allChains : toChain)
        const selectChainList = selectChainConfig.map((item) => {
            const group = allChainsList.find((option) => item.chainId === option.id)
            return group
        }).filter((item) => !!item).concat(allChainsList.filter((item) => {
            return !selectChainConfig.some((option) => option.chainId === item.id)
        }))

        const chainList = selectChainList.map((item) => {
            const group = selectChainConfig.filter((option) => option.chainId === item.id)?.[0]

            return ({
                ...item,
                classify: [...(group?.classify || [])],
                recommend: !!group?.recommend && !item.disabled,
                tags: group?.tags || []
            })
        })
        return chainList.filter((item) => !item.disabled).concat(
            chainList.filter((item) => !!item.disabled)
        )
    }, [isTo, allChains, toChain, selectChainConfig])
}