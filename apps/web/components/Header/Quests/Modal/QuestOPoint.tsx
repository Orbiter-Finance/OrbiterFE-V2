"use client"

import React, { useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { ChartBarBigIcon, ChevronDownIcon, WalletIcon } from 'lucide-react'
import Image from 'next/image'
import { OrbiterModal, OrbiterShow } from '@orbiter-finance/ui'
import { pageIsMobileAtom, pointRankShowAtom, pointRankUserAddressAtom, showUserPointDetailsAtom } from '../../../../stores/bridge'
import { cn } from '../../../../utils/cn'
import { decimalNum } from '../../../../utils/decimalNum'
import shortenAddress from '../../../../utils/shortenAddress'
import { useUserPointsInfo } from '../../../../hooks/useUserPointsInfo'
import useWalletAccount from '../../../../hooks/useWalletAccount'
export default function QuestOPoint() {
  const { MainWalletAccountInfo } = useWalletAccount()
  const pageIsMobile = useAtomValue(pageIsMobileAtom)
  const [show, setShow] = useState(false)

  const setShowUserPointDetails = useSetAtom(showUserPointDetailsAtom)

  const { getUserPointsInfo } = useUserPointsInfo()

  const setPointRankShow = useSetAtom(pointRankShowAtom)
  const setPointRankUserAddress = useSetAtom(pointRankUserAddressAtom)

  const userPointsRank = useMemo(() => {
    return getUserPointsInfo(MainWalletAccountInfo?.address)
  }, [getUserPointsInfo, MainWalletAccountInfo?.address])

  return (
    <OrbiterShow
      when={pageIsMobile}
      fallback={
        <>
          <div className='relative'
            onClick={(event) => {
              event.stopPropagation()
              setShow(true)
            }}
            onMouseEnter={(event) => {
              event.stopPropagation()
              setShow(true)
            }}
            onMouseLeave={(event) => {
              event.stopPropagation()
              setShow(false)
            }}
          >
            <div
              className={cn(
                'p-2 h-10 flex justify-center items-center bg-[var(--o-color-gray-800)] hover:bg-[var(--o-color-gray-700)] o-font-500 rounded-xl cursor-pointer')}
            >
              <Image src="/assets/icon/bridge/O-Points.svg" className='w-6 h-6' width={24} height={24} alt="O-Point" />
              <span className='mx-1'>{decimalNum(userPointsRank?.point?.points, 6, ",")}</span>
              <ChevronDownIcon className='w-6 h-6' />
            </div>

            {show && (
              <div className='absolute top-[100%] left-0'>
                <div className='mt-2 border border-[var(--o-color-gray-700)] bg-[var(--o-color-gray-900)] rounded-xl py-4 px-3 w-80 text-[var(--o-color-gray-400)] text-xs'>
                  <div className='flex w-full justify-between items-center'>
                    <div className='text-sm'>Total O-Points</div>
                    <div
                      onClick={(event) => {
                        event.stopPropagation()
                        setPointRankShow(true)
                        setPointRankUserAddress(MainWalletAccountInfo?.address)
                      }}
                      className='flex cursor-pointer justify-center items-center bg-[var(--o-color-brand-900)] rounded-sm py-1 px-1.5 text-[var(--o-color-brand-500)] o-font-500'>
                      <Image src="/assets/icon/header/points-rank.svg" alt="rank" width={12} height={12} className='mr-1 w-3 h-3' />
                      {decimalNum(userPointsRank?.rank?.rank, 0, ",")}
                    </div>
                  </div>
                  <div className='flex w-full justify-between items-center text-[var(--o-color-gray-50)] o-font-600 text-xl'>
                    {decimalNum(userPointsRank?.point?.points, 6, ",")}
                  </div>
                  <div className='my-2 border border-dashed border-[var(--o-color-gray-600)]'></div>
                  <div className='flex w-full justify-between items-center'>
                    <div>Basic Points</div>
                    <div className='text-[var(--o-color-gray-50)] o-font-500'>{decimalNum(userPointsRank?.point?.summary?.basePoint, 6, ",")}</div>
                  </div>
                  <div className='flex w-full justify-between items-center mt-2'>
                    <div>Activity Points</div>
                    <div className='text-[var(--o-color-gray-50)] o-font-500'>{decimalNum(userPointsRank?.point?.summary?.activityPoint, 6, ",")}</div>
                  </div>
                  <div className='flex w-full justify-between items-center mt-2'>
                    <div>Ecosystem Points</div>
                    <div className='text-[var(--o-color-gray-50)] o-font-500'>{decimalNum(userPointsRank?.point?.summary?.dappPoint, 6, ",")}</div>
                  </div>
                  <div className='w-full flex justify-between items-center'>
                    <div className='flex flex-1 mr-2 o-font-500 cursor-pointer rounded-lg justify-center items-center py-2.5 mt-2 bg-[var(--o-color-gray-800)] o-text-t2'
                      onClick={(event) => {
                        event.stopPropagation()
                        setShow(false)
                        setShowUserPointDetails(true)
                      }}
                    >
                      <ChartBarBigIcon className='w-5 h-5 mr-1' /> O-Points Details
                    </div>
                    <div className='flex w-1/2 o-font-500 cursor-pointer rounded-lg justify-center items-center py-2.5 mt-2 bg-[var(--o-color-gray-800)] o-text-t2'
                      onClick={(event) => {
                        event.stopPropagation()
                        setPointRankShow(true)
                        setPointRankUserAddress(MainWalletAccountInfo?.address)
                      }}
                    >
                      <Image src="/assets/image/header/point-rank.png" alt="Point Rank" className='w-5 h-5 mr-1' width={20} height={20} /> Leaderboard
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>

      }
    >
      <div className='flex justify-between items-center w-full h-20 relative'>
        <div className='w-[78%] bg-[var(--o-color-gray-800)] h-full rounded-xl quests-point-card p-3'>
          <div className='text-[var(--o-color-gray-50)] text-2xl o-font-600'>{decimalNum(userPointsRank?.point?.points, 6, ",")}</div>
          <div className='flex items-center text-[var(--o-color-gray-400)] mt-1 text-sm whitespace-nowrap'>
            O-Points <WalletIcon className='w-4 h-4 mx-1' /> {shortenAddress(MainWalletAccountInfo?.address || "", 6)}
          </div>
        </div>
        <Image src="/assets/image/quests/O-point-quests.png" className='w-[27px] absolute top-0.5 right-14' width={54} height={58} alt="O-Point" />
        <Image src="/assets/icon/bridge/O-Points.svg" className='w-[3.75rem] h-16' width={120} height={128} alt="O-Point" />
      </div>
    </OrbiterShow>
  )
}