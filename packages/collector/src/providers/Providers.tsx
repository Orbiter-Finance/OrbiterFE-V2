import React, { createContext, ReactNode, useCallback, useContext, useEffect } from 'react'
import { WalletProvides } from '@orbiter-finance/wallet-management'
import { atom, Provider as JotaiProvider, useAtom } from 'jotai'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()



export function Providers({ children, config }: { children: ReactNode; config: any }) {

    return (
        <QueryClientProvider client={queryClient}>
            <JotaiProvider>
                <WalletProvides
                    config={{
                        isMainnet: config?.isMainnet,
                        disbaledVm: config?.disbaledVm,
                        ton: config?.ton,
                        hostEnvironment: config?.hostEnvironment,
                    }}
                >
                    {children}
                </WalletProvides>
            </JotaiProvider>
        </QueryClientProvider>
    )
}
