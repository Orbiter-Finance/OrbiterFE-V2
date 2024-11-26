"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import Image from 'next/image'
import { OrbiterShow } from '@orbiter-finance/ui'
import { decimalNum } from '../../../utils/decimalNum'
import EcosystemPending from './EcosystemPending'
import Empty from '../../Empty'
import { BASE_URL } from '../../../app/constant'
import useOpenLink from '../../../hooks/useOpenLink'
export default function EcosystemList() {
    const [list, setList] = useState<any[]>([])
    const [pending, setPending] = useState(true)
    const { openLink } = useOpenLink()

    const init = useCallback(
        async () => {
            setPending(true)
            try {
                const response = await fetch(BASE_URL + "/bridge-api/ecoSystem/events")
                const res = await response.json()
                setList(res?.result || [])
                setPending(false)
            } catch (error) {
                setPending(false)
            }
        },
        [],
    )
    useEffect(() => {
        const timer = setTimeout(() => {
            init()
        }, 200)
        return () => {
            clearTimeout(timer)
        }
    }, [])

    return (
        <OrbiterShow
            when={!pending}
            fallback={
                <div className='w-full'>
                    {
                        new Array(3).fill(0).map((item, index) => {
                            return <EcosystemPending key={index} />
                        })
                    }
                </div>
            }
        >
            <OrbiterShow
                when={!!list?.length}
                fallback={
                    <div className='w-full flex mt-20'>
                        <Empty />
                    </div>
                }
            >
                <div className='w-full'>
                    {
                        list.map((item) => {
                            const total = item?.progress?.total
                            const current = item?.progress?.current
                            const ratio = total ? (Number(current) / Number(total) * 100) : 0
                            return <div
                                key={item.id} title={item.describe}
                                className='w-full rounded-lg mt-3 bg-[var(--o-color-gray-900)]'>
                                <div className="w-full relative">
                                    <Image onClick={(event) => {
                                    event.stopPropagation()
                                    openLink(item.info_url)
                                }} src={item.img_url} width={1164} height={390} className='w-full rounded-lg cursor-pointer' alt="bob" />
                                    <div className='flex justify-end items-center absolute top-1 right-1'>
                                        <div className='flex justify-center items-center'>
                                            <div className='flex justify-center items-center bg-[var(--o-color-gray-700)] text-[var(--o-color-gray-200)] rounded-full px-1.5 py-0.5'>
                                                <Users className='w-3.5 h-3.5' />
                                                <span className='ml-0.5 o-font-500 text-xs o-zoom-87'>{decimalNum(item?.progress?.participants, 0, ",")}</span>
                                            </div>
                                        </div>
                                        <OrbiterShow
                                            when={!!item?.ext?.tags?.length}
                                        >
                                            <div className='flex justify-center items-center ml-2'>
                                                {
                                                    item?.ext?.tags?.map((tag) => {
                                                        return <div className='flex justify-center items-center bg-[var(--o-color-ecosystem-tag)] rounded-full px-1.5 py-0.5'>
                                                            <span className='text-[var(--o-color-gray-900)] o-font-500 text-xs o-zoom-87'>{tag}</span>
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        </OrbiterShow>
                                    </div>
                                </div>
                                <div className='w-full px-2 py-3 text-sm flex justify-between items-center'>
                                    <div className='flex-1 mr-2'>
                                        <div dangerouslySetInnerHTML={{
                                            __html: item.describe
                                        }}></div>
                                        <OrbiterShow
                                            when={!!Number(total)}
                                        >
                                            <div className='flex justify-between items-center w-full mt-1 text-xs'>
                                                <div className='text-[var(--o-color-gray-400)]'>Launch Progress: </div>
                                                <div className='o-font-500'>{decimalNum(ratio, 6, ",")}%</div>
                                            </div>
                                            <div className='w-full mt-1 h-2 rounded-full bg-[var(--o-color-gray-700)] flex justify-start items-center'>
                                                <div style={{ width: decimalNum(ratio, 6) + "%" }} className='h-full ecosystem-progress-bg rounded-full'>
                                                </div>
                                            </div>

                                        </OrbiterShow>
                                    </div>
                                    <div className='flex h-7 cursor-pointer justify-center items-center w-16 rounded-full bg-[var(--o-color-brand-500)] text-[var(--o-color-gray-50)] o-font-600'
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            openLink(item.info_url)
                                        }}
                                    >Join</div>
                                </div>
                            </div>
                        })
                    }
                </div>

            </OrbiterShow>
        </OrbiterShow>
    )
}