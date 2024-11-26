import React from 'react'
import { ProgressSkeleton } from '@orbiter-finance/ui'
import { useAtomValue } from 'jotai'
import { pageIsMobileAtom } from '../stores/bridge'

export default function Pending() {
    const pageIsMobile = useAtomValue(pageIsMobileAtom)
    return (
        <div className='w-full p-4'>
            {
                new Array(pageIsMobile ? 5 : 10).fill(0).map((item, index) => {
                    return <div key={index} className='w-full flex justify-between mb-2 py-1.5'>
                        <div className='w-1/4 mr-2 h-6'>
                            <ProgressSkeleton />
                        </div>
                        <div className='w-1/12 mr-2 h-6'>
                            <ProgressSkeleton />
                        </div>
                        <div className='flex-1 h-6'>
                            <ProgressSkeleton />
                        </div>
                    </div>
                })
            }
        </div>
    )
}
