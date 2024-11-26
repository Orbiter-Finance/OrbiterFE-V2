import React from 'react'
import dayjs from 'dayjs'

export default function CalculateRelativeTime(
    { date }: {
        date: dayjs.ConfigType
    }
) {
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
