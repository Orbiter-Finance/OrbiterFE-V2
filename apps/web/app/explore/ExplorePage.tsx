"use client"

import React from 'react'
import ExploreNav from '../../components/explore-components/ExploreNav'
import LatestTransactions from '../../components/explore-components/LatestTransactions'
import ExploreChartsList from '../../components/explore-components/ExploreChartsList'
import Footer from '../../components/Footer'

export default function Explore() {
  return (
    <main className="w-full h-full flex justify-between items-start flex-col orbiter-main max-h-full overflow-auto">
      <div className='w-full flex-1 flex justify-start items-center flex-col pb-24'>
        <div className='max-w-[75rem] w-full p-4'>
          <ExploreNav />
          <LatestTransactions />
          <ExploreChartsList />
        </div>
      </div>
      <Footer />
    </main>

  )
}
