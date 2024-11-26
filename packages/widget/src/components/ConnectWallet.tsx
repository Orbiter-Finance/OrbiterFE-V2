import { useAtomValue } from 'jotai'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import block from "ethereum-blockies"
import { Copy, XIcon } from 'lucide-react'
import { useCopyGroup } from '../hooks/useCopyGroup.js'
import { useCurrentWallet } from '../hooks/useCurrentWallet.js'
import { pageIsMobileAtom } from '../stores/bridge.js'
import { shortenAddress } from '../utils/shortenAddress.js'
import { OrbiterIcon, OrbiterModal, OrbiterShow } from '@orbiter-finance/ui'
import { useWallets } from '@orbiter-finance/wallet-management'
import useBridgeLogEvent from '../hooks/useBridgeLogEvent.js'

export function ConnectWallet() {
    const wallet = useCurrentWallet()
    const pageIsMobile = useAtomValue(pageIsMobileAtom)
    const { bridgeLogEvent, BRIDGE_EVENT } = useBridgeLogEvent()
    const wallets = useWallets()
    const { handleCopy } = useCopyGroup()

    const canvasRef = useRef<HTMLDivElement>(null)

    const [show, setShow] = useState(false)

    useEffect(() => {
        if (canvasRef.current && wallet?.address) {
            canvasRef.current.innerHTML = ''
            const icon = block.create({ // All options are optional
                seed: wallet.address.toLocaleLowerCase(), // seed used to generate icon data, default: random
                color: '#FF5C5C', // to manually specify the icon color, default: random
                // bgcolor: '#aaa', // choose a different background color, default: random
                size: 6, // width/height of the icon in blocks, default: 8
                scale: 3, // width/height of each block in pixels, default: 4
                spotcolor: '#1A1A1A' // each pixel has a 13% chance of being of a third color, 
                // default: random. Set to -1 to disable it. These "spots" create structures
                // that look like eyes, mouths and noses. 
            })
            canvasRef.current.appendChild(icon)
        }
    }, [wallet?.address, canvasRef])

    const walletList = useMemo(() =>
        wallets.filter((item) => item?.address).concat(
            wallets.filter((item) => !item?.address)
        )
        , [wallets])

    return (
        <>
            <OrbiterShow
                when={!!wallet?.address}
                fallback={
                    <button className='bg-[var(--o-color-brand-900)] cursor-pointer px-4 py-2 rounded-xl text-[var(--o-color-brand-500)] o-font-500'
                        onClick={async (event) => {
                            event.stopPropagation()
                            if (!wallet?.address) {
                                wallet?.connect()
                                bridgeLogEvent(BRIDGE_EVENT.connectWallet, wallet?.type || "")
                            }
                        }}
                    >
                        Connect Wallet
                    </button>
                }
            >

                <button
                    className='flex justify-center items-center o-font-500 px-4 py-2 bg-[var(--o-color-gray-800)] rounded-xl'
                    onClick={(event) => {
                        event.stopPropagation()
                        setShow(true)
                    }}
                >
                    <div ref={canvasRef} className='flex justify-center items-center w-6 h-6 mr-2 rounded-full overflow-hidden'>

                    </div>

                    {wallet?.address && shortenAddress(wallet?.address)}
                </button>

            </OrbiterShow>
            <OrbiterShow
                when={pageIsMobile}
                fallback={
                    <OrbiterShow when={show}>
                        <div className='fixed top-4 right-4 w-[24.5rem] z-[var(--modal-z-index)] bg-[var(--o-color-gray-600)] rounded-xl border-[var(--o-color-gray-900)] p-4'>
                            <div className='flex justify-between items-center w-full'>
                                <div className="o-font-500">My Wallets</div>
                                <div className='cursor-pointer w-6 h-6' onClick={(event) => {
                                    event.stopPropagation()
                                    setShow(false)
                                }}><XIcon /></div>
                            </div>
                            <div className='mt-3'>
                                {
                                    walletList.map((item) => {
                                        return <div className='w-full mt-3' key={item.type}>
                                            <div className='rounded-2xl bg-[var(--o-color-gray-900)] p-3'>
                                                <div className='w-full flex justify-between items-center'>
                                                    <div className='flex justify-start'>
                                                        <OrbiterShow
                                                            when={!!item.walletIcon}
                                                        >
                                                            <img src={item.walletIcon} width={40} height={40} className='w-10 h-10 mr-2' alt="" />
                                                        </OrbiterShow>
                                                        <div>
                                                            <div onClick={(event) => {
                                                                event.stopPropagation()
                                                                if (item?.address) {
                                                                    handleCopy(item.address)
                                                                }
                                                            }}>{shortenAddress(item?.address || "")}</div>
                                                            <div>{item.walletName}</div>
                                                        </div>
                                                    </div>

                                                    <svg onClick={async (event) => {
                                                        event.stopPropagation()
                                                        await item.disConnectAsync()
                                                    }} className='cursor-pointer' width="24.000000" height="24.000000" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                        <defs>
                                                            <clipPath id="clip2748_1392">
                                                                <rect id="ic/Disconnect" width="24.000000" height="24.000000" fill="white" fillOpacity="0" />
                                                            </clipPath>
                                                        </defs>
                                                        <g clipPath="url(#clip2748_1392)">
                                                            <path id="trails" d="M14.58 8.26C14.32 5.23 12.77 4 9.36 4L9.26 4C5.5 4 4 5.5 4 9.26L4 14.73C4 18.49 5.5 20 9.26 20L9.36 20C12.74 20 14.3 18.78 14.58 15.8" stroke="#545454" strokeOpacity="1.000000" strokeWidth="1.000000" strokeLinejoin="round" strokeLinecap="round" />
                                                            <path id="trails" d="M9.46 11.99L19.02 11.99" stroke="#545454" strokeOpacity="1.000000" strokeWidth="1.000000" strokeLinejoin="round" strokeLinecap="round" />
                                                            <path id="trails" d="M17.15 9.17L19.96 11.99L17.15 14.8" stroke="#545454" strokeOpacity="1.000000" strokeWidth="1.000000" strokeLinejoin="round" strokeLinecap="round" />
                                                        </g>
                                                    </svg>

                                                </div>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </OrbiterShow>
                }
            >
                <OrbiterModal
                    show={show}
                    headerLabel={"Wallet"}
                    containerClassName='bg-[var(--o-color-gray-800)]'
                    onShowChange={(open) => {
                        setShow(open)
                    }}
                >
                    <div className='w-full h-full max-h-full overflow-auto'>
                        {
                            walletList.map((item) => {
                                return <OrbiterShow
                                    when={!!item?.address}
                                    key={item.type}
                                    fallback={
                                        <div onClick={async (event) => {
                                            event.stopPropagation()
                                            setShow(false)
                                            await item.connect()
                                        }} className='w-full flex mt-2 p-3 rounded-xl justify-center items-center bg-[var(--o-color-gray-900)]'>
                                            <div className='w-full flex justify-start items-center whitespace-nowrap'>
                                                <OrbiterShow
                                                    when={!!item.defaultChain}
                                                >
                                                    <OrbiterIcon type='CHAIN' iconId={item?.defaultChain} className='mr-1.5' />
                                                </OrbiterShow>
                                                <span>
                                                    {
                                                        item?.type
                                                    } Wallet
                                                </span>
                                            </div>
                                            <div className='flex justify-center items-center'>
                                                <button onClick={(event) => {

                                                }} className='w-20 h-8 rounded-lg cursor-pointer text-[var(--o-color-brand-500)] bg-[var(--o-color-brand-900)] text-sm flex justify-center items-center o-font-500'>
                                                    Connect
                                                </button>
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className="w-full flex justify-center items-center">
                                        <div className='w-full mt-2 bg-[var(--o-color-gray-900)] p-3 rounded-xl flex justify-between items-center'>
                                            <div>
                                                <div className='flex justify-start items-center whitespace-nowrap'>
                                                    {shortenAddress(item.address)}

                                                    <div onClick={(event) => {
                                                        event.stopPropagation()
                                                        handleCopy(item.address)
                                                    }} className='flex justify-center items-center w-4 h-4 cursor-pointer ml-1.5'>
                                                        <Copy className='w-6 h-6' stroke='var(--o-color-gray-200)' />
                                                    </div>
                                                </div>
                                                <div className='flex justify-start items-center'>
                                                    <div className='bg-[var(--o-color-gray-800)] text-[var(--o-color-gray-400)] px-1.5 py-0.5 text-xs rounded-md mr-2'>
                                                        {item.type}
                                                    </div>
                                                    <div className='bg-[var(--o-color-gray-800)] text-[var(--o-color-gray-400)] px-1.5 py-0.5 text-xs rounded-md'>
                                                        {item.walletName}
                                                    </div>
                                                </div>
                                            </div>
                                            <svg onClick={async (event) => {
                                                event.stopPropagation()
                                                await item.disConnectAsync()
                                            }} className='cursor-pointer' width="24.000000" height="24.000000" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                                <defs>
                                                    <clipPath id="clip2748_1392">
                                                        <rect id="ic/Disconnect" width="24.000000" height="24.000000" fill="white" fillOpacity="0" />
                                                    </clipPath>
                                                </defs>
                                                <g clipPath="url(#clip2748_1392)">
                                                    <path id="trails" d="M14.58 8.26C14.32 5.23 12.77 4 9.36 4L9.26 4C5.5 4 4 5.5 4 9.26L4 14.73C4 18.49 5.5 20 9.26 20L9.36 20C12.74 20 14.3 18.78 14.58 15.8" stroke="#545454" strokeOpacity="1.000000" strokeWidth="1.000000" strokeLinejoin="round" strokeLinecap="round" />
                                                    <path id="trails" d="M9.46 11.99L19.02 11.99" stroke="#545454" strokeOpacity="1.000000" strokeWidth="1.000000" strokeLinejoin="round" strokeLinecap="round" />
                                                    <path id="trails" d="M17.15 9.17L19.96 11.99L17.15 14.8" stroke="#545454" strokeOpacity="1.000000" strokeWidth="1.000000" strokeLinejoin="round" strokeLinecap="round" />
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                </OrbiterShow>
                            })
                        }
                    </div>
                </OrbiterModal>

            </OrbiterShow>
        </>
    )
}
