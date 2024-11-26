"use client"

import dayjs from 'dayjs'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

export default function useTimeOut(time: string, isSec?: boolean) {
    const [timeList, setTimeList] = useState<Array<{ value: string | number, symbol: string, label: string }>>([])
    const endTime = useMemo(() => dayjs.utc(time), [time])

    const timeOut = useCallback(
        (timer?: NodeJS.Timeout) => {
            const startTime = dayjs.utc()
            let time: string | number = Math.floor(endTime.diff(startTime) / 1000)
            let d: string | number = Math.floor(time / 3600 / 24)
            time -= d * 3600 * 24
            d = d < 0 ? 0 : d
            d = d < 10 ? '0' + d : d
            let h: string | number = Math.floor(time / 3600)
            time -= h * 3600
            h = h < 0 ? 0 : h
            h = h < 10 ? '0' + h : h
            let m: string | number = Math.floor(time / 60)
            time -= m * 60
            m = m < 0 ? 0 : m
            m = m < 10 ? '0' + m : m
            const s = time < 10 ? '0' + time : time

            const timeList = [
                {
                    value: d,
                    symbol: 'D',
                    label: "Days"
                },
                {
                    value: h,
                    symbol: 'H',
                    label: "Hours"
                },
                {
                    value: m,
                    symbol: 'M',
                    label: "Min"
                },
                ...(
                    isSec ? [{
                        value: s,
                        symbol: "S",
                        label: 'SEC',
                    }] : []
                )
            ]
            if (time <= 0) {
                setTimeList(timeList)
                clearTimeout(timer)
            } else {
                setTimeList(timeList)
            }
        },
        [endTime, isSec],
    )

    useEffect(() => {
        let timerInterval: NodeJS.Timeout
        const timer = setTimeout(() => {
            timeOut()
            clearTimeout(timer)
            timerInterval = setInterval(() => {
                timeOut(timerInterval)
            }, (isSec ? 1 : 30) * 1000)
        }, 200)

        return () => {
            clearTimeout(timer)
            clearInterval(timerInterval)
        }
    }, [endTime, isSec])

    return ({
        timeList
    })
}
