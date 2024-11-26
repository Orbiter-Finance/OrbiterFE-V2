import React, { useEffect } from 'react'
import { useAtom } from 'jotai'
import { bridgeToastInfoAtom } from '../stores/bridge'
import { useOrbiterToast } from './useOrbiterToast'

function ToasterAtom() {


  const [bridgeToastData, setBridgeToastData] = useAtom(bridgeToastInfoAtom)
  const { orbiterTotas } = useOrbiterToast()

  useEffect(() => {
    if(bridgeToastData && bridgeToastData?.time) {
      const fn = orbiterTotas?.[bridgeToastData?.type || ""]
      if(fn) {
        setBridgeToastData(null);
        fn?.(bridgeToastData?.data)
      }
    }
  }, [bridgeToastData, orbiterTotas, setBridgeToastData])
  

  return (
    null
  )
}

export default React.memo(ToasterAtom)
