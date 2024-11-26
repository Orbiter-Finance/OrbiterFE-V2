import React from 'react'
import { useAtomValue } from 'jotai'
import { bridgeTransactionAtom } from '../stores/bridge.js'

export function useTransactionInfo() {
  const BridgeTransaction = useAtomValue(bridgeTransactionAtom)

  return React.useMemo(() => BridgeTransaction, [BridgeTransaction])
}
