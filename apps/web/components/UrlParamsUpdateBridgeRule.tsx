import { useBridgeData } from '@orbiter-finance/widget'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export default function UrlParamsUpdateBridgeRule() {
  const bridgeData = useBridgeData()
  const SearchParams = useSearchParams()
  const pathname = usePathname()
  const dealerId = SearchParams.get("dealerId")

  useEffect(() => {
    if (bridgeData?.src_chain && bridgeData?.tgt_chain && bridgeData?.src_token) {
      if (typeof window !== "undefined") {

        let searchParams = new URLSearchParams(window.location.search)
        Object.keys(bridgeData).forEach((item) => {
          searchParams.set(item, bridgeData[item])
        })
        if (dealerId) {
          searchParams.set("dealerId", dealerId)
        }
        window.history.replaceState({}, '', `${pathname}?${searchParams.toString()}`)
      }
    }
  }, [bridgeData?.src_chain, bridgeData?.tgt_chain, bridgeData?.src_token, dealerId])


  return (
    null
  )
}
