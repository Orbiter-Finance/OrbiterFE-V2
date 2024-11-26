

;
import React, { Fragment, useCallback, useContext, useMemo, useState } from 'react'
import { ArrowDown, ChevronDownIcon, CircleDollarSignIcon, Clock, FileTextIcon, Loader, SquarePenIcon, Wallet, WalletIcon } from "lucide-react"
import { useAtom, useAtomValue, useSetAtom } from 'jotai'

import { BridgeInfoContext } from '../bridgeInfo/providers.js'
import { BridgeTargetAddress } from '../components/BridgeTargetAddress.js'
import { BridgeTransferAmount } from '../components/BridgeTransferAmount.js'
import { SendButton } from '../components/SendButton.js'
import { PAGE_TYPE } from '../constant.js'
import { useBridgeRouter } from '../hooks/useBridgeRouter.js'
import { usePageTypeUpdate } from '../hooks/usePageTypeUpdate.js'
import { useTargetAddress } from '../hooks/useTargetAddress.js'
import { BridgeIcon } from '../icon/BridgeIcon.js'
import { OPointIcon } from '../icon/OPointIcon.js'
import { ReceivedIcon } from '../icon/ReceivedIcon.js'
import { selectFromChainAtom, selectToChainAtom, selectTokenAtom, pageIsMobileAtom, bridgeCurrentChainBalanceAtom, showBridgeTargetAddressCardAtom, bridgetTransferAmountAtom, bridgeRouterGasFeeGroupAtom } from '../stores/bridge.js'
import { cn } from '../utils/cn.js'
import { decimalNum } from '../utils/decimalNum.js'
import { shortenAddress } from '../utils/shortenAddress.js'
import SelectToken from '../components/SelectToken.js'
import SelectChain from '../components/SelectChain.js'
import { CardGroup, CardHeader, OrbiterCard, OrbiterShow, OrbiterTag } from '@orbiter-finance/ui'
import useSwitchChainFillAddress from '../hooks/useSwitchChainFillAddress.js'
import { useWallet } from '../hooks/useWallet.js'
import { useRouterGasFee } from '../hooks/useRouterGasFee.js'
import { useBalance } from '../hooks/useBalance.js'
import { formatEther, formatUnits, parseEther, parseUnits } from 'viem'


