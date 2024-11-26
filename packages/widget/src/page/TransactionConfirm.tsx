import { ArrowRight, FileTextIcon } from 'lucide-react'
import React, { useContext, useMemo } from 'react'

import { useAtomValue } from 'jotai'
import { CardHeader, OrbiterCard, OrbiterIcon, OrbiterShow } from '@orbiter-finance/ui'
import { useOrbiterGetChainsConfig } from '../bridgeInfo/hooks/useOrbiterGetChainsConfig.js'
import { PAGE_TYPE, TRANSACTION_STATUS } from '../constant.js'
import { usePageTypeUpdate } from '../hooks/usePageTypeUpdate.js'
import { pageIsMobileAtom } from '../stores/bridge.js'
import { cn } from '../utils/cn.js'
import { decimalNum } from '../utils/decimalNum.js'
import { shortenAddress } from '../utils/shortenAddress.js'
import { useExploreLink } from '../bridgeInfo/hooks/useExploreLink.js'
import { useTransactionInfo } from '../hooks/useTransactionInfo.js'
import { TransactionConfirmStatus } from '../icon/TransactionConfirmStatus.js'
import { OPointIcon } from '../icon/OPointIcon.js'
import useBridgeLogEvent from '../hooks/useBridgeLogEvent.js'
import { BridgeInfoContext } from '../bridgeInfo/providers.js'
import useOpenLink from '../hooks/useOpenLink.js'


