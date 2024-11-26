'use client'
import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FuelProvider } from '@fuels/react'
import {
    createConfig,
    defaultConnectors,
    FueletWalletConnector,
    FuelWalletConnector,
} from '@fuels/connectors'
import { CHAIN_IDS, Provider } from 'fuels'
import { getConfig } from './wagmi'
const queryClient = new QueryClient()
import { HOSTtENVIRONMENT } from '../constant'
import ExploreLinkProvider from '@orbiter-finance/explore-link';
export const FuelsProvider = React.memo(({ children,  exploreLink }: { children: ReactNode, exploreLink: ExploreLinkProvider }) => {
    const projectId = '8fc242da4554c002fc3857298ffaefd6' as string
    const hostEnvironmenth = HOSTtENVIRONMENT.DAPP
    const NETWORKS = [
        {
            chainId: CHAIN_IDS.fuel.mainnet,
            url: 'https://mainnet.fuel.network/v1/graphql',
        },
        {
            chainId: CHAIN_IDS.fuel.testnet,
            url: 'https://testnet.fuel.network/v1/graphql',
        },
    ]

    const FUEL_CONFIG = createConfig(() => {
        return {
            connectors: defaultConnectors({
                devMode: true,
                wcProjectId: projectId,
                ethWagmiConfig: getConfig(exploreLink, hostEnvironmenth, projectId) as any,
                chainId: NETWORKS[0]?.chainId,
                fuelProvider: Provider.create(NETWORKS[0]?.url || ''),
            }),
        }
    })

    return (
        <QueryClientProvider client={queryClient}>
            <FuelProvider uiConfig={{suggestBridge: false}} fuelConfig={FUEL_CONFIG} networks={NETWORKS}>
                <>{children}</>
            </FuelProvider>
        </QueryClientProvider>
    )
})
