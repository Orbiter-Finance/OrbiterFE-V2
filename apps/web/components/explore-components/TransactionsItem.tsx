"use client"

import { OrbiterIcon, OrbiterShow } from '@orbiter-finance/ui'
import { ArrowRightIcon, ChevronRightCircleIcon, ChevronRightIcon, ChevronsRight, CircleCheckIcon, MoveRightIcon, RefreshCwIcon } from 'lucide-react'
import React from 'react'
import { decimalNum } from '../../utils/decimalNum'
import shortenAddress from '../../utils/shortenAddress'
import { cn } from '../../utils/cn'
import CalculateRelativeTime from '../CalculateRelativeTime'
import { useExploreLink } from '@orbiter-finance/widget'
import useOpenLink from '../../hooks/useOpenLink'

export interface DataItemType {
    sourceAmount: string,
    sourceAmountUSD?: string,
    sourceChain: string,
    sourceId: string,
    sourceSymbol: string
    sourceTime: string
    status: 0 | 1
    targetChain?: string
    targetId?: string
}

interface TransactionsItemType {
    data: DataItemType
}

export default function TransactionsItem({
    data
}: TransactionsItemType) {

    const { getExploretransactionLink, getChainInfo } = useExploreLink()
    const { openLink } = useOpenLink()

    const getChainName = (chainId: string) => {
        const chainInfo = getChainInfo({ chainId })
        return chainInfo && chainInfo.name
    }
    return (
        <div className='w-full h-16 px-4 border-b border-[var(--o-color-gray-700)] hover:bg-[var(--o-color-gray-800)] flex justify-between items-center text-xs o-text-t2'>
            <div className='w-28 flex justify-start items-center text-sm'>
                <OrbiterShow
                    when={data.status < 97}
                    fallback={
                        <div className='rounded-md bg-[var(--o-color-green-900)] text-[var(--o-color-green-500)] flex justify-center items-center o-font-500 py-1 pl-1.5 pr-2.5'>
                            <CircleCheckIcon strokeWidth={2} className='w-5 h-5 mr-1' />
                            Completed
                        </div>
                    }
                >
                    <div className='rounded-md bg-[var(--o-color-blue-900)] text-[var(--o-color-blue-500)] flex justify-center items-center o-font-500 py-1 pl-1.5 pr-2.5'>
                        <RefreshCwIcon strokeWidth={2} className='w-5 h-5 mr-1 o-dash-svg' />
                        Peding<span className='tracking-wide'>...</span>
                    </div>
                </OrbiterShow>
            </div>

            <div className='flex justify-start items-center o-text-t3 w-24'>
                <OrbiterIcon type='CHAIN' iconId={data.sourceChain} className='w-7 h-7' title={getChainName(data.sourceChain)} />
                <ChevronsRight className='w-5 h-5 mx-[8px]' />
                <OrbiterIcon type='CHAIN' iconId={data.targetChain} className='w-7 h-7' title={getChainName(data.targetChain)} />
            </div>
            <div className='flex justify-start items-center o-text-t1 text-base w-16 o-font-500'>
                <OrbiterIcon type='TOKEN' iconId={data.sourceSymbol} className='w-7 h-7 mr-[8px]' />
                {data.sourceSymbol}
            </div>
            <div className='o-text-t3 w-16'>
                <div className='text-sm o-font-500 o-text-t1'>{decimalNum(data.sourceAmount, 6, ",")}</div>
                <div className='o-font-400'>{decimalNum(data.sourceAmountUSD, 2, ",", "$")}</div>
            </div>
            <div title={data.sourceId} onClick={(event) => {
                event.stopPropagation()
                if (data.sourceId) {
                    const link = getExploretransactionLink({ chainId: data.sourceChain, value: data.sourceId })
                    openLink(link)
                }
            }} className='o-font-400 text-sm w-28 cursor-pointer hover:text-[var(--o-color-blue-500)] decoration-[var(--o-color-text-t4)] hover:decoration-[var(--o-color-blue-500)] underline underline-offset-4'>
                {shortenAddress(data.sourceId, 6)}
            </div>
            <div title={data.targetId} onClick={(event) => {
                if (data?.targetId) {
                    event.stopPropagation()
                    const link = getExploretransactionLink({ chainId: data.targetChain, value: data.targetId })
                    openLink(link)
                }
            }} className={
                cn('o-font-400 text-sm w-28 cursor-pointer hover:text-[var(--o-color-blue-500)] decoration-[var(--o-color-text-t4)] hover:decoration-[var(--o-color-blue-500)] underline-offset-4', data?.targetId ? "underline" : "")
            }>
                {data?.targetId ? shortenAddress(data?.targetId, 6) : "--"}
            </div>
            <div className='o-font-400 text-sm w-32 text-right whitespace-nowrap'>
                <CalculateRelativeTime date={data.sourceTime} />
            </div>
        </div>
    )
}
