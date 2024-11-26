import { OrbiterModal, OrbiterShow, ProgressSkeleton } from '@orbiter-finance/ui'
import { Clock4, XIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PaginatedList from '../app/prizes/components/PrizeRankPagination'
import { pointRankShowAtom, pointRankUserAddressAtom } from '../stores/bridge'
import { useAtom, useAtomValue } from "jotai"
import { useUserPointsInfo } from '../hooks/useUserPointsInfo'
import WalletAvater from './WalletAvater'
import { decimalNum, decimalNumLine } from '../utils/decimalNum'
import { BASE_URL } from '../app/constant'
import Empty from './Empty'
import { cn } from '../utils/cn'
import RankNumber from './RankNumber'

export default function PointsRank() {
    const [pointRankShow, setPointRankShow] = useAtom(pointRankShowAtom)
    const pointRankUserAddress = useAtomValue(pointRankUserAddressAtom)
    const { getUserPointsInfo } = useUserPointsInfo()

    const pointRankUserInfo = useMemo(() => getUserPointsInfo(pointRankUserAddress), [pointRankUserAddress])

    const [pointRankInfo, setPointRankInfo] = useState(null)

    const [page, setPage] = useState(1)
    const [pending, setPending] = useState(true)
    const [list, setList] = useState([])

    const init = useCallback(
        async () => {
            try {

                const response = await fetch(`${BASE_URL}/points_platform/rank/info`)
                const res = await response.json()
                setPointRankInfo(res?.result)
            } catch (error) {
                console.log("error", error)
            }
        },
        [],
    )

    const getPointRankList = useCallback(
        async () => {
            setPending(true)
            setList([])
            try {
                const response = await fetch(`${BASE_URL}/points_platform/rank/top?page=${page}&pageSize=20`)
                const res = await response.json()
                setList(res?.result || [])
            } finally {
                setPending(false)
            }
        },
        [page],
    )

    const close = useCallback(
        () => {
            setPointRankShow(false)
        },
        [],
    )

    useEffect(() => {
        let timer
        if (pointRankShow) {
            timer = setTimeout(() => {
                init()
            }, 200)
        }
        return () => {
            clearTimeout(timer)
        }
    }, [pointRankShow])

    useEffect(() => {
        let timer
        if (pointRankShow) {
            timer = setTimeout(() => {
                getPointRankList()
            }, 200)
        }
        return () => {
            clearTimeout(timer)
        }
    }, [page, pointRankShow])

    const timeMin = useMemo(() => {
        const lastRefreshTime = pointRankInfo?.lastRefreshTime
        const current = +new Date()
        const timer = current - lastRefreshTime

        return lastRefreshTime ? Math.ceil(timer / 60 / 1000) || "0" : "--"
    }, [pointRankInfo])



    return (
        <OrbiterModal
            show={pointRankShow}
            headerRender={<></>}
            containerClassName='sm:w-[45rem] sm:max-w-[45rem] sm:min-w-[45rem] pt-0 pb-0 pl-0 pr-0 px-0 min-h-[40rem] h-[40rem]'
        >
            <div className='rounded-2xl border border-[var(--o-color-gray-700)] bg-[var(--o-color-gray-900)] overflow-hidden flex flex-col'>
                <div
                    onClick={(event) => {
                        event.stopPropagation()
                    }}
                    className='w-full p-4 relative overflow-hidden point-rank-top'>
                    <div className='w-full relative'>
                        <div className='o-text-t1 text-xl o-font-500'>O-Points Leaderboard</div>
                        <div className='mt-4 text-base o-text-t2 o-font-400'>Total O-Points</div>
                        <div className='mt-1 flex justify-start items-center'>
                            <div className='text-3xl o-font-600'>
                                {decimalNumLine(pointRankInfo?.totalPoint, 0, ",")}
                            </div>
                            <div className='ml-2 o-text-t3 text-xs o-font-500 flex justify-start items-center'>
                                <Clock4 className='w-4 h-4 mr-1' />
                                {timeMin}m ago
                            </div>
                        </div>
                        <div className='flex justify-start items-center o-font-400 mt-4'>
                            <div className='mr-6'>
                                <span className='mr-2 text-sm o-text-t3'>Total Users: </span><span className='text-[var(--o-color-brand-500)] o-font-500'>
                                    {decimalNumLine(pointRankInfo?.addressCount, 0, ",")}
                                </span>
                            </div>
                            <div>
                                <span className='mr-2 text-sm o-text-t3'>Top 1% Address: </span><span className='text-[var(--o-color-brand-500)] o-font-500'>{decimalNumLine(pointRankInfo?.ratePoint, 0, ",", "> ")} Points</span>
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={(event) => {
                            event.stopPropagation()
                            close()
                        }}
                        className='absolute top-4 right-4 z-[5] w-6 h-6 rounded-sm bg-[var(--o-color-gray-800)] flex justify-center items-center cursor-pointer'>
                        <XIcon strokeWidth={2} className='w-4 h-4' />
                    </div>
                </div>
                <div className='w-full max-w-full overflow-auto flex justify-start flex-col flex-1'>
                    <div className='w-[44.5rem] overflow-auto flex flex-col flex-1'>
                        <div className='flex w-full py-2 justify-between items-center px-3.5 o-text-t3 text-xs o-font-400 text-left'>
                            <div className='w-16'>
                                <div className='w-6 text-center'>Rank</div>
                            </div>
                            <div className='flex-1'>User</div>
                            <div className='w-1/6'>Basic Points</div>
                            <div className='w-1/6'>Activity Points</div>
                            <div className='w-1/6'>Ecosystem Points</div>
                            <div className='w-1/6'>Total Points</div>
                        </div>
                        <div className='flex w-full py-3 justify-between items-center px-3.5 o-text-t1 text-sm o-font-400 text-left bg-[var(--o-color-yellow-900)]'>
                            <div className='w-16'>
                                <div className='w-6 text-center'>
                                    {decimalNumLine(pointRankUserInfo?.rank?.rank, 0, ",")}
                                </div>
                            </div>
                            <div className='flex-1 flex justify-start items-center  o-font-500'>
                                <WalletAvater
                                    walletAddress={pointRankUserAddress}
                                    className="w-6 h-6 mr-2"
                                />
                                My Account
                            </div>
                            <div className='w-1/6'>
                                {decimalNumLine(pointRankUserInfo?.point?.summary?.basePoint, 0, ",")}
                            </div>
                            <div className='w-1/6'>
                                {decimalNumLine(pointRankUserInfo?.point?.summary?.activityPoint, 0, ",")}
                            </div>
                            <div className='w-1/6'>
                                {decimalNumLine(pointRankUserInfo?.point?.summary?.dappPoint, 0, ",")}
                            </div>
                            <div className='w-1/6'>
                                {decimalNumLine(pointRankUserInfo?.point?.points, 0, ",")}
                            </div>
                        </div>
                        <div className='w-full flex-1 overflow-auto'>
                            <OrbiterShow
                                when={!pending}
                                fallback={
                                    <div className='w-full h-80'>
                                        {
                                            new Array(7).fill(0).map((item, index) => {
                                                return <div key={index} className='w-full h-6 mt-5 flex px-3.5 justify-between items-center'>
                                                    <div className='w-16 h-full pr-4'>
                                                        <ProgressSkeleton />
                                                    </div>
                                                    <div className='flex-1 h-full pr-8'>
                                                        <ProgressSkeleton />
                                                    </div>
                                                    <div className='w-1/6 h-full pr-8'>
                                                        <ProgressSkeleton />
                                                    </div>
                                                    <div className='w-1/6 h-full pr-8'>
                                                        <ProgressSkeleton />
                                                    </div>
                                                    <div className='w-1/6 h-full pr-8'>
                                                        <ProgressSkeleton />
                                                    </div>
                                                    <div className='w-1/6 h-full pr-8'>
                                                        <ProgressSkeleton />
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                }
                            >
                                <OrbiterShow
                                    when={!!list?.length}
                                    fallback={
                                        <div className='w-full my-12'>
                                            <Empty emptyText='No Data' />
                                        </div>
                                    }
                                >
                                    {
                                        list.map((item) => {
                                            return <div key={item?.rank} className='flex w-full h-11 justify-between items-center px-3.5 o-text-t1 text-sm o-font-400 text-left'>
                                                <div className='w-16'>
                                                    <div className={
                                                        cn('w-6 text-center')
                                                    }>
                                                        <RankNumber num={item?.rank} />
                                                    </div>
                                                </div>
                                                <div className='flex-1'>{item?.address}</div>
                                                <div className='w-1/6'>{decimalNumLine(item?.basePoints, 2, ",")}</div>
                                                <div className='w-1/6'>{decimalNumLine(item?.totalActivityPoints, 2, ",")}</div>
                                                <div className='w-1/6'>
                                                    {decimalNumLine(Number(item?.dappPoints || 0) + Number(item?.ecosystemPoints || 0), 2, ",")}
                                                </div>
                                                <div className='w-1/6'>{decimalNumLine(item?.totalPoints, 2, ",")}</div>
                                            </div>
                                        })
                                    }
                                </OrbiterShow>
                            </OrbiterShow>
                        </div>
                    </div>
                </div>
                <div className='mt-1 mb-3 w-full flex justify-center items-center'>
                    <div className='text-xs'>
                        <PaginatedList total={20000} itemsPerPage={20} onPageChange={(currentPage) => {
                            setPage(currentPage)
                        }} />
                    </div>
                </div>
            </div>
        </OrbiterModal >
    )
}