export function Bridge() {

    const { orbiterClient, isTelegram, isMainnet } = useContext(BridgeInfoContext)
    const { getWallet } = useWallet()

    const [selectFromChain, setSelectFromChain] = useAtom(selectFromChainAtom)
    const [selectToChain, setSelectToChain] = useAtom(selectToChainAtom)
    const selectToken = useAtomValue(selectTokenAtom)

    const { getRouterGasFee } = useRouterGasFee()
    const { getCurrentBalance } = useBalance()
    const { simulationAmount, srcToken, bridgetTransferAmount, basePoint, withholdingFee, tradeFee, max, min, dstToken, TransactionRouter } = useBridgeRouter()

    const [fromBalance] = useAtomValue(bridgeCurrentChainBalanceAtom)
    const { balance, pending } = fromBalance || {
        balance: "0",
        pending: false,
        error: false,
        chainId: ""
    }
    const { pending: gasPending } = useAtomValue(bridgeRouterGasFeeGroupAtom)
    const [showBridgeTargetAddressCard, setShowBridgeTargetAddressCard] = useAtom(showBridgeTargetAddressCardAtom)

    const { updatePageModalType } = usePageTypeUpdate()
    const { targetAddress } = useTargetAddress()
    const pageIsMobile = useAtomValue(pageIsMobileAtom)
    const [expend, setExpend] = useState(false)

    const { switchChainFillAddress } = useSwitchChainFillAddress()

    const checkChangeChain = useMemo(() => {
        const list = (orbiterClient?.getAvailableTradePairs(selectToChain, selectToken) || [])
        return list.some((item) => item.dstChainId === selectFromChain)

    }, [orbiterClient, selectToChain, selectToken, selectFromChain])

    const toWallet = useMemo(() => getWallet(selectToChain), [getWallet, selectToChain])

    const setBridgetTransferAmount = useSetAtom(bridgetTransferAmountAtom)

    const maxCall = useCallback(
        async () => {
            const decimals = Number(srcToken?.decimals) > Number(dstToken?.decimals) ? dstToken?.decimals : srcToken?.decimals
            const res = await getRouterGasFee()
            const balance = await getCurrentBalance()
            const gasFee = parseEther(res || "0")
            const fee = parseEther(withholdingFee || "0") + parseUnits((TransactionRouter?.vc || "0"), 0) + gasFee
            const userBalance = parseEther(balance?.[0] || "0")

            const userMax = userBalance > fee ? formatEther((userBalance - fee)) : (min || "0")

            const decimal = Number(decimals) >= 8 ? 6 : (Number(decimals) - 2)

            let bridgeAmount = "0"

            if (parseEther(userMax) >= parseEther((String(max || "0")))) {
                setBridgetTransferAmount(max || "0")
            } else {
                setBridgetTransferAmount(
                    formatUnits(
                        parseUnits(String(
                            Math.floor(Number(parseUnits(decimalNum(
                                userMax, decimal
                            ), decimal))) || 0
                        ), 0),
                        decimal
                    )
                )
            }
        },
        [getRouterGasFee, getCurrentBalance, withholdingFee, max, min, srcToken, dstToken, TransactionRouter],
    )

    return (
        <>
            <div className='w-full flex justify-center items-center mt-12'>
                <CardGroup>


                    <OrbiterCard
                        className='text-sm sm:text-base rounded-[1.21875rem]'
                        isBorder={false}
                    >
                        <CardHeader
                            left={
                                <div className='flex items-center'>
                                    <label className='pl-1 mr-2 o-font-500 text-xl'>Bridge</label>
                                    <SelectToken />
                                </div>
                            }
                            right={
                                <div className='flex w-9 h-9 justify-center items-center bg-[var(--o-color-gray-800)] hover:bg-[var(--o-color-gray-700)] p-1.5 rounded-xl cursor-pointer'
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        updatePageModalType(PAGE_TYPE.HISTORY)
                                    }}
                                >
                                    <FileTextIcon />
                                </div>
                            }
                        />
                        <OrbiterCard
                            className='p-4 mt-3 h-[6.5rem] bg-[var(--o-color-gray-800)] relative rounded-2xl'
                        >
                            <div className='w-full flex justify-between items-center'>
                                <div className='text-[var(--o-color-gray-400)] o-font-500'>From</div>
                                <div className='flex justify-end items-center'>
                                    <span className='text-[var(--o-color-gray-400)]'>Balance: {decimalNum(balance, 6)}
                                    </span>
                                    <OrbiterShow
                                        when={pending || gasPending}
                                    >
                                        <svg className='o-dash-svg w-4 h-4' viewBox="25 25 50 50">
                                            <circle className='o-dash-circle' fill='none' stroke='var(--o-color-brand-500)' r="20" cy="50" cx="50" strokeWidth="2" strokeDashoffset="0" strokeDasharray="1 200" strokeLinecap='round'></circle>
                                        </svg>
                                    </OrbiterShow>
                                    <button onClick={async (event) => {
                                        event.stopPropagation()
                                        if (!pending && !gasPending) {
                                            maxCall()
                                        }
                                    }} className='ml-1 text-[var(--o-color-brand-500)]'>Max</button>
                                </div>
                            </div>
                            <div className='w-full flex mt-1.5 justify-between items-center'>
                                <SelectChain />
                                <BridgeTransferAmount />
                            </div>
                            <div
                                onClick={(event) => {
                                    event.stopPropagation()
                                    if (checkChangeChain) {
                                        const fromChain = selectFromChain
                                        const toChain = selectToChain
                                        switchChainFillAddress(fromChain)
                                        setSelectFromChain(toChain)
                                        setSelectToChain(fromChain)
                                    }
                                }}
                                className="cursor-pointer w-10 h-10 sm:w-12 sm:h-12 sm:rounded-2xl rounded-xl bg-[var(--o-color-gray-900)] p-1 absolute bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2">
                                <div className='p-1 flex sm:rounded-xl rounded-lg bg-[var(--o-color-gray-800)] justify-center items-center'>
                                    <ArrowDown className='w-6 h-6 sm:w-8 sm:h-8' />
                                </div>
                            </div>
                        </OrbiterCard>
                        <OrbiterCard
                            className='p-4 mt-1 bg-[var(--o-color-gray-800)] rounded-2xl'
                        >
                            <div className='w-full flex justify-between items-center'>
                                <div className='text-[var(--o-color-gray-400)] o-font-500'>To</div>
                                <OrbiterShow
                                    when={!isTelegram}
                                >
                                    <OrbiterShow
                                        when={!!getWallet(selectToChain)?.address}
                                        fallback={
                                            <div
                                                className='bg-[var(--o-color-gray-700)] hover:bg-[var(--o-color-gray-600)] cursor-pointer h-6 rounded-md p-1 flex items-center justify-center text-xs'
                                                onClick={(event) => {
                                                    event.stopPropagation()
                                                    getWallet(selectToChain)?.connect()
                                                }}>
                                                <WalletIcon className='w-4 h-4' stroke='var(--o-color-gray-400)' />
                                            </div>
                                        }
                                    >
                                        <div className='flex flex-end cursor-pointer items-center' onClick={(event) => {
                                            event.stopPropagation()
                                            setShowBridgeTargetAddressCard(!showBridgeTargetAddressCard)
                                        }}>
                                            <div className='bg-[var(--o-color-gray-700)] h-5 rounded-md py-0.5 px-2 flex items-center justify-center text-xs'>
                                                {getWallet(selectToChain)?.address ? shortenAddress(getWallet(selectToChain)?.address || "") : "--"}
                                            </div>
                                            <div
                                                className={
                                                    cn('ml-1 h-5 w-5 flex justify-center items-center rounded-md',
                                                        showBridgeTargetAddressCard ? "bg-[var(--o-color-brand-500)]" : "bg-[var(--o-color-gray-700)]"
                                                    )
                                                }>
                                                <SquarePenIcon className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    </OrbiterShow>
                                </OrbiterShow>
                            </div>
                            <div className='w-full flex mt-1.5 justify-between items-center'>
                                <SelectChain isTo />
                                <div className={cn('text-2xl o-font-500',
                                    Number(bridgetTransferAmount) ? "--o-color-gray-50" : "text-[var(--o-color-gray-600)]"
                                )}>
                                    {decimalNum(simulationAmount?.receiveAmount || "0", 6)}
                                </div>
                            </div>
                            <OrbiterShow
                                when={showBridgeTargetAddressCard || !toWallet?.address || isTelegram}
                            >
                                <BridgeTargetAddress />
                            </OrbiterShow>
                        </OrbiterCard>

                        <SendButton />
                        <OrbiterCard
                            className={
                                cn('p-3 sm:p-4 mt-3', pageIsMobile ? "rounded-2xl" : "rounded-2xl")
                            }
                            isBorder
                        >
                            <div className='flex justify-between items-center'>
                                <div className='flex justify-start items-center'>
                                    <span className='text-[var(--o-color-gray-400)] text-sm'>Total Send:</span>
                                    <span className='ml-2 o-font-500'>
                                        {Number(bridgetTransferAmount) ? shortenAddress(simulationAmount?.sendAmount || "0") : "--"} {srcToken?.symbol}
                                    </span>
                                    <OrbiterTag tag='VC' className='ml-1' />
                                </div>
                                <div>
                                    <ChevronDownIcon style={{ transform: expend ? "rotate(180deg)" : "rotate(0deg)", willChange: "transform", transition: "transform 0.3s" }} className='cursor-pointer' onClick={(event) => {
                                        setExpend(!expend)
                                    }} />
                                </div>
                            </div>

                            <OrbiterShow
                                when={expend}
                                fallback={
                                    <div className='flex text-sm justify-start items-center mt-2'>
                                        <OrbiterShow
                                            when={!!Number(basePoint)}
                                        >
                                            <div className='flex justify-center items-center text-[var(--o-color-brand-500)] bg-[var(--o-color-brand-900)] py-0.5 px-2 mr-2 rounded-md o-font-500'>
                                                +{basePoint} O-Points
                                            </div>
                                        </OrbiterShow>
                                        <div className='flex justify-center items-center rounded-md o-font-500 bg-[var(--o-color-gray-700)] py-0.5 px-2'>
                                            <span className='text-[var(--o-color-gray-400)] mr-1'>Time Spend</span>{"<"} 10s
                                        </div>
                                    </div>
                                }
                            >
                                <div className='w-full'>
                                    <div className='flex justify-between items-center mt-2'>
                                        <div className='flex whitespace-nowrap justify-center items-center text-[var(--o-color-gray-400)]'>
                                            <Wallet className='w-4 h-4 mr-1' stroke='var(--o-color-gray-200)' /> Recipient address
                                        </div>
                                        <div className='o-font-500 flex justify-end items-center'
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                setShowBridgeTargetAddressCard(!showBridgeTargetAddressCard)
                                            }}>
                                            <OrbiterShow
                                                when={!!targetAddress}
                                                fallback={
                                                    "--"
                                                }
                                            >
                                                <div className='bg-[var(--o-color-gray-700)] h-5 rounded-md py-0.5 px-2 flex items-center justify-center text-xs'>
                                                    {shortenAddress(targetAddress)}
                                                </div>
                                                <div
                                                    className={
                                                        cn('ml-1 h-5 w-5 flex justify-center items-center rounded-md',
                                                            showBridgeTargetAddressCard ? "bg-[var(--o-color-brand-500)]" : "bg-[var(--o-color-gray-700)]"
                                                        )
                                                    }>
                                                    <SquarePenIcon className="w-3.5 h-3.5" />
                                                </div>
                                            </OrbiterShow>
                                        </div>
                                    </div>
                                    <div className='flex justify-between items-center mt-2'>
                                        <div className='flex whitespace-nowrap justify-center items-center text-[var(--o-color-gray-400)]'>
                                            <Clock className='w-4 h-4 mr-1' stroke='var(--o-color-gray-200)' /> Time Spend
                                        </div>
                                        <div className='o-font-500'>
                                            {"<"}10s
                                        </div>
                                    </div>
                                    <div className='flex justify-between items-center mt-2 w-full border-t border-dashed border-[var(--o-color-gray-600)]'>
                                    </div>
                                    <div className='flex justify-between items-center mt-2'>
                                        <div className='flex whitespace-nowrap justify-center items-center text-[var(--o-color-gray-400)]'>
                                            <CircleDollarSignIcon className='w-4 h-4 mr-1' stroke='var(--o-color-gray-200)' /> Withholding Fees
                                        </div>
                                        <div className='o-font-500'>
                                            {withholdingFee} {srcToken?.symbol}
                                        </div>
                                    </div>
                                    <div className='flex justify-between items-center mt-2'>
                                        <div className='flex whitespace-nowrap justify-center items-center text-[var(--o-color-gray-400)]'>
                                            <BridgeIcon className='w-4 h-4 mr-1' stroke='var(--o-color-gray-200)' /> Trading Fees
                                        </div>
                                        <div className='o-font-500'>
                                            {tradeFee} %
                                        </div>
                                    </div>
                                    <div className='flex justify-between items-center mt-2'>
                                        <div className='flex whitespace-nowrap justify-center items-center text-[var(--o-color-gray-400)]'>
                                            <ReceivedIcon className='w-4 h-4 mr-1' />You will received
                                        </div>
                                        <div className='o-font-500'>
                                            {Number(bridgetTransferAmount) ? decimalNum(simulationAmount?.receiveAmount || "0", 8) : "--"} {srcToken?.symbol}
                                        </div>
                                    </div>
                                    <OrbiterShow
                                        when={isMainnet}
                                    >
                                        <div className='flex justify-between items-center mt-2'>
                                            <div className='flex whitespace-nowrap justify-center items-center text-[var(--o-color-gray-400)]'>
                                                <OPointIcon className='w-4 h-4 mr-1' /> Rewards  O-Points
                                            </div>
                                            <div className='text-[var(--o-color-brand-500)] o-font-500'>
                                                +{basePoint} O-Points
                                            </div>
                                        </div>
                                    </OrbiterShow>
                                </div>
                            </OrbiterShow>
                        </OrbiterCard>
                    </OrbiterCard>
                </CardGroup>
            </div>
        </>

    )
}

