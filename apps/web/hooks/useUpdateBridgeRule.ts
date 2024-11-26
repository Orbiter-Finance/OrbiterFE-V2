import { useUpdateChainAndToken } from '@orbiter-finance/widget'
import React, { useCallback } from 'react'

export default function useUpdateBridgeRule() {
  const { updateSelectFromChain, updateSelectToChain, updateSelectToken } = useUpdateChainAndToken()
  const UpdateBridgeRule = useCallback(
    ({
      fromChain,
      toChain,
      token
    }) => {
      updateSelectFromChain(fromChain)
      updateSelectToChain(toChain)
      updateSelectToken(token)
    },
    [],
  )

  return ({
    UpdateBridgeRule
  })

}
