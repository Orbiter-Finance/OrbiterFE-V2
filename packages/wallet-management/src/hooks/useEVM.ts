'use client'
import React, { useMemo } from 'react'
import { WalletType } from '../types'
import { VM } from '../constant'
import { balanceEnCode } from '../utils/combiRaw'
import { useEthersSigner } from '../hlepers/ethersToViem6/ethers6'
import {
    useAccount,
    useChains,
    useClient,
    useDisconnect,
    useSendTransaction,
    useSwitchChain,
} from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { JsonRpcProvider } from 'ethers6'
import { waitForTransactionReceipt } from 'viem/actions'
import useLoopring from '../hlepers/loopring/useLoopring.js'
import useZksyncLite from '../hlepers/zksyncLite/useZksyncLite'
import useImx from '../hlepers/imx/useImx'

export function useEVM(): WalletType {
    const { disconnectAsync } = useDisconnect()

    const { sendTransactionAsync } = useSendTransaction()
    const { loopringTransfer } = useLoopring()
    const { zksyncLiteTransfer } = useZksyncLite()
    const { imxTransfer } = useImx()

    const { address, connector, chain, chainId } = useAccount()
    const client = useClient({ chainId })

    const chains = useChains()
    const signer = useEthersSigner()

    const { openConnectModal } = useConnectModal()
    const { switchChainAsync } = useSwitchChain()

    const connect = async () => {
        openConnectModal && openConnectModal()
    }

    const checkChain = (chainid: string) => {
        return String(chainId || '') === chainid
    }

    const switchChain = async (chain: string) => {
        await switchChainAsync({
            chainId: Number(chain),
        })
    }

    const getBalance = async (
        {
            chainId,
            token,
            user,
            isMainnet,
        }: { chainId: string; token: string; user: string; isMainnet?: boolean },
        rpcList?: string[],
    ) => {
        const chainInfo = chains.filter((item) => {
            return String(item.id) === chainId
        })[0]
        const rpcL = (rpcList ? rpcList : chainInfo?.rpcUrls.default.http) || []
        if (!rpcL?.length) return '0'
        try {
            const provider = new JsonRpcProvider(
                rpcL?.[0] || '',
                {
                    name: chainInfo?.name || '',
                    chainId: Number(chainId),
                },
                {
                    staticNetwork: true,
                },
            )

            if (isMainnet) {
                const res = await provider.getBalance(user)

                return res.toString()
            } else {
                const raw = balanceEnCode([user])
                const res = await provider.call({
                    data: raw,
                    to: token,
                })
                return res.toString()
            }
        } catch (error) {
            return getBalance({ chainId, token, user, isMainnet }, rpcL.slice(1))
        }
    }

    const vm = [VM.EVM, VM.IMXVM, VM.LPRVM, VM.ZKSPVM, VM.ZKLITEVM]

    const checkAddress = (address: string) => {
        const ETH_ADDRESS = new RegExp('^(0x)?[0-9a-fA-F]{40}$')
        return ETH_ADDRESS && ETH_ADDRESS.test(address)
    }

    const transfer = async ({ params, allowance, approve, isMainnet, value, vm, ...rest }: any) => {
        if (vm === VM.LPRVM) {
            const res = await loopringTransfer({
                fromAddress: address,
                params,
                allowance,
                approve,
                isMainnet,
                value,
                vm,
                ...rest,
            })
            console.log('res', res)
            return res
        } else if (vm === VM.IMXVM) {
            const res = await imxTransfer({
                fromAddress: address,
                params,
                allowance,
                approve,
                isMainnet,
                value,
                vm,
                ...rest,
            })
            console.log('imx res', res)
            return res
        } else if (vm === VM.ZKLITEVM) {
            const res = await zksyncLiteTransfer({
                fromAddress: address,
                params,
                allowance,
                approve,
                isMainnet,
                value,
                vm,
                ...rest,
            })
            return res
        }
        if (!isMainnet && client && signer && allowance && approve) {
            const allowanceAmount = await signer.call(allowance)

            if (Number(value) > Number(allowanceAmount)) {
                const hash = await sendTransactionAsync(approve.raw)

                await waitForTransactionReceipt(client as any, {
                    hash,
                })
            }

            const res = await sendTransactionAsync(params)
            return res
        } else {
            const res = await sendTransactionAsync(params)
            return res as string
        }
    }

    const emitGas = async () => {
        return ''
    }

    return useMemo(
        () => ({
            address: (address || '')?.toLocaleLowerCase() as string,
            chainId: String(chainId || ''),
            chainName: chain?.name || '',
            vm,
            switchChain,
            getBalance,
            connect,
            checkAddress,
            transfer,
            walletId: connector?.id || '',
            walletName: connector?.name || '',
            walletIcon: connector?.icon || '',
            disConnectAsync: disconnectAsync,
            isMainnet: true,
            emitGas,
            type: 'EVM',
            checkChain,
            defaultChain: '1',
        }),
        [
            address,
            chainId,
            chain,
            vm,
            connector,
            switchChain,
            getBalance,
            connect,
            checkAddress,
            transfer,
            emitGas,
            checkChain,
        ],
    )
}
