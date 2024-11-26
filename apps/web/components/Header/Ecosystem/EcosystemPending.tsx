"use client"

import { ProgressSkeleton } from '@orbiter-finance/ui'
import React from 'react'

export default function EcosystemPending() {
    return (
        <div className='w-full rounded-lg mt-3 bg-[var(--o-color-gray-900)]'>
            <div className='w-full h-28'>
                <ProgressSkeleton />
            </div>
            <div className='px-2 py-3 flex w-full justify-between items-center'>
                <div className='w-9/12 h-5'>
                    <ProgressSkeleton />
                </div>
                <div className='w-1/6 h-5'>
                    <ProgressSkeleton />
                </div>
            </div>
        </div>
    )
}
