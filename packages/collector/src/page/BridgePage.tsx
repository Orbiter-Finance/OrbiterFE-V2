import React, { createContext, useCallback, useContext, useEffect } from 'react'
import { Page } from './Page'
import { atom, useAtom } from 'jotai'

import { Endpoint, ExploreLinkProvider } from '@orbiter-finance/explore-link'
import { ENDPOINT, OrbiterClient, RouterType } from '@orbiter-finance/bridge-sdk'
import { orbiterExploreAtom, orbiterClientAtom, orbiterFeeEstimatorAtom } from '../stores'
import { FeeEstimator } from '@orbiter-finance/blockchain-gas'

export interface CollectorState {
    isMainnet: boolean
    orbiterClient: OrbiterClient | null
    orbiterExplore: ExploreLinkProvider | null
    orbiterFeeEstimator: FeeEstimator | null
}

export const CollectorContext = createContext<CollectorState>({} as CollectorState)
export const useCollectorContext = () => {
    return useContext(CollectorContext)
}

export function BridgePage({ isMainnet }: { isMainnet: boolean }) {
    const [orbiterExplore, setOrbiterExplore] = useAtom(orbiterExploreAtom)
    const [orbiterClient, setOrbiterClient] = useAtom(orbiterClientAtom)
    const [orbiterFeeEstimator, setOrbiterFeeEstimator] = useAtom(orbiterFeeEstimatorAtom)

    const init = useCallback(async () => {
        try {
            const isMain = isMainnet ?? true

            const orbiter = await OrbiterClient.create({
                apiEndpoint: isMain ? ENDPOINT.MAINNET : ENDPOINT.TESTNET,
                defaultRouterType: RouterType.EOA,
            })
            console.log('orbiter', orbiter)
            const exploreLink = new ExploreLinkProvider(
                isMain ? Endpoint.mainnet : Endpoint.testnet,
            )

            console.log('exploreLink', exploreLink)
            const feeEstimator = new FeeEstimator(exploreLink)
            setOrbiterFeeEstimator(feeEstimator)
            setOrbiterExplore(exploreLink)
            setOrbiterClient(orbiter)
        } catch (error) {
            console.log('orbiter init error', error)
        }
    }, [isMainnet])

    useEffect(() => {
        // let timer = setTimeout(() => {
        //     init()
        // }, 200)
        // return () => {
        //     clearTimeout(timer)
        // }
        init()
    }, [init, isMainnet])

    return (
        <div className="w-full">
            <CollectorContext.Provider
                value={{
                    isMainnet: isMainnet ?? true,
                    orbiterExplore,
                    orbiterClient,
                    orbiterFeeEstimator,
                }}
            >
                <Page />
            </CollectorContext.Provider>
        </div>
    )
}
