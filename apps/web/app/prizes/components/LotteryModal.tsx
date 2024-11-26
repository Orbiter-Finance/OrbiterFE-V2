import React, { ReactNode } from 'react'
import LotteryDraw from '../../../components/LotteryDraw'
import { OrbiterShow } from '@orbiter-finance/ui'
import Image from 'next/image'

interface LotteryModalType {
  type: "Reward" | "Task"
  show: boolean,
  modalGroup?: {
    name: string
    rewardText: ReactNode
    label: ReactNode
    imageUrl?: string
  }
  count: number | string
  onCall: () => void
}

export default function LotteryModal({
  show,
  modalGroup,
  count,
  type,
  onCall
}: LotteryModalType) {
  return (
    <OrbiterShow
      when={show}
    >
      <LotteryDraw>
        <div className='w-[19rem] bg-[var(--o-color-brand-500)] border-2 o-prizes-module-border rounded-3xl o-prizes-modal-card p-6 text-white'>
          <div className='w-full text-center text-2xl o-font-600 whitespace-nowrap'>
            🎉 <span className='o-reward-card-text o-linear-text'>Congratulations!</span> <span className='rotate-90'>🎉</span>
          </div>
          <div className='w-full flex justify-center items-center px-6'>
            <OrbiterShow
              when={modalGroup?.name?.toLocaleLowerCase() === "opoint"}
            >
              <Image src="/assets/image/prizes/prizes_o_point.png" alt="o-Point" width={231} height={240} className='w-28 h-28' />
            </OrbiterShow>
            <OrbiterShow
              when={modalGroup?.name?.toLocaleLowerCase() === "usdc"}
            >
              <Image src="/assets/image/prizes/reward_usdc.png" alt="o-Point" width={446} height={336} className='w-44 h-32' />
            </OrbiterShow>
            <OrbiterShow
              when={modalGroup?.name?.toLocaleLowerCase() === "hippo"}
            >
              <Image src="/assets/image/prizes/reward_Hippo.png" alt="Hippo" width={304} height={360} className='w-36 h-44' />
            </OrbiterShow>
            <OrbiterShow
              when={modalGroup?.name?.toLocaleLowerCase() === "week"}
            >
              <Image src={modalGroup?.imageUrl || "/assets/image/prizes/week_licenses.png"} alt="fast_licenses" width={400} height={400} className='w-40 h-40' />
            </OrbiterShow>
            <OrbiterShow
              when={modalGroup?.name?.toLocaleLowerCase() === "VoyagerLicense_FastPass"?.toLocaleLowerCase()}
            >
              <Image src="/assets/image/prizes/fast_licenses.png" alt="fast_licenses" width={400} height={400} className='w-40 h-40' />
            </OrbiterShow>
            <OrbiterShow
              when={modalGroup?.name?.toLocaleLowerCase() === "VoyagerLicense_Halloween"?.toLocaleLowerCase()}
            >
              <Image src="/assets/image/prizes/halloween_licenses.png" alt="draw O-Point" width={400} height={400} className='w-40 h-40' />
            </OrbiterShow>
          </div>
          <div className='text-xl o-font-500 w-full flex justify-center items-center mt-3'>
            {modalGroup?.rewardText}
          </div>
          <div className='text-base o-font-500 w-full flex text-center justify-center items-center mt-1.5 text-[var(--o-color-text-t3)]'>
            {modalGroup?.label}
          </div>
          <div className='w-full flex justify-center items-center mt-4'>
            <div onClick={(event) => {
              event.stopPropagation()
              onCall()
            }} className='px-5 w-full h-12 rounded-full bg-[var(--o-color-brand-500)] o-font-600 flex justify-center items-center cursor-pointer'>
              Continue
            </div>
          </div>
          <OrbiterShow
            when={type === "Reward"}
          >
            <div className='w-full flex justify-center items-center mt-3 text-[var(--o-color-desction)] text-xs o-font-400'>
              Your chances: {count}
            </div>
          </OrbiterShow>
        </div>
      </LotteryDraw>
    </OrbiterShow>
  )
}
