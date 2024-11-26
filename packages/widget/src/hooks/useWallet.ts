import React from 'react'

import { useOrbiterGetChainsConfig } from '../bridgeInfo/hooks/useOrbiterGetChainsConfig.js'
import { useWallets, WalletType, VM } from '@orbiter-finance/wallet-management'

export function useWallet() {
    const walletList = useWallets()
    const { getChainsConfig } = useOrbiterGetChainsConfig()

    const getWallet = React.useCallback(
        (chainId: string) => {
            const conifg = getChainsConfig(chainId)
            const vm = conifg?.vm

            if (!vm) {
                return null
            } else {
                const wallet = walletList?.filter((item: WalletType) => {
                    return item.vm?.includes(vm as unknown as VM)
                })?.[0]
                return wallet
            }

        },
        [walletList, getChainsConfig],
    )

    return ({
        walletList,
        getWallet
    })
}
