import React, { useCallback, useContext } from 'react'
import { useCollectorContext } from '../page/BridgePage'

export const useOrbiterGetChainsConfig: () => {
    getChainsConfig: (chainId: string) => any
} = () => {
    const { orbiterClient } = useCollectorContext()

    const getChainsConfig = useCallback(
        (chainId: string) => {
            if (!orbiterClient) return null
            return orbiterClient.getChainConfig(chainId)
        },
        [orbiterClient],
    )

    return {
        getChainsConfig,
    }
}
