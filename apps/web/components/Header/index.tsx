'use client'
import React, { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import { pageIsMobileAtom } from '../../stores/bridge'
import { cn } from '../../utils/cn'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { MENU_LIST } from '../../app/constant'
import { HeaderTools } from './HeaderTools'
import { OrbiterShow } from '@orbiter-finance/ui'



export default function Header() {
    const pathName = usePathname()

    const pageIsMobile = useAtomValue(pageIsMobileAtom)

    const SearchParams = useSearchParams()

    return (
        <div className="w-full flex justify-between items-center p-4 z-10">
            <div className="flex justify-start items-center align-middle">
                <Link prefetch href={"/?"+SearchParams.toString()} replace>
                    <OrbiterShow
                        when={pageIsMobile}
                        fallback={
                            <Image
                                src="/assets/image/header/logo.png"
                                alt="Orbiter Finance"
                                priority={true}
                                title="Orbiter Finance"
                                width={174}
                                height={40}
                                className="w-[10.875rem]"
                            />
                        }
                    >
                        <Image
                            src="/assets/image/header/mobile_logo.png"
                            alt="Orbiter Finance"
                            priority={true}
                            title="Orbiter Finance"
                            width={40}
                            height={40}
                            className="w-[2.5rem]"
                        />
                    </OrbiterShow>
                </Link>

                <OrbiterShow
                    when={!pageIsMobile}
                >
                    <div className="flex justify-start items-center ml-8">
                        {MENU_LIST.map((item) => {
                            const isActive = item.path === pathName
                            return (
                                <Link key={item.key} prefetch href={item.path + "/?" + SearchParams.toString()} replace>
                                    <button
                                        className={cn(
                                            'mr-8 o-font-500 text-lg',
                                            isActive ? '' : 'not-active',
                                        )}
                                        key={item.key}
                                    >
                                        {item.label}
                                    </button>
                                </Link>
                            )
                        })}
                    </div>
                </OrbiterShow>


            </div>
            <HeaderTools />
        </div>
    )
}
