import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import { BridgeInfoContext } from '../bridgeInfo/providers.js'
import { bridgeTransactionAtom, bridgeTransactionRefreshAtom } from '../stores/bridge.js'
import { useOrbiterToast } from '../hooks/useOrbiterToast.js'
import { useOrbiterGetChainsConfig } from '../bridgeInfo/hooks/useOrbiterGetChainsConfig.js'
import { useExploreLink } from '../bridgeInfo/hooks/useExploreLink.js'
import { TRANSACTION_STATUS } from '../constant.js'
import { decimalNum } from '../utils/decimalNum.js'
import { dateFormatStandard } from '../utils/dayjsUtils.js'
import { useBalance } from './useBalance.js'

export function useTransactionStatus() {
    const { getCurrentBalance } = useBalance()
    const { orbiterClient } = useContext(BridgeInfoContext)
    const [BridgeTransaction, setBridgeTransaction] = useAtom(bridgeTransactionAtom)
    const [bridgeTransactionRefresh, setBridgeTransactionRefresh] = useAtom(bridgeTransactionRefreshAtom)
    const { orbiterTotas } = useOrbiterToast()
    const { getChainsConfig } = useOrbiterGetChainsConfig()
    const { getExploretransactionLink } = useExploreLink()
    const [transactionTimer, setTransactionTimer] = useState<NodeJS.Timeout | number>(0)
    const {
        srcChain, tgtChain, srcToken, sendAmount, receiveAmount, srcTx, targetTx, tgtAddress, status, points
    } = useMemo(() => BridgeTransaction, [BridgeTransaction])


    const getTransactionData = useCallback(
        async () => {
            clearTimeout(transactionTimer)
            if (!orbiterClient || !srcTx || Number(status) >= TRANSACTION_STATUS.TO_FAILED) return
            const res = await orbiterClient.getTransactionStatus(srcTx, srcChain)
            setBridgeTransaction({
                ...BridgeTransaction,
                status: String(res?.opStatus || ""),
                targetTx: String(res?.targetId || ""),
                timeStamp: String(res?.timestamp || "") ? dateFormatStandard(String(res?.timestamp || ""), "YYYY.MM.DD HH:mm:ss") : "",
                points: String((res as any)?.points || ""),
            })
            if (Number(res?.opStatus || "") < TRANSACTION_STATUS.TO_FAILED) {
                const timer = setTimeout(() => {
                    setBridgeTransactionRefresh(+new Date())
                }, 5 * 1000)
                setTransactionTimer(timer)
            } else {
                setBridgeTransactionRefresh(0)
                if (Number(res?.opStatus || "") === TRANSACTION_STATUS.TO_FAILED) {
                    orbiterTotas.error({
                        title: "Transaction Fail",
                        viceTitle: `
                            ${decimalNum(sendAmount, 6, ",")} ${srcToken} from ${getChainsConfig(srcChain)?.name} to ${getChainsConfig(tgtChain)?.name}
                        `
                    })

                } else {
                    orbiterTotas.sucess({
                        title: "Transaction Confirmed",
                        viceTitle: `
                            ${decimalNum(sendAmount, 6, ",")} ${srcToken} from ${getChainsConfig(srcChain)?.name} to ${getChainsConfig(tgtChain)?.name}
                        `,
                        linkLabel: "View Transaction",
                        link: getExploretransactionLink({ chainId: tgtChain, value: String(res?.targetId || "") })
                    })
                }
                await getCurrentBalance()
            }

        },
        [transactionTimer, orbiterClient, srcTx, status, setBridgeTransaction, setBridgeTransactionRefresh, sendAmount, srcToken, srcChain, tgtChain, getExploretransactionLink],
    )

    useEffect(() => {
        let timer = setTimeout(() => {
            getTransactionData()
        }, 50)

        return () => {
            clearTimeout(timer)
        }
    }, [bridgeTransactionRefresh])

}
