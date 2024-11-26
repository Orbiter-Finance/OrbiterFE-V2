import React from 'react'
import { useAtomValue } from 'jotai'
import { pageIsMobileAtom, pageTypeAtom } from '../stores/bridge.js'
import { HeaderTools } from './HeaderTools.js'
import { OrbiterHeader, OrbiterShow } from '@orbiter-finance/ui'
import { PAGE_TYPE } from '../constant.js'
import { LogoPng } from '../assets/assets.js'


export function Header() {
  const pageType = useAtomValue(pageTypeAtom)
  const pageIsMobile = useAtomValue(pageIsMobileAtom)

  return (
    <OrbiterShow
      when={pageType === PAGE_TYPE.BRIDGE || !pageIsMobile}
    >
      <OrbiterHeader
        logo={
          <img src={LogoPng} alt="logo" width={174} height={40} className='w-[10.875rem] h-10' />
        }
        tools={
          <HeaderTools />
        }
      />
    </OrbiterShow>
  )
}
