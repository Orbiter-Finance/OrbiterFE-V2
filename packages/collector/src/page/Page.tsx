import React, {
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import {
    CardGroup,
    OrbiterCard,
    OrbiterHeader,
    OrbiterIcon,
    OrbiterModal,
    OrbiterSelect,
    ProgressSkeleton,
} from '@orbiter-finance/ui'
import { ChevronDown, CircleHelpIcon, FileTextIcon, RefreshCw } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import {
    fetchCollect,
    fetchCollectInfo,
    fetchHistory,
    fetchMakerHistory,
    ICollectInfo,
    IHistory,
    SourceChain,
} from '../services'
import { BalanceQueryService } from '@orbiter-finance/wallet-balance'
import { useCollectorContext } from './BridgePage'
import { useBalance } from '../hooks/useBalance'
import { useOrbiterGetChainsConfig } from '../hooks/useOrbiterGetChainsConfig'
import { useWallets } from '@orbiter-finance/wallet-management'
import { useWallet } from '../hooks/useWallet'
import { OPointIcon, StatusIcon } from '../components/icons'
import { shortenAddress, limitDecimalPlaces } from '../utils'
import { useExploreLink } from '../hooks/useExploreLink'
import { orbiterWagmi } from '@orbiter-finance/wallet-management'
import { formatEther, Interface, parseEther, parseUnits } from 'ethers'
import { History } from '../components/History'
import { useOrbiterToast } from '../hooks/useOrbiterToast'
import { BigNumber } from 'bignumber.js'
import { Button } from '../components/Button'
import { useHistoryWatch } from '../hooks/useHistoryWatch'
import { ERC20_ABI } from 'src/consts'
const GasMultiplier = 2
interface INetwork extends SourceChain {
    name: string
    balance?: string
    realBalance?: string
}
const Tip = ({
    label,
    value,
    isLoading,
}: {
    label: ReactNode
    value: ReactNode
    isLoading?: boolean
}) => (
    <p className="flex justify-between items-center mb-2 last:mb-0">
        <span className="text-[var(--o-color-text-t3)]">{label}</span>
        <span className="o-font-500">
            {isLoading ? (
                <span className="w-32 h-4 inline-block">
                    <ProgressSkeleton />
                </span>
            ) : (
                value
            )}
        </span>
    </p>
)

export function Page() {
    const [showHistory, setShowHistory] = useState(false)
    const { address, wallet } = useWallet()
    const { orbiterExplore, orbiterFeeEstimator, orbiterClient, isMainnet } = useCollectorContext()
    const [selectItem, setSelectItem] = useState('')
    const [collectInfo, setCollectInfo] = useState<ICollectInfo | undefined>(undefined)
    const getBalance = useBalance()
    const { getChainsConfig } = useOrbiterGetChainsConfig()
    const { signMessageAsync } = orbiterWagmi.useSignMessage()
    const [collectLoading, setCollectLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [networkList, setNetworkList] = useState<INetwork[]>([])
    const [isLoading, _setIsLoading] = useState(true)
    const { orbiterTotas } = useOrbiterToast()
    const { getExploretransactionLink } = useExploreLink()
    const timeRef = useRef<any>()

    const getBalanceByChainId = async (chainId: string, address: string) => {
        return getBalance(chainId, address, 'ETH')
            .then((balance) => {
                if (Number(balance) > 0) {
                    return orbiterFeeEstimator
                        ?.getFeeEstimateForFake(chainId)
                        .then((estimate) => {
                            const fee = BigNumber(estimate?.fee || 0).multipliedBy(GasMultiplier)
                            return {
                                realBalance: balance,
                                balance:
                                    estimate?.feeToken === 'ETH'
                                        ? BigNumber(balance).minus(fee).toString()
                                        : balance,
                            }
                        })
                        .catch(() => ({
                            realBalance: balance,
                            balance,
                        }))
                }
                return {
                    realBalance: balance,
                    balance,
                }
            })
            .catch((err) => {
                return {
                    realBalance: 0,
                    balance: 0,
                }
            })
    }

    const getInfo = async (showLoading?: boolean) => {
        clearTimeout(timeRef.current)
        const setIsLoading = (value: boolean) => {
            if (showLoading) {
                _setIsLoading(value)
            }
        }
        setIsLoading(true)
        try {
            const res = await fetchCollectInfo(isMainnet, { address })
            if (res.code === 0) {
                const { sourceChains, targetChains } = res.result
                setCollectInfo(res.result)
                if (!selectItem && targetChains.length) {
                    setSelectItem(targetChains[0].chainId)
                }
                const networkList = sourceChains
                if (!address) {
                    setNetworkList(
                        networkList.map((i: INetwork) => ({
                            ...i,
                            name: getChainsConfig(i.chainId)?.name || '',
                            balance: 0,
                        })),
                    )
                    setIsLoading(false)
                }
                showLoading
                    ? setNetworkList(networkList)
                    : setNetworkList((pre) =>
                        networkList.map((network: INetwork) => ({
                            ...network,
                            ...(pre.find((i) => i.chainId === network.chainId) || {}),
                        })),
                    )
                networkList.forEach((network: INetwork) => {
                    const { maxPrice, minPrice, chainId } = network
                    getBalanceByChainId(chainId, address).then((balanceItem) => {
                        let balance = balanceItem?.balance || 0
                        if (balance > maxPrice) {
                            balance = maxPrice
                        }
                        if (balance < minPrice) {
                            balance = 0
                        }
                        setNetworkList((pre) =>
                            pre.map((i: INetwork) => {
                                if (i.chainId === chainId) {
                                    return {
                                        ...i,
                                        realBalance: balanceItem?.realBalance.toString(),
                                        balance: balance.toString(),
                                        name: getChainsConfig(chainId)?.name || '',
                                    }
                                }
                                return i
                            }),
                        )
                    })
                })
                setIsLoading(false)
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
        } finally {
            timeRef.current = setTimeout(() => getInfo(), 1000 * 30)
        }
    }
    const { setHashList, setIdList, newMakerList, newUserList } = useHistoryWatch({
        refresh: getInfo,
    })

    useEffect(() => {
        if (orbiterClient) {
            getInfo(true)
        }
    }, [orbiterClient, address])

    const handleShowSelect = useCallback(() => {
        setShow(true)
    }, [])
    const onSelect = (select: { itemKey: string }) => {
        setSelectItem(select.itemKey)
        setShow(false)
    }

    const getEstimate = async (chainId: string) => {
        try {
            return await orbiterFeeEstimator?.getFeeEstimateForFake(chainId, true)
        } catch (error) {
            return {
                fee: '0',
                feeToken: 'ETH',
            }
        }
    }

    const handleSend = async (sourceChain: INetwork) => {
        try {
            if (!sourceChain || !sourceChain.balance || !sourceChain.realBalance || !wallet) return
            if (!wallet.checkChain(sourceChain.chainId)) {
                await wallet.switchChain(sourceChain.chainId)
            }
            const estimate = await getEstimate(sourceChain.chainId)
            const fee = BigNumber(estimate?.fee || 0).multipliedBy(GasMultiplier)
            const chainInfo = getChainsConfig(sourceChain.chainId)
            const balance =
                estimate?.feeToken === 'ETH'
                    ? BigNumber(sourceChain.realBalance || 0).minus(fee)
                    : BigNumber(sourceChain.realBalance || 0)
            const value = balance.lt(sourceChain.maxPrice)
                ? parseUnits(balance.toString(), sourceChain.decimal)
                : parseUnits(sourceChain.maxPrice, sourceChain.decimal)
            console.log('send value', value, sourceChain, estimate)
            let data = {}
            if (chainInfo.nativeCurrency.symbol === sourceChain.symbol) {
                data = {
                    params: {
                        from: address,
                        to: sourceChain.makerAddress,
                        value,
                        data: `0x`,
                    },
                }
            } else {
                const _interface = new Interface(ERC20_ABI)
                const callData = _interface.encodeFunctionData('transfer', [
                    sourceChain.makerAddress,
                    value,
                ])
                data = {
                    params: {
                        from: address,
                        to: sourceChain.tokenAddress,
                        value: '0',
                        data: callData,
                    },
                }
            }
            const hash = await wallet.transfer(data)
            if (hash) {
                orbiterTotas.sucess({
                    title: 'Transaction Confirmed',
                    viceTitle: `${limitDecimalPlaces(sourceChain.balance)} ETH sent on ${sourceChain.name}`,
                    linkLabel: 'View Transaction',
                    link: getExploretransactionLink({
                        chainId: sourceChain.chainId,
                        value: hash,
                    }),
                })
                setHashList((pre) => [
                    ...pre,
                    { hash, chainId: sourceChain.chainId, value: value.toString() },
                ])
            }
        } catch (error) { }
    }
    const targetList = useMemo(() => {
        return (
            collectInfo?.targetChains?.map((i) => {
                return {
                    itemKey: i.chainId,
                    itemName: getChainsConfig(i.chainId)?.name || '',
                    label: getChainsConfig(i.chainId)?.name || '',
                    disabled: false,
                    icon: <OrbiterIcon className="w-7 h-7" iconId={i.chainId} type="CHAIN" />,
                    active: selectItem === i.chainId,
                    activityClassName:
                        'bg-[var(--o-color-gray-900)] border border-[var(--o-color-brand-500)] rounded-xl',
                    className: 'px-3 py-2',
                }
            }) || []
        )
    }, [collectInfo, selectItem])

    const currentTarget = useMemo(() => {
        if (collectInfo?.targetChains.length) {
            return (
                collectInfo.targetChains.find((i) => i.chainId === selectItem) ||
                collectInfo.targetChains[0]
            )
        }
        return undefined
    }, [collectInfo, selectItem])

    const collectShowInfo = useMemo(() => {
        if (!address || !collectInfo || isLoading) {
            return {
                total: `-- ETH`,
                receive: `-- ETH`,
                fee: `-- ETH`,
                address: '--',
                oPoints: '--',
                tradeFee: '--',
                withholdingFee: '--',
                canCollect: false,
            }
        }
        const amount = Number(formatEther(collectInfo?.collectValue?.toCollect || 0))
        const range = currentTarget?.tieredFee.find(
            (i) => amount <= i.range[1] && amount > i.range[0],
        )
        let fee = 0
        if (range) {
            fee = (amount * range.tradeFee) / 100 + range.withholdingFee
        }

        return {
            total: `${limitDecimalPlaces(amount)} ETH`,
            receive: `≈${limitDecimalPlaces(amount - fee)} ETH`,
            fee: `${limitDecimalPlaces(fee)} ETH`,
            address: shortenAddress(address, 4),
            oPoints: `+${currentTarget?.point || 3} O-Points`,
            tradeFee: `${range?.tradeFee || 0}%`,
            withholdingFee: `${range?.withholdingFee || 0} ETH`,
            canCollect: fee > 0,
        }
    }, [currentTarget, collectInfo, address, isLoading])

    const handleCollect = useCallback(async () => {
        try {
            setCollectLoading(true)
            const timestamp = new Date().getTime()
            const message = `Sign to initiate a collection, supported by Orbiter Protocol: ${timestamp}`
            const token = await signMessageAsync({
                message,
                account: address as `0x${string}`,
            })
            const res = await fetchCollect(isMainnet, {
                targetChain: selectItem,
                token,
                timestamp,
            })
            if (res.code === 0) {
                orbiterTotas.clock({
                    title: 'Collecting... ',
                    viceTitle: `Please wait for your refund.`,
                })
                res.id && setIdList((pre) => [...pre, res.id])
                getInfo()
            } else {
                orbiterTotas.error({
                    title: res.message || 'Collect Fail',
                })
            }
        } catch (error) {
        } finally {
            setCollectLoading(false)
        }
    }, [collectShowInfo, isMainnet, address])

    const showConnect = () => {
        wallet?.connect()
    }

    const totalCollect = useMemo(() => {
        return limitDecimalPlaces(
            networkList
                .reduce((sum: BigNumber, i: INetwork) => {
                    return sum.plus(i?.balance || 0)
                }, BigNumber(0))
                .toString(),
        )
    }, [networkList])

    // const isLoading = useMemo(() => {
    //     return isLoading && networkList.length === 0
    // }, [isLoading, networkList])
    return (
        <>
            <div className="w-full sm:mt-12">
                <CardGroup>
                    <>
                        <OrbiterHeader
                            className="o-font-500 text-xl"
                            logo={'Orbiter Small Coin Collector'}
                            tools={
                                <div
                                    className="flex w-9 h-9 justify-center items-center bg-[var(--o-color-gray-800)] hover:bg-[var(--o-color-gray-700)] p-1.5 rounded-xl cursor-pointer"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        setShowHistory(true)
                                    }}
                                >
                                    <FileTextIcon />
                                </div>
                            }
                        />

                        <div className="px-3 pb-5">
                            <>
                                <p className="-mt-1 mb-3 text-[var(--o-color-text-t3)]">
                                    You Have a Maximum of{' '}
                                    <span className="o-font-500 text-[var(--o-color-brand-500)] ">
                                        {totalCollect}
                                    </span>{' '}
                                    ETH to Collect.
                                </p>
                                <OrbiterCard
                                    className="text-sm  rounded-2xl mb-1 bg-[var(--o-color-gray-800)]"
                                    isBorder={false}
                                >
                                    <div className="flex align-center justify-between text-[var(--o-color-text-t3)] mb-2">
                                        <span className="w-2/5">Networks</span>
                                        <span className="flex-1 flex items-center">
                                            The Max Collectible
                                            <div className="flex justify-end items-center relative tips-group">
                                                <CircleHelpIcon
                                                    stroke="var(--o-color-gray-400)"
                                                    className="w-4 h-4 ml-1 cursor-pointer"
                                                />
                                                <div className="absolute z-[10] top-5 left-1/2 -translate-x-1/2 tips-content hidden justify-center items-center">
                                                    <div className="bg-[var(--o-color-gray-700)] text-[var(--o-color-text-t2)] rounded-xl text-sm  w-[20rem] p-3 o-font-400 text-left">
                                                        The Max Collectible Amount is the balance
                                                        after deducting network gas fees, with an
                                                        upper limit of 0.002 ETH.
                                                    </div>
                                                </div>
                                            </div>
                                        </span>
                                        <span className="flex justify-center items-center">
                                            <i
                                                className="flex size-4 items-center cursor-pointer"
                                                onClick={() => getInfo(true)}
                                            >
                                                <RefreshCw />
                                            </i>
                                        </span>
                                    </div>
                                    <div className="max-h-[11rem] overflow-y-auto -mr-4 pr-4">
                                        {isLoading ? (
                                            <div className="h-[11rem]">
                                                <ProgressSkeleton />
                                            </div>
                                        ) : (
                                            networkList.map((i) => (
                                                <div className="flex justify-between items-center o-font-500 h-10 mb-2 last:mb-0">
                                                    <span className="flex gap-2 items-center  w-2/5">
                                                        <OrbiterIcon
                                                            type="CHAIN"
                                                            iconId={i.chainId}
                                                        />
                                                        {i?.name ? (
                                                            <span className="flex flex-col">
                                                                {i?.name}
                                                                <span className="text-xs text-[var(--o-color-text-t3)] -mt-0.5">
                                                                    {limitDecimalPlaces(
                                                                        i?.realBalance || '0',
                                                                    )}{' '}
                                                                    ETH
                                                                </span>
                                                            </span>
                                                        ) : (
                                                            <span className="h-4 inline-block w-28">
                                                                <ProgressSkeleton />
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="flex-1 flex items-center">
                                                        {i?.name ? (
                                                            i.balance ? (
                                                                `${limitDecimalPlaces(i.balance)} ETH`
                                                            ) : (
                                                                '--'
                                                            )
                                                        ) : (
                                                            <span className="h-4 inline-block w-28">
                                                                <ProgressSkeleton />
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span>
                                                        <Button
                                                            disabled={
                                                                !(
                                                                    i?.balance &&
                                                                    Number(i?.balance) > 0
                                                                )
                                                            }
                                                            size="small"
                                                            onClick={async () =>
                                                                await handleSend(i)
                                                            }
                                                        >
                                                            Send
                                                        </Button>
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </OrbiterCard>
                                <OrbiterCard
                                    className="text-sm mb-3 rounded-2xl bg-[var(--o-color-gray-800)]"
                                    isBorder={false}
                                >
                                    <Tip
                                        label={'Maker Amount Due'}
                                        value={collectShowInfo.total}
                                        isLoading={isLoading}
                                    ></Tip>
                                    <Tip
                                        isLoading={isLoading}
                                        label={'Collect on'}
                                        value={
                                            <span
                                                className="rounded-md h-8 px-2  bg-[var(--o-color-gray-900)] flex justify-center items-center gap-1 cursor-pointer"
                                                onClick={handleShowSelect}
                                            >
                                                <OrbiterIcon
                                                    type="CHAIN"
                                                    iconId={selectItem}
                                                    className="size-5"
                                                />
                                                {getChainsConfig(selectItem)?.name || ''}
                                                <i className="flex size-4 items-center cursor-pointer">
                                                    <ChevronDown />
                                                </i>
                                            </span>
                                        }
                                    ></Tip>
                                    <Tip
                                        isLoading={isLoading}
                                        label={'You will receive'}
                                        value={collectShowInfo.receive}
                                    ></Tip>
                                    <div className="border-t mb-2 border-dashed border-[var(--o-color-gray-600)]"></div>
                                    <Tip
                                        isLoading={isLoading}
                                        label={'Service Fees'}
                                        value={
                                            <label className="flex items-center">
                                                {collectShowInfo.fee}
                                                <div className="flex justify-end items-center relative tips-group">
                                                    <CircleHelpIcon
                                                        stroke="var(--o-color-gray-400)"
                                                        className="w-4 h-4 ml-1 cursor-pointer"
                                                    />
                                                    <div className="absolute z-[10] right-5 top-1/2 -translate-y-1/2 tips-content hidden justify-center items-center">
                                                        <div className="bg-[var(--o-color-gray-700)] text-[var(--o-color-text-t2)] rounded-xl text-sm  w-[20rem] p-3 o-font-400 text-left">
                                                            <Tip
                                                                label={'Slippage'}
                                                                value={collectShowInfo.tradeFee}
                                                            />
                                                            <Tip
                                                                label={'Protocol Fee'}
                                                                value={
                                                                    collectShowInfo.withholdingFee
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        }
                                    ></Tip>
                                    <Tip
                                        isLoading={isLoading}
                                        label={'Recipient Address'}
                                        value={collectShowInfo.address}
                                    ></Tip>
                                    <Tip
                                        label={
                                            <label className="flex gap-0.5">
                                                <OPointIcon />
                                                Rewards O-Points
                                            </label>
                                        }
                                        isLoading={isLoading}
                                        value={
                                            <label className="text-[var(--o-color-brand-500)]">
                                                {collectShowInfo.oPoints}
                                            </label>
                                        }
                                    ></Tip>
                                </OrbiterCard>
                            </>

                            {address ? (
                                <Button
                                    disabled={
                                        !collectShowInfo.canCollect || isLoading || collectLoading
                                    }
                                    onClick={handleCollect}
                                >
                                    Collect Now
                                </Button>
                            ) : (
                                <Button onClick={showConnect} size="connect">
                                    Connect Wallet
                                </Button>
                            )}
                        </div>
                    </>
                </CardGroup>
            </div>
            <History
                show={showHistory}
                setShow={setShowHistory}
                newMakerList={newMakerList}
                newUserList={newUserList}
            />
            <OrbiterModal
                show={show}
                onShowChange={setShow}
                headerLabel=""
                containerClassName="min-h-96 pb-4"
            >
                <div className="w-full max-h-full overflow-auto">
                    <OrbiterSelect onSelectChange={onSelect} className="flex-1" list={targetList} />
                </div>
            </OrbiterModal>
        </>
    )
}
