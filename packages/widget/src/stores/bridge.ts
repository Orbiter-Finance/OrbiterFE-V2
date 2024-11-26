
import { atom } from "jotai"
import { PAGE_TYPE } from "../constant.js"
import React, { useMemo } from "react"
import { OrbiterClient } from "@orbiter-finance/bridge-sdk"
import ExploreLinkProvider from "@orbiter-finance/explore-link"
import { ChainViewType } from "../bridgeInfo/providers.js"
import { FeeEstimator } from "@orbiter-finance/blockchain-gas"

// providers 

export const orbiterClientAtom = atom<OrbiterClient | null>(null)
export const orbiterExploreAtom = atom<ExploreLinkProvider | null>(null)
export const orbiterExploreInitAtom = atom(false)
export const orbiterFeeEstimatorAtom = atom<FeeEstimator | null>(null)
export const allChainsAtom = atom<ChainViewType[]>([])

export const pageIsMobileAtom = atom(false)
export const pageTypeAtom = atom(PAGE_TYPE.BRIDGE)
export const pageModaleTypeAtom = atom<PAGE_TYPE | null>(null)

export const selectFromChainAtom = atom("")

export const selectToChainAtom = atom("")

export const selectTokenAtom = atom("ETH")

export const bridgeContext = atom(null)

export const bridgetTransferAmountAtom = atom("")

export const bridgeDataAtom = atom((get) => {
    const selectFromChain = get(selectFromChainAtom)
    const selectToChain = get(selectToChainAtom)
    const selectToken = get(selectTokenAtom)
    // const bridgetTransferAmount = get(bridgetTransferAmountAtom)
    return {
        src_chain: selectFromChain,
        tgt_chain: selectToChain,
        src_token: selectToken,
        // amount: bridgetTransferAmount
    }
})

// user target address
export const bridgeTargetAddressAtom = atom("")
// target address card status
export const showBridgeTargetAddressCardAtom = atom(false)

export interface BridgeTransactionType {
    fromAddress: string
    srcChain: string
    tgtChain: string
    srcToken: string
    tgtToken: string
    sendAmount: string
    receiveAmount: string
    srcTx: string
    targetTx: string
    tgtAddress: string
    status: string
    points: string
    timeStamp: string
}

// user target address
export const bridgeTransactionAtom = atom<BridgeTransactionType>({
    fromAddress: "",
    srcChain: "",
    tgtChain: "",
    srcToken: "",
    tgtToken: "",
    sendAmount: "",
    receiveAmount: "",
    srcTx: "",
    targetTx: "",
    tgtAddress: "",
    status: "",
    points: "",
    timeStamp: ""
})

export const bridgeTransactionRefreshAtom = atom(0)

export const bridgeRouterGasFeeGroupAtom = atom({
    isError: false,
    pending: false,
    value: ""
})


export const pageTypeBackAtom = atom(PAGE_TYPE.BRIDGE)

// user target address
export const questsListAtom = atom<any[]>([])


// user balance
export const bridgeCurrentChainBalanceAtom = atom([
    {
        balance: "0",
        pending: false,
        error: false,
        chainId: ""
    }, {
        balance: "0",
        pending: false,
        error: false,
        chainId: ""

    }])

export interface BalanceItemType {
    chainId: string
    tokenList: Array<{
        symbol: string,
        walletList: Array<{
            userAddress: string,
            balance: string,
            pending?: boolean
        }>
    }>
}
export const bridgeBalanceDataGroupAtom = atom<{
    chainId: string,
    token: string,
    walletAddress: string,
    refreshTime: number,
    bridgeBalanceList: BalanceItemType[]
}>({
    refreshTime: 0,
    chainId: "",
    token: "",
    walletAddress: "",
    bridgeBalanceList: []
})

