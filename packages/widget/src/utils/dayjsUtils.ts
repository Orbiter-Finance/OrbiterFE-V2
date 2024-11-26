import React from "react"

import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

export const dayjsUtils = (time: string | number, format = "YYYY-MM-DD HH:mm:ss") => {

    const t = Number(time)

    return dayjs.unix(Number(t)).locale("en").format(format)
}

export const dayjsAreaUtils = (time: string | number, format = "YYYY-MM-DD HH:mm:ss") => {


    const t = Number(time)

    return dayjs.unix(Number(t?.toString())).locale("en").format(format)
}

export const dayjsTimezoneUtils = (time: string | number, format = "YYYY-MM-DD HH:mm:ss") => {

    let t = Number(time)

    t = isNaN(t) ? Math.floor(+new Date(time) / 1000) : t

    return +new Date(dayjs.unix(Number(t)).utc(false).format(format))

}

export const dayjsTimeCurrentUtils = (time: string, format = "YYYY-MM-DD HH:mm:ss") => {


    return +new Date(dayjs.utc(time).local().format(format)) / 1000

}
export const calculateRelativeTime = (date: string) => {
    if (!date) {
        return '-'
    }
    const diffInMinutes = dayjs().diff(date, 'minute')
    if (diffInMinutes <= 30) {
        return dayjs(date).fromNow()
    } else {
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    }
}
export function dateFormatStandard(
    date?: string | number | Date | dayjs.Dayjs | null | undefined,
    formatType?: string | undefined,
) {
    if (!date) return '-'
    return dayjs(date).format(formatType || 'YYYY-MM-DD HH:mm:ss')
}