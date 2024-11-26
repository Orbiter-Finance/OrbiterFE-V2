"use client";

import React from "react";
import { OrbiterWagmiProvider } from "@orbiter-finance/wallet-kit";
import { Endpoint, ExploreLinkProvider } from "@orbiter-finance/explore-link";
const exploreLink = new ExploreLinkProvider(Endpoint.mainnet);
export async function Providers({ children }: { children: React.ReactNode }) {
  const loadChains = await exploreLink.getChainsListAsync();
  const chainsConfig = loadChains
  .filter(({ vm }) => vm === "EVM")
  .map(({ chainId, name, nativeCurrency, rpc, explorers }) => ({
    id: Number(chainId),
    name,
    hasIcon: false,
    nativeCurrency: {
      name: nativeCurrency.name,
      symbol: nativeCurrency.symbol,
      decimals: nativeCurrency.decimals,
    },
    rpcUrls: {
      default: { http: rpc },
    },
    blockExplorers: {
      default: {
        name: explorers?.[0]?.name || "Explorer",
        url: explorers?.[0]?.url || "",
      },
    },
  }));
  return (
    <OrbiterWagmiProvider chains={chainsConfig}>
      {children}
    </OrbiterWagmiProvider>
  );
}
