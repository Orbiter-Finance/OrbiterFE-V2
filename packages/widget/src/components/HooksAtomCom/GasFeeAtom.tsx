
import React, { useContext, useEffect } from 'react'
import { useRouterGasFee } from '../../hooks/useRouterGasFee'
import { useTransactionRouter } from 'src/bridgeInfo/hooks/useTransactionRouter'
import { BridgeInfoContext } from 'src/bridgeInfo/providers'


const GasFeeAtom = () => {
  const { getRouterGasFee } = useRouterGasFee()

  const { orbiterFeeEstimator } = useContext(BridgeInfoContext)
  const router = useTransactionRouter()

  useEffect(() => {
    if (router && orbiterFeeEstimator) {
      getRouterGasFee()
    }
  }, [router, orbiterFeeEstimator, getRouterGasFee])
  return (
    null
  )
}


export default React.memo(GasFeeAtom)