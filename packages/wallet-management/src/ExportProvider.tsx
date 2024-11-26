import React, { ReactNode } from 'react'
import { WalletProvides } from './providers'
import { HOSTtENVIRONMENT } from './constant'
import { WalletTotasType } from './types';

export default function ExportProvider({children, isMainnet, totas}: {children: ReactNode, isMainnet: boolean} & WalletTotasType) {
  return (
    <WalletProvides
    config={{
        isMainnet,
        hostEnvironment: HOSTtENVIRONMENT.DAPP,
        ton: {
            rpc: isMainnet ? "https://toncenter.com/api/v2/jsonRPC" : "https://testnet.toncenter.com/api/v2/jsonRPC",
            key: "d843619b379084d133f061606beecbf72ae2bf60e0622e808f2a3f631673599b"
        },
        totas
    }}
    >
        {children}
    </WalletProvides>
  )
}