export function TransactionConfirm() {
    const { isMainnet } = useContext(BridgeInfoContext)
    const { getChainsConfig } = useOrbiterGetChainsConfig()
    const { updatePageModalType } = usePageTypeUpdate()
    const pageIsMobile = useAtomValue(pageIsMobileAtom)
    const { getExploreAccountLink, getExploretransactionLink } = useExploreLink()
    const { bridgeLogEvent, BRIDGE_EVENT } = useBridgeLogEvent()
    const BridgeTransaction = useTransactionInfo()
    const { openLink } = useOpenLink()

    const {
        srcChain, tgtChain, srcToken, sendAmount, receiveAmount, srcTx, targetTx, tgtAddress, status, points, timeStamp
    } = useMemo(() => BridgeTransaction, [BridgeTransaction])

    return (
        <div className='mt-2 sm:mt-12 w-full flex justify-center items-center'>
            <OrbiterCard
                className='bg-[transparent] sm:bg-[var(--o-color-gray-900)] sm:min-h-[28rem] p-0 pt-3 sm:p-4 max-w-[30.5rem] '
                isBorder={!pageIsMobile}
            >
                <OrbiterShow
                    when={!pageIsMobile}
                >
                    <CardHeader
                        left={
                            <div className='flex items-center'>
                                <label className='mr-2 text-xl'>{
                                    Number(status) >= TRANSACTION_STATUS.TO_FAILED ? "Completed" : "Waiting for Confirmation..."
                                }</label>

                            </div>
                        }
                        right={
                            <div className='flex w-9 h-9 justify-center items-center bg-[var(--o-color-gray-800)] p-1.5 rounded-xl cursor-pointer'>
                                <FileTextIcon className='w-6 h-6' onClick={(event) => {
                                    event.stopPropagation()
                                    bridgeLogEvent(BRIDGE_EVENT.bridgeAgain)
                                    updatePageModalType(PAGE_TYPE.HISTORY)
                                }} />
                            </div>
                        }
                    />
                </OrbiterShow>
                <div className='w-full flex justify-between items-center relative mt-0 sm:mt-3'>
                    <OrbiterCard
                        className={
                            cn('flex-1 p-px mr-1 relative overflow-hidden', pageIsMobile ? "rounded-2xl" : "rounded-3xl")
                        }
                    >
                        <OrbiterShow
                            when={(Number(status) < TRANSACTION_STATUS.FROM_CHECK)}
                        >
                            <div className="dots_border">
                            </div>
                        </OrbiterShow>

                        <div className={
                            cn('w-full h-full relative z-[3] p-6', pageIsMobile ? "bg-[var(--o-color-gray-900)] rounded-2xl" : "bg-[var(--o-color-gray-800)] rounded-3xl")
                        }>
                            <div className='w-full flex justify-center items-center'>
                                <OrbiterIcon type='CHAIN' iconId={srcChain} className='w-10 h-10' />
                            </div>
                            <div className='w-full flex text-lg justify-center items-center whitespace-nowrap mt-1'>
                                {getChainsConfig(srcChain)?.name}
                            </div>
                            <div className='w-full flex justify-center items-center text-base'>
                                {decimalNum(sendAmount, 6, ",")} {srcToken}
                            </div>
                        </div>
                    </OrbiterCard>
                    <OrbiterCard
                        className={
                            cn('flex-1 p-px relative overflow-hidden', pageIsMobile ? "rounded-2xl" : "rounded-3xl")
                        }
                    >
                        <OrbiterShow
                            when={(Number(status) > TRANSACTION_STATUS.FROM_OKAY) && (Number(status) < TRANSACTION_STATUS.TO_FAILED)}
                        >
                            <div className="dots_border">
                            </div>
                        </OrbiterShow>

                        <div className={
                            cn('w-full h-full relative z-[3] p-6', pageIsMobile ? "bg-[var(--o-color-gray-900)] rounded-2xl" : "bg-[var(--o-color-gray-800)] rounded-3xl")
                        }>

                            <div className='w-full flex justify-center items-center'>
                                <OrbiterIcon type='CHAIN' iconId={tgtChain} className='w-10 h-10' />
                            </div>
                            <div className='w-full flex justify-center items-center text-lg mt-1 whitespace-nowrap'>
                                {getChainsConfig(tgtChain)?.name}
                            </div>
                            <div className='w-full flex justify-center items-center text-base'>
                                {decimalNum(receiveAmount, 6, ",")} {srcToken}
                            </div>
                        </div>
                    </OrbiterCard>
                    <div className={
                        cn("w-10 h-10 sm:w-12 z-[5] sm:h-12 rounded-xl sm:rounded-2xl p-1 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2", pageIsMobile ? " bg-[var(--o-color-gray-800)]" : " bg-[var(--o-color-gray-900)]")
                    }>
                        <div className={
                            cn('w-8 h-8 rounded-lg sm:w-10 sm:h-10 p-1 sm:p-2 flex sm:rounded-xl justify-center items-center', pageIsMobile ? "bg-[var(--o-color-gray-900)]" : "bg-[var(--o-color-gray-800)]")
                        }>
                            <ArrowRight className='w-6' />
                        </div>
                    </div>
                </div>
                <OrbiterCard
                    className='p-0 sm:p-4 mt-3 min-h-[6.5rem] pb-5 text-sm bg-[transparent]'
                    isBorder={!pageIsMobile}
                >
                    <div className='flex justify-start items-center'>
                        <div className='flex-1 mr-1 sm:mr-4' onClick={(event) => {
                            event.stopPropagation()
                            const link = getExploretransactionLink({
                                chainId: srcChain,
                                value: srcTx
                            })
                            if (link) {
                                openLink(link, "_blank")
                            }
                        }}>
                            <label className='text-[var(--o-color-gray-400)]'>Source TX</label>
                            <div className={
                                cn("flex justify-start items-center cursor-pointer", srcTx ? "underline underline-offset-2" : "")
                            }>
                                <div className='o-font-500 mr-1'>{shortenAddress(srcTx)}</div>
                                <TransactionConfirmStatus status={Number(status) || 0} />
                            </div>
                        </div>
                        <div className='flex-1' onClick={(event) => {
                            event.stopPropagation()
                            const link = getExploretransactionLink({
                                chainId: tgtChain,
                                value: targetTx
                            })
                            if (link) {
                                openLink(link, "_blank")
                            }
                        }}>
                            <label className='text-[var(--o-color-gray-400)]'>Destination TX</label>
                            <div className={
                                cn("flex justify-start items-center", targetTx ? "underline underline-offset-2 cursor-pointer" : "")
                            }>
                                <div className='o-font-500 mr-1'>{shortenAddress(targetTx || "--")}</div>
                                <TransactionConfirmStatus status={Number(status) || 0} isTo />
                            </div>
                        </div>
                    </div>
                    <div className='invide-line-dashed mt-2.5'>
                    </div>
                    <div className='flex justify-between items-center mt-2.5'>
                        <label className='text-[var(--o-color-gray-400)]'>
                            Recipient address
                        </label>
                        <div
                            className='o-font-500 cursor-pointer'
                            onClick={(event) => {
                                event.stopPropagation()
                                const link = getExploreAccountLink({
                                    chainId: tgtChain,
                                    value: tgtAddress
                                })
                                if (link) {
                                    openLink(link, "_blank")
                                }
                            }}>
                            {shortenAddress(tgtAddress || "--")}
                        </div>
                    </div>
                    <div className='flex justify-between items-center mt-2.5'>
                        <label className='text-[var(--o-color-gray-400)]'>
                            Timestamp
                        </label>
                        <div className='o-font-500'>
                            {timeStamp}
                        </div>
                    </div>
                    <OrbiterShow
                        when={isMainnet}
                    >
                        <div className='flex justify-between items-center mt-2.5'>
                            <label className='text-[var(--o-color-gray-400)] flex justify-start items-center'>
                                Rewards
                                <OPointIcon className='w-4 h-4 mx-1' />
                                O-Points
                            </label>
                            <OrbiterShow
                                when={!!Number(points)}
                            >
                                <div className='o-font-500 text-[var(--o-color-brand-500)]'>
                                    + {decimalNum(points, 2)} O-Points
                                </div>
                            </OrbiterShow>
                        </div>
                    </OrbiterShow>
                </OrbiterCard>
                <OrbiterShow
                    when={!pageIsMobile}
                >
                    <OrbiterCard
                        className='p-4 mt-3 h-16 bg-[var(--o-color-brand-500)] flex justify-center items-center text-xl o-font-600 cursor-pointer'
                        onClick={(event) => {
                            event.stopPropagation()
                            updatePageModalType(PAGE_TYPE.BRIDGE)
                            bridgeLogEvent(BRIDGE_EVENT.bridgeAgain)
                        }}
                    >
                        {Number(status) >= TRANSACTION_STATUS.TO_FAILED ? "Bridge Again" : "Got it"}
                    </OrbiterCard>
                </OrbiterShow>

            </OrbiterCard>
        </div>
    )
}
