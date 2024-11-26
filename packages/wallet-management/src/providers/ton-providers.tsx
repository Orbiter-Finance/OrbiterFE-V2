"use client"
import React, { ReactNode } from 'react';
import { TonConnectUIProvider } from "@tonconnect/ui-react"


export const TonProviders = React.memo(({ children }: { children: ReactNode; }) => {
  let url = ""
  if (typeof window !== "undefined") {
    url = new URL((window as any).location?.href)?.origin || ""
  }
  return (
    <TonConnectUIProvider
      manifestUrl={`${url}/tonconnect-manifest.json`}
    >
        {children}
    </TonConnectUIProvider>
  )
})
