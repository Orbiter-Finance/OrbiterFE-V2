import React, { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { bridgetTransferAmountAtom } from '../stores/bridge.js'
import { useTransactionRouter } from '../bridgeInfo/hooks/useTransactionRouter.js'

export function useBridgeRouter() {

    const bridgetTransferAmount = useAtomValue(bridgetTransferAmountAtom)

    const TransactionRouter = useTransactionRouter()

    const min = useMemo(() => {
        return TransactionRouter?.getMinSendAmountMinusWithHoldingFee()
    }, [TransactionRouter])

    const max = useMemo(() => {
        return TransactionRouter?.getMaxSendAmount()
    }, [TransactionRouter])

    const routerTypes = useMemo(() => {
        return TransactionRouter?.routerTypes
    }, [TransactionRouter])


    const basePoint = useMemo(() => {
        return TransactionRouter?.basePoint
    }, [TransactionRouter])

    const simulationAmount = useMemo(() => {
        const decimals = TransactionRouter?.srcToken?.decimals || 0
        if (!bridgetTransferAmount || !decimals) return null
        try {
            return TransactionRouter?.simulationAmountPlusWithHoldingFee(
                bridgetTransferAmount
            )
        } catch (error) {
            return null
        }
    }, [TransactionRouter, bridgetTransferAmount])

    return useMemo(() => ({
        routerTypes,
        TransactionRouter,
        srcToken: TransactionRouter?.srcToken,
        dstToken: TransactionRouter?.dstToken,
        basePoint,
        min,
        max,
        simulationAmount,
        bridgetTransferAmount,
        withholdingFee: TransactionRouter?.withholdingFee || "0",
        tradeFee: TransactionRouter?.tradeFee || "0",
    }), [TransactionRouter, min, max, simulationAmount, bridgetTransferAmount, basePoint, TransactionRouter, routerTypes])
}
