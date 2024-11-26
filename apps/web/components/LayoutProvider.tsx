'use client'

import { HOSTtENVIRONMENT, Provider } from '@orbiter-finance/widget'
import React, { useEffect, useState } from 'react'
import { useSetAtom } from 'jotai'
import AtomCom from '../components/AtomCom'
import { sendGTMEvent } from '@next/third-parties/google'
import { OrbiterShow } from '@orbiter-finance/ui'
import { HOST_ENV_MAINNET } from '../app/constant'
import { ProviderChildren } from '../app/ProviderChildren'
import { bridgeToastInfoAtom } from '../stores/bridge'
export default function LayoutProvider({ children }) {
    const config: any = JSON.parse(process.env.NEXT_PUBLIC_INIT_BRIDGE || JSON.stringify({}))
    const setBridgeToastInfo = useSetAtom(bridgeToastInfoAtom)
    
    const [status, setStatus] = useState(false)

    useEffect(() => {
        setStatus(true)
    }, [])
    return (
        <OrbiterShow when={status}>
            <Provider
                config={{
                    isMainnet: HOST_ENV_MAINNET,
                    hostEnvironment: HOSTtENVIRONMENT.DAPP,
                    initialData: {
                        fromChain: config?.FROM_CHAIN,
                        token: config?.SYMBOL,
                        toChain: config?.TO_CHAIN,
                    },
                    projectInfo: {
                        channelId: config?.BRIDGE_CHANNELID,
                    },
                    isCustomHeader: true,
                    LogEvent: (method: string, params: string) => {
                        sendGTMEvent({
                            event: method,
                            value: params,
                        })
                    },
                    ton: {
                        rpc: HOST_ENV_MAINNET
                            ? 'https://toncenter.com/api/v2/jsonRPC'
                            : 'https://testnet.toncenter.com/api/v2/jsonRPC',
                        key: 'd843619b379084d133f061606beecbf72ae2bf60e0622e808f2a3f631673599b',
                    },
                    selectChainConfig: JSON.parse(
                        process.env.NEXT_PUBLIC_INIT_BRIDGE_CHAIN_GROUP || JSON.stringify([]),
                    ),
                    totas: {
                        sucess: (parmas) =>{
                            const time = +new Date()
                            setBridgeToastInfo({
                                data: parmas,
                                type: "success",
                                time
                            })
                        },
                        warn: (parmas) =>{
                            const time = +new Date()
                            setBridgeToastInfo({
                                data: parmas,
                                type: "warn",
                                time
                            })
                        },
                        error: (parmas) =>{
                            const time = +new Date()
                            setBridgeToastInfo({
                                data: parmas,
                                type: "error",
                                time
                            })
                        },
                        info: (parmas) =>{
                            const time = +new Date()
                            setBridgeToastInfo({
                                data: parmas,
                                type: "info",
                                time
                            })
                        },
                    }
                }}
            >
                <ProviderChildren>{children}</ProviderChildren>
                <AtomCom />
            </Provider>
        </OrbiterShow>
    )
}
