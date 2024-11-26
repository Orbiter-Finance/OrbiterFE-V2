"use client"

import { useAtom, useAtomValue, useSetAtom } from "jotai"
import React, { useMemo, useState } from "react"

import block from "ethereum-blockies"
import { Copy, XIcon } from "lucide-react"
import { pageIsMobileAtom, pointCardShowAtom, pointCardUserAddressAtom, pointRankShowAtom, pointRankUserAddressAtom, userMainWalletAccountInfoKeyAtom } from "../stores/bridge"
import { OrbiterIcon, OrbiterModal, OrbiterShow } from "@orbiter-finance/ui"
import { useWallets } from "@orbiter-finance/wallet-management"
import shortenAddress from "../utils/shortenAddress"
import { useCopyGroup } from "../hooks/useCopyGroup"
import Image from "next/image"
import { decimalNum } from "../utils/decimalNum"
import WalletAvater from "./WalletAvater"
import { useUserPointsInfo } from "../hooks/useUserPointsInfo"
import { cn } from "../utils/cn"
import useWalletAccount from "../hooks/useWalletAccount"


export function ConnectWallet() {
  const { MainWalletAccountInfo } = useWalletAccount()
  const pageIsMobile = useAtomValue(pageIsMobileAtom)
  const [userMainWalletAccountInfoKey, setUserMainWalletAccountInfoKey] = useAtom(userMainWalletAccountInfoKeyAtom)
  const wallets = useWallets()
  const { handleCopy } = useCopyGroup()

  const { getUserPointsInfo } = useUserPointsInfo()

  const [show, setShow] = useState(false)

  const setPointRankShow = useSetAtom(pointRankShowAtom)
  const setPointRankUserAddress = useSetAtom(pointRankUserAddressAtom)

  const setPointCardShow = useSetAtom(pointCardShowAtom)
  const setPointCardUserAddress = useSetAtom(pointCardUserAddressAtom)

  const walletList = useMemo(
    () => {
      let walletList = wallets.filter((item) => {
        return item?.type === userMainWalletAccountInfoKey
      }).concat(wallets.filter((item) => {
        return item?.type !== userMainWalletAccountInfoKey
      }))
      walletList = walletList
        .filter((item) => item?.address)
        .concat(walletList.filter((item) => !item?.address))
      return walletList
    }
    ,
    [wallets, userMainWalletAccountInfoKey]
  )

  return (
    <>
      <OrbiterShow
        when={!!MainWalletAccountInfo?.address}
        fallback={
          <button
            className="bg-[var(--o-color-brand-900)] hover:bg-[var(--o-color-brand-800)] px-4 py-2 cursor-pointer rounded-xl text-[var(--o-color-brand-500)] o-font-500"
            onClick={async (event) => {
              event.stopPropagation()
              setShow(true)
            }}
          >
            Connect Wallet
          </button>
        }
      >
        <button
          className="flex h-10 justify-center items-center o-font-500 px-4 py-2 bg-[var(--o-color-gray-800)] hover:bg-[var(--o-color-gray-700)] rounded-xl"
          onClick={(event) => {
            event.stopPropagation()
            setShow(true)
          }}
        >
          <WalletAvater walletAddress={MainWalletAccountInfo?.address} className="mr-2" />

          {MainWalletAccountInfo?.address && shortenAddress(MainWalletAccountInfo?.address, 5)}
        </button>
      </OrbiterShow>

      <OrbiterShow
        when={pageIsMobile}
        fallback={
          <OrbiterShow when={show}>
            <div className="fixed top-4 right-4 w-96 z-[var(--modal-z-index)] bg-[var(--o-color-gray-800)] rounded-xl border border-[var(--o-color-gray-600)] p-4 pr-1">
              <div className="flex justify-between items-center w-full">
                <div className="o-font-500">My Wallets</div>
                <div
                  className="cursor-pointer"
                  onClick={(event) => {
                    event.stopPropagation()
                    setShow(false)
                  }}
                >
                  <XIcon className="w-6 h-6" />
                </div>
              </div>
              <div className="w-full max-h-96 overflow-auto pr-1">
                {walletList.map((item) => {
                  const pointsGroup = getUserPointsInfo(item?.address)
                  const { rank, card, point } = pointsGroup || {}

                  return (
                    <div className="w-full mt-3" key={item.type}>
                      <OrbiterShow when={!!item?.address}>
                        <div className="w-full flex mb-1.5 text-sm text-[var(--o-color-text-t3)]">
                          {item.type}
                        </div>
                      </OrbiterShow>
                      <div onClick={(event) => {
                        event.stopPropagation()
                        if (item.address) {
                          setUserMainWalletAccountInfoKey(item.type)
                          setShow(false)
                        }
                      }} className={
                        cn("rounded-2xl bg-[var(--o-color-gray-900)] cursor-pointer border p-3",
                          item?.address && item.type === userMainWalletAccountInfoKey ? "border-[var(--o-color-brand-500)]" : "border-transparent hover:border-[var(--o-color-gray-600)]"
                        )
                      }>
                        <div className="w-full flex justify-between items-center">
                          <OrbiterShow
                            when={!!item.address}
                            fallback={
                              <div className="w-full flex rounded-xl justify-center items-center bg-[var(--o-color-gray-900)]">
                                <div className="w-full flex justify-start items-center whitespace-nowrap">
                                  <OrbiterIcon
                                    type="CHAIN"
                                    iconId={item.defaultChain}
                                    className="mr-1.5"
                                  />
                                  <span>
                                    {item?.type}
                                  </span>
                                </div>
                                <div className="flex justify-center items-center">
                                  <button
                                    onClick={async (event) => {
                                      event.stopPropagation()
                                      setShow(false)
                                      await item.connect()
                                    }}
                                    className="w-20 h-8 rounded-lg cursor-pointer text-[var(--o-color-brand-500)] bg-[var(--o-color-brand-900)] text-sm flex justify-center items-center o-font-500"
                                  >
                                    Connect
                                  </button>
                                </div>
                              </div>
                            }
                          >
                            <div className="w-full">
                              <div className="flex justify-between items-center w-full">
                                <div className="flex justify-start">
                                  <OrbiterShow when={!!item?.address}>
                                    <WalletAvater
                                      walletAddress={item?.address}
                                      className="w-10 h-10 mr-2"
                                    />
                                  </OrbiterShow>
                                  <div>
                                    <div
                                      onClick={(event) => {
                                        event.stopPropagation()
                                        if (item?.address) {
                                          handleCopy(item.address)
                                        }
                                      }}
                                      className="whitespace-nowrap flex justify-start items-center"
                                    >
                                      <span className="mr-1">
                                        {shortenAddress(item?.address || "", 6)}
                                      </span>
                                      <Copy
                                        stroke="var(--o-color-gray-600) cursor-pointer"
                                        className="w-3 h-3"
                                      />
                                    </div>
                                    <div className="flex">
                                      <div className="flex">
                                        <div className="flex px-1.5 mr-1 text-[var(--o-color-brand-500)] rounded-sm o-zoom-87 py-0.5 bg-[var(--o-color-brand-900)]">
                                          <Image
                                            src="/assets/icon/header/points-rank.svg"
                                            alt="rank"
                                            width={12}
                                            height={12}
                                            className="mr-1 w-3 h-3"
                                          />
                                          <div className="text-xs o-font-500">
                                            {decimalNum(
                                              rank?.rank,
                                              0,
                                              ","
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex">
                                        <div className="text-xs text-[var(--o-color-gray-400)] rounded-sm o-zoom-87 py-0.5 bg-[var(--o-color-gray-800)] px-1.5">
                                          {item.walletName}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <svg
                                  onClick={async (event) => {
                                    event.stopPropagation()
                                    await item.disConnectAsync()
                                  }}
                                  className="cursor-pointer"
                                  width="24.000000"
                                  height="24.000000"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                  <defs>
                                    <clipPath id="clip2748_1392">
                                      <rect
                                        id="ic/Disconnect"
                                        width="24.000000"
                                        height="24.000000"
                                        fill="white"
                                        fillOpacity="0"
                                      />
                                    </clipPath>
                                  </defs>
                                  <g clipPath="url(#clip2748_1392)">
                                    <path
                                      id="trails"
                                      d="M14.58 8.26C14.32 5.23 12.77 4 9.36 4L9.26 4C5.5 4 4 5.5 4 9.26L4 14.73C4 18.49 5.5 20 9.26 20L9.36 20C12.74 20 14.3 18.78 14.58 15.8"
                                      stroke="#545454"
                                      strokeOpacity="1.000000"
                                      strokeWidth="1.8"
                                      strokeLinejoin="round"
                                      strokeLinecap="round"
                                    />
                                    <path
                                      id="trails"
                                      d="M9.46 11.99L19.02 11.99"
                                      stroke="#545454"
                                      strokeOpacity="1.000000"
                                      strokeWidth="1.8"
                                      strokeLinejoin="round"
                                      strokeLinecap="round"
                                    />
                                    <path
                                      id="trails"
                                      d="M17.15 9.17L19.96 11.99L17.15 14.8"
                                      stroke="#545454"
                                      strokeOpacity="1.000000"
                                      strokeWidth="1.8"
                                      strokeLinejoin="round"
                                      strokeLinecap="round"
                                    />
                                  </g>
                                </svg>
                              </div>
                              <div className='mt-4 flex justify-between items-center text-sm'>
                                <div onClick={(event) => {
                                  event.stopPropagation()
                                  setPointRankShow(true)
                                  setPointRankUserAddress(item.address)
                                  setShow(false)
                                }} className='w-10/12 flex justify-center items-center rounded-lg py-2 o-font-500 bg-[var(--o-color-gray-800)] hover:bg-[var(--o-color-gray-700)] cursor-pointer'>
                                  <Image src="/assets/image/header/point-rank.png" alt="rank" width={24} height={24} className='mr-1 w-6 h-6' />
                                  Leaderboard
                                </div>
                                {/* <div className='w-2/5 flex justify-center items-center rounded-lg py-2.5 o-font-500 bg-[var(--o-color-gray-800)] cursor-pointer'>
                                  <Image src="/assets/icon/header/points-reward.svg" alt="rank" width={20} height={20} className='mr-1 2-5 h-5' />
                                  Reward
                                </div>  */}
                                <div
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    if (Number(card?.cardsCount)) {
                                      setPointCardShow(true)
                                      setPointCardUserAddress(item?.address || "")
                                      setShow(false)
                                    }
                                  }}
                                  className='w-10 h-10 flex relative justify-center items-center rounded-lg bg-[var(--o-color-gray-800)] hover:bg-[var(--o-color-gray-700)] cursor-pointer overflow-hidden'>
                                  <OrbiterShow
                                    when={
                                      !!Number(card?.cardsCount)
                                    }
                                    fallback={
                                      <Image alt="points-card" src="/assets/image/header/points-card-disabled.png" width={16} height={24} className='w-4 h-6' />
                                    }
                                  >
                                    <Image alt="points-card" src="/assets/image/header/points-card.png" width={16} height={24} className='w-4 h-6' />
                                    <div className="absolute bottom-0 right-0 bg-[var(--o-color-brand-500)] o-font-500 text-[var(--o-text-t1] text-xs px-1.5 rounded-tl-lg flex justify-center items-center h-3.5">
                                      {Number(card?.cardsCount) >= 99 ? "99+" : (Number(card?.cardsCount) || 0)}
                                    </div>
                                  </OrbiterShow>
                                </div>
                              </div>
                            </div>
                          </OrbiterShow>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </OrbiterShow>
        }
      >
        <OrbiterModal
          show={show}
          headerLabel={"My Wallets"}
          containerClassName="bg-[var(--o-color-gray-800)] py-4"
          onShowChange={(open) => {
            setShow(open)
          }}
        >
          <div className="w-full max-h-96 overflow-auto pr-1">
            {walletList.map((item) => {
              const pointsGroup = getUserPointsInfo(item?.address)
              const { rank, card, point } = pointsGroup || {}

              return (
                <div className="w-full mt-3" key={item.type}>
                  <OrbiterShow when={!!item?.address}>
                    <div className="w-full flex mb-1.5 text-sm text-[var(--o-color-text-t3)]">
                      {item.type}
                    </div>
                  </OrbiterShow>
                  <div onClick={(event) => {
                    event.stopPropagation()
                    if (item.address) {
                      setUserMainWalletAccountInfoKey(item.type)
                      setShow(false)
                    }
                  }} className={
                    cn("rounded-2xl bg-[var(--o-color-gray-900)] cursor-pointer border p-3",
                      item?.address && item.type === userMainWalletAccountInfoKey ? "border-[var(--o-color-brand-500)]" : "border-transparent hover:border-[var(--o-color-gray-600)]"
                    )
                  }>
                    <div className="w-full flex justify-between items-center">
                      <OrbiterShow
                        when={!!item.address}
                        fallback={
                          <div className="w-full flex rounded-xl justify-center items-center bg-[var(--o-color-gray-900)]">
                            <div className="w-full flex justify-start items-center whitespace-nowrap">
                              <OrbiterIcon
                                type="CHAIN"
                                iconId={item.defaultChain}
                                className="mr-1.5"
                              />
                              <span>
                                {item?.type}
                              </span>
                            </div>
                            <div className="flex justify-center items-center">
                              <button
                                onClick={async (event) => {
                                  event.stopPropagation()
                                  setShow(false)
                                  await item.connect()
                                }}
                                className="w-20 h-8 rounded-lg cursor-pointer text-[var(--o-color-brand-500)] bg-[var(--o-color-brand-900)] text-sm flex justify-center items-center o-font-500"
                              >
                                Connect
                              </button>
                            </div>
                          </div>
                        }
                      >
                        <div className="w-full">
                          <div className="flex justify-between items-center w-full">
                            <div className="flex justify-start">
                              <OrbiterShow when={!!item?.address}>
                                <WalletAvater
                                  walletAddress={item?.address}
                                  className="w-10 h-10 mr-2"
                                />
                              </OrbiterShow>
                              <div>
                                <div
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    if (item?.address) {
                                      handleCopy(item.address)
                                    }
                                  }}
                                  className="whitespace-nowrap flex justify-start items-center"
                                >
                                  <span className="mr-1">
                                    {shortenAddress(item?.address || "", 6)}
                                  </span>
                                  <Copy
                                    stroke="var(--o-color-gray-600) cursor-pointer"
                                    className="w-3 h-3"
                                  />
                                </div>
                                <div className="flex">
                                  <div className="flex">
                                    <div className="flex px-1.5 mr-1 text-[var(--o-color-brand-500)] rounded-sm o-zoom-87 py-0.5 bg-[var(--o-color-brand-900)]">
                                      <Image
                                        src="/assets/icon/header/points-rank.svg"
                                        alt="rank"
                                        width={12}
                                        height={12}
                                        className="mr-1 w-3 h-3"
                                      />
                                      <div className="text-xs o-font-500">
                                        {decimalNum(
                                          rank?.rank,
                                          0,
                                          ","
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex">
                                    <div className="text-xs text-[var(--o-color-gray-400)] rounded-sm o-zoom-87 py-0.5 bg-[var(--o-color-gray-800)] px-1.5">
                                      {item.walletName}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <svg
                              onClick={async (event) => {
                                event.stopPropagation()
                                await item.disConnectAsync()
                              }}
                              className="cursor-pointer"
                              width="24.000000"
                              height="24.000000"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                            >
                              <defs>
                                <clipPath id="clip2748_1392">
                                  <rect
                                    id="ic/Disconnect"
                                    width="24.000000"
                                    height="24.000000"
                                    fill="white"
                                    fillOpacity="0"
                                  />
                                </clipPath>
                              </defs>
                              <g clipPath="url(#clip2748_1392)">
                                <path
                                  id="trails"
                                  d="M14.58 8.26C14.32 5.23 12.77 4 9.36 4L9.26 4C5.5 4 4 5.5 4 9.26L4 14.73C4 18.49 5.5 20 9.26 20L9.36 20C12.74 20 14.3 18.78 14.58 15.8"
                                  stroke="#545454"
                                  strokeOpacity="1.000000"
                                  strokeWidth="1.8"
                                  strokeLinejoin="round"
                                  strokeLinecap="round"
                                />
                                <path
                                  id="trails"
                                  d="M9.46 11.99L19.02 11.99"
                                  stroke="#545454"
                                  strokeOpacity="1.000000"
                                  strokeWidth="1.8"
                                  strokeLinejoin="round"
                                  strokeLinecap="round"
                                />
                                <path
                                  id="trails"
                                  d="M17.15 9.17L19.96 11.99L17.15 14.8"
                                  stroke="#545454"
                                  strokeOpacity="1.000000"
                                  strokeWidth="1.8"
                                  strokeLinejoin="round"
                                  strokeLinecap="round"
                                />
                              </g>
                            </svg>
                          </div>
                          <div className='mt-4 flex justify-between items-center text-sm'>
                            <div onClick={(event) => {
                              event.stopPropagation()
                              setPointRankShow(true)
                              setPointRankUserAddress(item.address)
                              setShow(false)
                            }} className='w-10/12 flex justify-center items-center rounded-lg py-2 o-font-500 bg-[var(--o-color-gray-800)] hover:bg-[var(--o-color-gray-700)] cursor-pointer'>
                              <Image src="/assets/image/header/point-rank.png" alt="rank" width={24} height={24} className='mr-1 w-6 h-6' />
                              Leaderboard
                            </div>
                            {/* <div className='w-2/5 flex justify-center items-center rounded-lg py-2.5 o-font-500 bg-[var(--o-color-gray-800)] cursor-pointer'>
                                  <Image src="/assets/icon/header/points-reward.svg" alt="rank" width={20} height={20} className='mr-1 2-5 h-5' />
                                  Reward
                                </div>  */}
                            <div
                              onClick={(event) => {
                                event.stopPropagation()
                                if (Number(card?.cardsCount)) {
                                  setPointCardShow(true)
                                  setPointCardUserAddress(item?.address || "")
                                  setShow(false)
                                }
                              }}
                              className='w-10 h-10 flex relative justify-center items-center rounded-lg bg-[var(--o-color-gray-800)] hover:bg-[var(--o-color-gray-700)] cursor-pointer overflow-hidden'>
                              <OrbiterShow
                                when={
                                  !!Number(card?.cardsCount)
                                }
                                fallback={
                                  <Image alt="points-card" src="/assets/image/header/points-card-disabled.png" width={16} height={24} className='w-4 h-6' />
                                }
                              >
                                <Image alt="points-card" src="/assets/image/header/points-card.png" width={16} height={24} className='w-4 h-6' />
                                <div className="absolute bottom-0 right-0 bg-[var(--o-color-brand-500)] o-font-500 text-[var(--o-text-t1] text-xs px-1.5 rounded-tl-lg flex justify-center items-center h-3.5">
                                  {Number(card?.cardsCount) >= 99 ? "99+" : (Number(card?.cardsCount) || 0)}
                                </div>
                              </OrbiterShow>
                            </div>
                          </div>
                        </div>
                      </OrbiterShow>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </OrbiterModal>
      </OrbiterShow>
    </>
  )
}
