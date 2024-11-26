
import React, { useCallback, useEffect } from 'react'
import { pageIsMobileAtom } from '../stores/bridge.js'
import { useSetAtom } from 'jotai'

function PageAtomCom() {
  const setPageIsMobile = useSetAtom(pageIsMobileAtom)

  const setDomClientWidthCall = useCallback(
    (width: number) => {
      setPageIsMobile(width <= 640)
    },
    [],
  )

  useEffect(() => {

    let timer: any
    if (window) {
      timer = setTimeout(() => {
        let contentWidth = document.documentElement.clientWidth ||
          document.body.clientWidth
        setDomClientWidthCall(contentWidth)
        window.addEventListener("resize", () => {
          contentWidth = document.documentElement.clientWidth ||
            document.body.clientWidth
          setDomClientWidthCall(contentWidth)
        })
      }, 200)
    }
    return () => {
      clearTimeout(timer)
    }

  }, [])
  return (
    null
  )
}
export default React.memo(PageAtomCom)
