"use client"

import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { decimalNum, decimalNumDec } from '../../utils/decimalNum'
import { cn } from '../../utils/cn'
import { BASE_URL } from '../../app/constant'
import dayjs from 'dayjs'
import { OrbiterShow, ProgressSkeleton } from '@orbiter-finance/ui'

const barColor =
    ["#404E9F", "var(--o-color-brand-700)", "#3C85C7", "#C18637", "#593BAF", "#769948", "#3F8A98", "#B83470", "var(--o-color-brand-600)"].reverse()


interface ExploreChartsType {
    title: ReactNode,
    dataKey: string
    chartKey: "tx" | "amount"
    label: ReactNode
    viceTitle?: ReactNode,
    isToggle?: boolean
}

export default function ExploreCharts({
    title,
    viceTitle,
    dataKey,
    isToggle,
    label,
    chartKey
}: ExploreChartsType) {

    const [isSource, setIsSpurce] = useState(true)
    const [pending, setPending] = useState(true)

    const [sourceList, setSourceList] = useState<any[]>([])
    const [targetList, setTargetList] = useState<any[]>([])

    const getData = useCallback(
        async () => {
            const list = isSource ? sourceList : targetList
            if (list?.length) {
                setPending(false)
                return
            }
            try {
                setPending(true)
                const response = await fetch(BASE_URL + (
                    chartKey === "tx" ? "/partner-data-openness/transcations/day_tx" : "/partner-data-openness/transcations/day_amount"
                ) + "?type=" + (isSource ? "source" : "target"))

                const res = await response.json()
                if (isSource) {
                    setSourceList(res?.result || [])
                } else {
                    setTargetList(res?.result || [])
                }
            } catch (error) {

            } finally {
                setPending(false)
            }
        },
        [isSource, chartKey],
    )

    useEffect(() => {
        let timer = setTimeout(() => {
            getData()
        }, 200)
        return () => {
            clearTimeout(timer)
        }
    }, [isSource])

    const list = useMemo(() => isSource ? sourceList : targetList, [isSource, sourceList, targetList])

    const chainList = useMemo(() => {
        return [...new Set(list.map((item) => item.chain_id))]
    }, [list])

    const chainInfoList = useMemo(() => {
        return chainList.map((item) => {
            const group = list.find((option) => option.chain_id === item)
            return ({
                chainId: item,
                chainName: group?.chainName || item
            })
        })
    }, [list])

    const viewData = useMemo(() => {
        const timeList = [...new Set(list.map((item) => item.day))].sort((a, b) => {
            return +dayjs(a) - + dayjs(b)
        })

        let initChainObj = {}
        chainList.forEach((item) => {
            initChainObj[item] = 0
        })

        let obj = {}

        list.forEach((item) => {
            const timeGroup = obj[item.day] || {}
            obj = {
                ...obj,
                [item.day]: {
                    ...initChainObj,
                    ...timeGroup,
                    [item.chain_id]: Number(item?.[dataKey] || 0) + Number(item?.vz_tx || 0)
                }
            }
        })

        const data = timeList.map((item) => ({
            day: item,
            ...(obj[item] || initChainObj)
        }))

        return data

    }, [list, chainList])

    const filterChainData = useMemo(() => {
        const filterChain = viewData[viewData.length - 2] || {}

        return Object.keys(filterChain).filter((item) => item !== "day").map((item) => {
            return ({
                chainId: item,
                value: filterChain[item]
            })
        })
    }, [viewData])

    const filterChainList = useMemo(() => {
        const filterChainList = filterChainData.sort((a, b) => {
            return b.value - a.value
        }).slice(0, 8).map((item) => item.chainId)

        return filterChainList

    }, [viewData, filterChainData])

    const viewList = useMemo(() => {
        return viewData.map((item) => {
            const keys = Object.keys(item)
            let datavalue = {}
            let otherValue = 0
            keys.forEach((option) => {
                const flag = filterChainList.some((chainId) => chainId === option)
                if (option === "day") {
                    datavalue = {
                        ...datavalue,
                        day: item.day,
                    }
                } else if (flag) {
                    datavalue = {
                        ...datavalue,
                        [option]: item[option],
                    }
                } else {
                    otherValue += item[option]
                    datavalue = {
                        ...datavalue,
                        other: otherValue
                    }
                }
            })

            return datavalue
        })
    }, [filterChainList, viewData])

    const viewChainList = Object.keys(viewList[0] || {}).filter((item) => {
        return item !== "day"
    }).filter((item) => item !== "other")
        .concat(Object.keys(viewList[0] || {}).filter((item) => item === "other"))

    const isTx = chartKey === 'tx'

    return (
        <div className={
            cn('w-full border border-[var(--o-color-gray-700)] bg-[var(--o-color-gray-900)] rounded-2xl mt-4', isTx ? "pt-3" : "pt-4")
        }>
            <div className='w-full sm:flex justify-between items-center px-4 sm:px-5'>
                <div>
                    <div className='text-base o-font-500'>{title}</div>
                    <OrbiterShow
                        when={!!viceTitle}
                    >
                        <div className='text-xs o-text-t3'>{viceTitle}</div>
                    </OrbiterShow>
                </div>
                <OrbiterShow
                    when={isToggle}
                >
                    <div className='flex mt-3.5 sm:mt-0 sm:justify-end items-center'>
                        <div className='flex justify-center items-center p-1 bg-black rounded-xl'>
                            <div onClick={(event) => {
                                event.stopPropagation()
                                setIsSpurce(true)
                            }} className={
                                cn('cursor-pointer text-sm py-1 px-2 rounded-lg mr-0.5',
                                    isSource ? "bg-[var(--o-color-gray-700)] o-text-t1" : "o-text-t3 hover:bg-[var(--o-color-gray-800)]")
                            }>Source chain</div>
                            <div onClick={(event) => {
                                event.stopPropagation()
                                setIsSpurce(false)
                            }} className={
                                cn('cursor-pointer text-sm py-1 px-2 rounded-lg',
                                    !isSource ? "bg-[var(--o-color-gray-700)] o-text-t1" : "o-text-t3 hover:bg-[var(--o-color-gray-800)]"
                                )
                            }>Destination chain</div>
                        </div>
                    </div>

                </OrbiterShow>
            </div>
            <div className={
                cn('w-full h-px bg-[var(--o-color-gray-700)]', isTx ? "mt-3" : "mt-4")
            }></div>
            <div className='w-full flex justify-start items-center my-3 sm:my-0 px-4 sm:px-5 sm:h-10 o-text-t3 text-sm flex-wrap'>

                <OrbiterShow
                    when={!pending}
                    fallback={
                        barColor.map((item, index) => {
                            return <div key={item} className='flex justify-start items-center mr-3 sm:mr-4 sm:h-full'>
                                <div className='w-3 h-3  rounded-[2px] sm:rounded-sm mr-1 sm:mr-2' style={{ backgroundColor: item }} ></div>
                                <div className='w-20 h-5 py-0.5'>
                                    <ProgressSkeleton />
                                </div>
                            </div>
                        })
                    }
                >
                    {
                        viewChainList.map((item, index) => {
                            const chainInfo = chainInfoList.find((option) => option.chainId === item)
                            return <div key={item} className='flex justify-start items-center mr-3 sm:mr-4'>
                                <div className='w-3 h-3 rounded-[2px] sm:rounded-sm mr-1 sm:mr-2' style={{ backgroundColor: barColor[index] }} ></div>
                                <div>{chainInfo?.chainName || item}</div>
                            </div>
                        })
                    }
                </OrbiterShow>

            </div>
            <div className='relative top-0 left-0 w-full h-[420px]'>
                <ResponsiveContainer width={"100%"} height={420} className="pl-6 h-[420px]">
                    <BarChart
                        data={viewList}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke='var(--o-color-gray-800)' />
                        <XAxis className='text-xs o-text-t3' tickLine={false} dataKey="day" tickFormatter={(props) => {
                            return dayjs(props).format("DD MMM")
                        }} />
                        <YAxis className='text-xs o-text-t3' orientation='right' tickLine={false} axisLine={false} tickFormatter={(value) => {

                            return value >= 1000 ? decimalNumDec(value, 0, ",") : value
                        }} />
                        <Tooltip

                            content={(value) => {
                                const group: any = viewList.find((item: any) => item.day === value.label)

                                let total = 0
                                Object.keys(group || {}).filter((item) => item !== "day").forEach((item) => {
                                    total += group?.[item] || 0
                                })

                                return <OrbiterShow
                                    when={!!group}
                                >
                                    <div className='p-3 w-56 rounded-lg border border-[var(--o-color-gray-700)] bg-[var(--o-color-gray-800)] o-text-t3 o-font-400 text-base'>
                                        <div className='text-sm'>{dayjs(group?.day).format("DD MMM YYYY")}</div>
                                        <div className='o-text-t2 o-font-500'>{label} {decimalNum(total, 0, ",")}</div>
                                        {
                                            viewChainList.filter((item) => {
                                                return item !== "day"
                                            }).map((item, index) => {
                                                const chainInfo = chainInfoList.find((option) => option.chainId === item)
                                                return <div key={item} className='flex justify-between items-center o-font-400 o-text-t3 text-sm mt-2.5'>

                                                    <div className='flex justify-start items-center'>
                                                        <div className='w-3 h-3 rounded-sm mr-2' style={{ backgroundColor: barColor[index] }} >
                                                        </div>
                                                        <div>{chainInfo?.chainName || item}</div>

                                                    </div>
                                                    <div>{decimalNum(group?.[item], 0, ",")}</div>
                                                </div>
                                            })
                                        }

                                    </div>
                                </OrbiterShow>
                            }} />
                        {
                            viewChainList.map((item, idx) => {
                                return <Bar
                                    key={item}
                                    dataKey={item}
                                    stackId="tx"
                                    fill={
                                        barColor[idx % barColor.length]
                                    }
                                >
                                </Bar>
                            })
                        }
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
