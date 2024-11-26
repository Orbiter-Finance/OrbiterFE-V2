"use client"

import React, { ReactNode, useState } from 'react'
import { OrbiterShow } from '@orbiter-finance/ui'
import { useAtomValue } from "jotai"
import Image from 'next/image'
import { pageIsMobileAtom } from '../../stores/bridge'
import { cn } from '../../utils/cn'

const cardBg = {
    tx: {
        bg: "radial-gradient(50.00% 50.00% at 50% 50%,rgba(255, 92, 92, 0.2) 3.346%,rgba(255, 67, 67, 0) 99.814%)",
        color: "var(--o-color-brand-500)",
        border: "var(--o-color-brand-500)",
        boxShadow: "inset 0px 0px 20px 0px rgba(255, 92, 92, 0.4)"
    },
    vol: {
        bg: "radial-gradient(50.00% 50.00% at 50% 50%,rgba(255, 218, 52, 0.2) 3.346%,rgba(255, 218, 52, 0) 99.814%)",
        color: "var(--o-color-yellow-500)",
        border: "var(--o-color-yellow-500)",
        boxShadow: "inset 0px 0px 40px 0px rgba(253, 203, 20, 0.4)"
    },
    user: {
        bg: " radial-gradient(50.00% 50.00% at 50% 50%,rgba(20, 135, 253, 0.2) 3.346%,rgba(20, 135, 253, 0) 99.814%)",
        color: "var(--o-color-blue-500)",
        border: "var(--o-color-blue-500)",
        boxShadow: "inset 0px 0px 20px 0px rgba(20, 135, 253, 0.4)"
    }
}

interface ExploreNavCardType {
    bgKey: keyof typeof cardBg
    title: string
    value: ReactNode
}

export default function ExploreNavCard({
    bgKey,
    title,
    value
}: ExploreNavCardType) {

    const pageIsMobile = useAtomValue(pageIsMobileAtom)

    const [isHover, setIsHover] = useState(false)

    const hoverStatus = isHover || pageIsMobile

    return (
        <div
            onMouseEnter={(event) => {
                event.stopPropagation()
                setIsHover(true)
            }}
            onMouseLeave={(event) => {
                event.stopPropagation()
                setIsHover(false)
            }}
            className='w-full py-4 px-4 sm:py-6 sm:px-5 rounded-xl relative top-0 left-0 bg-[var(--o-color-gray-900)] border border-[var(--o-color-gray-700)] cursor-pointer'
            style={
                isHover && !pageIsMobile ? ({
                    borderColor: cardBg[bgKey].border,
                    boxShadow: cardBg[bgKey].boxShadow
                }) : ({})
            }>
            <OrbiterShow
                when={hoverStatus}
            >
                <div className='absolute w-[5.75rem] h-[4.5rem] top-1/2 -translate-y-1/2 -right-4' style={{ background: cardBg[bgKey].bg }}>
                </div>
            </OrbiterShow>
            <div className='w-full flex justify-between items-center'>
                <div>
                    <div className='text-[var(--o-color-text-t3)] o-font-400 text-sm sm:text-base'>{title}</div>
                    <div className='sm:mt-2 text-2xl sm:text-[1.75rem] o-font-500' style={{ color: cardBg[bgKey].color }}>{value}</div>
                </div>
                <OrbiterShow
                    when={hoverStatus}
                    fallback={
                        <Image src={`/assets/image/explore/explore-${bgKey}.png`} alt="" width={128} height={128} className={
                            cn("relative", pageIsMobile ? "w-12 h-12" : "w-16 h-16")
                        } />
                    }
                >
                    <Image src={`/assets/image/explore/explore-h-${bgKey}.png`} alt="" width={128} height={128} className={
                        cn("relative", pageIsMobile ? "w-12 h-12" : "w-16 h-16")
                    } />
                </OrbiterShow>
            </div>
        </div>
    )
}
