"use client"

import { useSetAtom } from 'jotai'
import React, { useCallback, useContext, useEffect } from 'react'
import { pageIsMobileAtom, selectFromChainAtom, selectToChainAtom, selectTokenAtom } from '../stores/bridge.js'
import { BridgeInfoContext } from 'src/bridgeInfo/providers.js'

export interface InitialDataType {
  fromChain?: string
  toChain?: string
  token?: string
}

export const AtomCom = React.memo(({
  initialData
}: {
  initialData?: InitialDataType
}) => {

  const { orbiterClient } = useContext(BridgeInfoContext)

  const setSelectFromChain = useSetAtom(selectFromChainAtom)
  const setSelectToChain = useSetAtom(selectToChainAtom)
  const setSelectToken = useSetAtom(selectTokenAtom)

  useEffect(() => {

    if (orbiterClient) {
      let fromChain: string | null = ""
      let toChain: string | null = ""
      let token: string | null = ""

      if (typeof window !== "undefined") {
        const searchParams = new URLSearchParams(window.location.search)
        fromChain = searchParams.get("src_chain")
        toChain = searchParams.get("tgt_chain")
        token = searchParams.get("src_token")
      }

        setSelectFromChain(fromChain || initialData?.fromChain || "")
        setSelectToChain(toChain || initialData?.toChain || "")
        setSelectToken(token || initialData?.token || "ETH")
    }

  }, [initialData, orbiterClient])

  return (
    null
  )
})
