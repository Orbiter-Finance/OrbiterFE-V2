import { useAtom, useAtomValue } from 'jotai'
import React, { useMemo } from 'react'
import { ChevronLeft } from 'lucide-react'
import { OrbiterModal, OrbiterShow } from '@orbiter-finance/ui'
import { PAGE_TYPE } from '../constant.js'
import { usePageTypeUpdate } from '../hooks/usePageTypeUpdate.js'
import { HistoryList } from '../page/HistoryList.js'
import { TransactionConfirm } from '../page/TransactionConfirm.js'
import { pageIsMobileAtom, pageTypeBackAtom, pageModaleTypeAtom } from '../stores/bridge.js'
import { cn } from '../utils/cn.js'

export function Modal() {
    const pageIsMobile = useAtomValue(pageIsMobileAtom)
    const pageTypeBack = useAtomValue(pageTypeBackAtom)
    const [pageModaleType, setPageModaleType] = useAtom(pageModaleTypeAtom)
    const { updatePageModalType } = usePageTypeUpdate()

    const label = useMemo(() => {
        let str = ""
        switch (pageModaleType) {
            case PAGE_TYPE.HISTORY_MODAL:
                str = "History"
                break
            case PAGE_TYPE.CONFIRM_MODAL:
                str = "Completed"
                break
            default:
                break
        }
        return str

    }, [pageModaleType])

    return (
        <>
            <OrbiterShow
                when={pageIsMobile}
            >
                <OrbiterModal
                    show={!!pageModaleType}
                    onShowChange={(show: boolean) => {
                        if (!show) {
                            setPageModaleType(null)
                        }
                    }}
                    headerIcon={
                        <OrbiterShow
                            when={pageTypeBack === PAGE_TYPE.HISTORY}
                        >
                            <ChevronLeft className='w-6 h-6' onClick={(event) => {
                                event.stopPropagation()
                                updatePageModalType(PAGE_TYPE.HISTORY)
                            }} />
                        </OrbiterShow>
                    }
                    headerLabel={label}
                    containerClassName='p-3 rounded-2xl bg-[var(--o-color-gray-800)] sm:bg-[transparent]'
                >
                    <OrbiterShow when={pageModaleType === PAGE_TYPE.HISTORY_MODAL}>
                        <HistoryList />
                    </OrbiterShow>
                    <OrbiterShow when={pageModaleType === PAGE_TYPE.CONFIRM_MODAL}>
                        <TransactionConfirm />
                    </OrbiterShow>
                </OrbiterModal>
            </OrbiterShow>
        </>
    )
}
