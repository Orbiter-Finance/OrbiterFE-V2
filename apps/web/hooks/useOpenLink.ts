"use client"

import React, { useCallback, useEffect, useState } from 'react'

export default function useOpenLink() {
  const [canUseWindow, setCanUseWindow] = useState(false)

  useEffect(() => {
    setCanUseWindow(typeof window !== "undefined")
  }, [])

  const openLink = useCallback(
    (link: string, target?: string) => {
      if (canUseWindow) {
        window.open(link, target || "_blank")
      }
    },
    [canUseWindow],
  )

  return {
    openLink
  }
}