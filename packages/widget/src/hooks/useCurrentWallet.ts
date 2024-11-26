import React, { useCallback, useMemo } from 'react'

import { useAtomValue } from 'jotai'
import { selectFromChainAtom, selectToChainAtom } from '../stores/bridge.js'
import { useWallet } from './useWallet.js'

export function useCurrentWallet(isTo?: boolean) {
    const { getWallet } = useWallet()
    const selectFromChain = useAtomValue(selectFromChainAtom)
    const selectToChain = useAtomValue(selectToChainAtom)

    const currentWallet = useMemo(() => {
        return getWallet(
            !isTo ? selectFromChain : selectToChain
        )
    }, [getWallet, isTo, selectFromChain, selectToChain])

    return currentWallet
}
