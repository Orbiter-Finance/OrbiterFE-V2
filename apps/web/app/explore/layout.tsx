import React, { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className='w-full h-full'>
      {children}
    </div>
  )
}
