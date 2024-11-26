import React, { useCallback, useContext } from 'react'
import { useTargetAddress } from './useTargetAddress.js'
import { useWallet } from './useWallet'
import { useSetAtom } from 'jotai'
import { bridgeTargetAddressAtom } from '../stores/bridge.js'
import { BridgeInfoContext } from '../bridgeInfo/providers.js'

export default function useSwitchChainFillAddress() {
    const { targetAddress } = useTargetAddress()
    const { getWallet } = useWallet()
    const setBridgeTargetAddress = useSetAtom(bridgeTargetAddressAtom)
    const { isTelegram } = useContext(BridgeInfoContext)

    const switchChainFillAddress = useCallback(
        (chainId: string) => {
            try {
                const toWallet = getWallet(chainId)
                if (!targetAddress || !toWallet?.checkAddress(targetAddress)) {
                    setBridgeTargetAddress(toWallet?.address || "")
                }
            } catch (error) {
                console.log("switchChainFillAddress 111111")
            }
        },
        [],
    )

    return ({
        switchChainFillAddress
    })

}
