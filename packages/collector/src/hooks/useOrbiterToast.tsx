import React from 'react'
import { toast } from 'react-hot-toast'
import { useAtomValue } from 'jotai'
import { OrbiterToastCard, TOAST_STATUS } from '../components/OrbiterToastCard'
import { pageIsMobileAtom } from '../stores'

export function useOrbiterToast() {
    const pageIsMobile = useAtomValue(pageIsMobileAtom)

    const totasGroup = React.useCallback(
        (params: {
            type: TOAST_STATUS
            title: string
            viceTitle?: string
            linkLabel?: string
            link?: string
        }) => {
            toast.custom(
                ({ id }) => {
                    return <OrbiterToastCard id={id} {...params} />
                },
                {
                    duration: pageIsMobile ? 4000 : 10000,
                    position: pageIsMobile ? 'top-center' : 'top-right',
                },
            )
        },
        [pageIsMobile],
    )

    const sucess = React.useCallback(
        (params: { title: string; viceTitle?: string; linkLabel?: string; link?: string }) => {
            totasGroup({
                type: TOAST_STATUS.SUCCESS,
                ...params,
            })
        },
        [totasGroup],
    )

    const error = React.useCallback(
        (params: { title: string; viceTitle?: string; linkLabel?: string; link?: string }) => {
            totasGroup({
                type: TOAST_STATUS.ERROR,
                ...params,
            })
        },
        [totasGroup],
    )

    const info = React.useCallback(
        (params: { title: string; viceTitle?: string; linkLabel?: string; link?: string }) => {
            totasGroup({
                type: TOAST_STATUS.INFO,
                ...params,
            })
        },
        [totasGroup],
    )

    const clock = React.useCallback(
        (params: { title: string; viceTitle?: string; linkLabel?: string; link?: string }) => {
            totasGroup({
                type: TOAST_STATUS.CLOCK,
                ...params,
            })
        },
        [totasGroup],
    )

    const warn = React.useCallback(
        (params: { title: string; viceTitle?: string; linkLabel?: string; link?: string }) => {
            totasGroup({
                type: TOAST_STATUS.WARN,
                ...params,
            })
        },
        [totasGroup],
    )

    const orbiterTotas = {
        sucess,
        error,
        info,
        warn,
        clock,
    }

    return {
        orbiterTotas,
    }
}
