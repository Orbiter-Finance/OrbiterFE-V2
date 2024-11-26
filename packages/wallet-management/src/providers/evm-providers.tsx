"use client";
import React, { ReactNode } from "react";

import {
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet } from "viem/chains";
import type { Chain } from "@rainbow-me/rainbowkit";
import { HOSTtENVIRONMENT } from "../constant";
import { getConfig } from "./wagmi"
import ExploreLinkProvider from "@orbiter-finance/explore-link"
const projectId = "8fc242da4554c002fc3857298ffaefd6" as string;
const queryClient = new QueryClient();
export const EvmProvider = React.memo(({ children, exploreLink, hostEnvironment }: {
  children: ReactNode,
  hostEnvironment?: HOSTtENVIRONMENT;
  exploreLink: ExploreLinkProvider
}) => {
  const hostEnvironmenth = hostEnvironment || HOSTtENVIRONMENT.DAPP;

  return (
    <WagmiProvider reconnectOnMount={true} config={getConfig(exploreLink, hostEnvironmenth, projectId)}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale="en-US"
          initialChain={mainnet as Chain}
          showRecentTransactions={true}
          theme={darkTheme()}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
});