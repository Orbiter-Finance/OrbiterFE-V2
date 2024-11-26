"use client"

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { useCallback, useMemo, useState } from 'react'
import { OrbiterModal, OrbiterShow } from '@orbiter-finance/ui'
import { pageIsMobileAtom, pointRankShowAtom, pointRankUserAddressAtom, showSettingsAtom, showUserPointDetailsAtom } from '../../stores/bridge'
import { cn } from '../../utils/cn'
import { ChartBarBigIcon, ChevronRightIcon, ChevronUpIcon, SlidersVertical, XIcon } from 'lucide-react'
import useWalletAccount from '../../hooks/useWalletAccount'
import { useUserPointsInfo } from '../../hooks/useUserPointsInfo'
import Image from 'next/image'
import { decimalNumLine } from '../../utils/decimalNum'
import useGoogleEvent from '../../hooks/useGoogleEvent'
import { Media_LINK } from '../../app/constant'
import Link from 'next/link'
import VectorIcon from '../../icon/VectorIcon'

export default function Setting() {
    const pageIsMobile = useAtomValue(pageIsMobileAtom)
    const [show, setShow] = useAtom(showSettingsAtom)
    const { sendGoogleEvent } = useGoogleEvent()

    const { MainWalletAccountInfo } = useWalletAccount()
    const { getUserPointsInfo } = useUserPointsInfo()

    const setShowUserPointDetails = useSetAtom(showUserPointDetailsAtom)

    const setPointRankShow = useSetAtom(pointRankShowAtom)
    const setPointRankUserAddress = useSetAtom(pointRankUserAddressAtom)

    const userPointsInfo = useMemo(() => {
        return getUserPointsInfo(MainWalletAccountInfo?.address)
    }, [getUserPointsInfo, MainWalletAccountInfo?.address])

    const [extendsLanguage, setExtendsLanguage] = useState(false)

    const sendEvent = useCallback((event: string) => {
        sendGoogleEvent({
            event: 'MEDIA_' + event,
            value: '',
        })
    }, [])

    return (
        <div className='relative'>
            <div className={
                cn("w-10 h-10 ml-4 cursor-pointer p-2 bg-[var(--o-color-gray-800)] hover:bg-[var(--o-color-gray-700)] rounded-xl",
                    show ? "text-[var(--o-color-brand-500)]" : ""
                )
            }
                onClick={(event) => {
                    event.stopPropagation()
                    setShow(true)
                }}
            >
                <SlidersVertical strokeWidth={3} className='w-6 h-6' />
            </div>

            <OrbiterModal
                show={show && pageIsMobile}
                onShowChange={(open) => {
                    setShow(open)
                }}
                headerRender={
                    <></>
                }
                // containerClassName='h-[40rem] max-h-[40rem]'
                containerClassName='min-h-96 h-full'
            >

                <div className={cn("pt-4 w-full flex flex-col h-full justify-start items-center overflow-auto"
                    // "h-[40rem] max-h-[40rem]"
                )}>
                    <div className='w-full h-full'>
                        <div className='w-full py-3 px-4 bg-[var(--o-color-gray-900)] rounded-2xl'>
                            <div className='w-full flex justify-between items-center'>
                                <div className='text-2xl o-font-600 o-text-t1'>
                                    <div>{decimalNumLine(userPointsInfo?.point?.points, 2, ",")}</div>
                                    <div className='mt-1 o-text-t3 text-sm o-font-400 flex'>
                                        O-Points
                                        <div
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                setPointRankShow(true)
                                                setPointRankUserAddress(MainWalletAccountInfo?.address)
                                            }}
                                            className='ml-2 flex cursor-pointer justify-center items-center text-xs bg-[var(--o-color-brand-900)] rounded-sm py-0.5 px-1.5 text-[var(--o-color-brand-500)] o-font-500'>
                                            <Image src="/assets/icon/header/points-rank.svg" alt="rank" width={12} height={12} className='mr-1 w-3 h-3' />
                                            {decimalNumLine(userPointsInfo?.rank?.rank, 0, ",")}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-end items-start'>
                                    <Image src="/assets/image/quests/O-point-quests.png" alt="O-POINt" width={65} height={68} className='w-8 h-8' />
                                    <Image src="/assets/image/quests/O-Point.png" alt="O-POINt" width={120} height={128} className='w-16 h-16 pl-1' />
                                </div>
                            </div>
                            <div className='w-full flex justify-between items-center mt-3'>
                                <div className='flex flex-1 mr-2 o-font-500 cursor-pointer rounded-lg justify-center items-center py-2.5 bg-[var(--o-color-gray-800)] o-text-t2'
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        setShow(false)
                                        setShowUserPointDetails(true)
                                    }}
                                >
                                    <ChartBarBigIcon className='w-5 h-5 mr-1' /> Details
                                </div>
                                <div className='flex w-1/2 o-font-500 cursor-pointer rounded-lg justify-center items-center py-2.5 bg-[var(--o-color-gray-800)] o-text-t2'
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        setShow(false)
                                        setPointRankShow(true)
                                        setPointRankUserAddress(MainWalletAccountInfo?.address)
                                    }}
                                >
                                    <Image src="/assets/image/header/point-rank.png" alt="Point Rank" className='w-5 h-5 mr-1' width={20} height={20} /> Leaderboard
                                </div>
                            </div>

                        </div>
                        {/* <div onClick={(event)=>{
                            event.stopPropagation()
                            setExtendsLanguage(!extendsLanguage)
                        }} className='mt-5 w-full flex justify-between items-center'>
                            <div>Language</div>
                            <div className='flex justify-end items-center'>
                                English
                                <ChevronUpIcon className={
                                    cn('w-5 h-5 ml-1', extendsLanguage ? "" : "rotate-180")
                                } />
                            </div>
                        </div> */}
                        <OrbiterShow
                            when={extendsLanguage}
                        >
                            <div className='py-2 mt-3 bg-[var(--o-color-gray-900)] px-4'>
                                <div className='py-2 flex justify-between items-center'>
                                    <div className="o-text-t1">English</div>
                                    <VectorIcon className="w-5 h-5" />
                                </div>
                                <div className='py-2 flex justify-between items-center'>한국어</div>
                            </div>
                        </OrbiterShow>
                        <Link
                            prefetch
                            onClick={(event) => {
                                event.stopPropagation()
                                sendEvent('docs')
                            }}
                            href={Media_LINK.Docs}
                            target="_blank"
                        >
                            <div className='mt-3 w-full flex justify-between items-center cursor-pointer'>
                                <div className='o-text-t3'>DOCS</div>
                                <div className='flex justify-end items-center'>
                                    <ChevronRightIcon className='w-5 h-5 ml-1' />
                                </div>
                            </div>

                        </Link>

                        <Link
                            prefetch
                            onClick={(event) => {
                                event.stopPropagation()
                                sendEvent('brand')
                            }}
                            href={Media_LINK.Brand}
                            target="_blank"
                        >
                            <div className='mt-3 w-full flex justify-between items-center cursor-pointer'>
                                <div className='o-text-t3'>Brand Assets </div>
                                <div className='flex justify-end items-center'>
                                    <ChevronRightIcon className='w-5 h-5 ml-1' />
                                </div>
                            </div>
                        </Link>

                        <Link
                            prefetch
                            onClick={(event) => {
                                event.stopPropagation()
                                sendEvent('terms')
                            }}
                            className="hover:o-text-t2"
                            href={Media_LINK.TermOfUse}
                            target="_blank"
                        >
                            <div className='mt-3 w-full flex justify-between items-center cursor-pointer'>
                                <div className='o-text-t3'>Terms of Use</div>
                                <div className='flex justify-end items-center'>
                                    <ChevronRightIcon className='w-5 h-5 ml-1' />
                                </div>
                            </div>
                        </Link>

                    </div>

                    <div className='w-full'>
                        <div className="w-full flex justify-start items-center">
                            <Link
                                onClick={(event) => {
                                    event.stopPropagation()
                                    sendEvent('teitter')
                                }}
                                className="hover:o-text-t2"
                                href={Media_LINK.Twitter}
                                target="_blank"
                            >
                                <svg
                                    className="w-8 h-8 cursor-pointer"
                                    width="32.000000"
                                    height="32.000000"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <defs>
                                        <clipPath id="clip3342_1995">
                                            <rect
                                                id="Twitter"
                                                width="32.000000"
                                                height="32.000000"
                                                fill="white"
                                                fillOpacity="0"
                                            />
                                        </clipPath>
                                    </defs>
                                    <g clipPath="url(#clip3342_1995)">
                                        <path
                                            id="Shape"
                                            d="M17.71 14.43L24.41 6.5L22.82 6.5L17 13.39L12.35 6.5L7 6.5L14.02 16.92L7 25.25L8.58 25.25L14.73 17.97L19.64 25.25L25 25.25L17.71 14.43ZM15.53 17.01L14.82 15.97L9.16 7.71L11.59 7.71L16.17 14.38L16.88 15.42L22.82 24.08L20.38 24.08L15.53 17.01Z"
                                            fill="currentColor"
                                            fillOpacity="1.000000"
                                            fillRule="nonzero"
                                        />
                                    </g>
                                </svg>
                            </Link>
                            <Link
                                onClick={(event) => {
                                    event.stopPropagation()
                                    sendEvent('medium')
                                }}
                                className="hover:o-text-t2"
                                href={Media_LINK.Medium}
                                target="_blank"
                            >
                                <svg
                                    className="w-8 h-8 cursor-pointer ml-3"
                                    width="32.000000"
                                    height="32.000000"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <defs>
                                        <clipPath id="clip3342_1997">
                                            <rect
                                                id="Medium"
                                                width="32.000000"
                                                height="32.000000"
                                                fill="white"
                                                fillOpacity="0"
                                            />
                                        </clipPath>
                                    </defs>
                                    <g clipPath="url(#clip3342_1997)">
                                        <path
                                            id="path"
                                            d="M17.41 15.58C17.41 15.68 17.4 15.78 17.4 15.88C17.4 15.99 17.38 16.08 17.37 16.19C17.37 16.28 17.36 16.39 17.34 16.48C17.32 16.59 17.3 16.69 17.29 16.79C17.27 16.89 17.24 16.98 17.23 17.09C17.2 17.19 17.18 17.28 17.14 17.39C17.11 17.48 17.08 17.58 17.05 17.67C17.01 17.76 16.98 17.86 16.94 17.95C16.9 18.05 16.85 18.14 16.81 18.24C16.77 18.33 16.72 18.43 16.67 18.51C16.63 18.6 16.58 18.69 16.53 18.78C16.48 18.87 16.42 18.95 16.36 19.03C16.31 19.13 16.24 19.21 16.19 19.29C16.13 19.37 16.06 19.45 16 19.53C15.93 19.61 15.87 19.68 15.8 19.76C15.74 19.84 15.66 19.91 15.6 19.99C15.52 20.06 15.45 20.12 15.38 20.19C15.3 20.26 15.22 20.33 15.14 20.39C15.07 20.46 14.99 20.53 14.9 20.58C14.82 20.65 14.74 20.7 14.65 20.76C14.57 20.81 14.48 20.88 14.39 20.92C14.3 20.97 14.23 21.03 14.13 21.08C14.04 21.12 13.95 21.17 13.86 21.21C13.77 21.26 13.67 21.3 13.58 21.34C13.49 21.38 13.38 21.42 13.29 21.44C13.2 21.48 13.1 21.51 13.01 21.55C12.91 21.58 12.82 21.61 12.71 21.63C12.61 21.66 12.52 21.67 12.41 21.7C12.31 21.71 12.21 21.74 12.12 21.75C12.01 21.77 11.91 21.78 11.81 21.79C11.7 21.81 11.61 21.81 11.51 21.81C11.41 21.82 11.3 21.82 11.2 21.82C11.09 21.82 10.99 21.82 10.89 21.81C10.8 21.81 10.69 21.81 10.59 21.79C10.49 21.78 10.38 21.77 10.28 21.75C10.19 21.74 10.09 21.71 9.98 21.7C9.88 21.67 9.79 21.66 9.68 21.63C9.59 21.61 9.49 21.58 9.39 21.55C9.3 21.51 9.19 21.48 9.1 21.44C9.01 21.42 8.91 21.38 8.82 21.34C8.73 21.3 8.64 21.26 8.55 21.21C8.44 21.17 8.35 21.12 8.26 21.08C8.17 21.03 8.09 20.97 8 20.92C7.91 20.88 7.83 20.81 7.74 20.76C7.65 20.7 7.58 20.65 7.5 20.58C7.41 20.53 7.33 20.46 7.25 20.39C7.17 20.33 7.1 20.26 7.02 20.19C6.95 20.12 6.88 20.06 6.8 19.99C6.73 19.91 6.66 19.84 6.59 19.76C6.53 19.68 6.46 19.61 6.4 19.53C6.33 19.45 6.27 19.37 6.2 19.29C6.15 19.21 6.09 19.13 6.04 19.03C5.97 18.95 5.92 18.87 5.87 18.78C5.82 18.69 5.76 18.6 5.73 18.51C5.67 18.43 5.62 18.33 5.58 18.24C5.54 18.14 5.51 18.05 5.47 17.95C5.43 17.86 5.39 17.76 5.35 17.67C5.32 17.58 5.29 17.48 5.26 17.39C5.23 17.28 5.19 17.19 5.18 17.09C5.16 16.98 5.13 16.89 5.1 16.79C5.09 16.69 5.08 16.59 5.07 16.48C5.04 16.39 5.03 16.28 5.03 16.19C5.01 16.08 5 15.99 5 15.88C5 15.78 4.99 15.68 5 15.58C4.99 15.47 5 15.37 5 15.27C5 15.16 5.01 15.07 5.03 14.96C5.03 14.87 5.04 14.76 5.07 14.67C5.08 14.56 5.09 14.46 5.1 14.36C5.13 14.26 5.16 14.17 5.18 14.06C5.19 13.96 5.23 13.87 5.26 13.76C5.29 13.67 5.32 13.57 5.35 13.48C5.39 13.38 5.43 13.29 5.47 13.2C5.51 13.1 5.54 13.01 5.58 12.91C5.62 12.82 5.67 12.72 5.73 12.64C5.76 12.55 5.82 12.46 5.87 12.37C5.92 12.28 5.97 12.2 6.04 12.12C6.09 12.02 6.15 11.94 6.2 11.86C6.27 11.78 6.33 11.7 6.4 11.62C6.46 11.54 6.53 11.47 6.59 11.39C6.66 11.31 6.73 11.24 6.8 11.16C6.88 11.09 6.95 11.03 7.02 10.96C7.1 10.89 7.17 10.82 7.25 10.76C7.33 10.69 7.41 10.62 7.5 10.57C7.58 10.5 7.65 10.45 7.74 10.39C7.83 10.34 7.91 10.27 8 10.23C8.09 10.18 8.17 10.12 8.26 10.07C8.35 10.03 8.44 9.98 8.55 9.93C8.64 9.89 8.73 9.85 8.82 9.81C8.91 9.77 9.01 9.73 9.1 9.71C9.19 9.67 9.3 9.64 9.39 9.6C9.49 9.57 9.59 9.54 9.68 9.52C9.79 9.49 9.88 9.48 9.98 9.45C10.09 9.44 10.19 9.41 10.28 9.4C10.38 9.38 10.49 9.37 10.59 9.36C10.69 9.36 10.8 9.34 10.89 9.34C10.99 9.33 11.09 9.33 11.2 9.33C11.3 9.33 11.41 9.33 11.51 9.34C11.61 9.34 11.7 9.36 11.81 9.36C11.91 9.37 12.01 9.38 12.12 9.4C12.21 9.41 12.31 9.44 12.41 9.45C12.52 9.48 12.61 9.49 12.71 9.52C12.82 9.54 12.91 9.57 13.01 9.6C13.1 9.64 13.2 9.67 13.29 9.71C13.38 9.73 13.49 9.77 13.58 9.81C13.67 9.85 13.77 9.89 13.86 9.93C13.95 9.98 14.04 10.03 14.13 10.07C14.23 10.12 14.3 10.18 14.39 10.23C14.48 10.27 14.57 10.34 14.65 10.39C14.74 10.45 14.82 10.5 14.9 10.57C14.99 10.62 15.07 10.69 15.14 10.76C15.22 10.82 15.3 10.89 15.38 10.96C15.45 11.03 15.52 11.09 15.6 11.16C15.66 11.24 15.74 11.31 15.8 11.39C15.87 11.47 15.93 11.54 16 11.62C16.06 11.7 16.13 11.78 16.19 11.86C16.24 11.94 16.31 12.02 16.36 12.12C16.42 12.2 16.48 12.28 16.53 12.37C16.58 12.46 16.63 12.55 16.67 12.64C16.72 12.72 16.77 12.82 16.81 12.91C16.85 13.01 16.9 13.1 16.94 13.2C16.98 13.29 17.01 13.38 17.05 13.48C17.08 13.57 17.11 13.67 17.14 13.76C17.18 13.87 17.2 13.96 17.23 14.06C17.24 14.17 17.27 14.26 17.29 14.36C17.3 14.46 17.32 14.56 17.34 14.67C17.36 14.76 17.37 14.87 17.37 14.96C17.38 15.07 17.4 15.16 17.4 15.27C17.4 15.37 17.41 15.47 17.41 15.58ZM24.2 15.58C24.2 18.82 22.82 21.46 21.11 21.46C19.39 21.46 18 18.82 18 15.58C18 12.33 19.39 9.69 21.11 9.69C22.82 9.69 24.2 12.33 24.2 15.58ZM27 15.58C27 18.48 26.5 20.84 25.9 20.84C25.29 20.84 24.81 18.48 24.81 15.58C24.81 12.67 25.29 10.31 25.9 10.31C26.5 10.31 27 12.67 27 15.58Z"
                                            fill="currentColor"
                                            fillOpacity="1.000000"
                                            fillRule="nonzero"
                                        />
                                    </g>
                                </svg>
                            </Link>
                            <Link
                                onClick={(event) => {
                                    event.stopPropagation()
                                    sendEvent('discord')
                                }}
                                className="hover:o-text-t2"
                                href={Media_LINK.Discord}
                                target="_blank"
                            >
                                <svg
                                    className="w-8 h-8 cursor-pointer ml-3"
                                    width="32.000000"
                                    height="32.000000"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <defs>
                                        <clipPath id="clip3342_1999">
                                            <rect
                                                id="Discord"
                                                width="32.000000"
                                                height="32.000000"
                                                fill="white"
                                                fillOpacity="0"
                                            />
                                        </clipPath>
                                    </defs>
                                    <g clipPath="url(#clip3342_1999)">
                                        <path
                                            fill="currentColor"
                                            id="path"
                                            d="M23.65 8.91C23.64 8.9 23.63 8.89 23.62 8.88C22.19 8.23 20.69 7.76 19.14 7.5C19.13 7.49 19.11 7.5 19.1 7.5C19.09 7.51 19.08 7.52 19.07 7.53C18.86 7.9 18.68 8.28 18.51 8.68C16.84 8.42 15.16 8.42 13.48 8.68C13.31 8.28 13.13 7.9 12.92 7.53C12.91 7.52 12.9 7.51 12.88 7.5C12.87 7.5 12.86 7.49 12.84 7.5C11.29 7.76 9.8 8.23 8.37 8.88C8.35 8.89 8.34 8.9 8.34 8.91C5.48 13.17 4.7 17.32 5.09 21.43C5.09 21.45 5.1 21.47 5.11 21.48C5.94 22.09 6.82 22.63 7.74 23.1C8.67 23.57 9.62 23.95 10.61 24.25C10.62 24.26 10.64 24.26 10.65 24.25C10.66 24.25 10.68 24.24 10.69 24.23C11.11 23.65 11.48 23.04 11.81 22.4C11.81 22.39 11.82 22.38 11.82 22.37C11.82 22.36 11.82 22.35 11.81 22.34C11.81 22.34 11.8 22.33 11.8 22.32C11.79 22.31 11.78 22.31 11.77 22.3C11.18 22.08 10.61 21.8 10.05 21.49C10.04 21.48 10.04 21.47 10.03 21.46C10.02 21.45 10.02 21.44 10.02 21.43C10.02 21.42 10.02 21.41 10.03 21.4C10.03 21.39 10.04 21.38 10.05 21.37C10.16 21.28 10.28 21.19 10.39 21.1C10.41 21.08 10.43 21.08 10.46 21.09C14.06 22.74 17.96 22.74 21.52 21.09C21.54 21.08 21.57 21.08 21.59 21.1C21.7 21.19 21.81 21.28 21.93 21.37C21.94 21.38 21.95 21.39 21.95 21.4C21.96 21.41 21.96 21.42 21.96 21.43C21.96 21.44 21.95 21.45 21.95 21.46C21.94 21.47 21.93 21.48 21.92 21.49C21.37 21.81 20.8 22.08 20.21 22.3C20.2 22.31 20.19 22.31 20.18 22.32C20.17 22.33 20.17 22.33 20.17 22.34C20.16 22.35 20.16 22.36 20.16 22.37C20.16 22.38 20.16 22.39 20.17 22.4C20.5 23.04 20.87 23.65 21.29 24.23C21.3 24.24 21.31 24.25 21.33 24.25C21.34 24.26 21.35 24.26 21.37 24.25C22.36 23.95 23.32 23.57 24.24 23.1C25.16 22.63 26.04 22.09 26.87 21.48C26.89 21.47 26.9 21.45 26.9 21.43C27.36 16.68 26.13 12.56 23.65 8.91ZM12.35 18.93C11.26 18.93 10.37 17.93 10.37 16.71C10.37 15.49 11.25 14.5 12.35 14.5C13.46 14.5 14.34 15.5 14.32 16.71C14.32 17.93 13.45 18.93 12.35 18.93ZM19.66 18.93C18.57 18.93 17.68 17.93 17.68 16.71C17.68 15.49 18.56 14.5 19.66 14.5C20.77 14.5 21.65 15.5 21.63 16.71C21.63 17.93 20.77 18.93 19.66 18.93Z"
                                            fillOpacity="1.000000"
                                            fillRule="nonzero"
                                        />
                                    </g>
                                </svg>
                            </Link>
                            <Link
                                onClick={(event) => {
                                    event.stopPropagation()
                                    sendEvent('telegram')
                                }}
                                className="hover:o-text-t2"
                                href={Media_LINK.Telegram}
                                target="_blank"
                            >
                                <svg
                                    className="w-8 h-8 cursor-pointer ml-3"
                                    width="32.000000"
                                    height="32.000000"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <defs>
                                        <clipPath id="clip3342_2001">
                                            <rect
                                                id="Telegram"
                                                width="32.000000"
                                                height="32.000000"
                                                fill="white"
                                                fillOpacity="0"
                                            />
                                        </clipPath>
                                    </defs>
                                    <g clipPath="url(#clip3342_2001)">
                                        <path
                                            id="path"
                                            d="M25.94 9.02L22.92 23.26C22.69 24.26 22.1 24.51 21.26 24.04L16.66 20.65L14.44 22.78C14.19 23.03 13.99 23.23 13.51 23.23L13.84 18.55L22.37 10.85C22.74 10.52 22.29 10.33 21.79 10.67L11.25 17.3L6.72 15.88C5.73 15.57 5.71 14.89 6.92 14.42L24.67 7.58C25.49 7.28 26.21 7.77 25.94 9.02Z"
                                            fill="currentColor"
                                            fillOpacity="1.000000"
                                            fillRule="nonzero"
                                        />
                                    </g>
                                </svg>
                            </Link>
                        </div>
                        <div className='w-full mt-2 o-text-t3 text-sm'>© 2024 Orbiter Finance, All rights reserved.</div>
                    </div>
                </div>
            </OrbiterModal>

        </div>
    )
}