;


import React, { useContext } from 'react'
import { useAtomValue } from 'jotai'
import { OrbiterShow } from "@orbiter-finance/ui"
import { PAGE_TYPE } from '../constant.js'
import { pageTypeAtom, pageIsMobileAtom, bridgeContext } from '../stores/bridge.js'
import { cn } from '../utils/cn.js'
import { Bridge } from './Bridge.js'
import { History } from './History.js'
import { TransactionConfirm } from './TransactionConfirm.js'
import { Header } from '../components/Header.js'
import { BridgeInfoContext } from '../bridgeInfo/providers.js'


export const Page = React.memo(() => {

  const pageType = useAtomValue(pageTypeAtom)
  const pageIsMobile = useAtomValue(pageIsMobileAtom)

  const { isCustomHeader } = useContext(BridgeInfoContext)

  return (
    <div className='w-full'>
      <OrbiterShow
        when={!isCustomHeader}
      >
        <Header />
      </OrbiterShow>
      <div className={
        cn('w-full h-full flex justify-center items-center', pageIsMobile ? "pb-20" : "")
      }>

        <OrbiterShow
          when={pageType === PAGE_TYPE.BRIDGE}
        >
          <Bridge />
        </OrbiterShow>

        <OrbiterShow
          when={pageType === PAGE_TYPE.HISTORY}
        >
          <History />
        </OrbiterShow>

        <OrbiterShow
          when={pageType === PAGE_TYPE.CONFIRM}
        >
          <TransactionConfirm />
        </OrbiterShow>

        {/* <Tomo /> */}

      </div>

    </div>

  )
})
