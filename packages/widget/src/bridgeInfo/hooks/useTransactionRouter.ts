import { useAtomValue } from 'jotai'
import React, { useContext, useMemo } from 'react'
import { TradePair } from '@orbiter-finance/bridge-sdk'
import { selectFromChainAtom, selectToChainAtom, selectTokenAtom } from '../../stores/bridge.js'
import { BridgeInfoContext } from '../providers.js'

export function useTransactionRouter() {

  const { orbiterClient } = useContext(BridgeInfoContext)
  const selectFromChain = useAtomValue(selectFromChainAtom)
  const selectToChain = useAtomValue(selectToChainAtom)
  const selectToken = useAtomValue(selectTokenAtom)

  const router = useMemo(() => {
    if (!orbiterClient) return null
    try {
      const tradePair: TradePair = {
        srcChainId: selectFromChain,
        dstChainId: selectToChain,
        srcTokenSymbol: selectToken,
        dstTokenSymbol: selectToken,
      }
      const router = orbiterClient?.createRouter(tradePair)
      return router
    } catch (error) {
      return null
    }
  }, [selectFromChain, selectToChain, selectToken, orbiterClient])

  return (
    router
  )
}
