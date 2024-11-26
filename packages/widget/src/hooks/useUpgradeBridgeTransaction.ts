import React from 'react'
import { useSetAtom } from 'jotai'
import { bridgeTransactionAtom, bridgeTransactionRefreshAtom, BridgeTransactionType } from '../stores/bridge.js'

export function useUpgradeBridgeTransaction() {
    const setBridgeTransaction = useSetAtom(bridgeTransactionAtom)
    const setBridgeTransactionRefresh = useSetAtom(bridgeTransactionRefreshAtom)
    const upgradeBridgeTransaction = React.useCallback(
        (params: BridgeTransactionType) => {
            setBridgeTransactionRefresh(+new Date())
            setBridgeTransaction(params)
        },
        [setBridgeTransaction],
    )

    return ({
        upgradeBridgeTransaction
    })

}
