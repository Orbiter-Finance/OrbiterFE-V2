"use client"

import React from 'react'
import EcosystemList from './EcosystemList'
import BannerList from '../BannerList'
export default function Ecosystem() {

  return (
    <div className='w-full h-full p-4 flex flex-col items-center'>
      <BannerList />
      <EcosystemList />
    </div>
  )
}