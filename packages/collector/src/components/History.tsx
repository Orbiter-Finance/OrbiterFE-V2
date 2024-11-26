import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { OrbiterIcon, OrbiterModal, ProgressSkeleton } from '@orbiter-finance/ui'
import {
    fetchCollectInfo,
    fetchHistory,
    fetchMakerHistory,
    ICollectInfo,
    IHistory,
} from '../services'
import { useCollectorContext } from '../page/BridgePage'
import { useOrbiterGetChainsConfig } from '../hooks/useOrbiterGetChainsConfig'
import { StatusIcon } from '../components/icons'
import { shortenAddress, limitDecimalPlaces } from '../utils'
import { useExploreLink } from '../hooks/useExploreLink'
import { useWallet } from '../hooks/useWallet'
import { NoDataPng } from '../assets/assets'
import { formatEther } from 'ethers'
import { Modal } from './Modal'
import useOpenLink from '../hooks/useOpenLink'
const getTime = (timeStr: string) => {
    if (!timeStr) return ''
    return timeStr.split('.')[0]?.replace('T', ' ') || ''
}
const formatAmount = (amount = '') => {
    return `${parseFloat(amount) ? limitDecimalPlaces(formatEther(amount)) : '0'} ETH`
}
const HistoryItem = ({ type, newList }: { type: string; newList: IHistory[] }) => {
    const { orbiterExplore, orbiterClient, isMainnet } = useCollectorContext()
    const { getChainsConfig } = useOrbiterGetChainsConfig()
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const isLoadingMoreRef = useRef(false)
    const { getExploretransactionLink } = useExploreLink()
    const scrollContainerRef = useRef(null)
    const pageRef = useRef(1)
    const hasMoreRef = useRef(true)
    const [list, setList] = useState<IHistory[]>([])
    const [total, setTotal] = useState<number>()
    const { address } = useWallet()
    const { openLink } = useOpenLink()
    const getHistory = useCallback(
        (page: number = 1) => {
            setIsLoadingMore(true)
            const fn = type === 'maker' ? fetchMakerHistory : fetchHistory
            fn(isMainnet, { address, pageSize: 20, page }).then((res) => {
                if (res.code === 0) {
                    setTotal(res.result.count)
                    if (page >= pageRef.current) {
                        hasMoreRef.current = res.result.count > page * 20
                        pageRef.current = page + 1
                        setList((pre) => {
                            return [
                                ...pre,
                                ...res.result.list.filter(
                                    (i: IHistory) => !pre.find((j) => j.txHash === i.txHash),
                                ),
                            ]
                        })
                    }
                } else {
                    setTotal(0)
                }
                setIsLoadingMore(false)
            })
        },
        [isMainnet, address],
    )
    useEffect(() => {
        isLoadingMoreRef.current = isLoadingMore
    }, [isLoadingMore])

    const handleScroll = () => {
        const scrollContainer = scrollContainerRef.current
        if (scrollContainer) {
            const { scrollTop, clientHeight, scrollHeight } = scrollContainer
            if (
                scrollTop + clientHeight >= scrollHeight - 100 &&
                !isLoadingMoreRef.current &&
                hasMoreRef.current
            ) {
                getHistory(pageRef.current)
            }
        }
    }

    useEffect(() => {
        if (newList.length > 0) {
            setList((pre) => {
                if (type === 'user') {
                    const _newList = newList.filter(
                        (i) => !pre.find((item) => item.txHash === i.txHash),
                    )
                    return [..._newList, ...pre]
                } else {
                    return pre.map((i) => newList.find((j) => j.id === i.id) || i)
                }
            })
        }
    }, [newList, type])

    useEffect(() => {
        getHistory(1)
        const scrollContainer = scrollContainerRef.current as unknown as HTMLDivElement
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll)
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll)
            }
        }
    }, [])

    const toExplore = useCallback((id: string, value: string) => {
        const url = getExploretransactionLink({
            chainId: id,
            value,
        })
        openLink(url)
    }, [])
    return (
        <div className="w-full overflow-x-auto mb-5">
            <div className="min-w-[54rem]">
                <div className="p-3 bg-[var(--o-color-gray-800)] rounded-xl text-left">
                    <div className="flex align-center text-tiny justify-between text-[var(--o-color-text-t3)] gap-4">
                        <span className="w-4"></span>
                        <span className="w-[10rem]">Chain</span>
                        <span className="w-[10rem]">Transfer Amount</span>
                        <span className="flex-1">Tx Hash</span>
                        <span className="w-[11rem]">Time</span>
                    </div>
                    <div ref={scrollContainerRef} className="pr-3 -mr-3 overflow-y-auto h-[13rem]">
                        {typeof total === 'number' ? (
                            <>
                                {list.length > 0 ? (
                                    <>
                                        {list.map((i, index) => (
                                            <div key={i?.id || index}>
                                                <div className="flex justify-between items-center o-font-500 h-11 last:mb-0 gap-4">
                                                    <span className="w-4">
                                                        <StatusIcon
                                                            status={i.status}
                                                            type={type}
                                                        ></StatusIcon>
                                                    </span>
                                                    <span className="flex gap-1 items-center w-[10rem]">
                                                        <OrbiterIcon
                                                            type="CHAIN"
                                                            iconId={i.chain}
                                                            className="!size-5"
                                                        />
                                                        {getChainsConfig(i?.chain)?.name}
                                                    </span>
                                                    <span className="w-[10rem]">
                                                        {formatAmount(i?.transferAmount)}
                                                    </span>
                                                    <span className="flex-1">
                                                        {i?.txHash ? (
                                                            <a
                                                                className="underline cursor-pointer"
                                                                onClick={() =>
                                                                    toExplore(i.chain, i.txHash)
                                                                }
                                                            >
                                                                {shortenAddress(i.txHash, 12)}
                                                            </a>
                                                        ) : (
                                                            '--'
                                                        )}
                                                    </span>
                                                    <span className="w-[11rem]">
                                                        {getTime(i?.time) || '--'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {isLoadingMore && (
                                            <div className="text-center">Loading more data...</div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full flex justify-center items-center h-full">
                                        <img src={NoDataPng} className="w-40 h-40" />
                                    </div>

                                    // <div className="flex justify-center items-center h-full">No data</div>
                                )}
                            </>
                        ) : (
                            <>
                                <ProgressSkeleton />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const History = ({
    show,
    setShow,
    newMakerList,
    newUserList,
    // collectInfo,
    // isLoading,
}: {
    // isLoading: boolean
    show: boolean
    setShow: (show: boolean) => void
    newMakerList: IHistory[]
    newUserList: IHistory[]
    // collectInfo?: ICollectInfo
}) => {
    const [isLoading, setIsLoading] = useState(true)
    const { orbiterExplore, orbiterFeeEstimator, orbiterClient, isMainnet } = useCollectorContext()
    const { address, wallet } = useWallet()
    const [collectInfo, setCollectInfo] = useState<ICollectInfo | undefined>(undefined)

    const getInfo = async () => {
        setIsLoading(true)
        try {
            const res = await fetchCollectInfo(isMainnet, { address })
            if (res.code === 0) {
                setCollectInfo(res.result)
            }
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        if (orbiterClient && show) {
            getInfo()
        }
    }, [orbiterClient, address, show])

    return (
        <Modal
            show={show}
            headerLabel={'History'}
            containerClassName="bg-[var(--o-color-gray-900)] w-full max-w-[62rem]"
            onShowChange={setShow}
        >
            <div className="flex mt-2 relative gap-4  items-center p-4 bg-[var(--o-color-gray-800)] rounded-xl mb-5">
                <div className="text-center flex-1">
                    <p className="text-[var(--o-color-text-t3)]">Total Amount (User to Maker)</p>
                    <p className="o-font-600 text-lg mt-0.5">
                        {isLoading ? (
                            <ProgressSkeleton className="h-7" />
                        ) : (
                            <>{formatAmount(collectInfo?.collectValue?.userToMaker)}</>
                        )}
                    </p>
                </div>
                <div className=" w-[2px] bg-[var(--o-color-gray-600)] absolute top-4 bottom-4 left-1/2"></div>
                <div className="text-center flex-1">
                    <p className="text-[var(--o-color-text-t3)]">Total Amount (Maker to User)</p>
                    <p className="o-font-600 text-lg mt-0.5">
                        {isLoading ? (
                            <ProgressSkeleton className="h-7" />
                        ) : (
                            <>{formatAmount(collectInfo?.collectValue?.makerToUser)}</>
                        )}
                    </p>
                </div>
            </div>
            <p className="o-font-600 mb-2">User Transactions</p>
            <HistoryItem type="user" newList={newUserList}></HistoryItem>
            <p className="o-font-600 mb-2">Maker Transactions</p>
            <HistoryItem type="maker" newList={newMakerList}></HistoryItem>
        </Modal>
    )
}
