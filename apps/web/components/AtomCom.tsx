"use client"

import React, { useCallback, useEffect } from 'react'
import { userPointsRankListAtom, userPointsDrawCardListAtom, userPointsInfoListAtom, UserPointsInfoListType, pointsInfoRefreshAtom, pageIsMobileAtom } from '../stores/bridge'
import { useAtomValue, useSetAtom } from "jotai"
import { useWallets } from '@orbiter-finance/wallet-management'
import { BASE_URL } from '../app/constant'
import { useBridgeInfoContext } from '@orbiter-finance/widget'
import { decimalNum } from '../utils/decimalNum'

function AtomCom() {

  const { orbiterClient } = useBridgeInfoContext()

  const pointsInfoRefresh = useAtomValue(pointsInfoRefreshAtom)
  const setUserPointsInfoList = useSetAtom(userPointsInfoListAtom)

  const wallets = useWallets()

  const setUserPointsRankList = useSetAtom(userPointsRankListAtom)
  const setUserPointsDrawCardList = useSetAtom(userPointsDrawCardListAtom)

  const setPageIsMobile = useSetAtom(pageIsMobileAtom)

  const setDomClientWidthCall = useCallback(
    (width: number) => {
      if (width) {
        if (width <= 1440) {
          document.documentElement.style.fontSize = "14px"
        } else if (width <= 1920 && width >= 1280) {
          const w = width - 1280
          const wS = w / 160

          document.documentElement.style.fontSize = 12 + wS + "px"

        } else {
          document.documentElement.style.fontSize = "16px"
        }
      }

      setPageIsMobile(width <= 640)
    },
    [],
  )


  useEffect(() => {
    let timer: any
    if (typeof window !== "undefined") {
      timer = setTimeout(() => {
        let contentWidth = document.documentElement.clientWidth ||
          document.body.clientWidth
        setDomClientWidthCall(contentWidth)
        window.addEventListener("resize", () => {
          contentWidth = document.documentElement.clientWidth ||
            document.body.clientWidth
          setDomClientWidthCall(contentWidth)
        })
      }, 50)
    }

    return () => {
      clearTimeout(timer)
    }

  }, [])

  const walletAddress = React.useMemo(() => {
    return wallets.filter((item) => item.address).map((item) => item.address).join(",")
  }, [wallets])

  const getPointsDrawCard = async (address: string) => {
    try {
      const responese = await fetch(BASE_URL + "/points_system/user/cards?address=" + address)
      const res = await responese.json()
      return res?.data ? ({
        ...(res?.data || {}),
        address
      }) : null
    } catch (error) {
      return null
    }
  }

  const getPointsRank = async (address: string) => {
    const responese = await fetch(BASE_URL + "/points_platform/rank/address/" + address)
    const res = await responese.json()
    const point = Number(res?.result?.point) || 0
    return ({
      points: point <= 0 ? 0 : point,
      rank: res?.result?.rank || 0,
      address
    })
  }

  const getPoints = async (address: string) => {
    try {
      const res = await orbiterClient?.getUserOpoint(address)
      return res as UserPointsInfoListType
    } catch (error) {
      return null
    }
  }

  const init = useCallback(
    async () => {
      const res = await Promise.all(wallets.filter((item) => !!item.address).map(async (item) => {
        return await getPointsRank(item.address)
      }))
      setUserPointsRankList(res || [])
    },
    [wallets, getPoints],
  )

  const init2 = useCallback(
    async () => {
      const res = await Promise.all(wallets.filter((item) => !!item.address).map(async (item) => {
        return await getPointsDrawCard(item.address)
      }))
      setUserPointsDrawCardList(
        res.filter(item => !!item)
      )
    },
    [wallets, getPointsDrawCard],
  )

  const init3 = useCallback(
    async () => {
      const res = await Promise.all(wallets.filter((item) => !!item.address).map(async (item) => {
        return await getPoints(item.address)
      }))
      setUserPointsInfoList(res.filter(item => !!item))
    },
    [wallets, getPoints],
  )

  useEffect(() => {
    let timer
    if (walletAddress) {
      timer = setTimeout(() => {
        init()
        init2()
      }, 200)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [walletAddress, pointsInfoRefresh])

  useEffect(() => {
    let timer
    if (walletAddress && orbiterClient) {
      timer = setTimeout(() => {
        init3()
      }, 200)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [walletAddress, orbiterClient, pointsInfoRefresh])

  return (
    null
  )
}

export default React.memo(AtomCom)