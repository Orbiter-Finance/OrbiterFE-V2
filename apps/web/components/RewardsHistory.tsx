"use client"

import { useAtomValue } from 'jotai'
import React, { useMemo } from 'react'
import { questsListAtom } from '../stores/bridge'
export default function RewardsHistory() {
    const questsList = useAtomValue(questsListAtom)
    const questsData = useMemo(() => {
        let list: any[] = []
        questsList.forEach((item) => {
            item.taskList.forEach((option: any) => {
                list = list.concat([{
                    ...option,
                    icon: item?.label?.icon || ""
                }])
            })

        })
        return list.filter((item) => Number(item?.status) !== 0)
    }, [questsList])

    return (
        <div className="w-full flex flex-1 flex-col">
            <div className='w-full h-full max-h-full overflow-auto'>
                <div className='w-full overflow-auto'>
                    {
                        questsData.map((item, index) => <div key={index} className='mt-2 flex justify-between items-center text-sm'>
                            <div className='flex text-[var(--o-color-gray-400)]'>
                                {item.name}
                            </div>
                            <div className='flex justify-end items-center'>
                                +{item.opints} O-Points
                            </div>
                        </div>)
                    }
                </div>
            </div>
        </div>
    )
}