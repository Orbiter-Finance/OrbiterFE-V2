import React from 'react'
import { BridgeInfoContext } from '../bridgeInfo/providers.js'
import { BRIDGE_EVENT } from '../constant.js'
import { useCurrentWallet } from './useCurrentWallet.js'

export default function useBridgeLogEvent() {
  const { LogEvent } = React.useContext(BridgeInfoContext)
  const CurrentWallet = useCurrentWallet()
  const bridgeLogEvent = React.useCallback(
    (method: BRIDGE_EVENT, params?: string) => {
      try {
        if (LogEvent) {
          LogEvent(method, params || CurrentWallet?.address || "")
        }
      } catch (error) {

      }
    },
    [LogEvent, CurrentWallet],
  )

  return ({
    bridgeLogEvent,
    BRIDGE_EVENT
  })
}
