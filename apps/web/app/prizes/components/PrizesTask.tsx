'use client'

import React, { useMemo } from 'react'
import { PRIZECARDSTATUS, PrizesTaskCard } from './PrizesTaskCard'
import { ChevronRightIcon } from 'lucide-react'
import { useAtomValue } from 'jotai'
import {
  currentPrizesProjectInfoAtom,
  prizesProjectInfoAtom,
  prizesUserInfoAtom,
} from '../../../stores/bridge'
import { decimalNumLine } from '../../../utils/decimalNum'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import useGoogleEvent from '../../../hooks/useGoogleEvent'
import usePrizesUpdateBridgeRule from '../usePrizesUpdateBridgeRule'
import { objToParams } from '../../../utils/objToParams'

const list = ['Eclipse', 'WorldChain', 'Arbitrum', 'Sui', '']

export default function PrizesTask() {
  const prizesUserInfo = useAtomValue(prizesUserInfoAtom)
  const currentPrizesProjectInfo = useAtomValue(currentPrizesProjectInfoAtom)

  const { weeklyLicenses = [], lotteryRewards = [], projectRankRewards } = prizesUserInfo || {}
  const prizesProjectInfo = useAtomValue(prizesProjectInfoAtom)

  const router = useRouter()
  const { sendGoogleEvent } = useGoogleEvent()
  const { PrizesUpdateBridgeRule } = usePrizesUpdateBridgeRule()

  const userCurrentWeekInfo = useMemo(() => {
    return projectRankRewards?.find(
      (item) =>
        item?.projectId?.toLocaleLowerCase() ===
        currentPrizesProjectInfo?.weekId?.toLocaleLowerCase(),
    )
  }, [projectRankRewards, currentPrizesProjectInfo])
  const searchParams = useSearchParams()

  const transactionQuestArray = [
    {
      icon: '',
      title: (
        <span>
          Bridge <span className="o-prizes-reward mx-1"> ≥ 15 TX to Sui </span> to Collect{' '}
          <span className="o-prizes-reward mx-1"> 1 </span> Basic License
        </span>
      ),
      content:
        Number(userCurrentWeekInfo?.txs) >= 15 && !!weeklyLicenses?.length
          ? 'You have already entered final prize pool'
          : 'Enter the prize pool for this round (15%)',
    },
    {
      icon: '',
      title: (
        <span>
          <span className="o-prizes-reward mx-1">Collect 5 Licenses</span> or draw{' '}
          <span className="o-prizes-reward mx-1">
            {' '}
            <span className="mr-1">1</span> Fast Pass
          </span>
        </span>
      ),
      content: 'Enter Final Prize Pool (25%)',
    },
  ]

  const holdFastPass = lotteryRewards.some((item) => item.name == 'VoyagerLicense_FastPass')
  const holdHalloween = lotteryRewards.some((item) => item.name == 'VoyagerLicense_Halloween')

  return (
    <div>
      <h2 className="text-3xl o-font-600 text-center mb-8">
        Planet Voyager - Collect Licenses to share Prize Pool
      </h2>
      <div className="p-8 border-2 o-prizes-module-border rounded-2xl o-prizes-quests-bg">
        <div className="mb-6">
          <div className="text-xl o-font-600">My progress</div>
          <div className="flex text-lg o-font-500">
            <div className="mr-10">
              <span className="mr-1">Current rank: </span>
              <span className="o-prizes-reward">
                {decimalNumLine(userCurrentWeekInfo?.rank, 0, ',')}
              </span>
            </div>
            <div className="mr-10">
              <span className="mr-1">Estimated earnings: </span>
              <span className="o-prizes-reward">
                {decimalNumLine(userCurrentWeekInfo?.weeklyReward?.amount)}
                <span className="mr-1">
                  {userCurrentWeekInfo?.weeklyReward?.name}
                </span>
              </span>
            </div>
            <div className="mr-10">
              <span className="mr-1">Accumulated: </span>
              <span className="o-prizes-reward">
                {decimalNumLine(userCurrentWeekInfo?.txs)} Tx
              </span>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="text-xl o-font-600 mb-4">Transaction quest</div>
          <div className="flex flex-col gap-3">
            {transactionQuestArray.map((item, index) => {
              return (
                <div
                  onClick={(event) => {
                    event.stopPropagation()
                    const dealerId = searchParams.get('dealerId')
                    const params = {
                      src_chain: '1',
                      tgt_chain: 'SUI_MAIN',
                      src_token: 'USDC',
                      ...(dealerId ? { dealerId } : {}),
                    }

                    router.prefetch('/', { kind: 'temporary' as any })
                    router.replace('/' + objToParams(params))
                    sendGoogleEvent({
                      event: 'Prizes_eclipse_banner',
                      value: '',
                    })
                    PrizesUpdateBridgeRule()
                  }}
                  key={index}
                  className="flex w-full h-14 cursor-pointer items-center justify-between px-3 py-4 text-base o-font-600 o-prizes-task-bg rounded-xl"
                >
                  <div className="flex">
                    <Image
                      className="w-6 h-6 mr-2"
                      src="/assets/icon/bridge/task-bridge.svg"
                      alt="bridge task"
                      width={24}
                      height={24}
                    />
                    <div>{item.title}</div>
                  </div>
                  <div className="flex justify-end items-center o-linear-text o-prizes-linear-text">
                    {item.content}
                    <ChevronRightIcon className="w-6 h-6" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="mb-6">
          <div className="text-xl o-font-600 mb-4">Supreme Licenses</div>
          <div className="flex gap-3">
            <PrizesTaskCard
              tag={'FAST PASS'}
              name="VoyagerLicense_FastPass"
              imgUrl={`/assets/image/prizes/fast_licenses${holdFastPass ? '' : '_disabled'}.png`}
              status={
                holdFastPass ? PRIZECARDSTATUS.POSSESS : PRIZECARDSTATUS.NOTPOSSESS
              }
            />
            <PrizesTaskCard
              tag={'Halloween Exclusive'}
              name="VoyagerLicense_Halloween"
              imgUrl={`/assets/image/prizes/halloween_licenses${holdFastPass ? '' : '_disabled'}.png`}
              status={
                holdHalloween ? PRIZECARDSTATUS.POSSESS : PRIZECARDSTATUS.NOTPOSSESS
              }
            />
          </div>
        </div>
        <div className="mb-6">
          <div className="text-xl o-font-600 mb-4">Basic Licenses</div>
          <div className="flex gap-3">
            {list.map((item, index) => {
              const group = prizesProjectInfo[index]
              const hold = weeklyLicenses.some(
                (option) => option.name === 'VoyagerLicense_' + group?.projectId,
              )
              const now = +dayjs()
              const flag =
                group &&
                now >= +dayjs.utc(group?.startTime) &&
                now <= +dayjs.utc(group?.endTime)
              return (
                <PrizesTaskCard
                  key={index}
                  isClaim
                  tag={`${item} License`}
                  name={'VoyagerLicense_' + group?.projectId}
                  imgUrl={
                    hold
                      ? `/assets/image/prizes/${item}_licenses.png`
                      : `/assets/image/prizes/${item}_licenses_disabled.png`
                  }
                  status={
                    item
                      ? hold
                        ? PRIZECARDSTATUS.POSSESS
                        : PRIZECARDSTATUS.NOTPOSSESS
                      : PRIZECARDSTATUS.LOCKED
                  }
                  isTimeOut={flag}
                  countDownEndDate={group?.endTime}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
