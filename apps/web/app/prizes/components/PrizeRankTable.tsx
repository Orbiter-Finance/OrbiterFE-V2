"use client"

import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import Image from 'next/image'

import usePagination from '../../../hooks/usePagination'
import PaginatedList from './PrizeRankPagination'
import { OrbiterShow, ProgressSkeleton } from '@orbiter-finance/ui'
import WalletAvater from '../../../components/WalletAvater'
import { decimalNum } from '../../../utils/decimalNum'
import { cn } from '../../../utils/cn'

export interface HeaderItem<T> {
  content: string
  key: string
  width: number

  render?: (params: T) => ReactNode
}

export interface PrizeRankTableProps<T> {
  headerArray: HeaderItem<T>[]
  dataArray: T[]
  isShowIndex: boolean
  pending: boolean
  isTotal: boolean
  paginationKey: string
  totalRankCount: number
  handlePage: (page: string | number) => void
  userWeekInfo: T

}

export const PrizeRankTable = <T,>({
  headerArray,
  dataArray,
  pending,
  isTotal,
  paginationKey,
  handlePage,
  totalRankCount,
  userWeekInfo
}: PrizeRankTableProps<T>) => {

  const [page, setPage] = useState(1)

  const viewList = useMemo(() => {
    const start = (page - 1) * 10
    return isTotal ? dataArray : dataArray.slice(start, start + 10)
  }, [page, dataArray, isTotal])

  const onPageChange = useCallback((currentPage: number) => {
    setPage(currentPage)
    handlePage(currentPage)
  }, [])

  return (
    <div className='w-full flex flex-col rounded-xl border-[1px] border-[rgb(69,35,48)] overflow-hidden'>
      <div className='h-12 flex items-center bg-[rgb(30,20,14)] text-sm font-normal'>
        {headerArray.map((header, index) => (
          <div key={index} className='flex justify-center first:justify-start last:justify-end px-4' style={{ width: `${header.width}%` }}>
            {header.content}
          </div>
        ))}
      </div>
      <OrbiterShow
        when={!pending}
        fallback={
          <div className='w-full'>
            {
              new Array(11).fill(0).map((item, index) => {
                return <div key={index} className='w-full flex justify-between px-4 border-b border-[rgb(69,35,48)]'>
                  {headerArray.map((header, colIndex) => (
                    <div key={colIndex} className='flex justify-center first:justify-start last:justify-end' style={{ width: `${header.width}%` }}>
                      <div className='w-3/5 h-12 my-2'>
                        <ProgressSkeleton />
                      </div>
                    </div>
                  ))}
                </div>
              })
            }
          </div>
        }
      >
        <OrbiterShow when={!!userWeekInfo}>
          <div className='w-full'>
            {[userWeekInfo].map((data: T, rowIndex) => (
              <div key={rowIndex} className={
                cn('h-16 flex items-center border-b border-[rgb(69,35,48)] px-4', (data as any)?.myInfo ? "bg-[var(--o-color-yellow-900)]" : "")
              }>
                {headerArray.map((header, colIndex) => (
                  <div key={colIndex} className='flex justify-center first:justify-start last:justify-end' style={{ width: `${header.width}%` }}>
                    {header?.render?.(data) || data?.[header.key]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </OrbiterShow>

        <OrbiterShow
          when={!!dataArray.length}
          fallback={
            <div className='w-full my-20 flex justify-center items-center'>
              <Image src="/assets/image/quests/empty.png" className='w-60 h-60' alt="No Data" width={504} height={504} />
            </div>
          }
        >
          <div>
            {viewList.map((data: T, rowIndex) => (
              <div key={rowIndex} className={
                cn('h-16 flex items-center border-b border-[rgb(69,35,48)] px-4', (data as any)?.myInfo ? "bg-[var(--o-color-yellow-900)]" : "")
              }>
                {headerArray.map((header, colIndex) => (
                  <div key={colIndex} className='flex justify-center first:justify-start last:justify-end' style={{ width: `${header.width}%` }}>
                    {header?.render?.(data) || data[header.key]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </OrbiterShow>
      </OrbiterShow>
      <div className='h-16 flex justify-center items-center'>
        <PaginatedList key={paginationKey} total={isTotal ? totalRankCount : dataArray.length} itemsPerPage={10} onPageChange={onPageChange} />
      </div>
    </div>
  )
}