import { useAtomValue, useSetAtom } from 'jotai'
import React, { useCallback, useContext, useEffect } from 'react'
import { useOrbiterGetChainsConfig } from '../bridgeInfo/hooks/useOrbiterGetChainsConfig'
import { bridgeRouterGasFeeGroupAtom, selectFromChainAtom, selectTokenAtom } from '../stores/bridge'
import { BridgeInfoContext } from '../bridgeInfo/providers'
import { useTransactionRouter } from '../bridgeInfo/hooks/useTransactionRouter'
import { formatEther, parseEther, parseUnits } from 'viem'

const GAS_FEE_MULTIPLE = "15"

export function useRouterGasFee() {

  const selectFromChain = useAtomValue(selectFromChainAtom)
  const selectToken = useAtomValue(selectTokenAtom)
  const { getChainsConfig } = useOrbiterGetChainsConfig()
  const { orbiterFeeEstimator } = useContext(BridgeInfoContext)
  const setBridgeRouterGasFeeGroup = useSetAtom(bridgeRouterGasFeeGroupAtom)
  const router = useTransactionRouter()

  const getRouterGasFee = useCallback(
    async () => {
      setBridgeRouterGasFeeGroup({
        isError: false,
        pending: false,
        value: ""
      })
      if (!router) return
      setBridgeRouterGasFeeGroup({
        isError: false,
        pending: true,
        value: ""
      })
      try {
        const chainInfo = getChainsConfig(selectFromChain)
        if (chainInfo?.nativeCurrency?.symbol !== selectToken) {
          setBridgeRouterGasFeeGroup({
            isError: false,
            pending: false,
            value: ""
          })
          return ""
        }
        const gas = await orbiterFeeEstimator?.getFeeEstimateForRouter(router)
        const fee = formatEther(parseEther(gas?.fee || "0") * parseUnits(GAS_FEE_MULTIPLE, 1) / parseUnits("10", 1))
        setBridgeRouterGasFeeGroup({
          isError: false,
          pending: false,
          value: fee
        })
        return fee
      } catch (error) {
        setBridgeRouterGasFeeGroup({
          isError: true,
          pending: false,
          value: ""
        })
        return ""
      }
    },
    [selectFromChain, selectToken, getChainsConfig, orbiterFeeEstimator, router],
  )
  return ({
    getRouterGasFee
  })
}
