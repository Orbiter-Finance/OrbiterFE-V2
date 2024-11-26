"use client"

import { ProgressSkeleton } from '@orbiter-finance/ui'
import React from 'react'

export default function QuestsPending() {
    return (
        <div className='w-full'>
            <div className='mt-4'>
                <div className='flex justify-between items-center w-full h-5'>
                    <div className='flex h-full mr-2 w-1/2'>
                        <ProgressSkeleton />
                    </div>
                    <div className='flex h-full w-1/3'>
                        <ProgressSkeleton />
                    </div>
                </div>
                <div className='bg-[var(--o-color-gray-900)] px-3 pb-3 rounded-lg mt-3 pt-1'>
                    <div className='mt-2'>
                        <div className="flex w-10/12 h-5">
                            <ProgressSkeleton />
                        </div>
                        <div className='mt-1 w-full flex justify-start items-center h-5'>
                            <div className='w-24 h-full'>
                                <ProgressSkeleton />
                            </div>

                            <div className='w-20 mx-2 h-full'>
                                <ProgressSkeleton />
                            </div>
                            <div className='w-8 h-full'>
                                <ProgressSkeleton />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
