import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { useCallback } from 'react'
import { pageIsMobileAtom, pageModaleTypeAtom, pageTypeAtom, pageTypeBackAtom } from '../stores/bridge.js'
import { PAGE_TYPE } from '../constant.js'
import useBridgeLogEvent from './useBridgeLogEvent.js'


export function usePageTypeUpdate() {

    const [pageType, setPageType] = useAtom(pageTypeAtom)
    const setPageModalType = useSetAtom(pageModaleTypeAtom)
    const pageIsMobile = useAtomValue(pageIsMobileAtom)
    const setPageTypeBack = useSetAtom(pageTypeBackAtom)
    const { bridgeLogEvent, BRIDGE_EVENT } = useBridgeLogEvent()
    const updatePageModalType = useCallback(
        (type: PAGE_TYPE, backPageType?: PAGE_TYPE) => {
            setPageTypeBack(backPageType || pageType)
            bridgeLogEvent(BRIDGE_EVENT.switchBridgePage)
            if (type === PAGE_TYPE.CONFIRM) {
                if (pageIsMobile) {
                    setPageModalType(PAGE_TYPE.CONFIRM_MODAL)
                    return
                }
            }
            if (type === PAGE_TYPE.HISTORY) {
                if (pageIsMobile) {
                    setPageModalType(PAGE_TYPE.HISTORY_MODAL)
                    return
                }
            }
            setPageType(type)
        },
        [setPageModalType, pageIsMobile, pageType, bridgeLogEvent, BRIDGE_EVENT],
    )

    return ({
        updatePageModalType
    })
}
