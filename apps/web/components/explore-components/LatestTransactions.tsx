"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import TransactionsItem, { DataItemType } from './TransactionsItem'
import PaginatedList from '../../app/prizes/components/PrizeRankPagination'
import { BASE_URL } from '../../app/constant'
import { objToParams } from '../../utils/objToParams'
import { useBridgeInfoContext } from '@orbiter-finance/widget'
import { ChevronDown } from 'lucide-react'
import { OrbiterIcon, OrbiterShow, ProgressSkeleton } from '@orbiter-finance/ui'
import { cn } from '../../utils/cn'
import Empty from '../Empty'
import { useAtomValue } from "jotai"
import { pageIsMobileAtom } from '../../stores/bridge'

const tabList = [{
  key: "source",
  label: "Source chain:",
  isSource: true
}, {
  key: "target",
  label: "Destination chain:",
  isSource: false
}]

export default function LatestTransactions() {

  const pageIsMobile = useAtomValue(pageIsMobileAtom)

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(1)
  const [pending, setPending] = useState(true)
  const [list, setList] = useState<DataItemType[]>([])

  const [extendKey, setExtendKey] = useState("")
  const [selectFromChain, setSelectFromChain] = useState("All")
  const [selectToChain, setSelectToChain] = useState("All")

  const [timer, setTimer] = useState<any>(0)
  const [refreshTime, setRefreshTime] = useState(0)

  const { allChains } = useBridgeInfoContext()
  const getData = useCallback(
    async () => {
      try {
        setPending(true)
        clearTimeout(timer)
        if (refreshTime) {
          if (list?.length < 10) {
            setPending(false)
            return
          }
        }
        const response = await fetch(BASE_URL + "/partner-data-openness/transcations/list" + objToParams({
          page,
          ...(selectFromChain !== "All" ? { sourceChain: selectFromChain } : {}),
          ...(selectToChain !== "All" ? { targetChain: selectToChain } : {}),
        }))
        const res = await response.json()
        setTotal(res?.data?.count || 1)
        setList(res?.data?.rows || [])
        if (page === 1) {
          const timerOut = setTimeout(() => {
            setRefreshTime(+new Date())
          }, 10000)
          setTimer(timerOut)
        }
      } catch (error) {

      } finally {
        setPending(false)
      }
    },
    [page, selectFromChain, selectToChain, timer, list, refreshTime],
  )

  useEffect(() => {
    let timer = setTimeout(() => {
      getData()
    }, 200)
    return () => {
      clearTimeout(timer)
    }
  }, [selectFromChain, selectToChain, page, refreshTime])

  const isSelectFrom = useMemo(() => extendKey === tabList[0].key, [extendKey])

  const updateChain = useCallback(
    (chainId: string) => {
      if (isSelectFrom) {
        setSelectFromChain(chainId)
      } else {
        setSelectToChain(chainId)
      }
      setExtendKey("")
      setRefreshTime(0)
    },
    [extendKey, isSelectFrom],
  )

  const selectChain = useMemo(() => {
    return isSelectFrom ? selectFromChain : selectToChain
  }, [extendKey, selectFromChain, selectToChain])

  const selectFromChainName = useMemo(() => {
    return selectFromChain === "All" ? "All" :
      allChains?.find((item) => item.id === selectFromChain)?.name
  }, [selectFromChain])

  const selectToChainName = useMemo(() => {
    return selectToChain === "All" ? "All" :
      allChains?.find((item) => item.id === selectToChain)?.name
  }, [selectToChain])

  return (
    <div className='mt-4 w-full border border-[var(--o-color-gray-700)] rounded-xl bg-[var(--o-color-gray-900)]'>
      <div className='w-full'>
        <div className='px-4 py-[1.125rem] w-full o-font-500 text-xl sm:flex justify-between items-center'>
          <div className='o-text-t1'>Latest Transactions</div>

          <div className='w-full sm:flex-1 flex sm:justify-end items-center gap-3 mt-3 sm:mt-0 flex-wrap'>
            {
              tabList.map((item) => {
                return <div key={item.key} onClick={(event) => {
                  event.stopPropagation()
                  setExtendKey(item.key)
                }} className='flex justify-center items-center text-sm o-font-400 o-text-t3 cursor-pointer relative'>
                  {item.label}
                  <span className='o-text-t1 ml-1'>{item.isSource ? selectFromChainName : selectToChainName}</span>
                  <ChevronDown className='w-5 h-5'
                    style={{ rotate: item.key === extendKey ? "180deg" : "0deg", willChange: "rotate", transition: "all 0.3s" }}
                  />
                  <OrbiterShow
                    when={extendKey === item.key}
                  >
                    <div onClick={(event) => {
                      event.stopPropagation()
                      setExtendKey("")
                    }} className='fixed top-0 left-0 right-0 bottom-0 cursor-default z-[var(--modal-bg-z-index)]'></div>
                    <div className={
                      cn('absolute z-[var(--modal-z-index)] w-48 top-full translate-y-1 rounded-xl border-[var(--o-color-gray-600)] pl-1 py-1  pr-2 bg-[var(--o-color-gray-800)]', pageIsMobile ? "left-0" : " right-0")
                    }>
                      <div className='w-full max-h-72 overflow-auto'>
                        <div onClick={(event) => {
                          event.stopPropagation()
                          updateChain("All")
                        }} className={
                          cn('p-2 flex justify-start items-center hover:rounded-lg hover:bg-[var(--o-color-gray-900)]', selectChain === "All" ? "rounded-lg border border-[var(--o-color-brand-500)] bg-[var(--o-color-gray-900)]" : "")
                        }>
                          <span className='text-sm o-font-500 o-text-t1'>All Chains</span>
                        </div>
                        {
                          allChains.map((option) => {
                            return <div key={option.id} onClick={(event) => {
                              event.stopPropagation()
                              updateChain(option.id)
                            }} className={
                              cn('p-2 flex justify-start items-center hover:rounded-lg hover:bg-[var(--o-color-gray-900)]', selectChain === option.id ? "rounded-lg border border-[var(--o-color-brand-500)] bg-[var(--o-color-gray-900)]" : "")}>

                              <OrbiterIcon type='CHAIN' iconId={option.id} className='w-5 h-5 mr-2' />
                              <span className='text-sm o-font-500 o-text-t1'>{option.name}</span>
                            </div>

                          })
                        }
                      </div>
                    </div>
                  </OrbiterShow>
                </div>
              })
            }
          </div>
        </div>
        <div className='w-full overflow-auto'>
          <div className='w-full min-w-[60rem] flex justify-start items-start flex-col '>
            <div className='w-full px-4 py-3.5 border-b border-[var(--o-color-gray-700)] flex justify-between items-center text-xs o-text-t3'>
              <div className='w-28'>status</div>
              <div className='w-24'>From/To</div>
              <div className='w-16'>Asset</div>
              <div className='w-16'>Amount</div>
              <div className='w-28'>Source TX</div>
              <div className='w-28'>Destination TX</div>
              <div className='w-32 last:text-right'>Time</div>
            </div>
            <div className='flex-1 w-full'>
              <OrbiterShow
                when={!pending}
                fallback={
                  <div className='w-full'>
                    {
                      new Array(10).fill(0).map((item, index) => {
                        return <div key={index} className='w-full h-16 p-4 flex justify-between items-center border-b border-[var(--o-color-gray-700)]'>
                          <div className='flex justify-start items-center w-28'>
                            <div className='w-full h-7'>
                              <ProgressSkeleton />
                            </div>

                          </div>
                          <div className='flex justify-start items-center w-24'>
                            <div className='w-full h-7'>
                              <ProgressSkeleton />
                            </div>
                          </div>
                          <div className='flex justify-start items-center w-16'>
                            <div className='w-full h-7'>
                              <ProgressSkeleton />
                            </div>
                          </div>
                          <div className='flex justify-start items-center w-16'>
                            <div className='w-full h-7'>
                              <ProgressSkeleton />
                            </div>
                          </div>
                          <div className='flex justify-start items-center w-28'>
                            <div className='w-full h-7'>
                              <ProgressSkeleton />
                            </div>
                          </div>
                          <div className='flex justify-start items-center w-28'>
                            <div className='w-full h-7'>
                              <ProgressSkeleton />
                            </div>
                          </div>
                          <div className='w-28 flex justify-end items-center'>
                            <div className='w-full h-7'>
                              <ProgressSkeleton />
                            </div>
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
                    <div className='w-full flex justify-center items-center py-20'>
                      <Empty emptyText={"No data found"} />
                    </div>
                  }
                >
                  {
                    list.map((item, index) => {
                      return <TransactionsItem data={item} key={index} />
                    })
                  }
                </OrbiterShow>
              </OrbiterShow>
            </div>
          </div>
          <div className='w-full py-5'>
            <PaginatedList total={total} itemsPerPage={10} onPageChange={(currentPage) => {
              setPage(currentPage)
              setRefreshTime(0)
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}
