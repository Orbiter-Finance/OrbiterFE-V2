import { useSetAtom } from 'jotai'
import React, { useCallback, useContext } from 'react'
import { BridgeInfoContext } from 'src/bridgeInfo/providers'
import { selectFromChainAtom, selectToChainAtom, selectTokenAtom } from 'src/stores/bridge'

export default function useSelectDisabledTokenUpdateChain() {

  const setSelectFromChain = useSetAtom(selectFromChainAtom)
  const setSelectToChain = useSetAtom(selectToChainAtom)
  const setSelectToken = useSetAtom(selectTokenAtom)

  const { allChains, orbiterClient } = useContext(BridgeInfoContext)

  const selectDisabledTokenUpdateChain = useCallback(
    (token: string, call?: () => void) => {
      if (allChains?.length && orbiterClient) {

        const group = allChains.find((item) => {
          return orbiterClient.getAvailableTradePairs(item.id, token)?.length && !item.disabled
        })
        if (!group) return
        const data = orbiterClient.getAvailableTradePairs(group.id, token)[0]
        if (!data) return

        setSelectFromChain(data.srcChainId)
        setSelectToChain(data.dstChainId)
        setSelectToken(data.srcTokenSymbol)
        call && call()
      }
    },
    [orbiterClient, allChains],
  )

  return ({
    selectDisabledTokenUpdateChain
  })

}
