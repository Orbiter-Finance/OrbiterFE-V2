import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import {
    fetchCollect,
    fetchCollectInfo,
    fetchHistory,
    fetchMakerHistory,
    ICollectInfo,
    IHistory,
    SourceChain,
} from '../services'
import { useWallet } from './useWallet'
import { useCollectorContext } from '../page/BridgePage'
import { formatEther, JsonRpcProvider, parseEther } from 'ethers'
import { useOrbiterToast } from './useOrbiterToast'
import { limitDecimalPlaces } from '../utils'
import { useOrbiterGetChainsConfig } from './useOrbiterGetChainsConfig'
import { useExploreLink } from './useExploreLink'
interface IHashItem {
    hash: string
    chainId: string
    value: string
}
export const useHistoryWatch = ({ refresh }: { refresh: () => void }) => {
    const { address, wallet } = useWallet()
    const { orbiterExplore, orbiterFeeEstimator, orbiterClient, isMainnet } = useCollectorContext()
    const [idList, setIdList] = useState<string[]>([])
    const [hashList, setHashList] = useState<IHashItem[]>([])
    const { orbiterTotas } = useOrbiterToast()
    const { getChainsConfig } = useOrbiterGetChainsConfig()
    const { getExploretransactionLink } = useExploreLink()
    const [newMakerList, setNewMakerList] = useState<IHistory[]>([])
    const [newUserList, setNewUserList] = useState<IHistory[]>([])

    const getMakerData = useCallback(async () => {
        if (idList.length && address) {
            const newList: string[] = [...idList]
            const { code, result } = await fetchMakerHistory(isMainnet, {
                address,
                pageSize: 20,
                page: 1,
            })
            if (code === 0 && result.list) {
                const newHistoryList: IHistory[] = []
                idList.forEach((id) => {
                    const item = result.list.find(
                        (i: IHistory) => i.id === id && i.txHash && i.status === 3,
                    )
                    if (item) {
                        newHistoryList.push(item)
                        newList.splice(newList.indexOf(id), 1)
                        orbiterTotas.sucess({
                            title: 'Successfully Collected',
                            viceTitle: `${limitDecimalPlaces(
                                formatEther(item.transferAmount || 0),
                            )} ETH sent on ${getChainsConfig(item.chain)?.name}`,
                            linkLabel: 'View Transaction',
                            link: getExploretransactionLink({
                                chainId: item.chain,
                                value: item.txHash,
                            }),
                        })
                    }
                })
                if (newHistoryList.length > 0) {
                    setNewMakerList(newHistoryList)
                }
            }
            setIdList(newList)
        }
    }, [idList, address])

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (idList.length) {
            timer = setTimeout(() => {
                getMakerData()
            }, 1000)
        }

        return () => {
            clearTimeout(timer)
        }
    }, [idList])

    const getUserData = useCallback(async () => {
        if (hashList.length && address) {
            const newList: IHashItem[] = [...hashList]
            const { code, result } = await fetchHistory(isMainnet, {
                address,
                pageSize: 20,
                page: 1,
            })

            if (code === 0 && result.list) {
                const _newUserList: IHistory[] = []
                hashList.forEach(({ hash }) => {
                    const item = result.list.find((i: IHistory) => i.txHash === hash)
                    if (item) {
                        _newUserList.push(item)
                        const index = newList.findIndex((i) => i.hash === hash)
                        index >= 0 && newList.splice(index, 1)
                        orbiterTotas.sucess({
                            title: 'Successfully Collected',
                            viceTitle: `${limitDecimalPlaces(
                                formatEther(item.transferAmount || 0),
                            )} ETH sent on ${getChainsConfig(item.chain)?.name}`,
                            linkLabel: 'View Transaction',
                            link: getExploretransactionLink({
                                chainId: item.chain,
                                value: hash,
                            }),
                        })
                    }
                })
                if (_newUserList.length > 0) {
                    setNewUserList(_newUserList)
                }
                if (hashList.length !== newList.length) {
                    refresh?.()
                }
            }
            setHashList(newList)
        }
    }, [hashList, address, refresh])

    const getHashStatus = useCallback(async () => {
        if (hashList.length && address) {
            hashList.forEach(async ({ chainId, hash, value }) => {
                const chain = orbiterExplore?.getChain(chainId)
                const provider = new JsonRpcProvider(
                    chain?.rpc?.[0],
                    {
                        name: chain?.name,
                        chainId: Number(chainId),
                    },
                    {
                        staticNetwork: true,
                    },
                )
                const r2 = await provider.getTransactionReceipt(hash)
                console.log('hash status', r2)
                if (r2 && r2.status !== 1) {
                    orbiterTotas.error({
                        title: 'Transaction Fail',
                        viceTitle: `${limitDecimalPlaces(
                            formatEther(value || 0),
                        )} ETH sent on ${chain?.name}`,
                    })
                    setHashList((pre) => pre.filter((item) => item.hash !== hash))
                } else {
                    setHashList((pre) => [...pre])
                }
            })
        }
    }, [hashList, address])

    const timerRef = useRef<NodeJS.Timeout>()
    const hashTimerRef = useRef<NodeJS.Timeout>()
    useEffect(() => {
        if (hashList.length) {
            clearTimeout(timerRef.current)
            clearTimeout(hashTimerRef.current)
            timerRef.current = setTimeout(() => {
                getUserData()
            }, 1000)
            hashTimerRef.current = setTimeout(() => {
                getHashStatus()
            }, 10000)
        }
        return () => {
            clearTimeout(timerRef.current)
            clearTimeout(hashTimerRef.current)
        }
    }, [hashList])

    return {
        setHashList,
        setIdList,
        newMakerList,
        newUserList,
    }
}
