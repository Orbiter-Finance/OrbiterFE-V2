'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'

import styles from './PrizesTaskCard.module.css'
import { cn } from '../../../utils/cn'
import CardTimeOut from './CardTimeOut'
import { OrbiterShow } from '@orbiter-finance/ui'
import LotteryModal from './LotteryModal'
import useWalletAccount from '../../../hooks/useWalletAccount'


export enum PRIZECARDSTATUS {
  LOCKED = "LOCKED",
  NOTPOSSESS = "NOTPOSSESS",
  POSSESS = 'POSSESS'
}

interface PrizesTaskCardProps {
  status: PRIZECARDSTATUS
  name: string
  tag?: string
  imgUrl?: string
  countDownEndDate?: string
  isClaim?: boolean
  isTimeOut?: boolean
}

export const PrizesTaskCard = ({
  name,
  tag,
  imgUrl,
  status,
  countDownEndDate,
  isClaim,
  isTimeOut
}: PrizesTaskCardProps) => {

  const { prizesWalletAccount } = useWalletAccount()

  const [show, setShow] = useState(false)

  const str = useMemo(() => {
    return prizesWalletAccount?.address ? localStorage.getItem(prizesWalletAccount.address.toLocaleLowerCase()) : ""
  }, [prizesWalletAccount])


  return (
    <div className='relative w-[12.5rem]'>
      <div className='relative h-60 w-full flex flex-col bg-[rgba(255,255,255,0.1)] rounded-xl border-2 border-[rgba(255,255,255,0.1)] overflow-hidden'>
        <OrbiterShow
          when={!!tag && status !== PRIZECARDSTATUS.LOCKED}
        >
          <span className={styles.prizeCardTag}>{tag}</span>
        </OrbiterShow>
        <div className='flex-1 w-full flex justify-center items-center bg-[#030406]'>
          {status === PRIZECARDSTATUS.POSSESS && imgUrl && <Image
            className='h-full w-auto'
            src={imgUrl}
            alt=""
            width={200}
            height={200}
          />}
          {status === PRIZECARDSTATUS.NOTPOSSESS && imgUrl && <Image
            className='h-full w-auto'
            src={imgUrl}
            alt=""
            width={200}
            height={200}
          />}
          {status === PRIZECARDSTATUS.LOCKED && <Image
            className='h-full w-auto'
            src='/assets/image/prizes/lock_licenses.png'
            alt=""
            width={200}
            height={200}
          />}
        </div>

        <OrbiterShow
          when={!!isClaim && PRIZECARDSTATUS.POSSESS === status && !str?.includes(name)}
          fallback={
            <div className={
              cn('h-8 w-full flex justify-center items-center text-sm o-font-500', status === PRIZECARDSTATUS.POSSESS ? "o-licenses-possess text-[var(--o-color-gray-900)]" : "o-licenses-not-possess text-[var(--o-color-gray-500)]")
            }>
              <OrbiterShow
                when={status === PRIZECARDSTATUS.POSSESS}
                fallback={
                  <>Not yet collected</>
                }
              >
                Already collected
              </OrbiterShow>
            </div>
          }
        >
          <div

            onClick={(event) => {
              event.stopPropagation()
              setShow(true)
            }}

            className={
              cn('h-8 w-full flex justify-center items-center text-sm o-font-500 bg-[var(--o-color-brand-900)] text-[var(--o-color-brand-500)] cursor-pointer')
            }>
            Confirm
          </div>
        </OrbiterShow>

      </div >
      {countDownEndDate && isTimeOut && <div className='w-full mt-2'><CardTimeOut timerStr={countDownEndDate} /></div>}
      <LotteryModal
        show={show}
        type="Task"
        modalGroup={{
          name: "week",
          rewardText: `${tag} x1`,
          label: "You have already entered the Prize Pool for this Round",
          imageUrl: imgUrl
        }}
        count={0}

        onCall={() => {
          setShow(false)
          if (prizesWalletAccount?.address && isClaim) {
            const str = localStorage.getItem(prizesWalletAccount.address.toLocaleLowerCase()) || ""
            localStorage.setItem(prizesWalletAccount.address.toLocaleLowerCase(), str + "," + name)
          }
        }}
      />
    </div >
  )
}