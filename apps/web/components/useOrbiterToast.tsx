import React, { ReactNode } from 'react'
import { toast, useToaster } from 'react-hot-toast'
import { useAtomValue } from 'jotai'
import { pageIsMobileAtom } from '../stores/bridge'
import { OrbiterToastCard, TOAST_STATUS } from './OrbiterToastCard'

export function useOrbiterToast() {

    const pageIsMobile = useAtomValue(pageIsMobileAtom)

    const { toasts, handlers } = useToaster()

    const totasGroup = React.useCallback(
        (params: {
            type: TOAST_STATUS,
            title: ReactNode,
            viceTitle?: ReactNode,
            linkLabel?: ReactNode,
            link?: string
            timer?: number
        }) => {
            toast.custom(
                ({ id }) => {
                    return <OrbiterToastCard id={id} {...params} />
                }, {
                duration: params.timer || (pageIsMobile ? 4000 : 10000),
                position: pageIsMobile ? 'top-center' : "top-right",
            }
            )
        }, [pageIsMobile, toasts],
    )

    const sucess = React.useCallback(
        (params: {
            title: ReactNode,
            viceTitle?: ReactNode,
            linkLabel?: ReactNode,
            link?: string
            timer?: number
        }) => {
            totasGroup({
                type: TOAST_STATUS.SUCCESS,
                ...params
            })
        },
        [totasGroup],
    )

    const error = React.useCallback(
        (params: {
            title: ReactNode,
            viceTitle?: ReactNode,
            linkLabel?: ReactNode,
            link?: string
            timer?: number
        }) => {
            totasGroup({
                type: TOAST_STATUS.ERROR,
                ...params
            })
        },
        [totasGroup],
    )

    const info = React.useCallback(
        (params: {
            title: ReactNode,
            viceTitle?: ReactNode,
            linkLabel?: ReactNode,
            link?: string
            timer?: number
        }) => {
            totasGroup({
                type: TOAST_STATUS.INFO,
                ...params
            })
        },
        [totasGroup],
    )

    const warn = React.useCallback(
        (params: {
            title: ReactNode,
            viceTitle?: ReactNode,
            linkLabel?: ReactNode,
            link?: string
            timer?: number
        }) => {
            totasGroup({
                type: TOAST_STATUS.WARN,
                ...params
            })
        },
        [totasGroup],
    )

    const orbiterTotas = {
        sucess,
        error,
        info,
        warn
    }

    return ({
        orbiterTotas
    })
}
