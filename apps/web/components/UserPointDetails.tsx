import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { OrbiterModal, OrbiterShow } from '@orbiter-finance/ui'
import { useAtom, useAtomValue } from "jotai"
import { pageIsMobileAtom, showUserPointDetailsAtom } from '../stores/bridge'
import useWalletAccount from '../hooks/useWalletAccount'
import { useUserPointsInfo } from '../hooks/useUserPointsInfo'
import { decimalNum } from '../utils/decimalNum'
import { cn } from '../utils/cn'
import NFT from './NFT'
export default function UserPointDetails() {

    const pageIsMobile = useAtomValue(pageIsMobileAtom)
    const { MainWalletAccountInfo } = useWalletAccount()
    const { getUserPointsInfo } = useUserPointsInfo()
    const [optionDetailsTabKey, setOptionDetailsTabKey] = useState("NFT")


    const [showUserPointDetails, setShowUserPointDetails] = useAtom(showUserPointDetailsAtom)

    const userPointsInfo = useMemo(() => {
        return getUserPointsInfo(MainWalletAccountInfo?.address)
    }, [getUserPointsInfo, MainWalletAccountInfo?.address])

    return (
        <OrbiterModal
            headerLabel={"O-Points Details"}
            show={showUserPointDetails}
            containerClassName='sm:max-w-[32rem] bg-[var(--o-color-gray-800)] py-4 max-h-[40rem]'
            onShowChange={(open) => {
                setShowUserPointDetails(open)
            }}
        >
            <div className='w-full flex justify-between items-center mt-1 bg-[var(--o-color-gray-900)] rounded-xl py-3 text-xs flex-wrap'>
                <div className={cn(pageIsMobile ? "w-1/2 px-3" : "px-3 border-r border-[var(--o-color-gray-700)]")}>
                    <div className='text-[var(--o-color-gray-400)]'>Total O-Points</div>
                    <div className='text-lg o-font-500'>{decimalNum(userPointsInfo?.point?.points, 6, ",")}</div>
                </div>
                <div className={cn(pageIsMobile ? "w-1/2 px-3" : "flex-1 px-3")}>
                    <div className='text-[var(--o-color-gray-400)]'>Base O-Points</div>
                    <div className='text-lg o-font-500'>{decimalNum(userPointsInfo?.point?.summary?.basePoint, 6, ",")}</div>
                </div>
                <div className={cn(pageIsMobile ? "w-1/2 mt-3 px-3" : "flex-1 px-3")}>
                    <div className='text-[var(--o-color-gray-400)]'>Activity O-Points</div>
                    <div className='text-lg o-font-500'>{decimalNum(userPointsInfo?.point?.summary?.activityPoint, 6, ",")}</div>
                </div>
                <div className={cn(pageIsMobile ? "w-1/2 mt-3 px-3" : "flex-1 px-3")}>
                    <div className='text-[var(--o-color-gray-400)]'>Ecosystem O-Points</div>
                    <div className='text-lg o-font-500'>{decimalNum(userPointsInfo?.point?.summary?.dappPoint, 6, ",")}</div>
                </div>
            </div>
            <div className='flex justify-start items-center mt-4 text-sm'>
                {/* <div onClick={(event) => {
                event.stopPropagation()
                setOptionDetailsTabKey("Transactions")
              }} className={
                cn('rounded-full o-font-500 mr-2 px-4 py-1 cursor-pointer',
                  optionDetailsTabKey === "Transactions" ? "bg-[var(--o-color-brand-800)] border-[var(--o-color-brand-900)] text-[var(--o-color-brand-500)]" : "bg-[var(--o-color-gray-900)]")
              }>Transactions</div> */}
                <div onClick={(event) => {
                    event.stopPropagation()
                    setOptionDetailsTabKey("NFT")
                }} className={
                    cn('rounded-full border border-transparent px-4 py-1 cursor-pointer',
                        optionDetailsTabKey === "NFT" ? "bg-[var(--o-color-brand-800)] border-[var(--o-color-brand-900)] text-[var(--o-color-brand-500)]" : "bg-[var(--o-color-gray-900)]"
                    )
                }>My Orbiter NFT</div>
            </div>
            <OrbiterShow
                when={optionDetailsTabKey === "Transactions"}
                fallback={
                    <div className='w-full h-full max-h-full overflow-auto'>
                        <NFT />
                    </div>
                }
            >
                <div className="w-full h-full mt-3 rounded-xl px-3 bg-[var(--o-color-gray-900)] py-2.5">
                    <div className="flex justify-start items-center text-[var(--o-color-gray-400)] text-xs">
                        <div className='w-1/3'>Activity</div>
                        <div className='w-1/3'>O-Points</div>
                        <div className='w-1/3'>Time</div>
                    </div>
                    <div className='w-full min-h-[16.25rem] flex justify-center items-center'>
                        <div className='w-full'>
                            <div className='flex justify-center'>
                                <Image src="/assets/image/quests/empty.png" alt="" className='w-32 h-32' width={120} height={120} />
                            </div>
                            <div className='w-full flex justify-center'>No History</div>
                        </div>

                    </div>
                    {/* {
                  new Array(10).fill(0).map((item, index) => {
                    return <div key={index} className="flex justify-start items-center text-sm o-font-500 pt-2.5">
                      <div className='w-1/3'>Activity</div>
                      <div className='w-1/3'>+20</div>
                      <div className='w-1/3'>2024 8.12 12:02:24</div>
                    </div>
                  })
                } */}
                </div>
            </OrbiterShow>
        </OrbiterModal>
    )
}
