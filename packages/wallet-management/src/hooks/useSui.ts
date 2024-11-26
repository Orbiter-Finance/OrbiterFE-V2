import React, { useContext } from "react"
import { useSuiClient, useWallet } from "@suiet/wallet-kit"
import { WalletType } from "../types"
import { useWalletConnectContext } from "../providers/WalletConnectProvider"

import { Transaction } from '@mysten/sui/transactions'
import { CoinStruct } from '@mysten/sui/dist/cjs/client'
import { VM } from "../constant"
import { SUI_WALLET_TYPE } from "../hlepers/sui-wallet/ui"

export function useSui(): WalletType {
    const wallet = useWallet()
    const client = useSuiClient()
    const { setWalletType } = useWalletConnectContext()
    const { adapter, name, address } = wallet || {}

    const connect = async () => {
        setWalletType(SUI_WALLET_TYPE)
    }

    const disConnectAsync = async () => {
        await wallet.disconnect()
    }

    const switchChain = async () => {}

    const checkChain = (chainId: string) => {
        return true
    }

    const checkAddress = (address: string) => {
        if (!address || address.indexOf('0x') === -1 || address.length !== 66) {
            return false
        }
        return true
    }

    const getBalance = async ({
        chainId,
        token,
        user,
        isMainnet,
        isNativeCurrency,
    }: {
        chainId: string
        token: string
        user: string
        isMainnet?: boolean
        isNativeCurrency?: boolean
    }) => {
        let balanceResult
        if (isNativeCurrency) {
            balanceResult = await client.getBalance({
                owner: user,
            })
        } else {
            balanceResult = await client.getBalance({
                owner: user,
                coinType: token,
            })
        }
        return balanceResult?.totalBalance
    }

    const transfer = async ({params, isMainnet, makerAddress, value, contractAddress, token}: any) => {
        const tokenAddress = token.address
        if(!address) return ""
        const tx = new Transaction()
        if (isMainnet) {
            const [coin] = tx.splitCoins(tx.gas, [value])
            coin && tx.transferObjects([coin], makerAddress)
        } else {
            const { data: coins } = await client.getCoins({
                owner: address,
                coinType: tokenAddress,
            })
            const [coin] = coins.splice(0, 1)
            if (coins.length) {
                tx.mergeCoins(
                    coin!.coinObjectId,
                    coins.map((item: CoinStruct) => item.coinObjectId),
                )
            }
            const [splitCoin] = tx.splitCoins(coin!.coinObjectId, [String(value)])
            tx.transferObjects([splitCoin!], makerAddress)
        }

        tx.moveCall({
            target: `${contractAddress}::OrbiterRouter::memo`,
            arguments: [ tx.pure.string(params)],
        })

        const res = await wallet.signAndExecuteTransaction({
            transaction: tx,
        })
        console.log('tx', res?.digest)
        return res?.digest
    }

    const emitGas = async () => {
        return ''
    }

    return {
        address: address || '',
        chainId: wallet.chain?.id || '',
        chainName: wallet.chain?.name || '',
        vm: [VM.SUI],
        switchChain,
        getBalance,
        connect,
        checkAddress,
        transfer,
        walletId: name || '',
        walletName: name || '',
        walletIcon: adapter?.icon || '',
        disConnectAsync,
        isMainnet: false,
        emitGas,
        type: SUI_WALLET_TYPE,
        checkChain,
        defaultChain: "SUI_MAIN"
    }
}