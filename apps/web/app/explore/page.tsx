"use client"

import dynamic from 'next/dynamic'


const ExplorePage = dynamic(
  () => import('./ExplorePage'),
  { ssr: false }
)


export default function Explore() {

  return <ExplorePage />

}