import React, { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { bridgeDataAtom } from 'src/stores/bridge'

export function useBridgeData() {

  const bridgeData = useAtomValue(bridgeDataAtom)

  return useMemo(() => bridgeData, [bridgeData])
}
