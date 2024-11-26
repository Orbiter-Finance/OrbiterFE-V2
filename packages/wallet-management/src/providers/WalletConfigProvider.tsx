"use client"

import React, { createContext, FC, ReactNode, useContext } from 'react'
import { WalletProviderConfigType } from '../types'
import ExploreLinkProvider from '@orbiter-finance/explore-link'



export interface WalletConfigState {
    config: WalletProviderConfigType
    exploreLink: ExploreLinkProvider
}

export const WalletConfigContext = createContext<WalletConfigState>(
    {} as WalletConfigState,
)

export const useWalletConfigContext = () => {
    return useContext(WalletConfigContext)
}

export const WalletConfigProvider: FC<{ children: ReactNode; config: WalletProviderConfigType, exploreLink: ExploreLinkProvider }> = React.memo(({
    children,
    config,
    exploreLink
}) => {

    return (
        <WalletConfigContext.Provider value={{ config, exploreLink }}>
            {children}
        </WalletConfigContext.Provider>
    )
})
