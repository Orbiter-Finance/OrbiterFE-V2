
"use client"

import dynamic from 'next/dynamic'


const PrizesPage = dynamic(
  () => import('./PrizesPage'),
  { ssr: false }
)


export default function Przies() {

  return <PrizesPage />

}