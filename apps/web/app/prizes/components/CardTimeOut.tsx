"use client"

import React from 'react'
import useTimeOutSec from '../../../hooks/useTimeOutSec'

export default function CardTimeOut({
  timerStr
}: { timerStr: string }) {

  const { timeList } = useTimeOutSec(timerStr)

  return (
    <div className='flex gap-5 justify-center w-full'>
      {timeList.map((item) => {
        return (
          <div key={item.label} className='flex flex-col items-center'>
            <span className='text-xl o-font-600'>{item.value}</span>
            <span className='text-xs o-font-400 text-[var(--o-color-yellow-100)]'>{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}
