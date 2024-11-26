import React, { useCallback } from 'react'
import useUpdateBridgeRule from '../../hooks/useUpdateBridgeRule'
import { HOST_ENV_MAINNET } from '../constant'

export default function usePrizesUpdateBridgeRule() {

  const { UpdateBridgeRule } = useUpdateBridgeRule()


  const PrizesUpdateBridgeRule = useCallback(
    () => {
      UpdateBridgeRule({
        fromChain: HOST_ENV_MAINNET ? "1" : "11155111",
        toChain: HOST_ENV_MAINNET ? "SUI_MAIN" : "SUI_TEST",
        token: "USDC"
      })
    },
    [HOST_ENV_MAINNET, UpdateBridgeRule],
  )

  return ({
    PrizesUpdateBridgeRule
  })

}
