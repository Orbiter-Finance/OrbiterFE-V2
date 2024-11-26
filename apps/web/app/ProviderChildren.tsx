"use client"
import { OrbiterShow } from '@orbiter-finance/ui'
import React, { ReactNode } from 'react'
import Header from '../components/Header'

export const ProviderChildren = React.memo(({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-[100vh] h-[100vh] w-[100vw] flex justify-start items-start flex-col">
      <Header />
      <section className='w-full flex-1 max-h-full overflow-auto'>
        {children}
      </section>
    </main>
  )
})
