"use client"

import React from 'react'
import Image from 'next/image'
import useGoogleEvent from '../../../hooks/useGoogleEvent'
import { useRouter, useSearchParams } from 'next/navigation'
import { CND_URL } from '../../constant'
import usePrizesUpdateBridgeRule from '../usePrizesUpdateBridgeRule'
import { objToParams } from '../../../utils/objToParams'

export default function PrizesBanner() {

  const { PrizesUpdateBridgeRule } = usePrizesUpdateBridgeRule()
  const { sendGoogleEvent } = useGoogleEvent()
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <div className='relative'>
      <Image
        className='absolute top-[55%] left-[50%] translate-x-[-50%] hover:cursor-pointer'
        aria-hidden
        src="/assets/image/prizes/start.png"
        alt=""
        width={289}
        height={96}
        onClick={(event) => {
          event.stopPropagation()
          router.prefetch("/", { kind: "temporary" as any })
          const dealerId = searchParams.get("dealerId")
          const params = {
            src_chain: "1",
            tgt_chain: "SUI_MAIN",
            src_token: "USDC",
            ...(dealerId ? ({ dealerId }) : {})
          }
          router.replace("/" + objToParams(params))
          sendGoogleEvent({
            event: "Prizes_eclipse_banner",
            value: ""
          })
          PrizesUpdateBridgeRule()
        }}
      />
      <Image
        className='w-full h-auto h-min-[800px]'
        aria-hidden
        src={CND_URL + "/prizes/bg2.png"}
        alt="Prizes"
        width={1440}
        height={800}
      />
    </div>
  )
}