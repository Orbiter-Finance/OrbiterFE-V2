"use client"

import React, { useCallback, useEffect, useState } from 'react'
import ExploreNavCard from './ExploreNavCard'
import { BASE_URL } from '../../app/constant'
import CountUp from 'react-countup'
import { decimalNumTh } from '../../utils/decimalNum'
import { OrbiterShow, ProgressSkeleton } from '@orbiter-finance/ui'
import { pageIsMobileAtom } from '../../stores/bridge'
import { useAtomValue } from "jotai"
import { cn } from '../../utils/cn'

export default function ExploreNav() {

  const pageIsMobile = useAtomValue(pageIsMobileAtom)

  const [data, setData] = useState(null)
  const [pending, setPending] = useState(true)

  const init = useCallback(
    async () => {
      try {
        setPending(true)
        const response = await fetch(`${BASE_URL}` + "/bd-data/tx_total")
        const res = await response.json()
        setData(res?.result)
      } catch (error) {

      } finally {
        setPending(false)
      }
    },
    [],
  )

  useEffect(() => {
    let timer = setTimeout(() => {
      init()
    }, 200)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className={
      cn('w-full flex justify-between items-center gap-4 ', pageIsMobile ? "flex-wrap" : "")
    }>
      <ExploreNavCard bgKey={'tx'} title={'Total Tx'} value={
        <OrbiterShow
          when={!pending}
          fallback={
            <div className='w-20 h-7'>
              <ProgressSkeleton />
            </div>
          }
        >
          <CountUp end={Number(data?.txCount)} />
        </OrbiterShow>
      } />
      <ExploreNavCard bgKey={'vol'} title={'Total Volume'} value={
        <OrbiterShow
          when={!pending}
          fallback={
            <div className='w-20 h-7'>
              <ProgressSkeleton />
            </div>
          }
        >
          <CountUp end={Number(data?.totalUsd)}
            formattingFn={(value) => {
              return decimalNumTh(value, 0, ",", "$")
            }}
          />
        </OrbiterShow>

      }
      />
      <ExploreNavCard bgKey={'user'} title={'Total Users'} value={
        <OrbiterShow
          when={!pending}
          fallback={
            <div className='w-20 h-7'>
              <ProgressSkeleton />
            </div>
          }
        >
          <CountUp end={Number(data?.addressCount)} />
        </OrbiterShow>
      }
      />
    </div>
  )
}
