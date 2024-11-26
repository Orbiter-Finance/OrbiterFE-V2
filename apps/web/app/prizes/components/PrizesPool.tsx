'use client'

import React, { useMemo, useState } from 'react'
import { cn } from '../../../utils/cn'
import styles from "./prizes.module.css"
import { prizesPoolInfoAtom } from '../../../stores/bridge'
import { useAtomValue } from "jotai"
import { decimalNum } from '../../../utils/decimalNum'

export default function PrizesPool() {

  const prizesPoolInfo = useAtomValue(prizesPoolInfoAtom)

  const userAmount = Number(prizesPoolInfo?.totalAddressCount || 0)

  const prizeAndTxArray = [
    {
      prize: '60000',
      userAmount: '10000',
      isS: userAmount >= 0,
      isP: userAmount > 10000,
    },
    {
      prize: '66000',
      userAmount: '15000',
      isS: userAmount >= 15000,
      isP: userAmount > 25000,
    },
    {
      prize: '78000',
      userAmount: '25000',
      isS: userAmount >= 25000,
      isP: userAmount > 35000,
    },
    {
      prize: '90000',
      userAmount: '35000',
      isS: userAmount >= 44000,
      isP: userAmount > 35000,
    },
    {
      prize: '100000',
      userAmount: '44000',
      symbol: "≥",

      isS: userAmount >= 44000,
      isP: false
    },
  ]

  const progressWidth = useMemo(() => {
    let width = 0
    let idx = 0
    prizeAndTxArray.forEach(((item, index) => {
      if (item.isS) {
        width += 100 / prizeAndTxArray.length
        if (!item.isP) {
          idx = index
        }
      }
    }))

    return ({
      width,
      idx
    })
  }, [prizeAndTxArray])

  return (
    <div className='w-full p-8 mt-14 mb-16 border-[2px] border-[rgba(69,35,48,0.6)] rounded-2xl o-prizes-desction'>
      <div className='flex gap-6 mb-6'>
        <div className={
          cn('flex flex-col flex-1 items-center pt-5 pb-4 border-2 rounded-2xl border-[rgb(69,35,48)]', styles.prizesPoolCard)
        }>
          <div className='text-base o-font-500'>Prize pool (USDC) </div>
          <div className='h-16 flex items-center text-5xl o-font-600 o-prizes-pool'>{decimalNum(prizesPoolInfo?.totalReward, 0, ",")}</div>
        </div>
        <div className={cn('flex flex-col flex-1 items-center pt-5 pb-4 border-[2px] rounded-2xl border-[rgb(69,35,48)]', styles.prizesPoolCard)}>
          <div className='text-base o-font-500'>Participants</div>
          <div className='h-16 flex items-center text-5xl o-font-600 o-prizes-pool-tx'>{decimalNum(prizesPoolInfo?.totalAddressCount, 0, ",")}</div>
        </div>
      </div>
      <div>
        <div className='text-xl o-font-500 mb-3 o-prizes-pool'>Prize pool</div>
        <div className='flex'>
          {prizeAndTxArray.map((prizeAndTx, index) => {
            return (
              <div key={index} className={
                cn('flex flex-1 justify-center', progressWidth.idx === index ? "o-prizes-pool" : "")
              }>{decimalNum(prizeAndTx.prize, 0, ",", "$")}</div>
            )
          })}
        </div>
        <div className='h-8 border my-3 rounded-2xl overflow-hidden o-prizes-module-border'>
          <div className='h-full o-prizes-progress-bg rounded-2xl' style={{ width: progressWidth?.width + "%" }}></div>
        </div>
        <div className='flex'>
          {prizeAndTxArray.map((prizeAndTx, index) => {
            return (
              <div key={index} className={
                cn('flex flex-1 justify-center', progressWidth.idx === index ? "o-prizes-pool-tx" : "")
              }>{prizeAndTx?.symbol}{decimalNum(prizeAndTx.userAmount, 0, ",")}</div>
            )
          })}
        </div>
        <div className='text-xl o-font-500 mt-3 o-prizes-pool-tx'>Participants</div>
      </div>
    </div>
  )
}