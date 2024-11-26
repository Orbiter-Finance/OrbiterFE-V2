import { useAtomValue } from 'jotai'
import {
    CircleAlert,
    CircleCheck,
    CircleX,
    Clock,
    Info,
    SquareArrowOutUpRightIcon,
    XIcon,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { OrbiterShow } from '@orbiter-finance/ui'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import useOpenLink from '../hooks/useOpenLink'
import { pageIsMobileAtom } from '../stores'

export enum TOAST_STATUS {
    SUCCESS = 'SUCCESS',
    WARN = 'WARN',
    ERROR = 'ERROR',
    INFO = 'INFO',
    CLOCK = 'CLOCK',
}

type OrbiterToastCardType = {
    id: string
    type?: TOAST_STATUS
    title: string
    viceTitle?: string
    linkLabel?: string
    link?: string
}

export function OrbiterToastCard({
    id,
    type = TOAST_STATUS.INFO,
    title,
    viceTitle,
    linkLabel,
    link,
}: OrbiterToastCardType) {
    const { openLink } = useOpenLink()

    const pageIsMobile = useAtomValue(pageIsMobileAtom)
    let color = 'text-[var(--o-color-blue-500)]'
    let bgColor = 'bg-[var(--o-color-blue-900)]'

    let icon = <Info stroke="var(--o-color-blue-500)" />

    switch (type) {
        case TOAST_STATUS.ERROR:
            color = 'text-[var(--o-color-brand-500)]'
            bgColor = 'bg-[var(--o-color-brand-900)]'
            icon = (
                <CircleX
                    className="w-5 h-5"
                    stroke="var(--o-color-gray-700)"
                    fill="var(--o-color-brand-500)"
                />
            )
            break
        case TOAST_STATUS.SUCCESS:
            color = 'text-[var(--o-color-green-500)]'
            bgColor = 'bg-[var(--o-color-green-900)]'
            icon = (
                <CircleCheck
                    className="w-5 h-5"
                    stroke="var(--o-color-gray-700)"
                    fill="var(--o-color-green-500)"
                />
            )
            break
        case TOAST_STATUS.WARN:
            color = 'text-[var(--o-color-yellow-500)]'
            bgColor = 'bg-[var(--o-color-yellow-900)]'
            icon = (
                <CircleAlert
                    className="w-5 h-5"
                    stroke="var(--o-color-gray-700)"
                    fill="var(--o-color-yellow-500)"
                />
            )
            break
        case TOAST_STATUS.CLOCK:
            icon = (
                <Clock
                    className="w-5 h-5"
                    stroke="var(--o-color-gray-700)"
                    fill="var(--o-color-blue-500)"
                />
            )
            break
        default:
            break
    }

    return (
        <div
            className={twMerge(
                'p-3 flex rounded-xl sm:rounded-2xl justify-between items-start',
                pageIsMobile ? `${bgColor} ${color} w-full` : 'bg-[var(--o-color-gray-700)] w-72',
            )}
        >
            <div className="flex justify-start items-start flex-1">
                <div className="flex justify-between items-start">
                    <div className="flex justify-start items-start mr-1.5">
                        <div className="w-5 h-5">{icon}</div>
                    </div>
                </div>
                <div className="flex-1 text-left">
                    <div className="o-font-500 break-all">{title}</div>
                    <OrbiterShow when={!!viceTitle && !pageIsMobile}>
                        <div className="w-full mt-2 text-sm break-all">{viceTitle}</div>
                    </OrbiterShow>
                    <OrbiterShow when={!!linkLabel && !pageIsMobile}>
                        <div
                            onClick={(event) => {
                                event.stopPropagation()
                                if (link) {
                                    openLink(link)
                                }
                            }}
                            className="w-full cursor-pointer mt-2 text-sm text-[var(--o-color-blue-500)] flex justify-start items-center"
                        >
                            {linkLabel}
                            <SquareArrowOutUpRightIcon
                                stroke="var(--o-color-blue-500)"
                                className="w-3 h-3"
                            />
                        </div>
                    </OrbiterShow>
                </div>
            </div>
            <div
                onClick={(event) => {
                    event.stopPropagation()
                    toast.remove(id)
                }}
                className="ml-1.5 flex justify-end items-start w-6 h-6 cursor-pointer"
            >
                <XIcon className="w-5 h-5" stroke="var(--o-color-gray-500)" />
            </div>
        </div>
    )
}
