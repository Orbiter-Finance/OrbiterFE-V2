import React, { ReactNode } from 'react'

import "./lottery.css"
import { cn } from '../../utils/cn'
import { XIcon } from 'lucide-react'
import { OrbiterShow } from '@orbiter-finance/ui'

interface LotteryDrawType {
    children: ReactNode,
    nextKey?: string,
    isClose?: boolean
    onClose?: () => void
}

export default function LotteryDraw({
    children,
    nextKey,
    isClose,
    onClose
}: LotteryDrawType) {
    return (
        <div
            className="lottery-card-group-dialog"
        >
            <div className="lottery-dialog-card-container">
                <div className="lottery-dialog-card-centent">
                    <div className="lottery-dialog-card-group">
                        <div
                            key={nextKey}
                            className={
                                cn("lottery-dialog-card",
                                    !nextKey ? "lottery-dialog-card-animation" : "lottery-dialog-card-confirm-animation-next"
                                )
                            }>
                            <div className="lottery-dialog-card-face">
                                {children}
                            </div>
                            <OrbiterShow when={isClose}>
                                <div className='w-full flex justify-center items-center mt-6 lottery-dialog-close'>
                                    <div onClick={(event) => {
                                        event.stopPropagation()
                                        onClose && onClose()
                                    }} className='flex justify-center items-center w-8 h-8 rounded-full bg-[var(--o-color-gray-800)] p-1.5 cursor-pointer'>
                                        <XIcon stroke='var(--o-color-gray-400)' className='w-5 h-5' />
                                    </div>
                                </div>
                            </OrbiterShow>

                        </div>
                    </div>
                    <div className="lottery-bg-1-animation"></div>
                    <div className="lottery-bg-2-animation"></div>
                    <div className="lottery-bg-3-animation"></div>
                </div>

            </div>
        </div>
    )
}
