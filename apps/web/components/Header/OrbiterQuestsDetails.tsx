"use client"

import { useAtom, useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { OrbiterModal, OrbiterShow } from '@orbiter-finance/ui'
import Image from 'next/image'
import QuestsList from './Quests/List'
import EcosystemList from './Ecosystem/EcosystemList'
import { pageIsMobileAtom, showQuestsDetailsAtom } from '../../stores/bridge'
import { cn } from '../../utils/cn'
import { XIcon } from 'lucide-react'

const TabList = [{
    label: "Quests",
    key: "que",
}, {
    label: "Ecosystem",
    key: "eco",
}]

export default function OrbiterQuestsDetails() {
    const pageIsMobile = useAtomValue(pageIsMobileAtom)
    const [show, setShow] = useAtom(showQuestsDetailsAtom)
    const [tabKey, setTabKey] = useState("que")


    return (
        <div className='relative'>
            <div className="w-10 h-10 ml-4 cursor-pointer p-2 bg-[var(--o-color-gray-800)] hover:bg-[var(--o-color-gray-700)] rounded-xl"
                onClick={(event) => {
                    event.stopPropagation()
                    setShow(true)
                }}
            >
                <OrbiterShow
                    when={show}
                    fallback={

                        <Image width={24} height={24} className='w-full h-full' alt="quests" src="/assets/icon/header/quests-details.svg" />
                    }
                >
                    <Image width={24} height={24} className='w-full h-full' alt="quests" src="/assets/icon/header/quests-details-active.svg" />
                </OrbiterShow>
            </div>

            <OrbiterShow
                when={pageIsMobile}
                fallback={
                    <OrbiterShow
                        when={show}
                    >
                        <div onClick={(event) => {
                            event.stopPropagation()
                            setShow(false)
                        }} className='fixed z-[var(--modal-bg-z-index)] w-screen h-screen left-0 top-0'></div>
                        <div
                            className='absolute w-[24.5rem] top-12 right-0 border border-[var(--o-color-gray-600)] bg-[var(--o-color-gray-800)] rounded-xl z-[var(--modal-z-index)] text-[var(--o-color-gray-400)] p-4'
                        >
                            <div className='flex'>
                                {
                                    TabList.map((item) => {
                                        const isActive = tabKey === item.key
                                        return <div onClick={(event) => {
                                            event.stopPropagation()
                                            setTabKey(item.key)
                                        }} key={item.key} className={cn('mr-5 cursor-pointer', isActive ? 'text-[var(--o-color-gray-50)]' : '')}>{item.label}</div>
                                    })
                                }
                            </div>
                            <div className="w-full flex flex-col justify-start items-center min-h-96 max-h-[42rem] overflow-auto">
                                <div className='w-full h-full'>
                                    <OrbiterShow
                                        when={tabKey === TabList[0].key}
                                        fallback={
                                            <EcosystemList />
                                        }
                                    >
                                        <QuestsList key={tabKey} />
                                    </OrbiterShow>
                                </div>
                            </div>
                        </div>
                    </OrbiterShow>
                }
            >
                <OrbiterModal
                    show={show}
                    onShowChange={(open) => {
                        setShow(open)
                    }}
                    headerRender={
                        <div className='flex justify-between items-center pt-4 mb-4 text-[var(--o-color-gray-400)]'>
                            <div className='flex'>
                                {
                                    TabList.map((item) => {
                                        const isActive = tabKey === item.key
                                        return <div onClick={(event) => {
                                            event.stopPropagation()
                                            setTabKey(item.key)
                                        }} key={item.key} className={cn('mr-5 cursor-pointer text-xl o-font-500', isActive ? 'text-[var(--o-color-gray-50)]' : '')}>{item.label}</div>
                                    })
                                }
                            </div>
                            <XIcon className='w-6 h-6 cursor-pointer' onClick={(event) => {
                                event.stopPropagation()
                                setShow(false)
                            }} />
                        </div>
                    }
                >

                    <div className="w-full flex flex-col justify-start items-center h-[40rem] max-h-[40rem] overflow-auto">
                        <div className='w-full h-full'>
                            <OrbiterShow
                                when={tabKey === TabList[0].key}
                                fallback={
                                    <EcosystemList />
                                }
                            >
                                <QuestsList key={tabKey} />
                            </OrbiterShow>
                        </div>
                    </div>
                </OrbiterModal>

            </OrbiterShow>


        </div>
    )
}