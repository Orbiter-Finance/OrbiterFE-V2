"use client"

import dynamic from 'next/dynamic'
import React from 'react'
import Footer from '../components/Footer'

const BridgePage = dynamic(
  () => import('./BridgePage'),
  { ssr: false }
)

// import TonWeb from "tonweb";

export default function Home() {

  return (
    <main className="w-full h-full flex justify-between items-start flex-col orbiter-main px-3">
      <div className='w-full'><BridgePage /></div>
      <Footer />
    </main>
  )
}
