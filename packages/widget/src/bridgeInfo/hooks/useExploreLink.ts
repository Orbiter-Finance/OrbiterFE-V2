import React, { useCallback, useContext } from 'react'
import { BridgeInfoContext } from '../providers'

enum Explorepath {
    ACCOUNT = "ACCOUNT",
    TOKEN = "TOKEN",
    TRANSACTION = "TRANSACTION"
}

export function useExploreLink() {

    const { orbiterExplore } = useContext(BridgeInfoContext)

    const getChainInfo = useCallback(
        ({ chainId }: { chainId: string }) => {
            return orbiterExplore?.getChain(chainId)
        },
        [orbiterExplore],
    )
    const getExploreLink = useCallback(
        ({ type, chainId, value }: { type: Explorepath, chainId: string, value: string }) => {
            if (!orbiterExplore) return ""
            let link = ""
            try {
                if (type === Explorepath.ACCOUNT) {
                    link = orbiterExplore.getAccountLink(chainId, value)
                } else if (type === Explorepath.TOKEN) {
                    link = orbiterExplore.getTokenLink(chainId, value)
                } else if (type === Explorepath.TRANSACTION) {
                    link = orbiterExplore.getTransactionLink(chainId, value)
                } else {
                    link = ""
                }
                return link
            } catch (error) {
                return ""
            }

        },
        [orbiterExplore],
    )

    const getExploreAccountLink = useCallback(
        ({ chainId, value }: { chainId: string, value: string }) => {
            const link = getExploreLink({
                type: Explorepath.ACCOUNT,
                chainId,
                value
            })
            return link
        },
        [getExploreLink],
    )

    const getExploreTokenLink = useCallback(
        ({ chainId, value }: { chainId: string, value: string }) => {
            const link = getExploreLink({
                type: Explorepath.TOKEN,
                chainId,
                value
            })
            return link
        },
        [getExploreLink],
    )


    const getExploretransactionLink = useCallback(
        ({ chainId, value }: { chainId: string, value: string }) => {
            const link = getExploreLink({
                type: Explorepath.TRANSACTION,
                chainId,
                value
            })
            return link
        },
        [getExploreLink],
    )


    return ({
        getChainInfo,
        getExploreLink,
        getExploreAccountLink,
        getExploreTokenLink,
        getExploretransactionLink
    })
}
