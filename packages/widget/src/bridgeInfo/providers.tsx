;

import React, { createContext, FC, ReactNode, useCallback, useContext, useEffect } from 'react'
import { Chain, ENDPOINT, OrbiterClient, RouterType } from "@orbiter-finance/bridge-sdk"
import { Endpoint, ExploreLinkProvider } from "@orbiter-finance/explore-link"
import { HOSTtENVIRONMENT, VM } from "@orbiter-finance/wallet-management"
import { useAtom, useSetAtom } from "jotai"
import { allChainsAtom, bridgeBalanceDataGroupAtom, BridgeTransactionType, orbiterClientAtom, orbiterExploreAtom, orbiterExploreInitAtom, orbiterFeeEstimatorAtom } from "../stores/bridge"
import { FeeEstimator } from "@orbiter-finance/blockchain-gas"

export interface ChainViewType extends Chain {
  disabled: boolean
}

export interface SelectChainItemConfigType {
  chainId: string
  classify?: string[]
  recommend?: boolean,
  tags?: string[]
}

export interface BridgeInfoState {
  isMainnet: boolean,
  isTelegram: boolean
  orbiterClient: OrbiterClient | null
  orbiterExplore: ExploreLinkProvider | null
  orbiterFeeEstimator: FeeEstimator | null
  allChains: ChainViewType[],
  selectChainConfig: SelectChainItemConfigType[]
  LogEvent?: (method: string, params: string) => void
  hostEnvironment?: HOSTtENVIRONMENT
  reportTx?: (chainId: string, hash: string, params?: BridgeTransactionType) => void
  isCustomHeader?: boolean
}

export const BridgeInfoContext = createContext<BridgeInfoState>(
  {} as BridgeInfoState,
)

export const useBridgeInfoContext = () => {
  return useContext(BridgeInfoContext)
}

export interface ProjectInfoType {
  dealerId?: string
  apiKey?: string
  channelId?: string
}

export interface BridgeInfoProviderType {
  children: ReactNode
  disbaledVm: VM[],
  isMainnet?: boolean,
  isCustomHeader?: boolean
  projectInfo?: ProjectInfoType
  selectChainConfig: SelectChainItemConfigType[]
  LogEvent?: (method: string, params: string) => void
  hostEnvironment?: HOSTtENVIRONMENT
  reportTx?: (chainId: string, hash: string, params?: BridgeTransactionType) => void
}

export const BridgeInfoProvider: FC<BridgeInfoProviderType> = React.memo(({
  children,
  isMainnet,
  disbaledVm,
  projectInfo,
  selectChainConfig,
  LogEvent,
  reportTx,
  isCustomHeader,
  hostEnvironment
}) => {
  const [orbiterClient, setOrbiterClient] = useAtom(orbiterClientAtom)
  const [orbiterExplore, setOrbiterExplore] = useAtom(orbiterExploreAtom)
  const setOrbiterExploreInit = useSetAtom(orbiterExploreInitAtom)
  const [orbiterFeeEstimator, setOrbiterFeeEstimator] = useAtom(orbiterFeeEstimatorAtom)
  const [allChains, setAllChains] = useAtom(allChainsAtom)
  const setBridgeBalanceDataGroup = useSetAtom(bridgeBalanceDataGroupAtom)

  const init = useCallback(
    async () => {
      try {
        const isMain = isMainnet ?? true


        let dealerId: string | null = ""

        if (typeof window !== "undefined") {
          const searchParams = new URLSearchParams(window.location.search)
          dealerId = searchParams.get("dealerId")
        }

        const orbiter = await OrbiterClient.create({
          apiEndpoint: (isMain) ? ENDPOINT.MAINNET : ENDPOINT.TESTNET,
          defaultRouterType: RouterType.EOA,
          ...({
            ...(projectInfo || {}),
            dealerId: dealerId || projectInfo?.dealerId
          }),
        })
        const exploreLink = new ExploreLinkProvider(
          isMain ? Endpoint.mainnet : Endpoint.testnet
        );

        (exploreLink as any)?.on?.("ready", (result: any) => {
          setOrbiterExploreInit(true)
        });

        (exploreLink as any)?.on?.("error", (result: any) => {
          setOrbiterExploreInit(true)
        })

        const feeEstimator = new FeeEstimator(exploreLink)
        setOrbiterFeeEstimator(feeEstimator)
        setOrbiterExplore(exploreLink)
        setOrbiterClient(orbiter)
        const all = orbiter?.getAllChains() || []
        setBridgeBalanceDataGroup({
          refreshTime: +new Date(),
          walletAddress: "",
          chainId: "",
          token: "",
          bridgeBalanceList: all.map((item) => {
            return ({
              chainId: item.id,
              tokenList: (orbiter.getAvailableTokens(item.id) || []).map((option) => {
                return ({
                  symbol: option.symbol,
                  walletList: []
                })
              })
            })
          })
        })
        setAllChains(all.map((item) => {
          const chainInfo = orbiter.getChainConfig(item.id)
          const flag = disbaledVm.some((vm) => chainInfo?.vm && (vm === (chainInfo?.vm) as unknown as VM))
          return ({
            ...item,
            disabled: flag,
          })
        }))

      } catch (error) {
        console.log("orbiter init error", error)
      }
    },
    [isMainnet, disbaledVm, projectInfo],
  )

  useEffect(() => {
    let timer = setTimeout(() => {
      init()
    }, 200)
    return () => {
      clearTimeout(timer)
    }
  }, [init, isMainnet, disbaledVm, projectInfo])


  return (
    <BridgeInfoContext.Provider value={{ isTelegram: hostEnvironment === HOSTtENVIRONMENT.TELEGRAM, hostEnvironment, isMainnet: isMainnet ?? true, isCustomHeader, orbiterClient, allChains, orbiterExplore, selectChainConfig, LogEvent, reportTx, orbiterFeeEstimator }}>
      {children}
    </BridgeInfoContext.Provider>
  )
})
