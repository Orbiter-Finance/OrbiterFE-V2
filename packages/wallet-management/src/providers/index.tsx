"use client"
import React, { ReactNode } from 'react'
import { WalletConnectProvider } from './WalletConnectProvider'
import { WalletConnectModal } from './WalletConnectModal'
import { StarknetProvider } from './starknet-provider'
import { SolanaProvider } from './solana-provider'
import { TonProviders } from './ton-providers'
import { TronProvider } from './tron-provider'
import { WalletProviderConfigType } from '../types'
import { EvmProvider } from './evm-providers'
import { SuiProvider } from './sui-providers'
import { FuelsProvider } from './fuels-provider'
import { WalletConfigProvider } from './WalletConfigProvider'
import { Endpoint, ExploreLinkProvider } from '@orbiter-finance/explore-link'

export interface WalletProvidesType {
    children: ReactNode
    config: WalletProviderConfigType
}

export const WalletProvides = React.memo(({ children, config }: WalletProvidesType) => {
    const isMain = config?.isMainnet ?? true;
    const exploreLink = new ExploreLinkProvider(
        isMain ? Endpoint.mainnet : Endpoint.testnet
    );
    return (
        <WalletConfigProvider config={config} exploreLink={exploreLink}>
            <EvmProvider exploreLink={exploreLink} hostEnvironment={config.hostEnvironment} >
                <SuiProvider isMainnet={config?.isMainnet}>
                    <FuelsProvider exploreLink={exploreLink}>
                        <StarknetProvider>
                            <SolanaProvider>
                                <TronProvider>
                                    <TonProviders>
                                        <WalletConnectProvider >
                                            {children}
                                            <WalletConnectModal />
                                        </WalletConnectProvider >
                                    </TonProviders>
                                </TronProvider>
                            </SolanaProvider>
                        </StarknetProvider>
                    </FuelsProvider>
                </SuiProvider>
            </EvmProvider>
        </WalletConfigProvider>
    )
})
