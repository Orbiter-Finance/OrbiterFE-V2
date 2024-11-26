import { useAtom, useSetAtom } from 'jotai'
import React, { useCallback } from 'react'
import { BalanceItemType, bridgeBalanceDataGroupAtom } from '../stores/bridge'

interface UpdateBalanceItemType {
    chainId: string,
    symbol: string,
    walletAddress: string
    balance: string
    pending?: boolean
}


interface UpdateBalanceParamsType {
    chainId: string,
    token: string,
    walletAddress: string,
    bridgeList: UpdateBalanceItemType[]
}


export default function useDisPatchBalance() {

    const [bridgeBalanceDataGroup, setBridgeBalanceDataGroup] = useAtom(bridgeBalanceDataGroupAtom)

    const updateBalance = useCallback(
        (params: UpdateBalanceParamsType) => {

            let list = bridgeBalanceDataGroup.bridgeBalanceList

            const dataList = params.bridgeList

            dataList.forEach((item) => {
                const flag = list.some((option) => {
                    return option.chainId === item.chainId
                })
                if (!flag) {
                    list = list.concat([{
                        chainId: item.chainId,
                        tokenList: [{
                            symbol: item.symbol,
                            walletList: [{
                                balance: item.balance,
                                userAddress: item.walletAddress,
                                pending: item.pending
                            }]
                        }]
                    }])
                }
            })

            const bridgeList = list.map((item) => {
                const group = dataList.filter((option) => option.chainId === item.chainId)
                let tokenList = item.tokenList
                group.forEach((option) => {
                    const flag = tokenList.some((token) => {
                        return option.symbol === token.symbol
                    })
                    if (!flag) {
                        tokenList = tokenList.concat([{
                            symbol: option.symbol,
                            walletList: [{
                                balance: option.balance,
                                userAddress: option.walletAddress,
                                pending: option.pending
                            }]
                        }])
                    } else {
                        tokenList = tokenList.map((token) => {
                            const flag = token.walletList.some((wallet) => wallet.userAddress === option.walletAddress)
                            const data = ({
                                ...token,
                                walletList: flag ? token.walletList.map((wallet) => {
                                    return wallet?.userAddress === option.walletAddress ? ({
                                        balance: option.balance,
                                        userAddress: option.walletAddress,
                                        pending: option.pending
                                    }) : wallet
                                }) : (
                                    [...(token.walletList || []), {
                                        balance: option.balance,
                                        userAddress: option.walletAddress,
                                        pending: option.pending
                                    }]
                                )
                            })

                            return token.symbol === option.symbol ? data : token
                        })
                    }
                })
                return ({
                    ...item,
                    tokenList
                })
            })

            setBridgeBalanceDataGroup(({
                refreshTime: +new Date(),
                walletAddress: params.walletAddress,
                bridgeBalanceList: bridgeList,
                chainId: params.chainId,
                token: params.token
            }))
        },
        [bridgeBalanceDataGroup],
    )



    return ({
        updateBalance
    })
}
