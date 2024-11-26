import React, { useCallback } from 'react'

export default function useOpenLink() {
  const openLink = useCallback(
    (link: string, target?: string) => {
      if (typeof window !== "undefined") {
        window.open(link, target || "_blank")
      }
    },
    [],
  )
  return ({
    openLink
  })

}
