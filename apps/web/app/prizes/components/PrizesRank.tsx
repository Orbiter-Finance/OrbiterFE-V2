'use client'

import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import styles from './PrizesRank.module.css'
import { cn } from '../../../utils/cn'
import { HeaderItem, PrizeRankTable, PrizeRankTableProps } from './PrizeRankTable'
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { prizesPoolInfoAtom, prizesProjectInfoAtom, prizesRankRoundListAtom, prizesRankTotalListAtom, prizesUserInfoAtom } from '../../../stores/bridge'
import shortenAddress from '../../../utils/shortenAddress'
import { decimalNum, decimalNumLine } from '../../../utils/decimalNum'
import { CircleHelpIcon } from 'lucide-react'
import { HOST_ENV_MAINNET, PRIZES_URL } from '../../constant'
import { OrbiterShow } from '@orbiter-finance/ui'
import useWalletAccount from '../../../hooks/useWalletAccount'
import WalletAvater from '../../../components/WalletAvater'

interface TableDataItem {
  rank: string | number
  address: string
  txsCount: string | number
  fee: string
  reward: {
    amount: string,
    name: string,
    uAmount: string
  },
  myInfo?: boolean
}

interface TotalTableDataItem {
  rank: string | number
  address: string
  txsCount: string | number
  licenseCount: string | number
  fastPass: boolean
  myInfo?: boolean
}

enum BOARDTABKEY {
  ROUND = 'ROUND',
  EVENT = 'EVENT'
}

enum ROUNDTABKEY {
  ROUND1 = '1',
  ROUND2 = '2',
  ROUND3 = '3',
  ROUND4 = '4',
  ROUND5 = '5',
}



