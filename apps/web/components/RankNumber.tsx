import { OrbiterShow } from '@orbiter-finance/ui'
import React from 'react'
import { decimalNumTh } from '../utils/decimalNum'

export default function RankNumber({
    num
}: { num?: string }) {
    return (
        <OrbiterShow
            when={Number(num) !== 1}
            fallback={
                <div className='w-6 h-6 flex justify-center items-center rounded-full text-sm o-font-500 bg-[var(--o-color-yellow-500)] text-[var(--o-color-gray-900)]'>
                    1
                </div>
            }
        >
            <OrbiterShow
                when={Number(num) !== 2}
                fallback={
                    <div className='w-6 h-6 flex justify-center items-center rounded-full text-sm o-font-500 bg-[var(--o-color-gray-100)] text-[var(--o-color-gray-900)]'>
                        2
                    </div>
                }
            >
                <OrbiterShow
                    when={Number(num) !== 3}
                    fallback={
                        <div className='w-6 h-6 flex justify-center items-center rounded-full text-sm o-font-500 bg-[var(--o-color-yellow-700)] text-[var(--o-color-gray-900)]'>
                            3
                        </div>
                    }
                >
                    {decimalNumTh(num, 0, ",")}
                </OrbiterShow>
            </OrbiterShow>
        </OrbiterShow>
    )
}
