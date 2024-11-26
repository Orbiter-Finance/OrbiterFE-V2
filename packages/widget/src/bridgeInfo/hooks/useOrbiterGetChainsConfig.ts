import React, { useCallback, useContext } from 'react'
import { BridgeInfoContext } from '../providers.js'

export function useOrbiterGetChainsConfig() {
  const { orbiterClient } = useContext(BridgeInfoContext)

  const getChainsConfig = useCallback(
    (chainId: string) => {
      if (!orbiterClient) return null
      return orbiterClient.getChainConfig(chainId)
    },
    [orbiterClient],
  )

  return ({
    getChainsConfig
  })

}
