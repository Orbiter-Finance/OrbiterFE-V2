"use client"

import React, { ReactNode } from 'react';

import {
    StarknetConfig,
    publicProvider,
    argent,
    braavos,
    useInjectedConnectors,
} from "@starknet-react/core";
import { mainnet, sepolia } from '@starknet-react/chains';

export const StarknetProvider = React.memo(({ children }: { children: ReactNode; }) => {

    const chains = [mainnet, sepolia];
    const provider = publicProvider();
    const { connectors } = useInjectedConnectors({
        // OrbiterShow these connectors if the user has no connector installed.
        recommended: [argent(), braavos()],
        // Hide recommended connectors if the user has any connector installed.
        includeRecommended: "onlyIfNoConnectors",
        // Randomize the order of the connectors.
        order: "random",
      });

    return (
        <StarknetConfig autoConnect chains={chains} provider={provider} connectors={connectors}>
            {children}
        </StarknetConfig>
    );
})
