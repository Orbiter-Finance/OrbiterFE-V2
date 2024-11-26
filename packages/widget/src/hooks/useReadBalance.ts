import { useAtomValue } from 'jotai'
import React, { useCallback } from 'react'
import { bridgeBalanceDataGroupAtom, bridgeCurrentChainBalanceAtom, selectFromChainAtom, selectTokenAtom } from '../stores/bridge'
import { useWallet } from './useWallet'


interface GetBalanceParamsType {
    chainId: string,
    symbol: string,
    walletAddress?: string
}


export default function useReadBalance() {

    const bridgeBalanceDataGroup = useAtomValue(bridgeBalanceDataGroupAtom)
    const bridgeCurrentChainBalance = useAtomValue(bridgeCurrentChainBalanceAtom)
    const { getWallet } = useWallet()
    const selectFromChain = useAtomValue(selectFromChainAtom)
    const selectToken = useAtomValue(selectTokenAtom)

    const readBalance = useCallback(
        ({
            chainId,
            symbol,
            walletAddress
        }: GetBalanceParamsType) => {

            const balanceGroup = bridgeCurrentChainBalance.find((item)=> item.chainId === chainId)

            if (balanceGroup && symbol === selectToken) {
                return balanceGroup?.balance || "0"
            }

            const list = bridgeBalanceDataGroup.bridgeBalanceList


            const userAddress = walletAddress || getWallet(chainId)?.address
            if (!userAddress) return ""

            const group = list.find((item) => {
                return item.chainId === chainId
            })

            const symbolGroup = group?.tokenList.find((item) => {
                return item.symbol === symbol
            })

            const balance = symbolGroup?.walletList.find((item) => {
                return item.userAddress === userAddress
            })

            return balance?.balance

        },
        [bridgeBalanceDataGroup, getWallet, selectFromChain, selectToken],
    )

    return ({
        readBalance,
    })

}
