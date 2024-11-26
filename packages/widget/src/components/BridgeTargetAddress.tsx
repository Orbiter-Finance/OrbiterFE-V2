import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { SquarePenIcon, XIcon } from 'lucide-react'
import { OrbiterShow } from '@orbiter-finance/ui'
import { useTargetAddress } from '../hooks/useTargetAddress.js'
import { useWallet } from '../hooks/useWallet.js'
import { pageIsMobileAtom, selectToChainAtom, bridgeTargetAddressAtom } from '../stores/bridge.js'
import { cn } from '../utils/cn.js'
import useBridgeLogEvent from '../hooks/useBridgeLogEvent.js'
import { useWalletAddress } from '../hooks/useWalletAddress.js'
import { useOrbiterGetChainsConfig } from 'src/bridgeInfo/hooks/useOrbiterGetChainsConfig.js'

export function BridgeTargetAddress() {

    const { getWallet } = useWallet()
    const { walletAddress } = useWalletAddress()
    const selectToChain = useAtomValue(selectToChainAtom)
    const { getChainsConfig } = useOrbiterGetChainsConfig()

    const [BridgeTargetAddress, setBridgeTargetAddress] = useAtom(bridgeTargetAddressAtom)
    const [focus, setFocus] = useState(false)
    const [inputFocus, setInputFocus] = useState(false)

    const toChainInfo = useMemo(() => getChainsConfig(selectToChain), [selectToChain, getChainsConfig])

    const toWallet = useMemo(() => {

        const toWallet = getWallet(selectToChain)
        return toWallet

    }, [getWallet, selectToChain, walletAddress])

    const verifyCheck = useMemo(
        () => {
            return !!BridgeTargetAddress && toWallet?.checkAddress(BridgeTargetAddress)
        },
        [toWallet, BridgeTargetAddress, selectToChain],
    )

    const fillAddress = useCallback(
        () => {
            if (!BridgeTargetAddress || !verifyCheck) {
                setBridgeTargetAddress(toWallet?.address || "")
            }
        },
        [toWallet, BridgeTargetAddress, verifyCheck],
    )


    useEffect(() => {
        fillAddress()
    }, [toWallet?.address, selectToChain])

    return (
        <>
            <div
                onClick={(event) => {
                    event.stopPropagation()
                    setFocus(true)
                }}
                className={
                    cn('w-full mt-2 flex justify-between items-center bg-[var(--o-color-gray-900)] border border-[var(--o-color-select-border)] rounded-xl px-3 py-2.5',
                        !BridgeTargetAddress ? (inputFocus ? "border-[var(--o-color-gray-50)]" : "hover:border-[var(--o-color-gray-600)]")
                            : (!verifyCheck && inputFocus ? "border-[var(--o-color-brand-500)]" : "border-[var(--o-color-select-border)]")
                    )
                }>
                <div className='flex flex-1'>
                    <SquarePenIcon className="w-5 h-5 mr-2" stroke='var(--o-color-gray-600)' />
                    <input
                        onFocus={(event) => {
                            event.stopPropagation()
                            setInputFocus(true)
                        }}
                        onBlur={(event) => {
                            event.stopPropagation()
                            setInputFocus(false)
                        }}
                        style={{ userSelect: "all" }} autoFocus={focus} value={BridgeTargetAddress} className='flex-1 text-sm o-font-500' placeholder='Enter address' onChange={(event) => {
                            const val = event.target.value.trim()
                            setBridgeTargetAddress(val)
                        }} />
                </div>
                <div className='ml-2 bg-[var(--o-color-gray-800)] rounded-full flex justify-center items-center border border-[var(--o-color-select-border)]'>
                    <div className='p-1 flex justify-center items-center'>
                        <XIcon
                            className='cursor-pointer w-3 h-3'
                            strokeWidth={2}
                            onClick={(event) => {
                                event.stopPropagation()
                                setBridgeTargetAddress("")
                            }} />

                    </div>
                </div>
            </div>
            <OrbiterShow
                when={!!BridgeTargetAddress && !verifyCheck}
            >
                <div className='text-[var(--o-color-brand-500)] text-sm o-font-500 mt-1'>Enter a valid {toChainInfo?.name || selectToChain} address</div>

            </OrbiterShow>
        </>
    )
}
