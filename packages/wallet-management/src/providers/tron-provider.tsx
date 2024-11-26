"use client";

import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModalProvider } from '@tronweb3/tronwallet-adapter-react-ui';
import type {
    Adapter,
    WalletError
} from '@tronweb3/tronwallet-abstract-adapter';
import {  BitKeepAdapter,
    OkxWalletAdapter,
    TokenPocketAdapter,
    TronLinkAdapter
 } from "@tronweb3/tronwallet-adapters"
export const TronProvider = React.memo(({ children }: { children: ReactNode; }) => {
    // const [adapters, setAdapters] = useState<Adapter[]>([]);

    const onError = 
        (e: WalletError) => {
            console.log("e", e);
        }

    // useEffect(() => {
    //     import('@tronweb3/tronwallet-adapters').then((res) => {
    //         const {
    //             BitKeepAdapter,
    //             OkxWalletAdapter,
    //             TokenPocketAdapter,
    //             TronLinkAdapter,
    //             WalletConnectAdapter
    //         } = res;
    //             const tronLinkAdapter = new TronLinkAdapter();
    //         const walletConnectAdapter = new WalletConnectAdapter({
    //             network: 'Nile',
    //             options: {
    //                 relayUrl: 'wss://relay.walletconnect.com',
    //                 // example WC app project ID
    //                 projectId: '5fc507d8fc7ae913fff0b8071c7df231',
    //                 metadata: {
    //                     name: 'Test DApp',
    //                     description: 'JustLend WalletConnect',
    //                     url: 'https://your-dapp-url.org/',
    //                     icons: ['https://your-dapp-url.org/mainLogo.svg'],
    //                 },
    //             },
    //             web3ModalConfig: {
    //                 themeMode: 'dark',
    //                 themeVariables: {
    //                     '--wcm-z-index': '1000',
    //                 },
    //             },
    //         });
    //         const bitKeepAdapter = new BitKeepAdapter();
    //         const tokenPocketAdapter = new TokenPocketAdapter();
    //         const okxwalletAdapter = new OkxWalletAdapter();
    //         setAdapters([tronLinkAdapter, bitKeepAdapter, tokenPocketAdapter, okxwalletAdapter, walletConnectAdapter])
    //     });
    // }, [setAdapters])

    return (
        <WalletProvider adapters={[
            new BitKeepAdapter(),
    new OkxWalletAdapter(),
    new TokenPocketAdapter(),
    new TronLinkAdapter()
        ]} onError={onError}>
            <WalletModalProvider>
                {children}
            </WalletModalProvider>
        </WalletProvider>
    );
})
