"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { BASE_URL } from '../../app/constant'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import dayjs from 'dayjs'
import { decimalNum, decimalNumDec } from '../../utils/decimalNum'
import { OrbiterShow, ProgressSkeleton } from '@orbiter-finance/ui'

export default function ExploreUserChart() {

    const [list, setList] = useState<any[]>([])
    const [pending, setPending] = useState(true)


    const getData = useCallback(
        async () => {
            try {
                setPending(true)
                const response = await fetch(BASE_URL + "/bd-data/address_count_last3m")

                const res = await response.json()
                setList((res?.result || []).reverse())
            } catch (error) {

            } finally {
                setPending(false)
            }
        },
        [],
    )

    useEffect(() => {
        let timer = setTimeout(() => {
            getData()
        }, 200)
        return () => {
            clearTimeout(timer)
        }
    }, [])

    return (
        <div className='w-full border border-[var(--o-color-gray-700)] bg-[var(--o-color-gray-900)] pt-4 rounded-2xl mt-4'>
            <div className='w-full flex justify-between items-center px-5'>
                <div>
                    <div className='text-base o-font-500'>Users Statistics</div>
                </div>
            </div>
            <div className='w-full h-px bg-[var(--o-color-gray-700)] mt-4'></div>
            <div className='relative top-0 left-0 w-full h-[420px]'>

                <ResponsiveContainer width={"100%"} height={420} className="pl-6 pt-6">
                    <BarChart
                        data={list}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke='var(--o-color-gray-800)' />
                        <XAxis className='text-xs o-text-t3' tickLine={false} dataKey="source_date" tickFormatter={(props) => {
                            return dayjs(props).format("DD MMM")
                        }} />
                        <YAxis className='text-xs o-text-t3' orientation='right'
                            domain={[0, Math.max(...list.map((item) => Number(item?.address_count) || 0)) * 1.1]}
                            tickLine={false} axisLine={false} tickFormatter={(value) => {
                                return value >= 1000 ? decimalNumDec(value, 0, ",") : value
                            }} />
                        <Tooltip

                            content={(value) => {

                                const group = list.find((item: any) => item.source_date === value.label)

                                return <div className='p-3 w-56 rounded-lg border border-[var(--o-color-gray-700)] bg-[var(--o-color-gray-800)] o-text-t3 o-font-400 text-base'>
                                    <div className='text-sm'>{dayjs(value.label).format("DD MMM YYYY")}</div>
                                    <div className='o-text-t2 o-font-500'>Users: {decimalNum(group?.address_count, 0, ",")}</div>
                                </div>
                            }} />
                        <Bar
                            dataKey="address_count"
                            fill={
                                "var(--o-color-brand-700)"
                            }
                        >
                        </Bar>

                    </BarChart>
                </ResponsiveContainer>
                <OrbiterShow
                    when={pending}
                >
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex z-10 justify-center items-center pl-6">
                        <svg className='o-dash-svg w-16 h-16' viewBox="25 25 50 50">
                            <circle className='o-dash-circle' fill='none' stroke='#FF5C5C' r="20" cy="50" cx="50" strokeWidth="2" strokeDashoffset="0" strokeDasharray="1 200" strokeLinecap='round'></circle>
                        </svg>
                    </div>
                </OrbiterShow>
            </div>
        </div>
    )
}
