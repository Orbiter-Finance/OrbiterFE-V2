import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { OrbiterIcon, OrbiterShow } from '@orbiter-finance/ui'
import { useOrbiterGetChainsConfig } from '../bridgeInfo/hooks/useOrbiterGetChainsConfig.js'
import { BridgeInfoContext } from '../bridgeInfo/providers.js'
import { PAGE_TYPE, TRANSACTION_STATUS } from '../constant.js'
import { usePageTypeUpdate } from '../hooks/usePageTypeUpdate.js'
import { pageIsMobileAtom, bridgeTransactionAtom, bridgeTransactionRefreshAtom } from '../stores/bridge.js'
import { cn } from '../utils/cn.js'
import { dateFormatStandard } from '../utils/dayjsUtils.js'
import { decimalNum } from '../utils/decimalNum.js'
import { useWallets } from '@orbiter-finance/wallet-management'
import { NoDataPng } from '../assets/assets.js'
import Pending from './Pending.js'
import { ArrowRight } from 'lucide-react'
import { debounce } from "../utils/debounce.js"
import { TransactionStatus } from '../icon/TransactionStatus.js'
import PaginatedList from '../components/PaginatedList.js'

export function HistoryList() {

  const { getChainsConfig } = useOrbiterGetChainsConfig()
  const { orbiterClient, isMainnet, isTelegram } = useContext(BridgeInfoContext)
  const wallets = useWallets()
  const pageIsMobile = useAtomValue(pageIsMobileAtom)

  const setBridgeTransaction = useSetAtom(bridgeTransactionAtom)
  const setBridgeTransactionRefresh = useSetAtom(bridgeTransactionRefreshAtom)
  const { updatePageModalType } = usePageTypeUpdate()
  const ref = useRef<HTMLDivElement | null>(null)
  const [pending, setPending] = useState(true)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(0)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState<any[]>([])
  const [init, setInit] = useState(false)
  const [allowLoading, setAllowLoading] = useState(false)

  const walletAddress = useMemo(() =>
    wallets.map((item) => item?.address || "").filter((item) => !!item).join(",") || ""
    , [wallets])

  const initCall = useCallback(
    async () => {
      if (walletAddress) {
        setPending(true)
        try {
          const res = await orbiterClient?.getTransactionHistory(walletAddress, page * limit)
          const rows = res?.rows || []
          const dataList: any[] = []

          list.concat(rows).forEach((item) => {
            const flag = dataList.some((option) => option.sourceId === item.sourceId)
            if (!flag) {
              dataList.push(item)
            }
          })

          if (Number(rows?.length) < Number(res?.limit)) {
            setAllowLoading(true)
          }
          if (!limit) {
            setLimit(Number(res?.limit) || 0)
          }
          setTotal(Number(res?.count) || 0)
          setList(isTelegram ? dataList.concat([]) : rows)
        } finally {
          setInit(true)
          debounce(() => {
            setPending(false)
          }, 200)
        }
      } else {
        setPending(false)
      }
    },
    [walletAddress, orbiterClient, setPending, page, list, limit, isTelegram]
  )

  const handleOnScroll = useCallback(() => {
    if (ref?.current && !pending && !allowLoading && pageIsMobile) {
      const contentScrollTop = ref.current.scrollTop
      const clientHeight = ref.current.clientHeight
      const scrollHeight = ref.current.scrollHeight
      if (contentScrollTop + clientHeight >= (scrollHeight - 160)) {
        setPage(page + 1)
        setPending(true)
      }
    }

  }, [ref, pending, page, allowLoading, pageIsMobile])

  useEffect(() => {
    const timer = setTimeout(() => {
      initCall()
    }, 200)
    return () => {
      clearTimeout(timer)
    }
  }, [walletAddress, page])

  const pageChange = useCallback(
    (currentPage: number) => {
      setPage(currentPage <= 1 ? 0 : currentPage - 1)
    },
    [],
  )

  const viewList = useMemo(() => {
    // return pageIsMobile ? list : list.slice(page*limit)
    return list
  }, [list, pageIsMobile, page, limit])

  return (
    <>
      <div className='w-full flex justify-start flex-col min-h-56 bg-[var(--o-color-gray-800)] rounded-md pr-1'>
        <OrbiterShow
          when={!pending || (pageIsMobile && !!init)}
          fallback={
            <div
              className={
                cn('w-full max-h-56 sm:max-h-[30rem] sm:h-[30rem] flex justify-center items-center')
              }>
              <Pending />
            </div>

          }
        >
          <OrbiterShow
            when={!!viewList?.length}
            fallback={
              <div className='h-full flex justify-center items-center'>
                <div>
                  <img src={NoDataPng} className='w-40 h-40' />
                  <div className='text-center text-sm mt-2'>No History</div>
                </div>
              </div>
            }
          >
            <OrbiterShow
              when={!pageIsMobile}
            >
              <div className='w-full py-2.5 flex justify-start items-center text-xs text-[var(--o-color-gray-400)] px-3'>
                <div className='w-8'></div>
                <div className={cn("w-8", isMainnet ? "sm:w-1/5" : "sm:w-1/4")}>From</div>
                <div className={cn("w-8", isMainnet ? "sm:w-1/5" : "sm:w-1/4")}>To</div>
                <div className='flex-1'>Value</div>
                <div className='flex whitespace-nowrap w-1/5'>Time</div>
                <OrbiterShow
                  when={isMainnet}
                >
                  <div className='w-24'>O-Points</div>
                </OrbiterShow>
              </div>
            </OrbiterShow>
            <div
              ref={ref}
              onScrollCapture={() => handleOnScroll()}
              className={
                cn('w-full max-h-56 sm:max-h-[30rem] sm:h-[30rem] overflow-auto')
              }>
              {
                viewList.map((item: any, index) => {
                  return <div key={index} className={
                    cn('w-full flex justify-start items-center text-sm', pageIsMobile ? "px-0 py-3" : "p-3")
                  }

                    onClick={(event) => {
                      event.stopPropagation()
                      updatePageModalType(PAGE_TYPE.CONFIRM, PAGE_TYPE.HISTORY)
                      if (item?.status < TRANSACTION_STATUS.TO_FAILED) {
                        setBridgeTransactionRefresh(+new Date())
                      }
                      setBridgeTransaction({
                        fromAddress: "",
                        srcChain: item.sourceChain,
                        tgtChain: item.targetChain,
                        srcToken: item.sourceSymbol,
                        tgtToken: item.targetSymbol,
                        sendAmount: item.sourceAmount,
                        receiveAmount: item.targetAmount,
                        srcTx: item.sourceId,
                        targetTx: item.targetId,
                        tgtAddress: item.targetAddress,
                        status: String(item.status),
                        points: item?.points || "0",
                        timeStamp: item?.sourceTime ? dateFormatStandard(item.sourceTime, "YYYY.MM.DD HH:mm:ss") : ""
                      })
                    }}>
                    <div className='w-8'>
                      <TransactionStatus status={Number(item?.status)} />
                    </div>
                    <div className={
                      cn('flex w-8 truncate justify-start items-center', isMainnet ? "sm:w-1/5" : "sm:w-1/4")
                    }
                    >
                      <OrbiterIcon className='w-5 h-5 sm:w-6 sm:h-6 mr-0 sm:mr-1' type='CHAIN' iconId={item.sourceChain} />
                      <OrbiterShow
                        when={!pageIsMobile}
                      >
                        <span className='flex-1 truncate flex justify-start items-center'>{getChainsConfig(item?.sourceChain || '')?.name}</span>
                      </OrbiterShow>
                    </div>
                    <OrbiterShow
                      when={pageIsMobile}
                    >
                      <ArrowRight className='w-5 h-5' stroke='#FFF' />
                    </OrbiterShow>
                    <div className={cn('flex w-8 truncate justify-start items-center', isMainnet ? "sm:w-1/5" : "sm:w-1/4")}>
                      <OrbiterIcon className='w-5 h-5 sm:w-6 sm:h-6 mr-0 sm:mr-1' type='CHAIN' iconId={item.targetChain} />
                      <OrbiterShow
                        when={!pageIsMobile}
                      >
                        <span className='flex-1 truncate flex justify-start items-center'>{getChainsConfig(item?.targetChain || '')?.name}</span>
                      </OrbiterShow>
                    </div>
                    <div className='flex-1 flex whitespace-nowrap'>
                      {decimalNum(item.sourceAmount, item.sourceSymbol === "USDC" || item.sourceSymbol === "USDT" ? 4 : 8, ",")} {item.sourceSymbol}
                    </div>
                    <div className={
                      cn('flex whitespace-nowrap', pageIsMobile ? "w-2/5" : "w-1/5")
                    }>
                      {dateFormatStandard(item.sourceTime, "YYYY.MM.DD HH:mm")}
                    </div>
                    <OrbiterShow
                      when={!pageIsMobile && isMainnet}
                    >
                      <div className='w-24'>
                        <div className="flex">
                          <OrbiterShow
                            when={!!Number(item?.points)}
                          >
                            <div className='flex whitespace-nowrap justify-center items-center text-[var(--o-color-brand-500)] bg-[var(--o-color-brand-900)] py-0.5 px-2 mr-2 rounded-md o-font-500'>
                              +{decimalNum(item?.points, 2)} O-Points
                            </div>
                          </OrbiterShow>
                        </div>
                      </div>
                    </OrbiterShow>

                  </div>
                })
              }
              <OrbiterShow
                when={pending}
              >
                <Pending />
              </OrbiterShow>
            </div>
          </OrbiterShow>

        </OrbiterShow>
        <div className='w-full mt-2.5'>
        </div>
      </div>
      <OrbiterShow
        when={!pageIsMobile}
      >
        <div className='w-full mt-2.5 flex justify-center items-center'>
          <PaginatedList total={total} itemsPerPage={limit} pending={pending} onPageChange={pageChange} />
        </div>
      </OrbiterShow>
    </>

  )
}
