"use client"

import React, { createContext, Dispatch, FC, ReactNode, useContext, useState } from 'react'



export interface WalletConnectState {
    walletType: string
    setWalletType: Dispatch<React.SetStateAction<string>>
}

export const WalletConnectContext = createContext<WalletConnectState>(
    {} as WalletConnectState,
)

export const useWalletConnectContext = () => {
    return useContext(WalletConnectContext)
}

export const WalletConnectProvider: FC<{ children: ReactNode }> = React.memo(({
    children,
}) => {

    const [walletType, setWalletType] = useState("")


    return (
        <WalletConnectContext.Provider value={{ walletType, setWalletType }}>
            {children}
        </WalletConnectContext.Provider>
    )
})
