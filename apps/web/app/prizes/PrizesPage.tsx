"use client"
import React, { useCallback, useEffect } from 'react'
import PrizesBanner from './components/PrizesBanner'
import PrizesPool from './components/PrizesPool'
import PrizesTask from './components/PrizesTask'
import PrizesReward from './components/PrizesReward'
import PrizesRank from './components/PrizesRank'
import PrizesRule from './components/PrizesRule'
import "./prizes.css"
import { currentPrizesProjectInfoAtom, prizesProjectInfoAtom, prizesRefreshNowAtom, prizesUserInfoAtom } from '../../stores/bridge'
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import dayjs from 'dayjs'
import { HOST_ENV_MAINNET, PRIZES_URL } from '../constant'
import useWalletAccount from '../../hooks/useWalletAccount'

export default function PrizesPage() {

  const [currentPrizesProjectInfo, setCurrentPrizesProjectInfo] = useAtom(currentPrizesProjectInfoAtom)
  const setPrizesProjectInfo = useSetAtom(prizesProjectInfoAtom)
  const setPrizesUserInfo = useSetAtom(prizesUserInfoAtom)
  const prizesRefreshNow = useAtomValue(prizesRefreshNowAtom)

  const { prizesWalletAccount } = useWalletAccount()

  const init = useCallback(
    async () => {
      try {
        const responese = await fetch(`${PRIZES_URL}/active-platform/competition/planetVoyagerProjects`)
        const res = await responese.json()
        const list: any[] = res?.result || []
        const now = +dayjs()
        const week = list.find((item) => {
          return now >= +dayjs.utc(item?.startTime) && now <= +dayjs.utc(item?.endTime)
        }) || list[list?.length - 1 || 0]
        setPrizesProjectInfo(list)
        let dayGroup = week?.tasks?.find((item) => {
          return now >= +dayjs.utc(item?.startTime) && now <= +dayjs.utc(item?.endTime)
        })

        setCurrentPrizesProjectInfo({
          weekId: week?.projectId || "",
          dayId: dayGroup?.taskId || ""
        })
      } catch (error) {

      }
    },
    [],
  )

  const init3 = useCallback(
    async () => {
      try {
        const weekId = currentPrizesProjectInfo?.weekId
        const walletAddress = prizesWalletAccount?.address?.toLocaleLowerCase()
        if (weekId && walletAddress) {
          const responese = await fetch(`${PRIZES_URL}/active-platform/competition/addressRankReward?address=${walletAddress}`)
          const res = await responese.json()
          setPrizesUserInfo(res?.result)
        }
      } catch (error) {

      }
    },
    [currentPrizesProjectInfo, prizesWalletAccount]
  )

  useEffect(() => {
    let timer = setTimeout(() => {
      init()
    }, 200)
    return () => {
      clearTimeout(timer)
    }
  }, [])


  useEffect(() => {
    let timer = setTimeout(() => {
      if (currentPrizesProjectInfo?.weekId) {
        init3()
      }
    }, 200)
    return () => {
      clearTimeout(timer)
    }
  }, [currentPrizesProjectInfo, prizesWalletAccount?.address, prizesRefreshNow])

  return (
    <div className='w-full pr-2'>
      <PrizesBanner />
      <div className='w-full flex justify-center items-start pb-20'>
        <div className='w-full max-w-[71.5rem]'>
          <PrizesPool />
          <PrizesTask />
          <PrizesReward />
          <PrizesRank />
          <PrizesRule />
        </div>
      </div>
    </div>
  )
}
