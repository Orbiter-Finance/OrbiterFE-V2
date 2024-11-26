import React, { createContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { getConfig } from "./wagmi";

const queryClient = new QueryClient();
export const OrbiterWagmiContext = createContext<undefined>(undefined);

export const OrbiterWagmiProvider = ({
  children,
  chains
}: {
  children: React.ReactNode,
  chains: any;
}) => {
  const chainsConfig = getConfig(chains);
  return (
    <OrbiterWagmiContext.Provider value={undefined}>
      <WagmiProvider config={chainsConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </OrbiterWagmiContext.Provider>
  );
};
