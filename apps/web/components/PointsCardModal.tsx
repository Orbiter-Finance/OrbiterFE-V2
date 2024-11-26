import { OrbiterShow } from '@orbiter-finance/ui'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAtom, useAtomValue } from "jotai"
import { pointCardShowAtom, pointCardUserAddressAtom, pointsInfoRefreshAtom, userPointsDrawCardListAtom, userPointsInfoListAtom, userPointsRankListAtom } from '../stores/bridge'
import LotteryDraw from './LotteryDraw'
import Image from 'next/image'
import { useUserPointsInfo } from '../hooks/useUserPointsInfo'
import { decimalNum } from '../utils/decimalNum'
import { BASE_URL } from '../app/constant'
import { useOrbiterToast } from './useOrbiterToast'

export default function PointsCardModal() {
    const [pointCardShow, setPointCardkShow] = useAtom(pointCardShowAtom)
    const pointCardUserAddress = useAtomValue(pointCardUserAddressAtom)
    const [pointsInfoRefresh, setPointsInfoRefresh] = useAtom(pointsInfoRefreshAtom)
    const { getUserPointsInfo } = useUserPointsInfo()

    const userPointsDrawCardList = useAtomValue(userPointsDrawCardListAtom)

    const [nextKey, setNextKey] = useState("")

    const [points, setPoints] = useState("")
    const [pending, setPending] = useState(false)

    const { orbiterTotas } = useOrbiterToast()

    const pointRankUserInfo = useMemo(() => {
        return getUserPointsInfo(pointCardUserAddress)
    }, [pointsInfoRefresh, pointCardUserAddress, userPointsDrawCardList])

    const close = useCallback(
        () => {
            setPointsInfoRefresh(0)
            setPointCardkShow(false)
        },
        [],
    )

    const draw = useCallback(
        async () => {
            if (pending) return
            setPending(true)
            try {
                const responese = await fetch(BASE_URL + "/points_system/user/card/draw/", {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        address: pointCardUserAddress,
                    }),
                })
                const res = await responese.json()
                if (!res?.data) {
                    throw new Error(res?.message || "Draw Point Card Error")
                }
                const nextkey = +new Date()
                setTimeout(() => {
                    if (pointsInfoRefresh) {
                        setNextKey(String(nextkey))
                    }
                    setPoints(res?.data?.points)
                    setPointsInfoRefresh(nextkey)
                }, 200)
            } catch (error) {
                setPoints("")
                orbiterTotas.error({
                    title: String(error)
                })
                setPointsInfoRefresh(0)
                setPointCardkShow(false)

            } finally {
                setPending(false)
            }
        },
        [pointCardShow, pointCardUserAddress, pending, pointsInfoRefresh, nextKey],
    )

    useEffect(() => {
        let timer
        if (pointCardShow) {
            timer = setTimeout(() => {
                draw()
            }, 200)
        }
        return () => {
            clearTimeout(timer)
        }
    }, [pointCardShow])

    return (
        <OrbiterShow
            when={!!pointsInfoRefresh && pointCardShow}
        >
            <div className='fixed top-0 left-0 bottom-0 right-0 z-[var(--modal-bg-z-index)]'></div>
            <div className='fixed w-full h-full z-[var(--modal-z-index)] top-0 left-0 flex justify-center items-center'>
                <LotteryDraw
                    nextKey={nextKey}
                    isClose
                    onClose={close}
                >
                    <div className='w-80 p-5 o-reward-card-bg rounded-3xl border-2 border-black'>
                        <div className='w-full text-center text-2xl o-font-600 whitespace-nowrap'>
                            🎉 <span className='o-reward-card-text o-linear-text'>Congratulations!</span> <span className='rotate-90'>🎉</span>
                        </div>
                        <div className='w-full px-5'>
                            <div className='w-full mt-2 flex justify-center items-center'>
                                <Image src="/assets/image/main/point-card.png" alt="Points Reward" width={464} height={288} className='w-56 h-36' />
                            </div>
                            <div className='w-full text-center'>
                                <div className='o-font-600 text-xl text-[var(--o-color-gray-900)] mt-3 mb-2'>+{points} O-Points</div>
                                <div className='text-sm o-font-400 o-text-t4 px-5'>
                                    Revealing cards to unlock <br />
                                    <span className='text-[var(--o-color-gray-900)] o-font-500'>O-Points(1-20)</span> is achievable by bridging 3 TXs.
                                </div>

                                <div
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        if (pointRankUserInfo?.card?.cardsCount) {
                                            draw()
                                        } else {
                                            close()
                                        }
                                    }}
                                    className='w-full cursor-pointer rounded-3xl bg-[var(--o-color-brand-500)] hover:bg-[var(--o-color-brand-600)] text-lg o-font-600 text-[var(--o-color-gray-900)] py-3 my-3'>
                                    Continue
                                </div>

                                <div className='w-full text-sm o-text-t4'>
                                    Your chances to reveal cards: {decimalNum(pointRankUserInfo?.card?.cardsCount)}
                                </div>
                            </div>

                        </div>
                    </div>
                </LotteryDraw>
            </div>
        </OrbiterShow>
    )
}
