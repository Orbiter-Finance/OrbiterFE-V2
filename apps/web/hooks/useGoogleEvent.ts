"use client"

import React, { useCallback } from 'react'
import { sendGTMEvent } from "@next/third-parties/google"


export default function useGoogleEvent() {

  const sendGoogleEvent = useCallback(
    ({ event, value }: {
      event: string,
      value: string
    }) => {
      sendGTMEvent({
        event,
        value,
      })
    },
    [sendGTMEvent],
  )

  return ({
    sendGoogleEvent
  })
}
