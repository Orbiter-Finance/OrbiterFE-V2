import { useAtomValue } from 'jotai'
import React, { useMemo } from 'react'
import { useWallet } from './useWallet.js'
import { selectToChainAtom, bridgeTargetAddressAtom, showBridgeTargetAddressCardAtom } from '../stores/bridge.js'

export function useTargetAddress() {

    const { getWallet } = useWallet()

    const selectToChain = useAtomValue(selectToChainAtom)

    const bridgeTargetAddress = useAtomValue(bridgeTargetAddressAtom)
    const showBridgeTargetAddressCard = useAtomValue(showBridgeTargetAddressCardAtom)

    const targetAddress = useMemo(() => {

        const toWallet = getWallet(selectToChain)

        if (showBridgeTargetAddressCard || !toWallet?.address) {
            if (bridgeTargetAddress && !!toWallet?.checkAddress(bridgeTargetAddress)) {
                return bridgeTargetAddress
            } else {
                return ""
            }
        } else {
            return toWallet?.address || ""
        }

    }, [bridgeTargetAddress, getWallet, selectToChain, showBridgeTargetAddressCard])

    return ({
        targetAddress
    })
}
