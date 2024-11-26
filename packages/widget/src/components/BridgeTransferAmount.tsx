import React, { useState } from 'react'
import { useAtom } from 'jotai'
import { useBridgeRouter } from '../hooks/useBridgeRouter.js'
import { bridgetTransferAmountAtom } from '../stores/bridge.js'

export function BridgeTransferAmount() {

    const [focus, setFocus] = useState(false)
    const { srcToken, dstToken, min, max } = useBridgeRouter()
    const [bridgetTransferAmount, setBridgetTransferAmount] = useAtom(bridgetTransferAmountAtom)

    const minAmount = min || "0"
    const maxAmount = max || "0"

    return (
        <input
            style={{ userSelect: "all" }}
            autoFocus={focus}
            className='text-right text-2xl placeholder:text-[var(--o-color-gray-600)] o-font-500 flex-1 min-w-28'
            placeholder={`${minAmount} ~ ${maxAmount}`}
            value={bridgetTransferAmount}
            onClick={(event) => {
                event.stopPropagation()
                setFocus(true)
            }}
            onChange={(event) => {

                const val = event.target.value.trim()

                if (!dstToken?.decimals || !srcToken?.decimals) return

                const decimals = Number(srcToken?.decimals) > Number(dstToken?.decimals) ? dstToken?.decimals : srcToken?.decimals

                if ((new RegExp(`^[0-9]*?\d*(\\.?([0-9]{0,${decimals - 2}}))$`)).test(val)) {
                    setBridgetTransferAmount(val)
                }
            }} />
    )
}
