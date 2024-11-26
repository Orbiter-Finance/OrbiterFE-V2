import React from 'react'
import { useSetAtom } from 'jotai'
import { selectFromChainAtom, selectToChainAtom, selectTokenAtom } from 'src/stores/bridge'

export function useUpdateChainAndToken() {
    const updateSelectFromChain = useSetAtom(selectFromChainAtom)
    const updateSelectToChain = useSetAtom(selectToChainAtom)
    const updateSelectToken = useSetAtom(selectTokenAtom)
    return ({
        updateSelectFromChain,
        updateSelectToChain,
        updateSelectToken
    })
}
