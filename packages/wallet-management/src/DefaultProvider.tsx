import React, { ReactNode } from 'react'
import ExportProvider from './ExportProvider'

export function DefaultProvider({children}: {children: ReactNode}) {
  return (
    <ExportProvider isMainnet>
        {children}
    </ExportProvider>
  )
}

export function TestProvider({children}: {children: ReactNode}) {
    return (
      <ExportProvider isMainnet={false}>
          {children}
      </ExportProvider>
    )
  }