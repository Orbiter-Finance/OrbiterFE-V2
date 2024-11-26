'use client'
import React, { ReactNode } from 'react'
import {
    AllDefaultWallets,
    defineStashedWallet,
    SuiMainnetChain,
    SuiTestnetChain,
    WalletProvider,
} from "@suiet/wallet-kit"

export const SuiProvider = React.memo(({ children, isMainnet }: { children: ReactNode, isMainnet?: boolean }) => {
    const isMain = isMainnet ?? true
    return (
        <WalletProvider
            chains={isMain ? [SuiMainnetChain] : [{
                id: "sui:testnet",
                name: "Sui Testnet",
                rpcUrl: "https://wallet-rpc.testnet.sui.io/"
            }]}
            defaultWallets={[
                ...AllDefaultWallets,
                defineStashedWallet({
                    appName: "Suiet Kit Playground",
                }),
            ]}
        >
            {children}
        </WalletProvider>
    )
})
