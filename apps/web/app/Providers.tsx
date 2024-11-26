"use client"

import dynamic from 'next/dynamic'
import React, { ReactNode } from 'react'


const LayoutProvider = dynamic(
  () => import('../components/LayoutProvider'),
  { ssr: false }
)
const PageModalGroup = dynamic(
  () => import('../components/PageModalGroup'),
  { ssr: false }
)



function Providers({ children }: { children: ReactNode }) {
  console.log("Providers")
  return <LayoutProvider >
    {children}
    <PageModalGroup />
  </LayoutProvider>
}

export default React.memo(Providers)