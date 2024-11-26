import React, { useState } from 'react'
import { XIcon } from 'lucide-react'

import { OrbiterCard, OrbiterShow } from '@orbiter-finance/ui'
import { PAGE_TYPE } from '../constant.js'
import { usePageTypeUpdate } from '../hooks/usePageTypeUpdate.js'
import { cn } from '../utils/cn.js'
import { HistoryList } from './HistoryList.js'
import SearchCard from './SearchCard.js'

const menuList = [
    {
        label: "History",
        key: "history",
    },
    {
        label: "Search",
        key: "search",
    }
]

export function History() {

    const [tabKey, setTabKey] = useState("history")

    const { updatePageModalType } = usePageTypeUpdate()

    return (
        <OrbiterCard
            className='mt-4 sm:mt-12 p-4 max-w-[46rem] min-h-[28rem] flex justify-start items-center flex-col'
            isBorder
        >
            <div className='w-full flex justify-between items-center'>
                <div className='flex justify-start items-center'>
                    {
                        menuList.map((item) => {
                            const isActive = item.key === tabKey
                            return <button onClick={(event) => {
                                setTabKey(item.key)
                            }} className={cn('mr-8 text-xl', isActive ? "o-font-500" : "not-active o-font-400")} key={item.key}>
                                {item.label}
                            </button>
                        })
                    }
                </div>
                <div className='cursor-pointer' onClick={(event) => {
                    event.stopPropagation()
                    updatePageModalType(PAGE_TYPE.BRIDGE)
                }}>
                    <XIcon className='w-6 h-6' />
                </div>
            </div>
            <div className='flex-1 w-full h-full mt-3'>
                <OrbiterShow
                    when={tabKey === "history"}
                    fallback={
                        <SearchCard />
                    }
                >
                    <HistoryList />
                </OrbiterShow>
            </div>
        </OrbiterCard>
    )
}
