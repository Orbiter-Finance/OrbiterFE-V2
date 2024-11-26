"use client"

import Image from 'next/image'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BASE_URL, CND_URL } from '../app/constant'
import { OrbiterShow } from '@orbiter-finance/ui'
import useWalletAccount from '../hooks/useWalletAccount'

export default function NFT() {

    const { MainWalletAccountInfo } = useWalletAccount()
    const [holderList, setHolderList] = useState<string[]>([])
    const init = useCallback(
        async () => {
            if (MainWalletAccountInfo?.address) {
                const response = await fetch(BASE_URL + `/points_system/user/nfts?address=${MainWalletAccountInfo?.address}`)
                const res = await response.json()
                setHolderList(res?.data?.nfts || [])
            }
        },
        [MainWalletAccountInfo],
    )
    useEffect(() => {
        const timer = setTimeout(() => {
            init()
        }, 200)
        return () => {
            clearTimeout(timer)
        }
    }, [MainWalletAccountInfo?.address])
    const nftImageList = useMemo(() => {
        return [
            {
                address: '0x4a0E7cf70E2816De8e6c30f67968575d17925A55',
                border: '0 none',
                label: "PILOT",
            },
            {
                address: '0x5B9b40c26f6FBD053840A212A0627C55db8ea28c',
                border: '0 none',
                label: "ACE PILOT",
            },
            {
                address: '0x83Ed3B8a9DCA0A3d40A9be9F7aeE0E58F7918c4C',
                border: '0 none',
                label: "ELITE PILOT",
            },
            {
                address: '0xBC2B5d07E8658D74176E3044Fd60B38d08f926A4',
                border: '0 none',
                label: "TRAINEE PILOT",
            },
            {
                address: '0xe20847F3C593296613Df763afE7eA039D8398E78',
                border: '0 none',
                label: "EXPERT PILOT",
            },
            {
                address: '0x98f2bf4408fae2b6acb7f875efd7c587b593615c',
                border: '2.5px solid rgba(0, 0, 0, 1)',
                label: "Orbiter HLNY",
            },
        ].map((item) => {
            return ({
                ...item,
                holder: holderList.some((option) => item.address.toLocaleLowerCase() === option.toLocaleLowerCase())
            })
        })
    }, [holderList])
    return (
        <div className='mt-3 w-full rounded-2xl bg-[var(--o-color-gray-900)] flex justify-start items-center flex-wrap'>
            {
                nftImageList.map((item) => {
                    const url = CND_URL + "/nft/" + item.address.toLocaleLowerCase() + ".png"
                    return <div className='w-[7.5rem] h-36 p-1.5 flex justify-center items-center rounded-md'>
                        <div className='w-full h-full relative top-0 left-0'>
                            <Image src={url} alt="" width={108} height={132} className='w-full h-full rounded-md' style={{ border: item.border }} />
                            <OrbiterShow
                                when={!item.holder}
                            >
                                <div className='absolute w-full h-full rounded-md top-0 left-0 z-[2] border border-[var(--o-color-brand-900)] bg-[rgba(0,0,0,0.1)] backdrop-filter-12'>

                                    <div className='absolute top-1/2 left-0 w-full text-sm o-font-500 -translate-y-1/2 text-center text-[var(--o-color-brand-500)]'>{item.label}</div>
                                    <div className='absolute bottom-3 left-0 w-full text-center text-[var(--o-color-gray-400)]'>NOT ELIGIBLE</div>
                                </div>
                            </OrbiterShow>
                        </div>
                    </div>
                })
            }
        </div>
    )
}
