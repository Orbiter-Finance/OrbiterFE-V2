"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation, Autoplay, Pagination } from 'swiper/modules'
import Image from 'next/image'
import { GiftIcon } from 'lucide-react'
import { OrbiterModal, OrbiterShow } from '@orbiter-finance/ui'
import { PRIZECARDSTATUS, PrizesTaskCard } from './PrizesTaskCard'
import { useAtomValue, useSetAtom } from "jotai"
import { currentPrizesProjectInfoAtom, prizesRefreshNowAtom, prizesUserInfoAtom } from '../../../stores/bridge'
import { decimalNum } from '../../../utils/decimalNum'
import { HOST_ENV_MAINNET, PRIZES_URL } from '../../constant'
import { cn } from '../../../utils/cn'
import LotteryModal from './LotteryModal'
import { useOrbiterToast } from '../../../components/useOrbiterToast'
import { useRouter } from 'next/navigation'
import useWalletAccount from '../../../hooks/useWalletAccount'

export default function PrizesReward() {

  const { prizesWalletAccount } = useWalletAccount()
  const router = useRouter()

  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)

  const { orbiterTotas } = useOrbiterToast()

  const [reward, setReward] = useState(null)

  const currentPrizesProjectInfo = useAtomValue(currentPrizesProjectInfoAtom)
  const prizesUserInfo = useAtomValue(prizesUserInfoAtom)
  const setPrizesRefresh = useSetAtom(prizesRefreshNowAtom)

  const [count, setCount] = useState(0)
  const [pending, setPending] = useState(false)

  const group = useMemo(() => prizesUserInfo?.lotteryRewards.find((item) => item.name?.toLocaleLowerCase() === "opoint"), [prizesUserInfo?.lotteryRewards])
  const usdcGroup = useMemo(() => prizesUserInfo?.lotteryRewards.find((item) => item.name?.toLocaleLowerCase() === "usdc"), [prizesUserInfo?.lotteryRewards])
  const hippoGroup = useMemo(() => prizesUserInfo?.lotteryRewards.find((item) => item.name?.toLocaleLowerCase() === "hippo"), [prizesUserInfo?.lotteryRewards])

  const init = useCallback(
    async () => {
      try {
        const weekId = currentPrizesProjectInfo?.weekId
        const dayId = currentPrizesProjectInfo?.dayId
        const walletAddress = prizesWalletAccount?.address?.toLocaleLowerCase()
        if (weekId && walletAddress && dayId) {
          const responese = await fetch(`${PRIZES_URL}/active-platform/competition/planetVoyagerLotteryTimes?projectId=${weekId}&taskId=${dayId}&address=${walletAddress}`)
          const res = await responese.json()
          setCount(res?.result || 0)
        }
      } catch (error) {

      }
    },
    [currentPrizesProjectInfo, prizesWalletAccount?.address],
  )

  const list = [{
    name: "opoint",
    label: "keep bridge , earn more!",
    rewardText: <span>+ <span className="o-prizes-reward">{decimalNum(reward?.amount, 4, ",")}</span> O-Points </span>,
  }, {
    name: "VoyagerLicense_FastPass",
    rewardText: 'FAST PASS x1',
    label: "You have directly qualified for the final prize pool."
  }, {
    name: "VoyagerLicense_Halloween",
    rewardText: "Halloween Exclusive x1",
    label: "keep bridge , earn more!"
  }, {
    name: "usdc",
    rewardText: <span>+ <span className="o-prizes-reward">{decimalNum(reward?.amount, 4, ",")}</span> $USDC </span>,
    label: "keep bridge , earn more!"
  }, {
    name: "hippo",
    rewardText: <span>+ <span className="o-prizes-reward">{decimalNum(reward?.amount, 4, ",")}</span> $Hippo </span>,
    label: "keep bridge , earn more!"
  }]

  const modalGroup = useMemo(() => {

    return list.find((item) => {
      return item.name === reward?.name
    })

  }, [list, reward])

  const draw = useCallback(
    async () => {
      try {
        setPending(true)
        const weekId = currentPrizesProjectInfo?.weekId
        const dayId = currentPrizesProjectInfo?.dayId
        const walletAddress = prizesWalletAccount?.address?.toLocaleLowerCase()
        if (weekId && walletAddress && dayId) {
          const responese = await fetch(`${PRIZES_URL}/active-platform/competition/planetVoyagerLottery?projectId=${weekId}&taskId=${dayId}&address=${walletAddress}`)
          const res = await responese.json()
          const name = res?.result?.name
          setReward({
            name,
            amount: res?.result?.amount
          })
          setPending(false)
          if (name) {
            setShow(true)
            setPrizesRefresh(+new Date())
            setCount(count <= 1 ? 0 : count - 1)
            init()
          }
        }
      } catch (error) {

      }
    },
    [currentPrizesProjectInfo, prizesWalletAccount?.address, count],
  )


  useEffect(() => {
    let timer = setTimeout(() => {
      if (currentPrizesProjectInfo?.weekId) {
        init()
      }
    }, 200)
    return () => {
      clearTimeout(timer)
    }
  }, [currentPrizesProjectInfo, prizesWalletAccount?.address])


  return (
    <div className='w-full'>
      <div className='w-full flex justify-center items-center mt-14 mb-8 o-font-600 text-3xl'>Daily lucky draw - Collect Fast Pass & other rewards </div>
      <div className='relative border-2 o-prizes-module-border o-prizes-reward-bg rounded-3xl p-8'>
        <Swiper
          slidesPerView={1}
          modules={[Autoplay, Navigation]}
          navigation
          loop
          autoplay
        >

          {/* <SwiperSlide className='flex justify-center items-center h-96'>
            <div className='w-full'>
              <div className='w-full flex justify-center items-center mt-10'>
                <Image src="/assets/image/prizes/halloween_licenses.png" alt="halloween licenses" width={400} height={400} className='h-80 w-80 z-[2]' />
              </div>
              <div className='w-full flex justify-center items-center o-font-600 text-[var(--o-color-gray-50)] z-[2]'>Halloween Exclusive License</div>
            </div>
          </SwiperSlide> */}
          <SwiperSlide className='flex justify-center items-center h-96'>

            <div className='w-full '>
              <div className='w-full flex justify-center items-center mt-10'>
                <Image src="/assets/image/prizes/fast_licenses.png" alt="fast licenses" width={400} height={400} className='w-80 h-80 z-[2]' />
              </div>
              <div className='w-full flex justify-center items-center o-font-600 text-[var(--o-color-gray-50)] z-[2]'>Fast Pass</div>
            </div>
          </SwiperSlide>
          <SwiperSlide className='flex justify-center items-end h-96'>
            <div className='w-full'>
              <div className='w-full flex justify-center items-center mt-10 h-80'>
                <Image src="/assets/image/prizes/draw-opoints.png" alt="draw O-Point" width={764} height={474} className='w-80 h-52 z-[2]' />
              </div>
              <div className='w-full flex justify-center items-center o-font-600 text-[var(--o-color-gray-50)] z-[2]'>O-Points Pool</div>
            </div>
          </SwiperSlide>
          {/* <SwiperSlide className='flex justify-center items-end h-96'>
            <div className='w-full'>
              <div className='w-full flex justify-center items-center mt-10 h-80'>
                <Image src="/assets/image/prizes/draw_usdc.png" alt="draw O-Point" width={388} height={240} className='w-96 h-60 z-[2]' />
              </div>
              <div className='w-full flex justify-center items-center o-font-600 text-[var(--o-color-gray-50)] z-[2]'>10 USDC</div>
            </div>
          </SwiperSlide> */}
          <SwiperSlide className='flex justify-center items-end h-96'>
            <div className='w-full'>
              <div className='w-full flex justify-center items-center mt-10 h-80'>
                <Image src="/assets/image/prizes/reward_Hippo.png" alt="draw O-Point" width={200} height={240} className='w-64 h-80 z-[2]' />
              </div>
              <div className='w-full flex justify-center items-center o-font-600 text-[var(--o-color-gray-50)] z-[2]'>100 $HIPPO</div>
            </div>
          </SwiperSlide>
        </Swiper>
        <div className='w-full flex justify-center items-center h-[11.25rem] -mt-36'>
          <Image src="/assets/image/prizes/draw-base.png" alt="Base" width={1320} height={358} className='w-[41.25rem] h-[11.25rem]' />
        </div>
        <div
          onClick={(event) => {
            event.stopPropagation()
            setOpen(true)
          }}
          className='absolute right-8 top-8 z-[2] cursor-pointer'>
          <div className='h-11 w-11 rounded-lg o-prizes-gift flex justify-center items-center'>
            <GiftIcon stroke='rgb(255, 199, 244)' />
          </div>
          <div className='mt-2 text-xs text-center o-font-500'>
            <div>Draw</div>
            <div>Record</div>
          </div>
        </div>
        <div className='w-full flex justify-center items-center mt-5'>
          <div className='w-full h-32 flex justify-center items-center'>
            <div className={
              cn('relative h-16 w-60 left-0 right-0 cursor-pointer')
            }
              style={{
                boxShadow: "inset 0px -6px 0px 0px rgba(0, 0, 0, 0.25)"
              }}
              onClick={(event) => {
                event.stopPropagation()
                if (!pending && !!count) {

                  if (prizesWalletAccount?.address) {
                    draw()
                  } else {
                    prizesWalletAccount?.connect()
                  }
                } else {
                  orbiterTotas.warn({
                    title: <span className='o-font-400'>You need to bridge 1 tx to earn 1 entry for the lucky draw. A maximum of 10 entries per address per day.</span>,
                    viceTitle: <button
                      onClick={(event) => {
                        event.stopPropagation()
                        router.replace("/")
                      }}
                      className='text-[var(--o-color-blue-500)] text-sm o-font-500 flex justify-end items-center w-full'>Go to Bridge</button>
                  })
                }
              }}
            >
              <Image src="/assets/image/prizes/draw_btn.png" alt="Draw" className='w-60 h-16 absolute rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' width={480} height={128} />
              <div className='w-full text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-0.5'>
                <div className='text-lg o-font-500'>Lucky Draw </div>
                <div className='text-sm o-font-500 text-[var(--o-color-desction)] text-center'>Bridge 1 TX to draw</div>
              </div>

              <OrbiterShow
                when={!!Number(count)}
              >
                <div className='absolute top-0 right-0 flex justify-center items-center'>
                  <div className="flex o-prizes-reward justify-center items-center text-sm o-font-600 h-5 w-11 bg-[#551921] rounded-tr-sm rounded-bl-sm">
                    x {count}
                  </div>
                </div>
              </OrbiterShow>

            </div>
          </div>
        </div>
      </div>


      <OrbiterModal
        show={open}
        onShowChange={(status) => {
          setOpen(status)
        }}
        containerClassName='border-2 o-prizes-module-border o-prizes-modal-bg max-w-[30rem] sm:max-w-[30rem] max-h-[30rem] sm:max-h-[30rem]'
      >
        <div className='text-xl o-font-600 flex w-full justify-center items-center text-center -mt-2'>Winning Record</div>
        <div className='w-full flex justify-between items-start mt-5 gap-2'>
          <div className='bg-[#030406] rounded-xl flex flex-1 justify-between items-center p-3'>
            <div className='flex-1'>
              <div className='text-sm text-[var(--o-color-desction)]'>O-Points Rewards</div>
              <div className='text-xl mt-1'>{decimalNum(group?.rewardAmount, 4, ",")}</div>
            </div>
            {/* <div className='flex justify-end items-start'>
              <Image src="/assets/image/prizes/modal_o_point.png" alt="O-Point" width={56} height={56} className='w-14 h-14' />
            </div> */}
          </div>
          <div className='bg-[#030406] rounded-xl flex flex-1 justify-between items-center p-3'>
            <div className='flex-1'>
              <div className='text-sm text-[var(--o-color-desction)]'>$USDC Rewards</div>
              <div className='text-xl mt-1'>{decimalNum(usdcGroup?.rewardAmount, 4, ",")}</div>
            </div>
            {/* <div className='flex justify-end items-start'>
              <Image src="/assets/image/prizes/modal_usdc.png" alt="USDC" width={56} height={56} className='w-14 h-14' />
            </div> */}
          </div>
          <div className='bg-[#030406] rounded-xl flex flex-1 justify-between items-center p-3'>
            <div className='flex-1'>
              <div className='text-sm text-[var(--o-color-desction)]'>$Hippo Rewards</div>
              <div className='text-xl mt-1'>{decimalNum(hippoGroup?.rewardAmount, 4, ",")}</div>
            </div>
            {/* <div className='flex justify-end items-start'>
              <Image src="/assets/image/prizes/modal_usdc.png" alt="USDC" width={56} height={56} className='w-14 h-14' />
            </div> */}
          </div>
        </div>

        <div className='flex justify-between items-start mt-6'>
          <PrizesTaskCard
            tag={'FAST PASS'}
            imgUrl='/assets/image/prizes/fast_licenses.png'
            name="VoyagerLicense_FastPass"
            status={prizesUserInfo?.lotteryRewards.some((item) => item.name == "VoyagerLicense_FastPass") ? PRIZECARDSTATUS.POSSESS : PRIZECARDSTATUS.NOTPOSSESS}
          />
          <PrizesTaskCard
            tag={'Halloween Exclusive'}
            imgUrl='/assets/image/prizes/halloween_licenses.png'
            name="VoyagerLicense_Halloween"
            status={prizesUserInfo?.lotteryRewards.some((item) => item.name == "VoyagerLicense_Halloween") ? PRIZECARDSTATUS.POSSESS : PRIZECARDSTATUS.NOTPOSSESS}
          />
        </div>

      </OrbiterModal>

      <LotteryModal
        show={show}
        type="Reward"
        modalGroup={modalGroup}
        count={count}
        onCall={() => {
          setShow(false)
          setReward(null)
        }}
      />
    </div>
  )
}