export default function PrizesRank() {
  const { prizesWalletAccount } = useWalletAccount()

  const setPrizesPoolInfo = useSetAtom(prizesPoolInfoAtom)
  const [currentBoardTab, setCurrentBoardTab] = useState<BOARDTABKEY>(BOARDTABKEY.ROUND)
  const [currentRoundTab, setCurrentRoundTab] = useState<ROUNDTABKEY>(ROUNDTABKEY.ROUND1)

  const [prizesRankListRound, setPrizesRankListRound] = useAtom(prizesRankRoundListAtom)
  const prizesProjectInfo = useAtomValue(prizesProjectInfoAtom)
  const prizesUserInfo = useAtomValue(prizesUserInfoAtom)
  const [prizesRankTotalList, setPrizesRankTotalList] = useAtom(prizesRankTotalListAtom)
  const [pending, setPending] = useState(false)
  const [page, setPage] = useState<string | number>(0)
  const [totalRankCount, setTotalRankCount] = useState(0)
  const [weekInfo, setWeekInfo] = useState<{
    totalReward: string,
    weeklyReward: string
  } | null>(null)

  const weekId = useMemo(() => {
    return prizesProjectInfo?.[Number(currentRoundTab) - 1]?.projectId
  }, [prizesProjectInfo, currentRoundTab])

  const weekUserInfo: TableDataItem = useMemo(() => {
    const userWeekInfo = prizesUserInfo?.projectRankRewards?.find?.((item) => item?.projectId?.toLocaleLowerCase() === weekId?.toLocaleLowerCase())
    return ({
      rank: Number(userWeekInfo?.rank) || "",
      address: prizesWalletAccount?.address || "",
      txsCount: userWeekInfo?.txs || "",
      fee: "",
      reward: userWeekInfo?.weeklyReward,
      myInfo: true
    })
  }, [weekId, prizesUserInfo])

  const totalUserInfo: TotalTableDataItem = useMemo(() => {
    return ({
      rank: prizesUserInfo?.totalRank || "",
      address: prizesWalletAccount?.address || "",
      txsCount: prizesUserInfo?.totalTxCount || "",
      licenseCount: prizesUserInfo?.licenseCount || "",
      fastPass: !!prizesUserInfo?.fastPass,
      myInfo: true
    })
  }, [weekId, prizesUserInfo])

  const getRankList = useCallback(
    async () => {
      try {
        setPrizesRankListRound(
          []
        )
        setPending(true)
        if (weekId) {
          const responese = await fetch(`${PRIZES_URL}/active-platform/competition/rankReward?projectId=${weekId}`)
          const res = await responese.json()
          const result = res?.result
          setPrizesRankListRound(
            result?.rankRewards || []
          )
          setWeekInfo({
            totalReward: res?.result?.totalReward || "0",
            weeklyReward: res?.result?.weeklyReward || "0"
          })
        }
      } catch (error) {

      } finally {
        setPending(false)
      }
    }, [weekId])

  const getTotalRankList = useCallback(
    async () => {
      try {
        const responese = await fetch(`${PRIZES_URL}/active-platform/competition/totalRankReward?page=${page}&size=10`)
        const res = await responese.json()
        const result = res?.result
        setPrizesRankTotalList(
          res?.result?.rankRewards?.list || []
        )
        setPrizesPoolInfo({
          totalReward: result?.totalReward,
          totalTxsCount: result?.totalTxCount,
          totalAddressCount: result?.totalAddressCount
        })
        setTotalRankCount(res?.result?.rankRewards?.total || 0)
      } catch (error) {

      }
    },
    [page]
  )

  const boardTabs = useMemo(() => {
    return [
      {
        key: BOARDTABKEY.ROUND,
        text: <div className='flex justify-start items-center mr-3 cursor-pointer'>Round Leaderboard
          <div className="flex justify-end items-center relative tips-group">
            <CircleHelpIcon stroke='var(--o-color-gray-400)' className='w-6 h-6 ml-2' />
            <div className="absolute z-[10] left-10 top-1/2 -translate-y-1/2 tips-content hidden justify-center items-center">
              <div className="bg-[var(--o-color-gray-700)] text-[var(--o-color-text-t2)] rounded-xl text-sm  w-[20rem] p-3 o-font-400">
                Display only the top 100 in terms of transaction.Users who have collected basic license are eligible to share the prize pool for the corresponding round.
              </div>
            </div>
          </div>
        </div>
      },
      {
        key: BOARDTABKEY.EVENT,
        text: <span>Event Leaderboard</span>
      }
    ]
  }, [])

  const roundTabs = useMemo(() => {
    return [
      {
        key: ROUNDTABKEY.ROUND1,
        text: 'Round1'
      },
      {
        key: ROUNDTABKEY.ROUND2,
        text: 'Round2'
      },
      {
        key: ROUNDTABKEY.ROUND3,
        text: 'Round3'
      },
      {
        key: ROUNDTABKEY.ROUND4,
        text: 'Round4'
      },
      {
        key: ROUNDTABKEY.ROUND5,
        text: 'Round5'
      },
    ]
  }, [])

  const tableHeaderArray: HeaderItem<TableDataItem>[] = [
    {
      content: 'Rank',
      key: 'rank',
      width: 10,
      render: (item) => {
        return decimalNumLine(item?.rank, 0, ",")
      }
    },
    {
      content: 'User',
      key: 'address',
      width: 30,
      render: (item) => {
        return <OrbiterShow
          when={!item?.myInfo}
          fallback={
            <div className='flex justify-center'>
              <WalletAvater walletAddress={item?.address} className='mr-2' />
              My Account
            </div>
          }
        >
          {shortenAddress(item?.address || "", 6)}
        </OrbiterShow>
      }
    },
    {
      content: 'Total Transaction',
      key: 'txsCount',
      width: 30,
      render: (item) => {
        return <span>{decimalNumLine(item?.txsCount, 0, ",")} Tx</span>
      }
    },
    {
      content: 'Estimated earnings',
      key: 'earnings',
      width: 30,
      render: (item) => {
        return <div className='text-right'>
          <div className='o-prizes-reward o-font-600 text-base'>+{decimalNum(item?.reward?.amount, 2, ",")} {item?.reward?.name}</div>
          <div className='text-xs text-white opacity-60'>{decimalNum(item?.reward?.uAmount, 2, ",", "$")}</div>
        </div>
      }
    },
  ]

  const tableHeaderTotal: HeaderItem<TotalTableDataItem>[] = [
    {
      content: 'Rank',
      key: 'rank',
      width: 10,
    },
    {
      content: 'User',
      key: 'address',
      width: 20,
      render: (item) => {
        return <OrbiterShow
          when={!item?.myInfo}
          fallback={
            <div className='flex justify-center'>
              <WalletAvater walletAddress={item?.address} className='mr-2' />
              My Account
            </div>
          }
        >
          {shortenAddress(item?.address || "", 6)}
        </OrbiterShow>
      }
    },
    {
      content: 'Total Transaction',
      key: 'txsCount',
      width: 20,
      render: (item) => {
        return <span>{item.txsCount} Tx</span>
      }
    },
    {
      content: 'Licenses',
      key: 'licenses',
      width: 20,
      render: (item) => {
        return <span>{item.licenseCount}</span>
      }
    },
    {
      content: 'Fast Pass',
      key: 'fastPass',
      width: 20,
      render: (item) => {
        return <span>{Number(item.fastPass)} </span>
      }
    },
    {
      content: 'Fee Refunds',
      key: 'feeRefunds',
      width: 15,
      render: (item) => {
        const flag = item?.rank && Number(item?.rank) <= 3
        return <span>
          <OrbiterShow
            when={flag}
            fallback={
              "--"
            }
          >
            96%
          </OrbiterShow>
        </span>
      }
    },
  ]

  const handlePage = useCallback(
    (newPage: string | number) => {
      setPage(Number(newPage) >= 1 ? (Number(newPage) - 1) : 0)
    },
    [],
  )


  useEffect(() => {
    const timer = setTimeout(() => {
      getRankList()
    }, 200)
    return () => {
      clearTimeout(timer)
    }
  }, [weekId, prizesWalletAccount?.address])

  useEffect(() => {
    const timer = setTimeout(() => {
      getTotalRankList()
    }, 200)
    return () => {
      clearTimeout(timer)
    }
  }, [page])


  return (
    <div className='pt-8'>
      <h2 className='text-3xl o-font-600 text-center'>leader board</h2>
      <div className='w-full p-8 mt-14 border-[2px] border-[rgba(69,35,48,0.6)] rounded-2xl'>
        <div className='flex gap-[3.125rem] '>
          {boardTabs.map((board) => {
            return (
              <span key={board.key} onClick={() => setCurrentBoardTab(board.key)} className={cn('text-xl hover:cursor-pointer', currentBoardTab === board.key ? 'o-font-600' : 'o-font-500 opacity-40')}>{board.text}</span>
            )
          })}
        </div>
        <OrbiterShow
          when={currentBoardTab === BOARDTABKEY.ROUND}
        >
          <div className='w-full flex justify-between items-center flex-wrap mt-2'>
            <div className='flex gap-3 flex-1'>
              {roundTabs.map((round) => {
                return (
                  <span key={round.key} onClick={(event) => {
                    event.stopPropagation()
                    setCurrentRoundTab(round.key)

                  }} className={cn('inline-flex h-8 items-center px-3 text-sm o-font-500 rounded-[0.5rem] bg-[#342C40] hover:cursor-pointer', currentRoundTab === round.key ? cn("text-[var(--o-color-text-t1)]", styles.selectedRoundTab) : 'text-[var(--o-color-text-t3)]')}>{round.text}</span>
                )
              })}
            </div>
            <OrbiterShow
              when={!!weekInfo}
            >
              <div className='text-right'>
                <div className='o-text-t3 text-sm o-font-400 flex justify-end items-center'>
                  Round {currentRoundTab} Prize Pool
                  <div className="flex justify-end items-center relative tips-group">
                    <CircleHelpIcon stroke='var(--o-color-gray-400)' className='w-4 h-4 ml-1 cursor-pointer' />
                    <div className="absolute z-[10] right-10 top-1/2 -translate-y-1/2 tips-content hidden justify-center items-center">
                      <div className="bg-[var(--o-color-gray-700)] text-[var(--o-color-text-t2)] rounded-xl text-sm  w-[20rem] p-3 o-font-400 text-left">
                        The current total prize pool has reached {decimalNum(weekInfo?.totalReward, 0, ",", "$")}. According to the rules, users who hold Licenses during Round {currentRoundTab} can share rewards of {decimalNum(weekInfo?.weeklyReward, 0, ",", "$")}( {decimalNum(weekInfo?.totalReward, 0, ",", "$")} * 15% = {decimalNum(weekInfo?.weeklyReward, 0, ",", "$")}). The data statistics period ends at the conclusion of Round {currentRoundTab}.
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className='text-xl o-font-600 o-prizes-reward'>
                    {weekInfo?.totalReward}
                    <span className='text-sm o-font-500 o-text-t3 ml-1.5'>* 15%</span>
                  </span>
                </div>
              </div>
            </OrbiterShow>
          </div>
        </OrbiterShow>
        <div className='mt-5'>
          <PrizeRankTable
            userWeekInfo={currentBoardTab === BOARDTABKEY.ROUND ? (weekId && prizesWalletAccount?.address ? weekUserInfo : null) : (prizesWalletAccount?.address ? totalUserInfo : null)}
            isShowIndex={true}
            headerArray={currentBoardTab === BOARDTABKEY.EVENT ? tableHeaderTotal : tableHeaderArray}
            dataArray={currentBoardTab === BOARDTABKEY.ROUND ? prizesRankListRound : prizesRankTotalList}
            pending={pending}
            isTotal={currentBoardTab === BOARDTABKEY.EVENT}
            paginationKey={`${currentBoardTab}_${currentRoundTab}`}
            handlePage={handlePage}
            totalRankCount={totalRankCount}
          />
        </div>
      </div>
    </div>
  )
}