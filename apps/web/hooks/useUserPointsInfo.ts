import React, { useCallback } from 'react'
import { useAtomValue } from "jotai"
import { userPointsDrawCardListAtom, userPointsInfoListAtom, userPointsRankListAtom } from '../stores/bridge'

export function useUserPointsInfo() {
    const userPointsRankList = useAtomValue(userPointsRankListAtom)
    const userPointsDrawCardList = useAtomValue(userPointsDrawCardListAtom)
    const userPointsInfoList = useAtomValue(userPointsInfoListAtom)


    const getUserPointsInfo = useCallback(
        (address?: string) => {
            if (!address) return null
            const userPointsRank = userPointsRankList.find((item) => item?.address?.toLocaleLowerCase() === address?.toLocaleLowerCase())
            const userPointsDrawCard = userPointsDrawCardList.find((item) => item?.address?.toLocaleLowerCase() === address?.toLocaleLowerCase())
            const userPointsInfo = userPointsInfoList.find((item) => item?.address?.toLocaleLowerCase() === address?.toLocaleLowerCase())
            return ({
                rank: userPointsRank,
                card: userPointsDrawCard,
                point: userPointsInfo
            })
        },
        [userPointsRankList, userPointsDrawCardList, userPointsInfoList],
    )

    return ({
        getUserPointsInfo
    })

}
