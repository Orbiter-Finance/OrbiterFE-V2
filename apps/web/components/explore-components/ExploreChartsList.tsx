"use client"

import React from 'react'
import ExploreCharts from './ExploreCharts'
import ExploreUserChart from './ExploreUserChart'

export default function ExploreChartsList() {
  return (
    <div className='w-full'>
      <ExploreCharts
        title="Tx Statistics"
        viceTitle="Data source: Orbiter Finance Bridge & Vizing"
        chartKey="tx"
        dataKey="txs"
        label="Total Tx:"
        isToggle
      />
      <ExploreCharts
        title="Amount (USD) Statistic"
        chartKey="amount"
        dataKey="amount_usd"
        label="Total Amount:"
      />
      <ExploreUserChart />
    </div>
  )
}
